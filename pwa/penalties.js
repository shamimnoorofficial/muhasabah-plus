/* Pure reconciliation: no storage writes and no penalties before tracking began. */
(function (root) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayKey = value => { const d = new Date(value); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
  function reconcile(habits, ledger, now, since, deadline) {
    const settled = new Set(), excused = new Set();
    for (const entry of ledger || []) {
      if (!entry) continue;
      const day = dayKey(entry.scheduledDay || entry.ts);
      if (entry.type === 'excuse' && !entry.habitId) excused.add(day);
      else if (['checkIn', 'autoPenalty', 'excuse'].includes(entry.type)) settled.add(entry.habitId + ':' + day);
    }
    const result = [];
    for (const habit of habits || []) {
      if (!habit || habit.status !== 'active' || habit.autoPenalty === false) continue;
      const start = new Date(Math.max(since, Number(habit.createdAt) || since));
      start.setHours(0, 0, 0, 0);
      for (let day = new Date(start); day <= now; day.setDate(day.getDate() + 1)) {
        const repeat = habit.repeat || [];
        if (!(repeat.includes(days[day.getDay()]) || repeat.includes('Everyday') || repeat.length === 7)) continue;
        const end = deadline(habit, day), key = dayKey(day), id = habit.id + ':' + key;
        if (!Number.isFinite(end) || end > now.getTime() || Number(habit.createdAt) > end || excused.has(key) || settled.has(id)) continue;
        result.push({id:'p' + id, ts:end + 1, scheduledDay:day.getTime(), delta:-Math.abs(Number(habit.points) || 0), reason:'Missed: ' + habit.title, note:'Auto-penalty • deadline missed', type:'autoPenalty', habitId:habit.id, audit:'auto'});
        settled.add(id);
      }
    }
    return result;
  }
  root.MHSPenalties = {reconcile};
})(typeof window === 'undefined' ? globalThis : window);
