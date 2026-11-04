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
      body: "Mark it done before the deadline to earn +{p}. Otherwise −{p}."
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
      body: "أكملها قبل الموعد لتكسب +{p}، وإلا يُخصم −{p}."
    }
  };
  function lang() { var c = MHS && MHS.current(); return c && c.lang === "ar" ? "ar" : "en"; }
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

  setInterval(function () { check(); }, 20000);
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
  function standalone() { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; }

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
      this.replaceChildren(root);
    }
    toggle(want) {
      var self = this, c = cfg();
      if (!want) { c.on = false; saveCfg(c); return self.render(); }
      var ask = Notification.permission === "default" ? Promise.resolve(Notification.requestPermission()) : Promise.resolve(Notification.permission);
      ask.then(function (p) {
        c.on = p === "granted"; saveCfg(c); self.render();
        if (c.on) { show(t("testTitle"), t("testBody"), "mhs-test"); check(); }
      }).catch(function () { self.render(); });
    }
  }
  if (window.customElements && !customElements.get("mhs-remind")) customElements.define("mhs-remind", MhsRemind);
})();
