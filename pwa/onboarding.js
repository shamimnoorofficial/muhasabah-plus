/* Muhasabah — first-time user experience (FTUE).
 * Runs once on a new install:
 *   1. Slides: choose the language, learn what the app is for, then allow location
 *      (prayer times) and notifications (deadline reminders). Both permissions are optional.
 *   2. A guided tour: coach marks that spotlight the main controls, tab by tab.
 *   3. Hotspots: small pulsing dots on a few extra features; tapping one shows a tooltip once.
 * Progress is kept on this device, so a half-finished guide resumes on the next launch.
 * The <mhs-tour> panel in Settings replays the guide or brings the tips back.
 * Exposes window.MHSTour. */
(function () {
  "use strict";
  var KEY = "mhs:ftue:v1";

  var T = {
    en: {
      skip: "Skip", next: "Next", back: "Back", done: "Done", close: "Close",
      startTour: "Show me around", explore: "I'll explore myself", gotIt: "Got it",
      introLabel: "Introduction to Muhasabah",
      lt: "Choose your language", lb: "Muhasabah speaks your language. You can change it anytime in Settings.",
      search: "Search languages…", device: "Your device language", noLang: "No language found. Try another name.",
      pt: "Exact prayer times", pb: "Allow location so prayer habits follow the real waqt where you are. Your location stays on this device.",
      nt: "Reminders before deadlines", nb: "Allow notifications to get a reminder while there is still time to complete a task.",
      allowLoc: "Allow location", allowNotif: "Allow notifications", asking: "Waiting…", allowed: "Allowed ✓",
      denied: "Blocked. Allow it in your browser or phone settings.", unsupported: "Not available on this device.", error: "Couldn't get it. Try again.",
      optional: "Optional. You can change this later in Settings.",
      s1t: "Make habit, get reward", s1b: "Muhasabah is your daily self-accounting. Every good habit you complete earns points, and every one you miss costs points.",
      s2t: "Habits with real deadlines", s2b: "Give each habit points, a deadline and repeat days. Prayer habits follow the real prayer times for your location.",
      s3t: "Watch yourself grow", s3b: "Every check-in, reward and penalty is recorded in the ledger, and the chart shows your progress day by day.",
      s4t: "Private and offline", s4b: "Your data stays on this device and the app works without internet. Make a backup whenever you like.",
      tourLabel: "App tour",
      s5t: "A journal for every day", s5b: "Write a few lines about your day, look back on any date in the calendar and search everything you've written.",
      p1t: "Muhasabah Pro", p1b: "Choose Lifetime or Monthly Pro for full customization, automatic Google Drive backup, the app lock and the golden crest.",
      c1t: "Point flow chart", c1b: "See your balance daily, weekly or monthly, as candles or a line. Tap any candle to see the entries behind it.",
      j1t: "Daily journal", j1b: "Tap here to write about your day. Browse past days in the calendar and search everything you've written.",
      f1t: "Quick to-do", f1b: "Add a to-do from any screen with this button, with points and a deadline if you like.",
      e1t: "Islamic essentials", e1b: "Add the five daily prayers, Tahajjud and daily Quran as habits in one tap, or one by one.",
      pr1t: "Prayer time settings", pr1b: "Change your location or city, the calculation method and the Asr madhab here.",
      rm1t: "Deadline reminders", rm1b: "Turn reminders on and choose how many minutes before a deadline you're notified.",
      th1t: "Language and theme", th1b: "Switch the language, or choose a dark, light or system theme, anytime.",
      pt1t: "Pro tools", pt1b: "Back up automatically to your own Google Drive and lock the app with your fingerprint or a PIN.",
      bk1t: "Backup and restore", bk1b: "Export all your data to a file and import it again on any device.",
      dn1t: "Support Muhasabah", dn1b: "If the app helps you, a donation keeps it growing.",
      in1t: "Install the app", in1b: "Add Muhasabah to your home screen so it opens like a regular app, even offline.",
      h4t: "Filter to-dos", h4b: "Switch between all, active and completed to-dos.",
      t1t: "Dashboard", t1b: "Your point balance, streak and progress chart, all in one place.",
      t2t: "Add a reward or penalty", t2b: "Did something good that isn't a habit, or slipped up? Log it here by hand.",
      t3t: "Today's checklist", t3b: "Check in your habits before their deadline, and type quick to-dos here.",
      t4t: "Create a habit", t4b: "Set the points, deadline and repeat days. A missed habit deducts points automatically.",
      t5t: "Ledger", t5b: "Every reward, penalty and check-in with its exact time. You can search it too.",
      t6t: "Settings", t6b: "Prayer times, reminders, journal, language, theme and backup live here.",
      t7t: "You're all set!", t7b: "May Allah put barakah in your habits. You can replay this guide anytime from Settings.",
      h1t: "Muhasabah Pro", h1b: "Unlock full customization, automatic Google Drive backup, the app lock and the golden crest.",
      h2t: "Prayer times", h2b: "Habits linked to a prayer use the real waqt for your location as their deadline.",
      h3t: "Insights", h3b: "Weekly and monthly summaries, a daily points chart and statistics for each habit.",
      panelTitle: "App guide", panelSub: "See the introduction and feature tour again, or bring back the tips on new features.",
      replay: "Replay guide", tips: "Show tips again", tipsOn: "Tips are back. Look for the pulsing dots."
    },
    bn: {
      skip: "এড়িয়ে যান", next: "পরবর্তী", back: "পেছনে", done: "শেষ", close: "বন্ধ করুন",
      startTour: "ঘুরিয়ে দেখান", explore: "আমি নিজেই দেখব", gotIt: "বুঝেছি",
      introLabel: "মুহাসাবার পরিচিতি",
      lt: "আপনার ভাষা বেছে নিন", lb: "মুহাসাবা আপনার ভাষায় চলে। সেটিংস থেকে যেকোনো সময় বদলাতে পারবেন।",
      search: "ভাষা খুঁজুন…", device: "আপনার ডিভাইসের ভাষা", noLang: "কোনো ভাষা পাওয়া যায়নি। অন্য নামে খুঁজুন।",
      pt: "নামাজের সঠিক ওয়াক্ত", pb: "লোকেশনের অনুমতি দিন, যাতে নামাজের অভ্যাসগুলো আপনার এলাকার আসল ওয়াক্ত মেনে চলে। আপনার লোকেশন এই ডিভাইসেই থাকে।",
      nt: "সময়সীমার আগে রিমাইন্ডার", nb: "নোটিফিকেশনের অনুমতি দিন, যাতে কাজ শেষ করার সময় থাকতেই রিমাইন্ডার পান।",
      allowLoc: "লোকেশনের অনুমতি দিন", allowNotif: "নোটিফিকেশনের অনুমতি দিন", asking: "অপেক্ষা করুন…", allowed: "চালু ✓",
      denied: "বন্ধ করা আছে। ব্রাউজার বা ফোনের সেটিংস থেকে চালু করুন।", unsupported: "এই ডিভাইসে নেই।", error: "পাওয়া যায়নি। আবার চেষ্টা করুন।",
      optional: "ঐচ্ছিক। পরে সেটিংস থেকেও পরিবর্তন করা যাবে।",
      s1t: "অভ্যাস গড়ুন, পুরস্কার পান", s1b: "মুহাসাবা আপনার প্রতিদিনের আত্মহিসাব। প্রতিটি ভালো অভ্যাস সম্পন্ন করলে পয়েন্ট পাবেন, আর বাদ পড়লে পয়েন্ট কাটা যাবে।",
      s2t: "সময়সীমাসহ অভ্যাস", s2b: "প্রতিটি অভ্যাসের পয়েন্ট, সময়সীমা ও পুনরাবৃত্তির দিন ঠিক করুন। নামাজের অভ্যাস আপনার এলাকার আসল ওয়াক্ত অনুযায়ী চলে।",
      s3t: "নিজের উন্নতি দেখুন", s3b: "প্রতিটি সম্পন্ন কাজ, পুরস্কার ও কর্তন হিসাবখাতায় জমা হয়, আর চার্টে দিনে দিনে আপনার অগ্রগতি দেখা যায়।",
      s4t: "ব্যক্তিগত ও অফলাইন", s4b: "আপনার ডেটা এই ডিভাইসেই থাকে, ইন্টারনেট ছাড়াও অ্যাপ চলে। যখন খুশি ব্যাকআপ রাখুন।",
      tourLabel: "অ্যাপ পরিচিতি",
      s5t: "প্রতিদিনের দিনলিপি", s5b: "নিজের দিন নিয়ে কয়েক লাইন লিখুন, ক্যালেন্ডারে যেকোনো দিনে ফিরে দেখুন, আর আপনার সব লেখা খুঁজে নিন।",
      p1t: "মুহাসাবা প্রো", p1b: "লাইফটাইম বা মাসিক প্রো নিয়ে পান সম্পূর্ণ কাস্টমাইজেশন, গুগল ড্রাইভে স্বয়ংক্রিয় ব্যাকআপ, অ্যাপ লক ও সোনালি ক্রেস্ট।",
      c1t: "পয়েন্টের প্রবাহ চার্ট", c1b: "দৈনিক, সাপ্তাহিক বা মাসিক হিসাবে ক্যান্ডেল বা লাইনে আপনার স্থিতি দেখুন। যেকোনো ক্যান্ডেলে চাপ দিলে তার পেছনের হিসাব দেখা যাবে।",
      j1t: "দিনলিপি", j1b: "এখানে চাপ দিয়ে আপনার দিনের কথা লিখুন। ক্যালেন্ডারে আগের দিনগুলো দেখুন, আর সব লেখা খুঁজে নিন।",
      f1t: "দ্রুত টুডু", f1b: "যেকোনো স্ক্রিন থেকে এই বাটনে টুডু যোগ করুন, চাইলে পয়েন্ট ও সময়সীমাসহ।",
      e1t: "ইসলামিক মৌলিক অভ্যাস", e1b: "পাঁচ ওয়াক্ত নামাজ, তাহাজ্জুদ ও প্রতিদিনের কুরআন এক চাপে অভ্যাস হিসেবে যোগ করুন, অথবা একটি একটি করে।",
      pr1t: "নামাজের ওয়াক্তের সেটিংস", pr1b: "এখানে লোকেশন বা শহর, হিসাবের পদ্ধতি ও আসরের মাযহাব পরিবর্তন করুন।",
      rm1t: "সময়সীমার রিমাইন্ডার", rm1b: "রিমাইন্ডার চালু করুন, আর সময়সীমার কত মিনিট আগে জানাবে তা বেছে নিন।",
      th1t: "ভাষা ও থিম", th1b: "যেকোনো সময় ভাষা বদলান, অথবা ডার্ক, লাইট বা সিস্টেম থিম বেছে নিন।",
      pt1t: "প্রো টুলস", pt1b: "নিজের গুগল ড্রাইভে স্বয়ংক্রিয় ব্যাকআপ রাখুন, আর ফিঙ্গারপ্রিন্ট বা পিন দিয়ে অ্যাপ লক করুন।",
      bk1t: "ব্যাকআপ ও রিস্টোর", bk1b: "আপনার সব ডেটা একটি ফাইলে এক্সপোর্ট করুন, আর যেকোনো ডিভাইসে আবার ইমপোর্ট করুন।",
      dn1t: "মুহাসাবাকে সহযোগিতা করুন", dn1b: "অ্যাপটি উপকারে এলে আপনার অনুদান এটিকে এগিয়ে নিতে সাহায্য করবে।",
      in1t: "অ্যাপ ইনস্টল করুন", in1b: "মুহাসাবাকে হোম স্ক্রিনে যোগ করুন, যাতে সাধারণ অ্যাপের মতো খোলে, ইন্টারনেট ছাড়াও।",
      h4t: "টুডু ফিল্টার", h4b: "সব, চলমান ও সম্পন্ন টুডুর মধ্যে বদলে দেখুন।",
      t1t: "ড্যাশবোর্ড", t1b: "আপনার পয়েন্টের স্থিতি, ধারাবাহিকতা ও অগ্রগতির চার্ট, সব এক জায়গায়।",
      t2t: "পুরস্কার বা কর্তন যোগ করুন", t2b: "অভ্যাসের বাইরে কোনো ভালো কাজ করেছেন, বা ভুল হয়ে গেছে? এখানে নিজে লিখে রাখুন।",
      t3t: "আজকের কাজের তালিকা", t3b: "সময়সীমার আগে অভ্যাসগুলো সম্পন্ন করুন, আর এখানে দ্রুত টুডু লিখুন।",
      t4t: "নতুন অভ্যাস তৈরি করুন", t4b: "পয়েন্ট, সময়সীমা ও পুনরাবৃত্তির দিন ঠিক করুন। অভ্যাস বাদ পড়লে নিজে থেকেই পয়েন্ট কাটা যাবে।",
      t5t: "হিসাবখাতা", t5b: "প্রতিটি পুরস্কার, কর্তন ও সম্পন্ন কাজ সঠিক সময়সহ। চাইলে খুঁজেও দেখতে পারবেন।",
      t6t: "সেটিংস", t6b: "নামাজের ওয়াক্ত, রিমাইন্ডার, দিনলিপি, ভাষা, থিম ও ব্যাকআপ এখানে।",
      t7t: "সব প্রস্তুত!", t7b: "আল্লাহ আপনার অভ্যাসে বরকত দিন। সেটিংস থেকে যেকোনো সময় এই পরিচিতি আবার দেখতে পারবেন।",
      h1t: "মুহাসাবা প্রো", h1b: "সম্পূর্ণ কাস্টমাইজেশন, গুগল ড্রাইভে স্বয়ংক্রিয় ব্যাকআপ, অ্যাপ লক ও সোনালি ক্রেস্ট চালু করুন।",
      h2t: "নামাজের ওয়াক্ত", h2b: "নামাজের সাথে যুক্ত অভ্যাসের সময়সীমা হয় আপনার এলাকার আসল ওয়াক্ত।",
      h3t: "বিশ্লেষণ", h3b: "সাপ্তাহিক ও মাসিক সারসংক্ষেপ, দৈনিক পয়েন্টের চার্ট আর প্রতিটি অভ্যাসের পরিসংখ্যান।",
      panelTitle: "অ্যাপ গাইড", panelSub: "পরিচিতি ও ফিচার ট্যুর আবার দেখুন, অথবা নতুন ফিচারের টিপসগুলো ফিরিয়ে আনুন।",
      replay: "গাইড আবার দেখুন", tips: "টিপস আবার দেখান", tipsOn: "টিপস ফিরে এসেছে। জ্বলজ্বলে বিন্দুগুলো খুঁজুন।"
    },
    ar: {
      skip: "تخطٍّ", next: "التالي", back: "رجوع", done: "تم", close: "إغلاق",
      startTour: "خذني في جولة", explore: "سأستكشف بنفسي", gotIt: "فهمت",
      introLabel: "تعريف بمحاسبة",
      lt: "اختر لغتك", lb: "محاسبة تتحدث لغتك. يمكنك تغييرها في أي وقت من الإعدادات.",
      search: "ابحث عن لغة…", device: "لغة جهازك", noLang: "لم يتم العثور على لغة. جرّب اسمًا آخر.",
      pt: "مواقيت صلاة دقيقة", pb: "اسمح بالموقع لتتبع عادات الصلاة وقت الصلاة الحقيقي حيث أنت. يبقى موقعك على هذا الجهاز.",
      nt: "تذكير قبل المواعيد", nb: "اسمح بالإشعارات ليصلك تذكير ما دام هناك وقت لإكمال المهمة.",
      allowLoc: "السماح بالموقع", allowNotif: "السماح بالإشعارات", asking: "لحظة…", allowed: "مفعّل ✓",
      denied: "محظور. فعّله من إعدادات المتصفح أو الهاتف.", unsupported: "غير متاح على هذا الجهاز.", error: "تعذر ذلك. حاول مرة أخرى.",
      optional: "اختياري. يمكنك تغييره لاحقًا من الإعدادات.",
      s1t: "اصنع عادة، واكسب أجرًا", s1b: "محاسبة هي محاسبتك اليومية لنفسك. كل عادة صالحة تُتمّها تكسبك نقاطًا، وكل عادة تفوتك تُخصم منك.",
      s2t: "عادات بمواعيد حقيقية", s2b: "حدّد لكل عادة نقاطها وموعدها وأيام تكرارها. عادات الصلاة تتبع أوقات الصلاة الحقيقية في موقعك.",
      s3t: "تابع تقدّمك", s3b: "كل إنجاز ومكافأة وخصم يُسجَّل في السجل، والرسم البياني يُظهر تقدّمك يومًا بيوم.",
      s4t: "خاص ويعمل دون إنترنت", s4b: "بياناتك تبقى على هذا الجهاز والتطبيق يعمل دون إنترنت. احفظ نسخة احتياطية متى شئت.",
      tourLabel: "جولة في التطبيق",
      s5t: "يوميات لكل يوم", s5b: "اكتب بضعة أسطر عن يومك، وارجع إلى أي تاريخ في التقويم، وابحث في كل ما كتبت.",
      p1t: "محاسبة Pro", p1b: "اختر Pro مدى الحياة أو الشهري للتخصيص الكامل والنسخ الاحتياطي التلقائي إلى Google Drive وقفل التطبيق والشعار الذهبي.",
      c1t: "رسم تدفق النقاط", c1b: "شاهد رصيدك يوميًا أو أسبوعيًا أو شهريًا، شموعًا أو خطًا. اضغط على أي شمعة لترى القيود خلفها.",
      j1t: "اليوميات", j1b: "اضغط هنا لتكتب عن يومك. تصفّح الأيام السابقة في التقويم وابحث في كل ما كتبت.",
      f1t: "مهمة سريعة", f1b: "أضف مهمة من أي شاشة بهذا الزر، مع نقاط وموعد إن شئت.",
      e1t: "الأساسيات الإسلامية", e1b: "أضف الصلوات الخمس والتهجد والقرآن اليومي عاداتٍ بضغطة واحدة، أو واحدة تلو الأخرى.",
      pr1t: "إعدادات أوقات الصلاة", pr1b: "غيّر موقعك أو مدينتك وطريقة الحساب ومذهب العصر من هنا.",
      rm1t: "تذكير قبل المواعيد", rm1b: "فعّل التذكيرات واختر قبل كم دقيقة من الموعد يصلك الإشعار.",
      th1t: "اللغة والمظهر", th1b: "غيّر اللغة، أو اختر المظهر الداكن أو الفاتح أو مظهر النظام، في أي وقت.",
      pt1t: "أدوات Pro", pt1b: "انسخ بياناتك تلقائيًا إلى Google Drive الخاص بك، واقفل التطبيق ببصمتك أو برمز PIN.",
      bk1t: "النسخ الاحتياطي والاستعادة", bk1b: "صدّر كل بياناتك إلى ملف واستوردها من جديد على أي جهاز.",
      dn1t: "ادعم محاسبة", dn1b: "إن نفعك التطبيق، فتبرعك يساعده على النمو.",
      in1t: "ثبّت التطبيق", in1b: "أضف محاسبة إلى الشاشة الرئيسية ليفتح كتطبيق عادي، حتى دون إنترنت.",
      h4t: "تصفية المهام", h4b: "بدّل بين كل المهام والنشطة والمكتملة.",
      t1t: "لوحة القيادة", t1b: "رصيد نقاطك وسلسلة التزامك ورسم تقدّمك في مكان واحد.",
      t2t: "أضف مكافأة أو خصمًا", t2b: "فعلت خيرًا ليس من عاداتك، أو حصل تقصير؟ سجّله هنا يدويًا.",
      t3t: "قائمة اليوم", t3b: "سجّل إنجاز عاداتك قبل موعدها، واكتب مهامك السريعة هنا.",
      t4t: "أنشئ عادة", t4b: "حدّد النقاط والموعد وأيام التكرار. العادة الفائتة تُخصم نقاطها تلقائيًا.",
      t5t: "السجل", t5b: "كل مكافأة وخصم وإنجاز بوقته الدقيق، ويمكنك البحث فيه أيضًا.",
      t6t: "الإعدادات", t6b: "أوقات الصلاة والتذكيرات واليوميات واللغة والمظهر والنسخ الاحتياطي هنا.",
      t7t: "كل شيء جاهز!", t7b: "بارك الله في عاداتك. يمكنك إعادة هذا الدليل في أي وقت من الإعدادات.",
      h1t: "محاسبة Pro", h1b: "افتح التخصيص الكامل والنسخ الاحتياطي التلقائي إلى Google Drive وقفل التطبيق والشعار الذهبي.",
      h2t: "أوقات الصلاة", h2b: "العادات المرتبطة بالصلاة تستخدم وقت الصلاة الحقيقي في موقعك موعدًا لها.",
      h3t: "التحليلات", h3b: "ملخصات أسبوعية وشهرية، ورسم يومي للنقاط، وإحصاءات لكل عادة.",
      panelTitle: "دليل التطبيق", panelSub: "شاهد التعريف وجولة الميزات مجددًا، أو أعد إظهار تلميحات الميزات.",
      replay: "إعادة الدليل", tips: "إظهار التلميحات مجددًا", tipsOn: "عادت التلميحات. ابحث عن النقاط النابضة."
    }
  };
  function lang() {
    var l = window.MHSLocale || document.documentElement.lang || "en";
    if (window.MHSI18n && window.MHSI18n.base) return window.MHSI18n.base(l);
    return T[l] ? l : "en";
  }
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k]; }

  var SLIDES = [
    { kind: "lang", icon: "🌐", t: "lt", b: "lb" },
    { icon: "🌙", t: "s1t", b: "s1b" },
    { icon: "⏰", t: "s2t", b: "s2b" },
    { icon: "📈", t: "s3t", b: "s3b" },
    { icon: "📖", t: "s5t", b: "s5b" },
    { icon: "🔒", t: "s4t", b: "s4b" },
    { kind: "loc", icon: "📍", t: "pt", b: "pb" },
    { kind: "notif", icon: "🔔", t: "nt", b: "nb" }
  ];
  var FIRST_PERMISSION = 6; // "Skip" on the intro slides jumps here: permissions are still offered.
  /* Each step opens its tab, then spotlights the target (or the tab button if the target isn't there).
   * Optional steps are left out when their target isn't on screen (no habits yet, not installable…). */
  var STEPS = [
    { tab: "dashboard", sel: '[data-tour="nav-dashboard"]', t: "t1t", b: "t1b" },
    { tab: "dashboard", sel: ".mhs-pro-btn", t: "p1t", b: "p1b", optional: true },
    { tab: "dashboard", sel: '[data-tour="add-reward"]', t: "t2t", b: "t2b" },
    { tab: "dashboard", sel: '[data-tour="point-flow"]', t: "c1t", b: "c1b", optional: true },
    { tab: "dashboard", sel: "mhs-insights", t: "h3t", b: "h3b", optional: true },
    { tab: "dashboard", sel: ".mhs-journal-fab--cal", t: "j1t", b: "j1b", optional: true },
    { tab: "dashboard", sel: ".mhs-journal-fab:not(.mhs-journal-fab--cal)", t: "f1t", b: "f1b", optional: true },
    { tab: "today", sel: '[data-tour="quick-todo"]', t: "t3t", b: "t3b" },
    { tab: "habits", sel: '[data-tour="new-habit"]', t: "t4t", b: "t4b" },
    { tab: "habits", sel: '[data-tour="essentials"]', t: "e1t", b: "e1b", optional: true },
    { tab: "habits", sel: "mhs-waqt", t: "h2t", b: "h2b", optional: true },
    { tab: "ledger", sel: '[data-tour="ledger-search"]', t: "t5t", b: "t5b" },
    { tab: "settings", sel: '[data-tour="nav-settings"]', t: "t6t", b: "t6b" },
    { tab: "settings", sel: '[data-tour="theme"]', t: "th1t", b: "th1b", optional: true },
    { tab: "settings", sel: "mhs-prayer", t: "pr1t", b: "pr1b", optional: true },
    { tab: "settings", sel: "mhs-remind", t: "rm1t", b: "rm1b", optional: true },
    { tab: "settings", sel: "mhs-pro-tools", t: "pt1t", b: "pt1b", optional: true },
    { tab: "settings", sel: "mhs-backup", t: "bk1t", b: "bk1b", optional: true },
    { tab: "dashboard", sel: "#mhs-donate-pill", t: "dn1t", b: "dn1b", optional: true },
    { tab: "dashboard", sel: "#mhs-install-bar.show", t: "in1t", b: "in1b", optional: true },
    { tab: "dashboard", sel: null, t: "t7t", b: "t7b" }
  ];
  var HOTSPOTS = [
    { id: "pro", sel: ".mhs-pro-btn", t: "h1t", b: "h1b" },
    { id: "todo-filter", sel: '[data-tour="todo-filter"]', t: "h4t", b: "h4b" }
  ];

  /* ---------- progress ---------- */
  function read() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === "object") return s; } catch (e) {} return {}; }
  function write(patch) { var s = Object.assign(read(), patch); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} return s; }

  /* ---------- helpers ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined) return;
      if (k === "on") Object.keys(attrs.on).forEach(function (ev) { n.addEventListener(ev, attrs.on[ev]); });
      else if (k === "text") n.textContent = attrs.text;
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function visible(node) {
    if (!node || !node.isConnected) return false;
    var r = node.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    var cs = getComputedStyle(node);
    return cs.visibility !== "hidden" && cs.display !== "none";
  }
  function find(sel) {
    var all = document.querySelectorAll(sel);
    for (var k = 0; k < all.length; k++) if (visible(all[k])) return all[k];
    return null;
  }
  function openTab(tab) {
    var b = find('[data-tour="nav-' + tab + '"]');
    if (b && b.getAttribute("aria-current") !== "page") b.click();
  }
  function frames(n, fn) { if (n <= 0) return fn(); requestAnimationFrame(function () { frames(n - 1, fn); }); }
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var busy = false; // intro or tour on screen

  /* ---------- 1. intro slides ---------- */
  function intro(then) {
    busy = true; hideDots();
    var at = 0, prevFocus = document.activeElement;
    var root = el("div", { class: "mhs-ftue-intro", role: "dialog", "aria-modal": "true", "aria-label": t("introLabel"), dir: document.documentElement.dir || "ltr" });
    function finish(tour) {
      write({ intro: 1 });
      root.classList.add("is-leaving");
      setTimeout(function () { root.remove(); busy = false; if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) {} then(tour); }, reduced ? 0 : 220);
      document.removeEventListener("keydown", key, true);
    }
    function key(e) {
      var typing = e.target && e.target.tagName === "INPUT";
      if (e.key === "Escape" && typing && e.target.value) return;
      if (e.key === "Escape") { e.preventDefault(); write({ tour: 1 }); finish(false); }
      else if (!typing && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        var fwd = (e.key === "ArrowRight") !== (document.documentElement.dir === "rtl");
        go(at + (fwd ? 1 : -1));
      }
    }
    function go(n) { if (n < 0 || n >= SLIDES.length) return; at = n; render(); }
    var sx = null;
    root.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) < 50) return;
      var fwd = (dx < 0) !== (document.documentElement.dir === "rtl");
      go(at + (fwd ? 1 : -1));
    });
    /* Permission state: "prompt" | "asking" | "granted" | "denied" | "unsupported" | "error". */
    var perm = { loc: "prompt", notif: "prompt" }, query = "";
    var P = window.MHSPrayer, R = window.MHSRemind;
    if (P && P.locationState) P.locationState().then(function (v) { perm.loc = v; if (SLIDES[at].kind === "loc") render(); }, function () {});
    else if (!navigator.geolocation) perm.loc = "unsupported";
    var ns = R ? R.state() : ("Notification" in window ? Notification.permission : "unsupported");
    perm.notif = ns === "default" ? "prompt" : ns;
    function ask(kind) {
      perm[kind] = "asking"; render();
      var job = kind === "loc"
        ? (P && P.enableLocation ? P.enableLocation() : Promise.resolve(navigator.geolocation ? "error" : "unsupported"))
        : (R ? R.enable() : ("Notification" in window ? Promise.resolve(Notification.requestPermission()).then(function (v) { return v === "default" ? "prompt" : v; }) : Promise.resolve("unsupported")));
      job.then(function (v) { perm[kind] = v || "error"; }, function () { perm[kind] = "error"; }).then(function () { if (root.isConnected) render(); });
    }
    function permBlock(kind) {
      var state = perm[kind], label = kind === "loc" ? t("allowLoc") : t("allowNotif");
      var kids = [];
      if (state === "granted") kids.push(el("div", { class: "mhs-ftue-ok", role: "status", text: t("allowed") }));
      else if (state === "denied" || state === "unsupported") kids.push(el("div", { class: "mhs-ftue-warn", role: "status", text: t(state) }));
      else {
        kids.push(el("button", { type: "button", class: "mhs-ftue-btn primary mhs-ftue-allow", disabled: state === "asking" ? "" : null, text: state === "asking" ? t("asking") : label, on: { click: function () { ask(kind); } } }));
        if (state === "error") kids.push(el("div", { class: "mhs-ftue-warn", role: "status", text: t("error") }));
      }
      kids.push(el("small", { class: "mhs-ftue-note", text: t("optional") }));
      return el("div", { class: "mhs-ftue-perm" }, kids);
    }
    function chooseLang(code) {
      if (window.MHSSetLanguage) window.MHSSetLanguage(code);
      else if (window.MHSI18n) window.MHSI18n.set(code);
      // Let the app apply the language (and text direction) before drawing the slide again.
      setTimeout(function () { root.setAttribute("dir", document.documentElement.dir || "ltr"); render(); }, 120);
    }
    function langBlock() {
      var I = window.MHSI18n, cur = window.MHSLocale || "en";
      var all = I ? I.list() : [{ code: "en", name: "English", english: "English" }, { code: "bn", name: "বাংলা", english: "Bangla" }, { code: "ar", name: "العربية", english: "Arabic" }];
      var device = I && I.deviceLanguage ? I.deviceLanguage() : null;
      var top = [device, "en", "bn", "ar"].filter(function (c, k, a) { return c && a.indexOf(c) === k; });
      all.sort(function (x, y) {
        var a = top.indexOf(x.code), b = top.indexOf(y.code);
        if (a >= 0 || b >= 0) return (a < 0 ? 99 : a) - (b < 0 ? 99 : b);
        return x.english.localeCompare(y.english);
      });
      var norm = function (v) { return String(v || "").toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
      var list = el("div", { class: "mhs-ftue-langs notranslate", translate: "no", role: "listbox", "aria-label": t("lt") });
      function fill() {
        var q = norm(query.trim()), n = 0;
        list.replaceChildren();
        all.forEach(function (x) {
          if (q && [x.name, x.english, x.code].map(norm).join(" ").indexOf(q) < 0) return;
          n++;
          var on = x.code === cur;
          list.appendChild(el("button", { type: "button", role: "option", class: "mhs-ftue-lang" + (on ? " on" : ""), "aria-selected": on ? "true" : "false", lang: x.code, dir: I && I.isRtl(x.code) ? "rtl" : "ltr", on: { click: function () { chooseLang(x.code); } } }, [
            el("span", { class: "mhs-ftue-lang-name", text: x.name }),
            x.english !== x.name ? el("small", { text: x.english }) : null,
            x.code === device ? el("em", { text: t("device") }) : null,
            on ? el("b", { "aria-hidden": "true", text: "✓" }) : null
          ]));
        });
        if (!n) list.appendChild(el("p", { class: "mhs-ftue-note", text: t("noLang") }));
      }
      var input = el("input", { type: "search", class: "mhs-ftue-search", placeholder: t("search"), "aria-label": t("search"), autocomplete: "off", on: { input: function () { query = input.value; fill(); } } });
      input.value = query;
      fill();
      return el("div", { class: "mhs-ftue-langbox" }, [input, list]);
    }
    function render() {
      var s = SLIDES[at], last = at === SLIDES.length - 1;
      var dots = el("div", { class: "mhs-ftue-dots", role: "tablist" });
      SLIDES.forEach(function (_, k) {
        dots.appendChild(el("button", { type: "button", role: "tab", class: k === at ? "on" : "", "aria-selected": k === at ? "true" : "false", "aria-label": (k + 1) + " / " + SLIDES.length, on: { click: function () { go(k); } } }));
      });
      var extra = s.kind === "lang" ? langBlock() : s.kind ? permBlock(s.kind) : null;
      var card = el("div", { class: "mhs-ftue-card" + (s.kind === "lang" ? " is-lang" : "") }, [
        el("div", { class: "mhs-ftue-top" }, [
          el("img", { src: "/icons/logo.webp", alt: "", width: "36", height: "36", class: "mhs-ftue-logo" }),
          last ? null : el("button", { type: "button", class: "mhs-ftue-link", text: t("skip"), on: { click: function () { go(at < FIRST_PERMISSION ? FIRST_PERMISSION : at + 1); } } })
        ]),
        el("div", { class: "mhs-ftue-slide" + (s.kind === "lang" ? " is-compact" : ""), "aria-live": "polite" }, [
          el("div", { class: "mhs-ftue-art", "aria-hidden": "true", text: s.icon }),
          el("h2", { id: "mhs-ftue-h", text: t(s.t) }),
          el("p", { text: t(s.b) }),
          extra
        ]),
        dots,
        el("div", { class: "mhs-ftue-actions" + (last ? " is-final" : "") }, last ? [
          el("button", { type: "button", class: "mhs-ftue-btn " + (perm.notif === "prompt" || perm.notif === "error" ? "ghost" : "primary"), text: t("startTour"), on: { click: function () { finish(true); } } }),
          el("button", { type: "button", class: "mhs-ftue-btn ghost", text: t("explore"), on: { click: function () { write({ tour: 1 }); finish(false); } } })
        ] : [
          at > 0 ? el("button", { type: "button", class: "mhs-ftue-btn ghost", text: t("back"), on: { click: function () { go(at - 1); } } }) : el("span"),
          el("button", { type: "button", class: "mhs-ftue-btn " + (s.kind === "loc" && (perm.loc === "prompt" || perm.loc === "error") ? "ghost mhs-ftue-next" : "primary mhs-ftue-next"), text: t("next"), on: { click: function () { go(at + 1); } } })
        ])
      ]);
      root.setAttribute("aria-label", t("introLabel"));
      var had = root.contains(document.activeElement) && document.activeElement.classList.contains("mhs-ftue-search");
      root.replaceChildren(card);
      if (had) { var f = card.querySelector(".mhs-ftue-search"); f.focus({ preventScroll: true }); }
      else { var p = card.querySelector(".mhs-ftue-allow:not([disabled])") || card.querySelector(".mhs-ftue-actions .mhs-ftue-btn.primary") || card.querySelector(".mhs-ftue-next"); if (p) p.focus({ preventScroll: true }); }
    }
    render();
    document.body.appendChild(root);
    document.addEventListener("keydown", key, true);
  }

  /* ---------- 2. guided tour (coach marks) ---------- */
  function tour(onEnd) {
    busy = true; hideDots();
    var at = 0, target = null, dead = false;
    var layer = el("div", { class: "mhs-coach", dir: document.documentElement.dir || "ltr" });
    var hole = el("div", { class: "mhs-coach-hole", "aria-hidden": "true" });
    var tip = el("div", { class: "mhs-coach-tip", role: "dialog", "aria-modal": "true", "aria-label": t("tourLabel"), "aria-labelledby": "mhs-coach-h" });
    layer.appendChild(hole); layer.appendChild(tip);
    layer.addEventListener("click", function (e) { if (e.target === layer || e.target === hole) e.stopPropagation(); });
    document.body.appendChild(layer);

    function end() {
      if (dead) return; dead = true;
      write({ tour: 1 });
      document.removeEventListener("keydown", key, true);
      window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true);
      layer.classList.add("is-leaving");
      setTimeout(function () { layer.remove(); busy = false; openTab("dashboard"); window.scrollTo({ top: 0, behavior: "instant" }); if (onEnd) onEnd(); }, reduced ? 0 : 200);
    }
    function key(e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); end(); }
      else if (e.key === "ArrowRight" || e.key === "Enter" && e.target === document.body) { e.preventDefault(); go(at + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
    }
    var dir = 1;
    function go(n) {
      if (n < 0) return;
      if (n >= STEPS.length) return end();
      dir = n < at ? -1 : 1;
      at = n; show();
    }
    function show() {
      var s = STEPS[at];
      openTab(s.tab);
      tip.classList.remove("is-in");
      // Wait for the tab to render before measuring.
      setTimeout(function () {
        if (dead) return;
        target = s.sel ? find(s.sel) : null;
        // An optional feature that isn't here right now: move on in the same direction.
        if (s.sel && !target && s.optional) { var n = at + dir; return n < 0 ? go(at + 1) : go(n); }
        if (s.sel && !target) target = find('[data-tour="nav-' + s.tab + '"]');
        if (target) {
          var r = target.getBoundingClientRect();
          if (r.top < 70 || r.bottom > innerHeight - 90) target.scrollIntoView({ block: "center", behavior: "instant" });
        } else window.scrollTo({ top: 0, behavior: "instant" });
        render(); frames(2, function () { place(); tip.classList.add("is-in"); });
      }, 180);
    }
    function render() {
      var s = STEPS[at], last = at === STEPS.length - 1;
      tip.replaceChildren(
        el("div", { class: "mhs-coach-arrow", "aria-hidden": "true" }),
        el("div", { class: "mhs-coach-step", role: "progressbar", "aria-valuemin": "1", "aria-valuemax": String(STEPS.length), "aria-valuenow": String(at + 1), "aria-label": t("tourLabel") }, [
          el("span", { style: "width:" + Math.round((at + 1) / STEPS.length * 100) + "%" })
        ]),
        el("h3", { id: "mhs-coach-h", text: t(s.t) }),
        el("p", { text: t(s.b) }),
        el("div", { class: "mhs-coach-actions" }, [
          last ? el("span") : el("button", { type: "button", class: "mhs-ftue-link", text: t("skip"), on: { click: end } }),
          el("div", { class: "mhs-coach-nav" }, [
            at > 0 && !last ? el("button", { type: "button", class: "mhs-ftue-btn ghost sm", text: t("back"), on: { click: function () { go(at - 1); } } }) : null,
            el("button", { type: "button", class: "mhs-ftue-btn primary sm", text: last ? t("done") : t("next"), on: { click: function () { go(at + 1); } } })
          ])
        ])
      );
      tip.classList.toggle("is-center", !target);
      var p = tip.querySelector(".mhs-ftue-btn.primary"); if (p) p.focus({ preventScroll: true });
    }
    function place() {
      if (dead) return;
      var vw = innerWidth, vh = innerHeight, pad = 6;
      var w = Math.min(330, vw - 24);
      tip.style.width = w + "px";
      if (!target || !target.isConnected) {
        hole.style.cssText = "left:50%;top:50%;width:0;height:0;";
        tip.setAttribute("data-arrow", "none");
        tip.style.left = Math.round((vw - w) / 2) + "px";
        tip.style.top = Math.max(12, Math.round((vh - tip.offsetHeight) / 2)) + "px";
        return;
      }
      var r = target.getBoundingClientRect();
      var x = Math.max(4, r.left - pad), y = Math.max(4, r.top - pad);
      var hw = Math.min(vw - 8, r.right + pad) - x, hh = Math.min(vh - 8, r.bottom + pad) - y;
      hole.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + hw + "px;height:" + hh + "px;";
      var th = tip.offsetHeight, gap = 14;
      var below = vh - (y + hh), above = y, top, dir;
      if (below >= th + gap + 8) { top = y + hh + gap; dir = "up"; }
      else if (above >= th + gap + 8) { top = y - gap - th; dir = "down"; }
      else { top = Math.max(12, vh - th - 12); dir = "none"; }
      var cx = r.left + r.width / 2;
      var left = Math.min(Math.max(12, cx - w / 2), vw - w - 12);
      // Narrow side targets (desktop sidebar): put the bubble beside them instead.
      if (dir === "none" && r.right + gap + w < vw - 8) { left = r.right + gap; top = Math.min(Math.max(12, r.top + r.height / 2 - th / 2), vh - th - 12); dir = "left"; }
      tip.style.left = Math.round(left) + "px";
      tip.style.top = Math.round(top) + "px";
      tip.setAttribute("data-arrow", dir);
      var arrow = tip.querySelector(".mhs-coach-arrow");
      if (arrow) {
        if (dir === "left") { arrow.style.left = ""; arrow.style.top = Math.round(Math.min(Math.max(16, r.top + r.height / 2 - top), th - 16)) + "px"; }
        else { arrow.style.top = ""; arrow.style.left = Math.round(Math.min(Math.max(18, cx - left), w - 18)) + "px"; }
      }
    }
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("keydown", key, true);
    show();
  }

  /* ---------- 3. hotspots + tooltips ---------- */
  var dots = {}, pop = null, dotTimer = null;
  function hideDots() { Object.keys(dots).forEach(function (id) { dots[id].hidden = true; }); closePop(); }
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function modalOpen() {
    return document.body.style.overflow === "hidden" || !!document.querySelector(".mhs-ftue-intro, .mhs-coach, [role=dialog][aria-modal=true]");
  }
  function seenTip(id) { var s = read(); s.tips = s.tips || {}; s.tips[id] = 1; write({ tips: s.tips }); }
  function openPop(h, dot) {
    closePop();
    var card = el("div", { class: "mhs-tooltip", role: "tooltip", id: "mhs-tip-" + h.id, dir: document.documentElement.dir || "ltr" }, [
      el("b", { text: t(h.t) }), el("p", { text: t(h.b) }),
      el("button", { type: "button", class: "mhs-ftue-btn primary sm", text: t("gotIt"), on: { click: function () { seenTip(h.id); closePop(); updateDots(); } } })
    ]);
    document.body.appendChild(card); pop = card;
    var r = dot.getBoundingClientRect(), w = Math.min(260, innerWidth - 24);
    card.style.width = w + "px";
    var top = r.bottom + 10;
    if (top + card.offsetHeight > innerHeight - 12) top = Math.max(12, r.top - 10 - card.offsetHeight);
    card.style.top = Math.round(top) + "px";
    card.style.left = Math.round(Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12)) + "px";
    card.querySelector("button").focus({ preventScroll: true });
  }
  function updateDots() {
    var s = read();
    var on = s.intro && s.tour && !busy && !modalOpen();
    HOTSPOTS.forEach(function (h) {
      var dot = dots[h.id];
      var target = on && !(s.tips && s.tips[h.id]) ? find(h.sel) : null;
      if (!target) { if (dot) dot.hidden = true; if (pop && pop.id === "mhs-tip-" + h.id) closePop(); return; }
      var r = target.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) { if (dot) dot.hidden = true; return; }
      if (!dot) {
        dot = dots[h.id] = el("button", { type: "button", class: "mhs-hotspot", "aria-label": t(h.t), "aria-describedby": "mhs-tip-" + h.id, on: { click: function (e) { e.stopPropagation(); pop && pop.id === "mhs-tip-" + h.id ? closePop() : openPop(h, dot); } } }, [el("span")]);
        document.body.appendChild(dot);
      }
      dot.setAttribute("aria-label", t(h.t));
      dot.hidden = false;
      var rtl = document.documentElement.dir === "rtl";
      dot.style.top = Math.round(Math.max(2, r.top - 6)) + "px";
      dot.style.left = Math.round(rtl ? r.left - 6 : r.right - 14) + "px";
    });
  }
  function startDots() {
    if (dotTimer) return;
    dotTimer = setInterval(function () { if (!document.hidden) updateDots(); }, 800);
    window.addEventListener("scroll", function () { requestAnimationFrame(updateDots); }, true);
    window.addEventListener("resize", updateDots);
    document.addEventListener("click", function (e) { if (pop && !pop.contains(e.target)) closePop(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
    updateDots();
  }

  /* ---------- flow ---------- */
  function run() {
    if (busy) return;
    var s = read();
    if (!s.intro) return intro(function (go) { if (go) tour(startDots); else startDots(); });
    if (!s.tour) return tour(startDots);
    startDots();
  }
  /* The app flags a new install (window.MHSFirstRun); the onboarding then starts once the
   * app is on screen. Progress is saved, so a half-finished onboarding resumes next launch. */
  function watchFirstRun() {
    var s = read();
    if (s.firstRun && s.intro && s.tour) return startDots();
    var started = false;
    function maybeStart() {
      if (started) return;
      if (busy) { started = true; mo.disconnect(); return; } // replayed from Settings
      if (!find('[data-tour^="nav-"]')) return;
      started = true; mo.disconnect();
      if (window.MHSFirstRun && !read().firstRun) write({ firstRun: 1 });
      if (!read().firstRun) return; // existing users: no automatic onboarding
      setTimeout(run, 200);
    }
    var mo = new MutationObserver(maybeStart);
    mo.observe(document.body, { childList: true, subtree: true });
    maybeStart();
  }

  /* ---------- Settings panel ---------- */
  var Base = window.HTMLElement || function () {};
  class MhsTour extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render(note) {
      var self = this;
      var root = el("div", { class: "panel mhs-panel mhs-tour-panel", dir: document.documentElement.dir || "ltr" }, [
        el("div", { class: "mhs-head" }, [
          el("h3", { class: "mhs-title", text: "🧭 " + t("panelTitle") }),
          el("p", { class: "mhs-muted", text: t("panelSub") })
        ]),
        el("div", { class: "mhs-actions" }, [
          el("button", { type: "button", class: "mhs-btn primary", text: t("replay"), on: { click: function () { window.MHSTour.replay(); } } }),
          el("button", { type: "button", class: "mhs-btn", text: t("tips"), on: { click: function () { window.MHSTour.resetTips(); self.render(t("tipsOn")); } } })
        ]),
        note ? el("div", { class: "mhs-status", role: "status", text: note }) : null
      ]);
      this.replaceChildren(root);
    }
  }
  if (window.customElements && !customElements.get("mhs-tour")) customElements.define("mhs-tour", MhsTour);

  window.MHSTour = {
    replay: function () {
      if (busy) return;
      write({ firstRun: 1, intro: 0, tour: 0 });
      window.scrollTo(0, 0);
      intro(function (go) { if (go) tour(startDots); else startDots(); });
    },
    tour: function () { if (!busy) tour(startDots); },
    resetTips: function () { write({ tips: {}, intro: 1, tour: 1 }); startDots(); updateDots(); }
  };

  if (document.body) watchFirstRun(); else document.addEventListener("DOMContentLoaded", watchFirstRun);
})();
