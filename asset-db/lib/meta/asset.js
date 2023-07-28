"use strict";
const s = require("./raw-asset");
module.exports = class extends s {
  useRawfile() {
    return false;
  }
  dests() {
    return [this._assetdb._uuidToImportPathNoExt(this.uuid) + ".json"];
  }
  import(s, t) {
    this._assetdb.copyAssetToLibrary(this.uuid, s);

    if (t) {
      t();
    }
  }
  static defaultType() {
    return "asset";
  }
};
