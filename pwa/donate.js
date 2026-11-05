/* Muhasabah — "Donate for Muhasabah" pill and donation sheet.
 * Card payments run through Stripe Elements: card numbers go directly from the browser to
 * Stripe and never reach Muhasabah's server. Until Stripe keys are configured on the server,
 * the sheet shows a complete preview with payments marked as "coming soon".
 */
(function () {
  "use strict";
  if (window.__mhsDonate) return;
  window.__mhsDonate = true;

  var T = {
    en: {
      pill: "Donate for", brand: "Muhasabah", title: "Support Muhasabah",
      sub: "Muhasabah is free, private and ad-free. Your donation keeps it growing for everyone.",
      amount: "Choose an amount", custom: "Other", customPh: "Amount",
      name: "Name on card", namePh: "Full name", email: "Email for receipt", emailPh: "you@example.com",
      note: "Message (optional)", notePh: "A dua or a note for the team",
      card: "Card details", cardNo: "Card number", exp: "Expiry", cvc: "CVC",
      accept: "Debit and credit cards accepted", give: "Donate", secure: "Secured by Stripe · Card details never touch our servers",
      soon: "Card donations are being set up and will open very soon, in shaa Allah.", soonBtn: "Coming soon",
      loading: "Loading secure payment…", paying: "Processing…",
      thanks: "JazakAllahu khayran!", thanksSub: "Your donation of {amt} was received. May Allah reward you abundantly.",
      receipt: "A receipt is on its way to {email}.", done: "Close", again: "Donate again",
      errAmount: "Enter an amount between {min} and {max}.", errName: "Please enter the name on the card.",
      errEmail: "Please enter a valid email address.", errCard: "Please complete your card details.",
      errNet: "Couldn't reach the payment service. Check your connection and try again.",
      errGeneric: "The payment didn't go through. Please try again.", offline: "You're offline. Connect to the internet to donate.",
      close: "Close"
    },
    bn: {
      pill: "দান করুন", brand: "মুহাসাবার জন্য", title: "মুহাসাবাকে সহায়তা করুন",
      sub: "মুহাসাবা বিনামূল্যে, ব্যক্তিগত ও বিজ্ঞাপনমুক্ত। আপনার দান সবার জন্য এটিকে এগিয়ে নিতে সাহায্য করে।",
      amount: "পরিমাণ বেছে নিন", custom: "অন্য", customPh: "পরিমাণ",
      name: "কার্ডে থাকা নাম", namePh: "পূর্ণ নাম", email: "রসিদের জন্য ইমেইল", emailPh: "you@example.com",
      note: "বার্তা (ঐচ্ছিক)", notePh: "টিমের জন্য একটি দোয়া বা বার্তা",
      card: "কার্ডের তথ্য", cardNo: "কার্ড নম্বর", exp: "মেয়াদ", cvc: "CVC",
      accept: "ডেবিট ও ক্রেডিট কার্ড গ্রহণযোগ্য", give: "দান করুন", secure: "Stripe দ্বারা সুরক্ষিত · কার্ডের তথ্য আমাদের সার্ভারে যায় না",
      soon: "কার্ডে দানের ব্যবস্থা প্রস্তুত হচ্ছে, ইনশাআল্লাহ খুব শীঘ্রই চালু হবে।", soonBtn: "শীঘ্রই আসছে",
      loading: "নিরাপদ পেমেন্ট লোড হচ্ছে…", paying: "প্রক্রিয়াকরণ হচ্ছে…",
      thanks: "জাযাকাল্লাহু খাইরান!", thanksSub: "আপনার {amt} দান গৃহীত হয়েছে। আল্লাহ আপনাকে উত্তম প্রতিদান দিন।",
      receipt: "{email} ঠিকানায় রসিদ পাঠানো হচ্ছে।", done: "বন্ধ করুন", again: "আবার দান করুন",
      errAmount: "{min} থেকে {max} এর মধ্যে পরিমাণ লিখুন।", errName: "কার্ডে থাকা নাম লিখুন।",
      errEmail: "একটি সঠিক ইমেইল ঠিকানা লিখুন।", errCard: "কার্ডের তথ্য সম্পূর্ণ করুন।",
      errNet: "পেমেন্ট সার্ভিসে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।",
      errGeneric: "পেমেন্ট সম্পন্ন হয়নি। আবার চেষ্টা করুন।", offline: "আপনি অফলাইনে আছেন। দান করতে ইন্টারনেটে সংযুক্ত হন।",
      close: "বন্ধ করুন"
    },
    ar: {
      pill: "تبرّع لـ", brand: "محاسبة", title: "ادعم محاسبة",
      sub: "محاسبة مجاني وخاص وبلا إعلانات. تبرّعك يساعده على النمو للجميع.",
      amount: "اختر المبلغ", custom: "آخر", customPh: "المبلغ",
      name: "الاسم على البطاقة", namePh: "الاسم الكامل", email: "البريد للإيصال", emailPh: "you@example.com",
      note: "رسالة (اختياري)", notePh: "دعاء أو رسالة للفريق",
      card: "بيانات البطاقة", cardNo: "رقم البطاقة", exp: "الانتهاء", cvc: "CVC",
      accept: "نقبل بطاقات الخصم والائتمان", give: "تبرّع", secure: "محميّ عبر Stripe · لا تمرّ بيانات البطاقة بخوادمنا",
      soon: "يجري إعداد التبرّع بالبطاقة وسيُفتح قريبًا جدًا إن شاء الله.", soonBtn: "قريبًا",
      loading: "جارٍ تحميل الدفع الآمن…", paying: "جارٍ المعالجة…",
      thanks: "جزاكم الله خيرًا!", thanksSub: "تم استلام تبرّعك بمبلغ {amt}. أجزل الله لك الثواب.",
      receipt: "سيصل الإيصال إلى {email}.", done: "إغلاق", again: "تبرّع مرة أخرى",
      errAmount: "أدخل مبلغًا بين {min} و{max}.", errName: "يرجى إدخال الاسم على البطاقة.",
      errEmail: "يرجى إدخال بريد إلكتروني صحيح.", errCard: "يرجى إكمال بيانات البطاقة.",
      errNet: "تعذّر الوصول إلى خدمة الدفع. تحقّق من الاتصال وحاول مجددًا.",
      errGeneric: "لم تتم عملية الدفع. حاول مرة أخرى.", offline: "أنت غير متصل. اتصل بالإنترنت للتبرّع.",
      close: "إغلاق"
    }
  };

  var cfg = null, cfgPromise = null, stripe = null, elements = null, cardEls = null;
  var state = { amount: 10, custom: false, busy: false, done: false };
  var pill, sheet, backdrop, lastFocus;

  function lang() { var l = document.documentElement.lang; return T[l] ? l : "en"; }
  function t(k, vars) {
    var s = T[lang()][k] || T.en[k] || k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split("{" + v + "}").join(vars[v]); });
    return s;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) {
    var cur = (cfg && cfg.currency || "usd").toUpperCase();
    var loc = lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar" : "en";
    try { return new Intl.NumberFormat(loc, { style: "currency", currency: cur, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n); }
    catch (e) { return cur + " " + n; }
  }
  function presets() { return (cfg && cfg.presets) || [5, 10, 25, 50, 100]; }

  function loadConfig() {
    if (cfgPromise) return cfgPromise;
    cfgPromise = fetch("/api/donate", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("config"); return r.json(); })
      .then(function (c) { cfg = c; return c; })
      .catch(function () { cfgPromise = null; cfg = cfg || { enabled: false, currency: "usd", presets: [5, 10, 25, 50, 100], min: 1, max: 10000, unreachable: true }; return cfg; });
    return cfgPromise;
  }

  function loadStripe() {
    if (window.Stripe) return Promise.resolve(window.Stripe);
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://js.stripe.com/v3/";
      s.async = true;
      s.onload = function () { window.Stripe ? resolve(window.Stripe) : reject(new Error("stripe")); };
      s.onerror = function () { reject(new Error("stripe")); };
      document.head.appendChild(s);
    });
  }

  var LOGO = '<img src="/icons/logo.webp" alt="" width="24" height="24" decoding="async">';
  var LOCK = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"/></svg>';
  var HEART = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1.1 4.4 2.6.8-1.5 2.4-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z"/></svg>';
  var CARDS = '<span class="mhs-dn-brands" aria-hidden="true"><i class="v">VISA</i><i class="m"><b></b><b></b></i><i class="a">AMEX</i></span>';

  function buildPill() {
    pill = document.createElement("button");
    pill.type = "button";
    pill.id = "mhs-donate-pill";
    pill.className = "mhs-dn-pill";
    pill.setAttribute("aria-haspopup", "dialog");
    pill.addEventListener("click", open);
    document.body.appendChild(pill);
    renderPill();
  }
  function renderPill() {
    pill.innerHTML = LOGO + '<span>' + esc(t("pill")) + " <b>" + esc(t("brand")) + "</b></span>";
    pill.setAttribute("aria-label", t("pill") + " " + t("brand"));
    pill.dir = lang() === "ar" ? "rtl" : "ltr";
  }

  function buildSheet() {
    backdrop = document.createElement("div");
    backdrop.className = "mhs-dn-backdrop";
    backdrop.addEventListener("click", close);
    sheet = document.createElement("div");
    sheet.className = "mhs-dn-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "mhs-dn-title");
    sheet.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(sheet.querySelectorAll("button,input,textarea,iframe,[tabindex]:not([tabindex='-1'])"), function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
  }

  function renderSheet() {
    var L = lang(), live = cfg && cfg.enabled;
    sheet.dir = L === "ar" ? "rtl" : "ltr";
    if (state.done) { renderThanks(); return; }
    var chips = presets().map(function (p) {
      var on = !state.custom && state.amount === p;
      return '<button type="button" class="mhs-dn-chip' + (on ? " on" : "") + '" data-amt="' + p + '" aria-pressed="' + on + '">' + esc(money(p)) + "</button>";
    }).join("") + '<button type="button" class="mhs-dn-chip' + (state.custom ? " on" : "") + '" data-amt="custom" aria-pressed="' + state.custom + '">' + esc(t("custom")) + "</button>";

    sheet.innerHTML =
      '<button type="button" class="mhs-dn-x" aria-label="' + esc(t("close")) + '">×</button>' +
      '<div class="mhs-dn-head"><span class="mhs-dn-logo">' + LOGO.replace('width="24" height="24"', 'width="40" height="40"') + "</span>" +
        '<div><h2 id="mhs-dn-title">' + esc(t("title")) + "</h2><p>" + esc(t("sub")) + "</p></div></div>" +
      '<form class="mhs-dn-form" novalidate>' +
        '<fieldset><legend>' + esc(t("amount")) + '</legend><div class="mhs-dn-chips">' + chips + "</div>" +
          '<label class="mhs-dn-custom"' + (state.custom ? "" : " hidden") + '><span class="cur">' + esc((cfg && cfg.currency || "usd").toUpperCase()) + '</span>' +
          '<input name="custom" type="number" inputmode="decimal" min="' + ((cfg && cfg.min) || 1) + '" max="' + ((cfg && cfg.max) || 10000) + '" step="any" placeholder="' + esc(t("customPh")) + '" aria-label="' + esc(t("customPh")) + '"></label></fieldset>' +
        '<div class="mhs-dn-row">' +
          '<label><span>' + esc(t("name")) + '</span><input name="name" autocomplete="cc-name" maxlength="100" placeholder="' + esc(t("namePh")) + '"></label>' +
          '<label><span>' + esc(t("email")) + '</span><input name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" placeholder="' + esc(t("emailPh")) + '" dir="ltr"></label>' +
        "</div>" +
        '<div class="mhs-dn-card"><div class="mhs-dn-cardhead"><span>' + esc(t("card")) + "</span>" + CARDS + "</div>" +
          '<div class="mhs-dn-field full" dir="ltr"><span class="lbl">' + esc(t("cardNo")) + '</span><div id="mhs-dn-number" class="mhs-dn-el">' + (live ? "" : '<span class="ph">1234 1234 1234 1234</span>') + "</div></div>" +
          '<div class="mhs-dn-split" dir="ltr"><div class="mhs-dn-field"><span class="lbl">' + esc(t("exp")) + '</span><div id="mhs-dn-exp" class="mhs-dn-el">' + (live ? "" : '<span class="ph">MM / YY</span>') + "</div></div>" +
          '<div class="mhs-dn-field"><span class="lbl">' + esc(t("cvc")) + '</span><div id="mhs-dn-cvc" class="mhs-dn-el">' + (live ? "" : '<span class="ph">CVC</span>') + "</div></div></div>" +
          '<p class="mhs-dn-accept">' + esc(t("accept")) + "</p></div>" +
        '<label class="mhs-dn-note"><span>' + esc(t("note")) + '</span><textarea name="note" rows="2" maxlength="300" placeholder="' + esc(t("notePh")) + '"></textarea></label>' +
        '<p class="mhs-dn-msg" role="alert" aria-live="assertive"></p>' +
        (live ? "" : '<p class="mhs-dn-soon">' + esc(cfg && cfg.unreachable && !navigator.onLine ? t("offline") : t("soon")) + "</p>") +
        '<button type="submit" class="mhs-dn-go"' + (live ? "" : " disabled") + ">" + HEART + '<span class="lbl"></span></button>' +
        '<p class="mhs-dn-secure">' + LOCK + " " + esc(t("secure")) + "</p>" +
      "</form>";

    sheet.querySelector(".mhs-dn-x").addEventListener("click", close);
    var form = sheet.querySelector("form");
    form.addEventListener("submit", submit);
    Array.prototype.forEach.call(sheet.querySelectorAll(".mhs-dn-chip"), function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-amt");
        if (v === "custom") { state.custom = true; } else { state.custom = false; state.amount = Number(v); }
        Array.prototype.forEach.call(sheet.querySelectorAll(".mhs-dn-chip"), function (c) {
          var on = c === b; c.classList.toggle("on", on); c.setAttribute("aria-pressed", String(on));
        });
        var box = sheet.querySelector(".mhs-dn-custom");
        box.hidden = !state.custom;
        if (state.custom) box.querySelector("input").focus();
        showMsg(""); updateButton();
      });
    });
    form.custom.addEventListener("input", updateButton);
    updateButton();
    if (live) mountCard();
  }

  /* Re-rendering for an amount change must not lose what the donor already typed. */
  function snapshot() {
    var f = sheet.querySelector("form"); if (!f) return null;
    return { name: f.name.value, email: f.email.value, note: f.note.value, custom: f.custom.value };
  }
  function restore(v) {
    var f = sheet.querySelector("form"); if (!f || !v) return;
    f.name.value = v.name; f.email.value = v.email; f.note.value = v.note; f.custom.value = v.custom; updateButton();
  }

  function currentAmount() {
    if (!state.custom) return state.amount;
    var v = parseFloat(String(sheet.querySelector("input[name=custom]").value).replace(",", "."));
    return isFinite(v) ? Math.round(v * 100) / 100 : 0;
  }
  function updateButton() {
    var btn = sheet.querySelector(".mhs-dn-go .lbl"); if (!btn) return;
    if (!(cfg && cfg.enabled)) { btn.textContent = t("soonBtn"); return; }
    if (state.busy) { btn.textContent = t("paying"); return; }
    var a = currentAmount();
    btn.textContent = t("give") + (a > 0 ? " " + money(a) : "");
  }
  function showMsg(m) { var el = sheet.querySelector(".mhs-dn-msg"); if (el) el.textContent = m || ""; }

  function cardStyle() {
    var cs = getComputedStyle(document.documentElement);
    var fg = "hsl(" + (cs.getPropertyValue("--foreground").trim() || "210 20% 96%").replace(/ /g, ",").replace(/,+/g, ",") + ")";
    var mut = "hsl(" + (cs.getPropertyValue("--muted-foreground").trim() || "220 9% 62%").replace(/ /g, ",").replace(/,+/g, ",") + ")";
    return { base: { color: fg, fontFamily: "Inter, system-ui, sans-serif", fontSize: "16px", iconColor: mut, "::placeholder": { color: mut } }, invalid: { color: "#ff6b6b", iconColor: "#ff6b6b" } };
  }

  function mountCard() {
    var holder = sheet.querySelector("#mhs-dn-number");
    holder.innerHTML = '<span class="ph">' + esc(t("loading")) + "</span>";
    loadStripe().then(function (S) {
      if (!sheet.contains(holder)) return;
      if (!stripe) stripe = S(cfg.publishableKey, { locale: lang() === "bn" ? "auto" : lang() });
      elements = stripe.elements({ fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" }] });
      var style = cardStyle();
      cardEls = {
        number: elements.create("cardNumber", { style: style, showIcon: true, placeholder: "1234 1234 1234 1234" }),
        exp: elements.create("cardExpiry", { style: style }),
        cvc: elements.create("cardCvc", { style: style })
      };
      holder.innerHTML = "";
      cardEls.number.mount("#mhs-dn-number");
      cardEls.exp.mount("#mhs-dn-exp");
      cardEls.cvc.mount("#mhs-dn-cvc");
      cardEls.complete = { number: false, exp: false, cvc: false };
      ["number", "exp", "cvc"].forEach(function (k) {
        cardEls[k].on("change", function (ev) {
          cardEls.complete[k] = ev.complete;
          var box = sheet.querySelector("#mhs-dn-" + k);
          if (box) box.classList.toggle("bad", !!ev.error);
          showMsg(ev.error ? ev.error.message : "");
        });
        cardEls[k].on("focus", function () { var b = sheet.querySelector("#mhs-dn-" + k); if (b) b.classList.add("focus"); });
        cardEls[k].on("blur", function () { var b = sheet.querySelector("#mhs-dn-" + k); if (b) b.classList.remove("focus"); });
      });
    }).catch(function () { holder.innerHTML = ""; showMsg(t("errNet")); });
  }

  function submit(e) {
    e.preventDefault();
    if (state.busy || !(cfg && cfg.enabled)) return;
    var f = e.target, amt = currentAmount(), min = cfg.min || 1, max = cfg.max || 10000;
    if (!(amt >= min && amt <= max)) { showMsg(t("errAmount", { min: money(min), max: money(max) })); return; }
    var name = f.name.value.trim(), email = f.email.value.trim();
    if (!name) { showMsg(t("errName")); f.name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg(t("errEmail")); f.email.focus(); return; }
    if (!stripe || !cardEls || !(cardEls.complete.number && cardEls.complete.exp && cardEls.complete.cvc)) { showMsg(t("errCard")); return; }
    if (!navigator.onLine) { showMsg(t("offline")); return; }
    setBusy(true); showMsg("");
    fetch("/api/donate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: amt, name: name, email: email, note: f.note.value.trim() }) })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok || !d.clientSecret) throw new Error(d.error || "server"); return d; }); })
      .then(function (d) {
        return stripe.confirmCardPayment(d.clientSecret, { payment_method: { card: cardEls.number, billing_details: { name: name, email: email } }, receipt_email: email });
      })
      .then(function (res) {
        if (res.error) { setBusy(false); showMsg(res.error.message || t("errGeneric")); return; }
        if (res.paymentIntent && (res.paymentIntent.status === "succeeded" || res.paymentIntent.status === "processing")) {
          state.done = { amount: amt, email: email }; state.busy = false; renderSheet();
          try { if (window.MHSMotion) window.MHSMotion.burst(innerWidth / 2, innerHeight * 0.45, 60, 2.4); } catch (_) {}
        } else { setBusy(false); showMsg(t("errGeneric")); }
      })
      .catch(function (err) { setBusy(false); showMsg(err && /stripe_unreachable|Failed to fetch|NetworkError/i.test(String(err.message)) ? t("errNet") : t("errGeneric")); });
  }
  function setBusy(b) {
    state.busy = b;
    var btn = sheet.querySelector(".mhs-dn-go"); if (btn) { btn.disabled = b; btn.classList.toggle("busy", b); }
    Array.prototype.forEach.call(sheet.querySelectorAll("form input,form textarea,.mhs-dn-chip"), function (x) { x.disabled = b; });
    updateButton();
  }

  function renderThanks() {
    var d = state.done;
    sheet.innerHTML =
      '<button type="button" class="mhs-dn-x" aria-label="' + esc(t("close")) + '">×</button>' +
      '<div class="mhs-dn-thanks"><span class="mhs-dn-logo big">' + LOGO.replace('width="24" height="24"', 'width="56" height="56"') + '</span>' +
      '<h2 id="mhs-dn-title">' + esc(t("thanks")) + "</h2><p>" + esc(t("thanksSub", { amt: money(d.amount) })) + "</p>" +
      (d.email ? '<p class="muted">' + esc(t("receipt", { email: d.email })) + "</p>" : "") +
      '<div class="mhs-dn-actions"><button type="button" class="mhs-dn-go" data-act="close">' + esc(t("done")) + '</button>' +
      '<button type="button" class="mhs-dn-ghost" data-act="again">' + esc(t("again")) + "</button></div></div>";
    sheet.querySelector(".mhs-dn-x").addEventListener("click", close);
    sheet.querySelector("[data-act=close]").addEventListener("click", close);
    sheet.querySelector("[data-act=again]").addEventListener("click", function () { state.done = false; renderSheet(); });
    sheet.querySelector("[data-act=close]").focus();
  }

  function open() {
    if (!sheet) buildSheet();
    lastFocus = document.activeElement;
    document.documentElement.classList.add("mhs-dn-open");
    sheet.innerHTML = '<div class="mhs-dn-wait">' + LOGO + "</div>";
    void sheet.offsetWidth; /* start the entrance transition from the hidden state */
    backdrop.classList.add("show"); sheet.classList.add("show");
    pill.setAttribute("aria-expanded", "true");
    loadConfig().then(function () {
      if (!sheet.classList.contains("show")) return;
      renderSheet();
      var first = sheet.querySelector(".mhs-dn-chip.on") || sheet.querySelector(".mhs-dn-x");
      if (first) first.focus({ preventScroll: true });
    });
  }
  function close() {
    if (!sheet || !sheet.classList.contains("show") || state.busy) return;
    sheet.classList.remove("show"); backdrop.classList.remove("show");
    document.documentElement.classList.remove("mhs-dn-open");
    pill.setAttribute("aria-expanded", "false");
    if (state.done) state.done = false;
    if (cardEls) { try { cardEls.number.destroy(); cardEls.exp.destroy(); cardEls.cvc.destroy(); } catch (_) {} cardEls = null; }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function init() {
    buildPill();
    new MutationObserver(function () {
      renderPill();
      if (sheet && sheet.classList.contains("show") && !state.busy && !cardEls) { var k = snapshot(); renderSheet(); restore(k); }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    /* Warm the config once the app is idle so the sheet opens instantly. */
    (window.requestIdleCallback || function (f) { setTimeout(f, 2500); })(function () { if (navigator.onLine) loadConfig(); });
  }
  window.MuhasabahDonate = { open: open, close: close };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
