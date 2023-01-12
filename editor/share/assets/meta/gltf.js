"use strict";
const e = require("fire-fs"),
  t = require("fire-path"),
  s = require("./mesh"),
  i = require("./prefab"),
  a = require("./skeleton-animation-clip"),
  r = require("./skeleton"),
  o = (require("./buffer"), require("./material")),
  { promisify: n } = require("util"),
  l = Editor.require("app://editor/core/common-asset-worker"),
  f = e.readJsonSync(
    Editor.url("unpack://static/default-assets/prefab/sprite.prefab")
  );
function h(e, t) {
  let s = e,
    i = 0;
  for (; t[s]; ) s = `${e}_${++i}`;
  return (t[s] = !0), s;
}
module.exports = class extends Editor.metas.asset {
  constructor(e) {
    super(e),
      (this.scaleFactor = 1),
      (this.boneCount = 0),
      (this.precomputeJointMatrix = !1),
      (this.animationFrameRate = 30),
      (this._gltf = {}),
      (this._bufferUuids = []),
      (this._buffers = []),
      (this._modelName = ""),
      (this._modelImported = !1);
  }
  static version() {
    return "1.1.1";
  }
  static defaultType() {
    return "gltf";
  }
  deserialize(e) {
    super.deserialize(e);
    let s = {};
    for (let i in e.subMetas) {
      let a = e.subMetas[i],
        r = t.extname(i),
        o = this._assetdb._extname2infos[r];
      if (!o) continue;
      let n = o[0].ctor;
      if (!n) {
        Editor.warn(`Can not find meta class for submeta ${i}`);
        continue;
      }
      let l = new n(this._assetdb);
      l.deserialize(a), (s[i] = l);
    }
    this.updateSubMetas(s);
  }
  async _createMeshMeta(e, t, i) {
    let a = Object.create(null),
      r = (this._meshIDs = []),
      o = [];
    for (let e in t) t[e] instanceof s && o.push(t[e]);
    let n = e.meshes || [];
    for (let l = 0; l < n.length; l++) {
      let f,
        u = h(n[l].name, a) + ".mesh";
      t[u] && (f = t[u]),
        (f = o[l] ? o[l] : new s(this._assetdb)),
        (r[l] = f.uuid),
        await f.importGltf(e, this._buffers, l),
        (i[u] = f);
    }
  }
  async _createSkeletonMeta(e, t, s) {
    let i = (this._skeletonIDs = []),
      a = [];
    for (let e in t) t[e] instanceof r && a.push(t[e]);
    let o = e.skins || [];
    for (let n = 0; n < o.length; n++) {
      let o,
        l = `${this._modelName}-${n}.skeleton`;
      (o = t[l] ? t[l] : a[n] ? a[n] : new r(this._assetdb)),
        (i[n] = o.uuid),
        await o.importGltf(e, this.uuid, n),
        (s[l] = o);
    }
  }
  async _createSkeletonAnimationMeta(e, t, s) {
    let i = [];
    for (let e in t) t[e] instanceof a && i.push(t[e]);
    let r = e.animations || [];
    for (let e = 0; e < r.length; e++) {
      let o,
        n = r[e].name;
      -1 !== this._modelName.indexOf("@") &&
        ((n = this._modelName.split("@")[1]), 0 !== e && (n += "_" + e));
      let l = n + ".sac";
      ((o = t[l] ? t[l] : i[e] ? i[e] : new a(this._assetdb)).name = n),
        (o.modelUuid = this.uuid),
        (o.animationID = e),
        (o.animationFrameRate = this.animationFrameRate),
        await o.importGltf(this._gltf, this._buffers),
        (s[l] = o);
    }
  }
  _createPrefabMeta(e, t, s) {
    let a = this._modelName + ".prefab";
    t[a] ? (s[a] = t[a]) : (s[a] = new i(this._assetdb)),
      (s[a].content = f),
      (s[a].readonly = !0);
  }
  _createMaterialMeta(e, t, s) {
    let i = (this._materiaIDs = []),
      a = (this._materialMetas = []),
      r = Object.create(null),
      n = [];
    for (let e in t) t[e] instanceof o && n.push(t[e]);
    let l = e.materials || [];
    for (let e = 0; e < l.length; e++) {
      let f,
        u = h(l[e].name, r) + ".mtl";
      (f = t[u] ? t[u] : n[e] ? n[e] : new o(this._assetdb)),
        (i[e] = f.uuid),
        (a[e] = f),
        (s[u] = f);
    }
  }
  _createBufferMeta() {}
  async _createSubMetas() {
    let e = this.getSubMetas(),
      t = {},
      s = this._gltf;
    await this._createBufferMeta(s, e, t),
      await this._updateGltfNode(),
      await this._createMeshMeta(s, e, t),
      await this._createSkeletonMeta(s, e, t),
      await this._createSkeletonAnimationMeta(s, e, t),
      await this._createPrefabMeta(s, e, t),
      await this._createMaterialMeta(s, e, t),
      this.updateSubMetas(t);
  }
  async _updateGltfNode() {
    const e = 1e-4;
    let t = this._gltf,
      s = t.nodes;
    for (let e = 0; e < s.length; e++) {
      let t = s[e];
      if (t.matrix) {
        let e = cc.v3(),
          s = cc.quat(),
          i = cc.v3();
        cc.Mat4.toRTS({ m: t.matrix }, s, e, i),
          (t.position = cc.Vec3.toArray([], e)),
          (t.quat = cc.Quat.toArray([], s)),
          (t.scale = cc.Vec3.toArray([], i));
      } else
        (t.position = t.translation),
          (t.quat = t.rotation),
          delete t.translation,
          delete t.rotation;
      t.name || (t.name = `${e}`);
      let i = t.children;
      if (i) for (let e = 0; e < i.length; e++) s[i[e]].parent = () => t;
    }
    function i(e, t, a) {
      a && "RootNode" === e.name ? (e.path = "") : (e.path = e.name),
        t && (e.path = t + "/" + e.path);
      let r = e.children;
      if (r) for (let t = 0; t < r.length; t++) i(s[r[t]], e.path, !1);
    }
    let a = t.scenes[t.scene].nodes;
    for (let e = 0; e < a.length; e++) i(s[a[e]], "", !0);
    this.boneCount = 0;
    let r = t.skins || [],
      o = this._buffers;
    for (let e = 0; e < r.length; e++) {
      let s = t.skins[e],
        i = t.accessors[s.inverseBindMatrices],
        a = t.bufferViews[i.bufferView],
        r = o[a.buffer].buffer,
        n = i.byteOffset || 0,
        l = new Float32Array(r, a.byteOffset + n, 16 * i.count),
        f = t.nodes,
        h = s.joints;
      for (let t = 0; t < i.count; ++t) {
        let s = f[h[t]],
          i = [];
        for (let e = 0; e < 16; e++) i[e] = l[16 * t + e];
        s.bindpose || ((s.bindpose = {}), this.boneCount++),
          (s.bindpose[e] = i);
      }
    }
    function n(t, s) {
      for (let i = 0; i < t.length; i++)
        if (Math.abs(t[i] - s[i]) > e) return !1;
      return !0;
    }
    for (let e = 0; e < s.length; e++) {
      let t = s[e],
        i = t.bindpose;
      if (!i) continue;
      let a = !0,
        r = null;
      for (let e in i)
        if (r) {
          if (!n(r, i[e])) {
            a = !1;
            break;
          }
        } else r = i[e];
      a
        ? ((t.uniqueBindPose = r), delete t.bindpose)
        : this.precomputeJointMatrix &&
          Editor.warn(
            `Node (${t.path}) has different bindposes, precomputeJointMatrix will not work with best performance.`
          );
    }
  }
  async importModel(s) {
    const i = e.readJsonSync(s);
    (this._gltf = i),
      i.buffers &&
        ((this._bufferUuids = []),
        (this._buffers = []),
        await Promise.all(
          i.buffers.map(async (i) => {
            const a = t.resolve(t.dirname(s), i.uri),
              r = this._assetdb.fspathToUuid(a);
            let o = await n(e.readFile)(a);
            this._buffers.push(new Uint8Array(o.buffer)),
              this._bufferUuids.push(r);
          })
        ));
  }
  async import(e, s) {
    (this._modelName = t.basenameNoExt(e)), (this._modelImported = !1);
    try {
      await this.importModel(e);
    } catch (e) {
      return s();
    }
    if (!this._gltf) return s();
    (this._modelImported = !0), await this._createSubMetas();
    let i = new (Editor.require(
      "unpack://engine-dev/cocos2d/core/3d/CCModel"
    ))();
    (i.name = this._modelName),
      (i._nodes = this._gltf.nodes),
      (i._precomputeJointMatrix = this.precomputeJointMatrix),
      this._assetdb.saveAssetToLibrary(this.uuid, i),
      s();
  }
  async postImport(e, s) {
    if (!this._modelImported) return s();
    let i = this.getSubMetas();
    for (let e in i) i[e].name = e;
    let a = {
        gltf: JSON.stringify(this._gltf),
        meshIDs: this._meshIDs,
        skeletonIDs: this._skeletonIDs,
        materiaIDs: this._materiaIDs,
        modelUuid: this.uuid,
        modelName: this._modelName,
        modelPath: e,
        scaleFactor: this.scaleFactor,
      },
      { nodeMap: r, materials: o } = await l.start(
        Editor.url("app://editor/page/worker/create-model-prefab.js"),
        a
      ),
      n = this._modelName + ".prefab";
    try {
      let s = JSON.parse(r[this._modelName]);
      i[n].importJSON(t.join(e, n), s);
    } catch (e) {
      Editor.error(e);
    }
    let f = this._materialMetas;
    for (let s = 0; s < f.length; s++) {
      let i = f[s];
      i.dataAsSubAsset || i.importJSON(t.join(e, i.name), o[s]);
    }
    this.updateSubMetas(i), s();
  }
};
