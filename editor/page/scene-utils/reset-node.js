const e = require("./utils/animation");

var n = [
    "_name",
    "_objFlags",
    "_parent",
    "_children",
    "_tag",
    "name",
    "parent",
    "uuid",
    "children",
    "childrenCount",
    "active",
    "activeInHierarchy",
    "_active",
    "_components",
    "_prefab",
    "_persistNode",
    "rotation",
    "rotationX",
    "rotationY",
  ];

var t = [
  "_name",
  "_objFlags",
  "node",
  "name",
  "uuid",
  "__scriptAsset",
  "_enabled",
  "enabled",
  "enabledInHierarchy",
  "_isOnLoadCalled",
  "__eventTargets",
];

function o(e, n) {
  var t = e.constructor;
  var o = {};
  var r = new t();

  t.__props__.forEach(function (t) {
    if (-1 === n.indexOf(t) && cc.Class.attr(e, t)) {
      o[t] = r[t];
    }
  });

  return o;
}

_Scene.resetNode = function (e) {
  var t = o(e, n);
  _Scene._UndoImpl.restoreObject(e, t);
};

_Scene.resetComponent = function (n) {
    if (!e.isRecording(n)) {
      var r = o(n, t);
      try {
        _Scene._UndoImpl.restoreObject(n, r);
      } catch (e) {
        cc._throw(e);

        Editor.error(
          `Failed to reset the component ${cc.js.getClassName(
            n
          )}, if you can't easily fix it, you can implement the "onRestore" function in the component.`
        );

        return;
      }
      cc.director._nodeActivator.resetComp(n, true);
      e.onResetComponent(n.node, n);
    }
  };
