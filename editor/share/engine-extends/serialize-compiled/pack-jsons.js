"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e = require("./types");
const t = require("./builder");
const l = require("./create-class-mask");

const {
  EMPTY_PLACEHOLDER: r,
  CUSTOM_OBJ_DATA_CLASS: n,
  ARRAY_ITEM_VALUES: o,
  CLASS_PROP_TYPE_OFFSET: s,
  MASK_CLASS: a,
  OBJ_DATA_MASK: f,
  DICT_JSON_LAYOUT: u,
  PACKED_SECTIONS: c,
} = cc._deserializeCompiled.macros;

function i(t, l, r) {
  let n = t[4][l[f]];
  let o = t[3][n[a]];
  let u = e.ClassNode.fromData(o, n, l);
  r.push(u);
  let c = o[s];
  for (let e = n[n.length - 1]; e < l.length; ++e) {
    let s = o[n[e] + c];
    let a = A[s];

    if (a) {
      a(t, l[e], r);
    }
  }
}
const A = new Array(13);
function d(t, l, n, o) {
  let s = t[1];
  let a = t[2];
  let f = t[10];
  for (let e = 0; e < f.length; ++e) {
    let t = s[f[e]];
    l.traceString(t, f, e);
  }
  if (t[7]) {
    let e = t[7];
    let l = e.length - 1;
    for (let t = 0; t < l; t += 3) {
      const l = e[t + 1];
      if (l >= 0) {
        let r = a[l];
        n.traceString(r, e, t + 1);
      }
    }
  }
  let u = t[9];
  for (let e = 0; e < u.length; ++e) {
    const t = u[e];
    if (t >= 0) {
      let l = a[t];
      n.traceString(l, u, e);
    }
  }
  (function (t, l) {
    let n = t[3];
    let o = t[5];
    let s = t[6];
    let a = s === r ? 0 : s.length;
    let f = o[o.length - 1];
    let u = o.length - a;

    if ("number" == typeof f) {
      --u;
    }

    let c = 0;
    for (; c < u; ++c) {
      i(t, o[c], l);
    }
    if (s) {
      for (let r = 0; r < a; ++r, ++c) {
        let a = s[r];
        let f = o[c];
        if (a >= 0) {
          let t = n[a];
          let o = e.CustomClassNode.fromData(t, [a, f]);
          o.instanceIndex = c;
          l.push(o);
          s[r] = o;
        } else {
          let e = A[(a = ~a)];

          if (e) {
            e(t, f, l);
          }
        }
      }
    }
  })(t, o);
}
A.fill(null);
A[4] = i;

A[10] = function (t, l, r) {
  let o = t[3][l[n]];
  let s = e.CustomClassNode.fromData(o, l);
  r.push(s);
};

A[12] = function (e, t, l) {
    let r = t[o];
    for (let n = 0; n < r.length; ++n) {
      let o = t[n + 1];
      let s = A[o];

      if (s) {
        s(e, r[n], l);
      }
    }
  };

A[9] = (function (e) {
    return function (t, l, r) {
      for (let n = 0; n < l.length; ++n) {
        e(t, l[n], r);
      }
    };
  })(i);

A[11] = function (e, t, l) {
    for (let r = u + 1; r < t.length; r += 3) {
      let n = t[r + 1];
      let o = A[n];

      if (o) {
        o(e, t[r + 2], l);
      }
    }
  };

exports.default = function (r) {
  let o = new e.TraceableDict();
  let s = new e.TraceableDict();
  let a = new Array();
  for (let e = 0; e < r.length; ++e) {
    d(r[e], o, s, a);
  }
  let { sharedClasses: f, sharedMasks: u } = l.default(a);
  for (let t = 0; t < r.length; ++t) {
    let l = r[t];
    let o = l[6];
    if (o) {
      for (let t = 0; t < o.length; ++t) {
        let l = o[t];

        if (l instanceof e.CustomClassNode) {
          o[t] = l.dumped[n];
        }
      }
    }
    l.splice(0, 5);
  }
  let i = new Array(c + 1);
  i[0] = t.FORMAT_VERSION;
  i[1] = t.reduceEmptyArray(o.dump());
  i[2] = t.reduceEmptyArray(s.dump());
  i[3] = f;
  i[4] = t.reduceEmptyArray(u);
  i[c] = r;
  return i;
};
