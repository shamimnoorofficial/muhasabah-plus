/* Muhasabah Plus — Million-Dollar Onboarding & User Guide Engine.
 * Provides the interactive Play Store / App Store caliber first-time onboarding walkthrough:
 * - Guidelines & Islamic Core Philosophy
 * - Language Selection (বাংলা / English / العربية)
 * - Location Setup & Offline Prayer Times (GPS / Districts / Hanafi & Shafi'i)
 * - Essential Habits Customization (Salah, Quran, Adhkar, Tahajjud, Avoiding Sins)
 * - Notification Permissions & Reminders
 * - Guided Tour & Launch with Bismillah
 */
(function () {
  "use strict";

  var I18N = {
    bn: {
      appName: "মুহাসাবাহ প্লাস",
      tagline: "ইসলামিক আত্মপর্যালোচনা ও স্বভাব গঠন প্ল্যাটফর্ম",
      stepOf: "ধাপ {s} / ৬",
      back: "পূর্ববর্তী",
      next: "পরবর্তী ➔",
      startBtn: "বিসমিল্লাহ বলে শুরু করুন 🚀",
      // Step 1
      s1Title: "মুহাসাবাহ প্লাসে স্বাগতম",
      s1Sub: "আপনার সময় আপনার আখিরাতের পুঁজী — প্রতিটি মুহূর্তের হিসাব রাখুন।",
      quoteAr: "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا",
      quoteTr: "«তোমরা নিজেদের হিসাব নিজেরা নাও, চূড়ান্ত হিসাব গ্রহণের পূর্বে। এবং নিজেদের আমল ওজন করো, তা পরিমাপ করার পূর্বে।» — হযরত উমর (রা.)",
      f1T: "নামাজের ওয়াক্ত ও তাহরীম",
      f1D: "ভৌগোলিক অবস্থানের ভিত্তিতে ৫ ওয়াক্ত ও নিষিদ্ধ সময়ের নিখুঁত অফলাইন হিসাব।",
      f2T: "আমল ও পয়েন্ট লেজার",
      f2D: "নেক আমলে পয়েন্ট লাভ, অবহেলায় কর্তন — ট্রেডিং স্টাইল গ্রাফ ও ধারাবাহিকতা।",
      f3T: "ওয়াক্তের রিমাইন্ডার",
      f3D: "ওয়াক্ত শেষ হওয়ার আগে সতর্কতা ও রাত ৯টায় দৈনিক মুহাসাবা নোটিফিকেশন।",
      f4T: "১০০% গোপনীয় ও অফলাইন",
      f4D: "কোনো অ্যাকাউন্ট বা ক্লাউড সার্ভারের প্রয়োজন নেই, সব ডেটা আপনার ডিভাইসেই থাকবে।",
      // Step 2
      s2Title: "আপনার ভাষা নির্বাচন করুন",
      s2Sub: "অ্যাপের সমস্ত লেখা, সংখ্যা ও ইসলামিক পরিভাষা এই ভাষায় প্রদর্শিত হবে:",
      recBadge: "প্রস্তাবিত",
      langBn: "বাংলা",
      langBnSub: "সম্পূর্ণ বাংলা ইন্টারফেস, বাংলা সংখ্যা ও ক্যালেন্ডার",
      langEn: "English",
      langEnSub: "Clean global interface and Islamic terminology",
      langAr: "العربية",
      langArSub: "واجهة إسلامية كاملة باللغة العربية الفصحى",
      // Step 3
      s3Title: "অবস্থান ও নামাজের ওয়াক্ত",
      s3Sub: "সঠিক ওয়াক্ত ও কিবলা গণনার জন্য আপনার অবস্থান প্রয়োজন (সম্পূর্ণ অফলাইন):",
      gpsBtn: "📍 স্বয়ংক্রিয় GPS অবস্থান সনাক্ত করুন",
      gpsDetecting: "সনাক্ত করা হচ্ছে…",
      gpsSuccess: "✓ অবস্থান সনাক্ত হয়েছে: {p}",
      gpsFail: "GPS পাওয়া যায়নি, অনুগ্রহ করে নিচে শহর নির্বাচন করুন",
      cityLabel: "অথবা জেলা/শহর বাছাই করুন:",
      asrLabel: "আসর নামাজের ওয়াক্ত হিসাব:",
      hanafi: "হানাফী (বাংলাদেশে প্রচলিত — ছায়া দ্বিগুণ)",
      shafii: "শাফেঈ / সাধারণ (ছায়া সমপরিমাণ)",
      previewTitle: "আজকের নামাজের ওয়াক্ত:",
      fajr: "ফজর",
      dhuhr: "যোহর",
      asr: "আসর",
      maghrib: "মাগরিব",
      isha: "এশা",
      // Step 4
      s4Title: "প্রয়োজনীয় প্রারম্ভিক আমল নির্বাচন",
      s4Sub: "মুহাসাবাহ শুরু করতে আপনার পছন্দের আমলগুলো টিক দিন (পরবর্তীতে পরিবর্তনযোগ্য):",
      h1: "৫ ওয়াক্ত নামাজ জামাতে আদায়",
      h1Sub: "ফরজ • ওয়াক্তভিত্তিক",
      h2: "দৈনিক কুরআন তিলাওয়াত (কমপক্ষে ১ রুকূ)",
      h2Sub: "ওয়াজিব/সুন্নত • মাগরিবের পূর্বে",
      h3: "সকাল ও সন্ধ্যার মাসনূন জিকির-আযকার",
      h3Sub: "সুন্নত • ফজর ও আসরের পর",
      h4: "তাহাজ্জুদ সালাত ও ইস্তিগফার",
      h4Sub: "নফল • ফজরের পূর্বে",
      h5: "চোখ-কান-জিহ্বার হেফাজত ও অনর্থক কাজ বর্জন",
      h5Sub: "ফরজ • এশার পূর্বে",
      h6: "দৈনিক ইস্তিগফার ও ১০০ বার দরূদ পাঠ",
      h6Sub: "সুন্নত • সারাদিন",
      graceLabel: "গ্রেস পিরিয়ড (সময় পেরোনোর পর কতক্ষণ ছাড় পাবেন):",
      min10: "১০ মিনিট (প্রস্তাবিত)",
      min15: "১৫ মিনিট",
      min30: "৩০ মিনিট",
      // Step 5
      s5Title: "নোটিফিকেশন ও ওয়াক্তের রিমাইন্ডার",
      s5Sub: "ওয়াক্ত শেষ হওয়ার আগে এবং আত্মসমালোচনার জন্য সময়মতো সতর্কতা পান:",
      notifR1: "🔔 ওয়াক্তের শেষ সময় সতর্কতা: ওয়াক্ত ছুটে যাওয়ার ১৫ মিনিট পূর্বে সংকেত",
      notifR2: "🌅 সকাল-সন্ধ্যার আমল: ফজর ও আসরের পর মাসনূন জিকিরের তাগিদ",
      notifR3: "🌙 রাত ৯টায় দৈনিক মুহাসাবাহ: সারাদিনের আমলের হিসাব মিলিয়ে ঘুমাতে যাওয়া",
      allowNotifBtn: "🔔 নোটিফিকেশন চালু করুন",
      notifGranted: "✅ নোটিফিকেশন সফলভাবে সক্রিয় করা হয়েছে!",
      notifDenied: "⚠️ নোটিফিকেশন বন্ধ আছে। ব্রাউজার বা ফোন সেটিংসে গিয়ে এলাও করতে পারেন।",
      skipNotif: "পরে চালু করব (এড়িয়ে যান)",
      // Step 6
      s6Title: "মাশাআল্লাহ! আপনি প্রস্তুত",
      s6Sub: "আপনার মুহাসাবাহ প্লাস সফলভাবে সেটআপ হয়েছে। যাত্রা শুরুর পূর্বে ৩টি টিপস:",
      t1Title: "১. 'Today' ট্যাবে প্রতিদিনের হিসাব রাখুন",
      t1Desc: "আমল শেষ হলে সাথে সাথে টিক চিহ্ন দিন এবং সময় পেরোনোর আগেই সম্পন্ন করুন।",
      t2Title: "২. 'Dashboard'-এ পয়েন্ট ও ধারাবাহিকতা ট্র্যাক করুন",
      t2Desc: "ক্যান্ডেলস্টিক চার্টে আপনার আত্মিক উন্নতি লক্ষ্য করুন এবং ধারাবাহিকতা ধরে রাখুন।",
      t3Title: "৩. 'Settings'-এ ডেটা ব্যাকআপ রাখুন",
      t3Desc: "আপনার সমস্ত তথ্য শুধুমাত্র এই ফোনেই থাকে। এক চাপে যেকোনো সময় ব্যাকআপ ফাইল ডাউনলোড করুন।"
    },
    en: {
      appName: "Muhasabah Plus",
      tagline: "Islamic Habit Tracker & Self-Accountability",
      stepOf: "Step {s} of 6",
      back: "Back",
      next: "Next ➔",
      startBtn: "Launch with Bismillah 🚀",
      s1Title: "Welcome to Muhasabah Plus",
      s1Sub: "Your time is your ultimate provision for the Akhirah — count every breath.",
      quoteAr: "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا",
      quoteTr: "“Take account of yourselves before you are called to account, and weigh your deeds before they are weighed for you.” — Umar ibn al-Khattab (RA)",
      f1T: "Accurate Prayer & Forbidden Waqt",
      f1D: "Offline astronomical computation for 5 daily prayers and tahrim times.",
      f2T: "Habit Ledger & Trading Graph",
      f2D: "Earn points for fulfilled habits, automated penalties for slips.",
      f3T: "Timely Deadline Reminders",
      f3D: "PWA alerts before waqt expires and 9 PM evening Muhasabah review.",
      f4T: "100% Private & Fully Offline",
      f4D: "Zero tracking, no mandatory cloud login. All records stay solely on this device.",
      s2Title: "Choose Your Interface Language",
      s2Sub: "All text, numbers, and dates will adapt to your preference:",
      recBadge: "Recommended",
      langBn: "বাংলা (Bengali)",
      langBnSub: "Complete Bengali interface with localized calendar & numbers",
      langEn: "English",
      langEnSub: "Clean global Islamic productivity experience",
      langAr: "العربية (Arabic)",
      langArSub: "واجهة إسلامية كاملة باللغة العربية الفصحى",
      s3Title: "Location & Prayer Calculations",
      s3Sub: "Precise coordinates enable exact prayer times on this device:",
      gpsBtn: "📍 Auto-Detect GPS Location",
      gpsDetecting: "Detecting GPS…",
      gpsSuccess: "✓ Detected: {p}",
      gpsFail: "GPS unavailable, please pick your city below",
      cityLabel: "Or select your district / city:",
      asrLabel: "Asr Juristic Calculation:",
      hanafi: "Hanafi (Standard in South Asia — Shadow × 2)",
      shafii: "Shafi'i / Standard (Shadow × 1)",
      previewTitle: "Today's Prayer Schedule:",
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
      s4Title: "Select Initial Focus Habits",
      s4Sub: "Kickstart your Muhasabah with recommended Islamic daily deeds:",
      h1: "5 Daily Prayers in Congregation",
      h1Sub: "Fard • Waqt-based",
      h2: "Daily Quran Recitation (Min 1 Ruku)",
      h2Sub: "Wajib/Sunnah • Before Maghrib",
      h3: "Morning & Evening Masnoon Adhkar",
      h3Sub: "Sunnah • Post Fajr & Asr",
      h4: "Tahajjud Prayer & Istighfar",
      h4Sub: "Nafl • Before Fajr",
      h5: "Guarding Eyes, Ears & Tongue",
      h5Sub: "Fard • Before Isha",
      h6: "Daily Istighfar & 100 Salawat",
      h6Sub: "Sunnah • All day",
      graceLabel: "Grace period after deadline expires:",
      min10: "10 minutes (Recommended)",
      min15: "15 minutes",
      min30: "30 minutes",
      s5Title: "Enable Notification Reminders",
      s5Sub: "Receive timely reminders before waqt ends and for daily muhasabah:",
      notifR1: "🔔 Waqt Expiry Warning: 15 minutes before deadline",
      notifR2: "🌅 Morning/Evening Adhkar: Gentle reminders after Fajr & Asr",
      notifR3: "🌙 9:00 PM Daily Muhasabah: Settle your daily account before sleep",
      allowNotifBtn: "🔔 Allow Notifications",
      notifGranted: "✅ Notifications successfully enabled!",
      notifDenied: "⚠️ Notifications are blocked in browser/system settings.",
      skipNotif: "Skip for now",
      s6Title: "Masha'Allah! You Are All Set",
      s6Sub: "Your Muhasabah Plus environment is configured. Three quick tips:",
      t1Title: "1. Check in on 'Today' Tab",
      t1Desc: "Mark deeds complete as soon as you finish them before the deadline.",
      t2Title: "2. Inspect Points on 'Dashboard'",
      t2Desc: "Track your candlestick progress graph and maintain your unbroken streak.",
      t3Title: "3. Backup Regularly in 'Settings'",
      t3Desc: "Everything is on your device. Export a backup anytime in 1 tap."
    },
    ar: {
      appName: "محاسبة بلس",
      tagline: "تطبيق محاسبة النفس وبناء العادات الإسلامية",
      stepOf: "خطوة {s} من ٦",
      back: "السابق",
      next: "التالي ➔",
      startBtn: "ابدأ بسم الله 🚀",
      s1Title: "مرحباً بك في محاسبة بلس",
      s1Sub: "إنما أنت أيام، فإذا ذهب يومك ذهب بعضك — اغتنم كل لحظة.",
      quoteAr: "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا",
      quoteTr: "«حاسبوا أنفسكم قبل أن تحاسبوا، وزنوا أنفسكم قبل أن توزنوا.» — عمر بن الخطاب رضي الله عنه",
      f1T: "مواقيت الصلاة وأوقات النهي",
      f1D: "حساب فلكي دقيق لخمس صلوات وأوقات التحريم دون الحاجة لإنترنت.",
      f2T: "سجل الحسنات والنقاط",
      f2D: "كسب نقاط عند أداء العبادات وخصم عند التقصير في رسم بياني كالتداول.",
      f3T: "تنبيهات قبل انتهاء الوقت",
      f3D: "إشعارات قبل نهاية أوقات الصلاة وتذكير بمحاسبة النفس الساعة ٩ مساءً.",
      f4T: "خصوصية كاملة دون إنترنت",
      f4D: "بياناتك محفوظة على هذا الجهاز فقط دون خوادم سحابية أو تتبع.",
      s2Title: "اختر لغة التطبيق",
      s2Sub: "ستظهر جميع النصوص والأرقام والمواقيت باللغة المختارة:",
      recBadge: "موصى به",
      langBn: "বাংলা (البنغالية)",
      langBnSub: "واجهة بنغالية كاملة مع التقويم والأرقام",
      langEn: "English (الإنجليزية)",
      langEnSub: "تجربة إنتاجية إسلامية عالمية",
      langAr: "العربية",
      langArSub: "واجهة إسلامية كاملة باللغة العربية الفصحى",
      s3Title: "الموقع ومواقيت الصلاة",
      s3Sub: "يلزم تحديد موقعك الجغرافي لحساب أوقات الصلاة بدقة تامة:",
      gpsBtn: "📍 تحديد الموقع تلقائياً عبر GPS",
      gpsDetecting: "جارٍ تحديد الموقع…",
      gpsSuccess: "✓ تم التحديد: {p}",
      gpsFail: "تعذر GPS، يرجى اختيار المدينة من القائمة أدناه",
      cityLabel: "أو اختر المدينة:",
      asrLabel: "مذهب حساب صلاة العصر:",
      hanafi: "حنفي (المثلين)",
      shafii: "شافعي / جمهور (المثل الأول)",
      previewTitle: "مواقيت الصلاة اليوم:",
      fajr: "الفجر",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء",
      s4Title: "اختر العادات والواجبات الأولية",
      s4Sub: "حدد العبادات التي تريد الالتزام بها لبدء المحاسبة:",
      h1: "الصلوات الخمس في جماعة",
      h1Sub: "فرض • حسب أوقات الصلاة",
      h2: "تلاوة القرآن يومياً (ركوع أو جزء)",
      h2Sub: "واجب/سنة • قبل المغرب",
      h3: "أذكار الصباح والمساء المأثورة",
      h3Sub: "سنة • بعد الفجر والعصر",
      h4: "صلاة التهجد والاستغفار بالأسحار",
      h4Sub: "نفل • قبل الفجر",
      h5: "حفظ البصر واللسان عن اللغو والغيبة",
      h5Sub: "فرض • قبل العشاء",
      h6: "الاستغفار اليومي و١٠٠ صلاة على النبي",
      h6Sub: "سنة • طوال اليوم",
      graceLabel: "فترة السماح بعد الموعد:",
      min10: "١٠ دقائق (موصى به)",
      min15: "١٥ دقيقة",
      min30: "٣٠ دقيقة",
      s5Title: "تفعيل التنبيهات والإشعارات",
      s5Sub: "تلقي تذكيرات هامة قبل فوات وقت الصلاة ومحاسبة النفس:",
      notifR1: "🔔 تنبيه قبل نهاية الوقت بـ ١٥ دقيقة",
      notifR2: "🌅 تذكير بأذكار الصباح بعد الفجر والمساء بعد العصر",
      notifR3: "🌙 محاسبة النفس اليومية الساعة ٩:٠٠ مساءً قبل النوم",
      allowNotifBtn: "🔔 تفعيل الإشعارات الآن",
      notifGranted: "✅ تم تفعيل الإشعارات بنجاح!",
      notifDenied: "⚠️ الإشعارات محظورة في إعدادات المتصفح أو الهاتف.",
      skipNotif: "تخطي الآن",
      s6Title: "ما شاء الله! كل شيء جاهز",
      s6Sub: "تم إعداد محاسبة بلس بنجاح. تذكر هذه النصائح الثلاث:",
      t1Title: "١. افتح قائمة 'اليوم' وسجّل عباداتك فور إتمامها",
      t1Desc: "اضغط على علامة الإتمام فور الانتهاء لكسب النقاط قبل فوات الموعد.",
      t2Title: "٢. راقب تقدمك وسلسلة الأيام في 'اللوحة'",
      t2Desc: "شاهد كيف ينمو رصيدك الإيماني واستمر في المحافظة على السلسلة.",
      t3Title: "٣. احفظ نسخة احتياطية في 'الإعدادات'",
      t3Desc: "جميع بياناتك على هاتفك فقط، احفظ نسخة احتياطية بضغطة زر لتبقى مطمئناً."
    }
  };

  var STARTER_HABITS = [
    { key: "h1", category: "Fard", points: 50, deadline: "23:59:00", icon: "🕌", color: "#00c853", defaultOn: true },
    { key: "h2", category: "Sunnah", points: 30, deadline: "18:00:00", icon: "📖", color: "#3b82f6", defaultOn: true },
    { key: "h3", category: "Sunnah", points: 20, deadline: "17:30:00", icon: "🌅", color: "#f59e0b", defaultOn: true },
    { key: "h4", category: "Nafl", points: 40, deadline: "04:30:00", icon: "🌙", color: "#8b5cf6", defaultOn: true },
    { key: "h5", category: "Fard", points: 25, deadline: "22:00:00", icon: "🛡️", color: "#ef4444", defaultOn: true },
    { key: "h6", category: "Sunnah", points: 15, deadline: "23:00:00", icon: "🤲", color: "#10b981", defaultOn: true }
  ];

  class MhsOnboarding extends HTMLElement {
    constructor() {
      super();
      this.step = 1;
      this.totalSteps = 6;
      this.lang = "bn";
      this.selectedHabits = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
      this.grace = 10;
      this.gpsStatus = "";
      this.notifStatus = ("Notification" in window) ? Notification.permission : "unsupported";
    }

    connectedCallback() {
      var attrLang = this.getAttribute("lang");
      if (attrLang && ["bn", "en", "ar"].includes(attrLang)) {
        this.lang = attrLang;
      } else {
        try {
          var cur = window.MHS && window.MHS.current();
          if (cur && ["bn", "en", "ar"].includes(cur.lang)) this.lang = cur.lang;
        } catch (e) {}
      }
      this.render();
    }

    t(key, vars) {
      var dict = I18N[this.lang] || I18N.bn;
      var str = dict[key] || I18N.bn[key] || key;
      if (vars) {
        Object.keys(vars).forEach(function (k) {
          str = str.replace(new RegExp("{" + k + "}", "g"), vars[k]);
        });
      }
      return str;
    }

    setLanguage(newLang) {
      this.lang = newLang;
      try {
        window.MHSLocale = newLang;
        document.documentElement.lang = newLang;
        window.dispatchEvent(new CustomEvent("mhs:lang-change", { detail: { lang: newLang } }));
      } catch (e) {}
      this.render();
    }

    nextStep() {
      if (this.step < this.totalSteps) {
        this.step++;
        this.render();
      } else {
        this.complete();
      }
    }

    prevStep() {
      if (this.step > 1) {
        this.step--;
        this.render();
      }
    }

    complete() {
      var self = this;
      // 1. Build starter habits to insert if user currently has none
      var dict = I18N[this.lang] || I18N.bn;
      var curData = (window.MHS && window.MHS.current()) || {};
      var existingHabits = Array.isArray(curData.habits) ? curData.habits : [];
      var newHabits = existingHabits.slice();

      if (newHabits.length === 0) {
        STARTER_HABITS.forEach(function (sh) {
          if (self.selectedHabits.has(sh.key)) {
            newHabits.push({
              id: "h_" + sh.key + "_" + Date.now(),
              title: dict[sh.key] || sh.key,
              category: sh.category,
              points: sh.points,
              deadline: sh.deadline,
              repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              grace: self.grace,
              autoPenalty: true,
              icon: sh.icon,
              color: sh.color,
              focus: sh.key === "h1" ? "Salah" : sh.key === "h2" ? "Quran" : "Muhasabah"
            });
          }
        });
      }

      // 2. Persist to storage
      var updated = Object.assign({}, curData, {
        lang: this.lang,
        habits: newHabits,
        onboarded: true
      });

      if (window.MHS) {
        window.MHS.save(updated);
      } else {
        try { localStorage.setItem("muhasabah:data:v1", JSON.stringify(updated)); } catch (e) {}
      }

      // 3. Dispatch completion event
      window.dispatchEvent(new CustomEvent("mhs:close-onboarding", {
        detail: {
          lang: this.lang,
          habits: newHabits,
          onboarded: true
        }
      }));

      // 4. Remove component smoothly
      this.classList.add("out");
      setTimeout(function () {
        if (self.parentNode) self.parentNode.removeChild(self);
      }, 300);
    }

    render() {
      var self = this;
      var t = function (k, v) { return self.t(k, v); };

      var container = document.createElement("div");
      container.className = "mhs-ob-backdrop";

      var card = document.createElement("div");
      card.className = "mhs-ob-card";

      // 1. Header with Brand & Progress
      var header = document.createElement("div");
      header.className = "mhs-ob-header";
      header.innerHTML = [
        '<div class="mhs-ob-brand">',
        '  <div class="mhs-ob-logo">',
        '    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>',
        '  </div>',
        '  <div class="mhs-ob-brand-text">',
        '    <h2>' + t("appName") + '</h2>',
        '    <span>' + t("tagline") + '</span>',
        '  </div>',
        '</div>',
        '<div class="mhs-ob-progress-wrap">',
        '  <div class="mhs-ob-progress-pills">',
        [1, 2, 3, 4, 5, 6].map(function (n) {
          var cls = n === self.step ? "mhs-ob-pill active" : n < self.step ? "mhs-ob-pill done" : "mhs-ob-pill";
          return '<span class="' + cls + '"></span>';
        }).join(""),
        '  </div>',
        '  <span class="mhs-ob-step-num">' + t("stepOf", { s: self.step }) + '</span>',
        '</div>'
      ].join("");
      card.appendChild(header);

      // 2. Body based on step
      var body = document.createElement("div");
      body.className = "mhs-ob-body";

      if (this.step === 1) {
        body.innerHTML = [
          '<div class="mhs-ob-title-wrap">',
          '  <h3>' + t("s1Title") + '</h3>',
          '  <p>' + t("s1Sub") + '</p>',
          '</div>',
          '<div class="mhs-ob-quote">',
          '  <div class="mhs-ob-quote-ar">' + t("quoteAr") + '</div>',
          '  <div class="mhs-ob-quote-tr">' + t("quoteTr") + '</div>',
          '</div>',
          '<div class="mhs-ob-grid">',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">🕌</span><div class="mhs-ob-item-txt"><b>' + t("f1T") + '</b><span>' + t("f1D") + '</span></div></div>',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">⚖️</span><div class="mhs-ob-item-txt"><b>' + t("f2T") + '</b><span>' + t("f2D") + '</span></div></div>',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">🔔</span><div class="mhs-ob-item-txt"><b>' + t("f3T") + '</b><span>' + t("f3D") + '</span></div></div>',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">🛡️</span><div class="mhs-ob-item-txt"><b>' + t("f4T") + '</b><span>' + t("f4D") + '</span></div></div>',
          '</div>'
        ].join("");
      } else if (this.step === 2) {
        body.innerHTML = [
          '<div class="mhs-ob-title-wrap">',
          '  <h3>' + t("s2Title") + '</h3>',
          '  <p>' + t("s2Sub") + '</p>',
          '</div>',
          '<div class="mhs-ob-lang-cards">',
          '  <div class="mhs-ob-lang-btn ' + (this.lang === "bn" ? "selected" : "") + '" data-lang="bn">',
          '    <div class="mhs-ob-lang-left"><span class="mhs-ob-flag">🇧🇩</span><div><div class="mhs-ob-lang-name">' + t("langBn") + '</div><div class="mhs-ob-lang-sub">' + t("langBnSub") + '</div></div></div>',
          '    <span class="mhs-ob-tag">' + t("recBadge") + '</span>',
          '  </div>',
          '  <div class="mhs-ob-lang-btn ' + (this.lang === "en" ? "selected" : "") + '" data-lang="en">',
          '    <div class="mhs-ob-lang-left"><span class="mhs-ob-flag">🇬🇧</span><div><div class="mhs-ob-lang-name">' + t("langEn") + '</div><div class="mhs-ob-lang-sub">' + t("langEnSub") + '</div></div></div>',
          '  </div>',
          '  <div class="mhs-ob-lang-btn ' + (this.lang === "ar" ? "selected" : "") + '" data-lang="ar">',
          '    <div class="mhs-ob-lang-left"><span class="mhs-ob-flag">🇸🇦</span><div><div class="mhs-ob-lang-name">' + t("langAr") + '</div><div class="mhs-ob-lang-sub">' + t("langArSub") + '</div></div></div>',
          '  </div>',
          '</div>'
        ].join("");
        body.querySelectorAll(".mhs-ob-lang-btn").forEach(function (btn) {
          btn.addEventListener("click", function () {
            self.setLanguage(btn.getAttribute("data-lang"));
          });
        });
      } else if (this.step === 3) {
        var pCfg = (window.MHSPrayer && window.MHSPrayer.config) ? window.MHSPrayer.config() : {};
        var currentPlace = pCfg.place || "Dhaka";
        var isHanafi = pCfg.asr !== "standard";
        var todayTimes = (window.MHSPrayer && window.MHSPrayer.day) ? window.MHSPrayer.day() : null;

        var timesHtml = "";
        if (todayTimes) {
          var hm = function (d) { return d ? (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() : "--:--"; };
          timesHtml = [
            '<div class="mhs-ob-prayer-preview">',
            '  <div style="font-size:0.75rem; color:#86efac; font-weight:600; margin-bottom:0.4rem; text-align:center;">' + t("previewTitle") + ' (' + (pCfg.place || "Dhaka") + ')</div>',
            '  <div class="mhs-ob-waqt-grid">',
            '    <div class="mhs-ob-waqt-cell"><span class="mhs-ob-waqt-n">' + t("fajr") + '</span><span class="mhs-ob-waqt-t">' + hm(todayTimes.fajr) + '</span></div>',
            '    <div class="mhs-ob-waqt-cell"><span class="mhs-ob-waqt-n">' + t("dhuhr") + '</span><span class="mhs-ob-waqt-t">' + hm(todayTimes.dhuhr) + '</span></div>',
            '    <div class="mhs-ob-waqt-cell"><span class="mhs-ob-waqt-n">' + t("asr") + '</span><span class="mhs-ob-waqt-t">' + hm(todayTimes.asr) + '</span></div>',
            '    <div class="mhs-ob-waqt-cell"><span class="mhs-ob-waqt-n">' + t("maghrib") + '</span><span class="mhs-ob-waqt-t">' + hm(todayTimes.maghrib) + '</span></div>',
            '    <div class="mhs-ob-waqt-cell"><span class="mhs-ob-waqt-n">' + t("isha") + '</span><span class="mhs-ob-waqt-t">' + hm(todayTimes.isha) + '</span></div>',
            '  </div>',
            '</div>'
          ].join("");
        }

        body.innerHTML = [
          '<div class="mhs-ob-title-wrap">',
          '  <h3>' + t("s3Title") + '</h3>',
          '  <p>' + t("s3Sub") + '</p>',
          '</div>',
          '<div class="mhs-ob-loc-wrap">',
          '  <button type="button" class="mhs-ob-gps-btn" id="mhs-ob-gps">' + (self.gpsStatus ? self.gpsStatus : t("gpsBtn")) + '</button>',
          '  <div>',
          '    <label style="font-size:0.78rem; color:#94a3b8; display:block; margin-bottom:0.3rem;">' + t("cityLabel") + '</label>',
          '    <select class="mhs-ob-city-select" id="mhs-ob-city">',
          '      <option value="Dhaka"' + (currentPlace === "Dhaka" ? " selected" : "") + '>Dhaka (ঢাকা)</option>',
          '      <option value="Chattogram"' + (currentPlace === "Chattogram" ? " selected" : "") + '>Chattogram (চট্টগ্রাম)</option>',
          '      <option value="Sylhet"' + (currentPlace === "Sylhet" ? " selected" : "") + '>Sylhet (সিলেট)</option>',
          '      <option value="Rajshahi"' + (currentPlace === "Rajshahi" ? " selected" : "") + '>Rajshahi (রাজশাহী)</option>',
          '      <option value="Khulna"' + (currentPlace === "Khulna" ? " selected" : "") + '>Khulna (খুলনা)</option>',
          '      <option value="Barishal"' + (currentPlace === "Barishal" ? " selected" : "") + '>Barishal (বরিশাল)</option>',
          '      <option value="Rangpur"' + (currentPlace === "Rangpur" ? " selected" : "") + '>Rangpur (রংপুর)</option>',
          '      <option value="Mymensingh"' + (currentPlace === "Mymensingh" ? " selected" : "") + '>Mymensingh (ময়মনসিংহ)</option>',
          '      <option value="Cumilla"' + (currentPlace === "Cumilla" ? " selected" : "") + '>Cumilla (কুমিল্লা)</option>',
          '      <option value="Gazipur"' + (currentPlace === "Gazipur" ? " selected" : "") + '>Gazipur (গাজীপুর)</option>',
          '      <option value="Bogura"' + (currentPlace === "Bogura" ? " selected" : "") + '>Bogura (বগুড়া)</option>',
          '      <option value="Cox\'s Bazar"' + (currentPlace === "Cox's Bazar" ? " selected" : "") + '>Cox\'s Bazar (কক্সবাজার)</option>',
          '      <option value="Makkah"' + (currentPlace === "Makkah" ? " selected" : "") + '>Makkah (مكة المكرمة)</option>',
          '      <option value="Madinah"' + (currentPlace === "Madinah" ? " selected" : "") + '>Madinah (المدينة المنورة)</option>',
          '      <option value="London"' + (currentPlace === "London" ? " selected" : "") + '>London</option>',
          '      <option value="New York"' + (currentPlace === "New York" ? " selected" : "") + '>New York</option>',
          '    </select>',
          '  </div>',
          '  <div>',
          '    <label style="font-size:0.78rem; color:#94a3b8; display:block; margin-bottom:0.3rem;">' + t("asrLabel") + '</label>',
          '    <select class="mhs-ob-city-select" id="mhs-ob-asr">',
          '      <option value="hanafi"' + (isHanafi ? " selected" : "") + '>' + t("hanafi") + '</option>',
          '      <option value="standard"' + (!isHanafi ? " selected" : "") + '>' + t("shafii") + '</option>',
          '    </select>',
          '  </div>',
          timesHtml,
          '</div>'
        ].join("");

        var gpsBtn = body.querySelector("#mhs-ob-gps");
        if (gpsBtn) {
          gpsBtn.addEventListener("click", function () {
            self.gpsStatus = t("gpsDetecting");
            gpsBtn.textContent = self.gpsStatus;
            if (window.MHSPrayer && window.MHSPrayer.locate) {
              window.MHSPrayer.locate(function () {
                self.gpsStatus = t("gpsFail");
                self.render();
              });
              setTimeout(function () {
                var updatedCfg = window.MHSPrayer.config();
                if (updatedCfg && updatedCfg.lat !== null) {
                  self.gpsStatus = t("gpsSuccess", { p: updatedCfg.place || "GPS Location" });
                  self.render();
                }
              }, 1200);
            }
          });
        }

        var citySel = body.querySelector("#mhs-ob-city");
        if (citySel) {
          citySel.addEventListener("change", function () {
            var val = citySel.value;
            var cityCoords = {
              "Dhaka": [23.8103, 90.4125],
              "Chattogram": [22.3569, 91.7832],
              "Sylhet": [24.8949, 91.8687],
              "Rajshahi": [24.3745, 88.6042],
              "Khulna": [22.8456, 89.5403],
              "Barishal": [22.701, 90.3535],
              "Rangpur": [25.7439, 89.2752],
              "Mymensingh": [24.7471, 90.4203],
              "Cumilla": [23.4607, 91.1809],
              "Gazipur": [23.9999, 90.4203],
              "Bogura": [24.8465, 89.3773],
              "Cox's Bazar": [21.4272, 92.0058],
              "Makkah": [21.3891, 39.8579],
              "Madinah": [24.5247, 39.5692],
              "London": [51.5074, -0.1278],
              "New York": [40.7128, -74.006]
            };
            var coords = cityCoords[val] || [23.8103, 90.4125];
            try {
              var c = JSON.parse(localStorage.getItem("muhasabah:prayer")) || {};
              c.src = "city";
              c.place = val;
              c.lat = coords[0];
              c.lng = coords[1];
              c.on = true;
              localStorage.setItem("muhasabah:prayer", JSON.stringify(c));
              window.dispatchEvent(new CustomEvent("mhs-prayer-change"));
            } catch (e) {}
            self.render();
          });
        }

        var asrSel = body.querySelector("#mhs-ob-asr");
        if (asrSel) {
          asrSel.addEventListener("change", function () {
            try {
              var c = JSON.parse(localStorage.getItem("muhasabah:prayer")) || {};
              c.asr = asrSel.value;
              localStorage.setItem("muhasabah:prayer", JSON.stringify(c));
              window.dispatchEvent(new CustomEvent("mhs-prayer-change"));
            } catch (e) {}
            self.render();
          });
        }
      } else if (this.step === 4) {
        body.innerHTML = [
          '<div class="mhs-ob-title-wrap">',
          '  <h3>' + t("s4Title") + '</h3>',
          '  <p>' + t("s4Sub") + '</p>',
          '</div>',
          '<div class="mhs-ob-habits-list">',
          STARTER_HABITS.map(function (sh) {
            var isChk = self.selectedHabits.has(sh.key);
            return [
              '<div class="mhs-ob-habit-item ' + (isChk ? "checked" : "") + '" data-key="' + sh.key + '">',
              '  <div class="mhs-ob-habit-left">',
              '    <input type="checkbox" ' + (isChk ? "checked" : "") + ' style="accent-color:#00c853; width:1.15rem; height:1.15rem;">',
              '    <span style="font-size:1.25rem;">' + sh.icon + '</span>',
              '    <div class="mhs-ob-habit-info">',
              '      <b>' + t(sh.key) + '</b>',
              '      <span>' + t(sh.key + "Sub") + '</span>',
              '    </div>',
              '  </div>',
              '  <span class="mhs-ob-pts-tag">+' + sh.points + ' pts</span>',
              '</div>'
            ].join("");
          }).join(""),
          '</div>',
          '<div style="margin-top:0.75rem;">',
          '  <label style="font-size:0.78rem; color:#94a3b8; display:block; margin-bottom:0.3rem;">' + t("graceLabel") + '</label>',
          '  <select class="mhs-ob-city-select" id="mhs-ob-grace">',
          '    <option value="10"' + (self.grace === 10 ? " selected" : "") + '>' + t("min10") + '</option>',
          '    <option value="15"' + (self.grace === 15 ? " selected" : "") + '>' + t("min15") + '</option>',
          '    <option value="30"' + (self.grace === 30 ? " selected" : "") + '>' + t("min30") + '</option>',
          '  </select>',
          '</div>'
        ].join("");

        body.querySelectorAll(".mhs-ob-habit-item").forEach(function (el) {
          el.addEventListener("click", function (e) {
            var k = el.getAttribute("data-key");
            if (self.selectedHabits.has(k)) {
              self.selectedHabits.delete(k);
            } else {
              self.selectedHabits.add(k);
            }
            self.render();
          });
        });

        var graceSel = body.querySelector("#mhs-ob-grace");
        if (graceSel) {
          graceSel.addEventListener("change", function () {
            self.grace = parseInt(graceSel.value, 10) || 10;
          });
        }
      } else if (this.step === 5) {
        var isGranted = self.notifStatus === "granted";
        var isDenied = self.notifStatus === "denied";

        body.innerHTML = [
          '<div class="mhs-ob-title-wrap">',
          '  <h3>' + t("s5Title") + '</h3>',
          '  <p>' + t("s5Sub") + '</p>',
          '</div>',
          '<div class="mhs-ob-notif-box">',
          '  <div class="mhs-ob-bell-anim">🔔</div>',
          '  <div style="display:flex; flex-direction:column; gap:0.5rem; text-align:left; background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:1rem; border:1px solid rgba(255,255,255,0.06); width:100%;">',
          '    <div style="font-size:0.82rem; color:#cbd5e1;">' + t("notifR1") + '</div>',
          '    <div style="font-size:0.82rem; color:#cbd5e1;">' + t("notifR2") + '</div>',
          '    <div style="font-size:0.82rem; color:#cbd5e1;">' + t("notifR3") + '</div>',
          '  </div>',
          isGranted
            ? '<div style="color:#4ade80; font-weight:600; font-size:0.92rem;">' + t("notifGranted") + '</div>'
            : isDenied
              ? '<div style="color:#f87171; font-size:0.82rem;">' + t("notifDenied") + '</div>'
              : '<button type="button" class="mhs-ob-notif-btn" id="mhs-ob-allow-notif">' + t("allowNotifBtn") + '</button>',
          '<button type="button" class="mhs-ob-notif-skip" id="mhs-ob-skip-notif">' + t("skipNotif") + '</button>',
          '</div>'
        ].join("");

        var allowBtn = body.querySelector("#mhs-ob-allow-notif");
        if (allowBtn) {
          allowBtn.addEventListener("click", function () {
            if ("Notification" in window) {
              Notification.requestPermission().then(function (perm) {
                self.notifStatus = perm;
                if (perm === "granted") {
                  try {
                    localStorage.setItem("muhasabah:remind", JSON.stringify({ on: true, mins: 15 }));
                  } catch (e) {}
                  try {
                    new Notification(t("appName"), {
                      body: t("notifGranted"),
                      icon: "/icons/icon-192.png"
                    });
                  } catch (e) {}
                }
                self.render();
              });
            }
          });
        }

        var skipBtn = body.querySelector("#mhs-ob-skip-notif");
        if (skipBtn) {
          skipBtn.addEventListener("click", function () {
            self.nextStep();
          });
        }
      } else if (this.step === 6) {
        body.innerHTML = [
          '<div class="mhs-ob-title-wrap">',
          '  <div class="mhs-ob-success-badge">✨ 🤲 ✨</div>',
          '  <h3>' + t("s6Title") + '</h3>',
          '  <p>' + t("s6Sub") + '</p>',
          '</div>',
          '<div style="display:flex; flex-direction:column; gap:0.75rem; text-align:left;">',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">📋</span><div class="mhs-ob-item-txt"><b>' + t("t1Title") + '</b><span>' + t("t1Desc") + '</span></div></div>',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">📈</span><div class="mhs-ob-item-txt"><b>' + t("t2Title") + '</b><span>' + t("t2Desc") + '</span></div></div>',
          '  <div class="mhs-ob-item"><span class="mhs-ob-icon">⚙️</span><div class="mhs-ob-item-txt"><b>' + t("t3Title") + '</b><span>' + t("t3Desc") + '</span></div></div>',
          '</div>'
        ].join("");
      }

      card.appendChild(body);

      // 3. Footer Navigation
      var footer = document.createElement("div");
      footer.className = "mhs-ob-footer";

      if (this.step > 1) {
        var backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.className = "mhs-ob-back-btn";
        backBtn.textContent = t("back");
        backBtn.addEventListener("click", function () { self.prevStep(); });
        footer.appendChild(backBtn);
      } else {
        var emptySpan = document.createElement("span");
        footer.appendChild(emptySpan);
      }

      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "mhs-ob-next-btn";
      nextBtn.textContent = this.step === this.totalSteps ? t("startBtn") : t("next");
      nextBtn.addEventListener("click", function () { self.nextStep(); });
      footer.appendChild(nextBtn);

      card.appendChild(footer);
      container.appendChild(card);

      this.replaceChildren(container);
    }
  }

  if (window.customElements && !customElements.get("mhs-onboarding")) {
    customElements.define("mhs-onboarding", MhsOnboarding);
  }

  // Global API to trigger walkthrough
  window.MHSOnboard = {
    open: function () {
      var existing = document.querySelector("mhs-onboarding");
      if (existing) return;
      var el = document.createElement("mhs-onboarding");
      document.body.appendChild(el);
    },
    close: function () {
      var existing = document.querySelector("mhs-onboarding");
      if (existing) existing.remove();
    }
  };

  // Listen to open event
  window.addEventListener("mhs:open-onboarding", function () {
    window.MHSOnboard.open();
  });
})();
