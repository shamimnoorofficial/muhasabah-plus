/* Daily journal. Netlify Database is the durable store; IndexedDB caches offline edits. */
(function () {
  'use strict';
  const M = window.MHS;
  const words = {
    en: ['Journal', 'A little space for your day.', 'Today', 'Search your writing…', 'No matching entries.', 'Write about your day…', 'Saved on this device', 'Saved to journal', 'Offline — saved on this device; sync when online', 'Saving…', 'Save now', 'Evening reminder (20:00)', 'While the app is open, a reminder appears at 20:00.', 'days in a row', 'Daily ledger', 'entries', 'Net points', 'Close', 'Previous month', 'Next month', 'Back to calendar', 'Could not save on this device. Keep this page open and retry.', 'Could not sync — device copy kept. Tap Save now to retry.', 'Time to write about your day', 'Your journal has a device copy and private server storage. Include it in backups to move to another device.'],
    bn: ['দিনলিপি', 'আপনার দিনের জন্য একটু নিজের সময়।', 'আজ', 'পুরোনো লেখায় খুঁজুন…', 'মিলে যায় এমন লেখা নেই।', 'আজকের অনুভূতি, শেখা ও আগামীকালের ইচ্ছা লিখুন…', 'ডিভাইসে সংরক্ষিত', 'দিনলিপি সংরক্ষিত', 'অফলাইন — ডিভাইসে রাখা হয়েছে; ইন্টারনেট এলে সিঙ্ক হবে', 'সংরক্ষণ হচ্ছে…', 'এখন সংরক্ষণ করুন', 'সন্ধ্যার রিমাইন্ডার (রাত ৮টা)', 'অ্যাপ খোলা থাকলে রাত ৮টায় লেখার কথা মনে করিয়ে দেবে।', 'দিন একটানা লেখা', 'দিনের লেজার সারসংক্ষেপ', 'টি এন্ট্রি', 'মোট পয়েন্ট', 'বন্ধ করুন', 'আগের মাস', 'পরের মাস', 'ক্যালেন্ডারে ফিরুন', 'ডিভাইসে সংরক্ষণ হয়নি। পাতা খোলা রেখে আবার চেষ্টা করুন।', 'সিঙ্ক হয়নি — ডিভাইসে কপি আছে। আবার সংরক্ষণ করুন।', 'আজকের দিনলিপি লেখার সময় হয়েছে', 'দিনলিপির কপি ডিভাইসে ও ব্যক্তিগত সার্ভার স্টোরেজে থাকে। অন্য ডিভাইসে নিতে ব্যাকআপ ব্যবহার করুন।'],
    ar: ['اليوميات', 'مساحة صغيرة ليومك.', 'اليوم', 'ابحث في كتاباتك…', 'لا توجد نتائج.', 'اكتب عن يومك…', 'محفوظ على الجهاز', 'تم حفظ اليوميات', 'غير متصل — تتم المزامنة عند الاتصال', 'جارٍ الحفظ…', 'احفظ الآن', 'تذكير مسائي (20:00)', 'يظهر التذكير الساعة 20:00 أثناء فتح التطبيق.', 'أيام متتالية', 'ملخص السجل اليومي', 'إدخالات', 'صافي النقاط', 'إغلاق', 'الشهر السابق', 'الشهر التالي', 'العودة للتقويم', 'تعذر الحفظ. أبق الصفحة مفتوحة وحاول مجدداً.', 'تعذرت المزامنة — النسخة محفوظة على الجهاز.', 'حان وقت كتابة يومياتك', 'تُحفظ نسخة على الجهاز وفي تخزين خاص بالخادم. استخدم النسخ الاحتياطي للنقل.']
  };
  let dialog, selected, month, entries = {}, reminder = false, dirty = new Set(), syncing = false, rerun = false, timer, status = 6, opener, loaded = false;
  const day = d => M.dayKey(d || new Date());
  const lang = () => (M.current() || {}).lang || 'en';
  const t = i => (words[lang()] || words.en)[i];
  const locale = () => ({ bn: 'bn-BD', ar: 'ar', en: 'en-GB' }[lang()] || 'en-GB');
  const n = x => Number(x).toLocaleString(locale());
  function el(tag, text, attrs) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    Object.entries(attrs || {}).forEach(([k,v]) => node.setAttribute(k,v));
    return node;
  }
  function button(text, action, attrs) {
    const b = el('button', text, Object.assign({type:'button'}, attrs)); b.onclick = action; return b;
  }
  function valid(data) {
    const out = {};
    if (!data || typeof data !== 'object' || Array.isArray(data)) return out;
    Object.entries(data).forEach(([date, entry]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date+'T12:00:00').valueOf()) && entry && typeof entry.text === 'string' && entry.text.length <= 100000) {
        out[date] = {text: entry.text, updatedAt: Number.isSafeInteger(entry.updatedAt) ? Math.min(Date.now(), entry.updatedAt) : Date.now()};
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
  async function cache() {
    try { await M.saveJournal(entries, reminder); setStatus(navigator.onLine ? 6 : 8); return true; }
    catch { setStatus(22); return false; }
  }
  async function sync() {
    init();
    if (!navigator.onLine) { setStatus(8); return; }
    if (syncing) { rerun = true; return; }
    syncing = true;
    const batch = [...dirty].map(d => ({day:d, ...entries[d]}));
    try {
      const response = await fetch('/.netlify/functions/journal', {
        method: batch.length ? 'PUT' : 'GET', credentials: 'same-origin', cache: 'no-store',
        headers: batch.length ? {'Content-Type':'application/json'} : {},
        body: batch.length ? JSON.stringify(batch) : undefined,
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw Error('sync');
      const rows = await response.json();
      if (!Array.isArray(rows)) throw Error('sync');
      batch.forEach(e => { if (entries[e.day]?.updatedAt === e.updatedAt) dirty.delete(e.day); });
      rows.forEach(e => { if (!dirty.has(e.day) && (!entries[e.day] || e.updatedAt >= entries[e.day].updatedAt)) entries[e.day] = {text:e.text, updatedAt:e.updatedAt}; });
      if (await cache()) setStatus(dirty.size ? 6 : 7);
      // Never replace an editor that has focus; calendar marks refresh on the next render.
      if (dialog?.open && !selected && document.activeElement?.type !== 'search') render();
    } catch { setStatus(23); }
    finally { syncing = false; if (rerun) { rerun = false; sync(); } }
  }
  function change(date, text) {
    entries = {...entries, [date]: {text, updatedAt:Date.now()}}; dirty.add(date);
    setStatus(9); cache(); clearTimeout(timer); timer = setTimeout(sync, 700);
  }
  function streak() {
    const d = new Date(); let count = 0;
    if (!entries[day(d)]?.text.trim()) d.setDate(d.getDate()-1);
    while (entries[day(d)]?.text.trim()) { count++; d.setDate(d.getDate()-1); }
    return count;
  }
  function open(date) {
    init(); opener = document.activeElement;
    selected = date || null; month = new Date((date || day()).slice(0,7)+'-01T12:00:00');
    dialog = el('dialog', null, {class:'mhs-journal-dialog', 'aria-label':t(0)});
    document.body.append(dialog);
    dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
    dialog.addEventListener('close', () => { dialog.remove(); dialog = null; document.body.style.overflow = ''; opener?.focus(); });
    render(); dialog.showModal(); document.body.style.overflow = 'hidden'; sync();
  }
  function close() { clearTimeout(timer); sync(); dialog.close(); }
  function render() {
    dialog.replaceChildren(); dialog.dir = lang() === 'ar' ? 'rtl' : 'ltr';
    const header = el('header');
    const title = el('div'); title.append(el('p', 'MUHASABAH / '+t(0), {class:'mhs-journal-eyebrow'}), el('h2', selected ? new Date(selected+'T12:00:00').toLocaleDateString(locale(), {weekday:'long',day:'numeric',month:'long',year:'numeric'}) : t(0)), el('p', t(1)));
    header.append(title, button('×',close,{'aria-label':t(18),class:'mhs-journal-close'})); dialog.append(header);
    const body = el('div', null, {class:'mhs-journal-body'});
    if (selected) editor(body); else calendar(body);
    dialog.append(body);
    const footer = el('footer'); footer.append(el('span',t(status),{'data-status':'',role:'status'}), button(t(10),async () => {if(await cache()) sync();})); dialog.append(footer);
  }
  function calendar(body) {
    const tools = el('div',null,{class:'mhs-journal-toolbar'});
    tools.append(button('‹',()=>{month.setMonth(month.getMonth()-1); render();},{'aria-label':t(19)}), el('h3', month.toLocaleDateString(locale(),{month:'long',year:'numeric'})), button('›',()=>{month.setMonth(month.getMonth()+1); render();},{'aria-label':t(20)}), button(t(2),()=>{ selected=day();render(); })); body.append(tools);
    const grid = el('div',null,{class:'mhs-journal-grid'});
    for (let i=0;i<7;i++) grid.append(el('span',new Date(2026,10,1+i).toLocaleDateString(locale(),{weekday:'short'}),{class:'mhs-journal-weekday'}));
    for(let i=0;i<month.getDay();i++) grid.append(el('span'));
    const total = new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    for(let i=1;i<=total;i++) {
      const d=day(new Date(month.getFullYear(),month.getMonth(),i)), has=!!entries[d]?.text.trim();
      const b=button(n(i),()=>{selected=d;render();},{class:(d===day()?'is-today ':'')+(has?'has-entry':''),'aria-label':d+(has?' • '+t(0):'')});
      if(d===day()) b.setAttribute('aria-current','date'); grid.append(b);
    }
    body.append(grid,el('p',n(streak())+' '+t(13),{class:'mhs-journal-streak'}));
    const search=el('input',null,{type:'search',placeholder:t(3),'aria-label':t(3)}), results=el('div',null,{class:'mhs-journal-results'});
    function find() {
      results.replaceChildren(); const query=search.value.trim().toLocaleLowerCase();
      if(!query) return;
      const matches=Object.keys(entries).sort().reverse().filter(d=>entries[d].text.trim() && (d.includes(query)||entries[d].text.toLocaleLowerCase().includes(query)));
      if(!matches.length) results.append(el('p',t(4)));
      matches.forEach(d=>{const b=button('',()=>{selected=d;month=new Date(d.slice(0,7)+'-01T12:00:00');render();});b.append(el('strong',d),el('span',entries[d].text.slice(0,140)));results.append(b);});
    }
    search.oninput=find; body.append(search,results);
    const label=el('label',null,{class:'mhs-journal-reminder'}), check=el('input',null,{type:'checkbox'});
    check.checked=reminder;check.onchange=()=>{reminder=check.checked;cache();};label.append(check,document.createTextNode(t(11)));body.append(label,el('p',t(12),{class:'mhs-journal-note'}),el('p',t(25),{class:'mhs-journal-note'}));
  }
  function editor(body) {
    body.append(button('‹ '+t(21),()=>{selected=null;render();}));
    const rows=((M.current()||{}).ledger||[]).filter(e=>day(new Date(e.ts))===selected);
    const net=rows.reduce((sum,e)=>sum+(Number(e.delta)||0),0);
    const summary=el('section',null,{class:'mhs-journal-summary'});
    summary.append(el('h3',t(14)),el('p',n(rows.length)+' '+t(15)+' · '+t(16)+' '+(net>0?'+':'')+n(net)));
    rows.slice(0,5).forEach(e=>summary.append(el('div',(e.reason||e.type||'')+' · '+n(e.delta||0))));body.append(summary);
    const textarea=el('textarea',null,{placeholder:t(5),'aria-label':t(0),maxlength:'100000',rows:'12'});
    textarea.value=entries[selected]?.text||'';
    const date=selected; textarea.oninput=()=>change(date,textarea.value);body.append(textarea);
  }
  window.MHSJournal = {
    restore(data, enabled) {
      init(); const next=valid(data), now=Date.now();
      Object.keys(entries).forEach(d=>{if(!next[d]) next[d]={text:'',updatedAt:now};});
      Object.keys(next).forEach(d=>{next[d].updatedAt=now;dirty.add(d);});
      entries=next;reminder=!!enabled;cache();sync();
    }
  };
  customElements.define('mhs-journal', class extends HTMLElement {
    static get observedAttributes(){return ['lang'];}
    connectedCallback(){this.draw();}
    attributeChangedCallback(){if(this.isConnected)this.draw();}
    draw(){this.replaceChildren(button('',()=>open(),{'aria-label':t(0),class:'mhs-journal-launch'})); const b=this.firstChild;
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
      const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d','M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 9h2m4 0h2m-8 3h2');svg.append(path);b.append(svg,document.createTextNode(t(0)));
    }
  });
  window.addEventListener('online',sync);
  window.addEventListener('pagehide',()=>{clearTimeout(timer);cache();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync();});
  let reminded='';
  setInterval(()=>{
    if (!M.current()) return; init(); const now=new Date();
    if (!reminder||document.visibilityState!=='visible'||now.getHours()<20||reminded===day()||entries[day()]?.text.trim()||dialog?.open) return;
    reminded=day(); const bar=el('div',null,{class:'mhs-journal-nudge',role:'status'});
    bar.append(button(t(24),()=>{bar.remove();open(day());}),button('×',()=>bar.remove(),{'aria-label':t(18)}));document.body.append(bar);
  },30000);
  // Wait for the app's initial storage load before hydrating the journal cache.
  const ready=setInterval(()=>{if(M.current()){clearInterval(ready);init();sync();}},300);
})();
