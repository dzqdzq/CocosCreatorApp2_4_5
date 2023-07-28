"use strict";
var fs = require("fire-fs");
var i = require("fire-path");
var s = require("./custom-asset");
var e = require("./scene");

module.exports = class extends s {
  constructor(t) {
    super(t);
    this.optimizationPolicy = "AUTO";
    this.asyncLoadAssets = false;
    this.readonly = false;
  }
  async importJSON(t, s) {
    var a = Editor.serialize.findRootObject(s, "cc.Prefab");

    if (a) {
      if (!this._assetdb.isSubAssetByPath(t)) {
        s = await e.verify(t, s);
        s = await e.migrate(t, s, this.uuid);
      }

      a.optimizationPolicy = cc.Prefab.OptimizationPolicy[this.optimizationPolicy];
      a.asyncLoadAssets = this.asyncLoadAssets;
      a.readonly = this.readonly;
    } else {
      Editor.warn(
            `Can not find prefab assset in the prefab file "${t}", it maybe corrupted!`
          );
    }

    Editor.serialize.setName(s, i.basenameNoExt(t));
    this._assetdb.saveAssetToLibrary(this.uuid, s);
  }
  import(i, s) {
    if (this._assetdb.isSubAssetByPath(i)) {
      return s();
    }
    fs.readJson(i, async (t, e) => {
      if (t) {
        if (s) {
          s(t);
        }

        return;
      }

      if (e) {
        (await this.importJSON(i, e));
      }

      if (s) {
        s(t);
      }
    });
  }
  static version() {
    return "1.2.9";
  }
  static defaultType() {
    return "prefab";
  }
};
