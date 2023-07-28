"use strict";
const t = require("fire-fs");
const e = require("fire-path");
const s = Editor.metas["custom-asset"];
const i = require("semver");
class a extends s {
  constructor(t) {
    super(t);
    this.maxWidth = 1024;
    this.maxHeight = 1024;
    this.padding = 2;
    this.allowRotation = true;
    this.forceSquared = false;
    this.powerOfTwo = false;
    this.algorithm = "MaxRects";
    this.format = "png";
    this.quality = 80;
    this.contourBleed = true;
    this.paddingBleed = true;
    this.filterUnused = true;
    this.packable = false;
    this.premultiplyAlpha = false;
    this.filterMode = "bilinear";
    this.platformSettings = {};
  }
  static defaultType() {
    return "auto-atlas";
  }
  static version() {
    return "1.2.1";
  }
  static async migrate(e, s) {
    let r = a.version();
    try {
      let s = t.readJsonSync(e + ".meta");

      if (s) {
        r = s.ver;
      }
    } catch (t) {}

    if (i.satisfies(r, "< 1.2.1", { includePrerelease: true })) {
      s.filterUnused = true;
    }
  }
  async import(t, s) {
    var i = { __type__: "cc.SpriteAtlas" };
    await a.migrate(t, this);
    Editor.serialize.setName(i, e.basenameNoExt(t));
    this._assetdb.saveAssetToLibrary(this.uuid, i);

    if (s) {
      s();
    }
  }
}
module.exports = a;
