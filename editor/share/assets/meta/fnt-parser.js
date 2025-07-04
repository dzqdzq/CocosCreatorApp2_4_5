"use strict";
var t = {
  INFO_EXP: /info .*?(?=\/>)|info .*/gi,
  COMMON_EXP: /common .*?(?=\/>)|common .*/gi,
  PAGE_EXP: /page .*?(?=\/>)|page .*/gi,
  CHAR_EXP: /char .*?(?=\/>)|char .*/gi,
  KERNING_EXP: /kerning .*?(?=\/>)|kerning .*/gi,
  ITEM_EXP: /\w+=[^ \r\n]+/gi,
  NUM_EXP: /^\-?\d+(?:\.\d+)?$/,
  _parseStrToObj: function (t) {
    var e = t.match(this.ITEM_EXP);
    var r = {};
    if (e) {
      for (var a = 0, i = e.length; a < i; a++) {
        var n = e[a];
        var o = n.indexOf("=");
        var s = n.substring(0, o);
        var c = n.substring(o + 1);

        if ('"' === c[0]) {
          if ((c = c.substring(1, c.length - 1)).match(this.NUM_EXP)) {
            c = parseFloat(c);
          }
        } else {
          if (c.match(this.NUM_EXP)) {
            c = parseFloat(c);
          }
        }

        r[s] = c;
      }
    }
    return r;
  },
  parseFnt: function (t) {
    var e = {};
    var r = t.match(this.INFO_EXP);
    if (!r) {
      return e;
    }
    var a = this._parseStrToObj(r[0]);
    var i = this._parseStrToObj(t.match(this.COMMON_EXP)[0]);
    e.commonHeight = i.lineHeight;
    e.fontSize = parseInt(a.size);
    if (
      (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL)
    ) {
      var n = cc.configuration.getMaxTextureSize();

      if ((i.scaleW > n.width || i.scaleH > n.height)) {
        Editor.log(
          "cc.LabelBMFont._parseCommonArguments(): page can't be larger than supported"
        );
      }
    }

    if (1 !== i.pages) {
      Editor.log(
        "cc.LabelBMFont._parseCommonArguments(): only supports 1 page"
      );
    }

    var o = this._parseStrToObj(t.match(this.PAGE_EXP)[0]);

    if (0 !== o.id) {
      Editor.log(
        "cc.LabelBMFont._parseImageFileName() : file could not be found"
      );
    }

    e.atlasName = o.file;
    for (
      var s = t.match(this.CHAR_EXP),
        c = (e.fontDefDictionary = {}),
        h = 0,
        g = s.length;
      h < g;
      h++
    ) {
      var f = this._parseStrToObj(s[h]);
      c[f.id] = {
        rect: { x: f.x, y: f.y, width: f.width, height: f.height },
        xOffset: f.xoffset,
        yOffset: f.yoffset,
        xAdvance: f.xadvance,
      };
    }
    var E = (e.kerningDict = {});
    var m = t.match(this.KERNING_EXP);
    if (m) {
      for (h = 0, g = m.length; h < g; h++) {
        var _ = this._parseStrToObj(m[h]);
        E[(_.first << 16) | (65535 & _.second)] = _.amount;
      }
    }
    return e;
  },
};
module.exports = t;
