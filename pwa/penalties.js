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
  /* One-shot tasks: penalised once per todo when its deadline passes undone.
   * todoCheckIn / todoPenalty / excuse entries (by todoId) mark the todo as settled. */
  function reconcileTodos(todos, ledger, now, since, deadline) {
    const settled = new Set();
    for (const entry of ledger || []) {
      if (!entry || !entry.todoId) continue;
      if (['todoCheckIn', 'todoPenalty', 'excuse'].includes(entry.type)) settled.add(entry.todoId);
    }
    const result = [];
    for (const todo of todos || []) {
      if (!todo || todo.status === 'done' || todo.status === 'archived' || !Number(todo.penalty) || !todo.deadline) continue;
      if (settled.has(todo.id)) continue;
      const start = Math.max(Number(since) || 0, Number(todo.createdAt) || 0);
      const end = deadline(todo, now);
      if (!Number.isFinite(end) || end > now.getTime() || start > end) continue;
      result.push({
        id: 'pt' + todo.id,
        ts: end + 1,
        scheduledDay: end,
        delta: -Math.abs(Number(todo.penalty) || 0),
        reason: todo.title,
        note: 'Todo • deadline missed',
        type: 'todoPenalty',
        todoId: todo.id,
        audit: 'auto'
      });
      settled.add(todo.id);
    }
    return result;
  }
  root.MHSPenalties = {reconcile, reconcileTodos};
})(typeof window === 'undefined' ? globalThis : window);
