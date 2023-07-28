"use strict";
const e = require("fire-path");
const t = require("fire-fs");
const r = require("./meta/raw-asset");
let a = {
  RawAssetMeta: r,
  AssetMeta: require("./meta/asset"),
  FolderMeta: require("./meta/folder"),
  defaultMetaType: r,
  create(r, i, n) {
    if (".meta" !== e.extname(i)) {
      r.error("Invalid metapath %s, must use .meta as suffix", i);
      return null;
    }
    let u = a.findCtor(r, r._metaToAssetPath(i));
    if (!u) {
      return null;
    }
    if (!n && t.existsSync(i)) {
      try {
        n = JSON.parse(t.readFileSync(i)).uuid;
      } catch (e) {
        n = null;
      }
    }
    let s = new u(r);

    if (n) {
      s.uuid = n;
    }

    return s;
  },
  createSubMeta(e, t, r) {
    if ("function" != typeof t) {
      e.error("Invalid constructor for sub meta");
      return null;
    }
    let a = new t(e);

    if (r) {
      a.uuid = r;
    }

    return a;
  },
  findCtor(r, i) {
    if (".meta" === e.extname(i)) {
      r.error("Invalid assetpath, must not use .meta as suffix");
      return null;
    }
    let n = e.extname(i);
    let u = t.existsSync(i);
    if (!n && false === u) {
      return a.FolderMeta;
    }
    n = n.toLowerCase();
    let s = t.isDirSync(i);
    let l = r._extname2infos[n];
    if (l) {
      for (let e = 0; e < l.length; ++e) {
        let t = l[e];
        if ((s && !t.folder) || (!s && t.folder)) {
          continue;
        }
        let r = t.ctor;
        if (!r.validate) {
          return r;
        }
        if (u) {
          try {
            if (r.validate(i)) {
              return r;
            }
          } catch (e) {}
        }
      }
    }
    return s ? a.FolderMeta : a.defaultMetaType;
  },
  register: (e, t, r, i) => (
    (t = t.toLowerCase()),
    i === a.RawAssetMeta ||
    (function (e, t) {
      if (e && t) {
        let r = Object.getPrototypeOf(e.prototype);
        for (; r; ) {
          if ((e = r.constructor) === t) {
            return true;
          }
          r = Object.getPrototypeOf(e.prototype);
        }
      }
      return false;
    })(i, a.RawAssetMeta)
      ? "string" != typeof t || "." !== t[0]
        ? (e.warn(
            'Invalid extname %s, must be string and must in the format ".foo"',
            t
          ),
          void 0)
        : (e._extname2infos[t] || (e._extname2infos[t] = []),
          e._extname2infos[t].unshift({ folder: r, ctor: i }),
          void 0)
      : (e.warn(
          "Failed to register meta to %s, the metaCtor is not extended from RawAssetMeta",
          t
        ),
        void 0)
  ),
  unregister(e, t) {
    for (let r in e._extname2infos) if (e._extname2infos[r].ctor === t) {
      delete e._extname2infos[r];
    }
  },
  reset(e) {
    e._extname2infos = Object.create(null);
  },
  isInvalid: (e, t, r) => t.uuid !== r.uuid,
  get: (e, t) => e._uuid2meta[t],
  load(r, i) {
    if (".meta" !== e.extname(i)) {
      r.error("Invalid metapath, must use .meta as suffix");
      return null;
    }
    if (r.isSubAssetByPath(i)) {
      let t = a.load(r, e.dirname(i) + ".meta");
      let n = e.basenameNoExt(i);
      if (!t) {
        return null;
      }
      let u = t.getSubMetas();
      return u && u[n] ? u[n] : null;
    }
    if (!t.existsSync(i)) {
      return null;
    }
    let n;
    try {
      n = JSON.parse(t.readFileSync(i));
    } catch (e) {
      r.failed("Failed to load meta %s, message: %s", i, e.message);
      return null;
    }
    let u = a.create(r, i, n.uuid);
    if (!u) {
      return null;
    }
    if (a.isInvalid(r, u, n)) {
      return null;
    }
    u.deserialize(n);
    r._uuid2meta[u.uuid] = u;
    let s = u.getSubMetas();
    if (s) {
      for (let e in s) {
        let t = s[e];
        r._uuid2meta[t.uuid] = t;
      }
    }
    return u;
  },
  save(r, a, i) {
    if (".meta" !== e.extname(a)) {
      r.error("Invalid metapath, must use .meta as suffix");
      return null;
    }
    let n = i.serialize();
    t.writeFileSync(a, JSON.stringify(n, null, 2));
    r._uuid2meta[i.uuid] = i;
    let u = i.getSubMetas();
    if (u) {
      for (let e in u) {
        let t = u[e];
        r._uuid2meta[t.uuid] = t;
      }
    }
  },
};
module.exports = a;
