"use strict";
const e = require("fire-fs"),
  t = require("fire-path"),
  r = require("plist"),
  i = require("./sprite-atlas"),
  s = require("./sprite-frame"),
  a = /[\{\}]/g,
  l = /[\\\/]/g;
function u(e, t) {
  let r = e.slice(1, -1).split(",");
  return new t(parseFloat(r[0]), parseFloat(r[1]));
}
function o(e) {
  return e.split(" ").map(parseFloat);
}
function n(e) {
  let t = (e = e.replace(a, "")).split(",");
  return new cc.Rect(
    parseFloat(t[0] || 0),
    parseFloat(t[1] || 0),
    parseFloat(t[2] || 0),
    parseFloat(t[3] || 0)
  );
}
module.exports = class extends i {
  constructor(e) {
    super(e), (this.type = "Texture Packer");
  }
  static validate(t) {
    if (!e.readFileSync(t + ".meta", "utf8").includes("Texture Packer")) {
      let i = r.parse(e.readFileSync(t, "utf8"));
      return void 0 !== i.frames && void 0 !== i.metadata;
    }
    const i = e.readFileSync(t, "utf8");
    return i.includes("frames") && i.includes("metadata");
  }
  static version() {
    return "1.2.4";
  }
  parse(i) {
    let a = this._assetdb,
      c = r.parse(e.readFileSync(i, "utf8")),
      h = c.metadata,
      f = c.frames,
      p = t.dirname(i);
    this._rawTextureFile ||
      (this._rawTextureFile = t.join(
        p,
        h.realTextureFileName || h.textureFileName
      )),
      (this.size = u(h.size, cc.Size));
    let d = {},
      m = this.getSubMetas(),
      g = [];
    for (let e in f) {
      let t,
        r,
        i,
        c = f[e],
        p = !1,
        v = !1,
        x = e.replace(l, "-");
      x !== e && g.push(e);
      let w = m[x];
      w || (w = new s(a)),
        (d[x] = w),
        0 === h.format
          ? ((p = !1),
            (v = c.trimmed),
            (t = `{${c.originalWidth},${c.originalHeight}}`),
            (r = `{${c.offsetX},${c.offsetY}}`),
            (i = `{{${c.x},${c.y}},{${c.width},${c.height}}}`))
          : 1 === h.format || 2 === h.format
          ? ((p = c.rotated),
            (v = c.trimmed),
            (t = c.sourceSize),
            (r = c.offset),
            (i = c.frame))
          : 3 === h.format &&
            ((p = c.textureRotated),
            (v = c.trimmed),
            (t = c.spriteSourceSize),
            (r = c.spriteOffset),
            (i = c.textureRect)),
        (w.rotated = !!p),
        (w.trimType = v ? "custom" : "auto"),
        (w.spriteType = "normal");
      let F = u(t, cc.Size);
      (w.rawWidth = F.width), (w.rawHeight = F.height);
      let S = u(r, cc.Vec2);
      (w.offsetX = S.x), (w.offsetY = S.y);
      let y = n(i);
      if (
        ((w.trimX = y.x),
        (w.trimY = y.y),
        (w.width = y.width),
        (w.height = y.height),
        (w.vertices = void 0),
        c.triangles)
      ) {
        let t = o(c.triangles),
          r = o(c.vertices),
          i = o(c.verticesUV);
        if (r.length !== i.length)
          Editor.warn(
            `[${e}] vertices.length [${r.length}] is different with verticesUV.length [${i.length}]`
          );
        else {
          w.vertices = { triangles: t, x: [], y: [], u: [], v: [] };
          for (let e = 0; e < r.length; e += 2)
            w.vertices.x.push(r[e]), w.vertices.y.push(r[e + 1]);
          for (let e = 0; e < i.length; e += 2)
            w.vertices.u.push(i[e]), w.vertices.v.push(i[e + 1]);
        }
      }
    }
    g.length > 0 &&
      Editor.warn(
        "[SpriteAtlas import] Some of the frame keys have been reformatted : " +
          JSON.stringify(g)
      ),
      this.updateSubMetas(d);
  }
  postImport(e, t) {
    this.rawTextureUuid = this._assetdb.fspathToUuid(this._rawTextureFile);
    var r = this.getSubMetas();
    for (var i in r) r[i].rawTextureUuid = this.rawTextureUuid;
    super.postImport(e, t);
  }
};
