/* Muhasabah — on-device storage.
 * Primary store: IndexedDB (large quota, survives better than localStorage).
 * localStorage is kept as a fast, best-effort mirror so older builds still work.
 * Exposes window.MHS for the app bundle and pwa/app.js.
 */
(function () {
  "use strict";
  var KEY = "muhasabah:data:v1";
  var TS = "muhasabah:savedAt";
  var DB = "muhasabah";
  var STORE = "kv";
  var SNAP_PREFIX = "snap:";
  var SNAP_KEEP = 30;

  var dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error("IndexedDB unavailable"));
      var req = indexedDB.open(DB, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
      req.onblocked = function () { reject(new Error("IndexedDB blocked")); };
    });
    dbPromise.catch(function () { dbPromise = null; });
    return dbPromise;
  }

  function tx(mode, fn) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(STORE, mode);
        var out = fn(t.objectStore(STORE));
        t.oncomplete = function () { resolve(out && "result" in out ? out.result : undefined); };
        t.onerror = t.onabort = function () { reject(t.error); };
      });
    });
  }
  function get(k) { return tx("readonly", function (s) { return s.get(k); }); }
  function set(k, v) { return tx("readwrite", function (s) { return s.put(v, k); }); }
  function del(k) { return tx("readwrite", function (s) { return s.delete(k); }); }
  function keys() { return tx("readonly", function (s) { return s.getAllKeys(); }); }

  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); })]);
  }
  function readLocal() {
    try { var r = JSON.parse(localStorage.getItem(KEY)); return r && typeof r === "object" ? r : null; } catch (e) { return null; }
  }
  function localSavedAt() { try { return +localStorage.getItem(TS) || 0; } catch (e) { return 0; } }
  function writeLocal(obj, now) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); localStorage.setItem(TS, String(now)); } catch (e) { /* quota — IndexedDB is primary */ }
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  var last = null;
  var listeners = [];
  var notifyTimer = null;

  var MHS = {
    key: KEY,
    get: get,
    set: set,
    del: del,
    dayKey: dayKey,

    /* Called once by the app before first render. Picks the newest copy. */
    load: function () {
      var local = readLocal();
      return withTimeout(get("data"), 2500).then(function (rec) {
        var data = local;
        if (rec && rec.data && (!local || (rec.savedAt || 0) >= localSavedAt())) data = rec.data;
        if (local && !rec) set("data", { data: local, savedAt: Date.now() }).catch(function () {}); // one-time migration
        last = data || {};
        return last;
      }).catch(function () { last = local || {}; return last; });
    },

    /* Called by the app on every change. */
    save: function (obj) {
      obj = Object.assign({}, obj, { journal: (last && last.journal) || {}, journalReminder: !!(last && last.journalReminder) });
      last = obj;
      var now = Date.now();
      writeLocal(obj, now);
      set("data", { data: obj, savedAt: now }).catch(function () {});
      clearTimeout(notifyTimer);
      notifyTimer = setTimeout(function () {
        MHS.snapshot(obj).catch(function () {});
        listeners.forEach(function (f) { try { f(obj); } catch (e) {} });
      }, 2500);
    },

    current: function () { return last; },
    saveJournal: function (journal, reminder) {
      last = Object.assign({}, last || {}, { journal: journal, journalReminder: !!reminder });
      MHS.save(last);
      return set("data", { data: last, savedAt: Date.now() });
    },
    onSave: function (f) { listeners.push(f); },

    /* Overwrite everything (used by restore), then the caller reloads. */
    replace: function (obj) {
      var now = Date.now();
      last = obj;
      writeLocal(obj, now);
      return set("data", { data: obj, savedAt: now });
    },

    /* Daily restore points kept inside the app (one per day, last 30 days). */
    snapshot: function (obj) {
      if (!obj || (!obj.habits && !obj.ledger)) return Promise.resolve();
      var k = SNAP_PREFIX + dayKey();
      return set(k, { savedAt: Date.now(), data: obj }).then(function () {
        return keys();
      }).then(function (all) {
        var snaps = (all || []).filter(function (x) { return typeof x === "string" && x.indexOf(SNAP_PREFIX) === 0; }).sort();
        var extra = snaps.slice(0, Math.max(0, snaps.length - SNAP_KEEP));
        return Promise.all(extra.map(del));
      });
    },
    listSnapshots: function () {
      return keys().then(function (all) {
        return (all || []).filter(function (x) { return typeof x === "string" && x.indexOf(SNAP_PREFIX) === 0; })
          .sort().reverse().map(function (x) { return x.slice(SNAP_PREFIX.length); });
      });
    },
    getSnapshot: function (day) { return get(SNAP_PREFIX + day); },

    /* Ask the browser never to auto-clear this app's data. */
    persist: function () {
      if (!navigator.storage || !navigator.storage.persist) return Promise.resolve(false);
      return navigator.storage.persisted().then(function (p) { return p || navigator.storage.persist(); }).catch(function () { return false; });
    },
    persisted: function () {
      if (!navigator.storage || !navigator.storage.persisted) return Promise.resolve(false);
      return navigator.storage.persisted().catch(function () { return false; });
    }
  };

  window.MHS = MHS;

  // Chromium grants this silently; other browsers may prompt, so only auto-ask there or when installed.
  try {
    var standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    if (navigator.userAgentData || standalone) MHS.persist();
  } catch (e) {}
})();
