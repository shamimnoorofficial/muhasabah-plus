/* Muhasabah — Window Controls Overlay + tabbed display support.
 * - Adds `mhs-wco` when the OS lets the app draw into the title bar, and keeps
 *   the bar geometry in sync via `navigator.windowControlsOverlay`.
 * - Adds `mhs-tabbed` when running inside a tabbed PWA window.
 * - Injects a draggable custom title bar (logo, tab shortcuts, install button)
 *   that only appears in WCO mode; browsers draw their own strip in tabbed mode.
 * - Handles `?source=tabbed-new-tab` from the manifest's new-tab button.
 */
(function () {
  "use strict";
  var root = document.documentElement;
  var mqWco = null, mqTabbed = null;
  try {
    if (window.matchMedia) {
      mqWco = window.matchMedia("(display-mode: window-controls-overlay)");
      mqTabbed = window.matchMedia("(display-mode: tabbed)");
    }
  } catch (e) { mqWco = null; mqTabbed = null; }

  function hasWcoApi() {
    return ("windowControlsOverlay" in navigator) &&
      navigator.windowControlsOverlay &&
      typeof navigator.windowControlsOverlay.getTitlebarAreaRect === "function";
  }

  function syncClasses() {
    var wco = false, tabbed = false;
    try { wco = !!(mqWco && mqWco.matches) || (hasWcoApi() && !!navigator.windowControlsOverlay.visible); } catch (e) {}
    try { tabbed = !!(mqTabbed && mqTabbed.matches); } catch (e) {}
    root.classList.toggle("mhs-wco", wco);
    root.classList.toggle("mhs-tabbed", tabbed);
    return { wco: wco, tabbed: tabbed };
  }

  /* New-tab button from the manifest lands on /?source=tabbed-new-tab:
   * keep the user in the app shell on the dashboard instead of a blank page. */
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("source") === "tabbed-new-tab") {
      var clean = location.pathname + "?tab=dashboard";
      history.replaceState(history.state, "", clean);
    }
  } catch (e) {}

  function tabFromUrl() {
    try {
      var t = new URLSearchParams(location.search).get("tab");
      if (t === "dashboard" || t === "today" || t === "habits" || t === "journal" || t === "settings") return t;
    } catch (e) {}
    return "today";
  }
  function goTab(tab) {
    try {
      history.pushState({ mhs: true, tab: tab }, "", "?tab=" + tab);
      window.dispatchEvent(new PopStateEvent("popstate", { state: { mhs: true, tab: tab } }));
    } catch (e) { location.href = "/?tab=" + tab; }
  }

  var TABS = [
    { k: "dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড", ar: "اللوحة" },
    { k: "today", en: "Today", bn: "আজ", ar: "اليوم" },
    { k: "habits", en: "Habits", bn: "অভ্যাস", ar: "العادات" },
    { k: "journal", en: "Journal", bn: "জার্নাল", ar: "اليوميات" }
  ];
  function lang() {
    try {
      var c = window.MHS && window.MHS.current && window.MHS.current();
      var l = c && c.lang;
      if (l === "bn" || l === "ar" || l === "en") return l;
    } catch (e) {}
    var d = (document.documentElement.lang || "en").slice(0, 2);
    return d === "bn" || d === "ar" ? d : "en";
  }

  function buildBar() {
    if (document.getElementById("mhs-titlebar")) return;
    var bar = document.createElement("div");
    bar.id = "mhs-titlebar";
    bar.setAttribute("role", "banner");
    bar.setAttribute("aria-label", "Muhasabah title bar");

    var brand = document.createElement("div");
    brand.className = "tb-brand";
    var logo = document.createElement("img");
    logo.src = "/icons/icon-96.png";
    logo.alt = "";
    logo.width = 20; logo.height = 20;
    brand.appendChild(logo);
    var name = document.createElement("span");
    name.textContent = "Muhasabah";
    brand.appendChild(name);
    var tag = document.createElement("small");
    tag.textContent = "Everyone";
    brand.appendChild(tag);
    bar.appendChild(brand);

    var nav = document.createElement("nav");
    nav.className = "tb-tabs";
    nav.setAttribute("aria-label", "Sections");
    var l = lang(), cur = tabFromUrl();
    TABS.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = t[l] || t.en;
      b.dataset.tab = t.k;
      if (t.k === cur) b.setAttribute("aria-current", "page");
      b.addEventListener("click", function () {
        nav.querySelectorAll("button").forEach(function (x) { x.removeAttribute("aria-current"); });
        b.setAttribute("aria-current", "page");
        goTab(t.k);
      });
      nav.appendChild(b);
    });
    bar.appendChild(nav);

    var spacer = document.createElement("div");
    spacer.className = "tb-spacer";
    spacer.setAttribute("aria-hidden", "true");
    bar.appendChild(spacer);

    var install = document.createElement("button");
    install.type = "button";
    install.className = "tb-install";
    install.textContent = l === "bn" ? "ইনস্টল" : l === "ar" ? "تثبيت" : "Install";
    install.setAttribute("aria-label", "Install Muhasabah");
    install.addEventListener("click", function () {
      if (window.MHSInstall && typeof window.MHSInstall.guide === "function") window.MHSInstall.guide();
    });
    bar.appendChild(install);

    document.body.insertBefore(bar, document.body.firstChild);
  }

  function sync() {
    var s = syncClasses();
    if (s.wco) buildBar();
  }

  sync();
  try {
    if (mqWco && typeof mqWco.addEventListener === "function") mqWco.addEventListener("change", sync);
    if (mqTabbed && typeof mqTabbed.addEventListener === "function") mqTabbed.addEventListener("change", sync);
  } catch (e) {}
  try {
    if (hasWcoApi() && typeof navigator.windowControlsOverlay.addEventListener === "function") {
      navigator.windowControlsOverlay.addEventListener("geometrychange", sync);
    }
  } catch (e) {}
  window.addEventListener("popstate", function () {
    var cur = tabFromUrl(), bar = document.getElementById("mhs-titlebar");
    if (!bar) return;
    bar.querySelectorAll("button[data-tab]").forEach(function (b) {
      if (b.dataset.tab === cur) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
  });
  document.addEventListener("DOMContentLoaded", sync);
})();
