"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e = require("./types");

const {
  CLASS_PROP_TYPE_OFFSET: t,
  MASK_CLASS: s,
  OBJ_DATA_MASK: r,
  CUSTOM_OBJ_DATA_CLASS: n,
} = cc._deserializeCompiled.macros;

class l {
  constructor(e) {
    this.properties = new Map();
    this.nodes = new Array();
    this.setNodeProperties(e);
    this.nodes.push(e);
  }
  setNodeProperties(e) {
    const t = this.properties;
    for (const s of e.simpleKeys) t.set(s, 0);
    for (let s = 0; s < e.advanceds.length; s += 2) {
      let r = e.advanceds[s];
      t.set(r, e.advanceds[s + 1]);
    }
  }
  addNode(e) {
    const t = this.properties;
    let s = false;
    for (const r of e.simpleKeys)
      if (t.has(r)) {
        if (0 !== t.get(r)) {
          return false;
        }
      } else {
        s = true;
      }
    for (let r = 0; r < e.advanceds.length; r += 2) {
      let n = e.advanceds[r];
      if (t.has(n)) {
        if (t.get(n) !== e.advanceds[r + 1]) {
          return false;
        }
      } else {
        s = true;
      }
    }
    return s
      ? (this.setNodeProperties(e), this.nodes.push(e), true)
      : (this.nodes.push(e), true);
  }
  static shouldUseSameMask(e) {
    const t = this.simpleKeys;
    const s = e.simpleKeys;
    const r = this.advanceds;
    const n = e.advanceds;
    if (t.length !== s.length || r.length !== n.length) {
      return false;
    }
    for (let e = 0; e < t.length; ++e) {
      if (t[e] !== s[e]) {
        return false;
      }
    }
    for (let e = 0; e < r.length; e += 2) {
      if (r[e] !== n[e]) {
        return false;
      }
    }
    return true;
  }
  dump(n, a, o) {
    let i = new e.TraceableDict();
    let d = new e.TraceableDict();
    let c = new Array();
    for (let t = 0; t < this.nodes.length; ++t) {
      let n = this.nodes[t];
      let h = c.find(l.shouldUseSameMask, n);
      if (h) {
        o.trace(h, n.dumped, r);
      } else {
        let t = [e.TraceableDict.PLACEHOLDER];
        for (let s = 0; s < n.simpleKeys.length; ++s) {
          let r = n.simpleKeys[s];
          i.traceString(r, t, t.length);
          t.push(e.TraceableDict.PLACEHOLDER);
        }
        let l = t.length;
        for (let s = 0; s < n.advanceds.length; s += 2) {
          let r = n.advanceds[s];
          d.traceString(r, t, t.length);
          t.push(e.TraceableDict.PLACEHOLDER);
        }
        t.push(l);
        a.trace(this, t, s);
        o.trace(n, n.dumped, r).result = t;
        c.push(n);
      }
    }
    let h = i.dump();
    let p = d.dump(h.length);

    let u = [
      n,
      h.concat(p),
      t + 1 - h.length,
      ...p.map((e) => this.properties.get(e)),
    ];

    a.get(this).result = u;
  }
}
function a(e, t) {
  for (const s of e) if (s.addNode(t)) {
    return;
  }
  let s = new l(t);
  e.push(s);
}

exports.default = function (t) {
  let s = new e.TraceableDict();
  let r = new e.TraceableDict();
  let l = new Map();
  for (let r = 0; r < t.length; ++r) {
    let o = t[r];
    let i = o.ctor;
    if (o instanceof e.CustomClassNode) {
      s.traceString(i, o.dumped, n);
      continue;
    }
    let d = l.get(i);

    if (!d) {
      d = [];
      l.set(i, d);
    }

    a(d, o);
  }
  for (const [e, t] of l) for (const n of t) n.dump(e, s, r);
  return { sharedClasses: s.dump(), sharedMasks: r.dump() };
};
