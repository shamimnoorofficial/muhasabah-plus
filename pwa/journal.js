/* Daily journal — premium diary experience.
 * Netlify Database is the durable store; IndexedDB caches offline edits.
 * Data contract (unchanged): entries = { 'YYYY-MM-DD': { text, updatedAt } }.
 */
(function () {
  'use strict';
  if (!window.MHS) return;
  const M = window.MHS;

  /* ---------- i18n ---------- */
  const quotes = {
    en: [
      { text: 'Take account of yourselves before you are taken account of.', by: 'Umar ibn al-Khattab (RA)' },
      { text: 'A day written down is a day remembered — and a day learned from.', by: 'Muhasabah reflection' },
      { text: 'Small daily reflections build an extraordinary life.', by: 'Muhasabah reflection' },
      { text: 'Your journal is a mirror. Look into it honestly.', by: 'Muhasabah reflection' }
    ],
    bn: [
      { text: 'হিসাব নেওয়ার আগেই নিজের হিসাব নাও।', by: 'উমর ইবনুল খাত্তাব (রা.)' },
      { text: 'যে দিন লিখে রাখা হয়, সে দিন মনে থাকে — আর সে দিন থেকেই শেখা হয়।', by: 'মুহাসাবা' },
      { text: 'প্রতিদিনের ছোট্ট আত্মসমালোচনাই বড় পরিবর্তন আনে।', by: 'মুহাসাবা' },
      { text: 'তোমার দিনলিপি একটা আয়না — সৎ চোখে তাকাও।', by: 'মুহাসাবা' }
    ],
    ar: [
      { text: 'حاسبوا أنفسكم قبل أن تُحاسَبوا.', by: 'عمر بن الخطاب (رض)' },
      { text: 'اليوم المكتوب يومٌ يُتذكَّر — ويُتعلَّم منه.', by: 'محاسبة' },
      { text: 'تأملات يومية صغيرة تصنع حياة عظيمة.', by: 'محاسبة' },
      { text: 'يومياتك مرآة — انظر فيها بصدق.', by: 'محاسبة' }
    ]
  };
  const words = {
    en: { journal: 'Journal', tagline: 'A little space for your day.', today: 'Today', searchPh: 'Search your writing…', noMatch: 'No matching entries.', writePh: 'How was your day? What did you learn? What will you do tomorrow? Write freely…', savedDevice: 'Saved on this device', savedCloud: 'Saved to journal', offline: 'Offline — saved on this device; sync when online', saving: 'Saving…', saveNow: 'Save now', reminder: 'Evening reminder (20:00)', reminderHelp: 'While the app is open, a reminder appears at 20:00.', streakDays: 'days in a row', ledgerTitle: 'Daily ledger', entries: 'entries', netPoints: 'Net points', close: 'Close', prevMonth: 'Previous month', nextMonth: 'Next month', backToCal: '‹ Calendar', cacheFail: 'Could not save on this device. Keep this page open and retry.', syncFail: 'Could not sync — device copy kept. Tap Save now to retry.', nudge: 'Time to write about your day', backupNote: 'Your journal has a device copy and private server storage. Include it in backups to move to another device.', read: 'Read', write: 'Write', edit: 'Edit', openJournal: 'Open Journal', quoteEyebrow: 'A moment for muhasabah', calendar: 'Calendar', diary: 'Diary', words: 'words', minRead: 'min read', newEntry: 'New entry', monthEntries: 'This month', allEntries: 'Recent entries', emptyMonth: 'Nothing written yet this month. Your story starts with one honest line.', emptySearch: 'Nothing found. Try another word.', delete: 'Delete entry', confirmDelete: 'Tap again to delete', deleted: 'Entry deleted', startWriting: 'Start writing', continueWriting: 'Continue writing', dayStreak: 'day streak', totalEntries: 'entries written', totalWords: 'words reflected', quoteOfDay: "Today's reminder", entryFor: 'Entry', jumpToday: 'Jump to today' },
    bn: { journal: 'দিনলিপি', tagline: 'আপনার দিনের জন্য একটু নিজের সময়।', today: 'আজ', searchPh: 'পুরোনো লেখায় খুঁজুন…', noMatch: 'মিলে যায় এমন লেখা নেই।', writePh: 'আজকের দিন কেমন গেল? কী শিখলেন? আগামীকাল কী করবেন? মন খুলে লিখুন…', savedDevice: 'ডিভাইসে সংরক্ষিত', savedCloud: 'দিনলিপি সংরক্ষিত', offline: 'অফলাইন — ডিভাইসে রাখা হয়েছে; ইন্টারনেট এলে সিঙ্ক হবে', saving: 'সংরক্ষণ হচ্ছে…', saveNow: 'এখন সংরক্ষণ করুন', reminder: 'সন্ধ্যার রিমাইন্ডার (রাত ৮টা)', reminderHelp: 'অ্যাপ খোলা থাকলে রাত ৮টায় লেখার কথা মনে করিয়ে দেবে।', streakDays: 'দিন একটানা লেখা', ledgerTitle: 'দিনের লেজার সারসংক্ষেপ', entries: 'টি এন্ট্রি', netPoints: 'মোট পয়েন্ট', close: 'বন্ধ করুন', prevMonth: 'আগের মাস', nextMonth: 'পরের মাস', backToCal: '‹ ক্যালেন্ডার', cacheFail: 'ডিভাইসে সংরক্ষণ হয়নি। পাতা খোলা রেখে আবার চেষ্টা করুন।', syncFail: 'সিঙ্ক হয়নি — ডিভাইসে কপি আছে। আবার সংরক্ষণ করুন।', nudge: 'আজকের দিনলিপি লেখার সময় হয়েছে', backupNote: 'দিনলিপির কপি ডিভাইসে ও ব্যক্তিগত সার্ভার স্টোরেজে থাকে। অন্য ডিভাইসে নিতে ব্যাকআপ ব্যবহার করুন।', read: 'পড়ুন', write: 'লিখুন', edit: 'এডিট', openJournal: 'দিনলিপি খুলুন', quoteEyebrow: 'মুহাসাবার এক মুহূর্ত', calendar: 'ক্যালেন্ডার', diary: 'ডায়েরি', words: 'শব্দ', minRead: 'মিনিট পড়া', newEntry: 'নতুন লেখা', monthEntries: 'এই মাসে', allEntries: 'সাম্প্রতিক লেখা', emptyMonth: 'এই মাসে এখনো কিছু লেখা হয়নি। একটা সৎ লাইন দিয়েই শুরু হোক।', emptySearch: 'কিছু পাওয়া যায়নি। অন্য শব্দ চেষ্টা করুন।', delete: 'লেখা মুছুন', confirmDelete: 'মুছতে আবার চাপুন', deleted: 'লেখা মুছে ফেলা হয়েছে', startWriting: 'লেখা শুরু করুন', continueWriting: 'লেখা চালিয়ে যান', dayStreak: 'দিনের ধারাবাহিকতা', totalEntries: 'টি লেখা', totalWords: 'শব্দের প্রতিফলন', quoteOfDay: 'আজকের স্মরণ', entryFor: 'লেখা', jumpToday: 'আজকের দিনে যান' },
    ar: { journal: 'اليوميات', tagline: 'مساحة صغيرة ليومك.', today: 'اليوم', searchPh: 'ابحث في كتاباتك…', noMatch: 'لا توجد نتائج.', writePh: 'كيف كان يومك؟ ماذا تعلمت؟ ماذا ستفعل غداً؟ اكتب بحرية…', savedDevice: 'محفوظ على الجهاز', savedCloud: 'تم حفظ اليوميات', offline: 'غير متصل — تتم المزامنة عند الاتصال', saving: 'جارٍ الحفظ…', saveNow: 'احفظ الآن', reminder: 'تذكير مسائي (20:00)', reminderHelp: 'يظهر التذكير الساعة 20:00 أثناء فتح التطبيق.', streakDays: 'أيام متتالية', ledgerTitle: 'ملخص السجل اليومي', entries: 'إدخالات', netPoints: 'صافي النقاط', close: 'إغلاق', prevMonth: 'الشهر السابق', nextMonth: 'الشهر التالي', backToCal: '‹ التقويم', cacheFail: 'تعذر الحفظ. أبق الصفحة مفتوحة وحاول مجدداً.', syncFail: 'تعذرت المزامنة — النسخة محفوظة على الجهاز.', nudge: 'حان وقت كتابة يومياتك', backupNote: 'تُحفظ نسخة على الجهاز وفي تخزين خاص بالخادم. استخدم النسخ الاحتياطي للنقل.', read: 'اقرأ', write: 'اكتب', edit: 'حرّر', openJournal: 'افتح اليوميات', quoteEyebrow: 'لحظة محاسبة', calendar: 'التقويم', diary: 'المذكرات', words: 'كلمات', minRead: 'دقائق قراءة', newEntry: 'تدوينة جديدة', monthEntries: 'هذا الشهر', allEntries: 'كتابات حديثة', emptyMonth: 'لا شيء مكتوب بعد هذا الشهر. ابدأ بسطر صادق واحد.', emptySearch: 'لا نتائج. جرّب كلمة أخرى.', delete: 'احذف التدوينة', confirmDelete: 'اضغط مجدداً للحذف', deleted: 'تم حذف التدوينة', startWriting: 'ابدأ الكتابة', continueWriting: 'واصل الكتابة', dayStreak: 'أيام متتالية', totalEntries: 'تدوينات', totalWords: 'كلمات تأمل', quoteOfDay: 'تذكير اليوم', entryFor: 'تدوينة', jumpToday: 'انتقل إلى اليوم' }
  };

  /* ---------- storage / sync (data contract unchanged) ---------- */
  let settings = { fontSize: 'medium', weekStart: '0', reminderTime: '20:00', template: 'free', showLedger: true, goal: 200 }, settingsReady = false, settingsDirty = false, settingsSyncing = false, settingsRerun = false;
  let dialog, selected, month, entries = {}, reminder = false, dirty = new Set(), syncing = false, rerun = false, timer, status = 'savedDevice', opener, loaded = false, view = 'calendar', quoteIdx = 0, focusWrite = false;
  const day = d => M.dayKey(d || new Date());
  const lang = () => (M.current() || {}).lang || 'en';
  const configWords = {
    en: {settings:'Writing preferences',fontSize:'Text size',small:'Small',medium:'Medium',large:'Large',weekStart:'Week starts on',sunday:'Sunday',monday:'Monday',reminderTime:'Reminder time',template:'Writing prompts',free:'Free writing',guided:'Guided reflection',showLedger:'Show daily ledger',goal:'Daily word goal',export:'Export journal',settingsHelp:'Reminders appear while the app is open. Preferences are saved to your private server storage.',prompt:'Gratitude\n\nWhat went well?\n\nWhat can I improve?\n\nMy intention for tomorrow\n',usePrompt:'Insert reflection prompts',more:'Show more',retry:'Retry'},
    bn: {settings:'লেখার পছন্দ',fontSize:'লেখার আকার',small:'ছোট',medium:'মাঝারি',large:'বড়',weekStart:'সপ্তাহের শুরু',sunday:'রবিবার',monday:'সোমবার',reminderTime:'মনে করানোর সময়',template:'লেখার ধরন',free:'মুক্ত লেখা',guided:'প্রশ্নভিত্তিক আত্মপর্যালোচনা',showLedger:'দিনের লেজার দেখান',goal:'দৈনিক শব্দের লক্ষ্য',export:'দিনলিপি এক্সপোর্ট',settingsHelp:'অ্যাপ খোলা থাকলে রিমাইন্ডার দেখা যায়। পছন্দগুলো ব্যক্তিগত সার্ভার স্টোরেজে সংরক্ষিত হয়।',prompt:'আজকের কৃতজ্ঞতা\n\nআজ কী ভালো হয়েছে?\n\nকী উন্নতি করতে পারি?\n\nআগামীকালের নিয়ত\n',usePrompt:'আত্মপর্যালোচনার প্রশ্ন যোগ করুন',more:'আরও দেখুন',retry:'আবার চেষ্টা করুন'},
    ar: {settings:'تفضيلات الكتابة',fontSize:'حجم النص',small:'صغير',medium:'متوسط',large:'كبير',weekStart:'بداية الأسبوع',sunday:'الأحد',monday:'الاثنين',reminderTime:'وقت التذكير',template:'أسلوب الكتابة',free:'كتابة حرة',guided:'تأمل موجّه',showLedger:'عرض السجل اليومي',goal:'هدف الكلمات اليومي',export:'تصدير اليوميات',settingsHelp:'تظهر التذكيرات أثناء فتح التطبيق. تُحفظ التفضيلات في تخزين خاص بالخادم.',prompt:'الامتنان\n\nماذا أحسنت اليوم؟\n\nماذا يمكنني تحسينه؟\n\nنيتي للغد\n',usePrompt:'إضافة أسئلة التأمل',more:'عرض المزيد',retry:'أعد المحاولة'}
  };
  const uxWords = {
    en: {prevDay:'Previous day',nextDay:'Next day',goalOf:'of',goalDone:'Daily goal reached',monthCount:'entries this month',shortcut:'Ctrl/⌘ + S to save',noFuture:'Future day',reminderOn:'Evening reminder',prefsTab:'Settings'},
    bn: {prevDay:'আগের দিন',nextDay:'পরের দিন',goalOf:'/',goalDone:'আজকের লক্ষ্য পূরণ হয়েছে',monthCount:'টি লেখা এই মাসে',shortcut:'সংরক্ষণ করতে Ctrl/⌘ + S',noFuture:'আগামী দিন',reminderOn:'সন্ধ্যার রিমাইন্ডার',prefsTab:'সেটিংস'},
    ar: {prevDay:'اليوم السابق',nextDay:'اليوم التالي',goalOf:'من',goalDone:'تم بلوغ الهدف اليومي',monthCount:'تدوينات هذا الشهر',shortcut:'Ctrl/⌘ + S للحفظ',noFuture:'يوم قادم',reminderOn:'تذكير مسائي',prefsTab:'الإعدادات'}
  };
  const t = k => (uxWords[lang()] || uxWords.en)[k] || (configWords[lang()] || configWords.en)[k] || (words[lang()] || words.en)[k] || words.en[k] || k;
  const locale = () => ({ bn: 'bn-BD', ar: 'ar', en: 'en-GB' }[lang()] || 'en-GB');
  const n = x => Number(x).toLocaleString(locale());
  const quote = () => { const q = quotes[lang()] || quotes.en; return q[quoteIdx % q.length]; };
  const countWords = s => (s.trim().match(/\S+/g) || []).length;
  const readMins = s => { const w = countWords(s); return w ? Math.max(1, Math.ceil(w / 200)) : 0; };
  function el(tag, text, attrs) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }
  function button(text, action, attrs) {
    const b = el('button', text, Object.assign({ type: 'button' }, attrs)); b.onclick = action; return b;
  }
  function icon(svgPath) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', svgPath); svg.append(path);
    return svg;
  }
  const CAL_ICON = 'M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 9h2m4 0h2m-8 3h2';
  const PLUS_ICON = 'M12 5v14M5 12h14';
  const todoLabel = () => ({ en: 'New Todo', bn: 'নতুন টুডু', ar: 'مهمة جديدة' }[lang()] || 'New Todo');
  /* Floating "+" button: opens the Todo List composer (Today tab → New Todo). */
  function openTodoComposer() {
    try { document.dispatchEvent(new CustomEvent('mhs:new-todo')); } catch {}
    const clickNewTodo = () => {
      const hit = [...document.querySelectorAll('button')].find(b => /New Todo|নতুন টুডু|مهمة جديدة/.test(b.textContent || ''));
      if (hit) { hit.click(); return true; }
      return false;
    };
    if (clickNewTodo()) return;
    try {
      history.pushState({ mhs: true, tab: 'today' }, '', '?tab=today');
      window.dispatchEvent(new PopStateEvent('popstate', { state: { mhs: true, tab: 'today' } }));
    } catch {}
    let tries = 0;
    const timer = setInterval(() => { if (clickNewTodo() || ++tries > 25) clearInterval(timer); }, 200);
  }
  function valid(data) {
    const out = {};
    if (!data || typeof data !== 'object' || Array.isArray(data)) return out;
    Object.entries(data).forEach(([date, entry]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date + 'T12:00:00Z').valueOf()) && new Date(date + 'T12:00:00Z').toISOString().slice(0,10) === date && entry && typeof entry.text === 'string' && entry.text.length <= 100000) {
        out[date] = { text: entry.text, updatedAt: Number.isSafeInteger(entry.updatedAt) ? Math.min(Date.now(), entry.updatedAt) : Date.now() };
      }
    });
    return out;
  }
  async function syncSettings(save) {
    if (save) settingsDirty = true;
    if (settingsSyncing) { settingsRerun = true; return; }
    settingsSyncing = true;
    const sent = JSON.stringify(settings);
    try {
      const response = await fetch('/.netlify/functions/journal-settings', { method: settingsDirty ? 'PUT' : 'GET', headers: {'Content-Type':'application/json'}, body: settingsDirty ? JSON.stringify(settings) : undefined, signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw Error();
      const value = await response.json();
      if (JSON.stringify(settings) === sent) { if (value) settings = {...settings, ...value}; settingsDirty = false; }
      settingsReady = true;
      if (dialog?.open && view === 'settings') render();
    } catch { const message = dialog?.querySelector('[data-config-status]'); if (message) message.textContent = t('syncFail'); }
    finally { settingsSyncing = false; if (settingsRerun) { settingsRerun = false; syncSettings(); } }
  }
  function init() {
    if (loaded) return;
    const data = M.current() || {}; entries = valid(data.journal); reminder = !!data.journalReminder;
    Object.keys(entries).forEach(d => dirty.add(d)); loaded = true;
  }
  function setStatus(i) { status = i; const s = dialog && dialog.querySelector('[data-status]'); if (s) { s.textContent = t(i); s.dataset.state = i; } }
  function setCounts(scope, text) {
    const w = countWords(text), m = readMins(text);
    scope.querySelectorAll('[data-words]').forEach(x => x.textContent = n(w) + ' ' + t('words'));
    scope.querySelectorAll('[data-goal]').forEach(x => { x.max = settings.goal; x.value = Math.min(w, settings.goal); x.setAttribute('aria-label', t('goal') + ': ' + w + '/' + settings.goal); });
    scope.querySelectorAll('[data-read]').forEach(x => x.textContent = m ? n(m) + ' ' + t('minRead') : '');
    scope.querySelectorAll('[data-goal-label]').forEach(x => { const done = w >= settings.goal; x.textContent = done ? '🎯 ' + t('goalDone') : n(w) + ' ' + t('goalOf') + ' ' + n(settings.goal); x.classList.toggle('is-done', done); });
    scope.querySelectorAll('[data-goal]').forEach(x => x.classList.toggle('is-done', w >= settings.goal));
  }
  async function cache() {
    try { await M.saveJournal(entries, reminder); setStatus(navigator.onLine ? 'savedDevice' : 'offline'); return true; }
    catch { setStatus('cacheFail'); return false; }
  }
  async function sync() {
    init();
    if (!navigator.onLine) { setStatus('offline'); return; }
    if (syncing) { rerun = true; return; }
    syncing = true;
    const batch = [...dirty].map(d => ({ day: d, ...entries[d] }));
    try {
      const response = await fetch('/.netlify/functions/journal', {
        method: batch.length ? 'PUT' : 'GET', credentials: 'same-origin', cache: 'no-store',
        headers: batch.length ? { 'Content-Type': 'application/json' } : {},
        body: batch.length ? JSON.stringify(batch) : undefined,
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw Error('sync');
      const rows = await response.json();
      if (!Array.isArray(rows)) throw Error('sync');
      batch.forEach(e => { if (entries[e.day]?.updatedAt === e.updatedAt) dirty.delete(e.day); });
      rows.forEach(e => { if (!dirty.has(e.day) && (!entries[e.day] || e.updatedAt >= entries[e.day].updatedAt)) entries[e.day] = { text: e.text, updatedAt: e.updatedAt }; });
      if (await cache()) setStatus(dirty.size ? 'savedDevice' : 'savedCloud');
      if (dialog?.open && view !== 'write' && document.activeElement?.type !== 'search') render();
    } catch { setStatus('syncFail'); }
    finally { syncing = false; if (rerun) { rerun = false; sync(); } }
  }
  function change(date, text) {
    entries = { ...entries, [date]: { text, updatedAt: Date.now() } }; dirty.add(date);
    setStatus('saving'); cache(); clearTimeout(timer); timer = setTimeout(sync, 700);
  }
  function streak() {
    const d = new Date(); let count = 0;
    if (!entries[day(d)]?.text.trim()) d.setDate(d.getDate() - 1);
    while (entries[day(d)]?.text.trim()) { count++; d.setDate(d.getDate() - 1); }
    return count;
  }
  function totalWords() {
    return Object.values(entries).reduce((s, e) => s + countWords(e.text || ''), 0);
  }

  /* ---------- open / close / render ---------- */
  function open(date, opts) {
    init(); opener = document.activeElement;
    focusWrite = !!(opts && opts.focus);
    if (date) { selected = date; view = 'write'; month = new Date(date.slice(0, 7) + '-01T12:00:00'); }
    else { selected = null; view = 'calendar'; month = new Date(day().slice(0, 7) + '-01T12:00:00'); }
    if (dialog?.open) { render(); return; }
    dialog = el('dialog', null, { class: 'mhs-journal-dialog', 'aria-label': t('journal') });
    document.body.append(dialog);
    dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
    dialog.addEventListener('close', () => { dialog.remove(); dialog = null; document.body.style.overflow = ''; document.querySelectorAll('.mhs-journal-fab').forEach(f => f.classList.remove('is-hidden')); opener?.focus?.(); });
    render(); dialog.showModal(); document.body.style.overflow = 'hidden';
    document.querySelectorAll('.mhs-journal-fab').forEach(f => f.classList.add('is-hidden'));
    sync();
  }
  function close() { clearTimeout(timer); sync(); dialog.close(); }
  function render() {
    if (!dialog) return;
    const keepScroll = dialog.scrollTop;
    dialog.replaceChildren(); dialog.dir = lang() === 'ar' ? 'rtl' : 'ltr';
    dialog.dataset.view = view;
    dialog.append(cover(), tabs(), body(), footer());
    dialog.scrollTop = view === 'write' ? 0 : keepScroll;
    const ta = dialog.querySelector('textarea');
    if (ta) { grow(ta); setCounts(dialog, ta.value); if (focusWrite) { focusWrite = false; ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch {} } }
  }
  function grow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(Math.max(ta.scrollHeight + 2, 280), Math.round(window.innerHeight * 0.62)) + 'px'; }
  const shiftDay = (d, by) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + by); return day(x); };
  function cover() {
    const q = quote();
    const header = el('header', null, { class: 'mhs-j-cover' });
    const top = el('div', null, { class: 'mhs-j-cover-top' });
    top.append(el('p', 'MUHASABAH • ' + t('journal'), { class: 'mhs-j-eyebrow' }), button('×', close, { 'aria-label': t('close'), class: 'mhs-j-close' }));
    const title = el('h2', view === 'write' && selected
      ? new Date(selected + 'T12:00:00').toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : t('journal'));
    const sub = el('p', view === 'write' ? t('tagline') : '“' + q.text + '” — ' + q.by, { class: 'mhs-j-quote' });
    const stats = el('div', null, { class: 'mhs-j-stats' });
    const s = streak();
    [[n(s), t('dayStreak'), '🔥'], [n(Object.keys(entries).filter(d => entries[d].text.trim()).length), t('totalEntries'), '✍'], [n(totalWords()), t('totalWords'), '📖']].forEach(([v, l, ic]) => {
      const c = el('div', null, { class: 'mhs-j-stat' });
      c.append(el('span', ic, { class: 'mhs-j-stat-ic', 'aria-hidden': 'true' }), el('b', v), el('span', l));
      stats.append(c);
    });
    if (view === 'write') { header.classList.add('is-compact'); header.append(top, title); }
    else header.append(top, title, sub, stats);
    return header;
  }
  function tabs() {
    const bar = el('nav', null, { class: 'mhs-j-tabs' });
    [['calendar', t('calendar')], ['entries', t('diary')], ['write', selected ? t('edit') : t('write')], ['settings', t('prefsTab')]].forEach(([v, label]) => {
      const b = button(label, () => {
        if (v === 'write' && !selected) selected = day();
        view = v; render();
      }, { class: v === view ? 'is-active' : '' });
      if (v === view) b.setAttribute('aria-current', 'page');
      bar.append(b);
    });
    return bar;
  }
  function body() {
    const wrap = el('div', null, { class: 'mhs-journal-body' });
    if (view === 'calendar') calendar(wrap);
    else if (view === 'entries') diary(wrap);
    else if (view === 'settings') configuration(wrap);
    else editor(wrap);
    return wrap;
  }
  function footer() {
    const f = el('footer');
    f.append(el('span', t(status), { 'data-status': '', 'data-state': status, role: 'status' }), button(t('saveNow'), async () => { clearTimeout(timer); if (await cache()) sync(); }, { title: t('shortcut') }));
    return f;
  }

  /* ---------- calendar view ---------- */
  function calendar(root) {
    const tools = el('div', null, { class: 'mhs-journal-toolbar' });
    tools.append(
      button('‹', () => { month.setMonth(month.getMonth() - 1); render(); }, { 'aria-label': t('prevMonth') }),
      el('h3', month.toLocaleDateString(locale(), { month: 'long', year: 'numeric' })),
      button('›', () => { month.setMonth(month.getMonth() + 1); render(); }, { 'aria-label': t('nextMonth') }),
      button(t('today'), () => { selected = day(); view = 'write'; month = new Date(day().slice(0, 7) + '-01T12:00:00'); focusWrite = true; render(); }, { class: 'mhs-j-today' })
    );
    root.append(tools);
    const grid = el('div', null, { class: 'mhs-journal-grid' });
    for (let i = 0; i < 7; i++) grid.append(el('span', new Date(2026, 10, 1 + i + Number(settings.weekStart)).toLocaleDateString(locale(), { weekday: 'short' }), { class: 'mhs-journal-weekday' }));
    for (let i = 0; i < (month.getDay() - Number(settings.weekStart) + 7) % 7; i++) grid.append(el('span'));
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(), today = day();
    let monthCount = 0;
    for (let i = 1; i <= total; i++) {
      const d = day(new Date(month.getFullYear(), month.getMonth(), i)), text = entries[d]?.text || '', has = !!text.trim(), future = d > today;
      const w = has ? countWords(text) : 0, level = !has ? 0 : w >= settings.goal ? 3 : w >= settings.goal / 2 ? 2 : 1;
      if (has) monthCount++;
      const b = button(n(i), () => { selected = d; view = 'write'; focusWrite = d === today; render(); }, {
        class: [d === today ? 'is-today' : '', has ? 'has-entry lv-' + level : '', future ? 'is-future' : ''].join(' ').trim(),
        'aria-label': new Date(d + 'T12:00:00').toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }) + (has ? ' • ' + n(w) + ' ' + t('words') : future ? ' • ' + t('noFuture') : '')
      });
      if (future) b.disabled = true;
      if (d === today) b.setAttribute('aria-current', 'date'); grid.append(b);
    }
    const summary = el('div', null, { class: 'mhs-j-month-sum' });
    summary.append(el('span', '🔥 ' + n(streak()) + ' ' + t('streakDays')), el('span', '✍ ' + n(monthCount) + ' ' + t('monthCount')));
    root.append(grid, summary);
    const cta = entries[today]?.text.trim() ? t('continueWriting') : t('startWriting');
    root.append(button('✍ ' + cta, () => { selected = today; view = 'write'; month = new Date(today.slice(0, 7) + '-01T12:00:00'); focusWrite = true; render(); }, { class: 'mhs-j-new' }));
  }

  function configuration(root) {
    root.classList.add('mhs-j-config');
    root.append(el('h3', t('settings')), el('p', t('settingsHelp'), {class:'mhs-journal-note'}));
    function field(key, options, type) {
      const label = el('label', t(key));
      const control = el(options ? 'select' : 'input', null, options ? {} : {type: type || 'number'});
      if (options) options.forEach(([value, text]) => control.append(el('option', t(text), {value})));
      if (type === 'checkbox') control.checked = settings[key]; else control.value = settings[key];
      if (key === 'goal') { control.min = 10; control.max = 10000; control.step = 10; }
      control.disabled = !settingsReady;
      control.setAttribute('aria-label', t(key));
      control.onchange = () => {
        if (!control.checkValidity()) { control.reportValidity(); return; }
        settings[key] = type === 'checkbox' ? control.checked : key === 'goal' ? Number(control.value) : control.value;
        syncSettings(true);
      };
      label.append(control); root.append(label);
    }
    field('fontSize', [['small','small'],['medium','medium'],['large','large']]);
    field('weekStart', [['0','sunday'],['1','monday']]);
    field('template', [['free','free'],['guided','guided']]);
    field('goal'); field('reminderTime', null, 'time'); field('showLedger', null, 'checkbox');
    const remind = el('label', t('reminderOn')), check = el('input', null, { type: 'checkbox', 'aria-label': t('reminderOn') });
    check.checked = reminder; check.onchange = () => { reminder = check.checked; cache(); };
    remind.append(check); root.append(remind, el('p', t('backupNote'), { class: 'mhs-journal-note' }));
    root.append(el('p', settingsReady ? '' : t('saving'), {'data-config-status':'',role:'status'}));
    root.append(button(t('retry'), () => syncSettings()));
    root.append(button(t('export'), () => {
      const blob = new Blob([JSON.stringify({app:'Muhasabah',journal:entries,journalReminder:reminder,exportedAt:new Date().toISOString()}, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob), a = el('a', null, {href:url,download:'muhasabah_journal_'+day()+'.json'});
      a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }));
  }

  /* ---------- diary (entries list) view ---------- */
  function diary(root) {
    const search = el('input', null, { type: 'search', placeholder: t('searchPh'), 'aria-label': t('searchPh') });
    const list = el('div', null, { class: 'mhs-j-list' });
    let limit = 30;
    function draw() {
      list.replaceChildren();
      const q = search.value.trim().toLocaleLowerCase();
      let days = Object.keys(entries).filter(d => entries[d].text.trim()).sort().reverse();
      if (q) days = days.filter(d => d.includes(q) || entries[d].text.toLocaleLowerCase().includes(q));
      const shown = days.slice(0, limit);
      if (!shown.length) { list.append(el('p', q ? t('emptySearch') : t('emptyMonth'), { class: 'mhs-j-empty' })); return; }
      let lastMonth = '';
      shown.forEach(d => {
        const text = entries[d].text;
        if (d.slice(0, 7) !== lastMonth) { lastMonth = d.slice(0, 7); list.append(el('h4', new Date(d + 'T12:00:00').toLocaleDateString(locale(), { month: 'long', year: 'numeric' }), { class: 'mhs-j-group' })); }
        const card = button('', () => { selected = d; view = 'write'; month = new Date(d.slice(0, 7) + '-01T12:00:00'); render(); }, { class: 'mhs-j-card' });
        card.append(
          el('strong', new Date(d + 'T12:00:00').toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })),
          el('span', text.slice(0, 160) + (text.length > 160 ? '…' : '')),
          el('em', n(countWords(text)) + ' ' + t('words') + ' · ' + n(readMins(text)) + ' ' + t('minRead'))
        );
        list.append(card);
      });
      if (days.length > limit) list.append(button(t('more'), () => { limit += 30; draw(); }));
    }
    search.oninput = () => { limit = 30; draw(); };
    root.append(search, list);
    draw();
    root.append(button('＋ ' + t('newEntry'), () => { selected = day(); view = 'write'; focusWrite = true; render(); }, { class: 'mhs-j-new' }));
  }

  /* ---------- editor view ---------- */
  function editor(root) {
    if (!selected) { selected = day(); }
    const date = selected;
    const nav = el('div', null, { class: 'mhs-j-daynav' });
    const go = d => { selected = d; month = new Date(d.slice(0, 7) + '-01T12:00:00'); render(); };
    const prev = button(lang() === 'ar' ? '›' : '‹', () => go(shiftDay(date, -1)), { 'aria-label': t('prevDay'), title: t('prevDay') });
    const next = button(lang() === 'ar' ? '‹' : '›', () => go(shiftDay(date, 1)), { 'aria-label': t('nextDay'), title: t('nextDay') });
    if (date >= day()) next.disabled = true;
    const back = button(t('backToCal'), () => { selected = null; view = 'calendar'; render(); }, { class: 'mhs-j-back' });
    nav.append(back, el('span', '', { class: 'mhs-j-spacer' }), prev, date !== day() ? button(t('today'), () => go(day()), { class: 'mhs-j-today' }) : el('span'), next);
    root.append(nav);
    const rows = ((M.current() || {}).ledger || []).filter(e => day(new Date(e.ts)) === date);
    const net = rows.reduce((sum, e) => sum + (Number(e.delta) || 0), 0);
    const summary = el('section', null, { class: 'mhs-journal-summary' });
    summary.append(el('h3', '📊 ' + t('ledgerTitle')), el('p', n(rows.length) + ' ' + t('entries') + ' · ' + t('netPoints') + ' ' + (net > 0 ? '+' : '') + n(net)));
    rows.slice(0, 5).forEach(e => summary.append(el('div', (e.reason || e.type || '') + ' · ' + n(e.delta || 0))));
    if (settings.showLedger) root.append(summary);
    const meta = el('div', null, { class: 'mhs-j-meta' });
    meta.append(el('span', '', { 'data-words': '' }), el('span', '', { 'data-read': '' }), el('span', '', { 'data-goal-label': '', class: 'mhs-j-goal' }));
    const textarea = el('textarea', null, { placeholder: t('writePh'), 'aria-label': t('journal'), maxlength: '100000', rows: '12', class: 'mhs-j-paper' });
    textarea.style.fontSize = {small:'16px',medium:'19px',large:'23px'}[settings.fontSize];
    textarea.value = entries[date]?.text || '';
    if (settings.template === 'guided' && !textarea.value) root.append(button(t('usePrompt'), () => { textarea.value = t('prompt'); change(date, textarea.value); setCounts(root, textarea.value); textarea.focus(); }));
    textarea.oninput = () => { change(date, textarea.value); setCounts(root, textarea.value); grow(textarea); };
    textarea.onkeydown = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); clearTimeout(timer); cache().then(ok => ok && sync()); } };
    root.append(meta, el('progress', null, {'data-goal':'',max:settings.goal,value:0}), textarea);
    const del = button(t('delete'), () => {
      if (!del.dataset.armed) {
        del.dataset.armed = '1'; del.textContent = t('confirmDelete'); del.classList.add('is-danger');
        setTimeout(() => { if (del.isConnected) { delete del.dataset.armed; del.textContent = t('delete'); del.classList.remove('is-danger'); } }, 4000);
        return;
      }
      change(date, ''); textarea.value = ''; setCounts(root, ''); setStatus('saving');
      selected = null; view = 'entries'; render();
    }, { class: 'mhs-j-delete' });
    if (!entries[date]?.text.trim()) del.hidden = true;
    textarea.addEventListener('input', () => { del.hidden = !textarea.value.trim(); });
    root.append(del);
  }

  /* ---------- floating sticky buttons (every section) ---------- */
  // "+" opens the Todo composer; the calendar button above it opens the Journal.
  function ensureFab() {
    if (!document.querySelector('.mhs-journal-fab:not(.mhs-journal-fab--cal)')) {
      const fab = button('', openTodoComposer, { class: 'mhs-journal-fab', 'aria-label': todoLabel(), title: todoLabel() });
      fab.append(icon(PLUS_ICON));
      fab.append(el('span', '', { class: 'mhs-journal-fab-ring', 'aria-hidden': 'true' }));
      document.body.append(fab);
    }
    if (!document.querySelector('.mhs-journal-fab--cal')) {
      const cal = button('', () => open(), { class: 'mhs-journal-fab mhs-journal-fab--cal', 'aria-label': t('openJournal'), title: t('openJournal') });
      cal.append(icon(CAL_ICON));
      document.body.append(cal);
    }
    if (dialog?.open) document.querySelectorAll('.mhs-journal-fab').forEach(f => f.classList.add('is-hidden'));
  }
  // The journal launcher and promo box used to live in the Ledger section; they are no longer shown there.
  function ensurePromo() { document.querySelectorAll('.mhs-journal-promo').forEach(p => p.remove()); }
  function refreshFabLabels() {
    const q = quotes[lang()] || quotes.en; quoteIdx = (quoteIdx + 1) % q.length;
    const fab = document.querySelector('.mhs-journal-fab:not(.mhs-journal-fab--cal)');
    if (fab) { fab.setAttribute('aria-label', todoLabel()); fab.setAttribute('title', todoLabel()); }
    const cal = document.querySelector('.mhs-journal-fab--cal');
    if (cal) { cal.setAttribute('aria-label', t('openJournal')); cal.setAttribute('title', t('openJournal')); }
  }

  /* ---------- boot ---------- */
  window.MHSJournal = {
    open,
    openSettings() { open(); view = 'settings'; render(); syncSettings(); },
    restore(data, enabled) {
      init(); const next = valid(data), now = Date.now();
      Object.keys(entries).forEach(d => { if (!next[d]) next[d] = { text: '', updatedAt: now }; });
      Object.keys(next).forEach(d => { next[d].updatedAt = now; dirty.add(d); });
      entries = next; reminder = !!enabled; cache(); sync();
    }
  };
  customElements.define('mhs-journal', class extends HTMLElement {
    connectedCallback() { this.replaceChildren(); this.hidden = true; }
  });
  // The app bundle re-renders views with React; watch for the ledger header mount/unmount.
  const root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    let pending = false;
    new MutationObserver(() => {
      if (pending) return; pending = true;
      requestAnimationFrame(() => { pending = false; ensurePromo(); ensureFab(); });
    }).observe(root, { childList: true, subtree: true });
  }
  window.addEventListener('online', () => { sync(); syncSettings(); });
  window.addEventListener('pagehide', () => { clearTimeout(timer); cache(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync(); });
  let reminded = '';
  setInterval(() => {
    if (!M.current()) return; init(); const now = new Date();
    if (!reminder || document.visibilityState !== 'visible' || now.getHours() * 60 + now.getMinutes() < Number(settings.reminderTime.slice(0,2)) * 60 + Number(settings.reminderTime.slice(3)) || reminded === day() || entries[day()]?.text.trim() || dialog?.open) return;
    reminded = day(); const bar = el('div', null, { class: 'mhs-journal-nudge', role: 'status' });
    bar.append(button('✍ ' + t('nudge'), () => { bar.remove(); open(day(), { focus: true }); }), button('×', () => bar.remove(), { 'aria-label': t('close') }));
    document.body.append(bar);
  }, 30000);
  setInterval(refreshFabLabels, 8000);
  window.addEventListener('load', () => { ensureFab(); ensurePromo(); });
  // Wait for the app's initial storage load before hydrating the journal cache.
  const ready = setInterval(() => { if (M.current()) { clearInterval(ready); init(); sync(); syncSettings(); ensureFab(); ensurePromo(); } }, 300);
})();
