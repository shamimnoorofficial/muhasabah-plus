/* Muhasabah — Install button.
 * Uses the browser's native install dialog whenever it is available (captured early in <head>
 * as window.__mhsBIP), waits briefly for it if the button is tapped too early, and otherwise
 * shows clear steps for the current browser. In-app browsers (Facebook, Messenger, Instagram…)
 * can't install apps, so on Android the button re-opens the page in Chrome.
 */
(function () {
  "use strict";
  var bar = document.getElementById("mhs-install-bar");
  var btn = document.getElementById("mhs-install-btn");
  var dis = document.getElementById("mhs-install-dismiss");
  var KEY = "muhasabah:install-dismissed";
  var deferred = window.__mhsBIP || null;
  var waiters = [];
  var installed = false;

  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var inApp = /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Line\/|MicroMessenger|Twitter|TikTok|Snapchat|imo|; wv\)/i.test(ua);
  var isSamsung = /SamsungBrowser/i.test(ua);
  var isFirefox = /Firefox|FxiOS/i.test(ua);
  var isEdge = /Edg\//i.test(ua);
  var isMacSafari = !isIOS && /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);

  function lang() {
    try { var c = window.MHS && window.MHS.current(); return c && ["en", "ar", "bn"].includes(c.lang) ? c.lang : "en"; } catch (e) { return "en"; }
  }
  var T = {
    en: {
      title: "Install Muhasabah",
      close: "Close",
      installNow: "Install now",
      wait: "Getting ready…",
      already: "Muhasabah is already installed on this device. Open it from your home screen or app list.",
      openChrome: "Open in Chrome",
      inAppAndroid: "This app's built-in browser can't install apps. Open Muhasabah in Chrome, then tap Install.",
      inAppIOS: ["This in-app browser can't install apps.", "Tap ⋯ or the menu and choose \"Open in Safari\".", "In Safari, tap Share ⎋ then \"Add to Home Screen\"."],
      ios: ["Tap the Share button ⎋ (bottom bar in Safari, top-right in Chrome).", "Scroll and tap \"Add to Home Screen\".", "Tap \"Add\". Muhasabah appears on your home screen."],
      samsung: ["Tap the menu ≡ at the bottom.", "Tap \"Add page to\" → \"Home screen\".", "Tap \"Add\"."],
      firefoxAndroid: ["Tap the menu ⋮.", "Tap \"Install\" or \"Add to Home screen\".", "Tap \"Add\"."],
      android: ["Tap the menu ⋮ at the top-right of Chrome.", "Tap \"Install app\" or \"Add to Home screen\".", "Tap \"Install\"."],
      macSafari: ["In the menu bar, choose File → \"Add to Dock\".", "Click \"Add\"."],
      firefoxDesktop: "Firefox on computers can't install web apps. Open this page in Chrome or Edge to install it.",
      desktop: ["Click the install icon ⊕ at the right end of the address bar,", "or open the browser menu ⋮ → \"Install Muhasabah\" (Edge: Apps → Install this site as an app).", "Click \"Install\"."]
    },
    ar: {
      title: "تثبيت محاسبة",
      close: "إغلاق",
      installNow: "ثبّت الآن",
      wait: "جارٍ التجهيز…",
      already: "تطبيق محاسبة مثبّت بالفعل على هذا الجهاز. افتحه من الشاشة الرئيسية أو قائمة التطبيقات.",
      openChrome: "افتح في Chrome",
      inAppAndroid: "المتصفح المدمج في هذا التطبيق لا يمكنه تثبيت التطبيقات. افتح محاسبة في Chrome ثم اضغط تثبيت.",
      inAppIOS: ["هذا المتصفح المدمج لا يمكنه تثبيت التطبيقات.", "اضغط ⋯ أو القائمة واختر \"فتح في Safari\".", "في Safari اضغط مشاركة ⎋ ثم \"إضافة إلى الشاشة الرئيسية\"."],
      ios: ["اضغط زر المشاركة ⎋.", "مرّر واضغط \"إضافة إلى الشاشة الرئيسية\".", "اضغط \"إضافة\"."],
      samsung: ["اضغط القائمة ≡ في الأسفل.", "اضغط \"إضافة الصفحة إلى\" ← \"الشاشة الرئيسية\".", "اضغط \"إضافة\"."],
      firefoxAndroid: ["اضغط القائمة ⋮.", "اضغط \"تثبيت\" أو \"إضافة إلى الشاشة الرئيسية\".", "اضغط \"إضافة\"."],
      android: ["اضغط القائمة ⋮ أعلى يمين Chrome.", "اضغط \"تثبيت التطبيق\" أو \"إضافة إلى الشاشة الرئيسية\".", "اضغط \"تثبيت\"."],
      macSafari: ["من شريط القوائم اختر ملف ← \"إضافة إلى Dock\".", "اضغط \"إضافة\"."],
      firefoxDesktop: "Firefox على الكمبيوتر لا يدعم تثبيت تطبيقات الويب. افتح هذه الصفحة في Chrome أو Edge.",
      desktop: ["اضغط أيقونة التثبيت ⊕ في نهاية شريط العنوان،", "أو افتح قائمة المتصفح ⋮ ← \"تثبيت محاسبة\".", "اضغط \"تثبيت\"."]
    }
  };
  if (typeof T !== "undefined" && T.en) T.bn = Object.fromEntries(Object.entries(T.en).map(function (pair) { return [pair[0], window.MHSBengali[pair[1]] || pair[1]]; }));
  Object.assign(T.bn, {"title": "মুহাসাবা ইনস্টল করুন", "close": "বন্ধ করুন", "installNow": "এখন ইনস্টল করুন", "wait": "প্রস্তুত হচ্ছে…", "already": "মুহাসাবা ইতিমধ্যে এই ডিভাইসে ইনস্টল আছে। হোম স্ক্রিন বা অ্যাপের তালিকা থেকে খুলুন।", "openChrome": "Chrome-এ খুলুন", "inAppAndroid": "এই অ্যাপের ভেতরের ব্রাউজারে ইনস্টল করা যায় না। Chrome-এ খুলে ইনস্টল করুন।", "inAppIOS": ["এই ব্রাউজারে অ্যাপ ইনস্টল করা যায় না।", "মেনু থেকে Safari-এ খুলুন।", "শেয়ার থেকে Add to Home Screen বেছে নিন।"], "ios": ["শেয়ার বোতামে চাপুন।", "Add to Home Screen বেছে নিন।", "Add চাপুন। অ্যাপ হোম স্ক্রিনে দেখা যাবে।"], "samsung": ["নিচের মেনুতে চাপুন।", "Add page to → Home screen বেছে নিন।", "Add চাপুন।"], "firefoxAndroid": ["মেনুতে চাপুন।", "Install অথবা Add to Home screen বেছে নিন।", "Add চাপুন।"], "android": ["Chrome-এর ওপরের মেনু খুলুন।", "Install app অথবা Add to Home screen বেছে নিন।", "Install চাপুন।"], "macSafari": ["File → Add to Dock বেছে নিন।", "Add চাপুন।"], "firefoxDesktop": "কম্পিউটারের Firefox-এ ওয়েব অ্যাপ ইনস্টল করা যায় না। Chrome বা Edge-এ খুলুন।", "desktop": ["অ্যাড্রেস বারের ইনস্টল আইকনে চাপুন।", "অথবা মেনু থেকে Install Muhasabah বেছে নিন।", "Install চাপুন।"]});
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k]; }

  function isStandalone() {
    return (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: window-controls-overlay)").matches))
      || window.navigator.standalone === true;
  }
  function dismissed() { try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function show() { if (!bar || isStandalone() || dismissed() || installed) return; bar.hidden = false; bar.classList.add("show"); }
  function hide() { if (bar) { bar.classList.remove("show"); bar.hidden = true; } }

  function gotPrompt(e) {
    deferred = e;
    var w = waiters; waiters = [];
    w.forEach(function (fn) { fn(e); });
    show();
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); gotPrompt(e); });
  document.addEventListener("mhs:bip", function () { if (window.__mhsBIP) gotPrompt(window.__mhsBIP); });
  window.addEventListener("appinstalled", function () { installed = true; deferred = null; window.__mhsBIP = null; hide(); closeSheet(); });

  function waitForPrompt(ms) {
    if (deferred) return Promise.resolve(deferred);
    return new Promise(function (resolve) {
      var done = false;
      function fin(v) { if (done) return; done = true; resolve(v); }
      waiters.push(fin);
      setTimeout(function () { fin(null); }, ms);
    });
  }

  function runPrompt() {
    var e = deferred;
    if (!e) return Promise.resolve(false);
    deferred = null; window.__mhsBIP = null; // a prompt event can only be used once
    return Promise.resolve().then(function () { return e.prompt(); }).then(function () {
      return e.userChoice;
    }).then(function (choice) {
      if (choice && choice.outcome === "accepted") { installed = true; hide(); }
      return true;
    }).catch(function () { return false; });
  }

  /* ---------- guide sheet ---------- */
  var sheet = null;
  function closeSheet() { if (sheet) { sheet.remove(); sheet = null; } }
  function css() {
    if (document.getElementById("mhs-install-css")) return;
    var s = document.createElement("style");
    s.id = "mhs-install-css";
    s.textContent =
      "#mhs-install-sheet{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);padding:12px 12px calc(96px + env(safe-area-inset-bottom,0px));box-sizing:border-box;overflow-y:auto}" +
      "#mhs-install-sheet .card{position:relative;width:100%;max-width:28rem;margin:0 auto;background:linear-gradient(180deg,#141822,#0a0d14);border:1px solid rgba(0,200,83,.28);border-radius:20px;padding:20px 18px 18px;color:#fff;box-shadow:0 -12px 40px rgba(0,0,0,.5);animation:mhsSheetUp .25s ease-out;box-sizing:border-box}" +
      "@media(min-width:640px){#mhs-install-sheet{align-items:center}}" +
      "#mhs-install-sheet .x{position:absolute;top:10px;right:10px;width:36px;height:36px;padding:0;border-radius:50%;justify-content:center;font-size:20px;line-height:1;background:rgba(255,255,255,.1);color:#fff}" +
      "#mhs-install-sheet[dir=rtl] .x{right:auto;left:10px}" +
      "#mhs-install-sheet h3{padding:0 44px 0 0}#mhs-install-sheet[dir=rtl] h3{padding:0 0 0 44px}" +
      "@keyframes mhsSheetUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}" +
      "#mhs-install-sheet h3{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:600;margin:0 0 12px}" +
      "#mhs-install-sheet h3 img{width:36px;height:36px;border-radius:10px}" +
      "#mhs-install-sheet p{font-size:13px;line-height:1.55;color:rgba(255,255,255,.75);margin:0 0 12px}" +
      "#mhs-install-sheet ol{margin:0 0 14px;padding:0;list-style:none;counter-reset:s}" +
      "#mhs-install-sheet li{counter-increment:s;position:relative;padding:6px 0 6px 34px;font-size:13px;line-height:1.5;color:rgba(255,255,255,.85)}" +
      "#mhs-install-sheet[dir=rtl] li{padding:6px 34px 6px 0}" +
      "#mhs-install-sheet li:before{content:counter(s);position:absolute;left:0;top:5px;width:24px;height:24px;border-radius:50%;background:rgba(0,200,83,.16);color:#00e676;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center}" +
      "#mhs-install-sheet[dir=rtl] li:before{left:auto;right:0}" +
      "#mhs-install-sheet .row{display:flex;gap:8px;justify-content:flex-end}" +
      "#mhs-install-sheet button,#mhs-install-sheet a.b{border:0;border-radius:12px;padding:11px 16px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}" +
      "#mhs-install-sheet .go{background:linear-gradient(180deg,#00e676,#00c853);color:#04140a}" +
      "#mhs-install-sheet .ghost{background:rgba(255,255,255,.08);color:#fff}";
    document.head.appendChild(s);
  }
  function node(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function openSheet(content) {
    css(); closeSheet();
    sheet = node("div"); sheet.id = "mhs-install-sheet";
    sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true");
    sheet.dir = lang() === "ar" ? "rtl" : "ltr";
    var card = node("div", "card");
    var x = node("button", "x", "\u00d7"); x.type = "button"; x.setAttribute("aria-label", t("close"));
    x.addEventListener("click", closeSheet);
    card.appendChild(x);
    var h = node("h3"); var img = new Image(); img.src = "/icons/icon-192.png"; img.alt = "";
    h.appendChild(img); h.appendChild(document.createTextNode(t("title")));
    card.appendChild(h);
    if (content.text) card.appendChild(node("p", "", content.text));
    if (content.steps) {
      var ol = node("ol");
      content.steps.forEach(function (s) { ol.appendChild(node("li", "", s)); });
      card.appendChild(ol);
    }
    var row = node("div", "row");
    var close = node("button", "ghost", t("close")); close.type = "button";
    close.addEventListener("click", closeSheet);
    row.appendChild(close);
    if (content.action) row.appendChild(content.action);
    card.appendChild(row);
    sheet.appendChild(card);
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });
    document.body.appendChild(sheet);

    // If the browser makes its install dialog available while the steps are open, offer it directly.
    if (!content.action && !inApp) {
      waitForPrompt(60000).then(function (e) {
        if (!e || !sheet || !card.isConnected) return;
        var go = node("button", "go", t("installNow")); go.type = "button";
        go.addEventListener("click", function () { closeSheet(); runPrompt(); });
        row.appendChild(go);
      });
    }
  }

  function chromeIntentUrl() {
    var u = location.host + location.pathname + location.search;
    return "intent://" + u + "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" + encodeURIComponent(location.href) + ";end";
  }

  function showGuide() {
    if (installed) { openSheet({ text: t("already") }); return; }
    if (inApp) {
      if (isAndroid) {
        var a = node("a", "b go", t("openChrome")); a.href = chromeIntentUrl();
        openSheet({ text: t("inAppAndroid"), action: a });
      } else {
        openSheet({ steps: t("inAppIOS") });
      }
      return;
    }
    if (isIOS) return openSheet({ steps: t("ios") });
    if (isAndroid) {
      if (isSamsung) return openSheet({ steps: t("samsung") });
      if (isFirefox) return openSheet({ steps: t("firefoxAndroid") });
      return openSheet({ steps: t("android") });
    }
    if (isMacSafari) return openSheet({ steps: t("macSafari") });
    if (isFirefox) return openSheet({ text: t("firefoxDesktop") });
    return openSheet({ steps: t("desktop") });
  }

  var busy = false;
  if (btn) btn.addEventListener("click", function () {
    if (busy) return;
    if (deferred) { runPrompt(); return; }
    if (inApp || isIOS || installed) { showGuide(); return; }
    // The browser may still be preparing its install dialog — wait a moment before falling back to steps.
    busy = true;
    var label = btn.textContent;
    btn.textContent = t("wait");
    waitForPrompt(3500).then(function (e) {
      busy = false;
      btn.textContent = label;
      if (e) runPrompt(); else showGuide();
    });
  });
  if (dis) dis.addEventListener("click", function () { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} hide(); });

  // Detect an already-installed copy (Chrome on Android/desktop) so we don't offer Install again.
  if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps().then(function (apps) {
      if (apps && apps.length) { installed = true; hide(); }
    }).catch(function () {});
  }

  window.MHSInstall = { show: show, isStandalone: isStandalone, guide: showGuide };

  if (deferred) show();
  // Only pop the bar in automatically when the browser actually offers an
  // install prompt — otherwise it just jolts the layout a few seconds after open.
  setTimeout(function () {
    if (!isStandalone() && !dismissed() && (deferred || window.__mhsBIP)) show();
  }, 2500);
})();
