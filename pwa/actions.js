/* Muhasabah — unified quick-action button (bottom-right) and pop-up menu.
 * Replaces the separate "+" and calendar floating buttons with one Plus button that opens a
 * Google Keep style menu: Create To-Do, Write Journal, Read Quran, Read Hadith, Get Reminder
 * (wisdom feed) and Prayer & Qibla. Also provides window.MHSSheet, the shared full-screen
 * shell used by the mini-apps (header with back/close, scrollable body, Android back button).
 * Exposes window.MHSActions. */
(function () {
  "use strict";
  if (window.__mhsActions) return;
  window.__mhsActions = true;

  var T = {
    en: {
      open: "Quick actions", close: "Close menu", back: "Back", closeSheet: "Close",
      todo: "Create To-Do", todoSub: "Task with points and a deadline",
      journal: "Write Journal", journalSub: "A few lines about today",
      quran: "Read Quran", quranSub: "All 114 surahs with translation",
      hadith: "Read Hadith", hadithSub: "Bukhari, Muslim and more",
      wisdom: "Get Reminder", wisdomSub: "Verses, hadith and wise words",
      prayer: "Prayer & Qibla", prayerSub: "Times, compass and mosques nearby",
      loading: "Opening…"
    },
    bn: {
      open: "দ্রুত কাজ", close: "মেনু বন্ধ করুন", back: "পেছনে", closeSheet: "বন্ধ করুন",
      todo: "করণীয় তৈরি করুন", todoSub: "পয়েন্ট ও সময়সীমাসহ কাজ",
      journal: "দিনলিপি লিখুন", journalSub: "আজকের দিন নিয়ে কয়েক লাইন",
      quran: "কুরআন পড়ুন", quranSub: "অনুবাদসহ ১১৪টি সূরা",
      hadith: "হাদিস পড়ুন", hadithSub: "বুখারী, মুসলিম ও আরও",
      wisdom: "স্মরণ নিন", wisdomSub: "আয়াত, হাদিস ও জ্ঞানের কথা",
      prayer: "নামাজ ও কিবলা", prayerSub: "সময়, কম্পাস ও কাছের মসজিদ",
      loading: "খুলছে…"
    },
    ar: {
      open: "إجراءات سريعة", close: "إغلاق القائمة", back: "رجوع", closeSheet: "إغلاق",
      todo: "إنشاء مهمة", todoSub: "مهمة بنقاط وموعد",
      journal: "اكتب في اليوميات", journalSub: "بضعة أسطر عن يومك",
      quran: "اقرأ القرآن", quranSub: "١١٤ سورة مع الترجمة",
      hadith: "اقرأ الحديث", hadithSub: "البخاري ومسلم وغيرهما",
      wisdom: "تذكرة", wisdomSub: "آيات وأحاديث وحِكم",
      prayer: "الصلاة والقبلة", prayerSub: "المواقيت والبوصلة والمساجد القريبة",
      loading: "جارٍ الفتح…"
    }
  };
  function lang() { var l = document.documentElement.lang || "en"; return T[l] ? l : "en"; }
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k]; }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null) return;
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "on") Object.keys(attrs.on).forEach(function (ev) { n.addEventListener(ev, attrs.on[ev]); });
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function svg(path) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
    path.split("|").forEach(function (d) { var p = document.createElementNS(s.namespaceURI, "path"); p.setAttribute("d", d); s.appendChild(p); });
    return s;
  }
  var ICONS = {
    plus: "M12 5v14|M5 12h14",
    back: "M15 18l-6-6 6-6",
    x: "M18 6 6 18|M6 6l12 12",
    todo: "M9 12l2 2 4-4|M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    journal: "M12 20h9|M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
    quran: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20|M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z|M9 7h6|M9 11h6",
    hadith: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z|M8 9h8|M8 13h5",
    wisdom: "M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2Z|M9 21h6",
    prayer: "M12 3c0 2-1 3-1 3s-4 2-4 7h10c0-5-4-7-4-7s-1-1-1-3Z|M4 19h16|M6 13v6|M18 13v6"
  };
  /* Menu items, top to bottom (the first is closest to the button). */
  var ITEMS = [
    { k: "todo", c: "linear-gradient(140deg,#00c853,#00897b)", run: function () { if (window.MHSApp && window.MHSApp.newTodo) window.MHSApp.newTodo(); else if (window.MHSJournal && window.MHSJournal.newTodo) window.MHSJournal.newTodo(); } },
    { k: "journal", c: "linear-gradient(140deg,#7c4dff,#536dfe)", run: function () { if (window.MHSJournal) window.MHSJournal.open(undefined, { focus: true }); } },
    { k: "quran", c: "linear-gradient(140deg,#00bfa5,#00838f)", run: function () { ready("MHSQuran", function (m) { m.open(); }); } },
    { k: "hadith", c: "linear-gradient(140deg,#ffab00,#f57c00)", run: function () { ready("MHSHadith", function (m) { m.open(); }); } },
    { k: "wisdom", c: "linear-gradient(140deg,#ff4081,#e040fb)", run: function () { ready("MHSWisdom", function (m) { m.open(); }); } },
    { k: "prayer", c: "linear-gradient(140deg,#2979ff,#00b0ff)", run: function () { ready("MHSQibla", function (m) { m.open(); }); } }
  ];
  /* The mini-app scripts load deferred; wait briefly for one if it is not ready yet. */
  function ready(name, fn) {
    if (window[name]) return fn(window[name]);
    var tries = 0, timer = setInterval(function () { if (window[name]) { clearInterval(timer); fn(window[name]); } else if (++tries > 40) clearInterval(timer); }, 100);
  }

  var fab, menu, backdrop, open = false;
  function build() {
    if (fab) return;
    backdrop = el("div", { class: "mhs-fab-backdrop", "aria-hidden": "true", on: { click: close } });
    menu = el("ul", { class: "mhs-fab-menu", id: "mhs-fab-menu", role: "menu", "aria-label": t("open") });
    fab = el("button", { type: "button", class: "mhs-fab", id: "mhs-fab", "aria-label": t("open"), title: t("open"), "aria-haspopup": "menu", "aria-expanded": "false", "aria-controls": "mhs-fab-menu", "data-tour": "fab", on: { click: toggle } }, [svg(ICONS.plus), el("span", { class: "mhs-fab-ring", "aria-hidden": "true" })]);
    document.body.appendChild(backdrop); document.body.appendChild(menu); document.body.appendChild(fab);
    fill();
    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") { e.preventDefault(); close(); fab.focus(); }
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        var items = Array.prototype.slice.call(menu.querySelectorAll("button")), k = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(k + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
      }
    });
  }
  function fill() {
    menu.replaceChildren();
    var rev = ITEMS.slice().reverse(); // the list is drawn top→bottom; the first item ends up nearest the button
    rev.forEach(function (it, k) {
      var li = el("li", { class: "mhs-fab-item", role: "none", style: "--d:" + (k * 0.035) + "s" });
      var ic = el("span", { class: "ic", style: "--c:" + it.c, "aria-hidden": "true" }, [svg(ICONS[it.k])]);
      var b = el("button", { type: "button", role: "menuitem", "data-action": it.k, on: { click: function () { close(); setTimeout(it.run, 60); } } }, [
        el("span", { class: "lbl" }, [t(it.k), el("small", { text: t(it.k + "Sub") })]), ic
      ]);
      li.appendChild(b); menu.appendChild(li);
    });
    fab.setAttribute("aria-label", t("open")); fab.setAttribute("title", t("open"));
    menu.setAttribute("aria-label", t("open"));
  }
  function toggle() { open ? close() : show(); }
  function show() {
    if (open) return; open = true;
    fill();
    fab.classList.add("is-open"); menu.classList.add("is-open"); backdrop.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true"); fab.setAttribute("aria-label", t("close"));
    var first = menu.querySelector("li:last-child button"); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 120);
  }
  function close() {
    if (!open) return; open = false;
    fab.classList.remove("is-open"); menu.classList.remove("is-open"); backdrop.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false"); fab.setAttribute("aria-label", t("open"));
  }
  /* Hide the button while a full-screen dialog (journal, mini-app) is open. */
  function refresh() {
    if (!fab) return;
    var covered = document.querySelector("dialog[open]");
    fab.classList.toggle("is-hidden", !!covered);
    if (covered) close();
  }
  var pending = false;
  new MutationObserver(function () {
    if (pending) return; pending = true;
    requestAnimationFrame(function () { pending = false; refresh(); });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "lang"] });

  /* ---------- shared mini-app shell ---------- */
  function openSheet(opts) {
    var old = document.getElementById(opts.id); if (old) { try { old.close(); } catch (e) {} old.remove(); }
    var opener = document.activeElement;
    var d = el("dialog", { class: "mhs-mini", id: opts.id, "aria-label": opts.title, dir: document.documentElement.dir || "ltr", lang: document.documentElement.lang || "en" });
    var title = el("h2", null, [el("span", { class: "ttl", text: opts.title }), el("small", { text: opts.sub || "" })]);
    var back = el("button", { type: "button", class: "mhs-mini-ib mhs-mini-back", "aria-label": t("back"), hidden: "" }, [svg(ICONS.back)]);
    var closeBtn = el("button", { type: "button", class: "mhs-mini-ib", "aria-label": t("closeSheet"), title: t("closeSheet") }, [svg(ICONS.x)]);
    var tools = el("div", { class: "mhs-mini-tools" });
    var head = el("div", { class: "mhs-mini-head" }, [back, title, tools, closeBtn]);
    var body = el("div", { class: "mhs-mini-body" });
    var foot = el("div", { class: "mhs-mini-foot", hidden: "" });
    d.appendChild(el("div", { class: "mhs-mini-shell" }, [head, body, foot]));
    document.body.appendChild(d);
    var handle = { dialog: d, body: body, foot: foot, tools: tools, back: back, onBack: null,
      setTitle: function (a, b) { title.querySelector(".ttl").textContent = a || ""; title.querySelector("small").textContent = b || ""; d.setAttribute("aria-label", a || ""); },
      showBack: function (on) { back.hidden = !on; },
      close: function () { if (d.open) d.close(); },
      icon: svg
    };
    var prevOverflow = document.body.style.overflow;
    var pushed = false;
    try { history.pushState(Object.assign({}, history.state || {}, { mhsSheet: opts.id }), ""); pushed = true; } catch (e) {}
    function onPop() {
      if (!d.open) return;
      if (handle.onBack && handle.onBack()) { try { history.pushState(Object.assign({}, history.state || {}, { mhsSheet: opts.id }), ""); } catch (e) {} return; }
      pushed = false; d.close();
    }
    window.addEventListener("popstate", onPop);
    back.addEventListener("click", function () { if (handle.onBack) handle.onBack(); });
    closeBtn.addEventListener("click", handle.close);
    d.addEventListener("cancel", function (e) { e.preventDefault(); handle.close(); });
    d.addEventListener("click", function (e) { if (e.target === d) handle.close(); });
    d.addEventListener("close", function () {
      window.removeEventListener("popstate", onPop);
      document.body.style.overflow = prevOverflow;
      d.remove(); refresh();
      if (pushed && history.state && history.state.mhsSheet === opts.id) { pushed = false; try { history.back(); } catch (e) {} }
      if (opts.onClose) opts.onClose();
      if (opener && opener.focus && opener.isConnected) try { opener.focus({ preventScroll: true }); } catch (e) {}
    });
    d.showModal(); document.body.style.overflow = "hidden";
    refresh();
    return handle;
  }
  window.MHSSheet = { open: openSheet, el: el, svg: svg };

  /* Toast shared by the mini-apps (same look as the app's own). */
  function toast(msg) {
    if (window.MHSApp && window.MHSApp.toast) { window.MHSApp.toast(msg); return; }
    var n = el("div", { class: "mhs-toast", role: "status", text: msg });
    document.body.appendChild(n); setTimeout(function () { n.style.opacity = "0"; }, 2400); setTimeout(function () { n.remove(); }, 2900);
  }
  /* Share text with the system sheet, or copy it. */
  function share(text, title) {
    if (navigator.share) return navigator.share({ title: title || "Muhasabah", text: text }).catch(function () {});
    if (navigator.clipboard) return navigator.clipboard.writeText(text).then(function () { toast(lang() === "bn" ? "কপি হয়েছে" : lang() === "ar" ? "تم النسخ" : "Copied"); }).catch(function () {});
    return Promise.resolve();
  }

  window.MHSActions = {
    open: show, close: close, toggle: toggle, toast: toast, share: share,
    run: function (k) { var it = ITEMS.filter(function (x) { return x.k === k; })[0]; if (it) it.run(); }
  };
  document.addEventListener("mhs:new-todo", function () { if (window.MHSApp && window.MHSApp.newTodo) window.MHSApp.newTodo(); });

  function boot() {
    build();
    // Deep link / app shortcut: ?open=quran|hadith|wisdom|prayer|todo|journal
    try {
      var want = new URLSearchParams(location.search).get("open");
      if (want && ITEMS.some(function (x) { return x.k === want; })) {
        var u = new URL(location.href); u.searchParams.delete("open"); history.replaceState(history.state, "", u.pathname + (u.search || "") + u.hash);
        setTimeout(function () { window.MHSActions.run(want); }, 600);
      }
    } catch (e) {}
  }
  if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
