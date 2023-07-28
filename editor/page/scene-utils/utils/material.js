const e = require("util");
let t = cc.MaterialVariant.prototype;
t._init = t.init;

t.init = function (e) {
  this._init(e);
  let t = a.materialVariants;

  if (!t[e._uuid]) {
    t[e._uuid] = [];
  }

  t[e._uuid].push(this);
};

(t = cc.Material.prototype)._onLoad = t.onLoad;

t.onLoad = function () {
  this._onLoad();
  a.materials[this._uuid] = this;
};

cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, () => {
  a.materials = {};
  a.materialVariants = {};
});

let a = (module.exports = {
  materials: {},
  materialVariants: {},
  onEffectReload(e) {
    for (let t in a.materials) {
      let i = a.materials[t];

      if (i.effect && i.effect._asset.uuid === e.uuid) {
        delete a.materials[t];
      }
    }
  },
  updateVariants(e) {
    let t = a.materialVariants[e._uuid];
    if (t) {
      for (let a = 0; a < t.length; a++) {
        t[a]._init(e);
        let i = t[a].owner;

        if (i && i._updateMaterial) {
          i._updateMaterial();
        }
      }
    }
  },
  cloneMaterial(e) {
    let t = new cc.Material();
    t._uuid = e._uuid;

    if (e._effect) {
      t._effect = e._effect.clone();
      t._effectAsset = e._effectAsset;
    }

    t._techniqueIndex = e._techniqueIndex;
    let a = e._techniqueData;
    let i = {};
    for (let e in a) {
      let t = a[e];
      if (!t) {
        continue;
      }
      let n = {};
      if (t.props) {
        n.props = {};
        for (let e in t.props) {
          let a = t.props[e];

          if (a.clone) {
            a = a.clone();
          }

          n.props[e] = a;
        }
      }

      if (t.defines) {
        n.defines = Object.assign({}, t.defines);
      }

      i[e] = n;
    }
    t._techniqueData = i;
    return t;
  },
  switchEffectOrTechnique(e, t, i, n) {
    let r = false;

    if (e.effectName !== i) {
      e.effectName = i;
      r = true;
    }

    if (e.techniqueIndex !== n) {
      e.techniqueIndex = n;
      r = true;
    }

    if (!r) {
      return;
    }
    let s = t._techniqueData;
    let l = {};
    for (let t in s) {
      let a = (l[t] = {});
      let i = s[t].props;
      if (i) {
        a.props = {};
        for (let n in i) if (void 0 !== e.getProperty(n, t)) {
          a.props[n] = i[n];
          e.setProperty(n, i[n], t);
        }
      }
      let n = s[t].defines;
      if (n) {
        a.defines = {};
        for (let i in n) if (void 0 !== e.getDefine(i, t)) {
          a.defines[i] = n[i];
          e.define(i, n[i], t);
        }
      }
    }
    e._techniqueData = l;
    a.updateVariants(e);
  },
  updateInspectorMaterialValue(e, t) {
    let a = e.value;
    if ("props" === e.type) {
      if (e.assetType) {
        let n = a && (a.uuid || a._uuid);
        return n
          ? (cc.assetManager.loadAny(n, (n, r) => {
          if (n) {
            Editor.error(n);
            return;
          }
          t.setProperty(e.name, r, e.passIdx);
          a = r;
          i();
        }),
            void 0)
          : (t.setProperty(e.name, null, e.passIdx),
            (function () {
              let a = t._techniqueData;
              if (!a[e.passIdx]) {
                return;
              }
              let i = a[e.passIdx];
              if (!i[e.type]) {
                return;
              }
              delete i[e.type][e.name];
            })(),
            void 0);
      }

      if (e.valueCtor.clone) {
        a = e.valueCtor.clone(e.value);
      }

      t.setProperty(e.name, a, e.passIdx);
    } else {
      t.define(e.name, a, e.passIdx);
    }
    function i() {
      let i = t._techniqueData;

      if (!i[e.passIdx]) {
        i[e.passIdx] = { props: {}, defines: {} };
      }

      let n = i[e.passIdx];

      if (!n[e.type]) {
        n[e.type] = {};
      }

      n[e.type][e.name] = a;
    }
    i();
    cc.engine.repaintInEditMode();
  },
  async getInspectorAsset(t) {
    let i = a.materials[t];

    if (!i) {
      i = await e.promisify(cc.assetManager.loadAny.bind(cc.assetManager))(
          t
        );
    }

    return { asset: i, resetAsset: this.cloneMaterial(i) };
  },
  resetInspectorAsset(e) {
    a.materials[e._uuid] = e;
    a.updateVariants(e);
    cc.engine.repaintInEditMode();
  },
});
