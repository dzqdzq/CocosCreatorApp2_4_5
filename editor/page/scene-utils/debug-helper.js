"use strict";

cc.js.get(cc, "$0", function () {
  var e = Editor.Selection.curSelection("node");
  if (e.length > 0) {
    var c = e[0];
    return cc.engine.getInstanceById(c);
  }
});

cc.js.get(cc, "$c", function () {
  var e = cc.$0;
  if (e) {
    return e._components[e._components.length - 1];
  }
});

for (let e = 0; e < 5; ++e) {
  cc.js.get(cc, "$c" + e, function () {
    var c = cc.$0;
    if (c) {
      return c._components[e];
    }
  });
}
cc.js.get(cc, "$s", function () {
  return cc.director.getScene();
});

module.exports = {
  logArgs: function () {
    console.log(arguments);
  },
  watchVariable: function (e, c, n) {
    if (n) {
      Object.defineProperty(e, c, {
            value: e["_" + c],
            writable: true,
            configurable: true,
            enumerable: true,
          });

      e["_" + c] = void 0;
    } else {
      e["_" + c] = e[c];

      Object.defineProperty(e, c, {
        get: function () {
          return e["_" + c];
        },
        set: function (n) {
          e["_" + c] = n;

          console.trace(
            'The watching variable "' + c + '" is changed to ' + n
          );
        },
        configurable: true,
        enumerable: true,
      });
    }
  },
  createVariablesWatcher: function (e) {
    return new Proxy(e, {
      set: (e, c, n) => (console.trace(`obj.${c} = ${n}`), (e[c] = n), true),
    });
  },
};
