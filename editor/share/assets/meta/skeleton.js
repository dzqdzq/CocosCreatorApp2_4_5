"use strict";
module.exports = class extends Editor.metas.asset {
  constructor(e) {
    super(e);
  }
  static version() {
    return "1.0.1";
  }
  static defaultType() {
    return "skeleton";
  }
  import(e, t) {
    if (this._assetdb.isSubAssetByPath(e)) {
      return t();
    }
    t();
  }
  async importGltf(e, t, s) {
    let i = e.skins[s].joints;
    const n = Editor.require(
      "unpack://engine-dev/cocos2d/core/3d/skeleton/CCSkeleton"
    );
    let o = new (Editor.require(
      "unpack://engine-dev/cocos2d/core/3d/CCModel"
    ))();
    o._uuid = t;
    let r = new n();
    r._model = o;
    r._jointIndices = i;
    r._skinIndex = s;
    this._assetdb.saveAssetToLibrary(this.uuid, r);
  }
};
