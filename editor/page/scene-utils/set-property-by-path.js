var e = cc.js;
const t = require("./utils/prefab");
const a = require("./utils/scene");
var r = Editor.require(
  "unpack://engine-dev/cocos2d/core/platform/CCClass"
).getDefault;
let s = Editor.Profile.load("project://project.json");
function c() {}
async function o(e, t, a, r) {
  return new Promise((s) => {
    cc.assetManager.loadAny(a, function (c, o) {
      var i = e.__asyncStates[t];
      if (i.uuid === a) {
        i.state = "end";
        i.uuid = "";
        if (c) {
          return Editor.error("Failed to set asset", c);
        }

        if (!(!r || o instanceof r)) {
          Editor.warn(
            "The new %s must be instance of %s",
            t,
            cc.js.getClassName(r)
          );
        }

        e[t] = o;
        cc.engine.repaintInEditMode();
        s();
      }
    });
  });
}
async function i(e, t, a, r) {
  return a
    ? ((e.__asyncStates = e.__asyncStates || {}),
      (e.__asyncStates[t] = { state: "start", uuid: a }),
      r
        ? await o(e, t, a, r)
        : (await new Promise((s) => {
            cc.assetManager.editorExtend.queryAssetInfo(
              a,
              async function (c, i) {
                await o(e, t, a, r);
                return s();
              }
            );
          }),
          void 0))
    : ((e[t] = r ? null : ""), void 0);
}
async function n(a) {
  var r = a.obj;
  var s = a.name;
  var o = a.value;
  var n = a.actualType;
  var l = a.comp;
  var u = a.prop;
  var p = o.uuid;
  var f = e._getClassById(n);
  if (f) {
    if (cc.js.isChildClassOf(f, cc.Asset)) {
      await i(r, s, p, f);
    } else {
      if (cc.js.isChildClassOf(f, cc.Node) ||
      cc.js.isChildClassOf(f, cc.Component)) {
        if (p) {
          var y = cc.engine.getInstanceById(p);
          if (y) {
            if (!t.validateSceneReference(y, l, u)) {
              throw new c();
            }
            r[s] = y;
          }
        } else {
          r[s] = null;
        }
      } else {
        r[s] = o;
      }
    }
  } else {
    cc.warn("Unknown type to apply: " + n);
  }
}
function l(e, t, r, s) {
  var c;
  var o = { Boolean: false, String: "", Float: 0, Integer: 0 }[e.type];
  if (void 0 === o) {
    switch (e.type) {
      case "Enum":
        var i = e.enumList;
        for (o = (i[0] && i[0].value) || 0, c = r; c < s; c++) {
          t[c] = o;
        }
        break;
      case "Object":
        var n = e.ctor;
        if (a.isAnyChildClassOf(n, cc.Asset, cc.Node, cc.Component)) {
          for (c = r; c < s; c++) {
            t[c] = null;
          }
          break;
        }
        for (c = r; c < s; c++) {
          try {
            t[c] = new n();
          } catch (e) {
            t[c] = null;
          }
        }
    }
  } else {
    for (c = r; c < s; c++) {
      t[c] = o;
    }
  }
}
async function u(e, t, a, r) {
  var s;

  if (e instanceof cc._BaseNode) {
    s = e;
  } else {
    if (e instanceof cc.Component) {
      s = e.node;
    }
  }

  if (-1 === t.indexOf(".")) {
    if (r && "string" == typeof a.uuid) {
      await n({
            obj: e,
            name: t,
            value: a,
            actualType: r,
            node: s,
            comp: e,
            prop: t,
          });
    } else {
      e[t] = a;
    }
  } else {
    for (
      var c = t.split("."),
        o = c[0],
        i = e[o],
        u = cc.Class.attr(e, o),
        p = i,
        f = 1;
      f < c.length - 1;
      f++
    ) {
      var y = c[f];
      var d = cc.Class.attr(p, y);

      if (d) {
        u = d;
      }

      p = p[y];
    }
    var b = c[c.length - 1];
    if (r && "string" == typeof a.uuid) {
      await n({
        obj: p,
        name: b,
        value: a,
        actualType: r,
        node: s,
        comp: e,
        prop: o,
      });
    } else {
      if ("length" === b && Array.isArray(p)) {
        var h = p.length;
        p.length = a;
        l(u, p, h, a);
      } else {
        p[b] = a;
      }
    }
    e[o] = i;
  }
}
function p(e, t) {
  if (-1 === t.indexOf(".")) {
    return { obj: e, propName: t, value: e[t] };
  }
  for (var a, r, s, c = t.split("."), o = e, i = 0; i < c.length; i++) {
    if (null == o) {
      cc.warn('Failed to parse "%s", %s is nil', t, c[i]);
      return null;
    }
    o = s = (a = o)[(r = c[i])];
  }
  return { obj: a, propName: r, value: s };
}
function f(t, a, r) {
  var s = "object" == typeof a && !Array.isArray(a);
  var c = a.constructor !== Object && !(a instanceof cc.ValueType);
  var o = r && e._getClassById(r);
  var i = o && cc.js.isChildClassOf(o, cc.Asset);

  if (i) {
    if ("string" == typeof a) {
      a = { uuid: a };
      t = t.slice(0, -".uuid".length);
    } else {
      if ("string" != typeof a.uuid) {
        i = false;
      }
    }
  }

  var n =
    (o && cc.js.isChildClassOf(o, cc.Node)) ||
    cc.js.isChildClassOf(o, cc.Component);

  if (n &&
      "string" == typeof a) {
    a = { uuid: a };
    t = t.slice(0, -".uuid".length);
  }

  if (o) {
    if ("object" != typeof a) {
      Editor.warn(
        'Expecting object type of value for "%s", but got "%s" type.',
        t,
        typeof a
      );
    }
  } else {
    switch (r) {
      case "Enum":
        if ("number" != typeof a) {
          Editor.warn(
            'Expecting number type of value for "%s", but got "%s" type.',
            t,
            typeof a
          );
        }
    }
  }
  return { path: t, value: a, isPrimitiveValue: !s || i || n || c };
}
function y(e, t, a, r, s) {
  if ("" === t) {
    if (e) {
      for (var c in a) {
        y(e, c, a[c]);
      }
    }
    return;
  }

  if (s) {
    r = (function (e, t) {
        for (
          var a = t.split("."), r = null, s = 0;
          s < a.length && null != e;
          s++
        ) {
          var c = a[s];
          var o = cc.Class.attr(e, c);
          if (!o) {
            break;
          }
          r = o;
          e = e[c];
        }
        return r
          ? "Object" === r.type && r.ctor
            ? cc.js.getClassName(r.ctor)
            : r.type
          : "";
      })(e, t);
  }

  let o = f(t, a, r);
  a = o.value;
  t = o.path;
  if ((!o.isPrimitiveValue)) {
    let r = p(e, t);
    let s = r && r.value;
    if (s) {
      if (Array.isArray(s)) {
        var i = s.length;
        var n = Object.keys(a).length;
        s.length = n;
        if (i < n) {
          l(cc.Class.attr(r.obj, r.propName), s, i, n);
        }
      }
      for (let e in a) {
        y(s, e, a[e]);
      }
      u(e, t, s);
      return;
    }
  }
  u(e, t, a, r);
}
function d(e, t, a) {
  switch (t) {
    case "name":
      e.name = a;
      break;
    case "active":
      e.active = a;
      break;
    case "opacity":
      e.opacity = a;
      break;
    case "color":
      e.color = new cc.Color(a.r, a.g, a.b, 255);
      e.opacity = a.a;
      break;
    case "color.r":
      e.color = e.color.setR(a);
      break;
    case "color.g":
      e.color = e.color.setG(a);
      break;
    case "color.b":
      e.color = e.color.setB(a);
      break;
    case "color.a":
      e.opacity = a;
      break;
    case "anchor":
      e.setAnchorPoint(a);
      break;
    case "anchor.x":
      e.anchorX = a;
      break;
    case "anchor.y":
      e.anchorY = a;
      break;
    case "size":
      a.width = a.width < 0 ? 0 : a.width;
      a.height = a.height < 0 ? 0 : a.height;
      e.setContentSize(a);
      break;
    case "size.width":
      e.width = a;
      break;
    case "size.height":
      e.height = a;
      break;
    case "scale":
      e.setScale(a);
      break;
    case "scale.x":
      e.scaleX = a;
      break;
    case "scale.y":
      e.scaleY = a;
      break;
    case "scale.z":
      e.scaleZ = a;
      break;
    case "position":
      e.setPosition(a);
      break;
    case "position.x":
      e.x = a;
      break;
    case "position.y":
      e.y = a;
      break;
    case "position.z":
      e.z = a;
      break;
    case "angle":
      e.angle = a;
      break;
    case "eulerAngles":
      e.eulerAngles = a;
      break;
    case "skew":
      e.skewX = a.x;
      e.skewY = a.y;
      break;
    case "skew.x":
      e.skewX = a;
      break;
    case "skew.y":
      e.skewY = a;
      break;
    case "group":
      if (s) {
        cc.game.groupList = s.get("group-list");
      }

      e.group = a;
      break;
    case "is3DNode":
      e.is3DNode = a;
  }
}
let b = function (e, t) {
  if (cc.Node.isNode(e)) {
    d(e, t.path, t.value, t.type);
  } else {
    y(e, t.path, t.value, t.type, t.isSubProp);
  }
};
b.ProhibitedException = c;

