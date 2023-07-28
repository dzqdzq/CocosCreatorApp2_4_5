"use strict";
const e = Editor.Profile && Editor.Profile.load("global://settings.json");
const t = cc.Quat;
let n = {};
let o = cc.mat4();
let c = cc.v3();
function r(e) {
  var t;
  var n = e._components.length;
  for (t = 0; t < n; ++t) {
    var o = e._components[t];

    if (o._enabled) {
      cc.director._compScheduler.disableComp(o);
    }
  }
  for (t = 0, n = e._children.length; t < n; ++t) {
    var c = e._children[t];

    if (c._active) {
      r(c);
    }
  }
}
function i(e) {
  const t = e.getComponent("cc.MeshRenderer");
  return t
    ? { minPosition: t._mesh._minPos, maxPosition: t._mesh._maxPos }
    : { minPosition: new cc.Vec3(), maxPosition: new cc.Vec3() };
}
function s(e) {
  const t = new cc.Vec3();
  cc.Vec3.subtract(t, e.maxPosition, e.minPosition);
  return t;
}
function a(e) {
  const t = s(e);
  const n = new cc.Vec3();
  cc.Vec3.scaleAndAdd(n, e.minPosition, t, 0.5);
  return n;
}
function l(e, t) {
  const n = i(t);
  const o = s(n);

  e.radius = (function (e) {
    return Math.max(e.x, Math.max(e.y, e.z));
  })(o) / 2;

  e.center = a(n);
}
function u(e, t) {
  const n = i(t);
  const o = s(n);
  const c = 0 === o.x ? 1 : 0;
  const r = 0 === o.y ? 1 : 0;
  if (1 === c + r + (0 === o.z ? 1 : 0)) {
    const e = 0.001;

    if (c) {
      o.x = e;
    } else {
      if (r) {
        o.y = e;
      } else {
        o.z = e;
      }
    }
  }
  e.size = o;
  e.center = a(n);
}

n.getObbFromRect = function (e, t, n, o, c, r) {
  let i = t.x;
  let s = t.y;
  let a = t.width;
  let l = t.height;
  let u = e.m[0] * i + e.m[4] * s + e.m[12];
  let d = e.m[1] * i + e.m[5] * s + e.m[13];
  let f = e.m[0] * a;
  let g = e.m[1] * a;
  let m = e.m[4] * l;
  let h = e.m[5] * l;
  n = n || cc.v3();
  o = o || cc.v3();
  c = c || cc.v3();
  r = r || cc.v3();
  o.x = u;
  o.y = d;
  c.x = f + u;
  c.y = g + d;
  n.x = m + u;
  n.y = h + d;
  r.x = f + m + u;
  r.y = g + h + d;
  return [n, o, c, r];
};

n.getWorldBounds = function (e, t, n) {
  t = t || e.getContentSize();
  let c = e.getAnchorPoint();
  let r = t.width;
  let i = t.height;
  let s = new cc.Rect(-c.x * r, -c.y * i, r, i);
  e.getWorldMatrix(o);
  s.transformMat4(s, o);
  return n
    ? ((n.x = s.x),
      (n.y = s.y),
      (n.width = s.width),
      (n.height = s.height),
      n)
    : s;
};

n.getWorldOrientedBounds = function (e, t, c, r, i, s) {
  let a = e.getComponent(cc.MeshRenderer);
  e.getWorldMatrix(o);
  if (a) {
    return n.getObbFromMeshRenderer(a, o);
  }
  {
    t = t || e.getContentSize();
    let a = e.getAnchorPoint();
    let l = t.width;
    let u = t.height;
    let d = new cc.Rect(-a.x * l, -a.y * u, l, u);
    let f = n.getObbFromRect(o, d, c, r, i, s);
    let g = n.getWorldPosition3D(e);

    f.forEach((e) => {
      e.z = g.z;
    });

    return f;
  }
};

n.getObbFromMeshRenderer = function (e, t) {
  const n = Editor.require(
    "unpack://engine-dev/cocos2d/core/geom-utils/aabb"
  );
  let o = n.create(0, 0, 0, 0, 0, 0);
  if (e && e._boundingBox) {
    n.clone(e._boundingBox).transform(t, null, null, null, o);
  }
  let c = cc.v3();
  let r = cc.v3();
  o.getBoundary(c, r);
  let i = [];
  i.push(c);
  i.push(cc.v3(r.x, c.y, c.z));
  i.push(cc.v3(r.x, r.y, c.z));
  i.push(cc.v3(c.x, r.y, c.z));
  i.push(r);
  i.push(cc.v3(c.x, r.y, r.z));
  i.push(cc.v3(c.x, c.y, r.z));
  i.push(cc.v3(r.x, c.y, r.z));
  return i;
};

