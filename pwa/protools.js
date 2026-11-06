/* Muhasabah Pro tools — Google Drive auto-backup and App lock.
 *
 * Google Drive: backups go to the member's own Drive (hidden app folder, drive.appdata scope),
 * straight from the browser. Muhasabah's server never receives the data. Signing in with the
 * same Pro email on another device and reconnecting Drive restores everything.
 * Needs GOOGLE_CLIENT_ID (served by /api/pro); shows "Coming soon" until it is set.
 *
 * App lock: unlock with the phone's own fingerprint / face / screen lock (WebAuthn platform
 * authenticator) or a custom PIN / password (PBKDF2-hashed, stored only on this device).
 * Forgotten PIN → sign in with the Pro account to remove the lock.
 */
(function () {
  "use strict";
  if (window.__mhsProTools) return;
  window.__mhsProTools = true;

  var T = {
    en: {
      title: "Pro tools", sub: "Your data stays yours — backed up to your own Google Drive and protected by your own lock.",
      proOnly: "Pro", unlockPro: "Unlock with Pro", soon: "Coming soon",
      dTitle: "Google Drive backup", dDesc: "Automatic, private backups in a hidden folder of your own Google Drive. Sign in on any device and get everything back. Nothing is stored on our servers.",
      dConnect: "Connect Google Drive", dConnected: "Connected · {email}", dConnectedNo: "Connected", dLast: "Last backup: {d}", dNever: "No backup yet",
      dNow: "Back up now", dRestore: "Restore from Drive", dDisconnect: "Disconnect", dAuto: "Auto-backup", dAutoSub: "Backs up a few seconds after each change.",
      dLinked: "Your account is linked to Google Drive. Connect to restore your data on this device.",
      dReconnect: "Tap to resume Google Drive sync", dSaving: "Backing up…", dSaved: "Backed up to Google Drive", dFail: "Google Drive backup failed. Try again.",
      dNoBackup: "No Muhasabah backup found in this Google Drive yet.", dRemote: "Drive backup from {d}",
      dConfirm: "Replace the data on this device with your Google Drive backup from {d}? Current data is kept as a restore point.",
      dSoon: "Google Drive sync is being set up and opens very soon, in shaa Allah.",
      lTitle: "App lock", lDesc: "Open Muhasabah with your fingerprint, face or phone screen lock — or a PIN or password of your own.",
      lOn: "On", lOff: "Off", lEnable: "Turn on app lock", lDisable: "Turn off", lChange: "Change PIN / password",
      lBio: "Unlock with fingerprint / device lock", lBioSub: "Uses your phone's own biometrics or screen lock.", lBioNo: "Fingerprint/device unlock isn't available in this browser.",
      lPin: "PIN", lPass: "Password", lNew: "New {k}", lConfirmK: "Confirm {k}", lPinHint: "4–8 digits", lPassHint: "At least 6 characters",
      lSave: "Save and lock", lCancel: "Cancel", lMismatch: "The two entries don't match.", lShort: "Too short.",
      lAfter: "Lock again", lImm: "Immediately", l1: "After 1 minute", l5: "After 5 minutes", l15: "After 15 minutes",
      lLocked: "Muhasabah is locked", lEnter: "Enter your {k}", lUseBio: "Use fingerprint / device lock", lWrong: "Wrong {k}. Try again.",
      lWait: "Too many attempts. Try again in {s}s.", lForgot: "Forgot? Sign in with your Pro account", lVerify: "Confirm it's you",
      lEmail: "Pro account email", lPw: "Account password", lSignIn: "Sign in and remove lock", lBadAcc: "This lock belongs to a different Pro account.",
      lRemoved: "App lock removed.", lSaved: "App lock is on.", lBack: "Back", del: "Delete", ok: "OK"
    },
    bn: {
      title: "প্রো টুলস", sub: "আপনার ডেটা আপনারই — নিজের Google Drive-এ ব্যাকআপ আর নিজের লক দিয়ে সুরক্ষিত।",
      proOnly: "প্রো", unlockPro: "প্রো দিয়ে চালু করুন", soon: "শিগগিরই আসছে",
      dTitle: "Google Drive ব্যাকআপ", dDesc: "আপনার নিজের Google Drive-এর একটি গোপন ফোল্ডারে স্বয়ংক্রিয় ও ব্যক্তিগত ব্যাকআপ। যেকোনো ডিভাইসে সাইন ইন করে সব ফিরে পান। আমাদের সার্ভারে কিছুই রাখা হয় না।",
      dConnect: "Google Drive যুক্ত করুন", dConnected: "যুক্ত · {email}", dConnectedNo: "যুক্ত", dLast: "শেষ ব্যাকআপ: {d}", dNever: "এখনো ব্যাকআপ হয়নি",
      dNow: "এখনই ব্যাকআপ", dRestore: "Drive থেকে ফিরিয়ে আনুন", dDisconnect: "সংযোগ বিচ্ছিন্ন", dAuto: "অটো ব্যাকআপ", dAutoSub: "প্রতিটি পরিবর্তনের কয়েক সেকেন্ড পর ব্যাকআপ হয়।",
      dLinked: "আপনার অ্যাকাউন্ট Google Drive-এর সাথে যুক্ত। এই ডিভাইসে ডেটা ফিরিয়ে আনতে সংযোগ দিন।",
      dReconnect: "Google Drive সিঙ্ক চালু রাখতে ট্যাপ করুন", dSaving: "ব্যাকআপ হচ্ছে…", dSaved: "Google Drive-এ ব্যাকআপ হয়েছে", dFail: "Google Drive ব্যাকআপ ব্যর্থ। আবার চেষ্টা করুন।",
      dNoBackup: "এই Google Drive-এ এখনো কোনো মুহাসাবা ব্যাকআপ নেই।", dRemote: "{d} তারিখের Drive ব্যাকআপ",
      dConfirm: "এই ডিভাইসের ডেটা {d} তারিখের Google Drive ব্যাকআপ দিয়ে প্রতিস্থাপন করবেন? বর্তমান ডেটা রিস্টোর পয়েন্ট হিসেবে রাখা হবে।",
      dSoon: "Google Drive সিঙ্ক চালুর কাজ চলছে, ইনশাআল্লাহ খুব শিগগিরই চালু হবে।",
      lTitle: "অ্যাপ লক", lDesc: "ফিঙ্গারপ্রিন্ট, ফেস বা ফোনের স্ক্রিন লক দিয়ে — অথবা নিজের PIN বা পাসওয়ার্ড দিয়ে মুহাসাবা খুলুন।",
      lOn: "চালু", lOff: "বন্ধ", lEnable: "অ্যাপ লক চালু করুন", lDisable: "বন্ধ করুন", lChange: "PIN / পাসওয়ার্ড বদলান",
      lBio: "ফিঙ্গারপ্রিন্ট / ফোনের লক দিয়ে খুলুন", lBioSub: "আপনার ফোনের নিজস্ব বায়োমেট্রিক বা স্ক্রিন লক ব্যবহার করে।", lBioNo: "এই ব্রাউজারে ফিঙ্গারপ্রিন্ট/ডিভাইস আনলক সুবিধা নেই।",
      lPin: "PIN", lPass: "পাসওয়ার্ড", lNew: "নতুন {k}", lConfirmK: "{k} নিশ্চিত করুন", lPinHint: "৪–৮ সংখ্যা", lPassHint: "কমপক্ষে ৬ অক্ষর",
      lSave: "সংরক্ষণ করে লক করুন", lCancel: "বাতিল", lMismatch: "দুটি এন্ট্রি মেলেনি।", lShort: "খুব ছোট।",
      lAfter: "আবার লক হবে", lImm: "সাথে সাথে", l1: "১ মিনিট পর", l5: "৫ মিনিট পর", l15: "১৫ মিনিট পর",
      lLocked: "মুহাসাবা লক করা আছে", lEnter: "আপনার {k} দিন", lUseBio: "ফিঙ্গারপ্রিন্ট / ফোনের লক ব্যবহার করুন", lWrong: "{k} ভুল। আবার চেষ্টা করুন।",
      lWait: "অনেকবার চেষ্টা হয়েছে। {s} সেকেন্ড পর চেষ্টা করুন।", lForgot: "ভুলে গেছেন? প্রো অ্যাকাউন্ট দিয়ে সাইন ইন করুন", lVerify: "নিশ্চিত করুন এটি আপনি",
      lEmail: "প্রো অ্যাকাউন্টের ইমেইল", lPw: "অ্যাকাউন্টের পাসওয়ার্ড", lSignIn: "সাইন ইন করে লক সরান", lBadAcc: "এই লকটি অন্য একটি প্রো অ্যাকাউন্টের।",
      lRemoved: "অ্যাপ লক সরানো হয়েছে।", lSaved: "অ্যাপ লক চালু হয়েছে।", lBack: "পেছনে", del: "মুছুন", ok: "ঠিক আছে"
    },
    ar: {
      title: "أدوات Pro", sub: "بياناتك ملكك — نسخ احتياطي إلى Google Drive الخاص بك وحماية بقفلك الخاص.",
      proOnly: "Pro", unlockPro: "افتح مع Pro", soon: "قريبًا",
      dTitle: "نسخ احتياطي إلى Google Drive", dDesc: "نسخ احتياطي تلقائي وخاص في مجلد مخفي داخل Google Drive الخاص بك. سجّل الدخول من أي جهاز واستعد كل شيء. لا يُخزَّن شيء على خوادمنا.",
      dConnect: "ربط Google Drive", dConnected: "متصل · {email}", dConnectedNo: "متصل", dLast: "آخر نسخة: {d}", dNever: "لا توجد نسخة بعد",
      dNow: "نسخ الآن", dRestore: "استعادة من Drive", dDisconnect: "فصل", dAuto: "نسخ تلقائي", dAutoSub: "ينسخ بعد ثوانٍ من كل تغيير.",
      dLinked: "حسابك مرتبط بـ Google Drive. اربطه لاستعادة بياناتك على هذا الجهاز.",
      dReconnect: "اضغط لمتابعة مزامنة Google Drive", dSaving: "جارٍ النسخ…", dSaved: "تم النسخ إلى Google Drive", dFail: "فشل النسخ إلى Google Drive. حاول مجددًا.",
      dNoBackup: "لا توجد نسخة محاسبة في هذا الـ Google Drive بعد.", dRemote: "نسخة Drive من {d}",
      dConfirm: "استبدال بيانات هذا الجهاز بنسخة Google Drive من {d}؟ ستُحفظ البيانات الحالية كنقطة استعادة.",
      dSoon: "يجري إعداد مزامنة Google Drive وستُفتح قريبًا جدًا إن شاء الله.",
      lTitle: "قفل التطبيق", lDesc: "افتح محاسبة ببصمتك أو وجهك أو قفل شاشة هاتفك — أو برمز PIN أو كلمة مرور خاصة.",
      lOn: "مفعّل", lOff: "متوقف", lEnable: "تفعيل قفل التطبيق", lDisable: "إيقاف", lChange: "تغيير PIN / كلمة المرور",
      lBio: "الفتح بالبصمة / قفل الجهاز", lBioSub: "يستخدم القياسات الحيوية أو قفل الشاشة في هاتفك.", lBioNo: "الفتح بالبصمة/الجهاز غير متاح في هذا المتصفح.",
      lPin: "PIN", lPass: "كلمة المرور", lNew: "{k} جديد", lConfirmK: "تأكيد {k}", lPinHint: "4–8 أرقام", lPassHint: "6 أحرف على الأقل",
      lSave: "حفظ وقفل", lCancel: "إلغاء", lMismatch: "الإدخالان غير متطابقين.", lShort: "قصير جدًا.",
      lAfter: "القفل مجددًا", lImm: "فورًا", l1: "بعد دقيقة", l5: "بعد 5 دقائق", l15: "بعد 15 دقيقة",
      lLocked: "محاسبة مقفل", lEnter: "أدخل {k}", lUseBio: "استخدم البصمة / قفل الجهاز", lWrong: "{k} غير صحيح. حاول مجددًا.",
      lWait: "محاولات كثيرة. حاول بعد {s} ث.", lForgot: "نسيت؟ سجّل الدخول بحساب Pro", lVerify: "أكّد هويتك",
      lEmail: "بريد حساب Pro", lPw: "كلمة مرور الحساب", lSignIn: "تسجيل الدخول وإزالة القفل", lBadAcc: "هذا القفل يخص حساب Pro آخر.",
      lRemoved: "أُزيل قفل التطبيق.", lSaved: "قفل التطبيق مفعّل.", lBack: "رجوع", del: "حذف", ok: "حسنًا"
    }
  };
  function lang() { var l = document.documentElement.lang; return T[l] ? l : "en"; }
  function t(k, v) { var s = T[lang()][k] || T.en[k] || k; if (v) Object.keys(v).forEach(function (x) { s = s.split("{" + x + "}").join(v[x]); }); return s; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function loc() { return lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar" : "en-US"; }
  function when(ms) { try { return new Date(ms).toLocaleString(loc(), { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return new Date(ms).toString(); } }
  function jget(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function jset(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function toast(m) {
    var el = document.createElement("div"); el.className = "mhs-pt-toast"; el.setAttribute("role", "status"); el.textContent = m;
    document.body.appendChild(el); setTimeout(function () { el.classList.add("out"); }, 2600); setTimeout(function () { el.remove(); }, 3100);
  }
  function proCfg() { return window.MuhasabahPro && window.MuhasabahPro.state ? window.MuhasabahPro.state() : null; }
  function isPro() { var c = proCfg(); if (c && !c.unreachable) return !!(c.member && c.member.pro); try { return localStorage.getItem("mhs:pro") === "1"; } catch (e) { return false; } }
  function proEmail() { var c = proCfg(); return (c && c.member && c.member.email) || ""; }
  function refreshAll() { document.querySelectorAll("mhs-pro-tools").forEach(function (p) { p.render && p.render(); }); }

  var b64 = function (buf) { var s = "", a = new Uint8Array(buf); for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); };
  var unb64 = function (s) { var r = atob(s), a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; };
  function rand(n) { return crypto.getRandomValues(new Uint8Array(n)); }

  /* ======================= App lock ======================= */
  var LOCK = "mhs:lock", FAIL = "mhs:lock-fail", ITER = 150000;
  var Lock = {
    cfg: function () { return jget(LOCK); },
    derive: function (secret, salt, iter) {
      return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), "PBKDF2", false, ["deriveBits"])
        .then(function (k) { return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unb64(salt), iterations: iter }, k, 256); })
        .then(b64);
    },
    bioAvailable: function () {
      try { return window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable ? PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(function () { return false; }) : Promise.resolve(false); }
      catch (e) { return Promise.resolve(false); }
    },
    registerBio: function () {
      return navigator.credentials.create({ publicKey: {
        challenge: rand(32), rp: { name: "Muhasabah", id: location.hostname },
        user: { id: rand(16), name: proEmail() || "muhasabah", displayName: "Muhasabah" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "discouraged" },
        timeout: 60000, attestation: "none"
      } }).then(function (c) { return b64(c.rawId); });
    },
    checkBio: function (id) {
      return navigator.credentials.get({ publicKey: {
        challenge: rand(32), rpId: location.hostname, userVerification: "required", timeout: 60000,
        allowCredentials: [{ type: "public-key", id: unb64(id), transports: ["internal", "hybrid"] }]
      } }).then(function (a) { return !!a; });
    },
    set: function (kind, secret, bio, after) {
      var salt = b64(rand(16));
      return Lock.derive(secret, salt, ITER).then(function (hash) {
        jset(LOCK, { v: 1, kind: kind, len: kind === "pin" ? secret.length : 0, salt: salt, hash: hash, iter: ITER, bio: bio || null, after: after || 0, email: proEmail() });
        jset(FAIL, null);
      });
    },
    check: function (secret) {
      var c = Lock.cfg(); if (!c) return Promise.resolve(true);
      return Lock.derive(secret, c.salt, c.iter || ITER).then(function (h) { return h === c.hash; });
    },
    clear: function () { jset(LOCK, null); jset(FAIL, null); document.documentElement.classList.remove("mhs-locked"); },
    update: function (patch) { var c = Lock.cfg(); if (c) jset(LOCK, Object.assign(c, patch)); }
  };

  var overlay = null, hiddenAt = 0, pending = null;
  /* Show the lock screen. mode "unlock" covers the app; mode "verify" confirms before a lock change. */
  function showLock(mode) {
    var c = Lock.cfg(); if (!c) return Promise.resolve(true);
    if (overlay) return pending ? pending.promise : Promise.resolve(true);
    document.documentElement.classList.add("mhs-locked");
    var p = {}; p.promise = new Promise(function (res) { p.resolve = res; }); pending = p;
    overlay = document.createElement("div");
    overlay.id = "mhs-lock"; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-labelledby", "mhs-lock-t");
    var entry = "", view = "enter";
    function k() { return c.kind === "pin" ? t("lPin") : t("lPass"); }
    function failState() { return jget(FAIL) || { n: 0, until: 0 }; }
    function done(ok) {
      if (!overlay) return;
      overlay.classList.add("out");
      var o = overlay; overlay = null; pending = null;
      setTimeout(function () { o.remove(); }, 260);
      if (ok || mode === "unlock") document.documentElement.classList.remove("mhs-locked");
      p.resolve(!!ok);
    }
    function wrong() {
      var f = failState(); f.n++; if (f.n >= 5) f.until = Date.now() + Math.min(300, 30 * Math.pow(2, f.n - 5)) * 1000; jset(FAIL, f);
      entry = ""; draw(t("lWrong", { k: k() }), true);
    }
    function attempt(v) {
      var f = failState();
      if (f.until > Date.now()) { draw(t("lWait", { s: Math.ceil((f.until - Date.now()) / 1000) }), true); return; }
      Lock.check(v).then(function (ok) { if (ok) { jset(FAIL, null); done(true); } else wrong(); });
    }
    function bio() {
      if (!c.bio) return;
      Lock.checkBio(c.bio).then(function (ok) { if (ok) { jset(FAIL, null); done(true); } }).catch(function () {});
    }
    function draw(message, shake) {
      overlay.dir = lang() === "ar" ? "rtl" : "ltr";
      var head = '<div class="mhs-lock-top"><span class="mhs-pro-crest" style="--s:64px"><img src="/icons/logo.webp" alt="" width="64" height="64"></span>' +
        '<h2 id="mhs-lock-t">' + esc(mode === "verify" ? t("lVerify") : t("lLocked")) + "</h2></div>";
      var body;
      if (view === "forgot") {
        body = '<form class="mhs-lock-form" data-f="acc" novalidate><label><span>' + esc(t("lEmail")) + '</span><input name="email" type="email" dir="ltr" autocomplete="email" value="' + esc(c.email || "") + '"></label>' +
          '<label><span>' + esc(t("lPw")) + '</span><input name="pw" type="password" dir="ltr" autocomplete="current-password"></label>' +
          '<p class="mhs-lock-msg' + (shake ? " bad" : "") + '" role="alert">' + esc(message || "") + "</p>" +
          '<button type="submit" class="mhs-pro-go">' + esc(t("lSignIn")) + '</button></form><button type="button" class="mhs-pro-link" data-a="back">' + esc(t("lBack")) + "</button>";
      } else if (c.kind === "pin") {
        var dots = ""; for (var i = 0; i < c.len; i++) dots += '<i class="' + (i < entry.length ? "on" : "") + '"></i>';
        var keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, c.bio ? "bio" : "", 0, "del"].map(function (x) {
          if (x === "") return "<span></span>";
          if (x === "bio") return '<button type="button" class="mhs-key ic" data-a="bio" aria-label="' + esc(t("lUseBio")) + '">' + FP + "</button>";
          if (x === "del") return '<button type="button" class="mhs-key ic" data-k="del" aria-label="' + esc(t("del")) + '">⌫</button>';
          return '<button type="button" class="mhs-key" data-k="' + x + '">' + x + "</button>";
        }).join("");
        body = '<p class="mhs-lock-sub">' + esc(t("lEnter", { k: k() })) + '</p><div class="mhs-lock-dots' + (shake ? " shake" : "") + '" dir="ltr" aria-hidden="true">' + dots + "</div>" +
          '<p class="mhs-lock-msg' + (shake ? " bad" : "") + '" role="alert">' + esc(message || "") + '</p><div class="mhs-keypad" dir="ltr">' + keys + "</div>";
      } else {
        body = '<form class="mhs-lock-form" data-f="pass" novalidate><label><span>' + esc(t("lEnter", { k: k() })) + '</span><input name="pw" type="password" dir="ltr" autocomplete="current-password" autofocus></label>' +
          '<p class="mhs-lock-msg' + (shake ? " bad" : "") + '" role="alert">' + esc(message || "") + '</p><button type="submit" class="mhs-pro-go">' + esc(t("ok")) + "</button></form>" +
          (c.bio ? '<button type="button" class="mhs-lock-bio" data-a="bio">' + FP + "<span>" + esc(t("lUseBio")) + "</span></button>" : "");
      }
      var foot = view === "forgot" ? "" : (c.email ? '<button type="button" class="mhs-pro-link" data-a="forgot">' + esc(t("lForgot")) + "</button>" : "") +
        (mode === "verify" ? '<button type="button" class="mhs-pro-link" data-a="cancel">' + esc(t("lCancel")) + "</button>" : "");
      overlay.innerHTML = '<div class="mhs-lock-card">' + head + body + '<div class="mhs-lock-foot">' + foot + "</div></div>";
      var f = overlay.querySelector("input"); if (f) try { f.focus(); } catch (e) {}
    }
    overlay.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var key = b.getAttribute("data-k"), a = b.getAttribute("data-a");
      if (key) {
        if (key === "del") entry = entry.slice(0, -1); else if (entry.length < c.len) entry += key;
        draw("");
        if (entry.length === c.len) { var v = entry; setTimeout(function () { attempt(v); }, 90); }
        if (navigator.vibrate) try { navigator.vibrate(8); } catch (x) {}
        return;
      }
      if (a === "bio") bio();
      else if (a === "forgot") { view = "forgot"; draw(""); }
      else if (a === "back") { view = "enter"; draw(""); }
      else if (a === "cancel") done(false);
    });
    overlay.addEventListener("keydown", function (e) {
      if (c.kind !== "pin" || view !== "enter") { if (e.key === "Escape" && mode === "verify") done(false); return; }
      if (/^\d$/.test(e.key)) { var btn = overlay.querySelector('[data-k="' + e.key + '"]'); if (btn) btn.click(); }
      else if (e.key === "Backspace") { var d = overlay.querySelector('[data-k="del"]'); if (d) d.click(); }
      else if (e.key === "Escape" && mode === "verify") done(false);
    });
    overlay.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      if (f.getAttribute("data-f") === "pass") { attempt(f.pw.value); return; }
      var email = f.email.value.trim().toLowerCase();
      if (c.email && email !== String(c.email).toLowerCase()) { draw(t("lBadAcc"), true); return; }
      var go = f.querySelector("button"); go.disabled = true; go.classList.add("busy");
      (window.MuhasabahPro ? window.MuhasabahPro.identity() : Promise.reject(new Error("network")))
        .then(function (id) { return id.login(email, f.pw.value); })
        .then(function () { Lock.clear(); done(true); toast(t("lRemoved")); refreshAll(); if (window.MuhasabahPro) window.MuhasabahPro.refresh(); })
        .catch(function (err) { var m = (window.MHSProErr && window.MHSProErr(err && err.code)) || t("lWrong", { k: t("lPw") }); go.disabled = false; go.classList.remove("busy"); draw(m, true); });
    });
    document.body.appendChild(overlay);
    draw("");
    if (c.bio && mode === "unlock") setTimeout(bio, 350);
    return p.promise;
  }
  var FP = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 11v3.5c0 2.2-.6 4.2-1.7 5.9"/><path d="M8.6 9.2A4 4 0 0 1 16 11v2.5c0 1.6-.2 3.1-.7 4.5"/><path d="M5.2 15.5c.5-1.3.8-2.7.8-4.2a6 6 0 0 1 9.4-4.9"/><path d="M18.4 8.6c.4.8.6 1.7.6 2.7v1.4"/><path d="M3.6 10.5a8.5 8.5 0 0 1 2-4.6"/><path d="M8.3 3.9A8.5 8.5 0 0 1 20 6.6"/><path d="M13.2 21c.4-.7.7-1.4 1-2.2"/></svg>';

  /* Lock again when returning to the app after the chosen delay; hide content in the app switcher. */
  document.addEventListener("visibilitychange", function () {
    var c = Lock.cfg(); if (!c) return;
    if (document.visibilityState === "hidden") { hiddenAt = Date.now(); if (!c.after) document.documentElement.classList.add("mhs-locked"); }
    else if (hiddenAt && Date.now() - hiddenAt >= (c.after || 0)) showLock("unlock");
    else if (!overlay) document.documentElement.classList.remove("mhs-locked");
  });

  /* ======================= Google Drive ======================= */
  var DSTATE = "mhs:gdrive", TOKEN = "mhs:gdrive-token", SCOPE = "https://www.googleapis.com/auth/drive.appdata", FILE = "muhasabah-backup.json";
  var gisPromise = null, autoTimer = null;
  var Drive = {
    state: function () { return jget(DSTATE) || {}; },
    save: function (patch) { jset(DSTATE, Object.assign(Drive.state(), patch)); },
    token: function () { try { var x = JSON.parse(sessionStorage.getItem(TOKEN) || "null"); return x && x.exp > Date.now() + 60000 ? x.t : null; } catch (e) { return null; } },
    clientId: function () { var c = proCfg(); return c && c.googleClientId; },
    loadGis: function () {
      if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
      if (gisPromise) return gisPromise;
      gisPromise = new Promise(function (res, rej) {
        var s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true;
        s.onload = function () { res(); }; s.onerror = function () { gisPromise = null; rej(new Error("gis")); };
        document.head.appendChild(s);
      });
      return gisPromise;
    },
    /* Must run from a tap: Google shows its own account / consent window. */
    authorize: function (interactive) {
      var id = Drive.clientId(); if (!id) return Promise.reject(new Error("not_configured"));
      return Drive.loadGis().then(function () {
        return new Promise(function (res, rej) {
          var client = google.accounts.oauth2.initTokenClient({
            client_id: id, scope: SCOPE, include_granted_scopes: true, login_hint: Drive.state().email || proEmail() || undefined,
            callback: function (r) {
              if (r.error || !google.accounts.oauth2.hasGrantedAllScopes(r, SCOPE)) { rej(new Error(r.error || "denied")); return; }
              try { sessionStorage.setItem(TOKEN, JSON.stringify({ t: r.access_token, exp: Date.now() + (Number(r.expires_in) || 3600) * 1000 })); } catch (e) {}
              res(r.access_token);
            },
            error_callback: function (e) { rej(new Error((e && e.type) || "popup")); }
          });
          client.requestAccessToken({ prompt: interactive && !Drive.state().connected ? "consent" : "" });
        });
      });
    },
    api: function (url, opts, tok) {
      opts = opts || {}; opts.headers = Object.assign({ Authorization: "Bearer " + tok }, opts.headers || {});
      return fetch(url, opts).then(function (r) {
        if (r.status === 401) { try { sessionStorage.removeItem(TOKEN); } catch (e) {} throw new Error("auth"); }
        if (!r.ok) throw new Error("drive_" + r.status);
        return r;
      });
    },
    find: function (tok) {
      return Drive.api("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,modifiedTime)&q=" + encodeURIComponent("name='" + FILE + "'"), null, tok)
        .then(function (r) { return r.json(); }).then(function (d) { return (d.files || [])[0] || null; });
    },
    email: function (tok) {
      return Drive.api("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)", null, tok).then(function (r) { return r.json(); })
        .then(function (d) { return d.user && d.user.emailAddress; }).catch(function () { return ""; });
    },
    backup: function (tok) {
      var data = window.MHS && window.MHS.current && window.MHS.current();
      if (!data) return Promise.reject(new Error("nodata"));
      var body = JSON.stringify({ app: "Muhasabah", v: 1, savedAt: Date.now(), data: data });
      return Drive.find(tok).then(function (file) {
        var bd = "mhs" + Math.random().toString(36).slice(2);
        var meta = file ? {} : { name: FILE, parents: ["appDataFolder"], mimeType: "application/json" };
        var multipart = "--" + bd + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(meta) + "\r\n--" + bd + "\r\nContent-Type: application/json\r\n\r\n" + body + "\r\n--" + bd + "--";
        var url = "https://www.googleapis.com/upload/drive/v3/files" + (file ? "/" + file.id : "") + "?uploadType=multipart&fields=id,modifiedTime";
        return Drive.api(url, { method: file ? "PATCH" : "POST", headers: { "Content-Type": "multipart/related; boundary=" + bd }, body: multipart }, tok);
      }).then(function () { Drive.save({ lastBackup: Date.now() }); });
    },
    fetchBackup: function (tok) {
      return Drive.find(tok).then(function (file) {
        if (!file) return null;
        return Drive.api("https://www.googleapis.com/drive/v3/files/" + file.id + "?alt=media", null, tok).then(function (r) { return r.json(); });
      });
    },
    withToken: function (interactive) { var tk = Drive.token(); return tk ? Promise.resolve(tk) : interactive ? Drive.authorize(true) : Promise.reject(new Error("auth")); },
    restore: function (backup) {
      if (!backup || !backup.data) return;
      if (!confirm(t("dConfirm", { d: when(backup.savedAt) }))) return;
      var cur = (window.MHS && window.MHS.current()) || {};
      var data = Object.assign({}, backup.data, { onboarded: true });
      return window.MHS.set("snap:" + window.MHS.dayKey() + "-before-drive-restore", { savedAt: Date.now(), data: cur }).catch(function () {})
        .then(function () { return window.MHS.replace(data); }).then(function () { location.reload(); });
    }
  };
  /* Used by the storage-preference panel (pwa/sync.js). */
  window.MHSDrive = { state: function () { return Drive.state(); }, setAuto: function (on) { if (Drive.state().connected) Drive.save({ auto: !!on }); if (on) scheduleAuto(); } };
  function storagePref() { try { return localStorage.getItem("mhs:storage") || "device"; } catch (e) { return "device"; } }
  function scheduleAuto() {
    var s = Drive.state(); if (!s.connected || s.auto === false || !isPro() || !Drive.clientId() || storagePref() === "server") return;
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function () {
      var tk = Drive.token();
      if (!tk) { nudge(); return; }
      Drive.backup(tk).then(refreshAll).catch(function (e) { if (e.message === "auth") nudge(); });
    }, 8000);
  }
  /* Tokens last about an hour; when one expires, a small chip offers a one-tap reconnect. */
  var chip = null;
  function nudge() {
    if (chip || !isPro() || !Drive.state().connected) return;
    chip = document.createElement("button"); chip.type = "button"; chip.className = "mhs-pt-chip";
    chip.innerHTML = DRIVE + "<span>" + esc(t("dReconnect")) + "</span>";
    chip.addEventListener("click", function () {
      chip.remove(); chip = null;
      Drive.authorize(false).then(function (tk) { return Drive.backup(tk); }).then(function () { toast(t("dSaved")); refreshAll(); }).catch(function () { toast(t("dFail")); });
    });
    document.body.appendChild(chip);
  }
  var DRIVE = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#0f9d58" d="M7.7 3h8.6l5.2 9-4.3 7.5L12 10.5Z"/><path fill="#4285f4" d="M21.5 12 17.2 19.5H6.8L11 12Z"/><path fill="#f4b400" d="M7.7 3 12 10.5 6.8 19.5 2.5 12Z"/></svg>';

  /* ======================= Settings panel ======================= */
  var Base = window.HTMLElement || function () {};
  class MhsProTools extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() {
      var self = this;
      this._ui = this._ui || {};
      if (!this._wired) {
        this._wired = true;
        this.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b && self.contains(b)) self.act(b.getAttribute("data-a"), b); });
        this.addEventListener("change", function (e) { self.change(e.target); });
        this.addEventListener("submit", function (e) { e.preventDefault(); self.saveLock(e.target); });
      }
      this.render();
      Lock.bioAvailable().then(function (ok) { if (self._bio !== ok) { self._bio = ok; self.render(); } });
      if (window.MuhasabahPro) window.MuhasabahPro.config().then(function () { self.render(); });
    }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      if (this.contains(document.activeElement) && document.activeElement.tagName === "INPUT" && document.activeElement.type !== "checkbox") return;
      var pro = isPro(), ui = this._ui, compact = this.hasAttribute("compact");
      var dir = lang() === "ar" ? "rtl" : "ltr";
      var badge = '<span class="mhs-pt-badge">♛ ' + esc(t("proOnly")) + "</span>";
      var gate = '<button type="button" class="mhs-pro-go sm ghost" data-a="getpro">' + esc(t("unlockPro")) + "</button>";

      /* Drive card */
      var s = Drive.state(), cid = Drive.clientId(), c = proCfg(), linked = c && c.member && c.member.driveLinked;
      var drive = '<div class="mhs-pt-card"><div class="mhs-pt-h">' + DRIVE + "<b>" + esc(t("dTitle")) + "</b>" + (pro ? (s.connected ? '<span class="mhs-pt-on">' + esc(t("lOn")) + "</span>" : "") : badge) + "</div><p>" + esc(t("dDesc")) + "</p>";
      if (!pro) drive += gate;
      else if (!cid) drive += '<p class="mhs-dn-soon">' + esc(t("dSoon")) + '</p><button type="button" class="mhs-pro-go sm" disabled>' + esc(t("soon")) + "</button>";
      else if (!s.connected) drive += (linked ? '<p class="mhs-pt-note">' + esc(t("dLinked")) + "</p>" : "") + '<button type="button" class="mhs-pt-google" data-a="dconnect">' + DRIVE + "<span>" + esc(t("dConnect")) + "</span></button>";
      else {
        drive += '<p class="mhs-pt-status">' + esc(s.email ? t("dConnected", { email: s.email }) : t("dConnectedNo")) + "<br>" + esc(s.lastBackup ? t("dLast", { d: when(s.lastBackup) }) : t("dNever")) + "</p>" +
          toggle("dauto", t("dAuto"), t("dAutoSub"), s.auto !== false) +
          '<div class="mhs-pt-btns"><button type="button" class="mhs-pro-go sm" data-a="dnow">' + esc(ui.dBusy ? t("dSaving") : t("dNow")) + '</button><button type="button" class="mhs-pro-go sm ghost" data-a="drestore">' + esc(t("dRestore")) + "</button></div>" +
          '<button type="button" class="mhs-pro-link" data-a="ddisconnect">' + esc(t("dDisconnect")) + "</button>";
      }
      drive += "</div>";

      /* Lock card */
      var lc = Lock.cfg();
      var lock = '<div class="mhs-pt-card"><div class="mhs-pt-h">' + FP + "<b>" + esc(t("lTitle")) + "</b>" + (lc ? '<span class="mhs-pt-on">' + esc(t("lOn")) + "</span>" : pro ? "" : badge) + "</div><p>" + esc(t("lDesc")) + "</p>";
      if (ui.lockForm) {
        var kind = ui.kind || "pin", K = kind === "pin" ? t("lPin") : t("lPass");
        var attrs = kind === "pin" ? ' inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="off"' : ' maxlength="128" autocomplete="new-password"';
        lock += '<form class="mhs-pt-form" novalidate><div class="mhs-pro-tabs" role="tablist"><button type="button" role="tab" data-a="kind-pin" aria-selected="' + (kind === "pin") + '">' + esc(t("lPin")) + '</button><button type="button" role="tab" data-a="kind-password" aria-selected="' + (kind === "password") + '">' + esc(t("lPass")) + "</button></div>" +
          '<label><span>' + esc(t("lNew", { k: K })) + '</span><input name="a" type="password" dir="ltr"' + attrs + ' placeholder="' + esc(kind === "pin" ? t("lPinHint") : t("lPassHint")) + '"></label>' +
          '<label><span>' + esc(t("lConfirmK", { k: K })) + '</span><input name="b" type="password" dir="ltr"' + attrs + "></label>" +
          (this._bio ? toggle("lbio", t("lBio"), t("lBioSub"), ui.bio !== false) : '<p class="mhs-pt-note">' + esc(t("lBioNo")) + "</p>") +
          afterSelect(ui.after || 0) +
          '<p class="mhs-dn-msg" role="alert">' + esc(ui.msg || "") + "</p>" +
          '<div class="mhs-pt-btns"><button type="submit" class="mhs-pro-go sm">' + esc(t("lSave")) + '</button><button type="button" class="mhs-pro-go sm ghost" data-a="lcancel">' + esc(t("lCancel")) + "</button></div></form>";
      } else if (lc) {
        lock += '<p class="mhs-pt-status">' + esc((lc.kind === "pin" ? t("lPin") : t("lPass")) + (lc.bio ? " + " + t("lBio") : "")) + "</p>" +
          afterSelect(lc.after || 0) +
          (this._bio && !lc.bio && pro ? toggle("lbio-add", t("lBio"), t("lBioSub"), false) : "") +
          (lc.bio ? toggle("lbio-add", t("lBio"), t("lBioSub"), true) : "") +
          '<div class="mhs-pt-btns">' + (pro ? '<button type="button" class="mhs-pro-go sm ghost" data-a="lchange">' + esc(t("lChange")) + "</button>" : "") + '<button type="button" class="mhs-pro-go sm ghost" data-a="ldisable">' + esc(t("lDisable")) + "</button></div>";
      } else lock += pro ? '<button type="button" class="mhs-pro-go sm" data-a="lenable">' + FP + "<span>" + esc(t("lEnable")) + "</span></button>" : gate;
      lock += "</div>";

      this.innerHTML = '<section class="' + (compact ? "mhs-pt compact" : "panel mhs-pt") + '" dir="' + dir + '">' +
        (compact ? "" : '<div class="mhs-pt-top"><span class="mhs-pt-crown">♛</span><div><h3>' + esc(t("title")) + "</h3><p>" + esc(t("sub")) + "</p></div></div>") +
        '<div class="mhs-pt-grid">' + drive + lock + "</div></section>";
    }
    act(a, btn) {
      var self = this, ui = this._ui;
      if (a === "getpro") { if (window.MuhasabahPro) window.MuhasabahPro.open(); return; }
      if (a === "lenable") { ui.lockForm = true; ui.kind = "pin"; ui.msg = ""; this.render(); var i = this.querySelector("input[name=a]"); if (i) i.focus(); return; }
      if (a === "kind-pin" || a === "kind-password") { ui.kind = a.slice(5); ui.msg = ""; this.render(); return; }
      if (a === "lcancel") { ui.lockForm = false; ui.msg = ""; this.render(); return; }
      if (a === "lchange") { showLock("verify").then(function (ok) { if (ok) { ui.lockForm = true; ui.kind = Lock.cfg().kind; ui.after = Lock.cfg().after; self.render(); } }); return; }
      if (a === "ldisable") { showLock("verify").then(function (ok) { if (ok) { Lock.clear(); toast(t("lRemoved")); self.render(); } }); return; }
      if (a === "dconnect") {
        btn.disabled = true;
        Drive.authorize(true).then(function (tk) {
          return Drive.email(tk).then(function (em) {
            Drive.save({ connected: true, email: em, auto: true });
            if (window.MuhasabahPro) window.MuhasabahPro.identity().then(function (id) { return id.setMeta({ drive_sync: true }); }).catch(function () {});
            return Drive.fetchBackup(tk).then(function (remote) {
              var local = window.MHS && window.MHS.current(), empty = !local || !((local.habits || []).length || (local.ledger || []).length);
              if (remote && remote.data && (empty || (remote.savedAt || 0) > (Drive.state().lastBackup || 0))) return Drive.restore(remote);
              return Drive.backup(tk).then(function () { toast(t("dSaved")); });
            });
          });
        }).catch(function (e) { if (e.message !== "popup_closed" && e.message !== "access_denied") toast(t("dFail")); }).then(function () { self.render(); });
        return;
      }
      if (a === "dnow") {
        ui.dBusy = true; this.render();
        Drive.withToken(true).then(Drive.backup).then(function () { toast(t("dSaved")); }).catch(function () { toast(t("dFail")); }).then(function () { ui.dBusy = false; self.render(); });
        return;
      }
      if (a === "drestore") {
        Drive.withToken(true).then(Drive.fetchBackup).then(function (b) { if (!b) toast(t("dNoBackup")); else Drive.restore(b); }).catch(function () { toast(t("dFail")); });
        return;
      }
      if (a === "ddisconnect") {
        var tk = Drive.token();
        try { if (tk && window.google) google.accounts.oauth2.revoke(tk, function () {}); } catch (e) {}
        try { sessionStorage.removeItem(TOKEN); } catch (e) {}
        jset(DSTATE, null);
        if (window.MuhasabahPro) window.MuhasabahPro.identity().then(function (id) { return id.setMeta({ drive_sync: false }); }).catch(function () {});
        this.render();
      }
    }
    change(el) {
      var self = this;
      if (el.name === "dauto") { Drive.save({ auto: el.checked }); if (el.checked) scheduleAuto(); }
      else if (el.name === "lbio") this._ui.bio = el.checked;
      else if (el.name === "lafter") { if (this._ui.lockForm) this._ui.after = Number(el.value); else Lock.update({ after: Number(el.value) }); }
      else if (el.name === "lbio-add") {
        if (el.checked) Lock.registerBio().then(function (id) { Lock.update({ bio: id }); self.render(); }).catch(function () { el.checked = false; });
        else showLock("verify").then(function (ok) { if (ok) Lock.update({ bio: null }); self.render(); });
      }
    }
    saveLock(form) {
      var self = this, ui = this._ui, kind = ui.kind || "pin", a = form.a.value, b = form.b.value;
      var bad = kind === "pin" ? !/^\d{4,8}$/.test(a) : a.length < 6;
      if (bad) { ui.msg = t("lShort") + " " + (kind === "pin" ? t("lPinHint") : t("lPassHint")); this.render(); return; }
      if (a !== b) { ui.msg = t("lMismatch"); this.render(); return; }
      var wantBio = this._bio && ui.bio !== false, prev = Lock.cfg();
      var bio = wantBio ? (prev && prev.bio ? Promise.resolve(prev.bio) : Lock.registerBio().catch(function () { return null; })) : Promise.resolve(null);
      bio.then(function (id) { return Lock.set(kind, a, id, ui.after || 0); }).then(function () {
        ui.lockForm = false; ui.msg = ""; self.render(); toast(t("lSaved"));
      });
    }
  }
  function toggle(name, label, sub, on) {
    return '<label class="mhs-pro-toggle"><input type="checkbox" name="' + name + '"' + (on ? " checked" : "") + '><span class="sw" aria-hidden="true"></span><span class="txt"><b>' + esc(label) + "</b>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span></label>";
  }
  function afterSelect(v) {
    return '<label class="mhs-pt-sel"><span>' + esc(t("lAfter")) + '</span><select name="lafter">' + [[0, "lImm"], [60000, "l1"], [300000, "l5"], [900000, "l15"]].map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === v ? " selected" : "") + ">" + esc(t(o[1])) + "</option>";
    }).join("") + "</select></label>";
  }
  if (window.customElements && !customElements.get("mhs-pro-tools")) customElements.define("mhs-pro-tools", MhsProTools);

  window.MHSLock = { lock: function () { return showLock("unlock"); }, verify: function () { return showLock("verify"); }, enabled: function () { return !!Lock.cfg(); } };
  window.MHSDrive = { backup: function () { return Drive.withToken(false).then(Drive.backup); }, state: Drive.state };

  function init() {
    if (Lock.cfg()) showLock("unlock");
    document.addEventListener("mhs:pro-change", refreshAll);
    new MutationObserver(function () { refreshAll(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if (window.MHS && window.MHS.onSave) window.MHS.onSave(scheduleAuto);
    /* Daily safety backup when the app opens with a still-valid Drive session. */
    setTimeout(function () { var s = Drive.state(); if (s.connected && Date.now() - (s.lastBackup || 0) > 86400000) scheduleAuto(); }, 6000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
