require("electron").ipcRenderer;
require("util");
const e = require("fire-fs");
const t = require("fire-path");
async function i(e) {
  let t = Editor.url(e);
  return Editor.remote.assetdb.assetInfoByPath(t).uuid;
}

module.exports = async function (o) {
  const n = Editor.require("app://editor/page/scene-utils/utils/prefab");
  const r = Editor.require("app://editor/page/scene-utils/utils/node");

  const s = Editor.require(
    "unpack://engine-dev/cocos2d/core/3d/skeleton/CCSkinnedMeshRenderer"
  );

  const l = Editor.require(
    "unpack://engine-dev/cocos2d/core/3d/skeleton/CCSkeletonAnimation"
  );

  const a = Editor.require("unpack://engine-dev/cocos2d/core/mesh/CCMeshRenderer");
  const d = Editor.require("unpack://engine-dev/cocos2d/core/3d/CCModel");
  let {
    gltf: c,
    meshIDs: u,
    skeletonIDs: f,
    modelUuid: p,
    materiaIDs: m,
    modelName: h,
    modelPath: g,
    scaleFactor: _,
  } = o;
  function C(i, o, n) {
    let r = "";
    let s = [t.join(t.dirname(g), i)];
    for (let e = 0; e < o.length; e++) {
      let n = t.join(t.dirname(g), o[e], i);
      s.push(n);
    }
    if (n) {
      let e = t.basenameNoExt(i) + n;
      if (i !== e) {
        let i = s.map((i) => t.join(t.dirname(i), e));
        s = s.concat(i);
      }
    }
    for (let t = 0; t < s.length; t++) {
      let i = s[t];
      if (e.existsSync(i) && (r = Editor.remote.assetdb.fspathToUuid(i))) {
        break;
      }
    }
    return r;
  }
  let b = [];
  let E = [];
  let k = (c = JSON.parse(c)).materials || [];
  for (let e = 0; e < k.length; e++) {
    let t = k[e];
    let o = C(t.name + ".mtl", ["materials", "Materials"]);
    if (o) {
      let t = new cc.Material();
      t._uuid = o;
      E[e] = t;
    }
    let n = new cc.Material();
    b.push(n);
    n._uuid = m[e];
    n._techniqueData = { 0: { props: {}, defines: {} } };
    let r;
    let s = n._techniqueData[0];
    let l = t.pbrMetallicRoughness;
    if (l) {
      if (l.baseColorTexture) {
        let e = c.textures[l.baseColorTexture.index];
        if (e) {
          let t = c.images[e.source].uri;

          if (t.startsWith("data:image/ccmissing;base64,")) {
            t = (t = (t = window.atob(
                  t.replace("data:image/ccmissing;base64,", "")
                ))
                  .split("\\")
                  .pop())
                  .split("/")
                  .pop();
          }

          if (
            ((r = C(t, ["textures", "Textures"], ".png")))
          ) {
            var q = new cc.Texture2D();
            q._uuid = r;
            s.props.diffuseTexture = q;
            s.defines.USE_DIFFUSE_TEXTURE = true;
          }
        }
      }
      if (r) {
        s.props.diffuseColor = cc.color(255, 255, 255, 255);
      } else {
        let e = l.baseColorFactor;
        if (e) {
          let t = void 0 === e[0] ? 255 : 255 * e[0];
          let i = void 0 === e[1] ? 255 : 255 * e[1];
          let o = void 0 === e[2] ? 255 : 255 * e[2];
          let n = void 0 === e[3] ? 255 : 255 * e[3];
          s.props.diffuseColor = cc.color(t, i, o, n);
        }
      }
    }
    n._effectAsset = new cc.EffectAsset();

    n._effectAsset._uuid = await i(
        "db://internal/effects/builtin-phong.effect"
      );
  }
  let v = [];
  let w = {};
  let x = c.nodes;
  for (let e = 0; e < x.length; e++) {
    let t = x[e];
    let i = new cc.Node();
    i.is3DNode = true;
    i.name = t.name;
    let o = t.position;

    if (o) {
      i.setPosition(o[0], o[1], o[2]);
    }

    let n = t.quat;

    if (n) {
      i.setRotation(n[0], n[1], n[2], n[3]);
    }

    let r = t.scale;

    if (r) {
      i.setScale(r[0], r[1], r[2]);
    }

    if ((void 0 !== t.mesh)) {
      let e;
      let o = new cc.Mesh();
      o._uuid = u[t.mesh];
      if (void 0 !== t.skin) {
        e = i.addComponent(s);
        let o = new cc.Skeleton();
        o._uuid = f[t.skin];
        e._skeleton = o;
      } else {
        e = i.addComponent(a);
      }
      e.mesh = o;
      e._materials = [];
      let n = c.meshes[t.mesh].primitives;
      e._materials.length = n.length;
      for (let t = 0; t < n.length; t++) {
        let i = n[t].material || 0;
        e._materials[t] = E[i] || b[i];
      }
    }
    v.push(i);
  }
  let N;
  let D = c.scenes[c.scene];

  if (1 === D.nodes.length && 0 === D.nodes[0] && "RootNode" === x[0].name) {
    N = v[0];
  } else {
    (N = new cc.Node("RootNode")).is3DNode = true;
  }

  let M = false;
  for (let e = 0; e < v.length; e++) {
    let t = v[e];
    let i = x[e].children;
    if (i) {
      for (let e = 0; e < i.length; e++) {
        v[i[e]].parent = t;
      }
    }
    let o = t.getComponent(s);

    if (o) {
      o._rootBone = N;
      M = true;
    }
  }
  for (let e = 0; e < D.nodes.length; e++) {
    let t = v[D.nodes[e]];

    if (t !== N) {
      t.parent = N;
    }
  }
  if (M) {
    let e = N.addComponent(l);
    let t = new d();
    t._uuid = p;
    e._model = t;
  }
  N.scale = _;

  let R = (function () {
      let e = Object.create(null);
      return function (t) {
        let i = e[t];
        return void 0 === i ? ((e[t] = 1), t) : ((e[t] = ++i), t + "_" + i);
      };
    })();

  let S = r.getNodePath(N).length + 1;

  let T = n.createPrefabFrom(N, (e) => {
    if (e === N) {
      return p;
    }
    let t = r.getNodePath(e);
    let i = t.slice(S, t.length);
    return R(i);
  });

  T.name = h;
  let P = Editor.serialize(T);
  w[h] = P;
  return { nodeMap: w, materials: b.map((e) => e.serialize()) };
};
