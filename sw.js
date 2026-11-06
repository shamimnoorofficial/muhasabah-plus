/* Muhasabah service worker — full offline support, push notifications,
 * background sync (journal uploads), periodic sync (reminders while closed) and Windows widgets.
 * Bump VERSION whenever app files change so installed apps update automatically.
 */
const VERSION = "2026-11-06.1";
const CORE = "mhs-core-" + VERSION;
const RUNTIME = "mhs-runtime";
const SHARE = "mhs-share";
const OFFLINE = "/offline.html";
const PRECACHE = [
  "/",
  OFFLINE,
  "/manifest.webmanifest",
  "/pwa/launch.js",
  "/assets/app.js",
  "/assets/app.css",
  "/pwa/startup.js",
  "/pwa/flow.js",
  "/pwa/theme.js",
  "/pwa/premium.css",
  "/pwa/motion.css",
  "/pwa/motion.js",
  "/pwa/insights.js",
  "/pwa/donate.js",
  "/pwa/donate.css",
  "/pwa/pro.js",
  "/pwa/pro.css",
  "/pwa/protools.js",
  "/pwa/onboarding.js",
  "/pwa/onboarding.css",
  "/pwa/home.css",
  "/pwa/actions.css",
  "/pwa/actions.js",
  "/pwa/miniapps.css",
  "/pwa/quran.js",
  "/pwa/hadith.js",
  "/pwa/wisdom.js",
  "/pwa/qibla.js",
  "/pwa/sync.js",
  "/icons/favicon.png",

  "/pwa/bn.js",
  "/pwa/i18n.js",
  "/pwa/polish.css",
  "/i18n/catalog.json",
  "/pwa/penalties.js",
  "/pwa/store.js",
  "/pwa/app.js",
  "/pwa/journal.js",
  "/pwa/install.js",
  "/pwa/titlebar.js",
  "/pwa/chrome.css",
  "/pwa/remind.js",
  "/pwa/prayer.js",
  "/screenshots/promo-wide.svg",
  "/screenshots/promo-narrow.svg",
  "/icons/logo.webp",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/shortcut.png",
  "/widgets/today-template.json",
  "/widgets/today-data.json"
];
const FONT_CSS = "fonts.googleapis.com";
const FONT_FILES = "fonts.gstatic.com";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE).then((cache) =>
      Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" }))))
        .then(() => self.skipWaiting())
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("mhs-core-") && k !== CORE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Tapping a reminder opens (or focuses) the app on the Today tab. */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.action === "journal" ? "/?source=note" : event.action === "today" ? "/?tab=today" :
    (event.notification.data && event.notification.data.url) || "/?tab=today";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (new URL(c.url).origin === self.location.origin && "focus" in c) {
          if (event.action === "journal" && "navigate" in c) return c.navigate(url).then((w) => (w || c).focus());
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data && event.data.type === "STATE_UPDATED") event.waitUntil(updateWidgets());
});

/* ---------- State shared by the app (pwa/remind.js) ---------- */
const STATE = "mhs-state";
async function readState(key) {
  try {
    const res = await (await caches.open(STATE)).match(key);
    return res ? await res.json() : null;
  } catch (e) { return null; }
}
async function writeState(key, value) {
  try { await (await caches.open(STATE)).put(key, new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json" } })); } catch (e) {}
}
function localDay(d) {
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

/* ---------- Push notifications (daily reminder from netlify/functions/push-daily.mts) ---------- */
self.addEventListener("push", (event) => {
  let msg = {};
  try { msg = event.data ? event.data.json() : {}; } catch (e) { msg = { body: event.data ? event.data.text() : "" }; }
  const title = msg.title || "Muhasabah Plus";
  event.waitUntil(self.registration.showNotification(title, {
    body: msg.body || "Time to review today's habits.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-96.png",
    tag: msg.tag || "mhs-push",
    data: { url: msg.url || "/?tab=today&source=push" },
    actions: [{ action: "today", title: "✅ Today" }, { action: "journal", title: "📝 Journal" }]
  }));
});

/* The browser rotated the push subscription: subscribe again and tell the server. */
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil((async () => {
    const prefs = (await readState("/__state/push")) || {};
    if (prefs.on === false) return;
    let sub = event.newSubscription;
    if (!sub) {
      const key = (event.oldSubscription && event.oldSubscription.options && event.oldSubscription.options.applicationServerKey) ||
        (await fetch("/api/push").then((r) => r.json()).then((k) => k.publicKey).catch(() => null));
      if (!key) return;
      sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    }
    if (event.oldSubscription) {
      await fetch("/api/push", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: event.oldSubscription.endpoint }) }).catch(() => {});
    }
    let timezone = "UTC";
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) {}
    await fetch("/api/push", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON(), timezone, hour: prefs.hour, lang: prefs.lang }) });
  })());
});

