/* Muhasabah Pro — golden "Get Pro" button, membership sheet and member panel.
 *
 * Plans: Lifetime ($10 once, earned back as $1 cashback per 40-day streak, up to 10×) and
 * Monthly ($1/month). Both are selected by default (recommended); either one works alone.
 * Accounts use Netlify Identity (email + password). Cards go straight from the browser to
 * Stripe Elements; Pro is granted only after the server verifies the payment with Stripe.
 * Members get a golden ring around the Muhasabah logo (html.mhs-pro).
 */
(function () {
  "use strict";
  if (window.__mhsPro) return;
  window.__mhsPro = true;

  var T = {
    en: {
      get: "Get Pro", member: "PRO", title: "Muhasabah Pro", sub: "Sign in with your email, unlock Pro and wear the golden Muhasabah crest.",
      recommended: "Recommended · Best value", both: "Take both for the full Pro experience",
      lifeName: "Lifetime Premium", lifePrice: "{p}", lifeUnit: "one-time",
      lifeDesc: "Pro forever with one payment — and earn every cent back.",
      lifeCash: "{a} cashback for every {d}-day streak, up to {n}× — your full {p} returned.",
      monName: "Monthly Pro", monPrice: "{p}", monUnit: "/ month",
      monDesc: "Pro membership billed monthly. Auto-pay, cancel anytime.",
      perks: ["Full customization — delete or edit the default habits and fine-tune penalties, grace time, points, emoji and colors", "Auto-backup to your own Google Drive — restore on any device", "App lock with fingerprint, device lock or your own PIN", "Golden Pro crest on your logo", "Email account — sign in on any device"],
      today: "Due today", then: "then {p} / month", none: "Choose at least one plan.",
      cont: "Continue", back: "Back", close: "Close",
      soon: "Card payments are being set up and will open very soon, in shaa Allah.", soonBtn: "Coming soon", soonPlans: "Pro payments open very soon, in shaa Allah. You can create your account now so you're ready.",
      signup: "Create account", login: "Log in", email: "Email", emailPh: "you@example.com",
      pass: "Password", passPh: "At least 8 characters", forgot: "Forgot password?", sendReset: "Send reset link",
      haveAcc: "Already have an account?", noAcc: "New to Muhasabah Pro?", authSub: "Your Pro membership is linked to your email so it follows you to every device.",
      checkMail: "Check your inbox", checkMailSub: "We sent a confirmation link to {email}. Open it on this device to activate your account, then continue to payment.",
      resetSent: "If an account exists for {email}, a password reset link is on its way.",
      newPass: "Set a new password", savePass: "Save password", passSaved: "Password updated. You're signed in.",
      pay: "Payment", signedAs: "Signed in as {email}", switchAcc: "Switch account",
      card: "Card details", cardNo: "Card number", exp: "Expiry", cvc: "CVC", newCard: "Use a new card",
      saved: "Saved card", accept: "Debit and credit cards accepted",
      saveCard: "Save card for faster checkout", saveCardReq: "Your card is saved securely by Stripe for monthly auto-pay.",
      autoPay: "Auto-pay monthly", autoPaySub: "Renew automatically each month. Turn off any time.",
      payBtn: "Pay {p}", paying: "Processing…", verifying: "Activating Pro…",
      terms: "By paying you agree that Muhasabah charges {today} today{rec}. Cancel auto-pay any time from your Pro panel; access continues to the end of the paid month.",
      termsRec: " and {m} every month until you cancel",
      secure: "Secured by Stripe · PCI-DSS · Card details never touch our servers",
      welcome: "Welcome to Muhasabah Pro!", welcomeSub: "Your golden crest is on. May Allah put barakah in every habit.",
      receipt: "A receipt was emailed to {email}.", great: "Done",
      status: "Your membership", proSince: "Pro member", lifetime: "Lifetime Premium", lifeSince: "Since {d}",
      monthly: "Monthly Pro", renews: "Renews on {d}", ends: "Ends on {d}", inactive: "Not active", pastDue: "Payment due — please update your card.",
      autoRenew: "Auto-pay", cashback: "Streak cashback", cashProg: "{c} of {n} returned · {amt} back so far",
      cashNext: "Next {a} unlocks on {d} with a {s}-day streak.", cashReady: "Your {a} cashback is ready!", cashStreak: "Current streak: {s} days (need {d}).",
      claim: "Claim {a}", claimed: "{a} is on its way back to your card. It usually arrives in 5–10 days.", cashDone: "All {p} returned. MashaAllah!",
      addMonthly: "Add Monthly Pro · {p}/mo", addLifetime: "Add Lifetime Premium · {p}", cards: "Saved cards", signOut: "Sign out",
      notPro: "No active Pro plan on this account yet.",
      ls: { btn: "Continue to secure checkout · {p}", secure: "Secured by Lemon Squeezy · Cards, PayPal & more · Card details never touch our servers", both: "Lifetime is paid first, then Monthly opens in a second checkout.", wait: "Finish paying in the secure checkout window. Pro activates automatically.", check: "I've paid — check status", next: "Lifetime Premium is active. Now complete Monthly Pro.", pending: "Payment not confirmed yet. It can take a minute — try again shortly.", manage: "Manage billing & card", terms: "By paying you agree that Muhasabah charges {today} now{rec}. Lemon Squeezy is our reseller and merchant of record and handles billing, receipts and taxes." },
      legal: { privacy: "Privacy Policy", terms: "Terms of Service", refund: "Refund Policy" },
      err: {
        invalid: "Incorrect email or password.", unconfirmed: "Please confirm your email first — check your inbox.",
        exists: "An account with this email already exists. Log in instead.", weak: "Choose a stronger password (at least 8 characters).",
        invalid_input: "Check your email and password.", signup_closed: "Sign-ups are currently closed.", rate: "Too many attempts. Please wait a moment.",
        identity_missing: "Accounts are being set up. Please try again shortly.", network: "Couldn't connect. Check your internet and try again.",
        email: "Please enter a valid email address.", pass: "Password must be at least 8 characters.", cardInc: "Please complete your card details.",
        generic: "The payment didn't go through. Please try again.", offline: "You're offline. Connect to the internet to continue.",
        already_pro: "This plan is already active on your account.", auth_required: "Please sign in again.",
        not_yet: "This cashback isn't unlocked yet.", streak_too_short: "Keep your streak going to unlock cashback."
      }
    },
    bn: {
      get: "প্রো নিন", member: "PRO", title: "মুহাসাবা প্রো", sub: "ইমেইল দিয়ে সাইন ইন করুন, প্রো আনলক করুন আর পান সোনালি মুহাসাবা ক্রেস্ট।",
      recommended: "প্রস্তাবিত · সেরা মূল্য", both: "পূর্ণ প্রো অভিজ্ঞতার জন্য দুটোই নিন",
      lifeName: "লাইফটাইম প্রিমিয়াম", lifePrice: "{p}", lifeUnit: "এককালীন",
      lifeDesc: "একবার পেমেন্টে চিরকাল প্রো — আর পুরো টাকাটাই ফেরত পান।",
      lifeCash: "প্রতি {d} দিনের স্ট্রিকে {a} ক্যাশব্যাক, সর্বোচ্চ {n} বার — পুরো {p} ফেরত।",
      monName: "মাসিক প্রো", monPrice: "{p}", monUnit: "/ মাস",
      monDesc: "মাসিক বিলিংয়ে প্রো মেম্বারশিপ। অটো-পে, যেকোনো সময় বাতিল করা যায়।",
      perks: ["সম্পূর্ণ কাস্টমাইজেশন — ডিফল্ট অভ্যাস মুছুন বা বদলান, পেনাল্টি, গ্রেস সময়, পয়েন্ট, ইমোজি ও রং নিজের মতো সাজান", "নিজের Google Drive-এ অটো ব্যাকআপ — যেকোনো ডিভাইসে ফিরিয়ে আনুন", "ফিঙ্গারপ্রিন্ট, ফোনের লক বা নিজের PIN দিয়ে অ্যাপ লক", "আপনার লোগোতে সোনালি প্রো ক্রেস্ট", "ইমেইল অ্যাকাউন্ট — যেকোনো ডিভাইসে সাইন ইন"],
      today: "আজ পরিশোধ", then: "এরপর প্রতি মাসে {p}", none: "অন্তত একটি প্ল্যান বেছে নিন।",
      cont: "এগিয়ে যান", back: "পেছনে", close: "বন্ধ করুন",
      soon: "কার্ড পেমেন্ট চালুর কাজ চলছে, ইনশাআল্লাহ খুব শিগগিরই চালু হবে।", soonBtn: "শিগগিরই আসছে", soonPlans: "ইনশাআল্লাহ খুব শিগগিরই প্রো পেমেন্ট চালু হবে। প্রস্তুত থাকতে এখনই অ্যাকাউন্ট খুলে রাখতে পারেন।",
      signup: "অ্যাকাউন্ট খুলুন", login: "লগ ইন", email: "ইমেইল", emailPh: "you@example.com",
      pass: "পাসওয়ার্ড", passPh: "কমপক্ষে ৮ অক্ষর", forgot: "পাসওয়ার্ড ভুলে গেছেন?", sendReset: "রিসেট লিংক পাঠান",
      haveAcc: "আগেই অ্যাকাউন্ট আছে?", noAcc: "মুহাসাবা প্রো-তে নতুন?", authSub: "আপনার প্রো মেম্বারশিপ ইমেইলের সাথে যুক্ত থাকে, তাই যেকোনো ডিভাইসে পাবেন।",
      checkMail: "ইনবক্স দেখুন", checkMailSub: "{email} ঠিকানায় একটি কনফার্মেশন লিংক পাঠানো হয়েছে। এই ডিভাইসে লিংকটি খুলে অ্যাকাউন্ট চালু করুন, তারপর পেমেন্টে এগিয়ে যান।",
      resetSent: "{email} এর অ্যাকাউন্ট থাকলে পাসওয়ার্ড রিসেট লিংক পাঠানো হচ্ছে।",
      newPass: "নতুন পাসওয়ার্ড দিন", savePass: "পাসওয়ার্ড সংরক্ষণ", passSaved: "পাসওয়ার্ড আপডেট হয়েছে। আপনি সাইন ইন অবস্থায় আছেন।",
      pay: "পেমেন্ট", signedAs: "{email} হিসেবে সাইন ইন", switchAcc: "অ্যাকাউন্ট বদলান",
      card: "কার্ডের তথ্য", cardNo: "কার্ড নম্বর", exp: "মেয়াদ", cvc: "CVC", newCard: "নতুন কার্ড ব্যবহার করুন",
      saved: "সংরক্ষিত কার্ড", accept: "ডেবিট ও ক্রেডিট কার্ড গ্রহণযোগ্য",
      saveCard: "দ্রুত পেমেন্টের জন্য কার্ড সংরক্ষণ করুন", saveCardReq: "মাসিক অটো-পের জন্য আপনার কার্ড Stripe নিরাপদে সংরক্ষণ করবে।",
      autoPay: "মাসিক অটো-পে", autoPaySub: "প্রতি মাসে স্বয়ংক্রিয়ভাবে নবায়ন। যেকোনো সময় বন্ধ করা যায়।",
      payBtn: "{p} পরিশোধ করুন", paying: "প্রক্রিয়া চলছে…", verifying: "প্রো চালু হচ্ছে…",
      terms: "পেমেন্ট করে আপনি সম্মত হচ্ছেন যে মুহাসাবা আজ {today} নেবে{rec}। প্রো প্যানেল থেকে যেকোনো সময় অটো-পে বন্ধ করতে পারবেন; পরিশোধিত মাসের শেষ পর্যন্ত সুবিধা থাকবে।",
      termsRec: " এবং বাতিল না করা পর্যন্ত প্রতি মাসে {m}",
      secure: "Stripe দ্বারা সুরক্ষিত · PCI-DSS · কার্ডের তথ্য আমাদের সার্ভারে যায় না",
      welcome: "মুহাসাবা প্রো-তে স্বাগতম!", welcomeSub: "আপনার সোনালি ক্রেস্ট চালু হয়েছে। আল্লাহ প্রতিটি অভ্যাসে বরকত দিন।",
      receipt: "{email} ঠিকানায় রসিদ পাঠানো হয়েছে।", great: "ঠিক আছে",
      status: "আপনার মেম্বারশিপ", proSince: "প্রো মেম্বার", lifetime: "লাইফটাইম প্রিমিয়াম", lifeSince: "{d} থেকে",
      monthly: "মাসিক প্রো", renews: "{d} তারিখে নবায়ন", ends: "{d} তারিখে শেষ", inactive: "সক্রিয় নয়", pastDue: "পেমেন্ট বাকি — কার্ড আপডেট করুন।",
      autoRenew: "অটো-পে", cashback: "স্ট্রিক ক্যাশব্যাক", cashProg: "{n} এর মধ্যে {c} বার ফেরত · এ পর্যন্ত {amt}",
      cashNext: "পরবর্তী {a} আনলক হবে {d} তারিখে, {s} দিনের স্ট্রিক থাকলে।", cashReady: "আপনার {a} ক্যাশব্যাক প্রস্তুত!", cashStreak: "চলতি স্ট্রিক: {s} দিন (প্রয়োজন {d})।",
      claim: "{a} দাবি করুন", claimed: "{a} আপনার কার্ডে ফেরত যাচ্ছে। সাধারণত ৫–১০ দিনে পৌঁছায়।", cashDone: "পুরো {p} ফেরত পেয়েছেন। মাশাআল্লাহ!",
      addMonthly: "মাসিক প্রো যোগ করুন · {p}/মাস", addLifetime: "লাইফটাইম প্রিমিয়াম যোগ করুন · {p}", cards: "সংরক্ষিত কার্ড", signOut: "সাইন আউট",
      notPro: "এই অ্যাকাউন্টে এখনো কোনো সক্রিয় প্রো প্ল্যান নেই।",
      ls: { btn: "নিরাপদ চেকআউটে যান · {p}", secure: "Lemon Squeezy দ্বারা সুরক্ষিত · কার্ড, PayPal ও আরও · কার্ডের তথ্য আমাদের সার্ভারে আসে না", both: "আগে লাইফটাইমের পেমেন্ট হবে, তারপর দ্বিতীয় চেকআউটে মাসিক খুলবে।", wait: "নিরাপদ চেকআউট উইন্ডোতে পেমেন্ট শেষ করুন। প্রো নিজে থেকেই চালু হবে।", check: "পেমেন্ট করেছি — স্ট্যাটাস দেখুন", next: "লাইফটাইম প্রিমিয়াম চালু হয়েছে। এবার মাসিক প্রো সম্পন্ন করুন।", pending: "পেমেন্ট এখনো নিশ্চিত হয়নি। এক মিনিট লাগতে পারে — একটু পরে আবার চেষ্টা করুন।", manage: "বিলিং ও কার্ড ম্যানেজ করুন", terms: "পেমেন্ট করে আপনি সম্মত হচ্ছেন যে মুহাসাবা এখন {today} নেবে{rec}। Lemon Squeezy আমাদের রিসেলার ও মার্চেন্ট অব রেকর্ড — বিলিং, রসিদ ও ট্যাক্স তারাই দেখে।" },
      legal: { privacy: "প্রাইভেসি পলিসি", terms: "সেবার শর্তাবলি", refund: "রিফান্ড পলিসি" },
      err: {
        invalid: "ইমেইল বা পাসওয়ার্ড ভুল।", unconfirmed: "আগে ইমেইল কনফার্ম করুন — ইনবক্স দেখুন।",
        exists: "এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগ ইন করুন।", weak: "আরও শক্তিশালী পাসওয়ার্ড দিন (কমপক্ষে ৮ অক্ষর)।",
        invalid_input: "ইমেইল ও পাসওয়ার্ড যাচাই করুন।", signup_closed: "এই মুহূর্তে সাইন আপ বন্ধ।", rate: "অনেকবার চেষ্টা হয়েছে। একটু অপেক্ষা করুন।",
        identity_missing: "অ্যাকাউন্ট ব্যবস্থা চালু হচ্ছে। একটু পরে আবার চেষ্টা করুন।", network: "সংযোগ করা যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।",
        email: "সঠিক ইমেইল ঠিকানা দিন।", pass: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।", cardInc: "কার্ডের তথ্য সম্পূর্ণ করুন।",
        generic: "পেমেন্ট সম্পন্ন হয়নি। আবার চেষ্টা করুন।", offline: "আপনি অফলাইনে আছেন। এগোতে ইন্টারনেটে যুক্ত হোন।",
        already_pro: "এই প্ল্যানটি আপনার অ্যাকাউন্টে আগেই সক্রিয়।", auth_required: "আবার সাইন ইন করুন।",
        not_yet: "এই ক্যাশব্যাক এখনো আনলক হয়নি।", streak_too_short: "ক্যাশব্যাক আনলক করতে স্ট্রিক চালিয়ে যান।"
      }
    },
    ar: {
      get: "احصل على Pro", member: "PRO", title: "محاسبة Pro", sub: "سجّل الدخول ببريدك، وافتح Pro واحصل على الشعار الذهبي لمحاسبة.",
      recommended: "موصى به · أفضل قيمة", both: "اختر الاثنين لتجربة Pro الكاملة",
      lifeName: "العضوية الدائمة", lifePrice: "{p}", lifeUnit: "مرة واحدة",
      lifeDesc: "Pro للأبد بدفعة واحدة — واسترد المبلغ كاملًا.",
      lifeCash: "استرداد {a} عن كل سلسلة {d} يومًا، حتى {n} مرات — يعود إليك {p} كاملة.",
      monName: "Pro الشهري", monPrice: "{p}", monUnit: "/ شهر",
      monDesc: "عضوية Pro بفوترة شهرية. دفع تلقائي، وإلغاء في أي وقت.",
      perks: ["تخصيص كامل — احذف العادات الافتراضية أو عدّلها واضبط الخصم والمهلة والنقاط والرموز والألوان", "نسخ احتياطي تلقائي إلى Google Drive الخاص بك — استعادة على أي جهاز", "قفل التطبيق بالبصمة أو قفل الجهاز أو رمز PIN خاص", "شعار Pro ذهبي حول شعارك", "حساب بالبريد — سجّل الدخول من أي جهاز"],
      today: "المستحق اليوم", then: "ثم {p} شهريًا", none: "اختر خطة واحدة على الأقل.",
      cont: "متابعة", back: "رجوع", close: "إغلاق",
      soon: "يجري إعداد الدفع بالبطاقة وسيُفتح قريبًا جدًا إن شاء الله.", soonBtn: "قريبًا", soonPlans: "يُفتح الدفع لـ Pro قريبًا جدًا إن شاء الله. يمكنك إنشاء حسابك الآن لتكون مستعدًا.",
      signup: "إنشاء حساب", login: "تسجيل الدخول", email: "البريد الإلكتروني", emailPh: "you@example.com",
      pass: "كلمة المرور", passPh: "8 أحرف على الأقل", forgot: "نسيت كلمة المرور؟", sendReset: "إرسال رابط إعادة التعيين",
      haveAcc: "لديك حساب بالفعل؟", noAcc: "جديد في محاسبة Pro؟", authSub: "ترتبط عضوية Pro ببريدك فتنتقل معك إلى كل أجهزتك.",
      checkMail: "تحقّق من بريدك", checkMailSub: "أرسلنا رابط تأكيد إلى {email}. افتحه على هذا الجهاز لتفعيل حسابك، ثم تابع إلى الدفع.",
      resetSent: "إن كان هناك حساب لـ {email} فرابط إعادة التعيين في الطريق.",
      newPass: "عيّن كلمة مرور جديدة", savePass: "حفظ كلمة المرور", passSaved: "تم تحديث كلمة المرور. أنت مسجّل الدخول.",
      pay: "الدفع", signedAs: "مسجّل باسم {email}", switchAcc: "تبديل الحساب",
      card: "بيانات البطاقة", cardNo: "رقم البطاقة", exp: "الانتهاء", cvc: "CVC", newCard: "استخدام بطاقة جديدة",
      saved: "بطاقة محفوظة", accept: "نقبل بطاقات الخصم والائتمان",
      saveCard: "احفظ البطاقة لدفع أسرع", saveCardReq: "تحفظ Stripe بطاقتك بأمان للدفع الشهري التلقائي.",
      autoPay: "دفع شهري تلقائي", autoPaySub: "تجديد تلقائي كل شهر. يمكنك إيقافه في أي وقت.",
      payBtn: "ادفع {p}", paying: "جارٍ المعالجة…", verifying: "جارٍ تفعيل Pro…",
      terms: "بالدفع توافق على أن تخصم محاسبة {today} اليوم{rec}. يمكنك إيقاف الدفع التلقائي من لوحة Pro في أي وقت، ويستمر الوصول حتى نهاية الشهر المدفوع.",
      termsRec: " و{m} كل شهر حتى تلغي",
      secure: "محمي بواسطة Stripe · PCI-DSS · لا تصل بيانات البطاقة إلى خوادمنا",
      welcome: "مرحبًا بك في محاسبة Pro!", welcomeSub: "شعارك الذهبي مفعّل الآن. بارك الله في كل عاداتك.",
      receipt: "أُرسل الإيصال إلى {email}.", great: "تم",
      status: "عضويتك", proSince: "عضو Pro", lifetime: "العضوية الدائمة", lifeSince: "منذ {d}",
      monthly: "Pro الشهري", renews: "يتجدد في {d}", ends: "ينتهي في {d}", inactive: "غير نشط", pastDue: "دفعة مستحقة — حدّث بطاقتك.",
      autoRenew: "الدفع التلقائي", cashback: "استرداد السلسلة", cashProg: "استُرد {c} من {n} · {amt} حتى الآن",
      cashNext: "يُفتح الاسترداد التالي {a} في {d} مع سلسلة {s} يومًا.", cashReady: "استرداد {a} جاهز!", cashStreak: "السلسلة الحالية: {s} يومًا (المطلوب {d}).",
      claim: "استرد {a}", claimed: "يعود {a} إلى بطاقتك، ويصل عادة خلال 5–10 أيام.", cashDone: "استُرد كامل {p}. ما شاء الله!",
      addMonthly: "أضف Pro الشهري · {p}/شهر", addLifetime: "أضف العضوية الدائمة · {p}", cards: "البطاقات المحفوظة", signOut: "تسجيل الخروج",
      notPro: "لا توجد خطة Pro نشطة على هذا الحساب بعد.",
      ls: { btn: "تابع إلى الدفع الآمن · {p}", secure: "محمي بواسطة Lemon Squeezy · بطاقات وPayPal والمزيد · لا تمر بيانات البطاقة بخوادمنا", both: "تُدفع العضوية الدائمة أولًا، ثم يُفتح الاشتراك الشهري في دفع ثانٍ.", wait: "أكمل الدفع في نافذة الدفع الآمن. سيُفعَّل Pro تلقائيًا.", check: "دفعت — تحقّق من الحالة", next: "العضوية الدائمة مفعّلة. أكمل الآن Pro الشهري.", pending: "لم يتأكد الدفع بعد. قد يستغرق دقيقة — حاول بعد قليل.", manage: "إدارة الفوترة والبطاقة", terms: "بالدفع توافق على أن تخصم محاسبة {today} الآن{rec}. Lemon Squeezy هو البائع المعتمد لدينا ويتولى الفوترة والإيصالات والضرائب." },
      legal: { privacy: "سياسة الخصوصية", terms: "شروط الخدمة", refund: "سياسة الاسترداد" },
      err: {
        invalid: "البريد أو كلمة المرور غير صحيحة.", unconfirmed: "يرجى تأكيد بريدك أولًا — تحقّق من صندوق الوارد.",
        exists: "يوجد حساب بهذا البريد. سجّل الدخول بدلًا من ذلك.", weak: "اختر كلمة مرور أقوى (8 أحرف على الأقل).",
        invalid_input: "تحقّق من البريد وكلمة المرور.", signup_closed: "التسجيل مغلق حاليًا.", rate: "محاولات كثيرة. انتظر قليلًا.",
        identity_missing: "يجري إعداد الحسابات. حاول بعد قليل.", network: "تعذّر الاتصال. تحقّق من الإنترنت وحاول مجددًا.",
        email: "يرجى إدخال بريد إلكتروني صحيح.", pass: "يجب أن تكون كلمة المرور 8 أحرف على الأقل.", cardInc: "يرجى إكمال بيانات البطاقة.",
        generic: "لم تتم عملية الدفع. حاول مرة أخرى.", offline: "أنت غير متصل. اتصل بالإنترنت للمتابعة.",
        already_pro: "هذه الخطة مفعّلة بالفعل على حسابك.", auth_required: "يرجى تسجيل الدخول مجددًا.",
        not_yet: "لم يُفتح هذا الاسترداد بعد.", streak_too_short: "واصل سلسلتك لفتح الاسترداد."
      }
    }
  };

  var cfg = null, cfgPromise = null, stripe = null, cardEls = null, idPromise = null;
  var st = { view: "plans", lifetime: true, monthly: true, saveCard: true, autoPay: true, auth: "signup", card: "new", busy: false, email: "", notice: "", done: null };
  var sheet, backdrop, lastFocus;

  function lang() { var l = document.documentElement.lang; return T[l] ? l : "en"; }
  function t(k, vars) {
    var s = T[lang()][k]; if (s == null) s = T.en[k]; if (s == null) s = k;
    if (vars && typeof s === "string") Object.keys(vars).forEach(function (v) { s = s.split("{" + v + "}").join(vars[v]); });
    return s;
  }
  /* Nested strings (ls.*, legal.*), falling back to English. */
  function tl(group, k, vars) {
    var g = T[lang()][group] || {}, s = g[k] != null ? g[k] : (T.en[group] || {})[k];
    if (s == null) s = k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split("{" + v + "}").join(vars[v]); });
    return s;
  }
  function isLS() { return !!(cfg && cfg.provider === "lemonsqueezy"); }
  function legalLinks() {
    return '<nav class="mhs-pro-legal" aria-label="Legal">' + ["privacy", "terms", "refund"].map(function (k) {
      return '<a href="/legal/' + k + '" target="_blank" rel="noopener">' + esc(tl("legal", k)) + "</a>";
    }).join("<span aria-hidden=\"true\">·</span>") + "</nav>";
  }
  function errText(code) { var e = T[lang()].err; return e[code] || T.en.err[code] || e.generic; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function loc() { return lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar" : "en-US"; }
  function money(n) {
    try { return new Intl.NumberFormat(loc(), { style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n); }
    catch (e) { return "$" + n; }
  }
  function num(n) { try { return new Intl.NumberFormat(loc()).format(n); } catch (e) { return String(n); } }
  function date(ms) { try { return new Date(ms).toLocaleDateString(loc(), { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return new Date(ms).toDateString(); } }
  function plans() { return (cfg && cfg.plans) || { lifetime: 10, monthly: 1 }; }
  function cash() { return (cfg && cfg.cashback) || { everyDays: 40, amount: 1, steps: 10 }; }
  function member() { return cfg && cfg.member; }
  function streak() {
    try { var d = window.MHS && window.MHS.current && window.MHS.current(); return d && window.MHSInsights ? window.MHSInsights.compute(d, 7).streak.current || 0 : 0; }
    catch (e) { return 0; }
  }

  /* ---------- data ---------- */
  function loadConfig(force) {
    if (cfgPromise && !force) return cfgPromise;
    cfgPromise = fetch("/api/pro", { headers: { Accept: "application/json" }, cache: "no-store", credentials: "same-origin" })
      .then(function (r) { if (!r.ok) throw new Error("config"); return r.json(); })
      .then(function (c) { cfg = c; applyPro(); return c; })
      .catch(function () { cfgPromise = null; cfg = cfg || { enabled: false, plans: { lifetime: 10, monthly: 1 }, cashback: { everyDays: 40, amount: 1, steps: 10 }, signedIn: false, member: null, unreachable: true }; return cfg; });
    return cfgPromise;
  }
  function post(body) {
    return fetch("/api/pro", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.error || "generic"); e.code = d.error || "generic"; e.data = d; e.status = r.status; throw e; } return d; }); });
  }
  function loadIdentity() {
    if (window.MHSIdentity) return Promise.resolve(window.MHSIdentity);
    if (idPromise) return idPromise;
    idPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "/pwa/identity.js"; s.async = true;
      s.onload = function () { window.MHSIdentity ? resolve(window.MHSIdentity) : reject(codeErr("identity_missing")); };
      s.onerror = function () { idPromise = null; reject(codeErr("network")); };
      document.head.appendChild(s);
    });
    return idPromise;
  }
  function codeErr(c) { var e = new Error(c); e.code = c; return e; }
  function loadStripe() {
    if (window.Stripe) return Promise.resolve(window.Stripe);
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://js.stripe.com/v3/"; s.async = true;
      s.onload = function () { window.Stripe ? resolve(window.Stripe) : reject(new Error("stripe")); };
      s.onerror = function () { reject(new Error("stripe")); };
      document.head.appendChild(s);
    });
  }

  /* Golden crest for members — cached so it shows instantly on the next launch. */
  function applyPro() {
    var m = member(), on = !!(m && m.pro);
    if (cfg && !cfg.unreachable) { try { on ? localStorage.setItem("mhs:pro", "1") : localStorage.removeItem("mhs:pro"); if (cfg.signedIn) localStorage.setItem("mhs:pro-account", "1"); else localStorage.removeItem("mhs:pro-account"); } catch (e) {} }
    else { try { on = localStorage.getItem("mhs:pro") === "1"; } catch (e) {} }
    document.documentElement.classList.toggle("mhs-pro", on);
    try { document.dispatchEvent(new Event("mhs:pro-change")); } catch (e) {}
  }

  /* ---------- icons ---------- */
  var CROWN = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3 7.5 7.6 11 12 4l4.4 7L21 7.5 19.2 18H4.8L3 7.5Zm2 12h14v1.8H5V19.5Z"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  var LOCK = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"/></svg>';
  var CARDS = '<span class="mhs-dn-brands" aria-hidden="true"><i class="v">VISA</i><i class="m"><b></b><b></b></i><i class="a">AMEX</i></span>';
  function crest(size) { return '<span class="mhs-pro-crest" style="--s:' + size + 'px"><img src="/icons/logo.webp" alt="" width="' + size + '" height="' + size + '" decoding="async"></span>'; }

  /* ---------- sheet shell ---------- */
  function buildSheet() {
    backdrop = document.createElement("div");
    backdrop.className = "mhs-dn-backdrop mhs-pro-backdrop";
    backdrop.addEventListener("click", close);
    sheet = document.createElement("div");
    sheet.className = "mhs-dn-sheet mhs-pro-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "mhs-pro-title");
    sheet.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(sheet.querySelectorAll("button,input,select,iframe,[tabindex]:not([tabindex='-1'])"), function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    sheet.addEventListener("click", onClick);
    sheet.addEventListener("change", onChange);
    sheet.addEventListener("submit", onSubmit);
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
  }
  function head(title, sub) {
    return '<button type="button" class="mhs-dn-x" data-act="close" aria-label="' + esc(t("close")) + '">×</button>' +
      '<div class="mhs-pro-head">' + crest(48) + '<div><span class="mhs-pro-kicker">' + CROWN + " PRO</span>" +
      '<h2 id="mhs-pro-title">' + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + "</div></div>";
  }
  function msg() { return '<p class="mhs-dn-msg" role="alert" aria-live="assertive">' + esc(st.notice || "") + "</p>"; }
  function showMsg(m) { st.notice = m || ""; var el = sheet && sheet.querySelector(".mhs-dn-msg"); if (el) el.textContent = st.notice; }
  function dueToday() { var p = plans(); return (st.lifetime ? p.lifetime : 0) + (st.monthly ? p.monthly : 0); }

  function render() {
    if (!sheet) return;
    destroyCard();
    sheet.dir = lang() === "ar" ? "rtl" : "ltr";
    var v = st.view, html;
    if (v === "plans") html = viewPlans();
    else if (v === "auth") html = viewAuth();
    else if (v === "mail") html = viewMail();
    else if (v === "reset") html = viewReset();
    else if (v === "pay") html = viewPay();
    else if (v === "done") html = viewDone();
    else html = viewMember();
    sheet.innerHTML = html;
    sheet.setAttribute("data-view", v);
    if (v === "pay" && cfg && cfg.enabled && !isLS() && st.card === "new") mountCard();
    var first = sheet.querySelector("[autofocus]") || sheet.querySelector(".mhs-pro-plan") || sheet.querySelector(".mhs-dn-x");
    if (first) try { first.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---------- views ---------- */
  function planCard(kind) {
    var p = plans(), c = cash(), on = st[kind];
    var name = kind === "lifetime" ? t("lifeName") : t("monName");
    var price = money(p[kind]), unit = kind === "lifetime" ? t("lifeUnit") : t("monUnit");
    var desc = kind === "lifetime" ? t("lifeDesc") : t("monDesc");
    var extra = kind === "lifetime" ? '<span class="mhs-pro-cash">' + esc(t("lifeCash", { a: money(c.amount), d: num(c.everyDays), n: num(c.steps), p: money(p.lifetime) })) + "</span>" : "";
    return '<button type="button" role="checkbox" aria-checked="' + on + '" class="mhs-pro-plan' + (on ? " on" : "") + '" data-plan="' + kind + '">' +
      '<span class="box">' + CHECK + "</span>" +
      '<span class="body"><span class="row"><b>' + esc(name) + '</b><span class="price"><span class="num">' + esc(price) + "</span> <small>" + esc(unit) + "</small></span></span>" +
      '<span class="desc">' + esc(desc) + "</span>" + extra + "</span></button>";
  }
  function viewPlans() {
    var p = plans(), any = st.lifetime || st.monthly;
    var perks = (T[lang()].perks || T.en.perks).map(function (x) { return "<li>" + CHECK + "<span>" + esc(x) + "</span></li>"; }).join("");
    var m = member();
    return head(t("title"), t("sub")) +
      '<div class="mhs-pro-rec' + (st.lifetime && st.monthly ? " on" : "") + '"><span>' + CROWN + " " + esc(t("recommended")) + "</span><small>" + esc(t("both")) + "</small></div>" +
      '<div class="mhs-pro-plans" role="group" aria-label="' + esc(t("title")) + '">' +
        (m && m.lifetime ? "" : planCard("lifetime")) + (m && m.monthly && m.monthly.active ? "" : planCard("monthly")) + "</div>" +
      '<ul class="mhs-pro-perks">' + perks + "</ul>" +
      '<div class="mhs-pro-total"><span>' + esc(t("today")) + '</span><b class="num">' + esc(money(dueToday())) + "</b>" +
        (st.monthly ? "<small>" + esc(t("then", { p: money(p.monthly) })) + "</small>" : "") + "</div>" +
      (cfg && cfg.enabled ? "" : '<p class="mhs-dn-soon">' + esc(t("soonPlans")) + "</p>") +
      msg() +
      '<button type="button" class="mhs-pro-go" data-act="continue"' + (any ? "" : " disabled") + ">" + CROWN + "<span>" + esc(any ? t("cont") : t("none")) + "</span></button>" +
      '<p class="mhs-dn-secure">' + LOCK + " " + esc(isLS() ? tl("ls", "secure") : t("secure")) + "</p>" + legalLinks();
  }
  function viewAuth() {
    var mode = st.auth, forgot = mode === "forgot";
    var title = forgot ? t("forgot") : mode === "login" ? t("login") : t("signup");
    return head(title, t("authSub")) +
      (forgot ? "" : '<div class="mhs-pro-tabs" role="tablist"><button type="button" role="tab" data-auth="signup" aria-selected="' + (mode === "signup") + '">' + esc(t("signup")) + '</button><button type="button" role="tab" data-auth="login" aria-selected="' + (mode === "login") + '">' + esc(t("login")) + "</button></div>") +
      '<form class="mhs-dn-form mhs-pro-form" data-form="auth" novalidate>' +
        '<label><span>' + esc(t("email")) + '</span><input name="email" type="email" autocomplete="email" inputmode="email" dir="ltr" maxlength="200" required value="' + esc(st.email) + '" placeholder="' + esc(t("emailPh")) + '" autofocus></label>' +
        (forgot ? "" : '<label><span>' + esc(t("pass")) + '</span><input name="password" type="password" minlength="8" maxlength="128" dir="ltr" required autocomplete="' + (mode === "signup" ? "new-password" : "current-password") + '" placeholder="' + esc(t("passPh")) + '"></label>') +
        msg() +
        '<button type="submit" class="mhs-pro-go"><span>' + esc(forgot ? t("sendReset") : mode === "login" ? t("login") : t("signup")) + "</span></button>" +
      "</form>" +
      '<div class="mhs-pro-links">' +
        (mode === "login" ? '<button type="button" class="mhs-pro-link" data-auth="forgot">' + esc(t("forgot")) + "</button>" : "") +
        (forgot ? '<button type="button" class="mhs-pro-link" data-auth="login">' + esc(t("back")) + "</button>" : "") +
        '<button type="button" class="mhs-pro-link" data-act="plans">← ' + esc(t("back")) + "</button></div>";
  }
  function viewMail() {
    return head(t("checkMail"), t("checkMailSub", { email: st.email })) + msg() +
      '<button type="button" class="mhs-pro-go" data-auth="login">' + esc(t("login")) + "</button>";
  }
  function viewReset() {
    return head(t("newPass"), "") +
      '<form class="mhs-dn-form mhs-pro-form" data-form="reset" novalidate><label><span>' + esc(t("pass")) + '</span><input name="password" type="password" minlength="8" maxlength="128" dir="ltr" autocomplete="new-password" placeholder="' + esc(t("passPh")) + '" autofocus></label>' +
      msg() + '<button type="submit" class="mhs-pro-go"><span>' + esc(t("savePass")) + "</span></button></form>";
  }
  function viewPayLS() {
    var p = plans(), m = member() || {};
    var lines = (st.lifetime ? '<li><span>' + esc(t("lifeName")) + '</span><b class="num">' + esc(money(p.lifetime)) + "</b></li>" : "") +
      (st.monthly ? '<li><span>' + esc(t("monName")) + '</span><b class="num">' + esc(money(p.monthly)) + " <small>" + esc(t("monUnit")) + "</small></b></li>" : "");
    var first = st.lifetime ? p.lifetime : p.monthly;
    var rec = st.monthly && st.autoPay ? t("termsRec", { m: money(p.monthly) }) : "";
    return head(t("pay"), t("signedAs", { email: m.email || st.email })) +
      '<form class="mhs-dn-form mhs-pro-form" data-form="pay" novalidate>' +
        '<ul class="mhs-pro-sum">' + lines + '<li class="tot"><span>' + esc(t("today")) + '</span><b class="num">' + esc(money(dueToday())) + "</b></li></ul>" +
        (st.lifetime && st.monthly ? '<p class="mhs-dn-accept">' + esc(tl("ls", "both")) + "</p>" : "") +
        '<div class="mhs-pro-opts">' + (st.monthly ? toggle("autoPay", t("autoPay"), t("autoPaySub"), st.autoPay) : "") + "</div>" +
        msg() +
        '<button type="submit" class="mhs-pro-go">' + LOCK + '<span class="lbl">' + esc(tl("ls", "btn", { p: money(first) })) + "</span></button>" +
        (st.lsOpen ? '<button type="button" class="mhs-pro-go ghost" data-act="lscheck">' + esc(tl("ls", "check")) + "</button>" : "") +
        '<p class="mhs-pro-terms">' + esc(tl("ls", "terms", { today: money(first), rec: rec })) + "</p>" +
        '<p class="mhs-dn-secure">' + LOCK + " " + esc(tl("ls", "secure")) + "</p>" + legalLinks() +
      "</form>" +
      '<div class="mhs-pro-links"><button type="button" class="mhs-pro-link" data-act="plans">← ' + esc(t("back")) + '</button><button type="button" class="mhs-pro-link" data-act="signout">' + esc(t("switchAcc")) + "</button></div>";
  }
  function viewPay() {
    if (isLS()) return viewPayLS();
    var live = cfg && cfg.enabled, p = plans(), m = member() || {}, cards = m.cards || [];
    var lines = (st.lifetime ? '<li><span>' + esc(t("lifeName")) + '</span><b class="num">' + esc(money(p.lifetime)) + "</b></li>" : "") +
      (st.monthly ? '<li><span>' + esc(t("monName")) + '</span><b class="num">' + esc(money(p.monthly)) + " <small>" + esc(t("monUnit")) + "</small></b></li>" : "");
    var saved = cards.length ? '<div class="mhs-pro-saved" role="radiogroup" aria-label="' + esc(t("saved")) + '">' + cards.map(function (c) {
      return '<label class="mhs-pro-radio"><input type="radio" name="card" value="' + esc(c.id) + '"' + (st.card === c.id ? " checked" : "") + '><span><b>' + esc(cap(c.brand)) + " •••• " + esc(c.last4) + "</b><small>" + esc(c.exp) + "</small></span></label>";
    }).join("") + '<label class="mhs-pro-radio"><input type="radio" name="card" value="new"' + (st.card === "new" ? " checked" : "") + "><span><b>" + esc(t("newCard")) + "</b></span></label></div>" : "";
    var newCard = st.card === "new" ? '<div class="mhs-dn-card"><div class="mhs-dn-cardhead"><span>' + esc(t("card")) + "</span>" + CARDS + "</div>" +
      '<div class="mhs-dn-field full" dir="ltr"><span class="lbl">' + esc(t("cardNo")) + '</span><div id="mhs-pro-number" class="mhs-dn-el">' + (live ? "" : '<span class="ph">1234 1234 1234 1234</span>') + "</div></div>" +
      '<div class="mhs-dn-split" dir="ltr"><div class="mhs-dn-field"><span class="lbl">' + esc(t("exp")) + '</span><div id="mhs-pro-exp" class="mhs-dn-el">' + (live ? "" : '<span class="ph">MM / YY</span>') + "</div></div>" +
      '<div class="mhs-dn-field"><span class="lbl">' + esc(t("cvc")) + '</span><div id="mhs-pro-cvc" class="mhs-dn-el">' + (live ? "" : '<span class="ph">CVC</span>') + "</div></div></div>" +
      '<p class="mhs-dn-accept">' + esc(t("accept")) + "</p></div>" : "";
    var forced = st.monthly && st.autoPay;
    var opts = (st.monthly ? toggle("autoPay", t("autoPay"), t("autoPaySub"), st.autoPay) : "") +
      (st.card === "new" ? toggle("saveCard", t("saveCard"), forced ? t("saveCardReq") : "", forced || st.saveCard, forced) : "");
    var rec = st.monthly && st.autoPay ? t("termsRec", { m: money(p.monthly) }) : "";
    return head(t("pay"), t("signedAs", { email: m.email || st.email })) +
      '<form class="mhs-dn-form mhs-pro-form" data-form="pay" novalidate>' +
        '<ul class="mhs-pro-sum">' + lines + '<li class="tot"><span>' + esc(t("today")) + '</span><b class="num">' + esc(money(dueToday())) + "</b></li></ul>" +
        saved + newCard + '<div class="mhs-pro-opts">' + opts + "</div>" +
        msg() +
        (live ? "" : '<p class="mhs-dn-soon">' + esc(cfg && cfg.unreachable && !navigator.onLine ? errText("offline") : t("soon")) + "</p>") +
        '<button type="submit" class="mhs-pro-go"' + (live ? "" : " disabled") + ">" + LOCK + '<span class="lbl">' + esc(live ? t("payBtn", { p: money(dueToday()) }) : t("soonBtn")) + "</span></button>" +
        '<p class="mhs-pro-terms">' + esc(t("terms", { today: money(dueToday()), rec: rec })) + "</p>" +
        '<p class="mhs-dn-secure">' + LOCK + " " + esc(t("secure")) + "</p>" + legalLinks() +
      "</form>" +
      '<div class="mhs-pro-links"><button type="button" class="mhs-pro-link" data-act="plans">← ' + esc(t("back")) + '</button><button type="button" class="mhs-pro-link" data-act="signout">' + esc(t("switchAcc")) + "</button></div>";
  }
  function toggle(name, label, sub, on, locked) {
    return '<label class="mhs-pro-toggle"><input type="checkbox" name="' + name + '"' + (on ? " checked" : "") + (locked ? " disabled" : "") + '><span class="sw" aria-hidden="true"></span><span class="txt"><b>' + esc(label) + "</b>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span></label>";
  }
  function cap(s) { s = String(s || ""); return s === "amex" ? "Amex" : s.charAt(0).toUpperCase() + s.slice(1); }
  function viewDone() {
    var m = member() || {};
    return '<button type="button" class="mhs-dn-x" data-act="close" aria-label="' + esc(t("close")) + '">×</button>' +
      '<div class="mhs-dn-thanks mhs-pro-welcome">' + crest(84) + '<h2 id="mhs-pro-title">' + esc(t("welcome")) + "</h2><p>" + esc(t("welcomeSub")) + "</p>" +
      (m.email ? '<p class="muted">' + esc(t("receipt", { email: m.email })) + "</p>" : "") +
      '<button type="button" class="mhs-pro-go" data-act="member" autofocus>' + CROWN + "<span>" + esc(t("great")) + "</span></button></div>";
  }
  function viewMember() {
    var m = member() || {}, p = plans(), c = cash();
    var out = head(m.pro ? t("proSince") : t("status"), m.email || "");
    if (!m.pro) out += '<p class="mhs-pro-empty">' + esc(t("notPro")) + "</p>";
    if (m.lifetime) {
      var cb = m.cashback || { claimed: 0, refundedCents: 0, remaining: c.steps, nextEligibleAt: null };
      var segs = ""; for (var i = 0; i < c.steps; i++) segs += '<i class="' + (i < cb.claimed ? "on" : "") + '"></i>';
      var s = streak(), ready = cb.remaining > 0 && cb.nextEligibleAt && Date.now() >= cb.nextEligibleAt && s >= c.everyDays;
      var info = cb.remaining <= 0 ? t("cashDone", { p: money(p.lifetime) })
        : ready ? t("cashReady", { a: money(c.amount) })
        : (cb.nextEligibleAt ? t("cashNext", { a: money(c.amount), d: date(Math.max(cb.nextEligibleAt, Date.now())), s: num(c.everyDays) }) + " " : "") + t("cashStreak", { s: num(s), d: num(c.everyDays) });
      out += '<section class="mhs-pro-card gold"><div class="row"><b>' + CROWN + " " + esc(t("lifetime")) + "</b>" + (m.lifetime.purchasedAt ? "<small>" + esc(t("lifeSince", { d: date(m.lifetime.purchasedAt) })) + "</small>" : "") + "</div>" +
        '<div class="mhs-pro-cb"><div class="row"><span>' + esc(t("cashback")) + '</span><small class="num">' + esc(t("cashProg", { c: num(cb.claimed), n: num(c.steps), amt: money((cb.refundedCents || 0) / 100) })) + "</small></div>" +
        '<div class="mhs-pro-segs" aria-hidden="true">' + segs + "</div><p>" + esc(info) + "</p>" +
        (cb.remaining > 0 ? '<button type="button" class="mhs-pro-go sm" data-act="claim"' + (ready ? "" : " disabled") + ">" + esc(t("claim", { a: money(c.amount) })) + "</button>" : "") + "</div></section>";
    }
    if (m.monthly) {
      var mo = m.monthly, end = mo.periodEnd ? date(mo.periodEnd) : "";
      var line = !mo.active ? t("inactive") : mo.status === "past_due" ? t("pastDue") : end ? (mo.autoRenew ? t("renews", { d: end }) : t("ends", { d: end })) : "";
      out += '<section class="mhs-pro-card"><div class="row"><b>' + esc(t("monthly")) + '</b><small class="num">' + esc(money(p.monthly)) + " " + esc(t("monUnit")) + "</small></div><p>" + esc(line) + "</p>" +
        (mo.active ? toggle("autoRenew", t("autoRenew"), t("autoPaySub"), mo.autoRenew) : "") +
        (mo.provider === "lemonsqueezy" && mo.active ? '<button type="button" class="mhs-pro-go sm ghost" data-act="portal">' + esc(tl("ls", "manage")) + "</button>" : "") + "</section>";
    }
    if (m.cards && m.cards.length) out += '<section class="mhs-pro-card"><div class="row"><b>' + esc(t("cards")) + "</b></div>" + m.cards.map(function (x) { return "<p class=\"num\">" + esc(cap(x.brand)) + " •••• " + esc(x.last4) + " · " + esc(x.exp) + "</p>"; }).join("") + "</section>";
    if (m.pro) out += '<mhs-pro-tools compact="1"></mhs-pro-tools>';
    out += msg();
    if (!(m.monthly && m.monthly.active)) out += '<button type="button" class="mhs-pro-go" data-act="add" data-plan="monthly">' + esc(t("addMonthly", { p: money(p.monthly) })) + "</button>";
    if (!m.lifetime) out += '<button type="button" class="mhs-pro-go' + (m.monthly && m.monthly.active ? "" : " ghost") + '" data-act="add" data-plan="lifetime">' + esc(t("addLifetime", { p: money(p.lifetime) })) + "</button>";
    out += '<div class="mhs-pro-links"><button type="button" class="mhs-pro-link" data-act="signout">' + esc(t("signOut")) + "</button></div>" + legalLinks();
    return out;
  }

  /* ---------- card element ---------- */
  function cardStyle() {
    var cs = getComputedStyle(document.documentElement);
    function hsl(v, d) { return "hsl(" + (cs.getPropertyValue(v).trim() || d).replace(/ /g, ",").replace(/,+/g, ",") + ")"; }
    var mut = hsl("--muted-foreground", "220 9% 62%");
    return { base: { color: hsl("--foreground", "210 20% 96%"), fontFamily: "Inter, system-ui, sans-serif", fontSize: "16px", iconColor: mut, "::placeholder": { color: mut } }, invalid: { color: "#ff6b6b", iconColor: "#ff6b6b" } };
  }
  function mountCard() {
    var holder = sheet.querySelector("#mhs-pro-number"); if (!holder) return;
    holder.innerHTML = '<span class="ph">…</span>';
    loadStripe().then(function (S) {
      if (!sheet.contains(holder)) return;
      if (!stripe) stripe = S(cfg.publishableKey, { locale: lang() === "bn" ? "auto" : lang() });
      var els = stripe.elements({ fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" }] }), style = cardStyle();
      cardEls = { number: els.create("cardNumber", { style: style, showIcon: true }), exp: els.create("cardExpiry", { style: style }), cvc: els.create("cardCvc", { style: style }), complete: {} };
      holder.innerHTML = "";
      cardEls.number.mount("#mhs-pro-number"); cardEls.exp.mount("#mhs-pro-exp"); cardEls.cvc.mount("#mhs-pro-cvc");
      ["number", "exp", "cvc"].forEach(function (k) {
        cardEls[k].on("change", function (ev) {
          cardEls.complete[k] = ev.complete;
          var b = sheet.querySelector("#mhs-pro-" + k); if (b) b.classList.toggle("bad", !!ev.error);
          showMsg(ev.error ? ev.error.message : "");
        });
        cardEls[k].on("focus", function () { var b = sheet.querySelector("#mhs-pro-" + k); if (b) b.classList.add("focus"); });
        cardEls[k].on("blur", function () { var b = sheet.querySelector("#mhs-pro-" + k); if (b) b.classList.remove("focus"); });
      });
    }).catch(function () { holder.innerHTML = ""; showMsg(errText("network")); });
  }
  function destroyCard() {
    if (!cardEls) return;
    try { cardEls.number.destroy(); cardEls.exp.destroy(); cardEls.cvc.destroy(); } catch (e) {}
    cardEls = null;
  }

  /* ---------- events ---------- */
  function go(view) { st.view = view; st.notice = ""; render(); }
  function afterAuth() {
    return loadConfig(true).then(function () {
      var m = member();
      if (m && m.cards && m.cards.length && st.card === "new") st.card = m.cards[0].id;
      /* Drop plans the account already has; show the member panel if nothing is left to buy. */
      if (m && m.lifetime) st.lifetime = false;
      if (m && m.monthly && m.monthly.active) st.monthly = false;
      go(st.lifetime || st.monthly ? "pay" : "member");
    });
  }
  function setBusy(b, label) {
    st.busy = b;
    Array.prototype.forEach.call(sheet.querySelectorAll("button,input"), function (x) { if (b) { x.dataset.wasDisabled = x.disabled ? "1" : ""; x.disabled = true; } else if (x.dataset.wasDisabled !== undefined) { x.disabled = x.dataset.wasDisabled === "1"; delete x.dataset.wasDisabled; } });
    var go = sheet.querySelector(".mhs-pro-go"); if (go) go.classList.toggle("busy", b);
    var lbl = sheet.querySelector(".mhs-pro-go .lbl, .mhs-pro-go span:last-child"); if (lbl && label) lbl.textContent = label;
  }
  function fail(e) { setBusy(false); render(); showMsg(e && e.message && !e.code ? e.message : errText(e && e.code || (!navigator.onLine ? "offline" : "generic"))); }

  function onClick(e) {
    var b = e.target.closest("button"); if (!b || st.busy) return;
    var act = b.getAttribute("data-act"), plan = b.getAttribute("data-plan"), auth = b.getAttribute("data-auth");
    if (act === "close") { close(); return; }
    if (plan && !act) {
      st[plan] = !st[plan]; var keep = st.notice; render(); showMsg(keep);
      var again = sheet.querySelector('[data-plan="' + plan + '"]'); if (again) again.focus();
      return;
    }
    if (auth) { st.auth = auth; go("auth"); return; }
    if (act === "plans") { go("plans"); return; }
    if (act === "member") { go("member"); return; }
    if (act === "continue") {
      if (!(st.lifetime || st.monthly)) return;
      if (!navigator.onLine) { showMsg(errText("offline")); return; }
      setBusy(true);
      loadConfig(true).then(function () { setBusy(false); if (cfg.signedIn) return afterAuth(); st.auth = localStorage.getItem("mhs:pro-account") ? "login" : "signup"; go("auth"); });
      return;
    }
    if (act === "add") { st.lifetime = plan === "lifetime"; st.monthly = plan === "monthly"; go("plans"); return; }
    if (act === "signout") {
      setBusy(true);
      loadIdentity().then(function (id) { return id.logout(); }).catch(function () {}).then(function () {
        try { localStorage.removeItem("mhs:pro-account"); localStorage.removeItem("mhs:pro"); } catch (x) {}
        return loadConfig(true);
      }).then(function () { setBusy(false); st.lifetime = true; st.monthly = true; st.card = "new"; st.auth = "login"; go("plans"); });
      return;
    }
    if (act === "lscheck") { checkLS(st.lsOrder || null, 0, true); return; }
    if (act === "portal") {
      /* Open the window synchronously so popup blockers allow it, then point it at the signed URL. */
      var w = window.open("about:blank", "_blank");
      setBusy(true);
      post({ action: "portal" }).then(function (d) { setBusy(false); if (w) w.location.href = d.url; else location.href = d.url; })
        .catch(function (x) { if (w) w.close(); fail(x); });
      return;
    }
    if (act === "claim") {
      setBusy(true);
      post({ action: "cashback", streak: streak() }).then(function (d) {
        cfg.member = d.member; setBusy(false); render(); showMsg(t("claimed", { a: money(cash().amount) }));
        try { if (window.MHSMotion) window.MHSMotion.burst(innerWidth / 2, innerHeight * 0.4, 40, 2); } catch (x) {}
      }).catch(fail);
    }
  }
  function onChange(e) {
    var n = e.target.name;
    if (n === "card") { st.card = e.target.value; render(); return; }
    if (n === "saveCard") { st.saveCard = e.target.checked; return; }
    if (n === "autoPay") { st.autoPay = e.target.checked; if (st.autoPay) st.saveCard = true; var snap = st.card; render(); st.card = snap; return; }
    if (n === "autoRenew") {
      var on = e.target.checked; setBusy(true);
      post({ action: "autorenew", on: on }).then(function (d) { cfg.member = d.member; setBusy(false); render(); }).catch(function (x) { e.target.checked = !on; fail(x); });
    }
  }
  function onSubmit(e) {
    e.preventDefault(); if (st.busy) return;
    var f = e.target, kind = f.getAttribute("data-form");
    if (!navigator.onLine) { showMsg(errText("offline")); return; }
    if (kind === "auth") return submitAuth(f);
    if (kind === "reset") {
      var pw = f.password.value; if (pw.length < 8) { showMsg(errText("pass")); return; }
      setBusy(true);
      loadIdentity().then(function (id) { return id.setPassword(pw); }).then(function () { return afterAuth(); }).then(function () { showMsg(t("passSaved")); }).catch(fail);
      return;
    }
    if (kind === "pay") return submitPay();
  }
  function submitAuth(f) {
    var email = f.email.value.trim(), mode = st.auth; st.email = email;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg(errText("email")); f.email.focus(); return; }
    var pw = f.password ? f.password.value : "";
    if (mode !== "forgot" && pw.length < (mode === "signup" ? 8 : 1)) { showMsg(errText("pass")); f.password.focus(); return; }
    setBusy(true); showMsg("");
    loadIdentity().then(function (id) {
      if (mode === "forgot") return id.recover(email).then(function () { setBusy(false); st.auth = "login"; go("auth"); showMsg(t("resetSent", { email: email })); });
      if (mode === "login") return id.login(email, pw).then(function () { try { localStorage.setItem("mhs:pro-account", "1"); } catch (x) {} return afterAuth(); });
      return id.signup(email, pw).then(function (user) {
        try { localStorage.setItem("mhs:pro-account", "1"); } catch (x) {}
        if (user && (user.emailVerified || user.confirmedAt)) return afterAuth();
        setBusy(false); go("mail");
      });
    }).catch(function (err) {
      if (err && err.code === "exists") st.auth = "login";
      fail(err);
    });
  }
  function submitPay() {
    if (!(cfg && cfg.enabled)) return;
    if (isLS()) return payLS();
    var useSaved = st.card !== "new";
    if (!useSaved && (!stripe || !cardEls || !(cardEls.complete.number && cardEls.complete.exp && cardEls.complete.cvc))) { showMsg(errText("cardInc")); return; }
    var saveCard = (st.monthly && st.autoPay) || st.saveCard;
    var email = (member() && member().email) || st.email;
    setBusy(true, t("paying")); showMsg("");
    var order;
    post({ action: "checkout", lifetime: st.lifetime, monthly: st.monthly, saveCard: saveCard, autoRenew: st.autoPay })
      .then(function (d) {
        order = d;
        var pm = useSaved ? st.card : { card: cardEls.number, billing_details: { email: email } };
        var withStripe = stripe ? Promise.resolve(stripe) : loadStripe().then(function (S) { stripe = S(cfg.publishableKey); return stripe; });
        return withStripe.then(function (s) { return s.confirmCardPayment(d.clientSecret, { payment_method: pm }); });
      })
      .then(function (res) {
        if (res.error) { var x = new Error(res.error.message || errText("generic")); throw x; }
        setBusy(true, t("verifying"));
        return confirmWithRetry(order, 0);
      })
      .then(function (d) {
        cfg.member = d.member; applyPro(); st.busy = false; go("done");
        try { if (window.MHSMotion) window.MHSMotion.burst(innerWidth / 2, innerHeight * 0.4, 80, 2.6); } catch (x) {}
      })
      .catch(fail);
  }
  /* ---------- Lemon Squeezy overlay checkout ---------- */
  var lemonPromise = null;
  function loadLemon() {
    if (window.LemonSqueezy) return Promise.resolve(window.LemonSqueezy);
    if (lemonPromise) return lemonPromise;
    lemonPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://assets.lemonsqueezy.com/lemon.js"; s.defer = true;
      s.onload = function () {
        try { if (window.createLemonSqueezy) window.createLemonSqueezy(); } catch (e) {}
        if (!window.LemonSqueezy) { lemonPromise = null; reject(codeErr("network")); return; }
        window.LemonSqueezy.Setup({ eventHandler: onLemonEvent });
        resolve(window.LemonSqueezy);
      };
      s.onerror = function () { lemonPromise = null; reject(codeErr("network")); };
      document.head.appendChild(s);
    });
    return lemonPromise;
  }
  function onLemonEvent(ev) {
    if (!ev || ev.event !== "Checkout.Success") return;
    var d = ev.data || {}, o = d.order && (d.order.data || d.order) || d;
    st.lsOrder = o && o.id ? String(o.id) : null;
    try { window.LemonSqueezy.Url.Close(); } catch (e) {}
    checkLS(st.lsOrder, 0, false);
  }
  function payLS() {
    setBusy(true, t("paying")); showMsg("");
    var dark = document.documentElement.dataset.theme !== "light";
    Promise.all([post({ action: "checkout", lifetime: st.lifetime, monthly: st.monthly, autoRenew: st.autoPay, dark: dark }), loadLemon()])
      .then(function (r) {
        st.lsPlan = r[0].plan; st.lsNext = r[0].next; st.lsOrder = null; st.lsOpen = true;
        setBusy(false); render(); showMsg(tl("ls", "wait"));
        r[1].Url.Open(r[0].url);
      })
      .catch(fail);
  }
  /* After the overlay reports success (or the member taps "check"), ask the server to verify.
   * The signed webhook may land a few seconds later, so retry briefly before giving up. */
  function checkLS(orderId, n, manual) {
    if (!st.lsPlan) return;
    setBusy(true, t("verifying"));
    post({ action: "confirm", kind: "ls", plan: st.lsPlan, orderId: orderId || "" }).then(function (d) {
      cfg.member = d.member; applyPro(); st.busy = false; st.lsOpen = false;
      if (st.lsPlan === "lifetime") st.lifetime = false;
      if (st.lsPlan === "monthly") st.monthly = false;
      var next = st.lsNext && st[st.lsNext];
      st.lsPlan = null; st.lsNext = null; st.lsOrder = null;
      if (next) { go("pay"); showMsg(tl("ls", "next")); return; }
      go("done");
      try { if (window.MHSMotion) window.MHSMotion.burst(innerWidth / 2, innerHeight * 0.4, 80, 2.6); } catch (x) {}
    }).catch(function (e) {
      if (e.code === "not_paid" && n < (manual ? 2 : 6)) { setTimeout(function () { checkLS(orderId, n + 1, manual); }, 2000 * (n + 1)); return; }
      setBusy(false); render();
      showMsg(e.code === "not_paid" ? tl("ls", "pending") : errText(e.code));
    });
  }

  /* Card payments can take a moment to settle (e.g. after 3-D Secure), so retry the check briefly. */
  function confirmWithRetry(order, n) {
    return post({ action: "confirm", kind: order.kind, id: order.id }).catch(function (e) {
      if (e.code === "not_paid" && n < 5) return new Promise(function (r) { setTimeout(r, 1500 * (n + 1)); }).then(function () { return confirmWithRetry(order, n + 1); });
      throw e;
    });
  }

  /* ---------- open / close ---------- */
  function open(view) {
    if (!sheet) buildSheet();
    lastFocus = document.activeElement;
    document.documentElement.classList.add("mhs-dn-open");
    sheet.innerHTML = '<div class="mhs-dn-wait">' + crest(40) + "</div>";
    void sheet.offsetWidth;
    backdrop.classList.add("show"); sheet.classList.add("show");
    setExpanded(true);
    loadConfig(true).then(function () {
      if (!sheet.classList.contains("show")) return;
      var m = member();
      if (typeof view === "string") st.view = view;
      else if (m && (m.pro || m.lifetime || m.monthly)) st.view = "member";
      else { st.view = "plans"; st.lifetime = true; st.monthly = true; }
      st.notice = ""; render();
    });
  }
  function close() {
    if (!sheet || !sheet.classList.contains("show") || st.busy) return;
    destroyCard();
    sheet.classList.remove("show"); backdrop.classList.remove("show");
    document.documentElement.classList.remove("mhs-dn-open");
    setExpanded(false);
    if (st.view === "done") st.view = "member";
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }
  function setExpanded(on) { Array.prototype.forEach.call(document.querySelectorAll(".mhs-pro-btn"), function (b) { b.setAttribute("aria-expanded", String(on)); }); }

  /* Email confirmation and password-reset links come back with a token in the URL hash. */
  function handleCallback() {
    if (!/(confirmation|recovery|invite|email_change)_token=|access_token=/.test(location.hash)) return;
    loadIdentity().then(function (id) { return id.callback(); }).then(function (res) {
      if (!res) return;
      try { localStorage.setItem("mhs:pro-account", "1"); } catch (x) {}
      if (res.type === "recovery") { open("reset"); return; }
      open("plans");
      afterAuth();
    }).catch(function (err) { open("auth"); setTimeout(function () { showMsg(errText(err && err.code)); }, 400); });
  }

  function init() {
    applyPro();
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".mhs-pro-btn");
      if (b) { e.preventDefault(); open(); }
    });
    new MutationObserver(function () { if (sheet && sheet.classList.contains("show") && !st.busy && !cardEls) render(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    handleCallback();
    if (/[?&]pro=success\b/.test(location.search)) {
      try { var u = new URL(location.href); u.searchParams.delete("pro"); history.replaceState(history.state, "", u.pathname + u.search + u.hash); } catch (x) {}
      setTimeout(function () { open("member"); }, 600);
    }
    /* Refresh membership quietly so the golden crest stays accurate. */
    (window.requestIdleCallback || function (f) { setTimeout(f, 2500); })(function () { if (navigator.onLine) loadConfig(); });
  }
  window.MHSProErr = errText;
  window.MuhasabahPro = { open: open, close: close, refresh: function () { return loadConfig(true); }, config: function () { return loadConfig(); }, identity: loadIdentity, state: function () { return cfg; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
