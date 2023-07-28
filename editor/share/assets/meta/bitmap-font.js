"use strict";
const t = require("fire-fs");
const e = require("fire-path");
const r = Editor.metas["custom-asset"];
const i = require("./fnt-parser");

module.exports = class extends r {
  constructor(t) {
    super(t);
    this.textureUuid = "";
    this.fontSize = -1;
  }
  static version() {
    return "2.1.0";
  }
  static defaultType() {
    return "bitmap-font";
  }
  getRealFntTexturePath(r, i) {
    var s = -1 !== r.indexOf(":");
    var a = e.basename(r);

    if (s) {
      a = e.win32.basename(r);
    }

    var n = e.join(e.dirname(i), a);

    if (!t.existsSync(n)) {
      Editor.error(
        "Parse Error: Unable to find file Texture, the path: " + n
      );
    }

    return n;
  }
  import(e, r) {
    var s = t.readFileSync(e, "utf8");
    var a = i.parseFnt(s);
    this._fntConfig = a;
    if (!a.fontSize) {
      return r();
    }
    this.fontSize = a.fontSize;
    if (("" === this.textureUuid)) {
      var n = this.getRealFntTexturePath(a.atlasName, e);
      this.textureUuid = Editor.assetdb.fspathToUuid(n);
    }
    return r();
  }
  postImport(t, r) {
    var i = this._assetdb;
    var s = new cc.BitmapFont();
    s.name = e.basenameNoExt(t);
    var a = i.loadMetaByUuid(this.textureUuid);
    if (a) {
      if ("raw" === a.type) {
        Editor.error(
          `The '${s.name}' used the wrong texture type. Only sprite types supported.`
        );
      } else {
        var n = a.getSubMetas();
        var o = i.uuidToFspath(a.uuid);
        var u = n[e.basenameNoExt(o)];
        s.spriteFrame = Editor.serialize.asAsset(u.uuid);
      }
    } else {
      Editor.warn(`The texture file of BitmapFont '${t}' is missing.`);
    }
    s.fontSize = this.fontSize;
    s._fntConfig = this._fntConfig;
    i.saveAssetToLibrary(this.uuid, s);
    return r();
  }
};
