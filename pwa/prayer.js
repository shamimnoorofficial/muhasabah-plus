/* Muhasabah — location-based prayer times (fully offline, computed on this device).
 * When enabled, habits linked to a prayer use the real end of that waqt as their deadline
 * (and cannot be marked done before the waqt starts). Habits that are not linked keep the
 * deadline the user set. The location is read once with permission (or a city is picked)
 * and is stored only on this device. Nothing is sent anywhere.
 * Exposes window.MHSPrayer for the app bundle and pwa/remind.js.
 * Renders the <mhs-prayer> settings panel.
 */
(function () {
  "use strict";
  var CFG = "muhasabah:prayer";
  var PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "tahajjud"];
  var METHODS = {
    karachi: { fajr: 18, isha: 18, name: "Karachi (Univ. of Islamic Sciences)" },
    mwl: { fajr: 18, isha: 17, name: "Muslim World League" },
    isna: { fajr: 15, isha: 15, name: "ISNA (North America)" },
    egypt: { fajr: 19.5, isha: 17.5, name: "Egyptian Authority" },
    makkah: { fajr: 18.5, ishaMin: 90, name: "Umm al-Qura (Makkah)" }
  };
  var CITIES = [
    ["Dhaka", 23.8103, 90.4125], ["Chattogram", 22.3569, 91.7832], ["Sylhet", 24.8949, 91.8687],
    ["Rajshahi", 24.3745, 88.6042], ["Khulna", 22.8456, 89.5403], ["Barishal", 22.701, 90.3535],
    ["Rangpur", 25.7439, 89.2752], ["Mymensingh", 24.7471, 90.4203], ["Cumilla", 23.4607, 91.1809],
    ["Gazipur", 23.9999, 90.4203], ["Narayanganj", 23.6238, 90.5], ["Bogura", 24.8465, 89.3773],
    ["Cox's Bazar", 21.4272, 92.0058], ["Jashore", 23.1664, 89.2081], ["Dinajpur", 25.6217, 88.6355],
    ["Kolkata", 22.5726, 88.3639], ["Delhi", 28.6139, 77.209], ["Karachi", 24.8607, 67.0011],
    ["Makkah", 21.3891, 39.8579], ["Madinah", 24.5247, 39.5692], ["Riyadh", 24.7136, 46.6753],
    ["Dubai", 25.2048, 55.2708], ["Doha", 25.2854, 51.531], ["Kuwait City", 29.3759, 47.9774],
    ["Muscat", 23.588, 58.3829], ["Kuala Lumpur", 3.139, 101.6869], ["Singapore", 1.3521, 103.8198],
    ["Jakarta", -6.2088, 106.8456], ["Istanbul", 41.0082, 28.9784], ["Cairo", 30.0444, 31.2357],
    ["London", 51.5074, -0.1278], ["Paris", 48.8566, 2.3522], ["Rome", 41.9028, 12.4964],
    ["New York", 40.7128, -74.006], ["Toronto", 43.6532, -79.3832], ["Sydney", -33.8688, 151.2093],
    ["Tokyo", 35.6762, 139.6503], ["Seoul", 37.5665, 126.978]
  ];

  /* ---------- config ---------- */
  function cfg() {
    var c = {};
    try { c = JSON.parse(localStorage.getItem(CFG)) || {}; } catch (e) {}
    return {
      on: c.on !== false, // on by default; only off if the user turned it off
      src: c.src || "",   // "gps" | "city" | "tz" (guessed from the phone's time zone)
      at: typeof c.at === "number" ? c.at : 0,
      asked: !!c.asked,
      lat: typeof c.lat === "number" ? c.lat : null,
      lng: typeof c.lng === "number" ? c.lng : null,
      place: c.place || "",
      method: METHODS[c.method] ? c.method : "karachi",
      asr: c.asr === "standard" ? "standard" : "hanafi",
      links: c.links && typeof c.links === "object" ? c.links : {}
    };
  }
  var cache = {};
  function saveCfg(c) {
    try { localStorage.setItem(CFG, JSON.stringify(c)); } catch (e) {}
    cache = {};
    try { window.dispatchEvent(new CustomEvent("mhs-prayer-change")); } catch (e) {}
  }

  /* ---------- astronomy (standard prayer-time formulas) ---------- */
  var rad = Math.PI / 180;
  function sin(d) { return Math.sin(d * rad); }
  function cos(d) { return Math.cos(d * rad); }
  function tan(d) { return Math.tan(d * rad); }
  function asin(x) { return Math.asin(x) / rad; }
  function acos(x) { return Math.acos(x) / rad; }
  function atan2(y, x) { return Math.atan2(y, x) / rad; }
  function acot(x) { return Math.atan(1 / x) / rad; }
  function fix(a, b) { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; }

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sunPos(jd) {
    var D = jd - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360);
    var q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
    var e = 23.439 - 0.00000036 * D;
    var RA = atan2(cos(e) * sin(L), cos(L)) / 15;
    return { decl: asin(sin(e) * sin(L)), eqt: q / 15 - fix(RA, 24) };
  }

  /* Returns solar-clock hours (UTC = h - lng/15) for the given local date. */
  function solarTimes(y, m, d, lat, lng, method, asrFactor) {
    var jd0 = julian(y, m, d) - lng / (15 * 24);
    function midDay(t) { return fix(12 - sunPos(jd0 + t).eqt, 24); }
    function angleTime(angle, t, ccw) {
      var decl = sunPos(jd0 + t).decl, noon = midDay(t);
      var x = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
      if (x < -1 || x > 1) return NaN;
      var T = acos(x) / 15;
      return noon + (ccw ? -T : T);
    }
    function asrTime(t) {
      var decl = sunPos(jd0 + t).decl;
      return angleTime(-acot(asrFactor + tan(Math.abs(lat - decl))), t);
    }
    var M = METHODS[method];
    var r = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 };
    for (var i = 0; i < 2; i++) {
      r = {
        fajr: angleTime(M.fajr, r.fajr / 24, true),
        sunrise: angleTime(0.833, r.sunrise / 24, true),
        dhuhr: midDay(r.dhuhr / 24),
        asr: asrTime(r.asr / 24),
        sunset: angleTime(0.833, r.sunset / 24),
        isha: M.ishaMin ? NaN : angleTime(M.isha, r.isha / 24)
      };
      ["fajr", "sunrise", "asr", "sunset", "isha"].forEach(function (k) { if (isNaN(r[k])) r[k] = ({ fajr: 5, sunrise: 6, asr: 13, sunset: 18, isha: 18 })[k]; });
    }
    r = {
      fajr: angleTime(M.fajr, r.fajr / 24, true),
      sunrise: angleTime(0.833, r.sunrise / 24, true),
      dhuhr: midDay(r.dhuhr / 24),
      asr: asrTime(r.asr / 24),
      sunset: angleTime(0.833, r.sunset / 24),
      isha: M.ishaMin ? NaN : angleTime(M.isha, r.isha / 24)
    };
    if (isNaN(r.sunrise) || isNaN(r.sunset)) return null; // polar day/night — fall back to user deadlines
    if (M.ishaMin) r.isha = r.sunset + M.ishaMin / 60;
    // High-latitude safeguard (angle-based night portion).
    var night = 24 - (r.sunset - r.sunrise);
    var fp = M.fajr / 60 * night, ip = (M.isha || 18) / 60 * night;
    if (isNaN(r.fajr) || r.sunrise - r.fajr > fp) r.fajr = r.sunrise - fp;
    if (!M.ishaMin && (isNaN(r.isha) || r.isha - r.sunset > ip)) r.isha = r.sunset + ip;
    r.maghrib = r.sunset;
    r.midnight = r.sunset + (r.fajr + 24 - r.sunset) / 2;
    return r;
  }

  /* Prayer times for a local calendar day, as epoch ms. Cached per day. */
  function day(ref) {
    var c = cfg();
    if (c.lat === null || c.lng === null) return null;
    var dt = ref ? new Date(ref) : new Date();
    var y = dt.getFullYear(), m = dt.getMonth(), d = dt.getDate();
    var key = y + "-" + m + "-" + d + "|" + c.lat + "," + c.lng + "|" + c.method + "|" + c.asr;
    if (key in cache) return cache[key];
    var s = solarTimes(y, m + 1, d, c.lat, c.lng, c.method, c.asr === "hanafi" ? 2 : 1), out = null;
    if (s) {
      var base = Date.UTC(y, m, d), off = c.lng / 15;
      out = {};
      Object.keys(s).forEach(function (k) { out[k] = Math.round((base + (s[k] - off) * 3600000) / 60000) * 60000; });
      out.dhuhr += 60000; // one-minute safety after zawal
      var endOfDay = new Date(y, m, d, 23, 59, 59, 0).getTime();
      out.ishaEnd = Math.min(out.midnight, endOfDay);
    }
    var ks = Object.keys(cache); if (ks.length > 40) cache = {};
    cache[key] = out;
    return out;
  }

  /* Waqt window for a prayer on a given day: { start, end } in ms (start may be null). */
  function windowOf(p, ref) {
    var t = day(ref);
    if (!t) return null;
    switch (p) {
      case "fajr": return { start: t.fajr, end: t.sunrise };
      case "dhuhr": return { start: t.dhuhr, end: t.asr };
      case "asr": return { start: t.asr, end: t.sunset };
      case "maghrib": return { start: t.maghrib, end: t.isha };
      case "isha": return { start: t.isha, end: t.ishaEnd };
      case "tahajjud": return { start: null, end: t.fajr };
    }
    return null;
  }
  function linkOf(h, c) {
    c = c || cfg();
    if (!c.on || !h || !h.id) return null;
    // No explicit choice yet → link automatically from the habit's title.
    var p = h.id in c.links ? c.links[h.id] : guess(h.title);
    return PRAYERS.indexOf(p) >= 0 ? p : null;
  }

  /* Guess which prayer a habit is about from its title (English, Bangla, Arabic). */
  var GUESS = [
    ["tahajjud", /tahaj+ud|tahajjod|qiyam|তাহাজ্জু?দ|কিয়াম|تهجد|قيام/i],
    ["fajr", /fa[jg]r|fazr|ফজর|الفجر|فجر|subh/i],
    ["dhuhr", /dhuhr|zuhr|zohr|duhr|johr|zuhur|যোহর|জোহর|যুহর|ظهر/i],
    ["asr", /\basr\b|asar|আসর|عصر/i],
    ["maghrib", /maghrib|magrib|মাগরিব|مغرب/i],
    ["isha", /isha|esha|ইশা|এশা|عشاء|العشاء/i]
  ];
  function guess(title) {
    title = String(title || "");
    for (var i = 0; i < GUESS.length; i++) if (GUESS[i][1].test(title)) return GUESS[i][0];
    return null;
  }

  /* ---------- automatic location ---------- */
  var TZ = {
    "Asia/Dhaka": "Dhaka", "Asia/Dacca": "Dhaka", "Asia/Kolkata": "Kolkata", "Asia/Calcutta": "Kolkata",
    "Asia/Karachi": "Karachi", "Asia/Riyadh": "Riyadh", "Asia/Dubai": "Dubai", "Asia/Qatar": "Doha",
    "Asia/Kuwait": "Kuwait City", "Asia/Muscat": "Muscat", "Asia/Kuala_Lumpur": "Kuala Lumpur",
    "Asia/Singapore": "Singapore", "Asia/Jakarta": "Jakarta", "Europe/Istanbul": "Istanbul",
    "Africa/Cairo": "Cairo", "Europe/London": "London", "Europe/Paris": "Paris", "Europe/Rome": "Rome",
    "America/New_York": "New York", "America/Toronto": "Toronto", "Australia/Sydney": "Sydney",
    "Asia/Tokyo": "Tokyo", "Asia/Seoul": "Seoul"
  };
  function cityByName(n) { for (var i = 0; i < CITIES.length; i++) if (CITIES[i][0] === n) return CITIES[i]; return null; }
  function setGps(pos) {
    var c = cfg();
    c.lat = Math.round(pos.coords.latitude * 10000) / 10000;
    c.lng = Math.round(pos.coords.longitude * 10000) / 10000;
    c.place = "📍 " + c.lat.toFixed(3) + ", " + c.lng.toFixed(3);
    c.src = "gps"; c.at = Date.now(); c.asked = true;
    saveCfg(c);
  }
  function gps(onFail, onOk) {
    if (!navigator.geolocation) { if (onFail) onFail(); return; }
    navigator.geolocation.getCurrentPosition(function (pos) { setGps(pos); if (onOk) onOk(); }, function (err) {
      var c = cfg(); c.asked = true; saveCfg(c); if (onFail) onFail(err);
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });
  }
  /* Location permission state for the welcome screen: "granted" | "prompt" | "denied" | "unsupported". */
  function locationState() {
    if (!navigator.geolocation) return Promise.resolve("unsupported");
    var c = cfg();
    if (!navigator.permissions || !navigator.permissions.query) return Promise.resolve(c.src === "gps" ? "granted" : "prompt");
    return navigator.permissions.query({ name: "geolocation" }).then(function (r) { return r.state; }, function () { return c.src === "gps" ? "granted" : "prompt"; });
  }
  /* Ask for the location (welcome screen), turn prayer times on and link prayer habits. */
  function enableLocation() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) return resolve("unsupported");
      gps(function (err) { resolve(err && err.code === 1 ? "denied" : "error"); }, function () {
        var c = cfg(); c.on = true; autoLink(c); saveCfg(c); resolve("granted");
      });
    });
  }
  /* Runs on app start: guess the city from the time zone so times work immediately, then
   * refine with the phone's location (asked once). If permission was already granted, the
   * location is refreshed quietly every few hours, so travelling updates the times. */
  function autoLocate() {
    var c = cfg();
    if (!c.on) return;
    if (c.lat === null) {
      var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
      var city = cityByName(TZ[tz]);
      if (city) { c.lat = city[1]; c.lng = city[2]; c.place = city[0]; c.src = "tz"; saveCfg(c); }
    }
    c = cfg();
    if (c.src === "city") return; // user picked a city on purpose
    var stale = Date.now() - c.at > 6 * 3600000;
    var perm = navigator.permissions && navigator.permissions.query
      ? navigator.permissions.query({ name: "geolocation" }).then(function (r) { return r.state; }, function () { return "prompt"; })
      : Promise.resolve("prompt");
    perm.then(function (state) {
      if (state === "granted" && (c.src !== "gps" || stale)) gps();
    });
  }

  var API = {
    prayers: PRAYERS,
    config: cfg,
    day: day,
    window: windowOf,
    link: function (h) { return linkOf(h); },
    /* Effective deadline (ms) for a linked habit on the day of `ref`, or null to use the user's deadline. */
    dl: function (h, ref) { var p = linkOf(h); if (!p) return null; var w = windowOf(p, ref); return w ? w.end : null; },
    /* Waqt start (ms) for a linked habit, or null. */
    start: function (h, ref) { var p = linkOf(h); if (!p) return null; var w = windowOf(p, ref); return w ? w.start : null; },
    guess: guess,
    locate: gps,
    locationState: locationState,
    enableLocation: enableLocation
  };
  window.MHSPrayer = API;

  /* ---------- i18n ---------- */
  var T = {
    en: {
      title: "Prayer times by location",
      sub: "Deadlines for prayer habits follow the real waqt every day, calculated on this device. No internet, no server, no tracking.",
      enable: "Use real prayer times as deadlines",
      loc: "Location",
      useLoc: "📍 Use my location",
      locating: "Getting location…",
      locFail: "Couldn't get your location. Allow location access or pick a city below.",
      locNote: "Location is read once and saved only on this device. It's never sent anywhere and never tracked.",
      noLoc: "No location set",
      city: "Or pick a city",
      pick: "Choose…",
      method: "Calculation method",
      asr: "Asr",
      hanafi: "Hanafi (later)",
      standard: "Shafi'i / Maliki / Hanbali",
      today: "Today's times",
      starts: "Start",
      ends: "Deadline",
      forbidden: "Forbidden times (no salah)",
      fSunrise: "Sunrise",
      fZawal: "Zawal (midday)",
      fSunset: "Before sunset",
      links: "Linked habits",
      linksHelp: "Pick which prayer each habit is. Linked habits use the waqt end as deadline and can't be checked before the waqt starts. Unlinked habits keep your own deadline.",
      none: "— Own deadline —",
      noHabits: "No active habits yet.",
      names: { fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha", tahajjud: "Tahajjud", sunrise: "Sunrise", midnight: "Midnight" },
      notes: "Fajr ends at sunrise, Dhuhr at Asr, Asr at sunset, Maghrib at Isha. Isha's deadline is Islamic midnight (latest 23:59), Tahajjud ends at Fajr. Times can differ from your local mosque by 1–3 minutes.",
      offTip: "Turn this on and set a location to apply real prayer times.",
      wTitle: "Prayer times",
      now: "Now",
      next: "Next",
      left: "left",
      in: "in",
      until: "until",
      startsAt: "starts",
      deadline: "deadline",
      fNow: "Forbidden time — don't pray now",
      fUntil: "ends",
      srcGps: "from your location",
      srcTz: "guessed from time zone — tap 📍 for exact times",
      srcCity: "selected city",
      setLoc: "Set your location to get exact prayer times and fair deadlines.",
      ended: "Today's prayers are over"
    },
    ar: {
      title: "مواقيت الصلاة حسب الموقع",
      sub: "مواعيد عادات الصلاة تتبع الوقت الحقيقي كل يوم، وتُحسب على هذا الجهاز دون إنترنت أو خادم أو تتبع.",
      enable: "استخدم مواقيت الصلاة الحقيقية كمواعيد",
      loc: "الموقع",
      useLoc: "📍 استخدم موقعي",
      locating: "جارٍ تحديد الموقع…",
      locFail: "تعذّر تحديد موقعك. اسمح بالوصول إلى الموقع أو اختر مدينة.",
      locNote: "يُقرأ الموقع مرة واحدة ويُحفظ على هذا الجهاز فقط، ولا يُرسل أو يُتتبع.",
      noLoc: "لم يُحدد موقع",
      city: "أو اختر مدينة",
      pick: "اختر…",
      method: "طريقة الحساب",
      asr: "العصر",
      hanafi: "حنفي (متأخر)",
      standard: "شافعي / مالكي / حنبلي",
      today: "مواقيت اليوم",
      starts: "البداية",
      ends: "الموعد",
      forbidden: "أوقات النهي عن الصلاة",
      fSunrise: "الشروق",
      fZawal: "الزوال",
      fSunset: "قبل الغروب",
      links: "العادات المرتبطة",
      linksHelp: "اختر الصلاة لكل عادة. العادات المرتبطة موعدها نهاية الوقت، ولا يمكن إكمالها قبل دخول الوقت. غير المرتبطة تبقى بموعدك.",
      none: "— موعدي الخاص —",
      noHabits: "لا توجد عادات نشطة بعد.",
      names: { fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء", tahajjud: "التهجد", sunrise: "الشروق", midnight: "منتصف الليل" },
      notes: "ينتهي الفجر بالشروق، والظهر بالعصر، والعصر بالغروب، والمغرب بالعشاء. موعد العشاء منتصف الليل الشرعي (حتى 23:59)، والتهجد ينتهي بالفجر. قد تختلف الأوقات عن مسجدك بدقيقة إلى ثلاث.",
      offTip: "فعّل الخيار وحدد موقعاً لتطبيق المواقيت الحقيقية.",
      wTitle: "مواقيت الصلاة",
      now: "الآن",
      next: "التالي",
      left: "متبقٍ",
      in: "بعد",
      until: "حتى",
      startsAt: "يبدأ",
      deadline: "الموعد",
      fNow: "وقت نهي — لا تصلِّ الآن",
      fUntil: "ينتهي",
      srcGps: "من موقعك",
      srcTz: "مقدّر من المنطقة الزمنية — اضغط 📍 للدقة",
      srcCity: "مدينة مختارة",
      setLoc: "حدد موقعك لمواقيت دقيقة ومواعيد عادلة.",
      ended: "انتهت صلوات اليوم"
    }
  };
  if (typeof T !== "undefined" && T.en) T.bn = Object.fromEntries(Object.entries(T.en).map(function (pair) { return [pair[0], window.MHSBengali[pair[1]] || pair[1]]; }));
  function lang() { var c = window.MHS && window.MHS.current(); return c && ["en", "ar", "bn"].includes(c.lang) ? c.lang : "en"; }
  Object.assign(T.bn, {"title": "অবস্থান অনুযায়ী নামাজের সময়", "sub": "নামাজের অভ্যাসের সময়সীমা প্রতিদিনের প্রকৃত ওয়াক্ত অনুযায়ী এই ডিভাইসে হিসাব হয়।", "enable": "প্রকৃত নামাজের সময়কে সময়সীমা হিসেবে ব্যবহার করুন", "loc": "অবস্থান", "useLoc": "আমার অবস্থান ব্যবহার করুন", "locating": "অবস্থান খোঁজা হচ্ছে…", "locFail": "অবস্থান পাওয়া যায়নি। অনুমতি দিন বা একটি শহর বেছে নিন।", "locNote": "অবস্থান একবার নিয়ে শুধু এই ডিভাইসে রাখা হয়। কোথাও পাঠানো হয় না।", "noLoc": "অবস্থান নির্ধারিত নয়", "city": "অথবা শহর বাছাই করুন", "pick": "বাছাই করুন…", "method": "গণনা পদ্ধতি", "asr": "আসর", "hanafi": "হানাফি (দেরিতে)", "standard": "শাফেয়ি / মালিকি / হাম্বলি", "today": "আজকের সময়সূচি", "starts": "শুরু", "ends": "শেষ", "forbidden": "নামাজের নিষিদ্ধ সময়", "fSunrise": "সূর্যোদয়", "fZawal": "দ্বিপ্রহর", "fSunset": "সূর্যাস্ত", "names": {"fajr": "ফজর", "dhuhr": "যোহর", "asr": "আসর", "maghrib": "মাগরিব", "isha": "এশা"}, "startsAt": "শুরু", "deadline": "সময়সীমা", "fNow": "নিষিদ্ধ সময়—এখন নামাজ পড়বেন না", "fUntil": "শেষ", "srcGps": "আপনার অবস্থান থেকে", "srcTz": "সময় অঞ্চল থেকে অনুমান—সঠিক সময়ের জন্য অবস্থান দিন", "srcCity": "বাছাই করা শহর", "setLoc": "সঠিক নামাজের সময় ও সময়সীমার জন্য আপনার অবস্থান দিন।", "ended": "আজকের সব নামাজের সময় শেষ"});
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k]; }
  function pname(p) { return (t("names") || T.en.names)[p] || p; }
  function hm(ms) {
    if (!ms && ms !== 0) return "—";
    var d = new Date(ms);
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  API.name = pname;
  API.hm = hm;

  /* ---------- <mhs-prayer> settings panel ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "on") Object.keys(attrs.on).forEach(function (ev) { n.addEventListener(ev, attrs.on[ev]); });
      else if (k === "text") n.textContent = attrs.text;
      else if (k === "checked") n.checked = !!attrs.checked;
      else if (k === "selected") n.selected = !!attrs.selected;
      else if (k === "value") n.value = attrs.value;
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function select(options, value, onChange) {
    var s = el("select", { class: "mhs-select", on: { change: function () { onChange(s.value); } } });
    options.forEach(function (o) { s.appendChild(el("option", { value: o[0], selected: o[0] === value, text: o[1] })); });
    s.value = value;
    return s;
  }
  function activeHabits() {
    var d = window.MHS && window.MHS.current();
    return d && Array.isArray(d.habits) ? d.habits.filter(function (h) { return h && h.status === "active"; }) : [];
  }
  /* Auto-link habits whose titles clearly name a prayer (only for habits not decided yet). */
  function autoLink(c) {
    var changed = false;
    activeHabits().forEach(function (h) {
      if (h.id in c.links) return;
      var g = guess(h.title);
      c.links[h.id] = g || "";
      changed = true;
    });
    return changed;
  }

  var Base = window.HTMLElement || function () {};
  class MhsPrayer extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() {
      var self = this;
      this._tick = setInterval(function () { if (!document.hidden && self.isConnected) self.render(); }, 60000);
      this.render();
    }
    disconnectedCallback() { clearInterval(this._tick); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    update(fn) { var c = cfg(); fn(c); saveCfg(c); this.render(); }
    locate() {
      var self = this;
      if (!navigator.geolocation) { self._msg = t("locFail"); return self.render(); }
      self._msg = t("locating"); self.render();
      navigator.geolocation.getCurrentPosition(function (pos) {
        self._msg = "";
        setGps(pos);
        self.update(function (c) { if (!c.on) { c.on = true; autoLink(c); } });
      }, function () { self._msg = t("locFail"); self.render(); }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });
    }
    render() {
      var self = this, c = cfg();
      if (c.on && autoLink(c)) saveCfg(c);
      var root = el("div", { class: "panel mhs-panel", dir: lang() === "ar" ? "rtl" : "ltr" });
      root.appendChild(el("div", { class: "mhs-head" }, [
        el("h3", { class: "mhs-title", text: "🕌 " + t("title") }),
        el("p", { class: "mhs-muted", text: t("sub") })
      ]));

      var box = el("input", { type: "checkbox", checked: c.on, on: { change: function () {
        var want = box.checked;
        self.update(function (n) { n.on = want; if (want) autoLink(n); });
        if (want && n0()) self.locate();
      } } });
      function n0() { var k = cfg(); return k.lat === null; }
      root.appendChild(el("label", { class: "mhs-switch" }, [box, el("span", { text: t("enable") })]));

      // Location
      var cityOpts = [["", t("pick")]].concat(CITIES.map(function (x, i) { return [String(i), x[0]]; }));
      var curCity = ""; CITIES.forEach(function (x, i) { if (x[1] === c.lat && x[2] === c.lng) curCity = String(i); });
      var loc = el("div", { class: "mhs-sec" }, [
        el("div", { class: "mhs-label", text: t("loc") }),
        el("div", { class: "mhs-status" + (c.lat !== null ? " ok" : ""), text: c.lat !== null ? (c.place || (c.lat + ", " + c.lng)) + " • " + t(c.src === "gps" ? "srcGps" : c.src === "tz" ? "srcTz" : "srcCity") : t("noLoc") }),
        self._msg ? el("div", { class: "mhs-status warn", text: self._msg }) : null,
        el("div", { class: "mhs-actions" }, [
          el("button", { type: "button", class: "mhs-btn primary", on: { click: function () { self.locate(); } } }, [t("useLoc")]),
          select(cityOpts, curCity, function (v) {
            if (v === "") return;
            var x = CITIES[+v];
            self._msg = "";
            self.update(function (n) { n.lat = x[1]; n.lng = x[2]; n.place = x[0]; n.src = "city"; n.at = Date.now(); if (!n.on) { n.on = true; autoLink(n); } });
          })
        ]),
        el("p", { class: "mhs-muted", text: t("locNote") })
      ]);
      root.appendChild(loc);

      // Method + Asr
      root.appendChild(el("div", { class: "mhs-sec mhs-row" }, [
        el("div", { class: "mhs-grow" }, [
          el("div", { class: "mhs-label", text: t("method") }),
          select(Object.keys(METHODS).map(function (k) { return [k, METHODS[k].name]; }), c.method, function (v) { self.update(function (n) { n.method = v; }); })
        ]),
        el("div", { class: "mhs-grow" }, [
          el("div", { class: "mhs-label", text: t("asr") }),
          select([["hanafi", t("hanafi")], ["standard", t("standard")]], c.asr, function (v) { self.update(function (n) { n.asr = v; }); })
        ])
      ]));

      // Today's timetable
      var td = day();
      if (td) {
        var now = Date.now();
        var rows = ["fajr", "dhuhr", "asr", "maghrib", "isha", "tahajjud"].map(function (p) {
          var w = windowOf(p);
          var live = w && (w.start === null || now >= w.start) && now < w.end;
          return el("div", { class: "mhs-item mhs-pt" + (live ? " live" : "") }, [
            el("span", { class: "mhs-pt-n", text: pname(p) }),
            el("span", { class: "num mhs-pt-t", text: (w.start !== null ? hm(w.start) : "…") + " → " + hm(w.end) })
          ]);
        });
        root.appendChild(el("div", { class: "mhs-sec" }, [
          el("div", { class: "mhs-label", text: t("today") + " • " + t("starts") + " → " + t("ends") }),
          el("div", { class: "mhs-list" }, rows)
        ]));
        var fb = [
          [t("fSunrise"), td.sunrise, td.sunrise + 15 * 60000],
          [t("fZawal"), td.dhuhr - 7 * 60000, td.dhuhr - 60000],
          [t("fSunset"), td.sunset - 15 * 60000, td.sunset]
        ].map(function (r) {
          var live = now >= r[1] && now < r[2];
          return el("div", { class: "mhs-item mhs-pt bad" + (live ? " live" : "") }, [
            el("span", { class: "mhs-pt-n", text: "⛔ " + r[0] }),
            el("span", { class: "num mhs-pt-t", text: hm(r[1]) + " – " + hm(r[2]) })
          ]);
        });
        root.appendChild(el("div", { class: "mhs-sec" }, [el("div", { class: "mhs-label", text: t("forbidden") }), el("div", { class: "mhs-list" }, fb)]));
      }

      // Habit links
      var hs = activeHabits();
      var linkOpts = [["", t("none")]].concat(PRAYERS.map(function (p) { return [p, "🕌 " + pname(p)]; }));
      var list = el("div", { class: "mhs-list" }, hs.length ? hs.map(function (h) {
        var cur = c.links[h.id] !== undefined ? c.links[h.id] : (guess(h.title) || "");
        return el("div", { class: "mhs-item" }, [
          el("span", { class: "mhs-pt-n", text: (h.icon ? h.icon + " " : "") + h.title }),
          select(linkOpts, cur, function (v) { self.update(function (n) { n.links[h.id] = v; }); })
        ]);
      }) : [el("div", { class: "mhs-muted", text: t("noHabits") })]);
      root.appendChild(el("div", { class: "mhs-sec" }, [
        el("div", { class: "mhs-label", text: t("links") }),
        el("p", { class: "mhs-muted", text: t("linksHelp") }),
        list
      ]));

      root.appendChild(el("p", { class: "mhs-muted", text: c.on && c.lat !== null ? t("notes") : t("offTip") }));
      this.replaceChildren(root);
    }
  }
  if (window.customElements && !customElements.get("mhs-prayer")) customElements.define("mhs-prayer", MhsPrayer);

  /* Forbidden windows for a day: [label key, start, end]. */
  function forbidden(td) {
    return [
      ["fSunrise", td.sunrise, td.sunrise + 15 * 60000],
      ["fZawal", td.dhuhr - 7 * 60000, td.dhuhr - 60000],
      ["fSunset", td.sunset - 15 * 60000, td.sunset]
    ];
  }
  API.forbidden = function (ref) { var td = day(ref); return td ? forbidden(td) : []; };
  function dur(ms) {
    var m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60);
    return h ? h + "h " + (m % 60) + "m" : m + "m";
  }

  /* ---------- <mhs-waqt> card on the Today page ---------- */
  class MhsWaqt extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() {
      var self = this;
      this._r = function () { if (self.isConnected) self.render(); };
      this._tick = setInterval(function () { if (!document.hidden) self._r(); }, 30000);
      window.addEventListener("mhs-prayer-change", this._r);
      document.addEventListener("visibilitychange", this._r);
      this.render();
    }
    disconnectedCallback() {
      clearInterval(this._tick);
      window.removeEventListener("mhs-prayer-change", this._r);
      document.removeEventListener("visibilitychange", this._r);
    }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var c = cfg();
      if (!c.on) { this.replaceChildren(); return; }
      var root = el("div", { class: "panel mhs-waqt", dir: lang() === "ar" ? "rtl" : "ltr" });
      var td = day();
      var head = el("div", { class: "mhs-w-head" }, [
        el("div", { class: "mhs-w-title", text: "🕌 " + t("wTitle") }),
        el("button", { type: "button", class: "mhs-w-loc", title: t("useLoc"), on: { click: function () {
          var b = this; b.textContent = t("locating"); gps(function () { b.textContent = "📍 " + t("locFail"); });
        } } }, ["📍 " + (c.lat !== null ? (c.src === "gps" ? t("srcGps") : c.place) : t("useLoc"))])
      ]);
      root.appendChild(head);
      if (!td) {
        root.appendChild(el("p", { class: "mhs-muted", text: t("setLoc") }));
        this.replaceChildren(root); return;
      }
      if (c.src === "tz") root.appendChild(el("p", { class: "mhs-muted mhs-w-note", text: c.place + " • " + t("srcTz") }));

      var now = Date.now(), five = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
      var ws = {}; five.forEach(function (p) { ws[p] = windowOf(p); });
      var cur = null, nxt = null;
      five.forEach(function (p) { var w = ws[p]; if (now >= w.start && now < w.end) cur = p; if (!nxt && now < w.start) nxt = p; });
      var fb = forbidden(td), fNow = null;
      fb.forEach(function (f) { if (now >= f[1] && now < f[2]) fNow = f; });

      // Status line
      var st;
      if (fNow) st = el("div", { class: "mhs-w-now bad" }, [
        el("b", { text: "⛔ " + t("fNow") }),
        el("span", { class: "num", text: t(fNow[0]) + " • " + t("fUntil") + " " + hm(fNow[2]) + " (" + dur(fNow[2] - now) + ")" })
      ]);
      else if (cur) st = el("div", { class: "mhs-w-now" + (ws[cur].end - now < 30 * 60000 ? " warn" : "") }, [
        el("b", { text: t("now") + ": " + pname(cur) }),
        el("span", { class: "num", text: t("deadline") + " " + hm(ws[cur].end) + " • " + dur(ws[cur].end - now) + " " + t("left") })
      ]);
      else if (nxt) st = el("div", { class: "mhs-w-now idle" }, [
        el("b", { text: t("next") + ": " + pname(nxt) }),
        el("span", { class: "num", text: t("startsAt") + " " + hm(ws[nxt].start) + " • " + t("in") + " " + dur(ws[nxt].start - now) })
      ]);
      else st = el("div", { class: "mhs-w-now idle" }, [el("b", { text: t("ended") })]);
      root.appendChild(st);

      // Five prayers: start → deadline
      root.appendChild(el("div", { class: "mhs-w-grid" }, five.map(function (p) {
        var w = ws[p], state = p === cur ? " live" : now >= w.end ? " past" : "";
        return el("div", { class: "mhs-w-p" + state }, [
          el("div", { class: "mhs-w-n", text: pname(p) }),
          el("div", { class: "num mhs-w-s", text: hm(w.start) }),
          el("div", { class: "num mhs-w-e", title: t("until") + " " + hm(w.end) }, [el("span", { class: "mhs-w-u", text: t("until") }), el("span", { text: hm(w.end) })])
        ]);
      })));

      // Forbidden times
      root.appendChild(el("div", { class: "mhs-w-fb" }, fb.map(function (f) {
        var on = now >= f[1] && now < f[2];
        return el("span", { class: "mhs-w-chip num" + (on ? " live" : now >= f[2] ? " past" : "") , text: "⛔ " + t(f[0]) + " " + hm(f[1]) + "–" + hm(f[2]) });
      })));
      this.replaceChildren(root);
    }
  }
  if (window.customElements && !customElements.get("mhs-waqt")) customElements.define("mhs-waqt", MhsWaqt);

  // Start: work out the location automatically.
  try { autoLocate(); } catch (e) {}
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { try { autoLocate(); } catch (e) {} } });
})();