module.exports = {
  setAsset: i,
  setPropertyByPath: b,
  getPropertyByPath: p,
  resetPropertyByPath: function (e, t, a) {
    var s = p(e, t);
    if (s) {
      if (Array.isArray(s.obj)) {
        var c = s.obj;
        var o = parseInt(s.propName);
        s = p(e, t.slice(0, -s.propName.length - 1));

        if (cc.Class._isCCClass(s.obj.constructor)) {
          l(cc.Class.attr(s.obj, s.propName), c, o, o + 1);
        } else {
          cc.error(
                "Can't reset property by path, the object should be CCClass"
              );
        }

        return;
      }
      e = s.obj;
      var i = s.propName;
      if (cc.Class._isCCClass(e.constructor)) {
        var n = cc.Class.attr(e, i);

        if ("notifyFor" in n) {
          n = cc.Class.attr(e, n.notifyFor);
        }

        if (n && "default" in n) {
          var u = r(n.default);

          if ("object" == typeof u &&
            u) {
            u = "function" == typeof u.clone
              ? u.clone()
              : Array.isArray(u)
              ? []
              : {};
          }

          e[i] = u;
        } else {
          cc.error("Unknown default value to reset");
        }
      } else {
        cc.error("Can't reset property by path, the object should be CCClass");
      }
    }
  },
  setDeepPropertyByPath: y,
  fillDefaultValue: l,
  setNodePropertyByPath: d,
  preprocessForSetProperty: f,
};
