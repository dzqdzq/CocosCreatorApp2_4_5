const t = require("fire-fs");
const e = require("fire-path");

module.exports = class extends Editor.metas.asset {
  static version() {
    return "1.0.0";
  }
  static defaultType() {
    return "buffer";
  }
  _getDataPath() {
    return this._assetdb._uuidToImportPathNoExt(this.uuid) + ".bin";
  }
  dests() {
    return [this._getDataPath()];
  }
  import(s, a) {
    if (this._assetdb.isSubAssetByPath(s)) {
      return a();
    }
    try {
      t.copySync(s, this._getDataPath());
    } catch (t) {
      return a(new Error(`Failed importing ${s} to ${this._getDataPath()}.`));
    }
    let r = new cc.BufferAsset();
    r.name = e.basenameNoExt(s);
    r._setRawAsset(".bin");
    this._assetdb.saveAssetToLibrary(this.uuid, r);
    a(void 0, r);
  }
};
