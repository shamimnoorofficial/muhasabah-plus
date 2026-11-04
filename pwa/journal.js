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
  let dialog, selected, month, entries = {}, reminder = false, dirty = new Set(), syncing = false, rerun = false, timer, status = 6, opener, loaded = false, view = 'calendar', quoteIdx = 0, focusWrite = false;
  const day = d => M.dayKey(d || new Date());
  const lang = () => (M.current() || {}).lang || 'en';
  const t = k => (words[lang()] || words.en)[k] || words.en[k] || k;
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
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date + 'T12:00:00').valueOf()) && entry && typeof entry.text === 'string' && entry.text.length <= 100000) {
        out[date] = { text: entry.text, updatedAt: Number.isSafeInteger(entry.updatedAt) ? Math.min(Date.now(), entry.updatedAt) : Date.now() };
      }
    });
    return out;
  }
  function init() {
    if (loaded) return;
    const data = M.current() || {}; entries = valid(data.journal); reminder = !!data.journalReminder;
    Object.keys(entries).forEach(d => dirty.add(d)); loaded = true;
  }
  function setStatus(i) { status = i; const s = dialog && dialog.querySelector('[data-status]'); if (s) s.textContent = t(i); }
  function setCounts(scope, text) {
    const w = countWords(text), m = readMins(text);
    scope.querySelectorAll('[data-words]').forEach(x => x.textContent = n(w) + ' ' + t('words'));
    scope.querySelectorAll('[data-read]').forEach(x => x.textContent = m ? n(m) + ' ' + t('minRead') : '');
  }
  async function cache() {
    try { await M.saveJournal(entries, reminder); setStatus(navigator.onLine ? 6 : 8); return true; }
    catch { setStatus(22); return false; }
  }
  async function sync() {
    init();
    if (!navigator.onLine) { setStatus(8); return; }
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
      if (await cache()) setStatus(dirty.size ? 6 : 7);
      if (dialog?.open && view !== 'write' && document.activeElement?.type !== 'search') render();
    } catch { setStatus(23); }
    finally { syncing = false; if (rerun) { rerun = false; sync(); } }
  }
  function change(date, text) {
    entries = { ...entries, [date]: { text, updatedAt: Date.now() } }; dirty.add(date);
    setStatus(9); cache(); clearTimeout(timer); timer = setTimeout(sync, 700);
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
    dialog.addEventListener('close', () => { dialog.remove(); dialog = null; document.body.style.overflow = ''; document.querySelector('.mhs-journal-fab')?.classList.remove('is-hidden'); opener?.focus?.(); });
    render(); dialog.showModal(); document.body.style.overflow = 'hidden';
    document.querySelector('.mhs-journal-fab')?.classList.add('is-hidden');
    sync();
  }
  function close() { clearTimeout(timer); sync(); dialog.close(); }
  function render() {
    if (!dialog) return;
    dialog.replaceChildren(); dialog.dir = lang() === 'ar' ? 'rtl' : 'ltr';
    dialog.append(cover(), tabs(), body(), footer());
    const ta = dialog.querySelector('textarea');
    if (ta) { setCounts(dialog, ta.value); if (focusWrite) { focusWrite = false; ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch {} } }
  }
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
    header.append(top, title, sub, stats);
    return header;
  }
  function tabs() {
    const bar = el('nav', null, { class: 'mhs-j-tabs' });
    [['calendar', t('calendar')], ['entries', t('diary')], ['write', selected ? t('edit') : t('write')]].forEach(([v, label]) => {
      const b = button(label, () => {
        if (v === 'write' && !selected) selected = day();
        view = v; render();
      }, { class: v === view ? 'is-active' : '', 'aria-current': v === view ? 'page' : null });
      bar.append(b);
    });
    return bar;
  }
  function body() {
    const wrap = el('div', null, { class: 'mhs-journal-body' });
    if (view === 'calendar') calendar(wrap);
    else if (view === 'entries') diary(wrap);
    else editor(wrap);
    return wrap;
  }
  function footer() {
    const f = el('footer');
    f.append(el('span', t(status), { 'data-status': '', role: 'status' }), button(t('saveNow'), async () => { if (await cache()) sync(); }));
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
    for (let i = 0; i < 7; i++) grid.append(el('span', new Date(2026, 10, 1 + i).toLocaleDateString(locale(), { weekday: 'short' }), { class: 'mhs-journal-weekday' }));
    for (let i = 0; i < month.getDay(); i++) grid.append(el('span'));
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= total; i++) {
      const d = day(new Date(month.getFullYear(), month.getMonth(), i)), has = !!entries[d]?.text.trim();
      const b = button(n(i), () => { selected = d; view = 'write'; render(); }, { class: (d === day() ? 'is-today ' : '') + (has ? 'has-entry' : ''), 'aria-label': d + (has ? ' • ' + t('journal') : '') });
      if (d === day()) b.setAttribute('aria-current', 'date'); grid.append(b);
    }
    root.append(grid, el('p', '🔥 ' + n(streak()) + ' ' + t('streakDays'), { class: 'mhs-journal-streak' }));
    const search = el('input', null, { type: 'search', placeholder: t('searchPh'), 'aria-label': t('searchPh') });
    const results = el('div', null, { class: 'mhs-journal-results' });
    search.oninput = () => {
      results.replaceChildren(); const q = search.value.trim().toLocaleLowerCase();
      if (!q) return;
      const matches = Object.keys(entries).sort().reverse().filter(d => entries[d].text.trim() && (d.includes(q) || entries[d].text.toLocaleLowerCase().includes(q)));
      if (!matches.length) results.append(el('p', t('emptySearch'), { class: 'mhs-j-empty' }));
      matches.slice(0, 20).forEach(d => {
        const b = button('', () => { selected = d; view = 'write'; month = new Date(d.slice(0, 7) + '-01T12:00:00'); render(); });
        b.append(el('strong', d), el('span', entries[d].text.slice(0, 140)));
        results.append(b);
      });
    };
    root.append(search, results);
    const label = el('label', null, { class: 'mhs-journal-reminder' });
    const check = el('input', null, { type: 'checkbox' });
    check.checked = reminder; check.onchange = () => { reminder = check.checked; cache(); };
    label.append(check, document.createTextNode(t('reminder')));
    root.append(label, el('p', t('reminderHelp'), { class: 'mhs-journal-note' }), el('p', t('backupNote'), { class: 'mhs-journal-note' }));
  }

  /* ---------- diary (entries list) view ---------- */
  function diary(root) {
    const search = el('input', null, { type: 'search', placeholder: t('searchPh'), 'aria-label': t('searchPh') });
    const list = el('div', null, { class: 'mhs-j-list' });
    function draw() {
      list.replaceChildren();
      const q = search.value.trim().toLocaleLowerCase();
      let days = Object.keys(entries).filter(d => entries[d].text.trim()).sort().reverse();
      if (q) days = days.filter(d => d.includes(q) || entries[d].text.toLocaleLowerCase().includes(q));
      const shown = days.slice(0, 30);
      if (!shown.length) { list.append(el('p', q ? t('emptySearch') : t('emptyMonth'), { class: 'mhs-j-empty' })); return; }
      shown.forEach(d => {
        const text = entries[d].text;
        const card = button('', () => { selected = d; view = 'write'; month = new Date(d.slice(0, 7) + '-01T12:00:00'); render(); }, { class: 'mhs-j-card' });
        card.append(
          el('strong', new Date(d + 'T12:00:00').toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })),
          el('span', text.slice(0, 160) + (text.length > 160 ? '…' : '')),
          el('em', n(countWords(text)) + ' ' + t('words'))
        );
        list.append(card);
      });
    }
    search.oninput = draw;
    root.append(search, list);
    draw();
    root.append(button('＋ ' + t('newEntry'), () => { selected = day(); view = 'write'; focusWrite = true; render(); }, { class: 'mhs-j-new' }));
  }

  /* ---------- editor view ---------- */
  function editor(root) {
    if (!selected) { selected = day(); }
    const date = selected;
    root.append(button(t('backToCal'), () => { selected = null; view = 'calendar'; render(); }, { class: 'mhs-j-back' }));
    const rows = ((M.current() || {}).ledger || []).filter(e => day(new Date(e.ts)) === date);
    const net = rows.reduce((sum, e) => sum + (Number(e.delta) || 0), 0);
    const summary = el('section', null, { class: 'mhs-journal-summary' });
    summary.append(el('h3', '📊 ' + t('ledgerTitle')), el('p', n(rows.length) + ' ' + t('entries') + ' · ' + t('netPoints') + ' ' + (net > 0 ? '+' : '') + n(net)));
    rows.slice(0, 5).forEach(e => summary.append(el('div', (e.reason || e.type || '') + ' · ' + n(e.delta || 0))));
    root.append(summary);
    const meta = el('div', null, { class: 'mhs-j-meta' });
    meta.append(el('span', '', { 'data-words': '' }), el('span', '', { 'data-read': '' }));
    const textarea = el('textarea', null, { placeholder: t('writePh'), 'aria-label': t('journal'), maxlength: '100000', rows: '12', class: 'mhs-j-paper' });
    textarea.value = entries[date]?.text || '';
    textarea.oninput = () => { change(date, textarea.value); setCounts(root, textarea.value); };
    root.append(meta, textarea);
    const del = button(t('delete'), () => {
      if (!del.dataset.armed) {
        del.dataset.armed = '1'; del.textContent = t('confirmDelete'); del.classList.add('is-danger');
        setTimeout(() => { if (del.isConnected) { delete del.dataset.armed; del.textContent = t('delete'); del.classList.remove('is-danger'); } }, 4000);
        return;
      }
      change(date, ''); textarea.value = ''; setCounts(root, ''); setStatus(7);
      selected = null; view = 'entries'; render();
    }, { class: 'mhs-j-delete' });
    if (!entries[date]?.text.trim()) del.hidden = true;
    textarea.addEventListener('input', () => { del.hidden = !textarea.value.trim(); });
    root.append(del);
  }

  /* ---------- floating sticky button (Meta-AI style, every section) ---------- */
  function ensureFab() {
    if (document.querySelector('.mhs-journal-fab')) return;
    const fab = button('', openTodoComposer, { class: 'mhs-journal-fab', 'aria-label': todoLabel(), title: todoLabel() });
    fab.append(icon(PLUS_ICON));
    fab.append(el('span', '', { class: 'mhs-journal-fab-ring', 'aria-hidden': 'true' }));
    document.body.append(fab);
  }

  /* ---------- ledger promo banner: quote + Read / Write / Edit ---------- */
  let promoTimer = 0;
  function ensurePromo() {
    const host = document.querySelector('mhs-journal');
    let promo = document.querySelector('.mhs-journal-promo');
    if (!host) { promo?.remove(); return; }
    const section = host.parentElement?.parentElement;
    if (!section || !section.contains(host)) return;
    if (!promo || promo.parentElement !== section) {
      promo?.remove();
      promo = el('section', null, { class: 'mhs-journal-promo', 'aria-label': t('journal') });
      const header = host.parentElement;
      header.after ? header.after(promo) : section.append(promo);
    }
    drawPromo(promo);
  }
  function drawPromo(promo) {
    promo.replaceChildren(); promo.dir = lang() === 'ar' ? 'rtl' : 'ltr';
    const q = quote();
    const left = el('div', null, { class: 'mhs-jp-text' });
    left.append(
      el('p', '✨ ' + t('quoteEyebrow'), { class: 'mhs-jp-eyebrow' }),
      el('blockquote', '“' + q.text + '”', {}),
      el('cite', '— ' + q.by, {})
    );
    const actions = el('div', null, { class: 'mhs-jp-actions' });
    actions.append(
      button('📖 ' + t('read'), () => open(null, {}), { class: 'mhs-jp-btn' }),
      button('✍ ' + t('write'), () => open(day(), { focus: true }), { class: 'mhs-jp-btn is-primary' }),
      button('🗓 ' + t('edit'), () => open(), { class: 'mhs-jp-btn' })
    );
    const go = button(t('openJournal') + ' →', () => open(), { class: 'mhs-jp-go' });
    promo.append(left, actions, go);
    promo.querySelectorAll('button').forEach(b => b.type = 'button');
  }
  function rotateQuote() {
    const q = quotes[lang()] || quotes.en;
    quoteIdx = (quoteIdx + 1) % q.length;
    const promo = document.querySelector('.mhs-journal-promo');
    if (promo && promo.isConnected) drawPromo(promo);
    const fab = document.querySelector('.mhs-journal-fab');
    if (fab) { fab.setAttribute('aria-label', todoLabel()); fab.setAttribute('title', todoLabel()); }
  }

  /* ---------- boot ---------- */
  window.MHSJournal = {
    open,
    restore(data, enabled) {
      init(); const next = valid(data), now = Date.now();
      Object.keys(entries).forEach(d => { if (!next[d]) next[d] = { text: '', updatedAt: now }; });
      Object.keys(next).forEach(d => { next[d].updatedAt = now; dirty.add(d); });
      entries = next; reminder = !!enabled; cache(); sync();
    }
  };
  customElements.define('mhs-journal', class extends HTMLElement {
    static get observedAttributes() { return ['lang']; }
    connectedCallback() { this.draw(); queuePromo(); }
    attributeChangedCallback() { if (this.isConnected) { this.draw(); queuePromo(); } }
    draw() {
      this.replaceChildren();
      const b = button('', () => open(), { 'aria-label': t('openJournal'), class: 'mhs-journal-launch' });
      b.append(icon(CAL_ICON), el('span', '🗓 ' + t('journal')));
      const shimmer = el('span', '', { class: 'mhs-j-shimmer', 'aria-hidden': 'true' });
      b.append(shimmer);
      this.append(b);
    }
  });
  let promoQueued = false;
  function queuePromo() {
    if (promoQueued) return; promoQueued = true;
    requestAnimationFrame(() => { promoQueued = false; ensurePromo(); });
  }
  // The app bundle re-renders views with React; watch for the ledger header mount/unmount.
  const root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    let pending = false;
    new MutationObserver(() => {
      if (pending) return; pending = true;
      requestAnimationFrame(() => { pending = false; ensurePromo(); ensureFab(); });
    }).observe(root, { childList: true, subtree: true });
  }
  window.addEventListener('online', sync);
  window.addEventListener('pagehide', () => { clearTimeout(timer); cache(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync(); });
  let reminded = '';
  setInterval(() => {
    if (!M.current()) return; init(); const now = new Date();
    if (!reminder || document.visibilityState !== 'visible' || now.getHours() < 20 || reminded === day() || entries[day()]?.text.trim() || dialog?.open) return;
    reminded = day(); const bar = el('div', null, { class: 'mhs-journal-nudge', role: 'status' });
    bar.append(button('✍ ' + t('nudge'), () => { bar.remove(); open(day(), { focus: true }); }), button('×', () => bar.remove(), { 'aria-label': t('close') }));
    document.body.append(bar);
  }, 30000);
  promoTimer = setInterval(rotateQuote, 8000);
  window.addEventListener('load', () => { ensureFab(); ensurePromo(); });
  // Wait for the app's initial storage load before hydrating the journal cache.
  const ready = setInterval(() => { if (M.current()) { clearInterval(ready); init(); sync(); ensureFab(); ensurePromo(); } }, 300);
})();
