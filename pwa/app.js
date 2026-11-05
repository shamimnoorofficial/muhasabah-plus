/* Muhasabah — PWA runtime: offline service worker, update banner, device backups. */
(function () {
  "use strict";
  var MHS = window.MHS;

  /* ---------- i18n ---------- */
  var T = {
    en: {
      title: "Device backup & offline",
      sub: "Works fully offline. Everything stays on this device.",
      protect: "Data protection",
      protOn: "Protected — the browser won't auto-clear your data",
      protOff: "Not protected — the browser may clear data when storage is low",
      protBtn: "Protect my data",
      used: "Used on device",
      folder: "Automatic folder backup",
      folderHelp: "Pick a folder once (e.g. Documents). A dated backup file is written there automatically after every change, organised in monthly sub-folders.",
      noFolder: "No folder selected",
      connected: "Saving to folder",
      needPerm: "Permission needed to keep saving to",
      choose: "Choose folder",
      change: "Change folder",
      reconnect: "Allow access",
      now: "Back up now",
      lastSaved: "Last folder backup",
      unsupported: "This browser can't write to folders directly. Save or share a backup file instead (e.g. to Files or Google Drive).",
      share: "Save / share backup file",
      points: "Restore points",
      pointsHelp: "One automatic snapshot per day, last 30 days.",
      none: "No restore points yet",
      restore: "Restore",
      confirm: "Tap again",
      saved: "Backup saved",
      failed: "Backup failed",
      updTitle: "Update available",
      updText: "A new version of Muhasabah is ready.",
      updBtn: "Update",
      updDone: "App updated to latest version",
      nudgeTitle: "Time to back up",
      nudgeNever: "Your data is only on this phone. Save a backup file so nothing is lost if the phone is lost or reset.",
      nudgeDays: "Last backup was {d} days ago. Save a fresh copy to stay safe.",
      nudgeBtn: "Back up"
    },
    ar: {
      title: "النسخ الاحتياطي ووضع عدم الاتصال",
      sub: "يعمل بالكامل دون إنترنت. كل شيء يبقى على هذا الجهاز.",
      protect: "حماية البيانات",
      protOn: "محمية — لن يحذف المتصفح بياناتك تلقائياً",
      protOff: "غير محمية — قد يحذف المتصفح البيانات عند امتلاء التخزين",
      protBtn: "احمِ بياناتي",
      used: "المساحة المستخدمة",
      folder: "نسخ احتياطي تلقائي إلى مجلد",
      folderHelp: "اختر مجلداً مرة واحدة. يُكتب ملف نسخة احتياطية مؤرخ تلقائياً بعد كل تغيير، مرتباً في مجلدات شهرية.",
      noFolder: "لم يتم اختيار مجلد",
      connected: "يتم الحفظ في المجلد",
      needPerm: "يلزم إذن لمتابعة الحفظ في",
      choose: "اختر مجلداً",
      change: "تغيير المجلد",
      reconnect: "السماح بالوصول",
      now: "نسخ الآن",
      lastSaved: "آخر نسخة في المجلد",
      unsupported: "هذا المتصفح لا يدعم الكتابة في المجلدات مباشرة. احفظ أو شارك ملف النسخة الاحتياطية بدلاً من ذلك.",
      share: "حفظ / مشاركة ملف النسخة",
      points: "نقاط الاستعادة",
      pointsHelp: "لقطة تلقائية واحدة يومياً، لآخر 30 يوماً.",
      none: "لا توجد نقاط استعادة بعد",
      restore: "استعادة",
      confirm: "اضغط مرة أخرى",
      saved: "تم حفظ النسخة",
      failed: "فشل النسخ",
      updTitle: "تحديث متوفر",
      updText: "إصدار جديد من محاسبة جاهز.",
      updBtn: "تحديث",
      updDone: "تم تحديث التطبيق إلى أحدث إصدار",
      nudgeTitle: "حان وقت النسخ الاحتياطي",
      nudgeNever: "بياناتك على هذا الهاتف فقط. احفظ ملف نسخة احتياطية حتى لا تضيع إذا فُقد الهاتف أو أُعيد ضبطه.",
      nudgeDays: "آخر نسخة احتياطية قبل {d} يوم. احفظ نسخة جديدة.",
      nudgeBtn: "نسخ"
    }
  };
  if (typeof T !== "undefined" && T.en) T.bn = Object.fromEntries(Object.entries(T.en).map(function (pair) { return [pair[0], window.MHSBengali[pair[1]] || pair[1]]; }));
  function lang() { var c = MHS && MHS.current(); return c && ["en", "ar", "bn"].includes(c.lang) ? c.lang : "en"; }
  Object.assign(T.bn, {"protOn": "সুরক্ষিত—ব্রাউজার নিজে থেকে ডেটা মুছবে না", "protOff": "সুরক্ষিত নয়—স্টোরেজ কম থাকলে ব্রাউজার ডেটা মুছতে পারে", "folderHelp": "একবার একটি ফোল্ডার বেছে নিন। প্রতিবার পরিবর্তনের পর সেখানে মাস অনুযায়ী তারিখসহ ব্যাকআপ সংরক্ষিত হবে।", "needPerm": "ব্যাকআপ চালিয়ে যেতে অনুমতি প্রয়োজন", "unsupported": "এই ব্রাউজারে সরাসরি ফোল্ডারে লেখা যায় না। ব্যাকআপ ফাইল সংরক্ষণ বা শেয়ার করুন।", "nudgeNever": "আপনার ডেটা শুধু এই ডিভাইসে আছে। ফোন হারিয়ে গেলে বা রিসেট হলে ডেটা রাখতে ব্যাকআপ নিন।", "nudgeDays": "সর্বশেষ ব্যাকআপ {d} দিন আগে। নতুন ব্যাকআপ নিন।"});
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k]; }

  /* ---------- helpers ---------- */
  function payload(obj) {
    obj = obj || (MHS && MHS.current()) || {};
    return JSON.stringify({
      app: "Muhasabah",
      habits: obj.habits || [],
      todos: obj.todos || [],
      ledger: obj.ledger || [],
      journal: obj.journal || {},
      journalReminder: !!obj.journalReminder,
      lang: obj.lang,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
  function fileName() { return "muhasabah_backup_" + MHS.dayKey() + ".json"; }
  function fmtTime(ts) {
    if (!ts) return "—";
    try { return new Date(ts).toLocaleString(lang() === "ar" ? "ar" : undefined, { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return new Date(ts).toString(); }
  }
  function fmtBytes(b) {
    if (!b && b !== 0) return "—";
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "on") Object.keys(attrs.on).forEach(function (ev) { n.addEventListener(ev, attrs.on[ev]); });
      else if (k === "text") n.textContent = attrs.text;
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function toast(msg) {
    var n = el("div", { class: "mhs-toast", role: "status", text: msg });
    document.body.appendChild(n);
    setTimeout(function () { n.classList.add("out"); }, 2200);
    setTimeout(function () { n.remove(); }, 2700);
  }

  /* ---------- folder backup (File System Access API) ---------- */
  var folderSupported = typeof window.showDirectoryPicker === "function";

  function writeFile(dir, name, text) {
    return dir.getFileHandle(name, { create: true }).then(function (fh) {
      return fh.createWritable();
    }).then(function (w) {
      return w.write(text).then(function () { return w.close(); });
    });
  }

  function folderState() {
    if (!folderSupported || !MHS) return Promise.resolve({ state: "unsupported" });
    return MHS.get("folder").then(function (h) {
      if (!h) return { state: "none" };
      return h.queryPermission({ mode: "readwrite" }).then(function (p) {
        return { state: p === "granted" ? "granted" : "prompt", name: h.name, handle: h };
      });
    }).catch(function () { return { state: "none" }; });
  }

  function backupToFolder(interactive) {
    return MHS.get("folder").then(function (h) {
      if (!h) return false;
      return h.queryPermission({ mode: "readwrite" }).then(function (p) {
        if (p === "granted") return true;
        if (!interactive) return false;
        return h.requestPermission({ mode: "readwrite" }).then(function (r) { return r === "granted"; });
      }).then(function (ok) {
        if (!ok) return false;
        var text = payload();
        var month = MHS.dayKey().slice(0, 7);
        return h.getDirectoryHandle("Muhasabah Backups", { create: true }).then(function (root) {
          return root.getDirectoryHandle(month, { create: true }).then(function (m) {
            return writeFile(m, fileName(), text);
          }).then(function () {
            return writeFile(root, "muhasabah_latest.json", text);
          });
        }).then(function () { return MHS.set("folderLast", Date.now()); }).then(function () { markBackup(); return true; });
      });
    });
  }

  var lastAuto = 0, autoTimer = null;
  function scheduleAuto() {
    if (!folderSupported) return;
    var wait = Math.max(0, 20000 - (Date.now() - lastAuto));
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function () {
      lastAuto = Date.now();
      backupToFolder(false).then(function (ok) { if (ok) refreshPanels(); }).catch(function () {});
    }, wait);
  }
  if (MHS) MHS.onSave(scheduleAuto);

  function shareOrDownload() {
    var text = payload();
    var name = fileName();
    var blob = new Blob([text], { type: "application/json" });
    var file = null;
    try { file = new File([blob], name, { type: "application/json" }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], title: "Muhasabah backup" }).then(markBackup).catch(function (e) {
        if (e && e.name === "AbortError") return;
        download(blob, name); markBackup();
      });
    }
    download(blob, name); markBackup();
    return Promise.resolve();
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = el("a", { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /* ---------- backup reminder ---------- */
  var LB = "muhasabah:lastBackup", FS = "muhasabah:firstSeen", SN = "muhasabah:backupSnooze", DAY = 864e5;
  function lsNum(k) { try { return +localStorage.getItem(k) || 0; } catch (e) { return 0; } }
  function lsSet(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} }
  function markBackup() {
    lsSet(LB, Date.now());
    var bar = document.getElementById("mhs-backup-bar"); if (bar) bar.remove();
  }
  window.addEventListener("mhs:backup", markBackup);
  function maybeNudge() {
    if (!MHS || document.getElementById("mhs-backup-bar") || document.getElementById("mhs-update-bar")) return;
    var d = MHS.current() || {};
    if (!(d.habits && d.habits.length) || !(d.ledger && d.ledger.length)) return;
    var now = Date.now(), last = lsNum(LB), first = lsNum(FS);
    if (!first) { lsSet(FS, now); first = now; }
    if (now < lsNum(SN)) return;
    // Never backed up: remind after 1 day of use. Otherwise every 7 days.
    if (last ? now - last < 7 * DAY : now - first < DAY) return;
    var msg = last ? t("nudgeDays").replace("{d}", Math.floor((now - last) / DAY)) : t("nudgeNever");
    var bar = el("div", { id: "mhs-backup-bar", role: "status", dir: lang() === "ar" ? "rtl" : "ltr" }, [
      el("div", { class: "txt" }, [el("b", { text: "🛡 " + t("nudgeTitle") }), el("span", { text: msg })]),
      el("button", { type: "button", class: "go", on: { click: function () {
        folderState().then(function (f) {
          if (f.state === "granted" || f.state === "prompt") return backupToFolder(true).then(function (ok) { if (!ok) return shareOrDownload(); toast(t("saved")); refreshPanels(); });
          return shareOrDownload();
        }).catch(function () { toast(t("failed")); });
      } } }, [t("nudgeBtn")]),
      el("button", { type: "button", class: "x", "aria-label": "Later", on: { click: function () { lsSet(SN, Date.now() + DAY); bar.remove(); } } }, ["✕"])
    ]);
    document.body.appendChild(bar);
  }
  window.addEventListener("load", function () { setTimeout(maybeNudge, 8000); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") setTimeout(maybeNudge, 3000); });

  /* ---------- <mhs-backup> settings panel ---------- */
  var panels = new Set();
  function refreshPanels() { panels.forEach(function (p) { p.render(); }); }

  function btn(label, onClick, primary) {
    return el("button", { type: "button", class: "mhs-btn" + (primary ? " primary" : ""), on: { click: onClick } }, [label]);
  }

  var Base = window.HTMLElement || function () {};
  class MhsBackup extends Base {
    static get observedAttributes() { return ["lang"]; }
    connectedCallback() { panels.add(this); this.render(); }
    disconnectedCallback() { panels.delete(this); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this;
      var seq = (this._seq = (this._seq || 0) + 1);
      Promise.all([
        MHS.persisted(),
        navigator.storage && navigator.storage.estimate ? navigator.storage.estimate().catch(function () { return {}; }) : Promise.resolve({}),
        folderState(),
        MHS.get("folderLast").catch(function () { return 0; }),
        MHS.listSnapshots().catch(function () { return []; })
      ]).then(function (r) {
        if (seq !== self._seq) return;
        self.draw(r[0], r[1] || {}, r[2], r[3], r[4]);
      });
    }
    draw(persisted, est, folder, folderLast, snaps) {
      var self = this;
      var dir = lang() === "ar" ? "rtl" : "ltr";
      var root = el("div", { class: "panel mhs-panel", dir: dir });

      root.appendChild(el("div", { class: "mhs-head" }, [
        el("h3", { class: "mhs-title", text: t("title") }),
        el("p", { class: "mhs-muted", text: t("sub") })
      ]));

      // Protection
      var prot = el("div", { class: "mhs-row" }, [
        el("div", { class: "mhs-grow" }, [
          el("div", { class: "mhs-label", text: t("protect") }),
          el("div", { class: "mhs-status " + (persisted ? "ok" : "warn"), text: persisted ? t("protOn") : t("protOff") }),
          el("div", { class: "mhs-muted", text: t("used") + ": " + fmtBytes(est.usage) })
        ]),
        persisted ? null : btn(t("protBtn"), function () { MHS.persist().then(function () { self.render(); }); })
      ]);
      root.appendChild(prot);

      // Folder
      var fBox = el("div", { class: "mhs-sec" }, [el("div", { class: "mhs-label", text: t("folder") })]);
      if (folder.state === "unsupported") {
        fBox.appendChild(el("p", { class: "mhs-muted", text: t("unsupported") }));
        fBox.appendChild(el("div", { class: "mhs-actions" }, [btn(t("share"), function () { shareOrDownload(); }, true)]));
      } else {
        fBox.appendChild(el("p", { class: "mhs-muted", text: t("folderHelp") }));
        var status;
        if (folder.state === "granted") status = el("div", { class: "mhs-status ok" }, [t("connected") + ": ", el("b", { text: folder.name + " / Muhasabah Backups" })]);
        else if (folder.state === "prompt") status = el("div", { class: "mhs-status warn" }, [t("needPerm") + " ", el("b", { text: folder.name })]);
        else status = el("div", { class: "mhs-status", text: t("noFolder") });
        fBox.appendChild(status);
        if (folderLast) fBox.appendChild(el("div", { class: "mhs-muted", text: t("lastSaved") + ": " + fmtTime(folderLast) }));
        var acts = el("div", { class: "mhs-actions" });
        if (folder.state === "prompt") acts.appendChild(btn(t("reconnect"), function () { self.runBackup(true); }, true));
        if (folder.state === "granted") acts.appendChild(btn(t("now"), function () { self.runBackup(true); }, true));
        acts.appendChild(btn(folder.state === "none" ? t("choose") : t("change"), function () { self.pick(); }, folder.state === "none"));
        acts.appendChild(btn(t("share"), function () { shareOrDownload(); }));
        fBox.appendChild(acts);
      }
      root.appendChild(fBox);

      // Restore points
      var rBox = el("div", { class: "mhs-sec" }, [
        el("div", { class: "mhs-label", text: t("points") }),
        el("p", { class: "mhs-muted", text: t("pointsHelp") })
      ]);
      if (!snaps.length) rBox.appendChild(el("div", { class: "mhs-muted", text: t("none") }));
      var list = el("div", { class: "mhs-list" });
      snaps.slice(0, 7).forEach(function (day) {
        var b = btn(t("restore"), function () {
          if (!b.dataset.armed) {
            b.dataset.armed = "1"; b.textContent = t("confirm"); b.classList.add("danger");
            setTimeout(function () { if (b.isConnected) { delete b.dataset.armed; b.textContent = t("restore"); b.classList.remove("danger"); } }, 4000);
            return;
          }
          self.restore(day);
        });
        list.appendChild(el("div", { class: "mhs-item" }, [el("span", { class: "num", text: day }), b]));
      });
      rBox.appendChild(list);
      root.appendChild(rBox);

      this.replaceChildren(root);
    }
    pick() {
      var self = this;
      window.showDirectoryPicker({ id: "muhasabah", mode: "readwrite", startIn: "documents" }).then(function (h) {
        return MHS.set("folder", h);
      }).then(function () { return self.runBackup(true); }).catch(function (e) {
        if (e && e.name !== "AbortError") toast(t("failed"));
      });
    }
    runBackup(interactive) {
      var self = this;
      return backupToFolder(interactive).then(function (ok) {
        toast(ok ? t("saved") : t("failed"));
        self.render();
      }).catch(function () { toast(t("failed")); self.render(); });
    }
    restore(day) {
      MHS.getSnapshot(day).then(function (snap) {
        if (!snap || !snap.data) return;
        var cur = MHS.current() || {};
        var data = Object.assign({}, snap.data, { lang: cur.lang || snap.data.lang, onboarded: true });
        // Keep the pre-restore state as its own restore point so the restore can be undone.
        return MHS.set("snap:" + MHS.dayKey() + "-before-restore", { savedAt: Date.now(), data: cur })
          .catch(function () {})
          .then(function () { return MHS.replace(data); })
          .then(function () { location.reload(); });
      }).catch(function () { toast(t("failed")); });
    }
  }
  if (window.customElements && !customElements.get("mhs-backup")) customElements.define("mhs-backup", MhsBackup);

  /* ---------- service worker + update banner ---------- */
  function standalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  var silentUpdate = false;
  function showUpdate(reg) {
    if (!reg.waiting) return;
    function apply() {
      if (document.hidden || document.querySelector('[role="dialog"], .kb-modal-panel') || (document.activeElement && document.activeElement.matches && document.activeElement.matches('input,textarea,select'))) {
        setTimeout(apply, 1500); return;
      }
      try { reg.waiting.postMessage({ type: "SKIP_WAITING" }); } catch (e) {}
    }
    apply();
  }

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    var hadController = !!navigator.serviceWorker.controller;
    var reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!hadController || reloading || silentUpdate) { hadController = true; return; }
      reloading = true;
      try {
        toast("✨ " + t("updDone"));
      } catch (e) {}
      function reloadWhenReady() {
        if (document.hidden || document.querySelector('.kb-modal-panel') || (document.activeElement && document.activeElement.matches && document.activeElement.matches('input,textarea,select'))) {
          setTimeout(reloadWhenReady, 1500);
          return;
        }
        location.reload();
      }
      setTimeout(reloadWhenReady, 500);
    });
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then(function (reg) {
        // Check for updates immediately upon load
        reg.update().catch(function () {});
        if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg);
        reg.addEventListener("updatefound", function () {
          var w = reg.installing;
          if (!w) return;
          w.addEventListener("statechange", function () {
            if (w.state === "installed" && navigator.serviceWorker.controller) showUpdate(reg);
          });
        });
        // Check for updates regularly and when resuming app
        setInterval(function () { reg.update().catch(function () {}); }, 30 * 1000);
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") reg.update().catch(function () {});
        });
        window.addEventListener("focus", function () { reg.update().catch(function () {}); });
        window.addEventListener("online", function () { reg.update().catch(function () {}); });
      }).catch(function () {});
    });
  }

  /* Snapshot once on start so a restore point exists even before the first edit. */
  window.addEventListener("load", function () {
    setTimeout(function () { if (MHS && MHS.current()) MHS.snapshot(MHS.current()).catch(function () {}); }, 4000);
  });
})();
