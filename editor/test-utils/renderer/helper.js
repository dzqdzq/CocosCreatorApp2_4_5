"use strict";
const e = require("node-uuid");
let t = {
  _gameInited: false,
  initGame(e, t, n) {
    if (this._gameInited) {
      if (n) {
        n();
      }

      return;
    }
    this._gameInited = true;
    e = e || 1;
    t = t || 1;
    var i = require("events");

    cc.engine = cc.js.mixin(new i(), {
      attachedObjsForEditor: {},
      getInstanceById: function (e) {
        return this.attachedObjsForEditor[e] || null;
      },
      repaintInEditMode: function () {},
    });

    let c = document.createElement("canvas");
    c.id = "test-canvas";
    document.body.appendChild(c);

    cc.game.run(
      { width: e, height: t, id: c.id, debugMode: cc.debug.DebugMode.INFO },
      n
    );
  },
  newAnimClip(t, n, i) {
    let c = new cc.AnimationClip();
    c._uuid = e.v4();
    c._duration = n;
    c._name = t;
    c.curveData = i;
    return c;
  },
  resetGame() {
    cc.director.runSceneImmediate(new cc.Scene());
  },
  runGame(e, t) {
    e = e || 128;
    t = t || 128;
    var n = this;

    before(function (i) {
      n.initGame(e, t, i);
    });

    afterEach(function () {
      n.resetGame();
    });
  },
};
module.exports = t;
