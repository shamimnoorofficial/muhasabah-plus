/* Muhasabah — Prayer & Qibla mini-app (opened from the quick-action menu).
 * Today's prayer times from the on-device calculator (pwa/prayer.js), a live Qibla compass
 * using the phone's orientation sensors, and nearby mosques through Google Maps.
 * Everything except the optional map works offline. Exposes window.MHSQibla { open(), bearing() }. */
(function () {
  "use strict";
  var KAABA = { lat: 21.422487, lng: 39.826206 };
  var rad = Math.PI / 180;
  /* Great-circle initial bearing from (lat, lng) to the Kaaba, in degrees clockwise from true north. */
  function bearing(lat, lng) {
    var p1 = lat * rad, p2 = KAABA.lat * rad, dl = (KAABA.lng - lng) * rad;
    var y = Math.sin(dl) * Math.cos(p2), x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return ((Math.atan2(y, x) / rad) + 360) % 360;
  }
  function distanceKm(lat, lng) {
    var p1 = lat * rad, p2 = KAABA.lat * rad, dp = (KAABA.lat - lat) * rad, dl = (KAABA.lng - lng) * rad;
    var a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  var API = { bearing: bearing, distanceKm: distanceKm, KAABA: KAABA };
  if (typeof window !== "undefined") window.MHSQibla = API;
  if (typeof document === "undefined" || window.__mhsQibla) return;
  window.__mhsQibla = true;

  var T = {
    en: { title: "Prayer & Qibla", sub: "Times, compass and mosques nearby", times: "Prayer times today", qibla: "Qibla direction", mosques: "Mosques nearby", now: "Now", next: "Next", in: "in", left: "left", noLoc: "Allow location (or pick a city in Settings) to see exact times and the Qibla for where you are.", allow: "Use my location", settings: "Prayer settings", locating: "Finding your location…", denied: "Location is blocked. Allow it in your phone settings or pick a city in Settings.", fromN: "from north", km: "km to Makkah", aligned: "You're facing the Qibla", turn: "Turn {d}° {dir}", left2: "left", right: "right", compassOff: "Tap to start the compass", compassNo: "No compass sensor on this device. Use the bearing with a physical compass or a map.", compassHint: "Hold the phone flat and move it in a figure of 8 to calibrate.", mapBtn: "Show map", mapHint: "Loads Google Maps (internet needed).", openMaps: "Open in Google Maps", names: { fajr: "Fajr", sunrise: "Sunrise", dhuhr: "Dhuhr", asr: "Asr", sunset: "Maghrib", isha: "Isha" } },
    bn: { title: "নামাজ ও কিবলা", sub: "সময়, কম্পাস ও কাছের মসজিদ", times: "আজকের নামাজের সময়", qibla: "কিবলার দিক", mosques: "কাছের মসজিদ", now: "এখন", next: "পরবর্তী", in: "বাকি", left: "বাকি", noLoc: "সঠিক সময় ও কিবলা দেখতে লোকেশন অনুমতি দিন (অথবা সেটিংসে একটি শহর বেছে নিন)।", allow: "আমার লোকেশন ব্যবহার করুন", settings: "নামাজের সেটিংস", locating: "লোকেশন খোঁজা হচ্ছে…", denied: "লোকেশন বন্ধ আছে। ফোনের সেটিংসে অনুমতি দিন বা সেটিংসে শহর বেছে নিন।", fromN: "উত্তর থেকে", km: "কিমি মক্কা পর্যন্ত", aligned: "আপনি কিবলামুখী আছেন", turn: "{d}° {dir} ঘুরুন", left2: "বামে", right: "ডানে", compassOff: "কম্পাস চালু করতে চাপুন", compassNo: "এই ডিভাইসে কম্পাস সেন্সর নেই। কোণটি একটি কম্পাস বা মানচিত্রে ব্যবহার করুন।", compassHint: "ফোন সমতল রেখে ৮-এর মতো ঘুরিয়ে ক্যালিব্রেট করুন।", mapBtn: "মানচিত্র দেখান", mapHint: "Google Maps লোড হবে (ইন্টারনেট লাগবে)।", openMaps: "Google Maps-এ খুলুন", names: { fajr: "ফজর", sunrise: "সূর্যোদয়", dhuhr: "যোহর", asr: "আসর", sunset: "মাগরিব", isha: "এশা" } },
    ar: { title: "الصلاة والقبلة", sub: "المواقيت والبوصلة والمساجد القريبة", times: "مواقيت الصلاة اليوم", qibla: "اتجاه القبلة", mosques: "المساجد القريبة", now: "الآن", next: "التالية", in: "بعد", left: "متبقية", noLoc: "اسمح بالموقع (أو اختر مدينة في الإعدادات) لعرض المواقيت الدقيقة والقبلة لمكانك.", allow: "استخدم موقعي", settings: "إعدادات الصلاة", locating: "جارٍ تحديد موقعك…", denied: "الموقع محظور. اسمح به من إعدادات الهاتف أو اختر مدينة في الإعدادات.", fromN: "من الشمال", km: "كم إلى مكة", aligned: "أنت تواجه القبلة", turn: "در {d}° إلى {dir}", left2: "اليسار", right: "اليمين", compassOff: "اضغط لتشغيل البوصلة", compassNo: "لا يوجد مستشعر بوصلة في هذا الجهاز. استخدم الزاوية مع بوصلة أو خريطة.", compassHint: "أمسك الهاتف أفقيًا وحرّكه على شكل 8 للمعايرة.", mapBtn: "عرض الخريطة", mapHint: "يتم تحميل خرائط Google (يلزم الإنترنت).", openMaps: "افتح في خرائط Google", names: { fajr: "الفجر", sunrise: "الشروق", dhuhr: "الظهر", asr: "العصر", sunset: "المغرب", isha: "العشاء" } }
  };
  function lang() { var l = document.documentElement.lang || "en"; return T[l] ? l : "en"; }
  function t(k, v) { var s = (T[lang()] || T.en)[k]; if (s === undefined) s = T.en[k]; if (typeof s === "string" && v) Object.keys(v).forEach(function (x) { s = s.split("{" + x + "}").join(v[x]); }); return s; }
  function loc() { return lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar-EG" : "en-US"; }
  function hm(ms) { try { return new Date(ms).toLocaleTimeString(loc(), { hour: "numeric", minute: "2-digit" }); } catch (e) { return new Date(ms).toTimeString().slice(0, 5); } }
  function num(n) { try { return new Intl.NumberFormat(loc()).format(n); } catch (e) { return String(n); } }
  function dur(ms) { var m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60); return (h ? num(h) + "h " : "") + num(m % 60) + "m"; }
  var E = function (tag, attrs, kids) { return window.MHSSheet.el(tag, attrs, kids); };

  var sheet = null, heading = null, listening = false, tick = null, mapOn = false, currentApply = null;
  function onOrient(e) {
    var h = null;
    if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
    else if (e.absolute !== false && typeof e.alpha === "number") h = (360 - e.alpha) % 360;
    if (h === null) return;
    heading = (heading === null) ? h : heading + (((h - heading + 540) % 360) - 180) * 0.35; // smooth
    heading = (heading + 360) % 360;
    if (currentApply) currentApply();
  }
  function stopCompass() {
    window.removeEventListener("deviceorientationabsolute", onOrient, true);
    window.removeEventListener("deviceorientation", onOrient, true);
    listening = false; currentApply = null;
  }
  function P() { return window.MHSPrayer; }
  function where() { var c = P() && P().config(); return c && c.lat !== null && c.lng !== null ? c : null; }

  function render() {
    if (!sheet) return;
    var b = sheet.body; b.replaceChildren(); sheet.tools.replaceChildren(); sheet.foot.hidden = true;
    sheet.setTitle(t("title"), t("sub"));
    sheet.tools.appendChild(E("button", { type: "button", class: "mhs-mini-ib", "aria-label": t("settings"), title: t("settings"), on: { click: function () { sheet.close(); if (window.MHSApp) window.MHSApp.nav("settings"); setTimeout(function () { var p = document.querySelector("mhs-prayer"); if (p) p.scrollIntoView({ block: "start", behavior: "smooth" }); }, 250); } } }, [sheet.icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z|M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z")]));
    var c = where();
    var grid = E("div", { class: "mhs-p-grid" }); b.appendChild(grid);
    if (!c) {
      var st = E("p", { class: "mhs-mini-note", role: "status" });
      grid.appendChild(E("div", { class: "mhs-p-card span2" }, [E("h3", { text: "📍 " + t("qibla") }), E("p", { class: "mhs-mini-note", text: t("noLoc") }), E("div", { class: "mhs-actions" }, [
        E("button", { type: "button", class: "mhs-btn primary", text: t("allow"), on: { click: function (e) { e.target.disabled = true; st.textContent = t("locating"); (P() && P().enableLocation ? P().enableLocation() : Promise.resolve("unsupported")).then(function (r) { if (r === "granted" || where()) render(); else { e.target.disabled = false; st.textContent = t("denied"); } }); } } })]), st]));
      return;
    }
    /* ---- times ---- */
    var d = P().day(), now = Date.now(), order = ["fajr", "sunrise", "dhuhr", "asr", "sunset", "isha"];
    var times = E("div", { class: "mhs-p-times" }), cur = null, nxt = null;
    if (d) {
      order.forEach(function (k, i) { if (d[k] <= now && (!order[i + 1] || d[order[i + 1]] > now)) cur = k; if (!nxt && d[k] > now) nxt = k; });
      var tomorrow = !nxt ? P().day(now + 86400000) : null;
      var head = E("div", { class: "mhs-p-next" }, [E("small", { text: nxt ? t("next") + " · " + t("names")[nxt] : t("next") + " · " + t("names").fajr }), E("b", { text: nxt ? hm(d[nxt]) : tomorrow ? hm(tomorrow.fajr) : "—" }), E("small", { text: nxt ? dur(d[nxt] - now) + " " + t("left") : tomorrow ? dur(tomorrow.fajr - now) + " " + t("left") : "" })]);
      order.forEach(function (k) {
        var isNow = k === cur && k !== "sunrise";
        times.appendChild(E("div", { class: "mhs-p-time" + (isNow ? " is-now" : k === nxt ? " is-next" : "") }, [E("span", { class: "nm" }, [t("names")[k], isNow ? E("small", { text: t("now") }) : null]), E("span", { class: "t" }, [hm(d[k]), k === nxt ? E("small", { text: dur(d[k] - now) }) : null])]));
      });
      grid.appendChild(E("div", { class: "mhs-p-card" }, [E("h3", null, ["🕌 " + t("times"), E("small", { text: c.place || "" })]), head, times]));
    }
    /* ---- compass ---- */
    var brg = bearing(c.lat, c.lng), km = distanceKm(c.lat, c.lng);
    var dial = E("div", { class: "mhs-compass-dial" }, [E("span", { class: "cd n", text: "N" }), E("span", { class: "cd e", text: "E" }), E("span", { class: "cd s", text: "S" }), E("span", { class: "cd w", text: "W" }), E("div", { class: "mhs-compass-kaaba", style: "--b:" + brg.toFixed(1) + "deg", "aria-hidden": "true" })]);
    for (var k = 0; k < 24; k++) if (k % 6) dial.appendChild(E("i", { class: "tick", style: "transform:rotate(" + k * 15 + "deg)" }));
    var compass = E("div", { class: "mhs-compass", role: "img", "aria-label": t("qibla") + " " + Math.round(brg) + "°" }, [E("div", { class: "mhs-compass-top" }), dial, E("div", { class: "mhs-compass-center" })]);
    var deg = E("div", { class: "mhs-p-deg" }, [num(Math.round(brg)) + "° " + t("fromN"), E("small", { text: num(Math.round(km)) + " " + t("km") })]);
    var status = E("div", { class: "mhs-mini-note", role: "status", style: "text-align:center" });
    var startBtn = E("button", { type: "button", class: "mhs-btn primary", text: "🧭 " + t("compassOff"), on: { click: startCompass } });
    var compassCard = E("div", { class: "mhs-p-card" }, [E("h3", { text: "🕋 " + t("qibla") }), compass, deg, status, E("div", { class: "mhs-actions", style: "justify-content:center" }, [startBtn])]);
    grid.appendChild(compassCard);
    function apply() {
      if (heading === null) return;
      startBtn.hidden = true;
      dial.style.transform = "rotate(" + (-heading) + "deg)";
      var diff = ((brg - heading + 540) % 360) - 180, ok = Math.abs(diff) < 5;
      compass.classList.toggle("is-aligned", ok);
      status.textContent = ok ? "✓ " + t("aligned") : t("turn", { d: num(Math.round(Math.abs(diff))), dir: diff > 0 ? t("right") : t("left2") });
      status.className = "mhs-mini-note" + (ok ? " ok" : ""); status.style.color = ok ? "hsl(var(--primary))" : "";
    }
    currentApply = apply;
    function startCompass() {
      var D = window.DeviceOrientationEvent;
      if (!D) { status.textContent = t("compassNo"); return; }
      var go = function () {
        if (listening) return;
        listening = true;
        if ("ondeviceorientationabsolute" in window) window.addEventListener("deviceorientationabsolute", onOrient, true);
        window.addEventListener("deviceorientation", onOrient, true);
        status.textContent = t("compassHint");
        setTimeout(function () { if (heading === null) status.textContent = t("compassNo"); }, 3500);
      };
      if (typeof D.requestPermission === "function") D.requestPermission().then(function (r) { if (r === "granted") go(); else status.textContent = t("compassNo"); }).catch(function () { status.textContent = t("compassNo"); });
      else go();
    }
    if (listening) apply();
    /* ---- mosques ---- */
    var q = encodeURIComponent("mosque near " + c.lat.toFixed(5) + "," + c.lng.toFixed(5));
    var mapBox = E("div", { class: "mhs-p-map" });
    function showMap() { mapOn = true; mapBox.replaceChildren(E("iframe", { src: "https://maps.google.com/maps?q=" + q + "&z=14&hl=" + lang() + "&output=embed", title: t("mosques"), loading: "lazy", referrerpolicy: "no-referrer-when-downgrade", allow: "geolocation" })); }
    if (mapOn && navigator.onLine !== false) showMap();
    else mapBox.appendChild(E("div", { class: "mhs-p-mapph" }, [E("span", { text: "🗺️" }), E("button", { type: "button", class: "mhs-btn primary", text: t("mapBtn"), on: { click: showMap } }), E("small", { text: t("mapHint") })]));
    var ext = E("a", { class: "mhs-btn", href: "https://www.google.com/maps/search/mosque/@" + c.lat + "," + c.lng + ",15z", target: "_blank", rel: "noopener noreferrer", text: t("openMaps") + " ↗", style: "display:inline-flex;align-items:center;text-decoration:none" });
    grid.appendChild(E("div", { class: "mhs-p-card span2" }, [E("h3", null, ["📍 " + t("mosques"), E("small", { text: c.place || "" })]), mapBox, E("div", { class: "mhs-actions" }, [ext])]));
    clearInterval(tick); tick = setInterval(function () { if (sheet && !document.hidden) render(); }, 60000);
  }
  API.open = function () {
    if (!window.MHSSheet) return;
    if (sheet && sheet.dialog.open) return;
    heading = null; stopCompass();
    sheet = window.MHSSheet.open({ id: "mhs-qibla", title: t("title"), sub: t("sub"), onClose: function () { sheet = null; clearInterval(tick); stopCompass(); } });
    render();
  };
})();
