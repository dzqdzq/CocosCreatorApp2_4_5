"use strict";
var e = require("fire-fs");
var t = require("fire-path");
var i = require("./custom-asset");
var r = require("semver");

const a = [
    "totalParticles",
    "duration",
    "emissionRate",
    "life",
    "lifeVar",
    "angle",
    "angleVar",
    "startSize",
    "startSizeVar",
    "endSize",
    "endSizeVar",
    "startSpin",
    "startSpinVar",
    "endSpin",
    "endSpinVar",
    "sourcePos",
    "posVar",
    "gravity",
    "speed",
    "speedVar",
    "tangentialAccel",
    "tangentialAccelVar",
    "radialAccel",
    "radialAccelVar",
    "rotationIsDir",
    "startRadius",
    "startRadiusVar",
    "endRadius",
    "endRadiusVar",
    "rotatePerS",
    "rotatePerSVar",
  ];

const o = ["premultipliedAlpha"];
async function s(e, t) {
  for (var i = JSON.stringify(e), r = 0, a = t.length; r < a; ++r) {
    i = i.replace(new RegExp("_" + t[r], "g"), t[r]);
  }
  return JSON.parse(i);
}
async function n(e, t) {
  try {
    if (!Array.isArray(e)) {
      return e;
    }
    const t = Editor.require(
      "unpack://engine-dev/cocos2d/core/components/CCWidget"
    );
    let i = cc.js._getClassId(t, false);
    e = await (async function (e, t, i, r) {
      try {
        let a = await r();
        a = Editor.serialize(a, { stringify: false });
        let o = [];
        for (let i = 0; i < e.length; ++i) {
          let r = e[i];
          if (r.__type__ === t) {
            let e = r.node.__id__;

            if (!o.includes(e)) {
              o.push(e);
            }
          }
        }
        for (let t = 0; t < o.length; ++t, a = JSON.parse(JSON.stringify(a))) {
          let r = o[t];
          let s = e[r];
          if (!s || !Array.isArray(s._components)) {
            continue;
          }
          let n = false;
          for (let t = 0; t < s._components.length; ++t) {
            let r = s._components[t];
            if (!r) {
              continue;
            }
            let a = e[r.__id__];
            if (a && a.__type__ === i) {
              n = true;
              break;
            }
          }

          if (!n) {
            a.node = { __id__: r };
            e.push(a);
            s._components.push({ __id__: e.length - 1 });
          }
        }
      } catch (e) {
        Editor.error(e);
      }
      return e;
    })(e, "cc.Canvas", i, () => {
      let e = new t();

      if (!("_alignFlags" in e)) {
        Editor.error(
          "Internal: The '_alignFlags' property does not exist in cc.Widget"
        );
      }

      e._alignFlags = 45;
      return e;
    });
  } catch (e) {
    Editor.error(e);
  }
  return e;
}
class c extends i {
  constructor(e) {
    super(e);
    this.asyncLoadAssets = false;
    this.autoReleaseAssets = false;
  }
  static version() {
    return "1.2.9";
  }
  async import(i, r) {
    e.readJson(i, async (e, a) => {
      if (e) {
        if (r) {
          r(e);
        }

        return;
      }
      if (a) {
        a = await c.verify(i, a);
        a = await c.migrate(i, a, this.uuid);
        var o = Editor.serialize.findRootObject(a, "cc.SceneAsset");

        if (o) {
          o.asyncLoadAssets = this.asyncLoadAssets;
        } else {
          Editor.warn(
                `Can not find scene assset in the scene file "${i}", it maybe corrupted!`
              );
        }

        var s = Editor.serialize.findRootObject(a, "cc.Scene");

        if (s) {
          s.autoReleaseAssets = this.autoReleaseAssets;

          if (s._scale) {
            s._scale.z = 1;
          }
        } else {
          Editor.warn(
                `Can not find scene in the scene file "${i}", it maybe corrupted!`
              );
        }

        Editor.serialize.setName(a, t.basenameNoExt(i));
        this._assetdb.saveAssetToLibrary(this.uuid, a);
      }

      if (r) {
        r(e);
      }
    });
  }
  static defaultType() {
    return "scene";
  }
  static async verify(t, i) {
    let r = false;
    if (Array.isArray(i)) {
      for (var a = 0; a < i.length; ++a) {
        var o = i[a];

        if (!("cc.Node" !== o.__type__ ||
          void 0 === o._components || Array.isArray(o._components))) {
          o._components = [];
          r = true;

          Editor.warn(
            Editor.T("MESSAGE.scene.verify_compoents_warn", { name: o._name })
          );
        }
      }
    }

    if (r) {
      e.writeFileSync(t, JSON.stringify(i, null, 2));
    }

    return i;
  }
  static async migrate(t, i, l) {
    let _ = c.version();
    try {
      var d = e.readJsonSync(t + ".meta");

      if (d) {
        _ = d.ver;
      }
    } catch (e) {
      return i;
    }
    let u = false;

    if (r.satisfies(_, "< 1.0.1", { includePrerelease: true })) {
      i = await (async function (e) {
          if (Array.isArray(e)) {
            for (var t = 0; t < e.length; t++) {
              var i = e[t];

              if ("cc.ParticleSystem" === i.__type__) {
                e[t] = await s(i, a);
              } else {
                if ("sp.Skeleton" === i.__type__) {
                  e[t] = await s(i, o);
                }
              }
            }
          }
          return e;
        })(i);

      u = true;
    }

    if (r.satisfies(_, "< 1.0.2", { includePrerelease: true })) {
      i = await (async function (e) {
          if (Array.isArray(e)) {
            for (var t = 0; t < e.length; t++) {
              var i = e[t];

              if ("cc.LightComponent" === i.__type__) {
                i.__type__ = "cc.Light";
              }
            }
          }
          return e;
        })(i);

      u = true;
    }

    if (r.satisfies(_, "< 1.1.0", { includePrerelease: true })) {
      i = await (async function (e, t) {
          if (Array.isArray(e)) {
            for (var i = 0; i < e.length; i++) {
              var r = e[i];

              if ("cc.ParticleSystem" === r.__type__) {
                if (0 === r.positionType) {
                  r.positionType = 1;

                  Editor.warn(
                    Editor.T("IMPORT_ASSET.parse_particle_positionType", {
                      url: Editor.assetdb.uuidToUrl(t),
                      nodeName: e[r.node.__id__]._name,
                    })
                  );
                }
              } else {
                if ("cc.Mask" === r.__type__ &&
                    0 === r._N$alphaThreshold) {
                  r._N$alphaThreshold = 0.1;
                }
              }
            }
          }
          return e;
        })(i, l);

      u = true;
    }

    if (r.satisfies(_, "< 1.2.1", { includePrerelease: true })) {
      i = await (async function (e, t) {
          if (Array.isArray(e)) {
            for (var i = 0; i < e.length; i++) {
              var r = e[i];
              if ("cc.Node" === r.__type__) {
                if (void 0 !== r._rotationX || void 0 !== r._rotationY) {
                  if (0 !== r._rotationX || 0 !== r._rotationY) {
                    let e = cc.v3();

                    if (r._rotationX === r._rotationY) {
                      e.z = -r._rotationX;
                    } else {
                      e.x = r._rotationX;
                      e.y = r._rotationY;
                    }

                    r._eulerAngles = Editor.serialize(e, { stringify: false });
                  }
                  r._rotationX = r._rotationY = void 0;
                } else {
                  if (void 0 !== r._quat) {
                    if (r._is3DNode) {
                      r._eulerAngles = Editor.serialize(
                        cc.Quat.toEuler(cc.v3(), r._quat),
                        { stringify: false }
                      );
                    } else {
                      const e = Math.PI / 180;
                      let t = cc.v3(0, 0, (Math.asin(r._quat.z) / e) * 2);
                      r._eulerAngles = Editor.serialize(t, { stringify: false });
                    }
                    r._quat = void 0;
                  }
                }
              }
            }
          }
          return e;
        })(i);

      u = true;
    }

    if (r.satisfies(_, "< 1.2.3", { includePrerelease: true })) {
      i = await (async function (e, t) {
            if (Array.isArray(e)) {
              for (var i = 0; i < e.length; i++) {
                var r = e[i];
                var a = r.__type__;
                if ("cc.Node" === a || "cc.Scene" === a) {
                  let e = new Float64Array(10);
                  if (void 0 !== r._trs) {
                    let t = r._trs.array;

                    if (12 === t.length) {
                      r._skewX = t[10];
                      r._skewY = t[11];
                    }

                    e.set(t.slice(0, 10));
                  } else {
                    e[0] = 0;
                    e[1] = 0;
                    e[2] = 0;
                    e[3] = 0;
                    e[4] = 0;
                    e[5] = 0;
                    e[6] = 1;
                    e[7] = 1;
                    e[8] = 1;
                    e[9] = 1;
                  }

                  if (void 0 !== r._position) {
                    e[0] = r._position.x;
                    e[1] = r._position.y;
                    e[2] = r._position.z || 0;
                    r._position = void 0;
                  }

                  if (void 0 !== r._scaleX || void 0 !== r._scaleY) {
                    if (void 0 !== r._scaleX) {
                      e[7] = r._scaleX;
                      r._scaleX = void 0;
                    }

                    if (void 0 !== r._scaleY) {
                      e[8] = r._scaleY;
                      r._scaleY = void 0;
                    }

                    e[9] = 1;
                  } else {
                    if (void 0 !== r._scale) {
                      e[7] = r._scale.x;
                      e[8] = r._scale.y;
                      e[9] = r._scale.z;
                      r._scale = void 0;
                    }
                  }

                  r._trs = Editor.serialize(e, { stringify: false });
                }
              }
            }
            return e;
          })(i);

      u = true;
    } else {
      if (r.satisfies(_, "< 1.2.4", { includePrerelease: true })) {
        i = await (async function (e, t) {
              if (Array.isArray(e)) {
                for (var i = 0; i < e.length; i++) {
                  var r = e[i];
                  var a = r.__type__;
                  if ("cc.Node" === a || "cc.Scene" === a) {
                    let e = Float64Array.from(r._trs.array);
                    r._trs = Editor.serialize(e, { stringify: false });
                  }
                }
              }
              return e;
            })(i);

        u = true;
      }
    }

    if (r.satisfies(_, "< 1.2.5", { includePrerelease: true })) {
      i = await (async function (e, t) {
          if (Array.isArray(e)) {
            for (var i = 0; i < e.length; i++) {
              var r = e[i];
              if ("cc.Camera" === r.__type__) {
                if (!r.node) {
                  continue;
                }
                var a = e[r.node.__id__];
                if (!a) {
                  continue;
                }

                if (a._is3DNode) {
                  r._alignWithScreen = false;
                }
              }
            }
          }
          return e;
        })(i);
    }

    if (r.satisfies(_, "< 1.2.6", { includePrerelease: true })) {
      i = await n(i);
      u = true;
    }

    if (r.satisfies(_, "< 1.2.7", { includePrerelease: true })) {
      i = await (async function (e, t) {
          try {
            if (Array.isArray(e)) {
              for (var i = 0; i < e.length; i++) {
                var r = e[i];

                if ("cc.ParticleSystem3D" === r.__type__) {
                  if (r.shapeModule) {
                    r._shapeModule = r.shapeModule;
                  }

                  if (r.colorOverLifetimeModule) {
                    r._colorOverLifetimeModule = r.colorOverLifetimeModule;
                  }

                  if (r.sizeOvertimeModule) {
                    r._sizeOvertimeModule = r.sizeOvertimeModule;
                  }

                  if (r.velocityOvertimeModule) {
                    r._velocityOvertimeModule = r.velocityOvertimeModule;
                  }

                  if (r.forceOvertimeModule) {
                    r._forceOvertimeModule = r.forceOvertimeModule;
                  }

                  if (r.limitVelocityOvertimeModule) {
                    r._limitVelocityOvertimeModule = r.limitVelocityOvertimeModule;
                  }

                  if (r.rotationOvertimeModule) {
                    r._rotationOvertimeModule = r.rotationOvertimeModule;
                  }

                  if (r.textureAnimationModule) {
                    r._textureAnimationModule = r.textureAnimationModule;
                  }

                  if (r.trailModule) {
                    r._trailModule = r.trailModule;
                  }

                  r.shapeModule = void 0;
                  r.colorOverLifetimeModule = void 0;
                  r.sizeOvertimeModule = void 0;
                  r.velocityOvertimeModule = void 0;
                  r.forceOvertimeModule = void 0;
                  r.limitVelocityOvertimeModule = void 0;
                  r.rotationOvertimeModule = void 0;
                  r.textureAnimationModule = void 0;
                  r.trailModule = void 0;
                }
              }
            }
          } catch (e) {
            Editor.error(e);
          }
          return e;
        })(i);

      u = true;
    }

    if (r.satisfies(_, "< 1.2.8", { includePrerelease: true })) {
      i = await (async function (e, t) {
          try {
            if (Array.isArray(e)) {
              for (var i = 0; i < e.length; i++) {
                var r = e[i];
                var a = r.__type__;
                if ("cc.Node" === a || "cc.Scene" === a) {
                  if (!r._color) {
                    continue;
                  }

                  if (r._color.a < 255 &&
                    255 === r._opacity) {
                    r._opacity = r._color.a;
                    r._color.a = 255;
                  }
                }
              }
            }
          } catch (e) {
            Editor.error(e);
          }
          return e;
        })(i);

      u = true;
    }

    if (r.satisfies(_, "< 1.2.9", { includePrerelease: true })) {
      i = await (async function (e) {
          if (Array.isArray(e)) {
            for (var t = 0; t < e.length; t++) {
              var i = e[t];

              if (!("cc.WXSubContextView" !== i.__type__ && "cc.SwanSubContextView" !== i.__type__)) {
                i.__type__ = "cc.SubContextView";
              }
            }
          }
          return e;
        })(i);

      u = true;
    }

    if (u) {
      e.writeFileSync(t, JSON.stringify(i, null, 2));
    }

    return i;
  }
}
module.exports = c;
