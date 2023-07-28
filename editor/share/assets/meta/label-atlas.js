"use strict";
const t = Editor.metas["custom-asset"];
const e = require("fire-path");
const i = require("./fnt-parser");

module.exports = class extends t {
  constructor(t) {
    super(t);
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.startChar = "";
    this.rawTextureUuid = "";
    this.fontSize = 0;
  }
  static version() {
    return "1.1.0";
  }
  static defaultType() {
    return "label-atlas";
  }
  _createFntConfigString(t, e, i, r, a, s) {
    var h = t.rawWidth;
    var n = t.rawHeight;
    var o = r.charCodeAt(0);
    var d = `info face="Arial" size=${s} bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spaceing=0,0\n`;
    d += `common lineHeight=${i} base=${s} scaleW=${h} scaleH=${n} pages=1 packed=0\n`;
    d += `page id=0 file="${a}"\n`;
    d += "chars count=0\n";
    for (var u = 0, m = i; m <= n; m += i) {
      for (var g = 0; g < h && g + e <= h; g += e) {
        var l = o + u;

        d += `char id=${l}     x=${g}   y=${
          m - i
        }   width=${e}     height=${i}     xoffset=0     yoffset=0    xadvance=${e}    page=0 chnl=0 letter="${String.fromCharCode(
          l
        )}"\n`;

        ++u;
      }
    }
    return d;
  }
  postImport(t, r) {
    var a = this._assetdb;
    var s = new cc.LabelAtlas();
    s.name = e.basenameNoExt(t);
    var h = 0.88 * this.itemHeight;
    var n = a.loadMetaByUuid(this.rawTextureUuid);
    if (n) {
      if ("raw" === n.type) {
        Editor.error(
          `The '${s.name}' used the wrong texture type. Only sprite types supported.`
        );
      } else {
        let r = a.uuidToFspath(n.uuid);
        var o = n.getSubMetas();
        var d = e.basenameNoExt(r);
        var u = o[d];
        s.spriteFrame = Editor.serialize.asAsset(u.uuid);
        if (
          (this.itemWidth > 0 &&
          this.itemHeight > 0 &&
          this.itemWidth <= u.rawWidth &&
          this.itemHeight <= u.rawHeight)
        ) {
          var m = this._createFntConfigString(
            u,
            this.itemWidth,
            this.itemHeight,
            this.startChar,
            d,
            h
          );
          s._fntConfig = i.parseFnt(m);
        } else {
          var g = `LabelAtlas '${t}' fnt data invalid, `;

          if (this.itemWidth <= 0 || this.itemWidth > u.rawWidth) {
            g += `the item width must range from 1 - ${u.rawWidth}.`;
          } else {
            if ((this.itemHeight <= 0 || this.itemHeight > u.rawHeight)) {
              g += `the item height must range from 1 - ${u.rawHeight}.`;
            }
          }

          Editor.warn(g);
        }
      }
    } else {
      Editor.warn(`The raw texture file of LabelAtlas '${t}' is missing.`);
    }
    s.fontSize = h;
    this.fontSize = h;
    a.saveAssetToLibrary(this.uuid, s);
    return r();
  }
};
