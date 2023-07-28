function t() {
  this.jsons = Object.create(null);
  this.name = "";
}

t.prototype.add = function (t, n) {
  if (this.jsons[t]) {
    Editor.warn("Key duplicated " + t);
  }

  this.jsons[t] = n;
};

t.prototype.pack = function (t) {
  var n = this.jsons;
  var s = Object.keys(n);
  s.sort();
  var i = s.map(function (t) {
    return n[t];
  });
  i = Editor.serializeCompiled.packJSONs(i);
  return { indices: s, data: JSON.stringify(i, null, t ? 0 : 2) };
};

Editor.JsonPacker = module.exports = t;
