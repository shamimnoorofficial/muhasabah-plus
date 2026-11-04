/* Point-flow calculations shared by the dashboard and regression checks. */
(function () {
  function day(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function periods(ledger, mode) {
    const groups = new Map();
    const trades = ledger.filter(t => Number.isFinite(Number(t.ts)) && Number.isFinite(Number(t.delta)))
      .map(t => ({ ...t, ts: Number(t.ts), delta: Number(t.delta) })).sort((a, b) => a.ts - b.ts);
    trades.forEach(t => {
      const d = new Date(t.ts);
      if (!Number.isFinite(d.getTime())) return;
      let key = day(d);
      if (mode === 'weekly') {
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);
        key = day(d); // Monday's local date: stable across years and DST.
      } else if (mode === 'monthly') key = key.slice(0, 7);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    });
    let balance = 0;
    return Array.from(groups, ([key, trades]) => {
      const open = balance;
      let high = open, low = open, volume = 0;
      trades.forEach(t => { balance += t.delta; high = Math.max(high, balance); low = Math.min(low, balance); volume += Math.abs(t.delta); });
      return { key, date: key, trades, open, high, low, close: balance, volume };
    }).filter(p => mode !== 'lod' || p.trades.some(t => Math.abs(t.delta) >= 20));
  }
  function average(data, index, size) {
    if (index + 1 < size) return null;
    return data.slice(index - size + 1, index + 1).reduce((sum, p) => sum + p.close, 0) / size;
  }
  window.MHSFlow = { periods, average };
})();
