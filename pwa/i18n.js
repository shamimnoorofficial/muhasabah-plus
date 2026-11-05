/* Muhasabah — every-language interface.
 * English, Bengali and Arabic are hand-written inside the app. Every other language is
 * translated automatically: the visible English interface text is swapped in place for the
 * chosen language, using the shared server-side translation cache (/api/i18n). Only strings
 * from the app's own interface catalog are ever translated — habit names you typed, journal
 * text and notes are never sent anywhere. Translations are also kept on this device, so a
 * language keeps working offline once it has been opened.
 * Exposes window.MHSI18n. */
(function () {
  "use strict";
  var NATIVE = ["en", "bn", "ar"];
  /* Keep in sync with i18n/languages.json (the server's allow-list). */
  var CODES = ["en", "bn", "ar", "af", "sq", "am", "hy", "as", "az", "eu", "be", "bs", "bg", "my", "ca", "ceb", "zh-CN", "zh-TW", "hr", "cs", "da", "dv", "nl", "et", "fil", "fi", "fr", "gl", "ka", "de", "el", "gu", "ha", "he", "hi", "hu", "is", "ig", "id", "ga", "it", "ja", "jv", "kn", "kk", "km", "rw", "ko", "ku", "ckb", "ky", "lo", "lv", "lt", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "ne", "no", "or", "ps", "fa", "pl", "pt", "pt-BR", "pa", "ro", "ru", "sr", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tg", "ta", "tt", "te", "th", "ti", "tr", "tk", "uk", "ur", "ug", "uz", "vi", "cy", "wo", "xh", "yo", "zu"];
  var RTL = { ar: 1, he: 1, fa: 1, ur: 1, ps: 1, sd: 1, ug: 1, dv: 1, ckb: 1, yi: 1 };
  var VERSION = "v1";
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, svg: 1, SVG: 1, TEMPLATE: 1 };
  var ATTRS = ["placeholder", "aria-label", "title", "alt"];

  function supported(code) { return typeof code === "string" && CODES.indexOf(code) >= 0; }
  function isRtl(code) { return !!RTL[String(code || "").split("-")[0]]; }
  function nativeName(code) {
    var name = "";
    try { name = new Intl.DisplayNames([code], { type: "language" }).of(code) || ""; } catch (e) {}
    if (!name || name === code) return englishName(code);
    return name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
  }
  function englishName(code) {
    try { return new Intl.DisplayNames(["en"], { type: "language" }).of(code) || code; } catch (e) { return code; }
  }
  /* The best supported match for the device language, or null. */
  function deviceLanguage() {
    var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]);
    for (var k = 0; k < list.length; k++) {
      var tag = String(list[k] || ""), base = tag.split("-")[0].toLowerCase();
      if (/^zh-(TW|HK|MO|Hant)/i.test(tag)) return "zh-TW";
      if (base === "zh") return "zh-CN";
      if (/^pt-BR/i.test(tag)) return "pt-BR";
      if (base === "nb" || base === "nn") return "no";
      if (base === "tl") return "fil";
      if (supported(base)) return base;
    }
    return null;
  }
  function list() {
    return CODES.map(function (code) { return { code: code, name: nativeName(code), english: englishName(code), native: NATIVE.indexOf(code) >= 0, rtl: isRtl(code) }; });
  }

  /* ---------- dictionary ---------- */
  var lang = "en", dict = {}, catalog = null, catalogPromise = null, pending = {}, inflight = 0, failed = {};
  var listeners = [];
  function storeKey(l) { return "mhs:i18n:" + VERSION + ":" + l; }
  function readLocal(l) { try { return JSON.parse(localStorage.getItem(storeKey(l))) || {}; } catch (e) { return {}; } }
  var saveTimer = null;
  function saveLocal() {
    clearTimeout(saveTimer);
    var l = lang, d = dict;
    saveTimer = setTimeout(function () { try { localStorage.setItem(storeKey(l), JSON.stringify(d)); } catch (e) {} }, 400);
  }
  function loadCatalog() {
    if (!catalogPromise) catalogPromise = fetch("/i18n/catalog.json").then(function (r) { if (!r.ok) throw Error(); return r.json(); })
      .then(function (c) { catalog = new Set(c); return catalog; })
      .catch(function () { catalogPromise = null; return null; });
    return catalogPromise;
  }

  function emit() {
    var total = catalog ? catalog.size : 0, done = 0;
    if (catalog) catalog.forEach(function (s) { if (dict[s]) done++; });
    var state = { lang: lang, total: total, done: done, busy: inflight > 0 || Object.keys(pending).length > 0 };
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  }

  var flushTimer = null;
  function queue(s) {
    if (!catalog || !catalog.has(s) || dict[s] || pending[s] || failed[s]) return;
    pending[s] = 1;
    clearTimeout(flushTimer); flushTimer = setTimeout(flush, 60);
  }
  function flush() {
    if (inflight >= 3) return;
    var batch = Object.keys(pending).slice(0, 40);
    if (!batch.length) { emit(); return; }
    batch.forEach(function (s) { delete pending[s]; });
    var forLang = lang; inflight++; emit();
    fetch("/api/i18n", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang: forLang, strings: batch }) })
      .then(function (r) { if (!r.ok) throw Error(r.status); return r.json(); })
      .then(function (res) {
        if (forLang !== lang) return;
        var got = (res && res.translations) || {};
        batch.forEach(function (s) { if (got[s]) dict[s] = got[s]; else failed[s] = 1; });
        saveLocal(); scheduleApply();
      })
      .catch(function () { batch.forEach(function (s) { failed[s] = 1; }); setTimeout(function () { failed = {}; }, 60000); })
      .then(function () { inflight--; if (Object.keys(pending).length) flush(); else { emit(); backgroundFill(); } });
    if (Object.keys(pending).length) setTimeout(flush, 0);
  }
  /* Once the visible screen is done, quietly translate the rest of the interface so
   * other tabs and dialogs open already translated. */
  var filling = false;
  function backgroundFill() {
    if (filling || !active() || !catalog || !navigator.onLine) return;
    var todo = []; catalog.forEach(function (s) { if (!dict[s] && !failed[s]) todo.push(s); });
    if (!todo.length) return;
    filling = true;
    setTimeout(function () { filling = false; todo.slice(0, 120).forEach(queue); }, 1500);
  }

  /* ---------- DOM translation ---------- */
  var textOrig = new WeakMap(), attrOrig = new WeakMap();
  /* Every language except English swaps English text in place. For Bengali and Arabic the
   * hand-written translations render first; this only fills in what they don't cover. */
  function active() { return lang !== "en"; }
  function isAutoLang() { return lang !== "en" && NATIVE.indexOf(lang) < 0; }
  function lookup(raw) {
    var s = raw.replace(/\s+/g, " ").trim();
    if (!s || !/[A-Za-z]/.test(s)) return null;
    var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    if (dict[s]) return lead + dict[s] + trail;
    /* Labels with a leading icon or trailing arrow/colon: translate the words only. */
    var m = s.match(/^([^\p{L}]*)(.*?)([^\p{L}.?!)]*)$/u);
    if (m && m[2] && m[2] !== s) {
      if (dict[m[2]]) return lead + m[1] + dict[m[2]] + m[3] + trail;
      queue(m[2]);
    }
    queue(s);
    return null;
  }
  function skipped(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      if (SKIP[n.nodeName] || n.isContentEditable || n.getAttribute("translate") === "no" || (n.classList && n.classList.contains("notranslate"))) return true;
    }
    return false;
  }
  function doText(node) {
    var parent = node.parentNode;
    if (!parent || parent.nodeName === "TEXTAREA" || skipped(parent)) return;
    var rec = textOrig.get(node), value = node.nodeValue;
    if (!rec || (value !== rec.out && value !== rec.orig)) { rec = { orig: value, out: null }; textOrig.set(node, rec); }
    var next = active() ? lookup(rec.orig) : null;
    var target = next || rec.orig;
    rec.out = next;
    if (node.nodeValue !== target) node.nodeValue = target;
  }
  function doAttrs(el) {
    var map = attrOrig.get(el);
    for (var k = 0; k < ATTRS.length; k++) {
      var a = ATTRS[k]; if (!el.hasAttribute(a)) continue;
      var value = el.getAttribute(a), rec = map && map[a];
      if (!rec || (value !== rec.out && value !== rec.orig)) { if (!map) { map = {}; attrOrig.set(el, map); } rec = map[a] = { orig: value, out: null }; }
      var next = active() ? lookup(rec.orig) : null;
      rec.out = next;
      var target = next || rec.orig;
      if (value !== target) el.setAttribute(a, target);
    }
    if (isAutoLang() && isRtl(lang) && el.getAttribute("dir") === "ltr" && !el.closest(".num,[data-keep-dir]")) el.setAttribute("dir", "rtl");
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (skipped(root)) return; doAttrs(root); }
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.nodeType === 1 && SKIP[n.nodeName] ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n; while ((n = tw.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  var dirty = [], applyAll = false, raf = null;
  function scheduleApply(node, attrOnly) {
    if (node) dirty.push(attrOnly ? { attr: node } : node); else applyAll = true;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null; observer.disconnect();
      try {
        if (applyAll) { walk(document.body); document.title = translateString(baseTitle); }
        else dirty.forEach(function (d) { if (d.attr) { if (d.attr.isConnected) doAttrs(d.attr); } else if (d.isConnected) walk(d); });
      } finally { dirty = []; applyAll = false; observe(); }
    });
  }
  var observer = new MutationObserver(function (records) {
    for (var k = 0; k < records.length; k++) {
      var r = records[k];
      if (r.type === "childList") r.addedNodes.forEach(function (n) { scheduleApply(n); });
      else if (r.type === "attributes") scheduleApply(r.target, true);
      else scheduleApply(r.target);
    }
  });
  function observe() {
    if (!document.body || lang === "en" && !touched) return;
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(["dir"]) });
  }
  var baseTitle = document.title, touched = false;
  function translateString(s) { if (!active() || !s) return s; return lookup(s) || s; }

  /* ---------- public ---------- */
  function setLang(next) {
    next = supported(next) ? next : "en";
    if (next === lang && touched) return;
    lang = next; failed = {}; pending = {};
    dict = active() ? readLocal(lang) : {};
    if (lang === "bn" && window.MHSBengali) for (var b in window.MHSBengali) if (!dict[b]) dict[b] = window.MHSBengali[b];
    var html = document.documentElement;
    html.lang = lang; html.dir = isRtl(lang) ? "rtl" : "ltr";
    html.classList.toggle("mhs-auto-lang", isAutoLang());
    if (active() || touched) {
      touched = true;
      observe();
      scheduleApply();
    }
    if (active()) {
      loadCatalog().then(function () { scheduleApply(); emit(); });
      fetch("/api/i18n?lang=" + encodeURIComponent(lang)).then(function (r) { return r.ok ? r.json() : null; }).then(function (res) {
        if (!res || !res.translations || next !== lang) return;
        for (var s in res.translations) dict[s] = res.translations[s];
        saveLocal(); scheduleApply(); emit();
      }).catch(function () {});
    }
    emit();
  }

  window.MHSI18n = {
    codes: CODES.slice(), native: NATIVE.slice(),
    supported: supported, isRtl: isRtl, dir: function (l) { return isRtl(l) ? "rtl" : "ltr"; },
    nativeName: nativeName, englishName: englishName, list: list, deviceLanguage: deviceLanguage,
    isAuto: function (l) { return supported(l) && NATIVE.indexOf(l) < 0; },
    /* Interface language the hand-written modules should render in (others start from English). */
    base: function (l) { return NATIVE.indexOf(l) >= 0 ? l : "en"; },
    locale: function (l) { l = l || lang; return l === "bn" ? "bn-BD" : l; },
    get lang() { return lang; },
    set: setLang,
    t: translateString,
    onChange: function (fn) { listeners.push(fn); emit(); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; }
  };

  /* The app sets <html lang> whenever the language changes; follow it. */
  new MutationObserver(function () {
    var l = document.documentElement.lang;
    if (l && l !== lang && supported(l)) setLang(l);
    else if (l !== lang) { document.documentElement.lang = lang; }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  try {
    var saved = JSON.parse(localStorage.getItem("muhasabah:data:v1") || "null");
    if (saved && supported(saved.lang) && saved.lang !== "en") {
      if (document.body) setLang(saved.lang); else document.addEventListener("DOMContentLoaded", function () { setLang(saved.lang); });
    }
  } catch (e) {}
})();
