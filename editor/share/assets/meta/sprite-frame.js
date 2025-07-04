"use strict";
var t = require("async");
var i = require("fire-path");
const r = Editor.Profile.load("global://settings.json");

var h = function (t, i, r, h) {
    var e = 4 * i + r * h * 4;
    return { r: t[e], g: t[e + 1], b: t[e + 2], a: t[e + 3] };
  };

var e = function (t, i, r, e) {
  var s;
  var o;
  var a = e;
  var d = i;
  var m = r;
  var f = 0;
  var c = 0;
  for (o = 0; o < r; o++) {
    for (s = 0; s < i; s++) {
      if (h(t, s, o, i).a >= a) {
        m = o;
        o = r;
        break;
      }
    }
  }
  for (o = r - 1; o >= m; o--) {
    for (s = 0; s < i; s++) {
      if (h(t, s, o, i).a >= a) {
        c = o - m + 1;
        o = 0;
        break;
      }
    }
  }
  for (s = 0; s < i; s++) {
    for (o = m; o < m + c; o++) {
      if (h(t, s, o, i).a >= a) {
        d = s;
        s = i;
        break;
      }
    }
  }
  for (s = i - 1; s >= d; s--) {
    for (o = m; o < m + c; o++) {
      if (h(t, s, o, i).a >= a) {
        f = s - d + 1;
        s = 0;
        break;
      }
    }
  }
  return [d, m, f, c];
};

module.exports = class extends Editor.metas.asset {
  constructor(t) {
    super(t);
    this.rawTextureUuid = "";
    this.trimType = r.get("trim-imported-image") ? "auto" : "custom";
    this.trimThreshold = 1;
    this.rotated = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.trimX = 0;
    this.trimY = 0;
    this.width = -1;
    this.height = -1;
    this.rawWidth = 0;
    this.rawHeight = 0;
    this.borderTop = 0;
    this.borderBottom = 0;
    this.borderLeft = 0;
    this.borderRight = 0;
    this.vertices = void 0;
  }
  dests() {
    return [this._assetdb._uuidToImportPathNoExt(this.uuid) + ".json"];
  }
  createSpriteFrame(t, r, h) {
    var e = new cc.SpriteFrame();
    var s = this.rawTextureUuid;
    e.name = i.basenameNoExt(t);
    e.setOriginalSize(cc.size(r, h));
    e.setRect(cc.rect(0, 0, this.width, this.height));
    e._textureFilename = this._assetdb.uuidToUrl(s);
    e.setRect(cc.rect(this.trimX, this.trimY, this.width, this.height));
    e.setRotated(this.rotated);
    e.insetTop = this.borderTop;
    e.insetBottom = this.borderBottom;
    e.insetLeft = this.borderLeft;
    e.insetRight = this.borderRight;
    e.vertices = this.vertices;
    var o = cc.v2(this.offsetX, this.offsetY);
    e.setOffset(o);
    return e;
  }
  import(i, r) {
    const h = require(Editor.url("app://editor/share/sharp"));
    var s = this.rawTextureUuid;
    var o = this._assetdb.uuidToFspath(s);
    if (!o) {
      r(new Error(`Can not find raw texture for ${i}, uuid not found: ${s}`));
      return;
    }
    h.cache(false);

    t.waterfall(
      [
        (t) => {
          h(o).raw().toBuffer(t);
        },
        (t, r, h) => {
          if (!t || !r) {
            h(new Error("Can not load image for " + o));
            return;
          }
          let s = r.width;
          let a = r.height;
          this.rawWidth = s;
          this.rawHeight = a;
          if ("auto" === this.trimType) {
            if (4 !== r.channels) {
              this.trimX = 0;
              this.trimY = 0;
              this.width = s;
              this.height = a;
            } else {
              let i = e(t, s, a, this.trimThreshold);
              this.width = Math.max(i[2], 1);
              this.height = Math.max(i[3], 1);
              this.trimX = Editor.Math.clamp(i[0], 0, s - this.width);
              this.trimY = Editor.Math.clamp(i[1], 0, a - this.height);
            }
          } else {
            if ("none" === this.trimType) {
              this.trimX = 0;
              this.trimY = 0;
              this.width = s;
              this.height = a;
            } else {
              this.trimX = Editor.Math.clamp(this.trimX, 0, s - 1);
              this.trimY = Editor.Math.clamp(this.trimY, 0, a - 1);

              this.width = Editor.Math.clamp(
                    -1 === this.width ? s : this.width,
                    1,
                    s - this.trimX
                  );

              this.height = Editor.Math.clamp(
                    -1 === this.height ? a : this.height,
                    1,
                    a - this.trimY
                  );
            }
          }
          this.offsetX = this.trimX + this.width / 2 - s / 2;
          this.offsetY = -(this.trimY + this.height / 2 - a / 2);

          this.borderLeft = Editor.Math.clamp(
              this.borderLeft,
              0,
              this.width
            );

          this.borderRight = Editor.Math.clamp(
              this.borderRight,
              0,
              this.width - this.borderLeft
            );

          this.borderTop = Editor.Math.clamp(
              this.borderTop,
              0,
              this.height
            );

          this.borderBottom = Editor.Math.clamp(
              this.borderBottom,
              0,
              this.height - this.borderTop
            );

          let d = this.createSpriteFrame(i, s, a);
          this._assetdb.saveAssetToLibrary(this.uuid, d);
          h(null, d);
        },
      ],
      (t) => {
        h.cache(true);

        if (r) {
          r(t);
        }
      }
    );
  }
  static defaultType() {
    return "sprite-frame";
  }
  static version() {
    return "1.0.4";
  }
};