/* ---------- Background Sync: upload journal entries written offline ---------- */
async function flushJournal() {
  const box = await caches.open("mhs-outbox");
  const res = await box.match("/__outbox/journal");
  if (!res) return;
  const body = await res.text();
  const up = await fetch("/.netlify/functions/journal", { method: "PUT", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body });
  if (!up.ok) throw new Error("journal sync failed"); /* the browser retries later */
  const still = await box.match("/__outbox/journal");
  if (still && (await still.text()) === body) await box.delete("/__outbox/journal");
  const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  list.forEach((c) => c.postMessage({ type: "JOURNAL_SYNCED" }));
}
self.addEventListener("sync", (event) => {
  if (event.tag === "mhs-journal-sync") event.waitUntil(flushJournal());
});

/* ---------- Periodic Background Sync: deadline reminders + fresh app while closed ---------- */
async function deliverReminders() {
  const state = await readState("/__state/today");
  const now = new Date(), day = localDay(now);
  if (!state || !state.on || state.day !== day || !Array.isArray(state.items)) return;
  let sent = (await readState("/__state/sent")) || {};
  if (sent.day !== day) sent = { day, ids: {} };
  const mins = Number(state.mins) || 15, t = now.getTime();
  const due = state.items.filter((h) => h && !sent.ids[h.id] && t < h.dl && t >= h.dl - mins * 60000);
  for (const h of due) {
    sent.ids[h.id] = 1;
    const left = Math.max(1, Math.round((h.dl - t) / 60000));
    await self.registration.showNotification(h.title + " • " + left + " " + (state.left || "min left"), {
      body: h.body || "", tag: "mhs-" + day + "-" + h.id, icon: "/icons/icon-192.png", badge: "/icons/icon-96.png", data: { url: "/?tab=today" }
    });
  }
  if (due.length) await writeState("/__state/sent", sent);
}
async function refreshShell() {
  const cache = await caches.open(CORE);
  await Promise.all(["/", "/assets/app.js", "/assets/app.css", "/manifest.webmanifest"].map((u) =>
    fetch(u, { cache: "no-cache" }).then((r) => (r.ok && !r.redirected ? cache.put(u, r) : null)).catch(() => {})));
}
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "mhs-reminders") event.waitUntil(Promise.all([deliverReminders(), refreshShell(), updateWidgets()]));
});

