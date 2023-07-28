"use strict";
const e = require("fire-path");
const t = require("fire-fs");
const s = require("plist");
const i = require("./native-asset");
const a = require("./sprite-frame");
const r = require(Editor.url("app://editor/share/sharp"));
class p extends i {
  constructor(e) {
    super(e);
    this.type = null;
    this.wrapMode = "clamp";
    this.filterMode = "bilinear";
    this.premultiplyAlpha = false;
    this.genMipmaps = false;
    this.packable = true;
    this.width = 0;
    this.height = 0;
    this.platformSettings = {};
  }
  static defaultType() {
    return "texture";
  }
  static version() {
    return "2.3.5";
  }
  static migrateTextureCompression(e) {
    if (e.platformSettings.wechatgame) {
      e.platformSettings.minigame = e.platformSettings.wechatgame;
      delete e.platformSettings.wechatgame;
    }
  }
  deserialize(e) {
    super.deserialize(e);
    let t = {};
    for (let s in e.subMetas) {
      let i = e.subMetas[s];
      let r = new a(this._assetdb);
      r.deserialize(i);
      t[s] = r;
    }
    this.updateSubMetas(t);
  }
  dests() {
    let e = super.dests();
    if ("sprite" === this.type) {
      for (let t in this.__subMetas__) {
        let s = this.__subMetas__[t].uuid;
        e.push(this._assetdb._uuidToImportPathNoExt(s) + ".json");
      }
    }
    return e;
  }
  createAsset() {
    let e = new cc.Texture2D();
    let t = cc.Texture2D.WrapMode;
    switch (this.wrapMode) {
      case "clamp":
        e.setWrapMode(t.CLAMP_TO_EDGE, t.CLAMP_TO_EDGE);
        break;
      case "repeat":
        e.setWrapMode(t.REPEAT, t.REPEAT);
    }
    let s = cc.Texture2D.Filter;
    switch (this.filterMode) {
      case "point":
        e.setFilters(s.NEAREST, s.NEAREST);
        break;
      case "bilinear":
      case "trilinear":
        e.setFilters(s.LINEAR, s.LINEAR);
    }
    e.setPremultiplyAlpha(this.premultiplyAlpha);
    e.genMipmaps = this.genMipmaps;
    e.packable = this.packable;
    return e;
  }
  import(i, a) {
    if (null === this.type) {
      try {
        let a = e.basename(i);
        let r = e.basenameNoExt(i);

        let p = s.parse(
          t.readFileSync(e.join(e.dirname(i), r + ".plist"), "utf8")
        );

        let h = p.metadata.realTextureFileName || p.metadata.textureFileName;
        this.type = h === a ? "raw" : "sprite";
      } catch (e) {
        this.type = "sprite";
      }
    }
    super.import(i, (t) => {
      if (t) {
        return a(t);
      }
      p.migrateTextureCompression(this);
      if ("raw" === this.type) {
        this.updateSubMetas({});
      } else {
        if ("sprite" === this.type) {
          const t = Editor.metas["sprite-frame"];
          let s = e.basenameNoExt(i);
          let a = this.getSubMetas();
          let r = Object.keys(a);
          let p = null;

          if (r.length) {
            p = a[r[0]];
          }

          if (!p) {
            p = new t(this._assetdb);
          }

          p.rawTextureUuid = this.uuid;
          a = { [s]: p };
          this.updateSubMetas(a);
        }
      }
      r(i)
        .metadata()
        .then((e) => {
        this.width = e.width;
        this.height = e.height;
        a();
      })
        .catch((e) => {
          a(e);
        });
    });
  }
}
module.exports = p;
