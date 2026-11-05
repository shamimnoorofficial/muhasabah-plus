/* Muhasabah launch handling for installed-app integrations declared in the web manifest:
 *  - file_handlers  : open a Muhasabah .json backup (or a .txt note) with the app
 *  - share_target   : receive a backup file or text shared from another app
 *  - protocol_handlers : web+muhasabah://today, web+muhasabah://habits, web+muhasabah://journal, web+muhasabah://todo?text=…
 *  - note_taking    : /?source=note opens today's journal entry
 * Backups are validated, the current data is kept as a restore point, then the backup replaces it. */
(function () {
  "use strict";
  var TABS = { dashboard: 1, dash: "dashboard", today: 1, habits: 1, ledger: 1, settings: 1, backup: "settings" };
  var SHARE_CACHE = "mhs-share";
  var STR = {
    en: {
      confirm: "Restore this Muhasabah backup?\n\nHabits: {h} · Ledger entries: {l}\n\nYour current data is kept as a restore point in Settings → Backup.",
      bad: "This file is not a Muhasabah backup.",
      failed: "Could not open the file.",
      textReady: "Shared text added to quick add — press Enter to save it as a todo."
    },
    bn: {
      confirm: "এই মুহাসাবা ব্যাকআপটি রিস্টোর করবেন?\n\nহ্যাবিট: {h} · লেজার এন্ট্রি: {l}\n\nআপনার বর্তমান ডেটা সেটিংস → ব্যাকআপে একটি রিস্টোর পয়েন্ট হিসেবে রাখা হবে।",
      bad: "এই ফাইলটি মুহাসাবা ব্যাকআপ নয়।",
      failed: "ফাইলটি খোলা যায়নি।",
      textReady: "শেয়ার করা লেখা কুইক অ্যাডে বসানো হয়েছে — টুডু হিসেবে রাখতে Enter চাপুন।"
    },
    ar: {
      confirm: "استعادة هذه النسخة الاحتياطية من محاسبة؟\n\nالعادات: {h} · قيود السجل: {l}\n\nستُحفظ بياناتك الحالية كنقطة استعادة في الإعدادات ← النسخ الاحتياطي.",
      bad: "هذا الملف ليس نسخة احتياطية من محاسبة.",
      failed: "تعذّر فتح الملف.",
      textReady: "أُضيف النص المشارَك إلى الإضافة السريعة — اضغط Enter لحفظه كمهمة."
    }
  };
  function lang() {
    var l = (window.MHS && window.MHS.current && (window.MHS.current() || {}).lang) || document.documentElement.lang || "en";
    l = String(l).slice(0, 2);
    return STR[l] ? l : "en";
  }
  function t(k, vars) {
    var s = STR[lang()][k] || STR.en[k];
    Object.keys(vars || {}).forEach(function (v) { s = s.replace("{" + v + "}", vars[v]); });
    return s;
  }
  function toast(msg) {
    var n = document.createElement("div");
    n.className = "mhs-toast"; n.setAttribute("role", "status"); n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(function () { n.classList.add("out"); }, 3200);
    setTimeout(function () { n.remove(); }, 3700);
  }

  /* Wait until the app has rendered (startup splash removed). */
  function ready() {
    return new Promise(function (resolve) {
      var tries = 0;
      (function check() {
        if ((window.MHS && !document.getElementById("mhs-startup")) || ++tries > 150) return resolve();
        setTimeout(check, 100);
      })();
    });
  }
  function goTab(tab) {
    try {
      history.pushState({ mhs: true, tab: tab }, "", "?tab=" + tab);
      window.dispatchEvent(new PopStateEvent("popstate", { state: { mhs: true, tab: tab } }));
    } catch (e) {}
  }
  function cleanUrl() {
    try {
      var u = new URL(location.href);
      ["source", "protocol", "shared"].forEach(function (k) { u.searchParams.delete(k); });
      history.replaceState(history.state, "", u.pathname + (u.search || "") + u.hash);
    } catch (e) {}
  }

  /* Put text into the Today tab's quick-add todo field (a React-controlled input). */
  function prefillTodo(text) {
    text = String(text || "").replace(/\s+/g, " ").trim().slice(0, 200);
    if (!text) return;
    goTab("today");
    var tries = 0;
    (function fill() {
      var input = document.querySelector(".mhs-todo-quick input");
      if (!input) { if (++tries < 40) setTimeout(fill, 100); return; }
      var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(input, text);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
      toast(t("textReady"));
    })();
  }

  function isBackup(d) {
    return d && typeof d === "object" && !Array.isArray(d) &&
      (d.app === "Muhasabah" || Array.isArray(d.habits) || Array.isArray(d.ledger)) &&
      (d.habits === undefined || Array.isArray(d.habits)) && (d.ledger === undefined || Array.isArray(d.ledger));
  }
  function restoreBackup(d) {
    var M = window.MHS;
    if (!M) return Promise.resolve();
    if (!confirm(t("confirm", { h: (d.habits || []).length, l: (d.ledger || []).length }))) return Promise.resolve();
    var cur = M.current() || {};
    var data = {
      habits: d.habits || [], todos: Array.isArray(d.todos) ? d.todos : [], ledger: d.ledger || [],
      journal: d.journal && typeof d.journal === "object" ? d.journal : {}, journalReminder: !!d.journalReminder,
      lang: cur.lang || d.lang, onboarded: true
    };
    return M.set("snap:" + M.dayKey() + "-before-file-import", { savedAt: Date.now(), data: cur }).catch(function () {})
      .then(function () { return M.replace(data); })
      .then(function () { location.replace("/?tab=dashboard"); });
  }

  function openFile(file) {
    if (!file) return Promise.resolve();
    return file.text().then(function (text) {
      var isJson = /\.json$/i.test(file.name || "") || /json/.test(file.type || "") || /^\s*\{/.test(text);
      if (isJson) {
        var d = null;
        try { d = JSON.parse(text); } catch (e) {}
        if (isBackup(d)) return restoreBackup(d);
        toast(t("bad"));
        return;
      }
      prefillTodo(text.split(/\r?\n/).filter(Boolean)[0] || "");
    }).catch(function () { toast(t("failed")); });
  }

  /* file_handlers: files arrive through the Launch Queue. */
  if ("launchQueue" in window && window.launchQueue && typeof window.launchQueue.setConsumer === "function") {
    window.launchQueue.setConsumer(function (params) {
      if (!params || !params.files || !params.files.length) return;
      ready().then(function () { return params.files[0].getFile(); }).then(openFile).catch(function () { toast(t("failed")); });
    });
  }

  var q = new URLSearchParams(location.search);

  /* share_target: the service worker stores the shared payload, then opens /?source=share. */
  if (q.get("source") === "share") {
    ready().then(function () {
      if (!("caches" in window)) return;
      return caches.open(SHARE_CACHE).then(function (cache) {
        return Promise.all([cache.match("/__share/file"), cache.match("/__share/text")]).then(function (r) {
          var job = Promise.resolve();
          if (r[0]) {
            var name = decodeURIComponent(r[0].headers.get("X-File-Name") || "shared.json");
            job = r[0].blob().then(function (b) { return openFile(new File([b], name, { type: b.type })); });
          } else if (r[1]) {
            job = r[1].json().then(function (s) { prefillTodo([s.title, s.text, s.url].filter(Boolean).join(" ")); });
          }
          return job.then(function () { return Promise.all([cache.delete("/__share/file"), cache.delete("/__share/text")]); });
        });
      });
    }).catch(function () { toast(t("failed")); }).then(cleanUrl);
  }

  /* protocol_handlers: /?protocol=web%2Bmuhasabah%3A%2F%2Ftoday */
  var proto = q.get("protocol");
  if (proto) {
    ready().then(function () {
      var m = /^web\+muhasabah:(?:\/\/)?([a-z]*)\/?(?:\?(.*))?$/i.exec(proto.trim());
      if (!m) return;
      var what = m[1].toLowerCase(), args = new URLSearchParams(m[2] || "");
      if (what === "todo" || what === "add") { prefillTodo(args.get("text") || args.get("title") || ""); return; }
      if (what === "journal" || what === "note") { openJournal(); return; }
      var tab = TABS[what];
      if (tab) goTab(tab === 1 ? what : tab);
    }).then(cleanUrl);
  }

  /* note_taking (manifest new_note_url) and the "write" widget action: open today's journal entry. */
  function openJournal() {
    var tries = 0;
    (function go() {
      if (window.MHSJournal && typeof window.MHSJournal.open === "function") { var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
        window.MHSJournal.open(d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()), { focus: true }); return; }
      if (++tries < 50) setTimeout(go, 100);
    })();
  }
  if (q.get("source") === "note" || q.get("tab") === "journal") {
    ready().then(openJournal).then(cleanUrl);
  }

  if (q.get("source") === "file" && !("launchQueue" in window)) cleanUrl();
})();
