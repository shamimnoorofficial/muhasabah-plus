/* Muhasabah — deadline reminders (on-device, no server).
 * Prayer-linked habits use the real waqt end (pwa/prayer.js).
 * Sends a notification a chosen number of minutes before each pending task's deadline.
 * Renders the <mhs-remind> settings panel.
 */
(function () {
  "use strict";
  var MHS = window.MHS;
  var CFG = "muhasabah:remind";
  var SENT = "muhasabah:remindSent";
  var DW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MINS = [5, 10, 15, 30, 60];
  var supported = "Notification" in window;

  var T = {
    en: {
      title: "Deadline reminders",
      sub: "Get a notification before a task's deadline, while there is still time to complete it.",
      enable: "Remind me before deadlines",
      before: "How long before",
      min: "min",
      test: "Send test",
      testTitle: "Muhasabah reminders are on",
      testBody: "You'll be notified before each deadline.",
      denied: "Notifications are blocked. Allow them for this site in your browser or phone settings, then turn this on again.",
      unsupported: "This browser doesn't support notifications.",
      ios: "On iPhone/iPad, add the app to the Home Screen first, then open it from there.",
      note: "Reminders work on this device without internet. They arrive while the app is open or running in the background. If the app is fully closed, your phone may not deliver them.",
      left: "min left",
      body: "Mark it done before the deadline to earn +{p}. Otherwise −{p}.",
      pushTitle: "Daily Muhasabah reminder",
      pushSub: "A push notification once a day at the hour you choose — it arrives even when the app is closed.",
      pushEnable: "Send me a daily reminder",
      pushHour: "Time",
      pushTest: "Send test push",
      pushFail: "Could not turn on push reminders. Check your connection and try again.",
      pushUnsupported: "Push notifications aren't supported in this browser."
    },
    ar: {
      title: "تذكير قبل الموعد",
      sub: "إشعار قبل انتهاء موعد المهمة، ما دام هناك وقت لإكمالها.",
      enable: "ذكّرني قبل المواعيد",
      before: "قبل الموعد بـ",
      min: "د",
      test: "إشعار تجريبي",
      testTitle: "تذكيرات محاسبة مفعّلة",
      testBody: "ستصلك إشعارات قبل كل موعد.",
      denied: "الإشعارات محظورة. اسمح بها لهذا الموقع من إعدادات المتصفح أو الهاتف ثم فعّلها مجدداً.",
      unsupported: "هذا المتصفح لا يدعم الإشعارات.",
      ios: "على آيفون/آيباد، أضف التطبيق إلى الشاشة الرئيسية أولاً ثم افتحه من هناك.",
      note: "تعمل التذكيرات على هذا الجهاز دون إنترنت، وتصل عندما يكون التطبيق مفتوحاً أو يعمل في الخلفية. إذا أُغلق التطبيق تماماً فقد لا يرسلها الهاتف.",
      left: "د متبقية",
      body: "أكملها قبل الموعد لتكسب +{p}، وإلا يُخصم −{p}.",
      pushTitle: "تذكير المحاسبة اليومي",
      pushSub: "إشعار مرة واحدة يومياً في الساعة التي تختارها — يصل حتى لو كان التطبيق مغلقاً.",
      pushEnable: "أرسل لي تذكيراً يومياً",
      pushHour: "الوقت",
      pushTest: "إشعار تجريبي",
      pushFail: "تعذّر تفعيل الإشعارات. تحقق من الاتصال وحاول مجدداً.",
      pushUnsupported: "هذا المتصفح لا يدعم إشعارات الدفع."
    }
  };
  if (typeof T !== "undefined" && T.en) T.bn = Object.fromEntries(Object.entries(T.en).map(function (pair) { return [pair[0], window.MHSBengali[pair[1]] || pair[1]]; }));
  function lang() { var c = MHS && MHS.current(); return c && ["en", "ar", "bn"].includes(c.lang) ? c.lang : "en"; }
  Object.assign(T.bn, {"title": "সময়সীমার রিমাইন্ডার", "sub": "কাজ শেষ করার সময় থাকতে সময়সীমার আগে নোটিফিকেশন পান।", "enable": "সময়সীমার আগে মনে করিয়ে দিন", "before": "কতক্ষণ আগে", "min": "মিনিট", "test": "পরীক্ষা করুন", "testTitle": "মুহাসাবার রিমাইন্ডার চালু আছে", "testBody": "প্রতিটি সময়সীমার আগে নোটিফিকেশন পাবেন।", "denied": "নোটিফিকেশন বন্ধ আছে। ব্রাউজার বা ফোনের সেটিংসে এই সাইটের অনুমতি দিন, তারপর আবার চালু করুন।", "unsupported": "এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়।", "ios": "আইফোন বা আইপ্যাডে প্রথমে হোম স্ক্রিনে অ্যাপ যোগ করে সেখান থেকে খুলুন।", "note": "ইন্টারনেট ছাড়াই এই ডিভাইসে রিমাইন্ডার কাজ করে। অ্যাপ খোলা বা পেছনে চালু থাকতে হয়। পুরোপুরি বন্ধ থাকলে ফোন রিমাইন্ডার নাও দেখাতে পারে।", "left": "মিনিট বাকি", "body": "সময়সীমার আগে সম্পন্ন করলে +{p} পয়েন্ট। অন্যথায় −{p}।", "pushTitle": "প্রতিদিনের মুহাসাবা রিমাইন্ডার", "pushSub": "আপনার বেছে নেওয়া সময়ে দিনে একবার পুশ নোটিফিকেশন — অ্যাপ বন্ধ থাকলেও পৌঁছাবে।", "pushEnable": "প্রতিদিন রিমাইন্ডার পাঠান", "pushHour": "সময়", "pushTest": "টেস্ট পুশ পাঠান", "pushFail": "পুশ রিমাইন্ডার চালু করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।", "pushUnsupported": "এই ব্রাউজারে পুশ নোটিফিকেশন সমর্থিত নয়।"});
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k]; }

  function cfg() {
    try { var c = JSON.parse(localStorage.getItem(CFG)); if (c && typeof c === "object") return { on: !!c.on, mins: MINS.indexOf(+c.mins) >= 0 ? +c.mins : 15 }; } catch (e) {}
    return { on: false, mins: 15 };
  }
  function saveCfg(c) { try { localStorage.setItem(CFG, JSON.stringify(c)); } catch (e) {} }

  function dayKey(d) { return MHS ? MHS.dayKey(d) : d.toDateString(); }
  function sentMap(today) {
    var m = {};
    try { m = JSON.parse(localStorage.getItem(SENT)) || {}; } catch (e) {}
    if (m.day !== today) m = { day: today, ids: {} };
    return m;
  }

  function deadlineOf(h, now) {
    var pz = window.MHSPrayer && window.MHSPrayer.dl(h, now);
    if (pz) return pz;
    var p = String(h.deadline || "00:00:00").split(":").map(function (x) { return parseInt(x, 10) || 0; });
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), p[0] || 0, p[1] || 0, p[2] || 0, 0).getTime() +
      Math.max(0, Number(h.grace) || 0) * 60000;
  }

  function show(title, body, tag) {
    var opts = { body: body, tag: tag, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", data: { url: "/?tab=today" }, renotify: false };
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      return navigator.serviceWorker.ready.then(function (reg) { return reg.showNotification(title, opts); })
        .catch(function () { try { new Notification(title, opts); } catch (e) {} });
    }
    try { new Notification(title, opts); } catch (e) {}
    return Promise.resolve();
  }

  function check() {
    var c = cfg();
    if (!c.on || !supported || Notification.permission !== "granted" || !MHS) return;
    var data = MHS.current();
    if (!data || !Array.isArray(data.habits)) return;
    var now = new Date(), nowT = now.getTime(), today = dayKey(now), ds = now.toDateString();
    var ledger = Array.isArray(data.ledger) ? data.ledger : [];
    var todays = ledger.filter(function (x) { return x && new Date(x.ts).toDateString() === ds; });
    if (todays.some(function (x) { return x.type === "excuse" && !x.habitId; })) return;
    var m = sentMap(today), changed = false;
    data.habits.forEach(function (h) {
      if (!h || h.status !== "active") return;
      var rep = h.repeat || [];
      if (!(rep.indexOf(DW[now.getDay()]) >= 0 || rep.indexOf("Everyday") >= 0)) return;
      if (m.ids[h.id]) return;
      if (todays.some(function (x) { return x.habitId === h.id && (x.type === "checkIn" || x.type === "autoPenalty" || x.type === "excuse"); })) return;
      var dl = deadlineOf(h, now);
      if (nowT >= dl || nowT < dl - c.mins * 60000) return;
      var left = Math.max(1, Math.round((dl - nowT) / 60000));
      var pts = Math.abs(Number(h.points) || 0);
      m.ids[h.id] = 1; changed = true;
      show((h.icon ? h.icon + " " : "") + h.title + " • " + left + " " + t("left"),
        t("body").replace(/\{p\}/g, pts), "mhs-" + today + "-" + h.id);
    });
    if (changed) try { localStorage.setItem(SENT, JSON.stringify(m)); } catch (e) {}
  }

  /* ---------- share today's schedule with the service worker ----------
   * sw.js uses it for Periodic Background Sync (reminders while the app is closed)
   * and to fill the Windows widget. Stored in Cache Storage because workers can't read localStorage. */
  var STATE_CACHE = "mhs-state", STATE_KEY = "/__state/today";
  var lastState = "";
  function dueToday(h, now) {
    if (!h || h.status !== "active") return false;
    var rep = h.repeat || [];
    return rep.indexOf(DW[now.getDay()]) >= 0 || rep.indexOf("Everyday") >= 0;
  }
  function publish() {
    if (!MHS || !("caches" in window)) return;
    var data = MHS.current();
    if (!data || !Array.isArray(data.habits)) return;
    var now = new Date(), ds = now.toDateString(), c = cfg();
    var ledger = Array.isArray(data.ledger) ? data.ledger : [];
    var todays = ledger.filter(function (x) { return x && new Date(x.ts).toDateString() === ds; });
    var excused = todays.some(function (x) { return x.type === "excuse" && !x.habitId; });
    var due = data.habits.filter(function (h) { return dueToday(h, now); });
    var done = due.filter(function (h) { return todays.some(function (x) { return x.habitId === h.id && x.type === "checkIn"; }); }).length;
    var items = excused ? [] : due.filter(function (h) {
      return !todays.some(function (x) { return x.habitId === h.id && (x.type === "checkIn" || x.type === "autoPenalty" || x.type === "excuse"); });
    }).map(function (h) {
      var pts = Math.abs(Number(h.points) || 0);
      return { id: h.id, title: (h.icon ? h.icon + " " : "") + h.title, dl: deadlineOf(h, now), body: t("body").replace(/\{p\}/g, pts) };
    });
    var balance = ledger.reduce(function (s, x) { var d = Number(x && x.delta); return isFinite(d) ? s + d : s; }, 0);
    var state = {
      day: dayKey(now), on: c.on && supported && Notification.permission === "granted", mins: c.mins, left: t("left"), lang: lang(),
      items: items, done: done, total: due.length, balance: balance, updatedAt: Date.now()
    };
    var json = JSON.stringify(state);
    if (json.replace(/"updatedAt":\d+/, "") === lastState.replace(/"updatedAt":\d+/, "")) return;
    lastState = json;
    caches.open(STATE_CACHE).then(function (cache) {
      return cache.put(STATE_KEY, new Response(json, { headers: { "Content-Type": "application/json" } }));
    }).then(function () {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: "STATE_UPDATED" });
    }).catch(function () {});
  }

  /* Periodic Background Sync (installed Chromium apps): lets the service worker wake up
   * now and then to deliver reminders and refresh the widget even when the app is closed. */
  function registerPeriodic(on) {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then(function (reg) {
      if (!reg.periodicSync) return;
      if (!on) return reg.periodicSync.unregister("mhs-reminders");
      var q = navigator.permissions && navigator.permissions.query ? navigator.permissions.query({ name: "periodic-background-sync" }) : Promise.resolve({ state: "granted" });
      return q.then(function (st) {
        if (st.state === "granted") return reg.periodicSync.register("mhs-reminders", { minInterval: 15 * 60 * 1000 });
      });
    }).catch(function () {});
  }

  /* ---------- Web Push: daily Muhasabah reminder sent by the server ----------
   * Arrives even when the app and browser are closed. Anonymous: only the push endpoint,
   * timezone, chosen hour and language are stored. */
  var PUSH = "muhasabah:push";
  var pushSupported = supported && "serviceWorker" in navigator && "PushManager" in window;
  function pushCfg() {
    try { var p = JSON.parse(localStorage.getItem(PUSH)); if (p && typeof p === "object") return { on: !!p.on, hour: p.hour >= 0 && p.hour <= 23 ? +p.hour : 21 }; } catch (e) {}
    return { on: false, hour: 21 };
  }
  function savePush(p) {
    try { localStorage.setItem(PUSH, JSON.stringify(p)); } catch (e) {}
    /* sw.js reads this when the browser renews the push subscription. */
    if ("caches" in window) caches.open(STATE_CACHE).then(function (c) {
      return c.put("/__state/push", new Response(JSON.stringify({ on: p.on, hour: p.hour, lang: lang() }), { headers: { "Content-Type": "application/json" } }));
    }).catch(function () {});
  }
  function b64ToBytes(b64) {
    var pad = "=".repeat((4 - (b64.length % 4)) % 4), raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) { return "UTC"; } }
  function pushSubscribe(test) {
    var p = pushCfg();
    return navigator.serviceWorker.ready.then(function (reg) {
      return reg.pushManager.getSubscription().then(function (sub) {
        if (sub) return sub;
        return fetch("/api/push", { cache: "no-store" }).then(function (r) { if (!r.ok) throw Error("key"); return r.json(); })
          .then(function (k) { return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(k.publicKey) }); });
      });
    }).then(function (sub) {
      return fetch("/api/push" + (test ? "?test=1" : ""), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), timezone: tz(), hour: p.hour, lang: lang() })
      }).then(function (r) { if (!r.ok) throw Error("save"); return true; });
    });
  }
  function pushUnsubscribe() {
    return navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (!sub) return;
      var endpoint = sub.endpoint;
      return sub.unsubscribe().catch(function () {}).then(function () {
        return fetch("/api/push", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: endpoint }) });
      });
    }).catch(function () {});
  }
  /* Keep the server copy fresh (language, timezone after travel, renewed subscription). */
  function pushRefresh() {
    var p = pushCfg();
    if (!pushSupported || !p.on || Notification.permission !== "granted" || !navigator.onLine) return;
    var mark = [tz(), p.hour, lang(), dayKey(new Date())].join("|");
    try { if (localStorage.getItem(PUSH + ":sync") === mark) return; } catch (e) {}
    pushSubscribe(false).then(function () { try { localStorage.setItem(PUSH + ":sync", mark); } catch (e) {} }).catch(function () {});
  }

  setInterval(function () { check(); }, 20000);
  setInterval(publish, 60000);
  if (MHS && MHS.onSave) MHS.onSave(publish);
  window.addEventListener("load", function () { setTimeout(function () { publish(); registerPeriodic(cfg().on && supported && Notification.permission === "granted"); pushRefresh(); }, 3500); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") publish(); });
  document.addEventListener("visibilitychange", check);
  if (MHS && MHS.onSave) MHS.onSave(check);
  window.addEventListener("load", function () { setTimeout(check, 3000); });

  /* ---------- <mhs-remind> settings panel ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "on") Object.keys(attrs.on).forEach(function (ev) { n.addEventListener(ev, attrs.on[ev]); });
      else if (k === "text") n.textContent = attrs.text;
      else if (k === "checked") n.checked = !!attrs.checked;
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function standalone() { try { var m = window.matchMedia; if (m && (m("(display-mode: standalone)").matches || m("(display-mode: window-controls-overlay)").matches || m("(display-mode: tabbed)").matches)) return true; } catch (e) {} return navigator.standalone === true; }

  var Base = window.HTMLElement || function () {};
  class MhsRemind extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this, c = cfg();
      var perm = supported ? Notification.permission : "unsupported";
      var root = el("div", { class: "panel mhs-panel", dir: lang() === "ar" ? "rtl" : "ltr" });
      root.appendChild(el("div", { class: "mhs-head" }, [
        el("h3", { class: "mhs-title", text: "🔔 " + t("title") }),
        el("p", { class: "mhs-muted", text: t("sub") })
      ]));
      if (!supported) {
        root.appendChild(el("div", { class: "mhs-status warn", text: isIOS() && !standalone() ? t("ios") : t("unsupported") }));
        this.replaceChildren(root);
        return;
      }
      var on = c.on && perm === "granted";
      var box = el("input", { type: "checkbox", checked: on, on: { change: function () { self.toggle(box.checked); } } });
      root.appendChild(el("label", { class: "mhs-switch" }, [box, el("span", { text: t("enable") })]));

      if (perm === "denied") root.appendChild(el("div", { class: "mhs-status warn", text: t("denied") }));

      var seg = el("div", { class: "mhs-seg" });
      MINS.forEach(function (m) {
        seg.appendChild(el("button", { type: "button", class: "mhs-btn" + (c.mins === m ? " on" : ""), on: { click: function () {
          var n = cfg(); n.mins = m; saveCfg(n); self.render(); check();
        } } }, [m + " " + t("min")]));
      });
      root.appendChild(el("div", { class: "mhs-sec" }, [el("div", { class: "mhs-label", text: t("before") }), seg]));

      if (on) root.appendChild(el("div", { class: "mhs-actions" }, [
        el("button", { type: "button", class: "mhs-btn", on: { click: function () { show(t("testTitle"), t("testBody"), "mhs-test"); } } }, [t("test")])
      ]));
      root.appendChild(el("p", { class: "mhs-muted", text: t("note") + (isIOS() && !standalone() ? " " + t("ios") : "") }));
      root.appendChild(this.pushSection(perm));
      this.replaceChildren(root);
    }
    pushSection(perm) {
      var self = this, p = pushCfg();
      var sec = el("div", { class: "mhs-sec mhs-push" }, [
        el("div", { class: "mhs-label", text: "📲 " + t("pushTitle") }),
        el("p", { class: "mhs-muted", text: t("pushSub") })
      ]);
      if (!pushSupported) { sec.appendChild(el("div", { class: "mhs-status warn", text: isIOS() && !standalone() ? t("ios") : t("pushUnsupported") })); return sec; }
      var on = p.on && perm === "granted";
      var box = el("input", { type: "checkbox", checked: on, on: { change: function () { self.togglePush(box.checked); } } });
      sec.appendChild(el("label", { class: "mhs-switch" }, [box, el("span", { text: t("pushEnable") })]));
      var sel = el("select", { class: "mhs-btn", "aria-label": t("pushHour"), on: { change: function () {
        var n = pushCfg(); n.hour = +sel.value; savePush(n);
        if (n.on) pushSubscribe(false).catch(function () {});
      } } });
      for (var h = 0; h < 24; h++) {
        var o = el("option", { value: String(h), text: String(h).padStart(2, "0") + ":00" });
        if (h === p.hour) o.selected = true;
        sel.appendChild(o);
      }
      sec.appendChild(el("div", { class: "mhs-actions" }, [el("span", { class: "mhs-muted", text: t("pushHour") + " " }), sel].concat(on ? [
        el("button", { type: "button", class: "mhs-btn", on: { click: function () { pushSubscribe(true).catch(function () { alert(t("pushFail")); }); } } }, [t("pushTest")])
      ] : [])));
      if (this._pushErr) sec.appendChild(el("div", { class: "mhs-status warn", text: t("pushFail") }));
      return sec;
    }
    togglePush(want) {
      var self = this, p = pushCfg();
      self._pushErr = false;
      if (!want) { p.on = false; savePush(p); pushUnsubscribe(); return self.render(); }
      var ask = Notification.permission === "default" ? Promise.resolve(Notification.requestPermission()) : Promise.resolve(Notification.permission);
      ask.then(function (perm) {
        if (perm !== "granted") { p.on = false; savePush(p); return; }
        return pushSubscribe(true).then(function () { p.on = true; savePush(p); }, function () { p.on = false; savePush(p); self._pushErr = true; });
      }).catch(function () {}).then(function () { self.render(); });
    }
    toggle(want) {
      var self = this, c = cfg();
      if (!want) { c.on = false; saveCfg(c); registerPeriodic(false); publish(); return self.render(); }
      var ask = Notification.permission === "default" ? Promise.resolve(Notification.requestPermission()) : Promise.resolve(Notification.permission);
      ask.then(function (p) {
        c.on = p === "granted"; saveCfg(c); self.render(); registerPeriodic(c.on); publish();
        if (c.on) { show(t("testTitle"), t("testBody"), "mhs-test"); check(); }
      }).catch(function () { self.render(); });
    }
  }
  /* Used by the welcome screen: ask for notification permission and turn reminders on. */
  window.MHSRemind = {
    state: function () { return supported ? Notification.permission : "unsupported"; },
    enable: function () {
      if (!supported) return Promise.resolve("unsupported");
      var ask = Notification.permission === "default" ? Promise.resolve(Notification.requestPermission()) : Promise.resolve(Notification.permission);
      return ask.then(function (p) {
        var c = cfg(); c.on = p === "granted"; saveCfg(c);
        document.querySelectorAll("mhs-remind").forEach(function (n) { if (n.render) n.render(); });
        if (c.on) check();
        registerPeriodic(c.on); publish();
        return p === "default" ? "prompt" : p;
      }, function () { return "error"; });
    }
  };
  if (window.customElements && !customElements.get("mhs-remind")) customElements.define("mhs-remind", MhsRemind);
})();
