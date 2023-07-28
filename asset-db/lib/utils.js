"use strict";
const t = require("fire-path");
const i = require("fire-fs");
const e = require("chalk");
const s = require("util");
const r = e.green;
const n = e.yellow;
const l = e.red;
const a = e.cyan;
let o = {};
module.exports = o;
let u;
let c;
let h;
let f;
let p;
let m;
let y = global.Editor;
u = console.log;

c = function () {
    let t = s.format.apply(s, arguments);
    console.log(r(t));
  };

f = function () {
    let t = s.format.apply(s, arguments);
    console.info(a(t));
  };

h = y && y.failed
  ? y.failed
  : function () {
      let t = s.format.apply(s, arguments);
      console.log(l(t));
    };

p = y && y.warn
  ? y.warn
  : function () {
  let t = s.format.apply(s, arguments);

  t = t +
  "\n" +
  new Error("dummy").stack.split("\n").splice(2).join("\n");

  console.warn(n(t));
};

m = y && y.error
  ? y.error
  : function () {
  let t = s.format.apply(s, arguments);

  t = t +
  "\n" +
  new Error("dummy").stack.split("\n").splice(2).join("\n");

  console.error(l(t));
};

if (y && y.throw) {
  o.throw = y.throw;
} else {
  o.throw = function (t) {
    let i = [].slice.call(arguments, 1);
    let e = s.format.apply(s, i);
    if ("type" === t) {
      throw new TypeError(e);
    }
    throw new Error(e);
  };
}

o.log = function () {
    if (this.dev && !this.silent) {
      if (this._curTask) {
        let t = [].slice.call(arguments, 1);
        t.unshift("[db-task][%s] " + arguments[0], this._curTask.name);
        u.apply(this, t);
        return;
      }
      u.apply(this, arguments);
    }
  };

o.info = function () {
    if (this.dev && !this.silent) {
      if (this._curTask) {
        let t = [].slice.call(arguments, 1);
        t.unshift("[db-task][%s] " + arguments[0], this._curTask.name);
        f.apply(this, t);
        return;
      }
      f.apply(this, arguments);
    }
  };

o.success = function () {
    if (this.dev && !this.silent) {
      if (this._curTask) {
        let t = [].slice.call(arguments, 1);
        t.unshift("[db-task][%s] " + arguments[0], this._curTask.name);
        c.apply(this, t);
        return;
      }
      c.apply(this, arguments);
    }
  };

o.failed = function () {
    if (!this.silent) {
      if (this._curTask) {
        let t = [].slice.call(arguments, 1);
        t.unshift("[db-task][%s] " + arguments[0], this._curTask.name);
        h.apply(this, t);
        return;
      }
      h.apply(this, arguments);
    }
  };

o.warn = function () {
    if (!this.silent) {
      if (this._curTask) {
        let t = [].slice.call(arguments, 1);
        t.unshift("[db-task][%s] " + arguments[0], this._curTask.name);
        p.apply(this, t);
        return;
      }
      p.apply(this, arguments);
    }
  };

o.error = function () {
    if (!this.silent) {
      if (this._curTask) {
        let t = [].slice.call(arguments, 1);
        t.unshift("[db-task][%s] " + arguments[0], this._curTask.name);
        m.apply(this, t);
        return;
      }
      m.apply(this, arguments);
    }
  };

o.mkdirForAsset = function (e) {
  if (!(e && "" !== e)) {
    this.throw("normal", "Invalid uuid");
  }

  let s = e.substring(0, 2);
  let r = t.join(this._importPath, s);

  if (!i.existsSync(r)) {
    i.mkdirSync(r);
  }

  return r;
};

o.copyAssetToLibrary = function (e, s) {
  let r = this._uuidToImportPathNoExt(e) + t.extname(s);
  this.mkdirForAsset(e);
  i.copySync(s, r);
  return r;
};

o.saveAssetToLibrary = function (e, s, r) {
  let n;

  if ("string" == typeof s || s instanceof Buffer) {
    n = s;
  } else {
    if (s.serialize) {
      n = s.serialize();
    }

    if (!n) {
      n = JSON.stringify(s, null, 2);
    }
  }

  r = r || ".json";
  let l = this.mkdirForAsset(e);
  l = t.join(l, e + r);
  i.writeFileSync(l, n);
  return l;
};

let d = null;

o.updateMtime = function (t) {
  if (!this.isSubAssetByUuid(t)) {
    if (t) {
      let e = this._uuid2path[t];
      if (e && i.existsSync(e)) {
        let s = i.statSync(e).mtime.getTime();
        let r = i.statSync(e + ".meta").mtime.getTime();
        let n = this.getRelativePath(e);
        this._uuid2mtime[t] = { asset: s, meta: r, relativePath: n };
      } else {
        delete this._uuid2mtime[t];
      }
      try {
        i.removeSync(this.getCachePath(t));
      } catch (t) {}
    }

    if (d) {
      clearTimeout(d);
      d = null;
    }

    d = setTimeout(() => {
      let t = JSON.stringify(this._uuid2mtime, null, 2);

      if (i.existsSync(this.library)) {
        i.writeFileSync(this._uuid2mtimePath, t, "utf8");
      }
    }, 50);
  }
};

o.arrayCmpFilter = function (t, i) {
    let e = [];
    for (let s = 0; s < t.length; ++s) {
      let r = t[s];
      let n = true;
      for (let t = 0; t < e.length; ++t) {
        let s = e[t];
        if (r === s) {
          n = false;
          break;
        }
        let l = i(s, r);
        if (l > 0) {
          n = false;
          break;
        }

        if (l < 0) {
          e.splice(t, 1);
          --t;
        }
      }

      if (n) {
        e.push(r);
      }
    }
    return e;
  };

o.padLeft = function (t, i, e) {
    return (i -= (t = t.toString()).length) > 0
      ? new Array(i + 1).join(e) + t
      : t;
  };