n.getScenePosition = function (e) {
    let t = cc.director.getScene();
    return t
      ? t.convertToNodeSpaceAR(n.getWorldPosition(e))
      : (cc.error("Can not access scenePosition if no running scene"),
        cc.Vec2.ZERO);
  };

n.setScenePosition = function (e, t) {
    let o = cc.director.getScene();
    if (!o) {
      cc.error("Can not access scenePosition if no running scene");
      return;
    }
    n.setWorldPosition(e, cc.v2(o.convertToWorldSpaceAR(t)));
  };

n.getSceneRotation = function (e) {
    let t = cc.director.getScene();
    return t
      ? n.getWorldRotation(e) - t.angle
      : (cc.error("Can not access sceneRotation if no running scene"), 0);
  };

n.setSceneRotation = function (e, t) {
    let o = cc.director.getScene();
    if (!o) {
      cc.error("Can not access sceneRotation if no running scene");
      return;
    }
    n.setWorldRotation(o.angle + t);
  };

n.getWorldPosition = function (e) {
    let t = e.convertToWorldSpaceAR(cc.v2(0, 0));
    return cc.v2(t.x, t.y);
  };

n.setWorldPosition = function (e, t) {
    if (t instanceof cc.Vec2) {
      if (e.parent) {
        let n = e.parent.convertToNodeSpaceAR(t);
        e.x = n.x;
        e.y = n.y;
      } else {
        e.x = t.x;
        e.y = t.y;
      }
    } else {
      cc.error("The new worldPosition must be cc.Vec2");
    }
  };

n.getWorldRotation = function (e) {
    let t = e.parent;
    return t
      ? t instanceof cc.Scene
        ? e.angle + t.angle
        : e.angle + n.getWorldRotation(t)
      : e.angle;
  };

n.setWorldRotation = function (e, t) {
    if (isNaN(t)) {
      cc.error("The new worldRotation must not be NaN");
    } else {
      let o = e.parent;

      if (o) {
        if (o instanceof cc.Scene) {
          e.angle = t - o.angle;
        } else {
          e.angle = t - n.getWorldRotation(o);
        }
      } else {
        e.angle = t;
      }
    }
  };

n.getWorldScale = function (e) {
  e.getWorldMatrix(o);
  let t = o.m[0];
  let n = o.m[1];
  let c = o.m[4];
  let r = o.m[5];
  let i = new cc.Vec2();
  i.x = Math.sqrt(t * t + n * n);
  i.y = Math.sqrt(c * c + r * r);

  if (0 !== t &&
    t === -r &&
    0 === n &&
    0 === c) {
    if (t < 0) {
      i.x = -i.x;
    } else {
      i.y = -i.y;
    }
  }

  return i;
};

n._hasFlagInComponents = function (e, t) {
    let n = e._components;
    for (let e = 0, o = n.length; e < o; ++e) {
      if (n[e]._objFlags & t) {
        return true;
      }
    }
    return false;
  };

n._destroyForUndo = function (e, t) {
  if (cc.Node.isNode(e)) {
    if (e._activeInHierarchy) {
      r(e);
    }

    (function (e) {
      let t = e._components.length;
      for (let n = 0; n < t; ++n) {
        let t = e._components[n];
        cc.director._nodeActivator.destroyComp(t);
      }
      for (let t = 0, n = e.childrenCount; t < n; ++t) {
        let n = e._children[t];

        if (n._active) {
          r(n);
        }
      }
    })(e);
  }

  t();
  e.destroy();
};

n.getNodePath = function (e) {
    let t = "";
    for (; e && !(e instanceof cc.Scene); ) {
      t = t ? e.name + "/" + t : e.name;
      e = e._parent;
    }
    return t;
  };

