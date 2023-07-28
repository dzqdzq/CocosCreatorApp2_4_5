"use strict";
const t = require("async");
const e = require("fire-path");
const a = require("fire-fs");
const s = require("fsnap");
const h = require("../lib/tasks.js");
function n(s, n, c) {
  let r = [];
  let o = [];
  function d(t, e) {
    let n = t + ".meta";
    if (a.existsSync(n)) {
      if (s.metaBackupPath) {
        let t = h._backupUnusedMeta(s, n, true);

        if (t) {
          o.push(t);
        }
      } else {
        a.unlinkSync(n);
        s.warn(`Delete unused meta file: ${s._url(n)}`);
      }
    }
    h.clearImports(s, t, null, (a, h) => {
      if (a) {
        s.error(`Failed to delete asset ${t}`);
        e();
        return;
      }
      s._dispatchEvent("asset-db:assets-deleted", h);
      e();
    });
  }
  let p = [];
  let l = [];
  for (let t = 0; t < n.length; ++t) {
    let h = n[t];
    let c = h.path;
    if (".meta" !== e.extname(c)) {
      if ("delete" !== h.command) {
        if ("new" !== h.command && "change" !== h.command) {
          Editor.warn(`Unknown changes ${h.command}, ${c}`);
        } else {
          i(l, c);
        }
      } else {
        p.push(c);
      }
    } else {
      let t = h.path;
      let n = e.join(e.dirname(t), e.basenameNoExt(t));
      let c = a.existsSync(n);

      if (("delete" === h.command && c) || "change" === h.command) {
        i(l, n);
      } else {
        if (!("new" !== h.command || c)) {
          a.unlinkSync(t);
          s.warn(`Delete unused meta file: ${s._url(t)}`);
        }
      }
    }
  }
  t.series(
    [
      (e) => {
        t.eachSeries(p, d, e);
      },
      (t) => {
        h.refresh(s, l, (e, a) => {
          if (e) {
            t();
            return;
          }
          s._handleRefreshResults(a);
          t();
        });
      },
    ],
    (t) => {
      s._handleMetaBackupResults(o);

      if (c) {
        c(t, r);
      }
    }
  );
}
function c(t) {
  let e = [];

  t.deletes.forEach((t) => {
    e.push({ command: "delete", path: t });
  });

  t.changes.forEach((t) => {
    e.push({ command: "change", path: t });
  });

  t.creates.forEach((t) => {
    e.push({ command: "new", path: t });
  });

  return e;
}
function i(t, e) {
  if (t.indexOf(e) < 0) {
    t.push(e);
  }
}
function r(t, e) {
  if (t._snapshot) {
    if (e) {
      e(new Error("Failed to watch asset-db, already watched."));
    }

    return;
  }
  let a = t._mountPaths();
  a = a.map((t) => `${t}/**/*`);
  t._snapshot = s.create(a);

  if (e) {
    e();
  }
}
function o(t, e) {
  if (!t._snapshot) {
    if (e) {
      e(new Error("Failed to stop watching asset-db, Already stopped."));
    }

    return;
  }
  let a = t._mountPaths();
  a = a.map((t) => `${t}/**/*`);
  let h = s.create(a);
  let n = s.diff(t._snapshot, h);
  t._snapshot = null;
  let i = c((n = s.simplify(n)));

  if (i.length > 0) {
    t.syncChanges(i);
  }

  if (e) {
    e();
  }
}

module.exports = {
  watchON() {
    this._expectWatchON = true;

    if ("watch-starting" !== this._watchState &&
      "watch-stopping" !== this._watchState &&
      "watch-on" !== this._watchState) {
      this._watchState = "watch-starting";
      this._dispatchEvent("asset-db:watch-state-changed", this._watchState);

      this._tasks.push(
        { name: "watch-on", run: r, params: [], silent: true },
        (t) => {
          this._watchState = "watch-on";

          this._dispatchEvent(
            "asset-db:watch-state-changed",
            this._watchState
          );

          if (false === this._expectWatchON) {
            this.watchOFF();
          }
        }
      );
    }
  },
  watchOFF() {
    this._expectWatchON = false;

    if ("watch-starting" !== this._watchState &&
      "watch-stopping" !== this._watchState &&
      "watch-off" !== this._watchState) {
      this._watchState = "watch-stopping";
      this._dispatchEvent("asset-db:watch-state-changed", this._watchState);

      this._tasks.push(
        { name: "watch-off", run: o, params: [], silent: true },
        (t) => {
          this._watchState = "watch-off";

          this._dispatchEvent(
            "asset-db:watch-state-changed",
            this._watchState
          );

          if (this._expectWatchON) {
            this.watchON();
          }
        }
      );
    }
  },
  submitChanges(t) {
    if (!this._snapshot) {
      if (t) {
        t(new Error("Failed to stop watching asset-db, Already stopped."));
      }

      return;
    }
    let e = this._mountPaths();
    e = e.map((t) => `${t}/**/*`);
    let a = s.create(e);
    let h = s.diff(this._snapshot, a);
    let n = c((h = s.simplify(h)));

    if (n.length > 0) {
      this._snapshot = a;
      this.syncChanges(n);
    }
  },
  syncChanges(t) {
    this._tasks.push(
      { name: "sync-changes", run: n, params: [t] },
      (t, e) => {}
    );
  },
  getWatchState() {
    return this._watchState;
  },
};
