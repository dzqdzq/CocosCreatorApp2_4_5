"use strict";
const t = require("fire-fs");
const s = require("fire-path");
const e = Editor.metas["custom-asset"];

module.exports = class extends e {
  static defaultType() {
    return "ttf-font";
  }
  static version() {
    return "1.1.0";
  }
  dests() {
    var t = this._assetdb._uuidToImportPathNoExt(this.uuid);
    var e = this._assetdb.uuidToFspath(this.uuid);
    var i = s.basename(e);
    return [t + ".json", s.join(t, i)];
  }
  import(e, i) {
    var r = new cc.TTFFont();
    r.name = s.basenameNoExt(e);
    var a = r.name + ".ttf";
    var u = this._assetdb;
    u.mkdirForAsset(this.uuid);
    var o = s.join(u._uuidToImportPathNoExt(this.uuid), a);
    t.copySync(e, o);
    r._setRawAsset(a);
    u.saveAssetToLibrary(this.uuid, r);
    i();
  }
};
