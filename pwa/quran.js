/* Muhasabah — Quran reader mini-app (opened from the quick-action menu).
 * Surah list with search, Uthmani text with ayah numbers, translation (English / Bengali),
 * adjustable text size, bookmarks, share, jump to ayah, continue where you left off.
 * Text comes from the free Al Quran Cloud API and is cached on this device (IndexedDB), so a
 * surah you have opened once reads offline. Exposes window.MHSQuran { open({surah, ayah}) }. */
(function () {
  "use strict";
  if (window.__mhsQuran) return;
  window.__mhsQuran = true;

  var API = "https://api.alquran.cloud/v1/surah/";
  var KAABA_BISMILLAH = /^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/;
  /* number, Arabic name, English name, meaning, ayah count, place (M = Makkah, D = Madinah) */
  var S = [[1,"الفاتحة","Al-Fatihah","The Opening",7,"M"],[2,"البقرة","Al-Baqarah","The Cow",286,"D"],[3,"آل عمران","Aal-E-Imran","The Family of Imran",200,"D"],[4,"النساء","An-Nisa","The Women",176,"D"],[5,"المائدة","Al-Ma'idah","The Table Spread",120,"D"],[6,"الأنعام","Al-An'am","The Cattle",165,"M"],[7,"الأعراف","Al-A'raf","The Heights",206,"M"],[8,"الأنفال","Al-Anfal","The Spoils of War",75,"D"],[9,"التوبة","At-Tawbah","The Repentance",129,"D"],[10,"يونس","Yunus","Jonah",109,"M"],[11,"هود","Hud","Hud",123,"M"],[12,"يوسف","Yusuf","Joseph",111,"M"],[13,"الرعد","Ar-Ra'd","The Thunder",43,"D"],[14,"ابراهيم","Ibrahim","Abraham",52,"M"],[15,"الحجر","Al-Hijr","The Rocky Tract",99,"M"],[16,"النحل","An-Nahl","The Bee",128,"M"],[17,"الإسراء","Al-Isra","The Night Journey",111,"M"],[18,"الكهف","Al-Kahf","The Cave",110,"M"],[19,"مريم","Maryam","Mary",98,"M"],[20,"طه","Ta-Ha","Ta-Ha",135,"M"],[21,"الأنبياء","Al-Anbiya","The Prophets",112,"M"],[22,"الحج","Al-Hajj","The Pilgrimage",78,"D"],[23,"المؤمنون","Al-Mu'minun","The Believers",118,"M"],[24,"النور","An-Nur","The Light",64,"D"],[25,"الفرقان","Al-Furqan","The Criterion",77,"M"],[26,"الشعراء","Ash-Shu'ara","The Poets",227,"M"],[27,"النمل","An-Naml","The Ant",93,"M"],[28,"القصص","Al-Qasas","The Stories",88,"M"],[29,"العنكبوت","Al-Ankabut","The Spider",69,"M"],[30,"الروم","Ar-Rum","The Romans",60,"M"],[31,"لقمان","Luqman","Luqman",34,"M"],[32,"السجدة","As-Sajdah","The Prostration",30,"M"],[33,"الأحزاب","Al-Ahzab","The Combined Forces",73,"D"],[34,"سبإ","Saba","Sheba",54,"M"],[35,"فاطر","Fatir","Originator",45,"M"],[36,"يس","Ya-Sin","Ya Sin",83,"M"],[37,"الصافات","As-Saffat","Those who set the Ranks",182,"M"],[38,"ص","Sad","The Letter Sad",88,"M"],[39,"الزمر","Az-Zumar","The Troops",75,"M"],[40,"غافر","Ghafir","The Forgiver",85,"M"],[41,"فصلت","Fussilat","Explained in Detail",54,"M"],[42,"الشورى","Ash-Shura","The Consultation",53,"M"],[43,"الزخرف","Az-Zukhruf","The Ornaments of Gold",89,"M"],[44,"الدخان","Ad-Dukhan","The Smoke",59,"M"],[45,"الجاثية","Al-Jathiyah","The Crouching",37,"M"],[46,"الأحقاف","Al-Ahqaf","The Wind-Curved Sandhills",35,"M"],[47,"محمد","Muhammad","Muhammad",38,"D"],[48,"الفتح","Al-Fath","The Victory",29,"D"],[49,"الحجرات","Al-Hujurat","The Rooms",18,"D"],[50,"ق","Qaf","The Letter Qaf",45,"M"],[51,"الذاريات","Adh-Dhariyat","The Winnowing Winds",60,"M"],[52,"الطور","At-Tur","The Mount",49,"M"],[53,"النجم","An-Najm","The Star",62,"M"],[54,"القمر","Al-Qamar","The Moon",55,"M"],[55,"الرحمن","Ar-Rahman","The Beneficent",78,"D"],[56,"الواقعة","Al-Waqi'ah","The Inevitable",96,"M"],[57,"الحديد","Al-Hadid","The Iron",29,"D"],[58,"المجادلة","Al-Mujadila","The Pleading Woman",22,"D"],[59,"الحشر","Al-Hashr","The Exile",24,"D"],[60,"الممتحنة","Al-Mumtahanah","She that is to be examined",13,"D"],[61,"الصف","As-Saf","The Ranks",14,"D"],[62,"الجمعة","Al-Jumu'ah","The Congregation, Friday",11,"D"],[63,"المنافقون","Al-Munafiqun","The Hypocrites",11,"D"],[64,"التغابن","At-Taghabun","The Mutual Disillusion",18,"D"],[65,"الطلاق","At-Talaq","The Divorce",12,"D"],[66,"التحريم","At-Tahrim","The Prohibition",12,"D"],[67,"الملك","Al-Mulk","The Sovereignty",30,"M"],[68,"القلم","Al-Qalam","The Pen",52,"M"],[69,"الحاقة","Al-Haqqah","The Reality",52,"M"],[70,"المعارج","Al-Ma'arij","The Ascending Stairways",44,"M"],[71,"نوح","Nuh","Noah",28,"M"],[72,"الجن","Al-Jinn","The Jinn",28,"M"],[73,"المزمل","Al-Muzzammil","The Enshrouded One",20,"M"],[74,"المدثر","Al-Muddaththir","The Cloaked One",56,"M"],[75,"القيامة","Al-Qiyamah","The Resurrection",40,"M"],[76,"الانسان","Al-Insan","The Man",31,"D"],[77,"المرسلات","Al-Mursalat","The Emissaries",50,"M"],[78,"النبإ","An-Naba","The Tidings",40,"M"],[79,"النازعات","An-Nazi'at","Those who drag forth",46,"M"],[80,"عبس","Abasa","He Frowned",42,"M"],[81,"التكوير","At-Takwir","The Overthrowing",29,"M"],[82,"الإنفطار","Al-Infitar","The Cleaving",19,"M"],[83,"المطففين","Al-Mutaffifin","The Defrauding",36,"M"],[84,"الإنشقاق","Al-Inshiqaq","The Sundering",25,"M"],[85,"البروج","Al-Buruj","The Mansions of the Stars",22,"M"],[86,"الطارق","At-Tariq","The Nightcomer",17,"M"],[87,"الأعلى","Al-A'la","The Most High",19,"M"],[88,"الغاشية","Al-Ghashiyah","The Overwhelming",26,"M"],[89,"الفجر","Al-Fajr","The Dawn",30,"M"],[90,"البلد","Al-Balad","The City",20,"M"],[91,"الشمس","Ash-Shams","The Sun",15,"M"],[92,"الليل","Al-Layl","The Night",21,"M"],[93,"الضحى","Ad-Duhaa","The Morning Hours",11,"M"],[94,"الشرح","Ash-Sharh","The Relief",8,"M"],[95,"التين","At-Tin","The Fig",8,"M"],[96,"العلق","Al-Alaq","The Clot",19,"M"],[97,"القدر","Al-Qadr","The Power",5,"M"],[98,"البينة","Al-Bayyinah","The Clear Proof",8,"D"],[99,"الزلزلة","Az-Zalzalah","The Earthquake",8,"D"],[100,"العاديات","Al-Adiyat","The Courser",11,"M"],[101,"القارعة","Al-Qari'ah","The Calamity",11,"M"],[102,"التكاثر","At-Takathur","The Rivalry in world increase",8,"M"],[103,"العصر","Al-Asr","The Declining Day",3,"M"],[104,"الهمزة","Al-Humazah","The Traducer",9,"M"],[105,"الفيل","Al-Fil","The Elephant",5,"M"],[106,"قريش","Quraysh","Quraysh",4,"M"],[107,"الماعون","Al-Ma'un","The Small Kindnesses",7,"M"],[108,"الكوثر","Al-Kawthar","The Abundance",3,"M"],[109,"الكافرون","Al-Kafirun","The Disbelievers",6,"M"],[110,"النصر","An-Nasr","The Divine Support",3,"D"],[111,"المسد","Al-Masad","The Palm Fiber",5,"M"],[112,"الإخلاص","Al-Ikhlas","The Sincerity",4,"M"],[113,"الفلق","Al-Falaq","The Daybreak",5,"M"],[114,"الناس","An-Nas","Mankind",6,"M"]];

  var T = {
    en: { title: "Quran", sub: "114 surahs · Uthmani script", search: "Search surah by name or number…", ayahs: "ayahs", makkah: "Makkah", madinah: "Madinah", cont: "Continue reading", contSub: "{s} · ayah {a}", loading: "Loading surah…", offline: "This surah isn't saved on this device yet. Connect to the internet once to read it, then it stays available offline.", retry: "Try again", prev: "‹ Previous surah", next: "Next surah ›", tr: "Translation", trOn: "Show translation", trOff: "Hide translation", bigger: "Larger text", smaller: "Smaller text", jump: "Go to ayah", mark: "Bookmark", unmark: "Remove bookmark", marked: "Bookmarked", share: "Share", copy: "Copy", copied: "Copied", marks: "Bookmarks", noMarks: "No bookmarks yet. Tap the bookmark icon under any ayah.", all: "All surahs", ayah: "Ayah", source: "Text: Al Quran Cloud · Translation: {t}", trName: "Saheeh International", none: "No surah found." },
    bn: { title: "কুরআন", sub: "১১৪টি সূরা · উসমানি লিপি", search: "নাম বা নম্বর দিয়ে সূরা খুঁজুন…", ayahs: "আয়াত", makkah: "মক্কী", madinah: "মাদানী", cont: "পড়া চালিয়ে যান", contSub: "{s} · আয়াত {a}", loading: "সূরা লোড হচ্ছে…", offline: "এই সূরাটি এখনো ডিভাইসে সংরক্ষিত নেই। একবার ইন্টারনেটে পড়লে এরপর অফলাইনেও পাওয়া যাবে।", retry: "আবার চেষ্টা করুন", prev: "‹ আগের সূরা", next: "পরের সূরা ›", tr: "অনুবাদ", trOn: "অনুবাদ দেখান", trOff: "অনুবাদ লুকান", bigger: "বড় লেখা", smaller: "ছোট লেখা", jump: "আয়াতে যান", mark: "বুকমার্ক", unmark: "বুকমার্ক সরান", marked: "বুকমার্ক করা", share: "শেয়ার", copy: "কপি", copied: "কপি হয়েছে", marks: "বুকমার্ক", noMarks: "এখনো কোনো বুকমার্ক নেই। যেকোনো আয়াতের নিচে বুকমার্ক আইকনে চাপুন।", all: "সব সূরা", ayah: "আয়াত", source: "পাঠ: Al Quran Cloud · অনুবাদ: {t}", trName: "মুহিউদ্দীন খান", none: "কোনো সূরা পাওয়া যায়নি।" },
    ar: { title: "القرآن الكريم", sub: "١١٤ سورة · الرسم العثماني", search: "ابحث عن سورة بالاسم أو الرقم…", ayahs: "آية", makkah: "مكية", madinah: "مدنية", cont: "متابعة القراءة", contSub: "{s} · الآية {a}", loading: "جارٍ تحميل السورة…", offline: "هذه السورة غير محفوظة على الجهاز بعد. اتصل بالإنترنت مرة واحدة لقراءتها، ثم تبقى متاحة دون اتصال.", retry: "حاول مجددًا", prev: "‹ السورة السابقة", next: "السورة التالية ›", tr: "الترجمة", trOn: "إظهار الترجمة", trOff: "إخفاء الترجمة", bigger: "تكبير الخط", smaller: "تصغير الخط", jump: "انتقل إلى آية", mark: "إشارة مرجعية", unmark: "إزالة الإشارة", marked: "مُعلَّمة", share: "مشاركة", copy: "نسخ", copied: "تم النسخ", marks: "الإشارات المرجعية", noMarks: "لا إشارات بعد. اضغط رمز الإشارة أسفل أي آية.", all: "كل السور", ayah: "آية", source: "النص: Al Quran Cloud", trName: "", none: "لم يتم العثور على سورة." }
  };
  function lang() { var l = document.documentElement.lang || "en"; return T[l] ? l : "en"; }
  function t(k, v) { var s = (T[lang()] || T.en)[k] || T.en[k] || k; if (v) Object.keys(v).forEach(function (x) { s = s.split("{" + x + "}").join(v[x]); }); return s; }
  function trEdition() { return lang() === "bn" ? "bn.bengali" : lang() === "ar" ? "" : "en.sahih"; }
  function num(n) { try { return new Intl.NumberFormat(lang() === "bn" ? "bn-BD" : lang() === "ar" ? "ar-EG" : "en-US").format(n); } catch (e) { return String(n); } }
  function jget(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var ICON = { tr: "M4 5h7|M9 3v2c0 4.4-2.2 8.3-5 10|M5 9c0 2.1 2.9 4.8 7 6|M12 20l4-9 4 9|M19.1 18h-6.2", mark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", marks: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z|M9 8h6", plus: "M12 5v14|M5 12h14", minus: "M5 12h14", share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8|M16 6l-4-4-4 4|M12 2v13" };

  var sheet = null, view = "list", cur = null, hl = 0, q = "", showTr = jget("mhs:quran:tr", true), size = jget("mhs:quran:size", 1.75);
  function marks() { return jget("mhs:quran:marks", []); }
  function isMarked(s, a) { return marks().some(function (m) { return m.s === s && m.a === a; }); }
  function toggleMark(s, a) {
    var m = marks(), on = isMarked(s, a);
    m = on ? m.filter(function (x) { return !(x.s === s && x.a === a); }) : m.concat([{ s: s, a: a, at: Date.now() }]);
    jset("mhs:quran:marks", m.slice(-300));
    window.MHSActions && window.MHSActions.toast(on ? t("unmark") : t("marked"));
  }

  /* ---------- data ---------- */
  var mem = {};
  function key(n) { return "quran:" + n + ":" + (trEdition() || "ar"); }
  function fetchSurah(n) {
    var k = key(n);
    if (mem[k]) return Promise.resolve(mem[k]);
    var store = window.MHS && window.MHS.get ? window.MHS.get(k).catch(function () { return null; }) : Promise.resolve(null);
    return store.then(function (cached) {
      if (cached && cached.ayahs) { mem[k] = cached; return cached; }
      var eds = ["quran-uthmani"].concat(trEdition() ? [trEdition()] : []);
      return fetch(API + n + "/editions/" + eds.join(","), { cache: "force-cache" }).then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); }).then(function (j) {
        var d = Array.isArray(j.data) ? j.data : [j.data];
        var ar = d[0], tr = d[1];
        var out = { n: n, ayahs: ar.ayahs.map(function (a, k) {
          var txt = a.text;
          if (k === 0 && n !== 1 && n !== 9) txt = txt.replace(KAABA_BISMILLAH, "");
          return { a: a.numberInSurah, ar: txt, tr: tr && tr.ayahs[k] ? tr.ayahs[k].text : "" };
        }) };
        mem[k] = out;
        if (window.MHS && window.MHS.set) window.MHS.set(k, out).catch(function () {});
        return out;
      });
    });
  }

  /* ---------- rendering ---------- */
  var E = function (tag, attrs, kids) { return window.MHSSheet.el(tag, attrs, kids); };
  function info(n) { return S[n - 1]; }
  function name(n) { var s = info(n); return lang() === "ar" ? s[1] : s[2]; }
  function render() {
    if (!sheet) return;
    var b = sheet.body; b.replaceChildren(); b.scrollTop = 0;
    sheet.tools.replaceChildren();
    if (view === "list") return renderList(b);
    if (view === "marks") return renderMarks(b);
    renderSurah(b);
  }
  function tool(icon, label, on, fn) { var x = E("button", { type: "button", class: "mhs-mini-ib" + (on ? " is-on" : ""), "aria-label": label, title: label, "aria-pressed": on == null ? null : String(!!on), on: { click: fn } }, [sheet.icon(icon)]); sheet.tools.appendChild(x); return x; }
  function renderList(b) {
    sheet.setTitle(t("title"), t("sub")); sheet.showBack(false); sheet.foot.hidden = true;
    tool(ICON.marks, t("marks"), false, function () { view = "marks"; render(); });
    var last = jget("mhs:quran:last", null);
    if (last && info(last.s)) b.appendChild(E("button", { type: "button", class: "mhs-q-cont", on: { click: function () { openSurah(last.s, last.a); } } }, [
      E("span", null, [E("b", { text: t("cont") }), E("small", { text: t("contSub", { s: name(last.s), a: num(last.a) }) })]), E("span", { class: "ar", text: info(last.s)[1] })]));
    var inp = E("input", { type: "search", value: q, placeholder: t("search"), "aria-label": t("search"), autocomplete: "off", enterkeyhint: "search" });
    var list = E("div", { class: "mhs-mini-list" });
    function fill() {
      list.replaceChildren();
      var qq = q.trim().toLowerCase(), n = 0;
      S.forEach(function (s) {
        if (qq && String(s[0]) !== qq && s[2].toLowerCase().indexOf(qq) < 0 && s[3].toLowerCase().indexOf(qq) < 0 && s[1].indexOf(qq) < 0 && s[2].toLowerCase().replace(/[^a-z]/g, "").indexOf(qq.replace(/[^a-z]/g, "")) < 0) return;
        n++;
        list.appendChild(E("button", { type: "button", class: "mhs-mini-row" + (last && last.s === s[0] ? " is-current" : ""), on: { click: function () { openSurah(s[0]); } } }, [
          E("span", { class: "mhs-mini-num", text: num(s[0]) }),
          E("span", { class: "txt" }, [E("b", { text: lang() === "ar" ? s[1] : s[2] }), E("small", { text: (lang() === "ar" ? "" : s[3] + " · ") + num(s[4]) + " " + t("ayahs") + " · " + (s[5] === "M" ? t("makkah") : t("madinah")) })]),
          lang() === "ar" ? null : E("span", { class: "ar", text: s[1] })]));
      });
      if (!n) list.appendChild(E("p", { class: "mhs-mini-msg", text: t("none") }));
    }
    inp.addEventListener("input", function () { q = inp.value; fill(); });
    b.appendChild(E("div", { class: "mhs-mini-search" }, [inp])); b.appendChild(list); fill();
  }
  function renderMarks(b) {
    sheet.setTitle(t("marks"), t("title")); sheet.showBack(true); sheet.foot.hidden = true;
    sheet.onBack = function () { view = "list"; render(); return true; };
    var m = marks().slice().reverse();
    if (!m.length) { b.appendChild(E("p", { class: "mhs-mini-msg", text: t("noMarks") })); return; }
    var list = E("div", { class: "mhs-mini-list" });
    m.forEach(function (x) { if (!info(x.s)) return; list.appendChild(E("button", { type: "button", class: "mhs-mini-row", on: { click: function () { openSurah(x.s, x.a); } } }, [E("span", { class: "mhs-mini-num", text: num(x.s) + ":" + num(x.a) }), E("span", { class: "txt" }, [E("b", { text: name(x.s) }), E("small", { text: t("ayah") + " " + num(x.a) })]), E("span", { class: "ar", text: info(x.s)[1] })])); });
    b.appendChild(list);
  }
  function openSurah(n, a) {
    n = Math.min(114, Math.max(1, Number(n) || 1)); cur = n; hl = Number(a) || 0; view = "surah"; render();
  }
  function renderSurah(b) {
    var s = info(cur); if (!s) { view = "list"; return render(); }
    sheet.setTitle((lang() === "ar" ? "" : num(cur) + ". ") + name(cur), (lang() === "ar" ? s[2] : s[1]) + " · " + num(s[4]) + " " + t("ayahs")); sheet.showBack(true);
    sheet.onBack = function () { view = "list"; render(); return true; };
    if (trEdition()) tool(ICON.tr, showTr ? t("trOff") : t("trOn"), showTr, function () { showTr = !showTr; jset("mhs:quran:tr", showTr); render(); });
    tool(ICON.minus, t("smaller"), null, function () { size = Math.max(1.1, size - 0.15); jset("mhs:quran:size", size); b.style.setProperty("--mhs-q-size", size + "rem"); });
    tool(ICON.plus, t("bigger"), null, function () { size = Math.min(3, size + 0.15); jset("mhs:quran:size", size); b.style.setProperty("--mhs-q-size", size + "rem"); });
    b.style.setProperty("--mhs-q-size", size + "rem");
    b.appendChild(E("div", { class: "mhs-q-sura" }, [E("div", { class: "ar", text: s[1] }), E("b", { text: name(cur) }), E("small", { text: (lang() === "ar" ? "" : s[3] + " · ") + (s[5] === "M" ? t("makkah") : t("madinah")) + " · " + num(s[4]) + " " + t("ayahs") })]));
    var wrap = E("div"); b.appendChild(E("div", { class: "mhs-mini-spin", role: "status", "aria-label": t("loading") })); b.appendChild(wrap);
    /* footer: jump + prev / next */
    sheet.foot.hidden = false; sheet.foot.replaceChildren();
    var jump = E("input", { type: "number", min: 1, max: s[4], inputmode: "numeric", placeholder: t("ayah"), "aria-label": t("jump") });
    jump.addEventListener("change", function () { var v = Number(jump.value); if (v >= 1 && v <= s[4]) scrollTo(v); });
    jump.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); jump.dispatchEvent(new Event("change")); } });
    sheet.foot.appendChild(E("button", { type: "button", class: "mhs-btn", disabled: cur <= 1 ? "" : null, text: t("prev"), on: { click: function () { openSurah(cur - 1); } } }));
    sheet.foot.appendChild(E("div", { class: "mhs-q-jump" }, [jump]));
    sheet.foot.appendChild(E("button", { type: "button", class: "mhs-btn", disabled: cur >= 114 ? "" : null, text: t("next"), on: { click: function () { openSurah(cur + 1); } } }));
    var want = cur, wantA = hl;
    fetchSurah(cur).then(function (d) {
      if (cur !== want || !sheet) return;
      var spin = b.querySelector(".mhs-mini-spin"); if (spin) spin.remove();
      if (cur !== 1 && cur !== 9) wrap.appendChild(E("div", { class: "mhs-q-bismillah", text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" }));
      d.ayahs.forEach(function (ay) {
        var row = E("div", { class: "mhs-q-ayah" + (ay.a === wantA ? " is-hl" : ""), id: "mhs-q-" + ay.a, "data-a": ay.a });
        var ar = E("div", { class: "ar", lang: "ar" }); ar.appendChild(document.createTextNode(ay.ar + " ")); ar.appendChild(E("span", { class: "n", text: num(ay.a) }));
        row.appendChild(ar);
        if (showTr && ay.tr) row.appendChild(E("div", { class: "tr", text: ay.tr }));
        var on = isMarked(cur, ay.a);
        var mk = E("button", { type: "button", class: on ? "is-on" : "", text: (on ? "★ " : "☆ ") + t("mark"), "aria-pressed": String(on), on: { click: function () { toggleMark(cur, ay.a); var now = isMarked(cur, ay.a); mk.textContent = (now ? "★ " : "☆ ") + t("mark"); mk.className = now ? "is-on" : ""; mk.setAttribute("aria-pressed", String(now)); } } });
        var sh = E("button", { type: "button", text: "↗ " + t("share"), on: { click: function () { window.MHSActions.share(ay.ar + "\n\n" + (ay.tr ? ay.tr + "\n" : "") + "— " + t("title") + " " + cur + ":" + ay.a + " (" + s[2] + ")", t("title")); } } });
        row.appendChild(E("div", { class: "tools" }, [mk, sh]));
        wrap.appendChild(row);
      });
      wrap.appendChild(E("p", { class: "mhs-mini-note", text: t("source", { t: t("trName") }) }));
      if (wantA) setTimeout(function () { scrollTo(wantA, true); }, 60);
      /* remember where the reader is */
      var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) jset("mhs:quran:last", { s: cur, a: Number(e.target.getAttribute("data-a")) || 1 }); }); }, { root: b, threshold: 0.6 }) : null;
      if (io) wrap.querySelectorAll(".mhs-q-ayah").forEach(function (r) { io.observe(r); }); else jset("mhs:quran:last", { s: cur, a: wantA || 1 });
    }).catch(function () {
      if (cur !== want || !sheet) return;
      var spin = b.querySelector(".mhs-mini-spin"); if (spin) spin.remove();
      wrap.appendChild(E("div", { class: "mhs-mini-msg" }, [E("p", { text: t("offline") }), E("button", { type: "button", class: "mhs-btn primary", text: t("retry"), on: { click: function () { render(); } } })]));
    });
  }
  function scrollTo(a, quiet) {
    var row = sheet && sheet.body.querySelector("#mhs-q-" + a); if (!row) return;
    sheet.body.querySelectorAll(".mhs-q-ayah.is-hl").forEach(function (r) { r.classList.remove("is-hl"); });
    row.classList.add("is-hl"); row.scrollIntoView({ block: "center", behavior: quiet ? "instant" : "smooth" });
  }

  window.MHSQuran = {
    surahs: S,
    open: function (o) {
      if (!window.MHSSheet) return;
      if (sheet && sheet.dialog.open) { if (o && o.surah) openSurah(o.surah, o.ayah); return; }
      sheet = window.MHSSheet.open({ id: "mhs-quran", title: t("title"), sub: t("sub"), onClose: function () { sheet = null; } });
      if (o && o.surah) openSurah(o.surah, o.ayah); else { view = "list"; render(); }
    }
  };
})();
