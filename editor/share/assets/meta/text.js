"use strict";
const e = require("fire-fs");
const t = require("fire-path");

module.exports = class extends Editor.metas.asset {
  static version() {
    return "2.0.0";
  }
  static defaultType() {
    return "text";
  }
  import(s, r) {
    e.readFile(s, "utf8", (e, i) => {
      if (e) {
        return r(e);
      }
      let a = new cc.TextAsset();
      a.name = t.basenameNoExt(s);
      a.text = i;
      this._assetdb.saveAssetToLibrary(this.uuid, a);
      r();
    });
  }
};
