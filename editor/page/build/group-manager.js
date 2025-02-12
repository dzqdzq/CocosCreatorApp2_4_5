"use strict";
var e = require("async");
var t = require("lodash");
const { promisify: s } = require("util");
var i = Editor.require("app://editor/share/engine-extends/json-packer");
var r = Editor.require("app://editor/share/engine-extends/texture-asset-packer");
var l = require("./hash-uuid");
const n = 8;
const u = 500;
var o = true;
function a(t, s, i) {
  return new Promise((r, l) => {
    e.eachLimit(t, i, s, (e) => {
      if (e) {
        l(e);
      } else {
        r();
      }
    });
  });
}

module.exports = class {
  constructor(e, t, s, i, r) {
    this.writer = e;
    this.strategy = s;
    this.assetdb = i;
    this.minify = !t;
    s.init(this);
    this.inlineSpriteFrames = !!r.inlineSpriteFrames;
    this.mergeAllJson = !!r.mergeAllJson;
    this.packers = [];
    this.rootUuids = null;
    this.packableGroupRootUuids = null;
    this.buildAssets = null;
  }
  _isPackable(e) {
    var t = e.type;
    return !!t && !!Editor.assets[t];
  }
  _queryPackableByUuid(e, t) {
    this.assetdb.queryInfoByUuid(e, (e, s) =>
      e
        ? t(e)
        : s
        ? s.type
          ? (t(null, this._isPackable(s)), void 0)
          : t(new Error("Asset type not specified " + s.url))
        : t(null, false)
    );
  }
  _queryPackableDepends(e, s) {
    var i = Editor.Utils.getDependsRecursively(
      this.buildAssets,
      e,
      "dependUuids"
    );
    if (!Array.isArray(i) || 0 === i.length) {
      return s(null, null);
    }
    i = i.filter((e) => {
      var t = this.buildAssets[e];
      return !t || !t.redirect;
    });
    var r = t([e]).concat(i).uniq().value();
    Editor.Utils.filterAsync(r, this._queryPackableByUuid.bind(this), s);
  }
  _groupInRoot(e) {
    var t = [];
    a(
      this.rootUuids,
      (e, s) => {
        var i = this.buildAssets[e];
        if (i && i.redirect) {
          return s();
        }
        this.assetdb.queryInfoByUuid(e, (i, r) =>
          i
            ? s(i)
            : r
            ? r.type
              ? this.strategy.shouldPack(r)
                ? (this.packableGroupRootUuids.push(e),
                  this._queryPackableDepends(e, (e, i) => {
                    if (e) {
                      return s(e);
                    }

                    if (i && i.length > 1) {
                      t.push(i);
                    }

                    s();
                  }),
                  void 0)
                : s()
              : s(new Error("Asset type not specified " + r.url))
            : s(new Error("Can not get asset info of " + e))
        );
      },
      u
    ).then(
      () => {
        e(null, t);
      },
      (s) => {
        e(s, t);
      }
    );
  }
  removeFromGroups(e, s) {
    for (let i = 0; i < e.length; i++) {
      let r = e[i].uuids;
      t.pullAll(r, s);

      if (0 === r.length) {
        cc.js.array.fastRemoveAt(e, i);
        --i;
      }
    }
  }
  getAllUuidsInBuild() {
    return t(this.buildAssets)
      .keys()
      .push(this.rootUuids)
      .flatten()
      .uniq()
      .filter(
        (e) =>
          !(
            "object" == typeof this.buildAssets[e] &&
            this.buildAssets[e].redirect
          )
      )
      .value();
  }
  async queryAssetInfosInBuild(e, s) {
    var i = t.findKey(Editor.assets, (t) => t === e);
    if (!i) {
      Editor.error("can not find asset type for " + cc.js.getClassName(e));
      return s([]);
    }
    var r = this.getAllUuidsInBuild();
    var l = [];

    await a(
      r,
      (e, t) => {
        this.assetdb.queryInfoByUuid(e, (e, s) => {
          if (s && s.type === i) {
            l.push(s);
          }

          t();
        });
      },
      u
    );

    s(null, l);
  }
  _inlineToDependsGroup(e, t) {
    let s = Object.create(null);
    for (let e in this.buildAssets) {
      let t = this.buildAssets[e];
      if ("object" != typeof t) {
        continue;
      }
      let i = t.dependUuids;
      if (i) {
        for (let t = 0; t < i.length; t++) {
          let r = s[i[t]];

          if (r) {
            r.push(e);
          } else {
            s[i[t]] = [e];
          }
        }
      }
    }
    let i = Object.create(null);
    let r = [];
    for (let l = 0; l < t.length; l++) {
      let n = t[l];
      let u = 0;
      let o = s[n];
      if (o) {
        for (let t = 0; t < o.length; t++) {
          let s = o[t];
          let r = i[s];
          if (!r) {
            r = [];
            for (let t = 0; t < e.length; t++) {
              let i = e[t].uuids;

              if (-1 !== i.indexOf(s)) {
                r.push(i);
              }
            }
            i[s] = r;
          }
          if (r.length > 0) {
            for (let e = 0; e < r.length; e++) {
              let t = r[e];

              if (-1 === t.indexOf(n)) {
                t.push(n);
                ++u;
              }
            }
          } else {
            let t = [s, n];
            e.push({ name: "", uuids: t });
            r.push(t);
            ++u;
          }
        }

        if (u > 0) {
          r.push(n);
        }
      }
    }
    return r;
  }
  _inlineSpriteFrames(e, t) {
    console.time("inline single SpriteFrames: queryAssetInfosInBuild");

    this.queryAssetInfosInBuild(cc.SpriteFrame, (s, i) => {
      console.timeEnd("inline single SpriteFrames: queryAssetInfosInBuild");
      console.time("inline single SpriteFrames: 1");
      var r = i.map((e) => e.uuid);
      console.timeEnd("inline single SpriteFrames: 1");
      console.time("inline single SpriteFrames: 2");
      if (o) {
        this.removeFromGroups(e, r);
      } else {
        let t = new Set();
        for (let s = 0; s < e.length; s++) {
          let i = e[s].uuids;
          if (i.length > 1) {
            for (let e = 0; e < i.length; e++) {
              t.add(i[e]);
            }
          }
        }
        r = r.filter((e) => !t.has(e));
      }
      console.timeEnd("inline single SpriteFrames: 2");
      console.time("inline single SpriteFrames: 3");
      let l = this._inlineToDependsGroup(e, r);
      console.timeEnd("inline single SpriteFrames: 3");
      console.time("inline single SpriteFrames: 4");
      for (let t = 0; t < l.length; t++) {
        let s = l[t];

        if (-1 !== this.packableGroupRootUuids.indexOf(s)) {
          e.push({ name: "", uuids: [s], isPlaceholder: true });
          console.log(`add dummy group to allow download ${s} individually`);
        }
      }
      console.timeEnd("inline single SpriteFrames: 4");
      t(null, e);
    });
  }
  _packAllTextures(e, t) {
    this.queryAssetInfosInBuild(cc.Texture2D, (s, i) => {
      var r = i.map((e) => e.uuid);
      this.removeFromGroups(e, r);
      e.push({ name: "", uuids: r, type: "texture" });
      t(null, e);
    });
  }
  _packAllSpine(e, t) {
    this.queryAssetInfosInBuild(sp.SkeletonData, (s, i) => {
      var r = i.map((e) => e.uuid);
      this.removeFromGroups(e, r);
      e.push({ name: "", uuids: r, type: "spine" });
      t(null, e);
    });
  }
  _mergeSmallFiles(t, s) {
    var i = [(e) => e(null, t)];

    if (this.inlineSpriteFrames) {
      i.push(this._inlineSpriteFrames.bind(this));
    }

    if (!this.mergeAllJson) {
      i.push(this._packAllTextures.bind(this));
    }else{
      i.push(this._packAllSpine.bind(this));
    }

    e.waterfall(i, s);
  }
  _computeGroup(t) {
    console.time("init packs: computeGroup");
    console.time("computeGroup: _groupInRoot");

    e.waterfall(
      [
        this._groupInRoot.bind(this),
        (e, t) => {
          console.timeEnd("computeGroup: _groupInRoot");
          console.time("computeGroup: strategy.transformGroups");
          t(null, e);
        },
        this.strategy.transformGroups.bind(this.strategy),
        (e, t) => {
          console.timeEnd("computeGroup: strategy.transformGroups");
          t(null, e);
        },
        this.strategy.mergeSmallFiles.bind(this.strategy, this.buildAssets),
        (e, t) => {
          console.time("computeGroup: _mergeSmallFiles");
          t(null, e);
        },
        this._mergeSmallFiles.bind(this),
        (e, t) => {
          console.timeEnd("computeGroup: _mergeSmallFiles");
          t(null, e);
        },
        (e, t) => {
          t(
            null,
            e.filter((e) => e.isPlaceholder || e.uuids.length > 1)
          );
        },
        (e, t) => {
          console.timeEnd("init packs: computeGroup");
          t(null, e);
        },
      ],
      t
    );
  }
  _packAssets(t, s, i) {
    e.each(
      s,
      (e, s) => {
        this.writer.readJsonByUuid(e, (i, r) => {
          if (i) {
            return s(i);
          }
          t.add(e, r);
          s();
        });
      },
      i
    );
  }
  initPacks(t, s, l) {
    this.rootUuids = t;
    this.packableGroupRootUuids = [];
    this.buildAssets = s;

    this._computeGroup((t, s) => {
      if (t) {
        return l(t);
      }
      e.eachLimit(
        s,
        n,
        (e, t) => {
          var s = e.uuids;
          var l = "texture" === e.type ? new r() : new i();
          this._packAssets(l, s, (s) => {
            if (s) {
              return t(s);
            }
            l.name = e.name;
            this.packers.push(l);
            t();
          });
        },
        l
      );
    });
  }
  buildPacks(t) {
    debugger;
    var s = this.packers.map((e) => e.pack(this.minify));
    var i = s.map((e) => e.indices);
    var r = l.calculate(i, l.BuiltinHashType.PackedAssets);
    console.time("build packs: write pack");
    var u = {};
    e.eachLimit(
      Object.keys(s),
      n,
      (e, t) => {
        var i = s[e];
        var l = r[e];
        u[l] = i.indices;

        this.writer.deleteJsonsByUuid(i.indices, (e) => {
          if (e) {
            return t(e);
          }
          this.writer.writeJsonByUuidNoCache(l, i.data, t);
        });
      },
      (e) => {
        console.timeEnd("build packs: write pack");

        if (e) {
          t(e);
        } else {
          t(null, { packedAssets: u });
        }
      }
    );
  }
};
