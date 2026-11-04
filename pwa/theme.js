/* The database owns appearance; this controller keeps device-theme changes active across tabs. */
(() => {
  const media = matchMedia('(prefers-color-scheme: light)');
  let current = 'dark';
  const apply = () => {
    const light = current === 'light' || current === 'system' && media.matches;
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.querySelector('meta[name="theme-color"]').content = light ? '#f3f7f4' : '#0a0d14';
  };
  window.MHSTheme = { get: () => current, set: value => { if (['dark','light','system'].includes(value)) { current = value; apply(); } } };
  media.addEventListener('change', apply);
  let edited = false;
  window.addEventListener('mhs:theme-edit', () => { edited = true; });
  fetch('/.netlify/functions/preferences', {signal:AbortSignal.timeout(10000)})
    .then(r => { if (!r.ok) throw Error(); return r.json(); })
    .then(value => { if (value && !edited) window.MHSTheme.set(value.theme); }).catch(() => {});
})();
