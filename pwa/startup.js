/* A small, independent loading state survives a missing or broken app bundle. */
(function () {
  "use strict";
  var root = document.getElementById("root");
  var shell = document.getElementById("mhs-startup");
  var message = document.getElementById("mhs-startup-message");
  var retry = document.getElementById("mhs-startup-retry");
  var language = "en";
  try { language = (JSON.parse(localStorage.getItem("muhasabah:data:v1")) || {}).lang || "en"; } catch (_) {}
  var text = {
    en: ["Opening…", "Muhasabah couldn’t open. Check your connection and try again.", "Try again"],
    bn: ["খোলা হচ্ছে…", "মুহাসাবা খোলা যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।", "আবার চেষ্টা করুন"],
    ar: ["جارٍ الفتح…", "تعذر فتح محاسبة. تحقق من الاتصال وحاول مرة أخرى.", "حاول مرة أخرى"]
  }[language];
  if (!text) {
    /* Other languages: use this device's saved automatic translations, if any. */
    var en = ["Opening…", "Muhasabah couldn’t open. Check your connection and try again.", "Try again"], saved = {};
    try { saved = JSON.parse(localStorage.getItem("mhs:i18n:v1:" + language)) || {}; } catch (_) {}
    text = en.map(function (s) { return saved[s] || s; });
  }
  document.documentElement.lang = /^[a-z]{2,3}(-[A-Z]{2})?$/.test(language) ? language : "en";
  document.documentElement.dir = /^(ar|he|fa|ur|ps|sd|ug|dv|ckb|yi)$/.test(language) ? "rtl" : "ltr";
  message.textContent = text[0];
  retry.textContent = text[2];
  retry.addEventListener("click", function () { location.reload(); });
  function failed() {
    if (!shell.isConnected) return;
    message.textContent = text[1];
    message.classList.remove("is-quiet"); // the loading label is for screen readers only
    shell.classList.add("is-failed");
    retry.hidden = false;
  }
  // A stalled request also needs recovery, even if no error event fires.
  var timer = setTimeout(failed, 15000);
  function resourceError(event) {
    if (event.target && event.target.tagName === "SCRIPT") failed();
  }
  function runtimeError() { failed(); }
  window.addEventListener("error", resourceError, true);
  window.addEventListener("error", runtimeError);
  window.addEventListener("unhandledrejection", runtimeError);
  var observer = new MutationObserver(function () {
    if (shell.isConnected) return;
    clearTimeout(timer);
    observer.disconnect();
    window.removeEventListener("error", resourceError, true);
    window.removeEventListener("error", runtimeError);
    window.removeEventListener("unhandledrejection", runtimeError);
  });
  observer.observe(root, { childList: true, subtree: true });
})();
