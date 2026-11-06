/* Muhasabah — data storage preference and account sync.
 * Settings panel <mhs-sync>: choose where your data lives —
 *   device  : only on this device (default; backups by file / folder)
 *   drive   : your own Google Drive (Lifetime Premium, handled by pwa/protools.js)
 *   server  : Muhasabah's server with your account (Monthly Pro) — sign in on any device
 * With "server", every change is pushed a few seconds later and the newest copy is pulled on
 * launch. Exposes window.MHSSync. */
(function () {
  "use strict";
  if (window.__mhsSync) return;
  window.__mhsSync = true;
  var PREF = "mhs:storage", META = "mhs:sync-meta", API = "/api/user-data";

  var T = {
    en: {
      title: "Where your data lives", sub: "Choose one place. Your habits, to-dos, ledger and journal are kept there and restored from there.",
      device: "This device only", deviceSub: "Private and offline. Use Backup & Data below to export a file.",
      drive: "My Google Drive", driveSub: "Instant sync to a hidden folder of your own Drive. Reconnect on any device to restore.", driveNeed: "Lifetime Premium ($10 once)",
      server: "Muhasabah account (server)", serverSub: "Saved on our server under your account. Sign in anywhere and continue where you left off.", serverNeed: "Monthly Pro",
      active: "Active", unlock: "Unlock with Pro", signin: "Sign in", setupDrive: "Connect Google Drive below", synced: "Synced {d}", never: "Not synced yet", syncing: "Syncing…",
      pushNow: "Sync now", pull: "Download from server", remove: "Delete server copy", removed: "Server copy deleted", failed: "Sync failed. Check your connection and try again.",
      plan: "This plan isn't active on your account.", auth: "Please sign in to your Muhasabah account first.", conflict: "The server has a newer copy. Download it first, or sync again to overwrite it.",
      newer: "A newer copy of your data was found on the server ({d}). Replace the data on this device with it? Current data is kept as a restore point.", done: "Data downloaded from the server", none: "No data on the server yet.",
      switched: "Storage preference saved"
    },
    bn: {
      title: "আপনার ডেটা কোথায় থাকবে", sub: "একটি জায়গা বেছে নিন। অভ্যাস, করণীয়, হিসাবখাতা ও দিনলিপি সেখানেই থাকবে এবং সেখান থেকেই ফিরে আসবে।",
      device: "শুধু এই ডিভাইসে", deviceSub: "ব্যক্তিগত ও অফলাইন। ফাইল এক্সপোর্ট করতে নিচের ব্যাকআপ ও ডেটা ব্যবহার করুন।",
      drive: "আমার Google Drive", driveSub: "নিজের Drive-এর গোপন ফোল্ডারে তাৎক্ষণিক সিঙ্ক। যেকোনো ডিভাইসে পুনরায় সংযোগ করে ফিরিয়ে আনুন।", driveNeed: "লাইফটাইম প্রিমিয়াম (এককালীন $10)",
      server: "মুহাসাবা অ্যাকাউন্ট (সার্ভার)", serverSub: "আপনার অ্যাকাউন্টে আমাদের সার্ভারে সংরক্ষিত। যেকোনো জায়গা থেকে সাইন ইন করে যেখানে ছিলেন সেখান থেকে শুরু করুন।", serverNeed: "মাসিক প্রো",
      active: "সক্রিয়", unlock: "প্রো দিয়ে আনলক", signin: "সাইন ইন", setupDrive: "নিচে Google Drive সংযোগ করুন", synced: "সিঙ্ক হয়েছে {d}", never: "এখনো সিঙ্ক হয়নি", syncing: "সিঙ্ক হচ্ছে…",
      pushNow: "এখন সিঙ্ক করুন", pull: "সার্ভার থেকে নামান", remove: "সার্ভারের কপি মুছুন", removed: "সার্ভারের কপি মুছে ফেলা হয়েছে", failed: "সিঙ্ক ব্যর্থ। সংযোগ দেখে আবার চেষ্টা করুন।",
      plan: "এই প্ল্যানটি আপনার অ্যাকাউন্টে সক্রিয় নেই।", auth: "প্রথমে আপনার মুহাসাবা অ্যাকাউন্টে সাইন ইন করুন।", conflict: "সার্ভারে নতুন কপি আছে। আগে সেটি নামান, অথবা আবার সিঙ্ক করে প্রতিস্থাপন করুন।",
      newer: "সার্ভারে আপনার ডেটার নতুন কপি পাওয়া গেছে ({d})। এই ডিভাইসের ডেটা সেটি দিয়ে প্রতিস্থাপন করবেন? বর্তমান ডেটা রিস্টোর পয়েন্ট হিসেবে থাকবে।", done: "সার্ভার থেকে ডেটা নামানো হয়েছে", none: "সার্ভারে এখনো কোনো ডেটা নেই।",
      switched: "স্টোরেজ পছন্দ সংরক্ষিত"
    },
    ar: {
      title: "أين تُحفظ بياناتك", sub: "اختر مكانًا واحدًا. تُحفظ عاداتك ومهامك وسجلك ويومياتك هناك وتُستعاد منه.",
      device: "هذا الجهاز فقط", deviceSub: "خاص ودون اتصال. استخدم النسخ الاحتياطي أدناه لتصدير ملف.",
      drive: "Google Drive الخاص بي", driveSub: "مزامنة فورية إلى مجلد مخفي في Drive الخاص بك. أعد الاتصال على أي جهاز للاستعادة.", driveNeed: "العضوية الدائمة (10$ مرة واحدة)",
      server: "حساب محاسبة (الخادم)", serverSub: "محفوظ على خادمنا ضمن حسابك. سجّل الدخول من أي مكان وتابع من حيث توقفت.", serverNeed: "Pro الشهري",
      active: "نشط", unlock: "افتح مع Pro", signin: "تسجيل الدخول", setupDrive: "اربط Google Drive أدناه", synced: "تمت المزامنة {d}", never: "لم تتم المزامنة بعد", syncing: "جارٍ المزامنة…",
      pushNow: "زامن الآن", pull: "تنزيل من الخادم", remove: "حذف نسخة الخادم", removed: "حُذفت نسخة الخادم", failed: "فشلت المزامنة. تحقق من الاتصال وحاول مجددًا.",
      plan: "هذه الخطة غير نشطة في حسابك.", auth: "سجّل الدخول إلى حساب محاسبة أولًا.", conflict: "لدى الخادم نسخة أحدث. نزّلها أولًا أو زامن مجددًا لاستبدالها.",
      newer: "عُثر على نسخة أحدث من بياناتك على الخادم ({d}). هل تستبدل بيانات هذا الجهاز بها؟ تُحفظ البيانات الحالية كنقطة استعادة.", done: "تم تنزيل البيانات من الخادم", none: "لا بيانات على الخادم بعد.",
      switched: "تم حفظ تفضيل التخزين"
    }
  };
  function lang() { var l = document.documentElement.lang || "en"; return T[l] ? l : "en"; }
  function t(k, v) { var s = (T[lang()] || T.en)[k] || T.en[k] || k; if (v) Object.keys(v).forEach(function (x) { s = s.split("{" + x + "}").join(v[x]); }); return s; }
  function when(ms) { try { return new Date(ms).toLocaleString(lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar" : "en-US", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return new Date(ms).toString(); } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function jget(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function toast(m) { if (window.MHSActions) window.MHSActions.toast(m); }
  function pref() { var p = localStorage.getItem(PREF); return p === "server" || p === "drive" ? p : "device"; }
  function meta() { return jget(META, {}); }
  function setMeta(p) { jset(META, Object.assign(meta(), p)); }
  function proState() { return window.MuhasabahPro && window.MuhasabahPro.state ? window.MuhasabahPro.state() : null; }
  function member() { var c = proState(); return c && c.member; }
  function signedIn() { var c = proState(); return !!(c && c.signedIn); }
  function hasMonthly() { var m = member(); return !!(m && m.monthly && m.monthly.active); }
  function hasLifetime() { var m = member(); return !!(m && (m.lifetime || m.pro)); }
  function device() { try { return (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "web"; } catch (e) { return "web"; } }
  function savedAt() { try { return +localStorage.getItem("muhasabah:savedAt") || 0; } catch (e) { return 0; } }

  /* ---------- server engine ---------- */
  var busy = false, timer = null, lastErr = "";
  function call(method, body) {
    return fetch(API, { method: method, credentials: "same-origin", cache: "no-store", headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (d) { if (!r.ok) { var e = new Error((d && d.error) || "http_" + r.status); e.code = (d && d.error) || "network"; e.data = d; throw e; } return d; }); });
  }
  function push(force) {
    var data = window.MHS && window.MHS.current && window.MHS.current();
    if (!data || pref() !== "server") return Promise.resolve(false);
    busy = true; lastErr = ""; refreshAll();
    return call("PUT", { data: data, updatedAt: savedAt() || Date.now(), device: device(), force: !!force }).then(function (r) {
      setMeta({ lastSync: Date.now(), remoteAt: r.updatedAt, size: r.size }); return true;
    }).catch(function (e) { lastErr = e.code || "network"; throw e; }).then(function (v) { busy = false; refreshAll(); return v; }, function (e) { busy = false; refreshAll(); throw e; });
  }
  function pull(interactive) {
    busy = true; lastErr = ""; refreshAll();
    return call("GET").then(function (r) {
      busy = false;
      if (!r || !r.data) { refreshAll(); if (interactive) toast(t("none")); return false; }
      var local = savedAt(), cur = window.MHS.current() || {}, empty = !((cur.habits || []).length || (cur.ledger || []).length || (cur.todos || []).length);
      if (r.updatedAt <= local && !empty && !interactive) { setMeta({ lastSync: Date.now(), remoteAt: r.updatedAt }); refreshAll(); return false; }
      if (!empty && !confirm(t("newer", { d: when(r.updatedAt) }))) { refreshAll(); return false; }
      var data = Object.assign({}, r.data, { onboarded: true });
      return window.MHS.set("snap:" + window.MHS.dayKey() + "-before-server-restore", { savedAt: Date.now(), data: cur }).catch(function () {})
        .then(function () { return window.MHS.replace(data); }).then(function () { setMeta({ lastSync: Date.now(), remoteAt: r.updatedAt }); try { localStorage.setItem("muhasabah:savedAt", String(r.updatedAt)); } catch (e) {} toast(t("done")); setTimeout(function () { location.reload(); }, 400); return true; });
    }).catch(function (e) { busy = false; lastErr = e.code || "network"; refreshAll(); throw e; });
  }
  function schedule() { if (pref() !== "server" || !signedIn()) return; clearTimeout(timer); timer = setTimeout(function () { push().catch(function () {}); }, 5000); }
  if (window.MHS && window.MHS.onSave) window.MHS.onSave(schedule);
  window.addEventListener("online", function () { if (pref() === "server") push().catch(function () {}); });
  function boot() {
    if (pref() !== "server" || !window.MuhasabahPro) return;
    window.MuhasabahPro.config().then(function () { if (signedIn() && hasMonthly()) pull(false).catch(function () {}); });
  }

  /* ---------- panel ---------- */
  function refreshAll() { document.querySelectorAll("mhs-sync").forEach(function (p) { p.render && p.render(); }); }
  function errText() { return lastErr === "plan_required" ? t("plan") : lastErr === "auth_required" ? t("auth") : lastErr === "conflict" ? t("conflict") : lastErr ? t("failed") : ""; }
  var Base = window.HTMLElement || function () {};
  class MhsSync extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() {
      var self = this;
      if (!this._wired) { this._wired = true; this.addEventListener("click", function (e) { var b = e.target.closest("[data-a]"); if (b && self.contains(b)) self.act(b.getAttribute("data-a"), b); }); }
      this.render();
      if (window.MuhasabahPro) window.MuhasabahPro.config().then(function () { self.render(); });
    }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var p = pref(), m = meta(), dir = lang() === "ar" ? "rtl" : "ltr";
      var ok = { device: true, drive: hasLifetime(), server: signedIn() && hasMonthly() };
      function card(k, icon, need) {
        var on = p === k;
        return '<button type="button" role="radio" aria-checked="' + on + '" class="mhs-sy-card' + (on ? " on" : "") + '" data-a="pick-' + k + '">' +
          '<span class="mhs-sy-ic" aria-hidden="true">' + icon + '</span><span class="mhs-sy-body"><b>' + esc(t(k)) + (on ? ' <em>' + esc(t("active")) + '</em>' : "") + '</b><small>' + esc(t(k + "Sub")) + '</small>' +
          (need && !ok[k] ? '<span class="mhs-sy-need">♛ ' + esc(need) + '</span>' : "") + '</span><span class="mhs-sy-dot" aria-hidden="true"></span></button>';
      }
      var status = "";
      if (p === "server") {
        if (!signedIn()) status = '<p class="mhs-status warn">' + esc(t("auth")) + '</p><div class="mhs-actions"><button type="button" class="mhs-btn primary" data-a="pro">' + esc(t("signin")) + "</button></div>";
        else if (!hasMonthly()) status = '<p class="mhs-status warn">' + esc(t("plan")) + '</p><div class="mhs-actions"><button type="button" class="mhs-btn primary" data-a="pro">' + esc(t("unlock")) + "</button></div>";
        else status = '<p class="mhs-status' + (lastErr ? " warn" : " ok") + '">' + esc(busy ? t("syncing") : lastErr ? errText() : m.lastSync ? t("synced", { d: when(m.lastSync) }) : t("never")) + "</p>" +
          '<div class="mhs-actions"><button type="button" class="mhs-btn primary" data-a="push"' + (busy ? " disabled" : "") + ">" + esc(t("pushNow")) + '</button><button type="button" class="mhs-btn" data-a="pull"' + (busy ? " disabled" : "") + ">" + esc(t("pull")) + '</button><button type="button" class="mhs-btn danger" data-a="remove">' + esc(t("remove")) + "</button></div>";
      } else if (p === "drive") {
        status = ok.drive ? '<p class="mhs-status">' + esc(t("setupDrive")) + "</p>" : '<p class="mhs-status warn">' + esc(t("plan")) + '</p><div class="mhs-actions"><button type="button" class="mhs-btn primary" data-a="pro">' + esc(t("unlock")) + "</button></div>";
      }
      this.innerHTML = '<section class="panel mhs-panel mhs-sync" dir="' + dir + '"><div class="mhs-head"><h3 class="mhs-title">☁️ ' + esc(t("title")) + '</h3><p class="mhs-muted">' + esc(t("sub")) + '</p></div>' +
        '<div class="mhs-sy-cards" role="radiogroup" aria-label="' + esc(t("title")) + '">' + card("device", "📱") + card("drive", "🟢", t("driveNeed")) + card("server", "☁️", t("serverNeed")) + "</div>" + status + "</section>";
    }
    act(a) {
      var self = this;
      if (a.indexOf("pick-") === 0) {
        var k = a.slice(5);
        try { localStorage.setItem(PREF, k); } catch (e) {}
        toast(t("switched")); this.render(); refreshAll();
        if (k === "server") { if (window.MuhasabahPro) window.MuhasabahPro.config().then(function () { self.render(); if (signedIn() && hasMonthly()) pull(false).then(function (r) { if (!r) push().catch(function () {}); }).catch(function () {}); }); }
        if (k === "drive") setTimeout(function () { var pt = document.querySelector("mhs-pro-tools"); if (pt) pt.scrollIntoView({ block: "start", behavior: "smooth" }); }, 150);
        if (window.MHSDrive && window.MHSDrive.setAuto) window.MHSDrive.setAuto(k === "drive");
        return;
      }
      if (a === "pro") { if (window.MuhasabahPro) window.MuhasabahPro.open(); return; }
      if (a === "push") { push(lastErr === "conflict").then(function () { toast(t("synced", { d: when(Date.now()) })); }).catch(function () { toast(errText()); }); return; }
      if (a === "pull") { pull(true).catch(function () { toast(errText()); }); return; }
      if (a === "remove") { if (!confirm(t("remove") + "?")) return; call("DELETE").then(function () { setMeta({ lastSync: 0, remoteAt: 0 }); toast(t("removed")); self.render(); }).catch(function (e) { lastErr = e.code; toast(errText()); self.render(); }); }
    }
  }
  if (window.customElements && !customElements.get("mhs-sync")) customElements.define("mhs-sync", MhsSync);
  document.addEventListener("mhs:pro-change", refreshAll);
  window.MHSSync = { pref: pref, push: push, pull: pull, state: function () { return { pref: pref(), busy: busy, error: lastErr, meta: meta() }; } };

  var css = document.createElement("style");
  css.textContent = ".mhs-sy-cards{display:grid;gap:.5rem}@media(min-width:768px){.mhs-sy-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
    ".mhs-sy-card{display:flex;align-items:flex-start;gap:.75rem;text-align:start;padding:.9rem;border-radius:1rem;border:1px solid hsl(var(--border));background:hsl(var(--card)/.7);color:inherit;font:inherit;cursor:pointer;min-height:64px;transition:border-color .2s ease,background-color .2s ease}" +
    ".mhs-sy-card:hover{border-color:hsl(var(--primary)/.45)}.mhs-sy-card.on{border-color:hsl(var(--primary)/.6);background:hsl(var(--primary)/.08)}" +
    ".mhs-sy-ic{font-size:1.4rem;line-height:1;flex-shrink:0}.mhs-sy-body{display:flex;flex-direction:column;gap:.2rem;min-width:0;flex:1}.mhs-sy-body b{font-size:.92rem}.mhs-sy-body b em{font-style:normal;font-size:10px;padding:.1rem .5rem;border-radius:999px;background:hsl(var(--primary)/.14);color:hsl(var(--primary));margin-inline-start:.35rem}" +
    ".mhs-sy-body small{font-size:11.5px;color:hsl(var(--muted-foreground));line-height:1.45}.mhs-sy-need{font-size:10.5px;color:#d4a94a;margin-top:.15rem}" +
    ".mhs-sy-dot{width:18px;height:18px;border-radius:50%;border:2px solid hsl(var(--muted-foreground)/.5);flex-shrink:0;margin-top:.15rem;position:relative}.mhs-sy-card.on .mhs-sy-dot{border-color:hsl(var(--primary))}.mhs-sy-card.on .mhs-sy-dot::after{content:'';position:absolute;inset:3px;border-radius:50%;background:hsl(var(--primary))}";
  document.head.appendChild(css);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 800); }); else setTimeout(boot, 800);
})();
