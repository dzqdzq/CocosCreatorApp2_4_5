"use strict";
require("lodash");
const t = require("fire-path");
function s(t) {
  var s = Editor.assetdb.assetInfoByUuid(t);
  if (s) {
    var e = s.type;
    var i = Editor.assets[e];
    return i
      ? cc.js._getClassId(i, false)
      : (Editor.error("Can not get asset type of " + t),
        cc.js._getClassId(cc.Asset, false));
  }
  return cc.js._getClassId(cc.Texture2D, false);
}
module.exports = class {
  constructor(t, s) {
    this._buildAssets = t;
    this._packedAssets = s;
    this._nativeMd5Map = null;
    this._md5Map = null;
  }
  containsAsset(t, s) {
    var e = t in this._buildAssets;

    if (!e &&
      s) {
      Editor.error(
        `The bulid not contains an asset with the given uuid "${t}".`
      );
    }

    return e;
  }
  getAssetUuids() {
    return Object.keys(this._buildAssets);
  }
  getDependencies(t) {
    return this.containsAsset(t, true)
      ? Editor.Utils.getDependsRecursively(this._buildAssets, t, "dependUuids")
      : [];
  }
  getAssetType(t) {
    this.containsAsset(t, true);
    return s(t);
  }
  getNativeAssetPath(t) {
    return this.getNativeAssetPaths(t)[0] || "";
  }
  getNativeAssetPaths(e) {
    if (!this.containsAsset(e, true)) {
      return [];
    }
    let i = this._buildAssets[e];
    if ("object" != typeof i) {
      return [];
    }
    let n = [];

    if (i.nativePaths) {
      n = i.nativePaths;
    } else {
      if (i.nativePath) {
        n = [i.nativePath];
      }
    }

    let r = s(e);
    let a = this._nativeMd5Map && this._nativeMd5Map[e];
    return a
      ? n.map((s) => {
          if ("cc.TTFFont" === r) {
            return t.join(t.dirname(s) + `.${a}`, t.basename(s));
          }
          {
            let t = s.lastIndexOf(".");
            return s.substr(0, t) + `.${a}` + s.substr(t, s.length);
          }
        })
      : n;
  }
};
