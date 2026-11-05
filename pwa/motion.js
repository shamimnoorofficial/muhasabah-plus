/* Muhasabah — celebration & feedback layer.
 * Listens for "mhs:points" (fired by the app when points change) and adds:
 * a confetti burst from the tapped spot, a points "bump", haptics, and one-time
 * banners for streak milestones and finishing every habit of the day.
 * Respects prefers-reduced-motion (no particles, banners still appear).
 */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var MILESTONES = [3, 7, 14, 21, 30, 40, 60, 100, 150, 200, 365];
  var lastTap = null;
  var T = {
    en: { streak: function (n) { return n + "-day streak! MashaAllah"; }, streakSub: "Keep the chain going tomorrow.", all: "Every habit done today!", allSub: "Alhamdulillah — a complete day." },
    bn: { streak: function (n) { return n + " দিনের ধারাবাহিকতা! মাশাআল্লাহ"; }, streakSub: "আগামীকালও ধারাবাহিকতা ধরে রাখুন।", all: "আজকের সব অভ্যাস সম্পন্ন!", allSub: "আলহামদুলিল্লাহ — একটি পূর্ণ দিন।" },
    ar: { streak: function (n) { return "سلسلة " + n + " أيام! ما شاء الله"; }, streakSub: "واصل السلسلة غدًا.", all: "أنجزت كل عادات اليوم!", allSub: "الحمد لله — يوم كامل." }
  };
  function lang() { var l = document.documentElement.lang; return T[l] ? l : "en"; }
  function toBn(s) { return lang() === "bn" ? String(s).replace(/\d/g, function (c) { return "০১২৩৪৫৬৭৮৯"[c]; }) : lang() === "ar" ? String(s).replace(/\d/g, function (c) { return "٠١٢٣٤٥٦٧٨٩"[c]; }) : String(s); }

  document.addEventListener("pointerdown", function (e) { lastTap = { x: e.clientX, y: e.clientY, t: Date.now() }; }, { capture: true, passive: true });

  /* ---------- confetti (single canvas, removed when idle) ---------- */
  var canvas = null, ctx = null, parts = [], raf = 0;
  var COLORS = ["#00C853", "#69F0AE", "#FFD54F", "#E5C07B", "#FFFFFF", "#4FC3F7"];
  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.className = "mhs-confetti";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
  }
  function resize() {
    if (!canvas) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resize, { passive: true });
  function burst(x, y, count, spread) {
    if (reduce.matches) return;
    ensureCanvas();
    for (var i = 0; i < count; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * spread;
      var v = 4 + Math.random() * 7;
      parts.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        r: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0], life: 0, max: 55 + Math.random() * 35,
        shape: Math.random() < 0.3 ? 1 : 0
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.life < p.max && p.y < innerHeight + 20; });
    parts.forEach(function (p) {
      p.life++; p.vy += 0.22; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.fillStyle = p.c;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.shape) { ctx.beginPath(); ctx.arc(0, 0, p.r * 0.6, 0, 6.283); ctx.fill(); }
      else ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(tick);
    else { raf = 0; canvas.remove(); canvas = null; ctx = null; }
  }

  /* ---------- banner ---------- */
  var bannerTimer = 0;
  function banner(icon, title, sub) {
    var el = document.getElementById("mhs-celebrate");
    if (!el) {
      el = document.createElement("div");
      el.id = "mhs-celebrate";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
      el.addEventListener("click", function () { el.classList.remove("show"); });
    }
    el.innerHTML = '<span class="ic" aria-hidden="true"></span><span class="tx"><b></b><small></small></span>';
    el.querySelector(".ic").textContent = icon;
    el.querySelector("b").textContent = title;
    el.querySelector("small").textContent = sub;
    el.dir = lang() === "ar" ? "rtl" : "ltr";
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () { el.classList.remove("show"); }, 3600);
  }

  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (_) {} }

  /* ---------- milestone checks ---------- */
  var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function dayKey(d) { return window.MHS && window.MHS.dayKey ? window.MHS.dayKey(d) : d.toDateString(); }
  function seen(id) { try { var s = JSON.parse(localStorage.getItem("mhs:celebrated") || "{}"); return !!s[id]; } catch (_) { return false; } }
  function mark(id) { try { var s = JSON.parse(localStorage.getItem("mhs:celebrated") || "{}"); s[id] = Date.now(); localStorage.setItem("mhs:celebrated", JSON.stringify(s)); } catch (_) {} }

  function checkMilestones() {
    var data = window.MHS && window.MHS.current && window.MHS.current();
    if (!data || !window.MHSInsights) return false;
    var today = new Date(), tk = dayKey(today);
    var st = window.MHSInsights.compute(data, 7).streak.current;
    if (MILESTONES.indexOf(st) !== -1 && !seen("streak-" + st + "-" + tk)) {
      mark("streak-" + st + "-" + tk);
      big(); vibrate([30, 60, 30, 60, 80]);
      banner("🔥", T[lang()].streak(toBn(st)), T[lang()].streakSub);
      return true;
    }
    var habits = (data.habits || []).filter(function (h) {
      var rep = Array.isArray(h.repeat) && h.repeat.length ? h.repeat : WD;
      return h && h.status !== "archived" && rep.indexOf(WD[today.getDay()]) !== -1;
    });
    if (habits.length && !seen("all-" + tk)) {
      var done = new Set((data.ledger || []).filter(function (t) { return t.type === "checkIn" && dayKey(new Date(t.ts)) === tk; }).map(function (t) { return t.habitId; }));
      if (habits.every(function (h) { return done.has(h.id); })) {
        mark("all-" + tk);
        big(); vibrate([40, 50, 40]);
        banner("🌙", T[lang()].all, T[lang()].allSub);
        return true;
      }
    }
    return false;
  }
  function big() {
    burst(innerWidth * 0.25, innerHeight * 0.55, 60, 1.6);
    setTimeout(function () { burst(innerWidth * 0.75, innerHeight * 0.55, 60, 1.6); }, 140);
    setTimeout(function () { burst(innerWidth * 0.5, innerHeight * 0.45, 70, 2.2); }, 300);
  }

  function bump() {
    document.querySelectorAll("header .num, .ticker-glow .num.text-5xl").forEach(function (n) {
      n.classList.remove("mhs-bump"); void n.offsetWidth; n.classList.add("mhs-bump");
    });
  }

  addEventListener("mhs:points", function (e) {
    var text = String((e.detail && e.detail.text) || "");
    var gain = text.charAt(0) === "+";
    requestAnimationFrame(bump);
    if (!gain) { vibrate([20, 40, 20]); return; }
    var tap = lastTap && Date.now() - lastTap.t < 1500 ? lastTap : { x: innerWidth / 2, y: innerHeight * 0.6 };
    burst(tap.x, tap.y, 26, 1.3);
    /* Saving runs in a React effect right after the state update — read the stored data a moment later. */
    setTimeout(checkMilestones, 160);
  });

  window.MHSMotion = { burst: burst, banner: banner, celebrate: big };
})();
