var t = [
  "constructor",
  "null",
  "onLoad",
  "start",
  "onEnable",
  "onDisable",
  "onDestroy",
  "update",
  "lateUpdate",
  "onFocusInEditor",
  "onLostFocusInEditor",
  "resetInEditor",
  "onRestore",
  "isRunning",
  "realDestroyInEditor",
  "getComponent",
  "getComponentInChildren",
  "getComponents",
  "getComponentsInChildren",
];
module.exports = function (n) {
  if (!n) {
    return {};
  }
  var e = {};

  n._components.forEach(function (n) {
    for (
      var o = [],
        r = (function (t) {
          var n;
          var e;

          if ("object" == typeof t) {
            n = Object.getOwnPropertyNames(t);
            e = t.constructor;
          } else {
            n = [];
            e = t;
          }

          for (var o = [e].concat(cc.Class.getInheritanceChain(e)), r = 0; r < o.length; r++) {
            for (
              var s = Object.getOwnPropertyNames(o[r].prototype), c = 0;
              c < s.length;
              c++
            ) {
              var a = s[c];

              if (!n.includes(a)) {
                n.push(a);
              }
            }
          }
          return n;
        })(n.constructor),
        s = 0;
      s < r.length;
      ++s
    ) {
      var c = r[s];

      if (c &&
        -1 === t.indexOf(c)) {
        if (!cc.js.getPropertyDescriptor(n, c).get) {
          if ("function" == typeof n[c] && "_" !== c[0]) {
            o.push(c);
          }
        }
      }
    }
    e[cc.js.getClassName(n)] = o;
  });

  return e;
};
