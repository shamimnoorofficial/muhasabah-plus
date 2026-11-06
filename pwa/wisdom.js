/* Muhasabah — "Get Reminder" wisdom feed (opened from the quick-action menu).
 * Randomised Quranic verses, hadith and wise sayings on a swipeable card: Next, Share,
 * favourite, and tap the source to open that ayah in the Quran reader or that hadith in the
 * Hadith reader. The + button adds your own quotes, kept on this device.
 * Exposes window.MHSWisdom { open(), data(), hadiths() }. */
(function () {
  "use strict";
  if (window.__mhsWisdom) return;
  window.__mhsWisdom = true;

  /* Built-in entries. verse: {s, a} points into the Quran reader; hadith: {book, n} into the Hadith reader. */
  var VERSES = [
    { s: 59, a: 18, ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ", en: "O you who believe, be mindful of Allah, and let every soul look to what it has sent forth for tomorrow.", bn: "হে মুমিনগণ, আল্লাহকে ভয় করো এবং প্রত্যেকে ভেবে দেখুক আগামীকালের জন্য সে কী পাঠিয়েছে।" },
    { s: 2, a: 152, ar: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", en: "So remember Me; I will remember you. Be grateful to Me and do not deny Me.", bn: "সুতরাং তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আমার প্রতি কৃতজ্ঞ হও, অকৃতজ্ঞ হয়ো না।" },
    { s: 94, a: 6, ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", bn: "নিশ্চয়ই কষ্টের সাথে রয়েছে স্বস্তি।" },
    { s: 13, a: 28, ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Truly, in the remembrance of Allah do hearts find rest.", bn: "জেনে রাখো, আল্লাহর স্মরণেই অন্তর প্রশান্ত হয়।" },
    { s: 2, a: 286, ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", en: "Allah does not burden a soul beyond what it can bear.", bn: "আল্লাহ কাউকে তার সাধ্যের বাইরে দায়িত্ব দেন না।" },
    { s: 39, a: 53, ar: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", en: "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah.", bn: "বলুন, হে আমার বান্দারা, যারা নিজেদের প্রতি অবিচার করেছ, আল্লাহর রহমত থেকে নিরাশ হয়ো না।" },
    { s: 2, a: 45, ar: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", en: "And seek help through patience and prayer.", bn: "ধৈর্য ও নামাজের মাধ্যমে সাহায্য প্রার্থনা করো।" },
    { s: 65, a: 3, ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", en: "And whoever relies upon Allah, He is sufficient for him.", bn: "যে আল্লাহর উপর ভরসা করে, তার জন্য তিনিই যথেষ্ট।" },
    { s: 3, a: 139, ar: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ", en: "Do not lose heart and do not grieve, for you will be superior if you are true believers.", bn: "তোমরা হীনবল হয়ো না, দুঃখও করো না; তোমরাই বিজয়ী হবে, যদি তোমরা মুমিন হও।" },
    { s: 103, a: 1, ar: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", en: "By time, mankind is surely in loss, except those who believe, do righteous deeds, and urge one another to truth and to patience.", bn: "সময়ের শপথ! নিশ্চয়ই মানুষ ক্ষতির মধ্যে আছে, তারা ছাড়া যারা ঈমান এনেছে, সৎকাজ করেছে এবং পরস্পরকে সত্য ও ধৈর্যের উপদেশ দিয়েছে।" },
    { s: 14, a: 7, ar: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", en: "If you are grateful, I will surely give you more.", bn: "যদি তোমরা কৃতজ্ঞ হও, আমি অবশ্যই তোমাদের আরও দেব।" },
    { s: 29, a: 69, ar: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", en: "And those who strive for Us, We will surely guide them to Our ways.", bn: "যারা আমার পথে সাধনা করে, আমি অবশ্যই তাদের আমার পথসমূহে পরিচালিত করব।" },
    { s: 2, a: 153, ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient.", bn: "নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।" },
    { s: 20, a: 14, ar: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي", en: "And establish prayer for My remembrance.", bn: "এবং আমার স্মরণার্থে নামাজ কায়েম করো।" },
    { s: 2, a: 186, ar: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", en: "And when My servants ask you about Me, indeed I am near.", bn: "আমার বান্দারা যখন আমার সম্পর্কে জিজ্ঞেস করে, তখন (বলো) আমি নিকটেই আছি।" }
  ];
  var HADITHS = [
    { book: "bukhari", n: 1, ar: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", en: "Actions are judged by intentions, and every person will have what they intended.", bn: "নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল, আর প্রত্যেকে তা-ই পাবে যা সে নিয়ত করেছে।", src: "Sahih al-Bukhari 1" },
    { book: "bukhari", n: 13, ar: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", en: "None of you truly believes until he loves for his brother what he loves for himself.", bn: "তোমাদের কেউ ততক্ষণ প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে যা সে নিজের জন্য পছন্দ করে।", src: "Sahih al-Bukhari 13" },
    { book: "bukhari", n: 6464, ar: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", en: "The deeds most beloved to Allah are those done regularly, even if they are small.", bn: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো যা নিয়মিত করা হয়, যদিও তা অল্প।", src: "Sahih al-Bukhari 6464" },
    { book: "bukhari", n: 6412, ar: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ", en: "There are two blessings many people are deceived about: good health and free time.", bn: "দুটি নিয়ামত সম্পর্কে অনেক মানুষ ধোঁকায় আছে: সুস্থতা ও অবসর।", src: "Sahih al-Bukhari 6412" },
    { book: "bukhari", n: 6114, ar: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ", en: "The strong one is not the one who wins at wrestling; the strong one is the one who controls himself when angry.", bn: "প্রকৃত শক্তিশালী সে নয় যে কুস্তিতে জেতে; প্রকৃত শক্তিশালী সে, যে রাগের সময় নিজেকে নিয়ন্ত্রণ করতে পারে।", src: "Sahih al-Bukhari 6114" },
    { book: "bukhari", n: 69, ar: "يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا", en: "Make things easy and do not make them hard; give glad tidings and do not drive people away.", bn: "সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিতৃষ্ণা সৃষ্টি করো না।", src: "Sahih al-Bukhari 69" },
    { book: "bukhari", n: 2989, ar: "وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", en: "A good word is charity.", bn: "উত্তম কথা একটি সদকা।", src: "Sahih al-Bukhari 2989" },
    { book: "bukhari", n: 6416, ar: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ", en: "Be in this world as if you were a stranger or a traveller on the road.", bn: "দুনিয়াতে এমনভাবে থাকো যেন তুমি একজন অপরিচিত বা পথিক।", src: "Sahih al-Bukhari 6416" },
    { book: "muslim", n: 2699, ar: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", en: "Whoever follows a path in search of knowledge, Allah makes easy for him a path to Paradise.", bn: "যে ব্যক্তি জ্ঞান অন্বেষণে কোনো পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।", src: "Sahih Muslim 2699" },
    { book: "muslim", n: 2564, ar: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ", en: "Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.", bn: "আল্লাহ তোমাদের চেহারা ও সম্পদের দিকে তাকান না, বরং তিনি তোমাদের অন্তর ও আমলের দিকে তাকান।", src: "Sahih Muslim 2564" },
    { book: "tirmidhi", n: 3895, ar: "خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ", en: "The best of you are those who are best to their families.", bn: "তোমাদের মধ্যে সেই উত্তম, যে তার পরিবারের কাছে উত্তম।", src: "Jami' at-Tirmidhi 3895" },
    { book: "nawawi", n: 13, ar: "ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا عِنْدَ النَّاسِ يُحِبَّكَ النَّاسُ", en: "Renounce the world and Allah will love you; renounce what people possess and people will love you.", bn: "দুনিয়ার প্রতি নির্মোহ হও, আল্লাহ তোমাকে ভালোবাসবেন; মানুষের যা আছে তার প্রতি নির্মোহ হও, মানুষ তোমাকে ভালোবাসবে।", src: "An-Nawawi's 40 Hadith 31" }
  ];
  var QUOTES = [
    { by: "Umar ibn al-Khattab (RA)", ar: "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا", en: "Hold yourselves to account before you are held to account.", bn: "তোমাদের হিসাব নেওয়ার আগে নিজেরাই নিজেদের হিসাব নাও।" },
    { by: "Ali ibn Abi Talib (RA)", en: "Do not be a slave to others when Allah has created you free.", bn: "অন্যের দাস হয়ো না, আল্লাহ তোমাকে স্বাধীন করে সৃষ্টি করেছেন।" },
    { by: "Hasan al-Basri", en: "O son of Adam, you are nothing but a number of days; whenever a day passes, a part of you has gone.", bn: "হে আদম সন্তান, তুমি কিছু দিনের সমষ্টি মাত্র; যখন একটি দিন চলে যায়, তোমার একটি অংশও চলে যায়।" },
    { by: "Ibn al-Qayyim", en: "Wasting time is worse than death: wasting time cuts you off from Allah and the Hereafter, while death only cuts you off from this world.", bn: "সময় নষ্ট করা মৃত্যুর চেয়েও মারাত্মক; সময় নষ্ট করা তোমাকে আল্লাহ ও আখিরাত থেকে বিচ্ছিন্ন করে, আর মৃত্যু কেবল দুনিয়া থেকে।" },
    { by: "Imam ash-Shafi'i", ar: "الوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ", en: "Time is like a sword: if you do not cut it, it cuts you.", bn: "সময় তলোয়ারের মতো; তুমি তাকে না কাটলে সে তোমাকে কেটে ফেলবে।" },
    { by: "Ibn Taymiyyah", en: "The heart was created to know its Creator; nothing else will ever satisfy it.", bn: "অন্তর সৃষ্টি হয়েছে তার স্রষ্টাকে জানার জন্য; অন্য কিছুই তাকে তৃপ্ত করতে পারে না।" },
    { by: "Imam Malik", en: "Knowledge is not in how much you memorise; knowledge is a light that Allah places in the heart.", bn: "জ্ঞান বেশি মুখস্থ করার নাম নয়; জ্ঞান এমন এক আলো যা আল্লাহ অন্তরে স্থাপন করেন।" },
    { by: "Jalaluddin Rumi", en: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", bn: "গতকাল আমি চতুর ছিলাম, তাই পৃথিবী বদলাতে চেয়েছিলাম। আজ আমি জ্ঞানী, তাই নিজেকে বদলাচ্ছি।" },
    { by: "Ibn al-Jawzi", en: "Whoever knows the value of their time will not let a moment pass without benefit.", bn: "যে তার সময়ের মূল্য বোঝে, সে একটি মুহূর্তও উপকার ছাড়া যেতে দেয় না।" },
    { by: "Imam al-Ghazali", en: "Knowledge without action is madness, and action without knowledge is void.", bn: "আমলবিহীন জ্ঞান উন্মাদনা, আর জ্ঞানবিহীন আমল অর্থহীন।" },
    { by: "Ali ibn Abi Talib (RA)", en: "Patience is of two kinds: patience over what pains you, and patience against what you crave.", bn: "ধৈর্য দুই প্রকার: যা কষ্ট দেয় তার উপর ধৈর্য, আর যা লোভ জাগায় তার বিরুদ্ধে ধৈর্য।" },
    { by: "Abu Bakr as-Siddiq (RA)", en: "Whoever enters the grave without provision is like one who sets out to sea without a ship.", bn: "যে পাথেয় ছাড়া কবরে প্রবেশ করে, সে যেন জাহাজ ছাড়া সমুদ্রে যাত্রা করল।" }
  ];
  var T = {
    en: { title: "Get Reminder", sub: "Verses, hadith and wise words", verse: "Quran", hadith: "Hadith", quote: "Wisdom", mine: "My quotes", all: "All", next: "Next", share: "Share", fav: "Favourite", unfav: "Favourited", add: "Add your own", addTitle: "Add a quote or saying", text: "Text", textPh: "Write the quote, verse or saying…", by: "Source / author (optional)", byPh: "e.g. Imam Ahmad, Surah Al-Kahf 18:10", kind: "Type", save: "Save", cancel: "Cancel", saved: "Saved to your reminders", deleted: "Removed", myList: "Your quotes", none: "No reminders in this filter yet.", openQ: "Open in Quran", openH: "Open in Hadith", favs: "Favourites", delete: "Delete", addedBy: "Added by you", copy: "Copied" },
    bn: { title: "স্মরণ নিন", sub: "আয়াত, হাদিস ও জ্ঞানের কথা", verse: "কুরআন", hadith: "হাদিস", quote: "প্রজ্ঞা", mine: "আমার উক্তি", all: "সব", next: "পরবর্তী", share: "শেয়ার", fav: "প্রিয়", unfav: "প্রিয়তে আছে", add: "নিজের যোগ করুন", addTitle: "উক্তি বা বাণী যোগ করুন", text: "লেখা", textPh: "উক্তি, আয়াত বা বাণী লিখুন…", by: "উৎস / বক্তা (ঐচ্ছিক)", byPh: "যেমন: ইমাম আহমাদ, সূরা কাহফ ১৮:১০", kind: "ধরন", save: "সংরক্ষণ", cancel: "বাতিল", saved: "আপনার স্মরণে যোগ হয়েছে", deleted: "মুছে ফেলা হয়েছে", myList: "আপনার উক্তি", none: "এই ফিল্টারে এখনো কিছু নেই।", openQ: "কুরআনে খুলুন", openH: "হাদিসে খুলুন", favs: "প্রিয়", delete: "মুছুন", addedBy: "আপনার যোগ করা", copy: "কপি হয়েছে" },
    ar: { title: "تذكرة", sub: "آيات وأحاديث وحِكم", verse: "قرآن", hadith: "حديث", quote: "حكمة", mine: "اقتباساتي", all: "الكل", next: "التالي", share: "مشاركة", fav: "مفضلة", unfav: "في المفضلة", add: "أضف اقتباسًا", addTitle: "أضف اقتباسًا أو حكمة", text: "النص", textPh: "اكتب الاقتباس أو الآية أو الحكمة…", by: "المصدر / القائل (اختياري)", byPh: "مثال: الإمام أحمد، سورة الكهف ١٨:١٠", kind: "النوع", save: "حفظ", cancel: "إلغاء", saved: "أُضيف إلى تذكيراتك", deleted: "تم الحذف", myList: "اقتباساتك", none: "لا تذكيرات في هذا التصنيف بعد.", openQ: "افتح في القرآن", openH: "افتح في الحديث", favs: "المفضلة", delete: "حذف", addedBy: "أضفته أنت", copy: "تم النسخ" }
  };
  function lang() { var l = document.documentElement.lang || "en"; return T[l] ? l : "en"; }
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k] || k; }
  function jget(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var E = function (tag, attrs, kids) { return window.MHSSheet.el(tag, attrs, kids); };

  function custom() { return jget("mhs:wisdom:custom", []); }
  function favs() { return jget("mhs:wisdom:favs", []); }
  function all() {
    var out = [];
    VERSES.forEach(function (v, k) { out.push({ id: "v" + v.s + ":" + v.a, kind: "verse", ar: v.ar, text: v[lang()] || v.en, src: (window.MHSQuran ? (lang() === "ar" ? window.MHSQuran.surahs[v.s - 1][1] : window.MHSQuran.surahs[v.s - 1][2]) : "Surah " + v.s) + " " + v.s + ":" + v.a, go: function () { window.MHSQuran && window.MHSQuran.open({ surah: v.s, ayah: v.a }); } }); });
    HADITHS.forEach(function (h) { out.push({ id: "h" + h.book + ":" + h.n, kind: "hadith", ar: h.ar, text: h[lang()] || h.en, src: h.src, go: function () { window.MHSHadith && window.MHSHadith.open({ book: h.book, number: h.n }); } }); });
    QUOTES.forEach(function (q, k) { out.push({ id: "q" + k, kind: "quote", ar: q.ar || "", text: q[lang()] || q.en, src: q.by }); });
    custom().forEach(function (c) { out.push({ id: c.id, kind: c.kind || "quote", ar: "", text: c.text, src: c.by || t("addedBy"), mine: true }); });
    return out;
  }
  function label(kind) { return t(kind === "verse" ? "verse" : kind === "hadith" ? "hadith" : "quote"); }

  var sheet = null, filter = "all", cur = null, history = [], form = false;
  function pick() {
    var pool = all().filter(function (x) { return filter === "all" || (filter === "favs" ? favs().indexOf(x.id) >= 0 : filter === "mine" ? x.mine : x.kind === filter); });
    if (!pool.length) return null;
    var recent = history.slice(-Math.min(history.length, Math.max(0, pool.length - 1)));
    var fresh = pool.filter(function (x) { return recent.indexOf(x.id) < 0; });
    var c = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh : pool).length)];
    history.push(c.id); if (history.length > 60) history.shift();
    return c;
  }
  function render(animate) {
    if (!sheet) return;
    var b = sheet.body; b.replaceChildren(); sheet.tools.replaceChildren(); sheet.foot.hidden = true;
    sheet.setTitle(t("title"), t("sub")); sheet.showBack(false);
    sheet.tools.appendChild(E("button", { type: "button", class: "mhs-mini-ib" + (form ? " is-on" : ""), "aria-label": t("add"), title: t("add"), on: { click: function () { form = !form; render(); } } }, [sheet.icon("M12 5v14|M5 12h14")]));
    var chips = E("div", { class: "mhs-mini-chips", role: "tablist" });
    [["all", t("all")], ["verse", t("verse")], ["hadith", t("hadith")], ["quote", t("quote")], ["favs", "♥ " + t("favs")], ["mine", t("mine")]].forEach(function (c) {
      chips.appendChild(E("button", { type: "button", role: "tab", class: "mhs-chip" + (filter === c[0] ? " is-on" : ""), "aria-selected": String(filter === c[0]), text: c[1], on: { click: function () { filter = c[0]; cur = pick(); render(true); } } }));
    });
    b.appendChild(chips);
    if (!cur) cur = pick();
    if (!cur) b.appendChild(E("p", { class: "mhs-mini-msg", text: t("none") }));
    else {
      var fav = favs().indexOf(cur.id) >= 0;
      var card = E("div", { class: "mhs-w-card", role: "region", "aria-live": "polite", "aria-label": label(cur.kind) }, [
        E("div", { class: "mhs-w-top" }, [E("span", { class: "mhs-w-type", text: label(cur.kind) }), cur.mine ? E("button", { type: "button", class: "mhs-chip", text: t("delete"), on: { click: function () { jset("mhs:wisdom:custom", custom().filter(function (c) { return c.id !== cur.id; })); window.MHSActions.toast(t("deleted")); cur = pick(); render(true); } } }) : null]),
        cur.ar ? E("div", { class: "mhs-w-ar", lang: "ar", text: cur.ar }) : null,
        E("div", { class: "mhs-w-text", text: cur.text }),
        E("button", { type: "button", class: "mhs-w-src" + (cur.go ? " is-link" : ""), text: "— " + cur.src + (cur.go ? " ↗" : ""), "aria-label": cur.go ? (cur.kind === "verse" ? t("openQ") : t("openH")) + ": " + cur.src : cur.src, on: { click: function () { if (cur.go) cur.go(); } } })
      ]);
      b.appendChild(card);
      var bar = E("div", { class: "mhs-w-bar" }, [
        E("button", { type: "button", class: "mhs-btn primary", text: t("next") + " →", on: { click: function () { card.classList.add("is-out"); setTimeout(function () { cur = pick(); render(true); }, 160); } } }),
        E("button", { type: "button", class: "mhs-btn", text: "↗ " + t("share"), on: { click: function () { window.MHSActions.share((cur.ar ? cur.ar + "\n\n" : "") + cur.text + "\n— " + cur.src + "\n\nMuhasabah Plus · https://muhasabah-plus.app", t("title")); } } }),
        E("button", { type: "button", class: "mhs-btn" + (fav ? " is-on" : ""), "aria-pressed": String(fav), text: (fav ? "♥ " : "♡ ") + t("fav"), on: { click: function () { var f = favs(); jset("mhs:wisdom:favs", fav ? f.filter(function (x) { return x !== cur.id; }) : f.concat([cur.id])); render(); } } })
      ]);
      b.appendChild(bar);
      /* swipe left / right for next */
      var sx = null;
      card.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      card.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 60) { cur = pick(); render(true); } });
    }
    if (form) b.appendChild(addForm());
    var mine = custom();
    if (filter === "mine" && mine.length) {
      var list = E("div", { class: "mhs-mini-list mhs-w-mine" });
      mine.slice().reverse().forEach(function (c) { list.appendChild(E("div", { class: "mhs-mini-row" }, [E("span", { class: "txt" }, [E("b", { text: c.text }), E("small", { text: c.by || label(c.kind) })]), E("button", { type: "button", class: "del", text: t("delete"), on: { click: function () { jset("mhs:wisdom:custom", custom().filter(function (x) { return x.id !== c.id; })); window.MHSActions.toast(t("deleted")); if (cur && cur.id === c.id) cur = null; render(); } } })])); });
      b.appendChild(E("div", { class: "mhs-mini-sec", text: t("myList") })); b.appendChild(list);
    }
  }
  function addForm() {
    var txt = E("textarea", { placeholder: t("textPh"), "aria-label": t("text"), maxlength: 600 });
    var by = E("input", { type: "text", placeholder: t("byPh"), "aria-label": t("by"), maxlength: 120 });
    var kind = E("select", { "aria-label": t("kind") }); [["quote", t("quote")], ["verse", t("verse")], ["hadith", t("hadith")]].forEach(function (k) { kind.appendChild(E("option", { value: k[0], text: k[1] })); });
    var f = E("form", { class: "mhs-w-form" }, [E("h3", { text: t("addTitle") }), E("label", null, [E("span", { class: "mhs-label", text: t("text") }), txt]), E("label", null, [E("span", { class: "mhs-label", text: t("by") }), by]), E("label", null, [E("span", { class: "mhs-label", text: t("kind") }), kind]),
      E("div", { class: "row" }, [E("button", { type: "button", class: "mhs-btn", text: t("cancel"), on: { click: function () { form = false; render(); } } }), E("button", { type: "submit", class: "mhs-btn primary", text: t("save") })])]);
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var v = txt.value.trim(); if (v.length < 3) { txt.focus(); return; }
      var item = { id: "c" + Date.now(), text: v, by: by.value.trim(), kind: kind.value, at: Date.now() };
      jset("mhs:wisdom:custom", custom().concat([item]).slice(-500));
      window.MHSActions.toast(t("saved")); form = false; filter = "mine"; cur = all().filter(function (x) { return x.id === item.id; })[0]; render(true);
    });
    setTimeout(function () { txt.focus(); }, 50);
    return f;
  }

  window.MHSWisdom = {
    data: all, hadiths: function () { return HADITHS; }, verses: function () { return VERSES; },
    open: function () {
      if (!window.MHSSheet) return;
      if (sheet && sheet.dialog.open) return;
      sheet = window.MHSSheet.open({ id: "mhs-wisdom", title: t("title"), sub: t("sub"), onClose: function () { sheet = null; } });
      form = false; cur = pick(); render();
    }
  };
})();
