"use strict";
const e = require("fire-fs");
const t = require("fire-path");
let s = new Map();

module.exports = class extends Editor.metas.asset {
  static version() {
    return "1.0.0";
  }
  static defaultType() {
    return "json";
  }
  import(r, i) {
    e.readFile(r, "utf8", (e, a) => {
      if (e) {
        return i(e);
      }
      let u = new cc.JsonAsset();
      u.name = t.basenameNoExt(r);
      try {
        u.json = JSON.parse(a);
      } catch (e) {
        let t = `${e}, file: ${this._assetdb.fspathToUrl(r)}`;
        s.set(this.uuid, t);
        Editor.error(t);
        return i();
      }
      let o = s.get(this.uuid);

      if (o) {
        Editor.clearLog(o);
        s.delete(this.uuid);
      }

      this._assetdb.saveAssetToLibrary(this.uuid, u);
      i();
    });
  }
};
