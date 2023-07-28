"use strict";
const t = require("fire-fs");
const { promisify: e } = require("util");
const { type2size: a, compType2Array: i } = require("./utils/gltf");
function r(t, e, r) {
  let s = t.accessors[e];
  let n = t.bufferViews[s.bufferView];
  let u = r[n.buffer].buffer;
  let o = a[s.type];
  return new (0, i[s.componentType])(
    u,
    n.byteOffset + s.byteOffset,
    s.count * o
  );
}

module.exports = class extends Editor.metas.asset {
  constructor(t) {
    super(t);
    this._buffer = null;
    this.modelUuid = "";
    this.animationID = -1;
    this.name = "";
    this.maxFrameCount = 0;
    this.totalFrameCount = 0;
    this.duration = 0;
    this.animationFrameRate = 30;
  }
  static version() {
    return "1.0.1";
  }
  static defaultType() {
    return "skeleton-animation-clip";
  }
  import(t, e) {
    if (this._assetdb.isSubAssetByPath(t)) {
      return e();
    }
    e();
  }
  async importGltf(t, e) {
    let a = t.animations[this.animationID];
    let i = t.nodes;
    let s = a.samplers;
    let n = a.channels;
    let u = 0;
    let o = {};
    let l = 0;
    let f = 0;
    for (let a = 0; a < n.length; ++a) {
      let l = n[a];
      let f = s[l.sampler];
      let c = r(t, f.input, e);
      let h = r(t, f.output, e);
      let m = l.target;
      let p = i[m.node].path;

      if (!o[p]) {
        o[p] = {};
      }

      let d = o[p];
      let b = "";
      let g = 0;

      if ("translation" === m.path) {
        b = "position";
        g = 3;
      } else {
        if ("rotation" === m.path) {
          b = "quat";
          g = 4;
        } else {
          if ("scale" === m.path) {
            b = "scale";
            g = 3;
          }
        }
      }

      if (!b) {
        continue;
      }
      let y = (d[b] = []);
      for (let t = 0; t < c.length; t++) {
        let e = c[t];
        u = Math.max(e, u);
        let a = t * g;
        let i = [];
        for (let t = 0; t < g; t++) {
          i[t] = h[a + t];
        }
        y.push({ frame: e, value: i });
      }
    }
    for (let t in o) {
      let e = o[t];
      for (let t in e) {
        let a = e[t];
        this.mergeFrames(a, t);
        l = Math.max(l, a.length);
        f += a.length;
      }
    }
    this._makeSureJointHasCurves(o, i);
    this._buffer = this.generateBuffer(o);
    this.maxFrameCount = l;
    this.totalFrameCount = f;
    this.duration = u;
    await this.save();
  }
  _makeSureJointHasCurves(t, e) {
    for (let a = 0; a < e.length; a++) {
      let i = e[a];
      let r = i.path;
      if ("" === r) {
        continue;
      }

      if (!t[r]) {
        t[r] = {};
      }

      let s = t[r];

      if (!s.quat) {
        s.quat = [{ frame: 0, value: i.quat || [0, 0, 0, 1] }];
      }

      if (!s.scale) {
        s.scale = [{ frame: 0, value: i.scale || [1, 1, 1] }];
      }

      if (!s.position) {
        s.position = [{ frame: 0, value: i.position || [0, 0, 0] }];
      }
    }
  }
  generateBuffer(t) {
    let e = [];
    let a = {};
    for (let i in t) {
      let r = t[i];
      let s = {};
      for (let t in r) {
        let a = r[t];
        s[t] = { offset: e.length, frameCount: a.length };
        for (let t = 0; t < a.length; t++) {
          let i = a[t];
          e.push(i.frame);
          e.push(...i.value);
        }
      }
      a[i] = s;
    }
    e = new Float32Array(e);
    return { description: a, buffer: (e = new Buffer(new Uint8Array(e.buffer))) };
  }
  mergeFrames(t, e) {
    function a(t, e, a) {
      a = a || 1e-4;
      return Math.abs(e - t) < a;
    }
    function i(t, e, i, r, s, n) {
      let u = t.length;
      let o = (s - r) / (n - r);
      for (let r = 0; r < u; r++) {
        let s = t[r] + (i[r] - t[r]) * o;
        if (!a(e[r], s)) {
          return false;
        }
      }
      return true;
    }
    let r = cc.quat();
    let s = cc.quat();
    let n = cc.quat();
    let u = cc.quat();
    function o(t, e, i, o, l, f) {
      cc.Quat.set(r, t[0], t[1], t[2], t[3]);
      cc.Quat.set(s, e[0], e[1], e[2], e[3]);
      cc.Quat.set(n, i[0], i[1], i[2], i[3]);
      let c = (l - o) / (f - o);
      r.lerp(n, c, u);
      return a(u.x, s.x) && a(u.y, s.y) && a(u.z, s.z) && a(u.w, s.w);
    }
    for (let a = 1; a < t.length - 1; a++) {
      let r;
      let s = t[a - 1];
      let n = t[a];
      let u = t[a + 1];
      let l = s.frame;
      let f = n.frame;
      let c = u.frame;

      if ("scale" === e || "position" === e) {
        r = i;
      } else {
        if ("quat" === e) {
          r = o;
        }
      }

      if (r(s.value, n.value, u.value, l, f, c)) {
        t.splice(a--, 1);
      }
    }
  }
  async save() {
    let a = new (Editor.require(
      "unpack://engine-dev/cocos2d/core/3d/skeleton/CCSkeletonAnimationClip"
    ))();
    a.name = this.name;
    a._setRawAsset(".bin");
    a.description = this._buffer.description;
    a._duration = this.duration;
    a.wrapMode = cc.WrapMode.Loop;
    a.sample = this.animationFrameRate;
    this._assetdb.saveAssetToLibrary(this.uuid, a);
    let i = this._assetdb._uuidToImportPathNoExt(this.uuid) + ".bin";
    await e(t.writeFile)(i, this._buffer.buffer);
  }
};
