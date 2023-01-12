"use strict";
const t = require("fire-fs"),
  e = require("fire-path"),
  s = Editor.metas["custom-asset"],
  i = require("semver");
class a extends s {
  constructor(t) {
    super(t),
      (this.maxWidth = 1024),
      (this.maxHeight = 1024),
      (this.padding = 2),
      (this.allowRotation = !0),
      (this.forceSquared = !1),
      (this.powerOfTwo = !1),
      (this.algorithm = "MaxRects"),
      (this.format = "png"),
      (this.quality = 80),
      (this.contourBleed = !0),
      (this.paddingBleed = !0),
      (this.filterUnused = !0),
      (this.packable = !1),
      (this.premultiplyAlpha = !1),
      (this.filterMode = "bilinear"),
      (this.platformSettings = {});
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
      s && (r = s.ver);
    } catch (t) {}
    i.satisfies(r, "< 1.2.1", { includePrerelease: !0 }) &&
      (s.filterUnused = !0);
  }
  async import(t, s) {
    var i = { __type__: "cc.SpriteAtlas" };
    await a.migrate(t, this),
      Editor.serialize.setName(i, e.basenameNoExt(t)),
      this._assetdb.saveAssetToLibrary(this.uuid, i),
      s && s();
  }
}
module.exports = a;
