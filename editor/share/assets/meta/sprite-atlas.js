"use strict";
const t = require("fire-path");
const s = require("./sprite-frame");

module.exports = class extends Editor.metas.asset {
  constructor(t) {
    super(t);
    this._rawTextureFile = "";
    this.rawTextureUuid = "";
    this.size = cc.size(0, 0);
    this.type = "";
  }
  static defaultType() {
    return "sprite-atlas";
  }
  static version() {
    return "1.2.4";
  }
  parse() {}
  deserialize(t) {
    super.deserialize(t);
    var e;
    var r;
    var i = {};
    for (r in t.subMetas) {
      e = t.subMetas[r];
      (i[r] = new s(this._assetdb)).deserialize(e);
    }
    for (r in (this.updateSubMetas(i), (i = this.getSubMetas()))) {
      i[r].import = this.importSprite;
      i[r].postImport = this.postImportSprite;
    }
  }
  dests() {
    let t = [this._assetdb._uuidToImportPathNoExt(this.uuid) + ".json"];
    var s = this.getSubMetas();
    for (var e in s)
      t.push(this._assetdb._uuidToImportPathNoExt(s[e].uuid) + ".json");
    return t;
  }
  importSprite(t, s) {
    if (s) {
      s();
    }
  }
  postImportSprite(s, e) {
    var r = this.createSpriteFrame(s, this.rawWidth, this.rawHeight);
    var i = t.dirname(s);
    var a = this._assetdb.fspathToUuid(i);

    if (a) {
      r._atlasUuid = a;
    }

    this._assetdb.saveAssetToLibrary(this.uuid, r);

    if (e) {
      e(null, r);
    }
  }
  import(t, s) {
    this.parse(t);
    var e = this.getSubMetas();
    for (var r in e) {
      e[r].import = this.importSprite;
      e[r].postImport = this.postImportSprite;
    }

    if (s) {
      s();
    }
  }
  postImport(s, e) {
    var r = new cc.SpriteAtlas();
    r._name = t.basename(s);
    var i;
    var a;
    var o = this.getSubMetas();
    var p = /\.[^.]+$/;
    var u = [];
    for (var h in o) {
      a = o[h];
      i = h.replace(p, "");

      if (r._spriteFrames[i]) {
        u.push(i);
      }

      r._spriteFrames[i] = Editor.serialize.asAsset(a.uuid);
    }

    if (u.length > 0) {
      Editor.warn(
        "[SpriteAtlas postImport] Some of the frame keys have been overwritten : " +
          JSON.stringify(u)
      );
    }

    this._assetdb.saveAssetToLibrary(this.uuid, r);

    if (e) {
      e();
    }
  }
};