n.createNodeFromAsset = function (t, n) {
    const o = require("../lib/sandbox");
    cc.assetManager.editorExtend.queryAssetInfo(t, (c, r, i) => {
      if (c) {
        return n(c);
      }
      if (cc.js.isChildClassOf(i, cc._Script)) {
        let e;
        let c = Editor.Utils.UuidUtils.compressUuid(t);
        let i = cc.js._getClassById(c);
        if (cc.js.isChildClassOf(i, cc.Component)) {
          (e = new cc.Node(cc.js.getClassName(i))).addComponent(i);
          n(null, e);
        } else {
          let e = (!CC_TEST && require("fire-url")).basename(r);

          if ("compiling" === Editor.remote.Compiler.state || o.reloading) {
            n(
                  new Error(
                    `Can not load "${e}", please wait for the scene to reload.`
                  )
                );
          } else {
            n(new Error(`Can not find a component in the script "${e}".`));
          }
        }
      } else {
        cc.assetManager.loadAny(t, (t, o) => {
          if (t) {
            return n(t);
          }
          if (o.createNode) {
            if (o instanceof cc.Prefab) {
              if (e && e.get("auto-sync-prefab")) {
                require("./prefab")._setPrefabSync(o.data, true);
              }
            }
            o.createNode(n);
          } else {
            n(new Error("Can not create node from " + cc.js.getClassName(i)));
          }
        });
      }
    });
  };

n.createNodeFromClass = function (e, t) {
  let n = new cc.Node();
  let o = null;
  if (e) {
    let t = cc.js._getClassById(e);
    if (t) {
      var c = n.addComponent(t);

      if (c) {
        cc.director._nodeActivator.resetComp(c, true);
      }
    } else {
      o = new Error(`Unknown node to create: ${e}`);
    }
  }

  if (t) {
    t(o, n);
  }
};

n.makeVec3InPrecision = function (e, t) {
  e.x = Editor.Math.toPrecision(e.x, t);
  e.y = Editor.Math.toPrecision(e.y, t);
  e.z = Editor.Math.toPrecision(e.z, t);
  return e;
};

n.getWorldPosition3D = function (e) {
  let t = cc.mat4();
  let n = cc.v3(0, 0, 0);
  e.getWorldMatrix(t);
  cc.Vec3.transformMat4(n, n, t);
  return n;
};

n.setWorldPosition3D = function (e, t, o = 3) {
    if (null == e) {
      return;
    }
    let c = cc.v3();
    if (t instanceof cc.Vec3) {
      if (e.parent) {
        let n = cc.mat4();
        let o = cc.mat4();
        e.parent.getWorldMatrix(n);
        cc.Mat4.invert(o, n);
        cc.Vec3.transformMat4(c, t, o);
      } else {
        c = t;
      }
      c = n.makeVec3InPrecision(c, o);
      e.setPosition(c.x, c.y, c.z);
    } else {
      cc.error("The new worldPosition must be cc.Vec3");
    }
  };

n.getWorldRotation3D = function (e) {
  let o = e.parent;
  let c = cc.quat(0, 0, 0, 1);
  let r = cc.quat(0, 0, 0, 1);
  e.getRotation(r);
  return o ? (t.mul(c, n.getWorldRotation3D(o), r), c) : r;
};

n.setWorldRotation3D = function (e, o, c = 3) {
    if (o instanceof cc.Quat) {
      let r = e.parent;
      let i = cc.quat(0, 0, 0, 1);
      let s = cc.quat(0, 0, 0, 1);

      if (r) {
        r.getRotation(i);
        t.conjugate(i, i);
        t.mul(s, i, o);
      } else {
        s = o;
      }

      let a = cc.v3();
      t.toEuler(a, s);
      a = n.makeVec3InPrecision(a, c);
      n.setEulerAngles(e, a);
    } else {
      cc.error("The new worldRotation must be Quat");
    }
  };

n.getEulerAngles = function (e) {
    return e.eulerAngles;
  };

n.setEulerAngles = function (e, t) {
    e.eulerAngles = t;
  };

n.getWorldScale3D = function (e) {
    return e.getWorldScale(c);
  };

let d = {
  PhysicsSphereColliderComponent: l,
  PhysicsBoxColliderComponent: u,
  SphereColliderComponent: l,
  BoxColliderComponent: u,
};

n.addComponentHandle = function (e, t) {
  if (t.constructor && d[t.constructor.name]) {
    d[t.constructor.name](t, e);
  }
};

module.exports = n;
