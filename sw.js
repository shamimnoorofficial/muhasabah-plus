/* Muhasabah service worker — full offline support.
 * Bump VERSION whenever app files change so installed apps update automatically.
 */
const VERSION = "2026-11-05.19";
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
  "/pwa/remind.js",
  "/pwa/prayer.js",
  "/icons/logo.webp",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/shortcut.png"
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
  const url = (event.notification.data && event.notification.data.url) || "/?tab=today";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (new URL(c.url).origin === self.location.origin && "focus" in c) {
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
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
