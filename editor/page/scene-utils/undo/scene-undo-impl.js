"use strict";

var e = [
    "_parent",
    "_children",
    "parent",
    "children",
    "rotationX",
    "rotationY",
    "rotation",
  ];

var t = cc.Class.Attr.DELIMETER + "hasGetter";
var r = cc.Class.Attr.DELIMETER + "hasSetter";
var n = cc.Class.Attr.DELIMETER + "serializable";
function o(e) {
  return e instanceof cc.ValueType ? e.clone() : e;
}
function c(e, t, r, n) {
  r = r || o;
  let c = {};
  if (n) {
    for (let o = 0; o < t.length; o++) {
      let s = t[o];

      if (n(s)) {
        c[s] = r(e[s]);
      }
    }
  } else {
    for (let n = 0; n < t.length; n++) {
      let o = t[n];
      c[o] = r(e[o]);
    }
  }
  return c;
}
function s(e) {
  return e && "object" == typeof e
    ? Array.isArray(e) || ArrayBuffer.isView(e)
      ? e.map(o)
      : e.constructor === Object
      ? c(e, Object.getOwnPropertyNames(e))
      : o(e)
    : e;
}
function i(o) {
  if (!o || "object" != typeof o) {
    Editor.error("Unknown object to record");
    return;
  }
  if (Array.isArray(o) || ArrayBuffer.isView(o)) {
    return o.map(s);
  }
  var i = o.constructor;
  if (i === Object) {
    return c(o, Object.getOwnPropertyNames(o), s);
  }
  if (cc.Class._isCCClass(i)) {
    var a = i.__props__;
    var f = cc.Class.Attr.getClassAttrs(i);

    var u = c(o, a, s, function (c) {
      var s = f[c + t];
      return (!(!s && false === f[c + n]) &&
      s === f[c + r] &&
      (!o.hasOwnProperty(c) || "function" !== o[c]) && (!cc.Node.isNode(o) || !e.includes(c)));
    });

    if (o.__asyncStates) {
      u.__asyncStates = JSON.parse(JSON.stringify(o.__asyncStates));
    }

    return u;
  }
  Editor.error("Unknown object to record");
}
function a(e, t) {
  return t && e && "object" == typeof t
    ? t.constructor !== e.constructor
      ? t
      : Array.isArray(t) || ArrayBuffer.isView(t)
      ? (f(e, t), e)
      : e.constructor === Object
      ? (u(e, t), e)
      : o(t)
    : t;
}
function f(e, t, r) {
  var n;
  var c = t.length;

  if (Array.isArray(e)) {
    e.length = t.length;
  }

  if (r) {
    for (n = 0; n < c; n++) {
      e[n] = r(e[n], t[n]);
    }
  } else {
    for (n = 0; n < c; n++) {
      e[n] = o(t[n]);
    }
  }
}
function u(e, t, r) {
  var n;
  for (n in e) if (!(n in t)) {
    delete e[n];
  }
  if (r) {
    for (n in t) e[n] = r(e[n], t[n]);
  } else {
    for (n in t) e[n] = o(t[n]);
  }
}
function l(e, t) {
  var r;
  var n;
  var o;

  if (e instanceof cc.Object &&
    cc.Object._willDestroy(e)) {
    if (!(!cc.isValid(t) || cc.Object._willDestroy(t))) {
      cc.Object._cancelDestroy(e);
    }
  }

  if (!("function" == typeof e.onRestore)) {
    for (o in t)
      if ((r = cc.js.getPropertyDescriptor(e, o)) && r.set) {
        n = a(e[o], t[o]);
        var c = e[o];
        if (n !== c) {
          if (n instanceof cc.ValueType) {
            if (n.equals(c)) {
              continue;
            }
          } else {
            if (c instanceof cc.ValueType && c.equals(n)) {
              continue;
            }
          }
          e[o] = n;
        }
      }
  }
  for (o in t) {
    if ((r = Object.getOwnPropertyDescriptor(e, o)) && "value" in r) {
      if (r.writable) {
        e[o] = a(e[o], t[o]);
      }
    }
  }
  (function (e, t) {
    var r = t.__asyncStates;
    if (r) {
      for (var n in r) {
        var o = r[n];

        if ("start" === o.state) {
          Editor.setAsset(e, n, o.uuid);
        }
      }
    }
  })(e, t);
}
function d(e, t) {
  p(e, t);
  y(e);
}
function p(e, t) {
  if (!e || "object" != typeof e) {
    return Editor.error("Unknown object to restore");
  }
  if (!t) {
    return Editor.error("Invalid record to restore");
  }
  if (Array.isArray(e) || ArrayBuffer.isView(e)) {
    f(e, t, a);
  } else {
    var r = e.constructor;

    if (r === Object) {
      u(e, t, a);
    } else {
      if (cc.Class._isCCClass(r)) {
        l(e, t);
      } else {
        Editor.error("Unknown object to restore");
      }
    }
  }
}
function y(e) {
  var t = e.constructor;

  if (cc.Class._isCCClass(t) && "function" == typeof e.onRestore) {
    e.onRestore();
  }
}
function b(e) {
  e._objFlags &= cc.Object.Flags.PersistentMask;
  e._objFlags &= ~cc.Object.Flags.Destroyed;

  if (e instanceof cc.Component) {
    cc.engine.attachedObjsForEditor[e.uuid] = e;
  }
}

module.exports = {
  recordObject: i,
  restoreObject: d,
  renewObject: b,
  recordNode: function (e) {
    for (var t = {}, r = 0; r < e._components.length; ++r) {
      var n = e._components[r];
      t[n.uuid] = i(n);
    }
    return { node: i(e), comps: t };
  },
  restoreNode: function (e, t) {
    for (let e in t.comps) {
      let r = cc.engine.getInstanceById(e);

      if (r) {
        p(r, t.comps[e]);
      }
    }
    p(e, t.node);
    for (let e in t.comps) {
      let t = cc.engine.getInstanceById(e);

      if (t) {
        y(t);
      }
    }
    y(e);
  },
  recordDeleteNode: function (e) {
    var t = [];
    _Scene.walk(e, false, function (e) {
      t.push({
        node: e,
        data: (function (e) {
          for (var t = [], r = 0; r < e._components.length; ++r) {
            var n = e._components[r];
            t.push({ comp: n, data: i(n) });
          }
          return { nodeData: i(e), compInfos: t };
        })(e),
      });
    });
    for (var r = [], n = 0; n < e._components.length; ++n) {
      var o = e._components[n];
      r.push({ comp: o, data: i(o) });
    }
    return {
      parent: e.parent,
      siblingIndex: e.getSiblingIndex(),
      nodeData: i(e),
      compInfos: r,
      childInfos: t,
    };
  },
  restoreDeleteNode: function (e, t) {
    t.compInfos.forEach(function (e) {
      d(e.comp, e.data);
      b(e.comp);
    });

    t.childInfos.forEach(function (e) {
      (function (e, t) {
        d(e, t.nodeData);
        b(e);

        t.compInfos.forEach(function (e) {
          d(e.comp, e.data);
          b(e.comp);
        });
      })(e.node, e.data);
    });

    d(e, t.nodeData);
    b(e);
    e.parent = t.parent;
    e.setSiblingIndex(t.siblingIndex);
  },
};
