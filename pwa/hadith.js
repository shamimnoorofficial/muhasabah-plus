/* Muhasabah — Hadith reader mini-app (opened from the quick-action menu).
 * The six major collections plus An-Nawawi's 40 and the 40 Hadith Qudsi, by book and chapter,
 * with Arabic text, translation (English / Bengali), grades, search within a chapter, share and
 * bookmarks. Text comes from the open hadith-api dataset (jsDelivr CDN) and every chapter you
 * open is cached on this device, so it reads offline afterwards. A small set of essential
 * hadith is built in and always available. Exposes window.MHSHadith { open({book, number}) }. */
(function () {
  "use strict";
  if (window.__mhsHadith) return;
  window.__mhsHadith = true;

  var CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/";
  var BOOKS = [
    { id: "bukhari", en: "Sahih al-Bukhari", bn: "সহীহ বুখারী", ar: "صحيح البخاري", n: 97, count: 7563 },
    { id: "muslim", en: "Sahih Muslim", bn: "সহীহ মুসলিম", ar: "صحيح مسلم", n: 56, count: 7563 },
    { id: "abudawud", en: "Sunan Abi Dawud", bn: "সুনান আবু দাউদ", ar: "سنن أبي داود", n: 43, count: 5274 },
    { id: "tirmidhi", en: "Jami' at-Tirmidhi", bn: "জামে তিরমিযী", ar: "جامع الترمذي", n: 49, count: 3956 },
    { id: "nasai", en: "Sunan an-Nasa'i", bn: "সুনান নাসাঈ", ar: "سنن النسائي", n: 51, count: 5758 },
    { id: "ibnmajah", en: "Sunan Ibn Majah", bn: "সুনান ইবনে মাজাহ", ar: "سنن ابن ماجه", n: 37, count: 4341 },
    { id: "nawawi", en: "An-Nawawi's 40 Hadith", bn: "ইমাম নববীর ৪০ হাদিস", ar: "الأربعون النووية", n: 1, count: 42 },
    { id: "qudsi", en: "40 Hadith Qudsi", bn: "৪০ হাদিসে কুদসী", ar: "الأحاديث القدسية", n: 1, count: 40 }
  ];
  var T = {
    en: { title: "Hadith", sub: "Sayings of the Prophet ﷺ", books: "Collections", essentials: "Essential hadith (always available)", chapters: "Chapters", chapter: "Chapter", hadiths: "hadith", search: "Search in this chapter…", loading: "Loading…", offline: "This chapter isn't saved on this device yet. Connect to the internet once to read it, then it stays available offline.", retry: "Try again", prev: "‹ Previous", next: "Next ›", share: "Share", mark: "Bookmark", marked: "Bookmarked", unmark: "Removed bookmark", marks: "Bookmarks", noMarks: "No bookmarks yet.", none: "Nothing matches.", source: "Text: hadith-api (open data) · Translations may contain errors; always refer to the original.", grade: "Grade", no: "No." },
    bn: { title: "হাদিস", sub: "রাসূল ﷺ-এর বাণী", books: "হাদিস গ্রন্থ", essentials: "নির্বাচিত হাদিস (সবসময় পাওয়া যায়)", chapters: "অধ্যায়", chapter: "অধ্যায়", hadiths: "হাদিস", search: "এই অধ্যায়ে খুঁজুন…", loading: "লোড হচ্ছে…", offline: "এই অধ্যায়টি এখনো ডিভাইসে সংরক্ষিত নেই। একবার ইন্টারনেটে পড়লে এরপর অফলাইনেও পাওয়া যাবে।", retry: "আবার চেষ্টা করুন", prev: "‹ আগের", next: "পরের ›", share: "শেয়ার", mark: "বুকমার্ক", marked: "বুকমার্ক করা হয়েছে", unmark: "বুকমার্ক সরানো হয়েছে", marks: "বুকমার্ক", noMarks: "এখনো কোনো বুকমার্ক নেই।", none: "কিছু পাওয়া যায়নি।", source: "পাঠ: hadith-api (ওপেন ডেটা) · অনুবাদে ভুল থাকতে পারে; মূল পাঠ দেখুন।", grade: "মান", no: "নং" },
    ar: { title: "الحديث", sub: "أقوال النبي ﷺ", books: "الكتب", essentials: "أحاديث مختارة (متاحة دائمًا)", chapters: "الأبواب", chapter: "باب", hadiths: "حديث", search: "ابحث في هذا الباب…", loading: "جارٍ التحميل…", offline: "هذا الباب غير محفوظ على الجهاز بعد. اتصل بالإنترنت مرة واحدة لقراءته، ثم يبقى متاحًا دون اتصال.", retry: "حاول مجددًا", prev: "‹ السابق", next: "التالي ›", share: "مشاركة", mark: "إشارة", marked: "تمت الإشارة", unmark: "أُزيلت الإشارة", marks: "الإشارات", noMarks: "لا إشارات بعد.", none: "لا نتائج.", source: "النص: hadith-api (بيانات مفتوحة)", grade: "الدرجة", no: "رقم" }
  };
  function lang() { var l = document.documentElement.lang || "en"; return T[l] ? l : "en"; }
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k] || k; }
  function edition(book) { return (lang() === "bn" ? "ben-" : "eng-") + book; }
  function num(n) { try { return new Intl.NumberFormat(lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar-EG" : "en-US").format(n); } catch (e) { return String(n); } }
  function jget(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function bookName(b) { return b[lang()] || b.en; }
  function book(id) { return BOOKS.filter(function (b) { return b.id === id; })[0]; }
  var ICON = { marks: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z|M9 8h6" };

  /* ---------- data (memory → IndexedDB → network) ---------- */
  var mem = {};
  function cached(k, load) {
    if (mem[k]) return Promise.resolve(mem[k]);
    var store = window.MHS && window.MHS.get ? window.MHS.get(k).catch(function () { return null; }) : Promise.resolve(null);
    return store.then(function (c) {
      if (c) { mem[k] = c; return c; }
      return load().then(function (v) { mem[k] = v; if (window.MHS && window.MHS.set) window.MHS.set(k, v).catch(function () {}); return v; });
    });
  }
  function getJson(url) { return fetch(url, { cache: "force-cache" }).then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); }); }
  /* Chapter names and hadith ranges for every book (one file, cached). */
  function info() {
    return cached("hadith:info", function () {
      return getJson(CDN + "info.min.json").then(function (j) {
        var out = {};
        BOOKS.forEach(function (b) {
          var m = j[b.id] && j[b.id].metadata; if (!m) return;
          var secs = m.sections || {}, det = m.section_details || {};
          out[b.id] = Object.keys(secs).filter(function (k) { return k !== "0" && secs[k]; }).map(function (k) { var d = det[k] || {}; return { n: Number(k), name: secs[k], first: d.hadithnumber_first, last: d.hadithnumber_last }; });
        });
        return out;
      });
    });
  }
  function chapter(bookId, n) {
    var ed = edition(bookId);
    return cached("hadith:" + ed + ":" + n, function () {
      return Promise.all([getJson(CDN + "editions/" + ed + "/sections/" + n + ".min.json"), getJson(CDN + "editions/ara-" + bookId + "/sections/" + n + ".min.json").catch(function () { return null; })]).then(function (r) {
        var tr = r[0], ar = r[1], arMap = {};
        if (ar && ar.hadiths) ar.hadiths.forEach(function (h) { arMap[h.hadithnumber] = h.text; });
        return { name: tr.metadata && tr.metadata.section ? tr.metadata.section[String(n)] || "" : "", items: (tr.hadiths || []).map(function (h) {
          return { n: h.hadithnumber, ar: arMap[h.hadithnumber] || "", tr: h.text || "", grade: (h.grades || []).map(function (g) { return g.grade; }).filter(function (g, k, a) { return g && a.indexOf(g) === k; }).slice(0, 2).join(" · "), ref: h.reference ? "Book " + h.reference.book + ", Hadith " + h.reference.hadith : "" };
        }) };
      });
    });
  }
  function essentials() { return window.MHSWisdom && window.MHSWisdom.hadiths ? window.MHSWisdom.hadiths() : []; }

  /* ---------- UI ---------- */
  var E = function (tag, attrs, kids) { return window.MHSSheet.el(tag, attrs, kids); };
  var sheet = null, view = "books", curBook = null, curCh = null, hlNo = 0, q = "";
  function marks() { return jget("mhs:hadith:marks", []); }
  function isMarked(b, n) { return marks().some(function (m) { return m.b === b && m.n === n; }); }
  function toggleMark(b, n, title) {
    var m = marks(), on = isMarked(b, n);
    jset("mhs:hadith:marks", (on ? m.filter(function (x) { return !(x.b === b && x.n === n); }) : m.concat([{ b: b, n: n, title: title, at: Date.now() }])).slice(-300));
    window.MHSActions && window.MHSActions.toast(on ? t("unmark") : t("marked"));
    return !on;
  }
  function render() {
    if (!sheet) return;
    var b = sheet.body; b.replaceChildren(); b.scrollTop = 0; sheet.tools.replaceChildren(); sheet.foot.hidden = true; sheet.onBack = null;
    if (view === "books") renderBooks(b); else if (view === "chapters") renderChapters(b); else if (view === "marks") renderMarks(b); else if (view === "essentials") renderEssentials(b); else renderChapter(b);
  }
  function tool(icon, label, fn) { sheet.tools.appendChild(E("button", { type: "button", class: "mhs-mini-ib", "aria-label": label, title: label, on: { click: fn } }, [sheet.icon(icon)])); }
  function renderBooks(b) {
    sheet.setTitle(t("title"), t("sub")); sheet.showBack(false);
    tool(ICON.marks, t("marks"), function () { view = "marks"; render(); });
    b.appendChild(E("button", { type: "button", class: "mhs-q-cont", on: { click: function () { view = "essentials"; render(); } } }, [E("span", null, [E("b", { text: t("essentials") }), E("small", { text: num(essentials().length) + " " + t("hadiths") })]), E("span", { class: "ar", text: "﷽" })]));
    b.appendChild(E("div", { class: "mhs-mini-sec", text: t("books") }));
    var grid = E("div", { class: "mhs-h-book" });
    BOOKS.forEach(function (bk) { grid.appendChild(E("button", { type: "button", class: "mhs-h-bookcard", on: { click: function () { curBook = bk.id; view = "chapters"; render(); } } }, [E("span", { class: "ar", text: bk.ar }), E("b", { text: bookName(bk) }), E("small", { text: num(bk.count) + " " + t("hadiths") + (bk.n > 1 ? " · " + num(bk.n) + " " + t("chapters").toLowerCase() : "") })])); });
    b.appendChild(grid);
    b.appendChild(E("p", { class: "mhs-mini-note", text: t("source") }));
  }
  function renderChapters(b) {
    var bk = book(curBook); if (!bk) { view = "books"; return render(); }
    sheet.setTitle(bookName(bk), bk.ar); sheet.showBack(true); sheet.onBack = function () { view = "books"; render(); return true; };
    if (bk.n === 1) { curCh = 1; view = "chapter"; return render(); }
    var list = E("div", { class: "mhs-mini-list" }); b.appendChild(E("div", { class: "mhs-mini-spin", role: "status" })); b.appendChild(list);
    var fallback = function () { var arr = []; for (var k = 1; k <= bk.n; k++) arr.push({ n: k, name: "" }); return arr; };
    info().then(function (i) { return (i[bk.id] && i[bk.id].length) ? i[bk.id] : fallback(); }).catch(fallback).then(function (chs) {
      if (!sheet || view !== "chapters") return;
      var spin = b.querySelector(".mhs-mini-spin"); if (spin) spin.remove();
      chs.forEach(function (c) { list.appendChild(E("button", { type: "button", class: "mhs-mini-row", on: { click: function () { curCh = c.n; hlNo = 0; view = "chapter"; render(); } } }, [E("span", { class: "mhs-mini-num", text: num(c.n) }), E("span", { class: "txt" }, [E("b", { text: c.name || t("chapter") + " " + num(c.n) }), c.first ? E("small", { text: t("no") + " " + num(c.first) + " – " + num(c.last) }) : null])])); });
    });
  }
  function item(h, bookId) {
    var row = E("div", { class: "mhs-h-item" + (h.n === hlNo ? " is-hl" : ""), id: "mhs-h-" + h.n });
    var bk = book(bookId);
    row.appendChild(E("div", { class: "ref" }, [E("b", { text: (bk ? bookName(bk) : "") + " " + num(h.n) }), h.ref ? E("span", { text: h.ref }) : null]));
    if (h.ar) row.appendChild(E("div", { class: "ar", lang: "ar", text: h.ar }));
    if (h.tr) row.appendChild(E("div", { class: "tr", text: h.tr }));
    if (h.grade) row.appendChild(E("span", { class: "grade", text: t("grade") + ": " + h.grade }));
    var on = isMarked(bookId, h.n);
    var mk = E("button", { type: "button", class: on ? "is-on" : "", text: (on ? "★ " : "☆ ") + t("mark"), on: { click: function () { var now = toggleMark(bookId, h.n, (bk ? bk.en : "") + " " + h.n); mk.textContent = (now ? "★ " : "☆ ") + t("mark"); mk.className = now ? "is-on" : ""; } } });
    var sh = E("button", { type: "button", text: "↗ " + t("share"), on: { click: function () { window.MHSActions.share((h.ar ? h.ar + "\n\n" : "") + h.tr + "\n— " + (bk ? bk.en : "") + " " + h.n, t("title")); } } });
    row.appendChild(E("div", { class: "tools" }, [mk, sh]));
    return row;
  }
  function renderChapter(b) {
    var bk = book(curBook); if (!bk) { view = "books"; return render(); }
    sheet.setTitle(bookName(bk), t("chapter") + " " + num(curCh)); sheet.showBack(true);
    sheet.onBack = function () { view = bk.n === 1 ? "books" : "chapters"; render(); return true; };
    var inp = E("input", { type: "search", placeholder: t("search"), "aria-label": t("search"), autocomplete: "off" });
    b.appendChild(E("div", { class: "mhs-mini-search" }, [inp]));
    var wrap = E("div"); b.appendChild(E("div", { class: "mhs-mini-spin", role: "status" })); b.appendChild(wrap);
    if (bk.n > 1) {
      sheet.foot.hidden = false; sheet.foot.replaceChildren();
      sheet.foot.appendChild(E("button", { type: "button", class: "mhs-btn", disabled: curCh <= 1 ? "" : null, text: t("prev"), on: { click: function () { curCh--; hlNo = 0; render(); } } }));
      sheet.foot.appendChild(E("span", { class: "mhs-mini-note", text: num(curCh) + " / " + num(bk.n) }));
      sheet.foot.appendChild(E("button", { type: "button", class: "mhs-btn", disabled: curCh >= bk.n ? "" : null, text: t("next"), on: { click: function () { curCh++; hlNo = 0; render(); } } }));
    }
    var want = curBook + ":" + curCh;
    chapter(curBook, curCh).then(function (d) {
      if (!sheet || curBook + ":" + curCh !== want) return;
      var spin = b.querySelector(".mhs-mini-spin"); if (spin) spin.remove();
      if (d.name) sheet.setTitle(bookName(bk), d.name);
      function fill() {
        wrap.replaceChildren(); var qq = inp.value.trim().toLowerCase(), n = 0;
        d.items.forEach(function (h) { if (qq && String(h.n) !== qq && h.tr.toLowerCase().indexOf(qq) < 0 && h.ar.indexOf(qq) < 0) return; n++; wrap.appendChild(item(h, curBook)); });
        if (!n) wrap.appendChild(E("p", { class: "mhs-mini-msg", text: t("none") }));
      }
      inp.addEventListener("input", fill); fill();
      if (hlNo) setTimeout(function () { var r = b.querySelector("#mhs-h-" + hlNo); if (r) r.scrollIntoView({ block: "center" }); }, 60);
    }).catch(function () {
      if (!sheet || curBook + ":" + curCh !== want) return;
      var spin = b.querySelector(".mhs-mini-spin"); if (spin) spin.remove();
      wrap.appendChild(E("div", { class: "mhs-mini-msg" }, [E("p", { text: t("offline") }), E("button", { type: "button", class: "mhs-btn primary", text: t("retry"), on: { click: render } })]));
    });
  }
  function renderEssentials(b) {
    sheet.setTitle(t("essentials"), t("title")); sheet.showBack(true); sheet.onBack = function () { view = "books"; render(); return true; };
    essentials().forEach(function (h) { b.appendChild(item({ n: h.n, ar: h.ar, tr: h[lang()] || h.en, grade: "", ref: "" }, h.book)); });
  }
  function renderMarks(b) {
    sheet.setTitle(t("marks"), t("title")); sheet.showBack(true); sheet.onBack = function () { view = "books"; render(); return true; };
    var m = marks().slice().reverse(); if (!m.length) return b.appendChild(E("p", { class: "mhs-mini-msg", text: t("noMarks") }));
    var list = E("div", { class: "mhs-mini-list" });
    m.forEach(function (x) { var bk = book(x.b); if (!bk) return; list.appendChild(E("button", { type: "button", class: "mhs-mini-row", on: { click: function () { window.MHSHadith.open({ book: x.b, number: x.n }); } } }, [E("span", { class: "mhs-mini-num", text: num(x.n) }), E("span", { class: "txt" }, [E("b", { text: bookName(bk) }), E("small", { text: t("no") + " " + num(x.n) })]), E("span", { class: "ar", text: bk.ar })])); });
    b.appendChild(list);
  }
  /* Jump to a hadith by number: find its chapter from the index, then open that chapter. */
  function goTo(bookId, n) {
    var bk = book(bookId); if (!bk) return;
    curBook = bookId; hlNo = Number(n) || 0;
    if (bk.n === 1) { curCh = 1; view = "chapter"; return render(); }
    view = "chapter"; curCh = curCh || 1; sheet.body.replaceChildren(E("div", { class: "mhs-mini-spin", role: "status" }));
    info().then(function (i) {
      var chs = i[bookId] || [], hit = chs.filter(function (c) { return c.first <= hlNo && hlNo <= c.last; })[0];
      if (hit) curCh = hit.n; else { var ess = essentials().filter(function (h) { return h.book === bookId && h.n === hlNo; })[0]; if (ess) { view = "essentials"; return render(); } curCh = 1; }
      render();
    }).catch(function () { view = "essentials"; render(); });
  }

  window.MHSHadith = {
    books: BOOKS,
    open: function (o) {
      if (!window.MHSSheet) return;
      if (!sheet || !sheet.dialog.open) sheet = window.MHSSheet.open({ id: "mhs-hadith", title: t("title"), sub: t("sub"), onClose: function () { sheet = null; } });
      if (o && o.book) goTo(o.book, o.number); else { view = "books"; render(); }
    }
  };
})();
