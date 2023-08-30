function t() {
  this.contents = cc.js.createMap(true);
  this.name = "";
}

t.prototype.add = function (t, e) {
  if (this.contents[t]) {
    Editor.warn("Key duplicated " + t);
  }

  this.contents[t] = Editor.serializeCompiled.getRootData(e);
};

t.prototype.pack = function (t) {
  var e = this.contents;
  var n = Object.keys(e);
  n.sort();

  var o = n
      .map(function (t) {
        return e[t];
      })
      .join("|");

  var i = { type: cc.js._getClassId(cc.Texture2D), data: o };
  return { indices: n, data: JSON.stringify(i, null, t ? 0 : 2) };
};

Editor.TextureAssetPacker = module.exports = t;
