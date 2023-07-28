"use strict";
const e = require("fire-fs");
const t = require("fire-path");
const s = require("./mesh");
const i = require("./prefab");
const a = require("./skeleton-animation-clip");
const r = require("./skeleton");
const o = (require("./buffer"), require("./material"));
const { promisify: n } = require("util");
const l = Editor.require("app://editor/core/common-asset-worker");

const f = e.readJsonSync(
  Editor.url("unpack://static/default-assets/prefab/sprite.prefab")
);

function h(e, t) {
  let s = e;
  let i = 0;
  for (; t[s]; ) {
    s = `${e}_${++i}`;
  }
  t[s] = true;
  return s;
}

module.exports = class extends Editor.metas.asset {
  constructor(e) {
    super(e);
    this.scaleFactor = 1;
    this.boneCount = 0;
    this.precomputeJointMatrix = false;
    this.animationFrameRate = 30;
    this._gltf = {};
    this._bufferUuids = [];
    this._buffers = [];
    this._modelName = "";
    this._modelImported = false;
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
      let a = e.subMetas[i];
      let r = t.extname(i);
      let o = this._assetdb._extname2infos[r];
      if (!o) {
        continue;
      }
      let n = o[0].ctor;
      if (!n) {
        Editor.warn(`Can not find meta class for submeta ${i}`);
        continue;
      }
      let l = new n(this._assetdb);
      l.deserialize(a);
      s[i] = l;
    }
    this.updateSubMetas(s);
  }
  async _createMeshMeta(e, t, i) {
    let a = Object.create(null);
    let r = (this._meshIDs = []);
    let o = [];
    for (let e in t) if (t[e] instanceof s) {
      o.push(t[e]);
    }
    let n = e.meshes || [];
    for (let l = 0; l < n.length; l++) {
      let f;
      let u = h(n[l].name, a) + ".mesh";

      if (t[u]) {
        f = t[u];
      }

      f = o[l] ? o[l] : new s(this._assetdb);
      r[l] = f.uuid;
      await f.importGltf(e, this._buffers, l);
      i[u] = f;
    }
  }
  async _createSkeletonMeta(e, t, s) {
    let i = (this._skeletonIDs = []);
    let a = [];
    for (let e in t) if (t[e] instanceof r) {
      a.push(t[e]);
    }
    let o = e.skins || [];
    for (let n = 0; n < o.length; n++) {
      let o;
      let l = `${this._modelName}-${n}.skeleton`;
      o = t[l] ? t[l] : a[n] ? a[n] : new r(this._assetdb);
      i[n] = o.uuid;
      await o.importGltf(e, this.uuid, n);
      s[l] = o;
    }
  }
  async _createSkeletonAnimationMeta(e, t, s) {
    let i = [];
    for (let e in t) if (t[e] instanceof a) {
      i.push(t[e]);
    }
    let r = e.animations || [];
    for (let e = 0; e < r.length; e++) {
      let o;
      let n = r[e].name;

      if (-1 !== this._modelName.indexOf("@")) {
        n = this._modelName.split("@")[1];

        if (0 !== e) {
          n += "_" + e;
        }
      }

      let l = n + ".sac";
      (o = t[l] ? t[l] : i[e] ? i[e] : new a(this._assetdb)).name = n;
      o.modelUuid = this.uuid;
      o.animationID = e;
      o.animationFrameRate = this.animationFrameRate;
      await o.importGltf(this._gltf, this._buffers);
      s[l] = o;
    }
  }
  _createPrefabMeta(e, t, s) {
    let a = this._modelName + ".prefab";

    if (t[a]) {
      s[a] = t[a];
    } else {
      s[a] = new i(this._assetdb);
    }

    s[a].content = f;
    s[a].readonly = true;
  }
  _createMaterialMeta(e, t, s) {
    let i = (this._materiaIDs = []);
    let a = (this._materialMetas = []);
    let r = Object.create(null);
    let n = [];
    for (let e in t) if (t[e] instanceof o) {
      n.push(t[e]);
    }
    let l = e.materials || [];
    for (let e = 0; e < l.length; e++) {
      let f;
      let u = h(l[e].name, r) + ".mtl";
      f = t[u] ? t[u] : n[e] ? n[e] : new o(this._assetdb);
      i[e] = f.uuid;
      a[e] = f;
      s[u] = f;
    }
  }
  _createBufferMeta() {}
  async _createSubMetas() {
    let e = this.getSubMetas();
    let t = {};
    let s = this._gltf;
    await this._createBufferMeta(s, e, t);
    await this._updateGltfNode();
    await this._createMeshMeta(s, e, t);
    await this._createSkeletonMeta(s, e, t);
    await this._createSkeletonAnimationMeta(s, e, t);
    await this._createPrefabMeta(s, e, t);
    await this._createMaterialMeta(s, e, t);
    this.updateSubMetas(t);
  }
  async _updateGltfNode() {
    const e = 1e-4;
    let t = this._gltf;
    let s = t.nodes;
    for (let e = 0; e < s.length; e++) {
      let t = s[e];
      if (t.matrix) {
        let e = cc.v3();
        let s = cc.quat();
        let i = cc.v3();
        cc.Mat4.toRTS({ m: t.matrix }, s, e, i);
        t.position = cc.Vec3.toArray([], e);
        t.quat = cc.Quat.toArray([], s);
        t.scale = cc.Vec3.toArray([], i);
      } else {
        t.position = t.translation;
        t.quat = t.rotation;
        delete t.translation;
        delete t.rotation;
      }

      if (!t.name) {
        t.name = `${e}`;
      }

      let i = t.children;
      if (i) {
        for (let e = 0; e < i.length; e++) {
          s[i[e]].parent = () => t;
        }
      }
    }
    function i(e, t, a) {
      if (a && "RootNode" === e.name) {
        e.path = "";
      } else {
        e.path = e.name;
      }

      if (t) {
        e.path = t + "/" + e.path;
      }

      let r = e.children;
      if (r) {
        for (let t = 0; t < r.length; t++) {
          i(s[r[t]], e.path, false);
        }
      }
    }
    let a = t.scenes[t.scene].nodes;
    for (let e = 0; e < a.length; e++) {
      i(s[a[e]], "", true);
    }
    this.boneCount = 0;
    let r = t.skins || [];
    let o = this._buffers;
    for (let e = 0; e < r.length; e++) {
      let s = t.skins[e];
      let i = t.accessors[s.inverseBindMatrices];
      let a = t.bufferViews[i.bufferView];
      let r = o[a.buffer].buffer;
      let n = i.byteOffset || 0;
      let l = new Float32Array(r, a.byteOffset + n, 16 * i.count);
      let f = t.nodes;
      let h = s.joints;
      for (let t = 0; t < i.count; ++t) {
        let s = f[h[t]];
        let i = [];
        for (let e = 0; e < 16; e++) {
          i[e] = l[16 * t + e];
        }

        if (!s.bindpose) {
          s.bindpose = {};
          this.boneCount++;
        }

        s.bindpose[e] = i;
      }
    }
    function n(t, s) {
      for (let i = 0; i < t.length; i++) {
        if (Math.abs(t[i] - s[i]) > e) {
          return false;
        }
      }
      return true;
    }
    for (let e = 0; e < s.length; e++) {
      let t = s[e];
      let i = t.bindpose;
      if (!i) {
        continue;
      }
      let a = true;
      let r = null;
      for (let e in i)
        if (r) {
          if (!n(r, i[e])) {
            a = false;
            break;
          }
        } else {
          r = i[e];
        }

      if (a) {
        t.uniqueBindPose = r;
        delete t.bindpose;
      } else {
        if (this.precomputeJointMatrix) {
          Editor.warn(
            `Node (${t.path}) has different bindposes, precomputeJointMatrix will not work with best performance.`
          );
        }
      }
    }
  }
  async importModel(s) {
    const i = e.readJsonSync(s);
    this._gltf = i;

    if (i.buffers) {
      this._bufferUuids = [];
      this._buffers = [];

      await Promise.all(
        i.buffers.map(async (i) => {
          const a = t.resolve(t.dirname(s), i.uri);
          const r = this._assetdb.fspathToUuid(a);
          let o = await n(e.readFile)(a);
          this._buffers.push(new Uint8Array(o.buffer));
          this._bufferUuids.push(r);
        })
      );
    }
  }
  async import(e, s) {
    this._modelName = t.basenameNoExt(e);
    this._modelImported = false;
    try {
      await this.importModel(e);
    } catch (e) {
      return s();
    }
    if (!this._gltf) {
      return s();
    }
    this._modelImported = true;
    await this._createSubMetas();
    let i = new (Editor.require(
      "unpack://engine-dev/cocos2d/core/3d/CCModel"
    ))();
    i.name = this._modelName;
    i._nodes = this._gltf.nodes;
    i._precomputeJointMatrix = this.precomputeJointMatrix;
    this._assetdb.saveAssetToLibrary(this.uuid, i);
    s();
  }
  async postImport(e, s) {
    if (!this._modelImported) {
      return s();
    }
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
      };

    let { nodeMap: r, materials: o } = await l.start(
      Editor.url("app://editor/page/worker/create-model-prefab.js"),
      a
    );

    let n = this._modelName + ".prefab";
    try {
      let s = JSON.parse(r[this._modelName]);
      i[n].importJSON(t.join(e, n), s);
    } catch (e) {
      Editor.error(e);
    }
    let f = this._materialMetas;
    for (let s = 0; s < f.length; s++) {
      let i = f[s];

      if (!i.dataAsSubAsset) {
        i.importJSON(t.join(e, i.name), o[s]);
      }
    }
    this.updateSubMetas(i);
    s();
  }
};
