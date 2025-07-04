"use strict";
var e = cc.Component;

var o = {
  onEnabled: "onEnable",
  enable: "enabled",
  onDisabled: "onDisable",
  onDestroyed: "onDestroy",
  onDestory: "onDestroy",
  awake: "onLoad",
  onStart: "start",
};

for (var t in o)
  (function (t) {
    var n = o[void 0];
    Object.defineProperty(e.prototype, void 0, {
      set: function (o) {
        cc.warn(
          'Potential typo, please use "%s" instead of "%s" for Component "%s"',
          n,
          void 0,
          cc.js.getClassName(this)
        );

        Object.defineProperty(e.prototype, void 0, {
          value: o,
          writable: true,
        });
      },
      configurable: true,
    });
  })();
