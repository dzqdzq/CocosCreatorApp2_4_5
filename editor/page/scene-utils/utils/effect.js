const e = require("fire-path");
const t = require("util");
require("async");

cc.EffectAsset.prototype.onLoad = function () {
  let e = cc.renderer._forward._programLib;
  for (let t = 0; t < this.shaders.length; t++) {
    let s = this.shaders[t];
    delete e._templates[s.name];
    e._cache = {};
    e.define(s);
  }
  cc.assetManager.builtins.getBuiltin("effect").add(this.name, this);
  _Scene.MaterialUtils.onEffectReload(this);
};

module.exports = {
    assetChanged(e) {
      if ("effect" === e.type) {
        cc.assetManager.loadAny(e.uuid, (e) => {
          if (e) {
            return Editor.error(e);
          }
          clearTimeout(this._softReloadTimerID);

          this._softReloadTimerID = setTimeout(() => {
            console.log("scene:soft-reload");
            Editor.Ipc.sendToWins("scene:soft-reload", true);
          }, 250);
        });
      }
    },
    async assetsCreated(e) {
      let s = false;
      let a = t.promisify(cc.assetManager.loadAny.bind(cc.assetManager));

      await Promise.all(
        e.map(async (e) => {
          if ("effect" === e.type) {
            s = true;
            return a(e.uuid);
          }
        })
      );

      if (s) {
        Editor.Ipc.sendToWins("scene:soft-reload", true);
      }
    },
    assetsMoved(t) {
      let s = cc.assetManager.builtins.getBuiltin("effect");
      let a = false;

      t.forEach((t) => {
        if (".effect" !== e.extname(t.destPath)) {
          return;
        }
        a = true;
        let r = e.basenameNoExt(t.srcPath);
        let o = s.get(r);
        s.remove(r);
        r = e.basenameNoExt(t.destPath);
        s.add(r, o);
      });

      if (a) {
        Editor.Ipc.sendToWins("scene:soft-reload", true);
      }
    },
    assetsDeleted(t) {
      let s = false;

      t.forEach((t) => {
        if (".effect" !== e.extname(t.path)) {
          return;
        }
        s = true;
        let a = e.basenameNoExt(t.path);
        cc.assetManager.builtins.getBuiltin("effect").remove(a);
      });

      if (s) {
        Editor.Ipc.sendToWins("scene:soft-reload", true);
      }
    },
  };
