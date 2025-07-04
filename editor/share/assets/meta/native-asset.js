"use strict";
const t = require("fire-fs");
const e = require("fire-path");

module.exports = class extends Editor.metas.asset {
  static version() {
    return "1.0.1";
  }
  static defaultType() {
    return "asset";
  }
  dests() {
    let t = this._assetdb.uuidToFspath(this.uuid);
    let s = this._assetdb._uuidToImportPathNoExt(this.uuid);
    return [s + ".json", s + e.extname(t)];
  }
  createAsset() {
    return new cc.Asset();
  }
  import(s, i) {
    let r = e.extname(s).toLowerCase();
    let a = this._assetdb._uuidToImportPathNoExt(this.uuid) + r;
    t.copy(s, a, (t) => {
      if (t) {
        return i(t);
      }
      let a = this.createAsset();
      a.name = e.basenameNoExt(s);
      a._setRawAsset(r);
      this._assetdb.saveAssetToLibrary(this.uuid, a);
      i();
    });
  }
};
