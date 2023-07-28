"use strict";
const e = require("./native-asset");
const { EventEmitter: t } = require("events");
const o = new t();
const r = 5e3;
let i;
let n;
function d() {
  if (n) {
    clearTimeout(n);
    n = void 0;
  }
}
let s = (function () {
  let e = false;
  return function (t) {
    if (i) {
      t(i);
    } else {
      o.once("worker-spawned", t);

      if (!e) {
        e = true;

        Editor.App.spawnWorker(
          "app://editor/page/worker/load-audio-duration.js",
          (t, r) => {
            e = false;
            i = t;
            o.emit("worker-spawned", t);
          }
        );
      }
    }
  };
})();

module.exports = class extends e {
  constructor(e) {
    super(e);
    this.downloadMode = 0;
    this.duration = 0;
  }
  static version() {
    return "2.0.1";
  }
  static defaultType() {
    return "audio-clip";
  }
  createAsset() {
    let e = new cc.AudioClip();
    e.loadMode = this.downloadMode;
    e.duration = this.duration;
    return e;
  }
  import(e, t) {
    d();

    (function (e, t) {
      s((o) => {
        o.send("app:load-audio-duration", e, t);
      });
    })(e, (o, s) => {
      (function (e) {
        d();

        n = setTimeout(() => {
          if (i) {
            i.close();
            i = void 0;
          }
        }, e);
      })(r);

      if (o) {
        return t(o);
      }
      this.duration = s;
      super.import(e, t);
    });
  }
};
