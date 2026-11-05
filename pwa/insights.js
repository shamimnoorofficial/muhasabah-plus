/* Muhasabah — progress insights (computed on this device from the habit ledger).
 * Renders <mhs-insights lang="en|bn|ar"> on the dashboard: weekly / monthly summary,
 * daily points chart, comparison with the previous period and per-habit statistics.
 */
(function () {
  "use strict";
  var DAY = 86400000;
  var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var T = {
    en: {
      eyebrow: "Insights", title: "Your progress", week: "7 days", month: "30 days",
      earned: "Earned", lost: "Lost", net: "Net", rate: "Completion", streak: "Current streak",
      best: "Best streak", active: "Active days", vsPrev: "vs previous", same: "same as before",
      daily: "Daily points", perHabit: "Habit by habit", bestDay: "Strongest day",
      done: "done", of: "of", days: "d", empty: "Complete a habit to start seeing insights.",
      noHabits: "Add habits to see statistics per habit.", top: "Most consistent", needs: "Needs attention",
      wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    bn: {
      eyebrow: "অগ্রগতি", title: "আপনার অগ্রগতি", week: "৭ দিন", month: "৩০ দিন",
      earned: "অর্জিত", lost: "কাটা গেছে", net: "নিট", rate: "সম্পন্নের হার", streak: "চলতি ধারাবাহিকতা",
      best: "সেরা ধারাবাহিকতা", active: "সক্রিয় দিন", vsPrev: "আগের তুলনায়", same: "আগের মতোই",
      daily: "দৈনিক পয়েন্ট", perHabit: "প্রতিটি অভ্যাস", bestDay: "সবচেয়ে ভালো দিন",
      done: "সম্পন্ন", of: "/", days: "দি", empty: "অগ্রগতি দেখতে একটি অভ্যাস সম্পন্ন করুন।",
      noHabits: "প্রতিটি অভ্যাসের পরিসংখ্যান দেখতে অভ্যাস যোগ করুন।", top: "সবচেয়ে নিয়মিত", needs: "মনোযোগ দরকার",
      wd: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"]
    },
    ar: {
      eyebrow: "رؤى", title: "تقدّمك", week: "٧ أيام", month: "٣٠ يومًا",
      earned: "المكتسب", lost: "المخصوم", net: "الصافي", rate: "نسبة الإنجاز", streak: "السلسلة الحالية",
      best: "أفضل سلسلة", active: "أيام نشطة", vsPrev: "مقارنة بالسابق", same: "كما كان",
      daily: "النقاط اليومية", perHabit: "عادة بعادة", bestDay: "أقوى يوم",
      done: "منجز", of: "من", days: "ي", empty: "أنجز عادة لتبدأ برؤية التقدّم.",
      noHabits: "أضف عادات لرؤية إحصاءات كل عادة.", top: "الأكثر انتظامًا", needs: "تحتاج اهتمامًا",
      wd: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
    }
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function startOfDay(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function num(n, lang) {
    var s = String(n);
    if (lang === "bn") return s.replace(/\d/g, function (c) { return "০১২৩৪৫৬৭৮৯"[c]; });
    if (lang === "ar") return s.replace(/\d/g, function (c) { return "٠١٢٣٤٥٦٧٨٩"[c]; });
    return s;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function isCheck(t) { return t && (t.type === "checkIn" || t.type === "todoCheckIn"); }

  /* Consecutive days (ending today, or yesterday if today has no check-in yet) with a check-in. */
  function streaks(dayset) {
    var today = startOfDay(Date.now());
    var cur = 0, d = dayset.has(key(today)) ? today : addDays(today, -1);
    while (dayset.has(key(d))) { cur++; d = addDays(d, -1); }
    var all = Array.from(dayset).sort(), best = 0, run = 0, prev = null;
    all.forEach(function (k) {
      var dt = new Date(k + "T00:00:00");
      run = prev && Math.round((dt - prev) / DAY) === 1 ? run + 1 : 1;
      best = Math.max(best, run); prev = dt;
    });
    return { current: cur, best: Math.max(best, cur) };
  }

  function compute(data, span) {
    var ledger = Array.isArray(data && data.ledger) ? data.ledger : [];
    var habits = (Array.isArray(data && data.habits) ? data.habits : []).filter(function (h) { return h && h.status !== "archived"; });
    var today = startOfDay(Date.now());
    var from = addDays(today, -(span - 1));
    var prevFrom = addDays(from, -span);
    var days = [];
    for (var i = 0; i < span; i++) { var d = addDays(from, i); days.push({ key: key(d), date: d, net: 0, plus: 0, minus: 0, checks: 0 }); }
    var byKey = {}; days.forEach(function (x) { byKey[x.key] = x; });
    var earned = 0, lost = 0, prevNet = 0, checkDays = new Set(), wdNet = [0, 0, 0, 0, 0, 0, 0];
    var perHabit = {};
    ledger.forEach(function (t) {
      var ts = Number(t.ts), delta = Number(t.delta);
      if (!isFinite(ts) || !isFinite(delta)) return;
      var dk = key(new Date(ts));
      if (isCheck(t)) checkDays.add(dk);
      if (ts >= prevFrom.getTime() && ts < from.getTime()) prevNet += delta;
      var slot = byKey[dk];
      if (!slot) return;
      slot.net += delta;
      if (delta > 0) { slot.plus += delta; earned += delta; } else { slot.minus += delta; lost += delta; }
      wdNet[new Date(ts).getDay()] += delta;
      if (t.type === "checkIn" && t.habitId) {
        slot.checks++;
        var ph = perHabit[t.habitId] || (perHabit[t.habitId] = new Set());
        ph.add(dk);
      }
    });
    var expected = 0, completed = 0;
    var habitStats = habits.map(function (h) {
      var rep = Array.isArray(h.repeat) && h.repeat.length ? h.repeat : WD;
      var created = h.createdAt ? startOfDay(h.createdAt) : from;
      var due = 0, done = 0, dots = [];
      var set = perHabit[h.id] || new Set();
      days.forEach(function (x) {
        var scheduled = rep.indexOf(WD[x.date.getDay()]) !== -1 && x.date >= created;
        var hit = set.has(x.key);
        if (scheduled) { due++; if (hit) done++; }
        else if (hit) done++, due++;
      });
      days.slice(-7).forEach(function (x) {
        dots.push(set.has(x.key) ? 2 : rep.indexOf(WD[x.date.getDay()]) !== -1 && x.date >= created && x.date < today ? 1 : 0);
      });
      var hs = 0, d = set.has(key(today)) ? today : addDays(today, -1);
      while (set.has(key(d))) { hs++; d = addDays(d, -1); }
      expected += due; completed += done;
      return { id: h.id, title: h.title || "—", icon: h.icon || "", due: due, done: done, rate: due ? done / due : 0, streak: hs, dots: dots };
    }).sort(function (a, b) { return b.rate - a.rate || b.done - a.done; });
    var best = -1, bestDay = null;
    wdNet.forEach(function (v, i) { if (v > best) { best = v; bestDay = i; } });
    var net = earned + lost;
    return {
      days: days, earned: earned, lost: lost, net: net, prevNet: prevNet,
      rate: expected ? completed / expected : 0, hasExpected: expected > 0,
      activeDays: days.filter(function (x) { return x.checks > 0 || x.plus > 0; }).length,
      streak: streaks(checkDays), habits: habitStats, bestDay: best > 0 ? bestDay : null,
      any: ledger.length > 0
    };
  }

  function chart(days, lang) {
    var w = 320, h = 120, pad = 6, n = days.length;
    var max = Math.max(1, Math.max.apply(null, days.map(function (d) { return Math.abs(d.net); })));
    var hasNeg = days.some(function (d) { return d.net < 0; });
    var zero = hasNeg ? h / 2 : h - 14;
    var scale = (hasNeg ? h / 2 - pad : h - 14 - pad) / max;
    var bw = (w - pad * 2) / n, gap = n > 10 ? 1.5 : 6;
    var bars = days.map(function (d, i) {
      var bh = Math.max(d.net === 0 ? 0 : 2, Math.abs(d.net) * scale);
      var y = d.net >= 0 ? zero - bh : zero;
      var x = pad + i * bw + gap / 2;
      var cls = d.net >= 0 ? "pos" : "neg";
      var label = d.date.toLocaleDateString(lang === "bn" ? "bn-BD" : lang === "ar" ? "ar" : "en", { weekday: "short", day: "numeric", month: "short" }) + ": " + (d.net > 0 ? "+" : "") + num(d.net, lang);
      return '<rect class="' + cls + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(1, bw - gap).toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="' + Math.min(3, (bw - gap) / 2).toFixed(1) + '" style="--i:' + i + '"><title>' + esc(label) + "</title></rect>";
    }).join("");
    var labels = n <= 7 ? days.map(function (d, i) {
      return '<text x="' + (pad + i * bw + bw / 2).toFixed(1) + '" y="' + (h - 2) + '" text-anchor="middle">' + esc(T[lang].wd[d.date.getDay()]) + "</text>";
    }).join("") : "";
    return '<svg class="mhs-ins-chart" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" role="img" aria-label="' + esc(T[lang].daily) + '">' +
      '<line class="axis" x1="0" x2="' + w + '" y1="' + zero + '" y2="' + zero + '"/>' + bars + (hasNeg ? "" : labels) + "</svg>";
  }

  function delta(cur, prev, t, lang) {
    var diff = cur - prev;
    if (diff === 0) return '<span class="mhs-ins-delta">' + esc(t.same) + "</span>";
    return '<span class="mhs-ins-delta ' + (diff > 0 ? "up" : "down") + '">' + (diff > 0 ? "▲ +" : "▼ ") + num(diff, lang) + " " + esc(t.vsPrev) + "</span>";
  }

  function render(el) {
    var lang = T[el.getAttribute("lang")] ? el.getAttribute("lang") : "en";
    var t = T[lang];
    var span = el._span || 7;
    var data = (window.MHS && window.MHS.current && window.MHS.current()) || {};
    var s = compute(data, span);
    var pct = Math.round(s.rate * 100);
    var ring = 2 * Math.PI * 26;
    var tiles = [
      { k: t.earned, v: "+" + num(s.earned, lang), c: "pos" },
      { k: t.lost, v: num(s.lost, lang), c: "neg" },
      { k: t.streak, v: num(s.streak.current, lang) + t.days, c: "" },
      { k: t.best, v: num(s.streak.best, lang) + t.days, c: "" },
      { k: t.active, v: num(s.activeDays, lang) + " / " + num(span, lang), c: "" },
      { k: t.bestDay, v: s.bestDay == null ? "—" : t.wd[s.bestDay], c: "" }
    ];
    var habitsHtml = s.habits.length ? s.habits.map(function (h, i) {
      var p = Math.round(h.rate * 100);
      return '<li class="mhs-ins-habit" style="--i:' + i + '">' +
        '<div class="mhs-ins-hrow"><span class="mhs-ins-hname">' + (h.icon ? '<span aria-hidden="true">' + esc(h.icon) + "</span> " : "") + esc(h.title) + "</span>" +
        '<span class="num mhs-ins-hval">' + num(h.done, lang) + " " + esc(t.of) + " " + num(h.due, lang) + (h.streak > 1 ? ' · 🔥' + num(h.streak, lang) : "") + "</span></div>" +
        '<div class="mhs-ins-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '" aria-label="' + esc(h.title) + '"><i style="--w:' + p + '%" class="' + (p >= 80 ? "hi" : p >= 50 ? "mid" : "lo") + '"></i></div>' +
        '<div class="mhs-ins-dots" aria-hidden="true">' + h.dots.map(function (d) { return '<b class="d' + d + '"></b>'; }).join("") + "</div></li>";
    }).join("") : '<li class="mhs-ins-empty">' + esc(t.noHabits) + "</li>";

    el.innerHTML =
      '<section class="panel mhs-insights" dir="' + (lang === "ar" ? "rtl" : "ltr") + '" aria-labelledby="mhs-ins-h">' +
      '<header class="mhs-ins-head"><div><div class="mhs-ins-eyebrow">' + esc(t.eyebrow) + '</div><h2 id="mhs-ins-h">' + esc(t.title) + "</h2></div>" +
      '<div class="mhs-ins-seg" role="tablist">' +
      '<button type="button" role="tab" data-span="7" aria-selected="' + (span === 7) + '">' + esc(t.week) + "</button>" +
      '<button type="button" role="tab" data-span="30" aria-selected="' + (span === 30) + '">' + esc(t.month) + "</button></div></header>" +
      (s.any ? "" : '<p class="mhs-ins-empty">' + esc(t.empty) + "</p>") +
      '<div class="mhs-ins-top">' +
      '<div class="mhs-ins-ring" title="' + esc(t.rate) + '"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" class="track"/><circle cx="32" cy="32" r="26" class="fill" style="stroke-dasharray:' + ring.toFixed(1) + ";--off:" + (ring * (1 - (s.hasExpected ? s.rate : 0))).toFixed(1) + '"/></svg>' +
      '<div><b class="num">' + (s.hasExpected ? num(pct, lang) + "%" : "—") + "</b><span>" + esc(t.rate) + "</span></div></div>" +
      '<div class="mhs-ins-net"><span>' + esc(t.net) + '</span><b class="num ' + (s.net >= 0 ? "pos" : "neg") + '">' + (s.net > 0 ? "+" : "") + num(s.net, lang) + "</b>" + delta(s.net, s.prevNet, t, lang) + "</div></div>" +
      '<div class="mhs-ins-chartwrap"><div class="mhs-ins-label">' + esc(t.daily) + "</div>" + chart(s.days, lang) + "</div>" +
      '<div class="mhs-ins-tiles">' + tiles.map(function (x, i) { return '<div class="mhs-ins-tile" style="--i:' + i + '"><span>' + esc(x.k) + '</span><b class="num ' + x.c + '">' + esc(x.v) + "</b></div>"; }).join("") + "</div>" +
      '<div class="mhs-ins-label">' + esc(t.perHabit) + '</div><ul class="mhs-ins-habits">' + habitsHtml + "</ul></section>";
  }

  class MhsInsights extends HTMLElement {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() {
      var self = this;
      this._span = +(sessionStorage.getItem("mhs:ins-span") || 7) === 30 ? 30 : 7;
      this._refresh = function () { clearTimeout(self._t); self._t = setTimeout(function () { if (self.isConnected) render(self); }, 80); };
      this.addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("[data-span]");
        if (!b) return;
        self._span = +b.getAttribute("data-span");
        try { sessionStorage.setItem("mhs:ins-span", String(self._span)); } catch (_) {}
        render(self);
      });
      window.addEventListener("mhs:points", this._refresh);
      window.addEventListener("mhs:saved", this._refresh);
      render(this);
    }
    disconnectedCallback() { window.removeEventListener("mhs:points", this._refresh); window.removeEventListener("mhs:saved", this._refresh); }
    attributeChangedCallback() { if (this.isConnected && this._refresh) render(this); }
  }
  if (window.MHS && window.MHS.onSave) window.MHS.onSave(function () { window.dispatchEvent(new Event("mhs:saved")); });
  if (window.customElements && !customElements.get("mhs-insights")) customElements.define("mhs-insights", MhsInsights);
  window.MHSInsights = { compute: compute };
})();
