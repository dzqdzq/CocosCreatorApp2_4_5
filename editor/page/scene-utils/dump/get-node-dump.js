var e = require("lodash");
const t = require("../utils/node"),
  n = require("../utils/scene");
var r = cc.js,
  i = cc.Object,
  a = cc.Object.Flags,
  o = Editor.require(
    "unpack://engine-dev/cocos2d/core/platform/CCClass"
  ).getDefault;
const c = {
  number: "Float",
  string: "String",
  boolean: "Boolean",
  object: "Object",
};
function s(e) {
  return "object" == typeof e && (e = e.constructor), r._getClassId(e);
}
function l(e, t, n) {
  var r,
    i = n.ctor;
  if (i) {
    if (((r = s(i)), (t.type = r), !e[r])) {
      var a = cc.js.isChildClassOf(i, cc.Asset),
        l = cc.js.isChildClassOf(i, cc.Node);
      a || l ? f(e, i, r) : p(e, i, r);
    }
  } else n.type && (t.type = "" + n.type);
  if ((n.readonly && (t.readonly = n.readonly), "default" in n)) {
    if (((t.default = o(n.default)), null != t.default && !t.type)) {
      if ((r = c[typeof t.default]))
        if ("Object" !== r || t.default.constructor === Object) t.type = r;
        else {
          var u = cc.js._getClassId(t.default.constructor);
          u && (t.type = u);
        }
      t.default.__classname__ && (t.default = p(e, t.default, t.type));
    }
  } else n.hasSetter || (t.readonly = !0);
  "boolean" == typeof n.visible && (t.visible = n.visible),
    n.enumList && (t.enumList = JSON.parse(JSON.stringify(n.enumList))),
    n.hasOwnProperty("displayName") &&
      (t.displayName = Editor.i18n.format(n.displayName)),
    n.hasOwnProperty("multiline") && (t.multiline = n.multiline),
    n.hasOwnProperty("min") && (t.min = n.min),
    n.hasOwnProperty("max") && (t.max = n.max),
    n.hasOwnProperty("step") && (t.step = n.step),
    n.slide && (t.slide = n.slide),
    n.nullable && (t.nullable = n.nullable),
    n.tooltip && (t.tooltip = Editor.i18n.format(n.tooltip)),
    n.hasOwnProperty("animatable") && (t.animatable = n.animatable);
}
function u(e) {
  return cc.Class.getInheritanceChain(e)
    .map((e) => s(e))
    .filter((e) => e);
}
function p(e, t, r) {
  var i;
  if ("object" == typeof t) {
    if (cc.Enum.isEnum(t)) return cc.Enum.getList(t);
    i = t.constructor;
  } else i = t;
  var a = {};
  if (((e[r] = a), i)) {
    (a.name = cc.js.getClassName(i)),
      a.name.startsWith("cc.") && (a.name = a.name.slice(3));
    var o = u(i);
    o.length > 0 && (a.extends = o);
    var c = i.__props__;
    if (c) {
      for (var s = {}, p = 0; p < c.length; p++) {
        var f = c[p],
          d = {},
          _ = cc.Class.attr(t, f);
        _ && l(e, d, _), (s[f] = d);
      }
      n.isAnyChildClassOf(i, cc._BaseNode, cc.Component) &&
        (s._id = { type: "String", visible: !1 }),
        (a.properties = s);
    }
  }
  return a;
}
function f(e, t, n) {
  var r = {},
    i = u(t);
  i.length > 0 && (r.extends = i), (e[n] = r);
}
function d(e, t, n) {
  var r = s(t);
  if (r) {
    var i = e[r];
    if (i) return i.properties[n].type;
  }
  return null;
}
function _(e, t, n) {
  if (!t) return { type: "Object", value: null };
  var r,
    a = t.constructor;
  if (t instanceof i) {
    if (t instanceof cc.Asset) {
      var o = t._uuid;
      return n !== (r = s(t))
        ? (e[r] || p(e, a, r), { type: r, value: { uuid: o } })
        : { type: n, value: { uuid: o } };
    }
    if (cc.Node.isNode(t) || t instanceof cc.Component)
      return (function (e, t, n) {
        var r = { value: { name: t.isValid ? t.name : void 0, uuid: t.uuid } },
          i = s(t);
        return (
          n !== i
            ? (e[i] || p(e, t.constructor, i), (r.type = i))
            : (r.type = n),
          r
        );
      })(e, t, n);
  } else if (t instanceof cc.ValueType) {
    var c = Editor.serialize(t, { stringify: !1 });
    e[c.__type__] || f(e, a, c.__type__);
    var l = c.__type__;
    return delete c.__type__, { type: l, value: c };
  }
  if (cc.Class._isCCClass(a)) {
    var u = {};
    return (
      n !== (r = s(t)) ? (e[r] || p(e, a, r), (u.type = r)) : (u.type = n),
      h(e, u, t, a),
      u
    );
  }
  return { type: "Object", value: null };
}
function y(e, t) {
  try {
    return t.call(e);
  } catch (e) {
    Editor.error(e);
  }
  return y.ERRORED;
}
function v(e, t, r, i, a) {
  var o = d(e, r, i);
  if ("object" == typeof t || void 0 === t) {
    var s = _(e, t, o);
    if (!s.value) {
      if (!a.ctor) return { type: "Object", value: null };
      var l = a.ctor;
      if (n.isAnyChildClassOf(l, cc.Node, cc.Asset, cc.Component))
        return { type: o, value: { uuid: "" } };
    }
    return s;
  }
  if ("function" == typeof t) return null;
  var u = c[typeof t];
  return (
    "Enum" === o && "number" == typeof t && (u = "Enum"),
    ("Integer" !== o && "Float" !== o) || ("Float" === u && (u = o)),
    { type: u, value: t }
  );
}
function m(t, n, r, i, a) {
  var c,
    s = d(t, r, i),
    l = cc.Class.attr(r, i);
  if (
    ((c = Array.isArray(n)
      ? {
          type: s,
          value: e.map(n, function (e) {
            return v(t, e, r, i, l);
          }),
        }
      : null == n && Array.isArray(o(l.default))
      ? { type: "Object", value: null }
      : v(t, n, r, i, l)),
    "function" == typeof l.visible)
  ) {
    var u = y(a, l.visible);
    u !== y.ERRORED && (c.visible = !!u);
  }
  return c;
}
function h(e, t, n, r) {
  var i = r.__props__;
  if (i) {
    for (var a = {}, o = 0; o < i.length; o++) {
      var c = i[o],
        s = n[c];
      a[c] = m(e, s, r, c, n);
    }
    t.value = a;
  }
}
(y.ERRORED = {}),
  (module.exports = function (e) {
    if (!e) return { types: {}, value: null };
    var n = {};
    return {
      types: n,
      value: (function (e, n) {
        var r,
          i,
          o = ["name", "opacity", "active", "angle", "group", "is3DNode"],
          c = o.concat(["position", "color"]),
          f = {},
          d = s(n);
        if (d) {
          f.__type__ = d;
          var y = { name: "Node", extends: u(cc.Node) };
          e[d] = y;
          var v = {};
          for (r = 0; r < c.length; r++) {
            i = c[r];
            var b = {},
              g = cc.Class.attr(cc.Node, i);
            g && l(e, b, g), (v[i] = b);
          }
          (v.angle.readonly = t._hasFlagInComponents(n, a.IsRotationLocked)),
            (v.position.readonly = t._hasFlagInComponents(
              n,
              a.IsPositionLocked
            )),
            (v.anchor = {
              readonly: t._hasFlagInComponents(n, a.IsAnchorLocked),
            }),
            p(e, cc.Vec2, "cc.Vec2"),
            p(e, cc.Vec3, "cc.Vec3"),
            (v.size = { readonly: t._hasFlagInComponents(n, a.IsSizeLocked) }),
            p(e, cc.Size, "cc.Size"),
            (v.scale = {
              readonly: t._hasFlagInComponents(n, a.IsScaleLocked),
            }),
            (v.skew = {}),
            p(e, cc.Color, "cc.Color"),
            (y.properties = v);
        }
        for (r = 0; r < o.length; r++)
          f[(i = o[r])] = m(e, n[i], cc.Node, i, n);
        if (
          ((f.uuid = n.uuid),
          (f.anchor = _(e, new cc.Vec2(n.anchorX, n.anchorY))),
          (f.size = _(e, new cc.Size(n.width, n.height))),
          (f.skew = _(e, new cc.Vec2(n.skewX, n.skewY))),
          (f.color = _(e, n.color.setA(n.opacity))),
          (f.eulerAngles = _(e, n.eulerAngles)),
          n.is3DNode
            ? ((f.position = _(e, n.getPosition(cc.v3()))),
              (f.scale = _(e, n.getScale(cc.v3()))))
            : ((f.position = _(e, n.getPosition(cc.v2()))),
              (f.scale = _(e, n.getScale(cc.v2())))),
          n._prefab)
        ) {
          let e = n._prefab.root,
            t = e && e._prefab.asset,
            r = (function (e) {
              let t = [];
              return (
                (function e(n, r) {
                  let i = (function (e, n) {
                    if (e._prefab && e._prefab.root.uuid === e.uuid) {
                      let r = {
                        name: e._name,
                        path: n ? n.path + "/" + e._name : e._name,
                        uuid: e.uuid,
                      };
                      return t.push(r), r;
                    }
                  })(n, r);
                  n.children.forEach((t) => {
                    e(t, i);
                  });
                })(e),
                t
              );
            })(n),
            i = e && e.parent && e.parent._prefab;
          f.__prefab__ = {
            hasSubPrefab: r.length > 1,
            subNode: e && e.uuid !== n.uuid,
            subPrefab: !!i,
            uuid: t && t._uuid,
            rootName: e && e.name,
            rootUuid: e && e.uuid,
            handPrefabUuid: i && i.asset && i.asset._uuid,
            sync: e && e._prefab.sync,
            assetReadonly: t && t.readonly,
            nestedInfo: r,
          };
        }
        var C = n._components;
        if (C) {
          f.__comps__ = [];
          for (var O = 0; O < C.length; O++) {
            var E = C[O],
              N = E.constructor;
            if ((d = s(N))) {
              var j = p(e, E, d),
                w =
                  "function" == typeof E.start ||
                  "function" == typeof E.update ||
                  "function" == typeof E.lateUpdate ||
                  "function" == typeof E.onEnable ||
                  "function" == typeof E.onDisable;
              j.editor = {
                inspector: N.hasOwnProperty("_inspector") && N._inspector,
                icon: N.hasOwnProperty("_icon") && N._icon,
                help: N._help,
                _showTick: w,
              };
              var I = { type: d };
              h(e, I, E, N),
                (I.value._id = { type: "string", value: E._id }),
                f.__comps__.push(I);
              var A,
                P = j.properties.__scriptAsset;
              if (E instanceof cc._MissingScript) {
                let e = E._$erialized;
                (A =
                  (A = e && e.__type__) &&
                  Editor.Utils.UuidUtils.decompressUuid(A)),
                  (P.visible = !(!A || !Editor.Utils.UuidUtils.isUuid(A)));
              } else (A = E.__scriptUuid), (P.visible = !!A);
              I.value.__scriptAsset.value = { uuid: A };
            }
          }
        }
        return f;
      })(n, e),
    };
  }),
  (module.exports.getInheritanceChain = u);