/* ---------- Windows widgets (manifest "widgets") ---------- */
async function widgetPayload(widget) {
  const def = widget.definition;
  const [template, base] = await Promise.all([
    (await caches.match(def.msAcTemplate) || await fetch(def.msAcTemplate)).text(),
    (await caches.match(def.data) || await fetch(def.data)).json()
  ]);
  const state = await readState("/__state/today");
  const data = Object.assign({}, base);
  if (state && state.day === localDay(new Date())) {
    const pending = (state.items || []).filter((h) => h.dl > Date.now()).sort((a, b) => a.dl - b.dl);
    data.done = state.done; data.total = state.total;
    data.progress = state.total ? state.done + " / " + state.total : base.progress;
    data.balance = (state.balance > 0 ? "+" : "") + state.balance;
    data.next = pending.length ? pending[0].title : base.allDone;
  }
  return { template, data: JSON.stringify(data) };
}
async function updateWidgets() {
  if (!self.widgets || !self.widgets.getByTag) return;
  const widget = await self.widgets.getByTag("mhs-today").catch(() => null);
  if (!widget || !widget.instances || !widget.instances.length) return;
  await self.widgets.updateByTag("mhs-today", await widgetPayload(widget));
}
self.addEventListener("widgetinstall", (event) => {
  event.waitUntil((async () => {
    await self.widgets.updateByInstanceId(event.instanceId, await widgetPayload(event.widget));
    if (self.registration.periodicSync && event.widget.definition.update) {
      await self.registration.periodicSync.register("mhs-reminders", { minInterval: event.widget.definition.update * 1000 }).catch(() => {});
    }
  })());
});
self.addEventListener("widgetresume", (event) => {
  event.waitUntil(widgetPayload(event.widget).then((p) => self.widgets.updateByInstanceId(event.instanceId, p)));
});
self.addEventListener("widgetclick", (event) => {
  const url = event.action === "journal" ? "/?source=note" : event.action === "refresh" ? null : "/?tab=today&source=widget";
  if (!url) { event.waitUntil(updateWidgets()); return; }
  event.waitUntil(self.clients.openWindow(url));
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

/* App shell + app scripts: answer instantly from cache, refresh the cache in the
 * background so the next open gets the latest copy. Network only when not cached yet. */
async function shellFast(request, cacheKey) {
  const cache = await caches.open(CORE);
  const key = cacheKey || request;
  const cached = await cache.match(key, { ignoreSearch: true });
  const network = fetch(request).then((res) => {
    if (res && res.ok && res.type === "basic" && !res.redirected) cache.put(key, res.clone()).catch(() => {});
    return res;
  });
  if (cached) { network.catch(() => {}); return cached; }
  return networkFirst(request, cacheKey, network);
}

/* Online: always fresh. Offline / slow network (> 4s): cached copy. */
async function networkFirst(request, cacheKey, pending, pageOnly) {
  const cache = await caches.open(CORE);
  try {
    const res = await Promise.race([pending || fetch(request), timeout(4000)]);
    if (res && res.ok && res.type === "basic" && !res.redirected) cache.put(cacheKey || request, res.clone()).catch(() => {});
    return res;
  } catch (e) {
    const cached = (await cache.match(cacheKey || request, { ignoreSearch: true })) || (await caches.match(request, { ignoreSearch: true }));
    if (cached) return cached;
    if (request.mode === "navigate") {
      const shell = pageOnly ? null : await cache.match("/");
      if (shell) return shell;
      const offline = await cache.match(OFFLINE);
      if (offline) return offline;
    }
    return Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res && (res.ok || res.type === "opaque")) {
    cache.put(request, res.clone()).catch(() => {});
  }
  return res;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then((res) => {
    if (res && (res.ok || res.type === "opaque")) cache.put(request, res.clone()).catch(() => {});
    return res;
  }).catch(() => cached);
  return cached || network;
}

/* Web Share Target: another app shared a backup file or some text with Muhasabah.
 * Keep the payload in a short-lived cache and open the app, which picks it up (pwa/launch.js). */
async function receiveShare(request) {
  try {
    const form = await request.formData();
    const cache = await caches.open(SHARE);
    await Promise.all([cache.delete("/__share/file"), cache.delete("/__share/text")]);
    const file = form.getAll("backup").find((f) => f && typeof f === "object" && "size" in f && f.size > 0);
    if (file && file.size <= 20 * 1024 * 1024) {
      await cache.put("/__share/file", new Response(file, { headers: { "Content-Type": file.type || "application/octet-stream", "X-File-Name": encodeURIComponent(file.name || "shared.json") } }));
    } else {
      const text = { title: String(form.get("title") || ""), text: String(form.get("text") || ""), url: String(form.get("url") || "") };
      if (text.title || text.text || text.url) await cache.put("/__share/text", new Response(JSON.stringify(text), { headers: { "Content-Type": "application/json" } }));
    }
  } catch (e) {}
  return Response.redirect("/?source=share", 303);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method === "POST" && url.origin === self.location.origin && url.pathname === "/share-target") {
    event.respondWith(receiveShare(request));
    return;
  }
  if (request.method !== "GET") return;

  /* Android Digital Asset Links must always come straight from the server. */
  if (url.origin === self.location.origin && url.pathname.startsWith("/.well-known/")) return;
  /* Legal pages are standalone documents, not app routes. */
  if (url.origin === self.location.origin && url.pathname.startsWith("/legal/")) { event.respondWith(networkFirst(request, undefined, undefined, true)); return; }
  if (request.mode === "navigate" && url.origin === self.location.origin) {
    event.respondWith(shellFast(request, "/"));
    return;
  }
  if (url.hostname === FONT_CSS) { event.respondWith(staleWhileRevalidate(request, RUNTIME)); return; }
  if (url.hostname === FONT_FILES) { event.respondWith(cacheFirst(request, RUNTIME)); return; }
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js" || url.pathname.startsWith("/.netlify/") || url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/icons/")) { event.respondWith(cacheFirst(request, CORE)); return; }
  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/pwa/") || url.pathname === "/manifest.webmanifest") { event.respondWith(shellFast(request)); return; }
  event.respondWith(networkFirst(request));
});
