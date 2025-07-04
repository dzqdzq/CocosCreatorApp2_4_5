"use strict";
const e = require("fire-fs");
const { promisify: t } = require("util");

const {
  gltfAttribMap: s,
  gltfTopology: i,
  type2size: r,
  compType2Array: n,
  compType2Byte: o,
} = require("./utils/gltf");

module.exports = class extends Editor.metas.asset {
  constructor(e) {
    super(e);
    this.verts = 0;
    this.tris = 0;
    this.submeshes = 0;
    this.attributes = [];
    this.minPos = cc.v3();
    this.maxPos = cc.v3();
    this._vertexBundles = [];
    this._primitives = [];
    this._buffer = [];
  }
  static version() {
    return "1.0.1";
  }
  static defaultType() {
    return "mesh";
  }
  import(e, t) {
    if (this._assetdb.isSubAssetByPath(e)) {
      return t();
    }
    t();
  }
  async importGltf(e, t, i) {
    const r = e.meshes[i];
    const n = e.accessors;
    const o = e.bufferViews;
    let u = [];
    let f = 0;
    let a = 0;
    let h = r.primitives;
    let c = cc.v3(1 / 0, 1 / 0, 1 / 0);
    let l = cc.v3(-1 / 0, -1 / 0, -1 / 0);
    for (let e = 0; e < h.length; e++) {
      let s = h[e];
      if (void 0 === s.indices) {
        continue;
      }
      const i = n[s.attributes.POSITION];
      if (i) {
        f += i.count;
        let e = i.min;
        let t = i.max;
        c.x = Math.min(c.x, e[0]);
        c.y = Math.min(c.y, e[1]);
        c.z = Math.min(c.z, e[2]);
        l.x = Math.max(l.x, t[0]);
        l.y = Math.max(l.y, t[1]);
        l.z = Math.max(l.z, t[2]);
        a += n[s.indices].count;
      }
      this.generateVBBuffer(n, t, u, o, s.attributes);
      this.generateIBBuffer(n, t, u, o, s, e, r.name);
    }
    this.verts = f;
    this.tris = a / 3;
    this.submeshes = h.length;

    this.attributes = h.map((e) =>
        Object.keys(e.attributes).map((e) => s[e])
      );

    this.minPos = c;
    this.maxPos = l;
    this._buffer = new Buffer(new Uint8Array(u));
    await this.save();
  }
  generateVBBuffer(e, t, i, n, u) {
    const {
      VertexBundle: f,
      BufferRange: a,
      VertexFormat: h,
    } = Editor.require("unpack://engine-dev/cocos2d/core/mesh/mesh-data");
    let c = new a();
    c.offset = i.length;
    let l = [];
    let m = [];
    let p = 1 / 0;
    for (let i in u) {
      const f = s[i];
      if (void 0 === f) {
        Editor.error(`Found unacceptable GlTf attribute ${i}.`);
        continue;
      }
      let a = e[u[i]];
      p = Math.min(a.count, p);
      let c = n[a.bufferView];
      let d = new h();
      d.name = f;
      d.type = a.componentType;
      d.num = r[a.type];
      m.push(d);
      let b = d.num * o[a.componentType];
      let y = a.byteOffset || 0;
      l.push({
        byteLength: a.count * b,
        byteOffset: c.byteOffset + y,
        perByte: b,
        buffer: t[c.buffer],
      });
    }
    for (let e = 0; e < p; e++) {
      for (let t = 0; t < l.length; t++) {
        let s = l[t];
        let r = s.buffer;
        let n = s.perByte;
        let o = s.byteOffset + e * n;
        for (let e = 0; e < n; e++) {
          i.push(r[o + e]);
        }
      }
    }
    c.length = i.length - c.offset;
    let d = new f();
    d.verticesCount = p;
    d.formats = m;
    d.data = c;
    this._vertexBundles.push(d);
  }
  generateIBBuffer(e, t, s, r, u, f, a) {
    const { BufferRange: h, Primitive: c } = Editor.require(
      "unpack://engine-dev/cocos2d/core/mesh/mesh-data"
    );
    let l = e[u.indices];
    let m = r[l.bufferView];
    let p = t[m.buffer];
    let d = new h();
    d.offset = s.length;
    let b = l.componentType;
    if (b >= 5124 && b <= 5126) {
      Editor.warn(
        `Mesh [name:${a}, uuid: ${this.uuid}] IndexBuffer type is [${n[b]}], which is not support in Webgl1.`
      );
      let e = new n[b](p.buffer, m.byteOffset, l.count);
      let t = new Uint16Array(l.count);
      for (let s = 0; s < t.length; s++) {
        t[s] = e[s] > 65535 ? 0 : e[s];
      }
      let i = new Uint8Array(t.buffer, 0, t.byteLength);
      for (let e = 0; e < t.byteLength; e++) {
        s.push(i[e]);
      }
      b = 5123;
    } else {
      let e = l.count * o[b];
      let t = l.byteOffset || 0;
      for (let i = m.byteOffset + t, r = 0; r < e; r++) {
        s.push(p[i + r]);
      }
    }
    d.length = s.length - d.offset;
    let y = new c();
    y.vertexBundleIndices = [f];
    y.data = d;
    y.indexUnit = b;
    y.topology = i[u.mode];
    this._primitives.push(y);
  }
  async save() {
    let s = new (Editor.require(
      "unpack://engine-dev/cocos2d/core/mesh/CCMesh"
    ))();
    s._minPos = this.minPos;
    s._maxPos = this.maxPos;
    s._primitives = this._primitives;
    s._vertexBundles = this._vertexBundles;
    s._setRawAsset(".bin");
    this._assetdb.saveAssetToLibrary(this.uuid, s);
    let i = this._assetdb._uuidToImportPathNoExt(this.uuid) + ".bin";
    await t(e.writeFile)(i, this._buffer);
  }
};
