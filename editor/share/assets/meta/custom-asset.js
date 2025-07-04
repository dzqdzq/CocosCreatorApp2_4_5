"use strict";
var t = require("fire-fs");
var s = require("fire-path");

module.exports = class extends Editor.metas.asset {
  dests() {
    return [this._assetdb._uuidToImportPathNoExt(this.uuid) + ".json"];
  }
  importJSON(t, e) {
    Editor.serialize.setName(e, s.basenameNoExt(t));
    this._assetdb.saveAssetToLibrary(this.uuid, e);
  }
  import(s, e) {
    if (this._assetdb.isSubAssetByPath(s)) {
      return e();
    }
    t.readFile(s, "utf8", (t, r) => {
      if (r) {
        var i;
        try {
          i = JSON.parse(r);
        } catch (t) {
          if (e) {
            e(t);
          }

          return;
        }
        this.importJSON(s, i);
      }

      if (e) {
        e(t);
      }
    });
  }
  static defaultType() {
    return "custom-asset";
  }
};
