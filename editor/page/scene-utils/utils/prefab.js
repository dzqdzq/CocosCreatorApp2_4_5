"use strict";
const { promisify: e } = require("util");
const r = require("lodash/debounce");
const { dialog: t, BrowserWindow: n } = !CC_TEST && require("electron").remote;
const a = require("./node");

if (CC_EDITOR) {
  Editor.require("unpack://engine-dev/cocos2d/core/utils/prefab-helper");
}

var o = require("../../../share/engine-extends/object-walker");
var i = ["parent", "rotation", "rotationX", "rotationY", "angle"];

var c = i.concat(
  "name",
  "active",
  "position",
  "x",
  "y",
  "z",
  "quat",
  "eulerAngles",
  "zIndex"
);

var s = ["node", "_objFlags"];
var f = ["name", "active", "eulerAngles", "zIndex"];
var d = require("../../../share/prefab-defs").Deep;
var l = ["quat"];
var u = [];
(function () {
  for (var e = cc.Node, r = e.__props__, t = 0; t < r.length; t++) {
    var n = r[t];
    var a = cc.Class.attr(e, n);

    if (!((false === a.serializable && !a.hasGetter && !a.hasSetter) ||
      a.readonly ||
      "_" === n[0] || a.hasGetter !== a.hasSetter)) {
      if (!cc.js.array.contains(i, n)) {
        l.push(n);
      }

      if (!cc.js.array.contains(c, n)) {
        u.push(n);
      }
    }
  }
})();
var p = {
  NodeRevertableProps_Root: u,
  MISSING_PREFAB_SUFFIX: " (Missing Prefab)",
  Deep: d,
};
function _(e, r, t) {
  if (!r(e, !!t)) {
    for (var n = e._children, a = n.length - 1; a >= 0; --a) {
      _(n[a], r, true);
    }
  }
}
function b(e) {
  return !(!e._prefab || e._prefab.root !== e);
}
function E(e, r) {
  switch (r) {
    case d.None:
      return b(e);
    case d.AllAssets:
      return false;
    case d.SelfAsset:
    default:
      return b(e) && e._prefab.sync;
  }
}
function m(e, r, t, n) {
  var a = (e._prefab = new cc._PrefabInfo());
  a.asset = r;
  a.root = t;
  a.fileId = n || "";
  return a;
}
function g(e, r, t) {
  for (
    var n = e._prefab.sync, a = t ? u : n ? f : l, o = 0;
    o < a.length;
    o++
  ) {
    var i = a[o];
    r[i] = e[i];
  }
  const c = cc.Object.Flags.PersistentMask;
  r._objFlags = (e._objFlags & c) | (r._objFlags & ~c);
  if ((!n)) {
    var s;
    var d;
    var p;
    for (s = 0; s < r._components.length; ++s) {
      d = r._components[s];

      if (!((p = e.getComponent(d.constructor)) && d.constructor === p.constructor)) {
        d.destroy();
      }
    }
    cc.Object._deferredDestroy();
    var _ = [];
    for (s = 0; s < e._components.length; ++s) {
      p = e._components[s];

      if (!((d = r.getComponent(p.constructor)) && d.constructor === p.constructor)) {
        d = r.addComponent(p.constructor);
      }

      _.push(d);

      if (d instanceof cc.RenderComponent) {
        S(p, d);
      } else {
        v(p, d);
      }
    }
    e._components.length = 0;
    e._components.push.apply(e._components, _);
  }
}
function v(e, r) {
  for (var t = r.constructor.__values__, n = 0; n < t.length; n++) {
    var a = t[n];
    if (cc.js.array.contains(s, a)) {
      continue;
    }
    let o = e[a];

    if (r[a] !== o) {
      r[a] = e[a];
    }
  }
}
function S(e, r) {
  let t = r.constructor;
  let n = t.__props__;
  for (let a in n) {
    let o = n[a];
    let i = cc.Class.attr(t, o);
    if ((false === i.serializable && !i.hasGetter && !i.hasSetter) ||
    i.readonly ||
    "_" === o[0] ||
    i.hasGetter !== i.hasSetter) {
      continue;
    }
    if (cc.js.array.contains(s, o)) {
      continue;
    }
    let c = e[o];

    if (!(i.hasSetter && r[o] === c)) {
      r[o] = e[o];
    }
  }
}
function h(e, r) {
  if (e._prefab && e._prefab.fileId === r) {
    return e;
  }
  for (var t = e._children, n = 0, a = t.length; n < a; n++) {
    if ((e = h(t[n], r))) {
      return e;
    }
  }
  return null;
}
function y(e, r, t, n, o) {
  var i;
  var c = t.node;
  var s = p.getSyncedRootInScene(c);
  var f = p.getSyncedRootInScene(e);
  if (s === f) {
    return true;
  }
  if (s) {
    i = "MESSAGE.prefab.synced_disallow_ref_to_external";
  } else {
    if (f) {
      if (e !== f) {
        i = "MESSAGE.prefab.disallow_ref_to_chlid_of_synced";
      } else {
        if (r) {
          i = "MESSAGE.prefab.disallow_ref_to_comp_of_synced";
        }
      }
    }
  }
  return (!i || ((function (e, r, t, n, o) {
    var i = Editor.T(e);

    var c = Editor.T("MESSAGE.prefab.invalid_ref_detail", {
      component: cc.js.getClassName(t),
      property: n,
      node: a.getNodePath(r),
    });

    if (o) {
      Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.sure")],
            message: i,
            detail: c,
            noLink: true,
          });
    } else {
      Editor.error(
            Editor.T("MESSAGE.prefab.message_and_detail", {
              message: i,
              detail: c,
            })
          );
    }
  })(i, c, t, n, o), false));
}
function A(e) {
  e.setPosition(0, 0, 0);
  e.setRotation(0, 0, 0, 1);
  e.parent = null;
  e.name = "";
  e.zIndex = 0;
  e.active = true;
  e._prefab.fileId = "";

  _(e, function (r) {
    if (r instanceof cc.PrivateNode) {
      r.parent = null;
      return true;
    }
    let t = r.getComponent(cc.RenderComponent);

    if (t) {
      t._activateMaterial();
    }

    if (r._prefab.root === e) {
      r._prefab.asset = null;
    }
  });
}
async function savePrefabFile(r) {
  if (!r.isValid || !r._prefab.asset) {
    return false;
  }
  let prefabObj;
  try {
    let n = "load prefab asset: " + r.name;
    console.time(n);

    prefabObj = await e(cc.assetManager.loadAny.bind(cc.assetManager))(
        r._prefab.asset._uuid
      );

    console.timeEnd(n);
  } catch (e) {
    throw (Editor.warn("Failed to load prefab asset: " + e), e);
  }
  if (!r.isValid) {
    return false;
  }
  let n = "check prefab dirty: " + r.name;
  console.time(n);

  let a = Editor.serialize(
      (function (e) {
        let r = cc.instantiate(e);
        A(r);

        _(r, function (e, r) {
          e._id = "";
          for (var t = 0; t < e._components.length; ++t) {
            e._components[t]._id = "";
          }
        });

        return r;
      })(prefabObj.data),
      { stringify: true }
    );

  let o = Editor.serialize(
    (function (e) {
      let r = p.getDumpableNode(e, true);
      A(r);
      return r;
    })(r),
    { stringify: true }
  ) !== a;

  console.timeEnd(n);
  return o;
}

p.getDumpableNode = function (e, r) {
  _((e = cc.instantiate(e)), function (t, n) {
    if (n && b(t) && t._prefab.sync) {
      return true;
    }
    (function (e, r) {
      function t(e, t) {
        for (
          var n = (t = t || e.constructor).__values__, a = 0;
          a < n.length;
          a++
        ) {
          var o = n[a];
          var i = e[o];
          if (i && "object" == typeof i) {
            if (Array.isArray(i)) {
              for (var c = 0; c < i.length; c++) {
                if (cc.isValid(i)) {
                  r(i, "" + c, i[c]);
                }
              }
            } else {
              if (cc.isValid(i)) {
                r(e, o, i);
              }
            }
          }
        }
      }
      for (var n = 0; n < e._components.length; ++n) {
        var a = e._components[n];

        if (a) {
          t(a);
        }
      }
    })(t, function (t, n, a) {
      var o;
      var i = false;
      if (a instanceof cc.Component.EventHandler) {
        a = a.target;
      }
      if (a instanceof cc.Component) {
        a = a.node;
      }
      if (a instanceof cc._BaseNode) {
        if (!a.isChildOf(e)) {
          i = true;
          o = a.name;
        }
      }
      if (i) {
        t[n] = null;
        if (!CC_TEST && !r) {
          Editor.error(
            'Reference "%s" of "%s" to external scene object "%s" can not be saved in prefab asset.',
            n,
            t.name || e.name,
            o
          );
        }
      }
    });
  });

  _(e, function (e, r) {
    e._id = "";
    if (r && b(e) && e._prefab.sync) {
      return true;
    }
    for (var t = 0; t < e._components.length; ++t) {
      e._components[t]._id = "";
    }
  });

  e._prefab.sync = false;
  return e;
};

p.createPrefabFrom = function (e, r) {
  var t = new cc.Prefab();
  p.linkPrefab(t, e, e, r);
  var n = p.getDumpableNode(e);
  t.data = n;
  return t;
};

p.createAppliedPrefab = function (e) {
  p.checkCircularReference(e, true);
  var r = new cc.Prefab();
  var t = p.getDumpableNode(e);
  r.data = t;
  return r;
};

p.linkPrefab = function (e, r, t, n) {
    _(t || r, function (t, a) {
      let o = a && b(t);
      let i = t._prefab;

      if (i) {
        if (!o) {
          i.asset = e;
          i.root = r;
        }
      } else {
        i = m(t, e, r);
      }

      if (!(t === r || i.fileId)) {
        i.fileId = n ? n(t) : Editor.Utils.UuidUtils.uuid();
      }

      if (o) {
        return true;
      }
    });
  };

p.unlinkPrefab = function (e, r) {
    _(
      e,
      r
        ? function (e) {
            e._prefab = null;
          }
        : function (e, r) {
            if (r && b(e)) {
              return true;
            }
            e._prefab = null;
          }
    );
  };

p._doRevertPrefab = function (e, r, t) {
  let n = cc.instantiate(r.data);
  (function (e, r) {
    o.walkProperties(
      r,
      function (t, n, a, o) {
        var i =
          a &&
          "object" == typeof a &&
          (cc.Node.isNode(a) || a instanceof cc.Component);
        if (i) {
          if (t instanceof cc.Component) {
            if ("node" === n) {
              return;
            }
          } else {
            if (t instanceof cc._BaseNode ||
            t instanceof cc._PrefabInfo ||
            t instanceof cc.Asset) {
              return;
            }
            for (var c = null, s = o.length - 1; s >= 0; s--) {
              var f = o[s];
              if (
                f instanceof cc.Component ||
                cc.Node.isNode(f) ||
                f instanceof cc.Asset ||
                f instanceof cc._PrefabInfo
              ) {
                c = f;
                break;
              }
            }
            if (!(c instanceof cc.Component)) {
              if (c) {
                return;
              }
              Editor.error("Unknown parsing object");
            }
          }
          (function (e, r, t, n, a) {
            var o;
            var i;
            o = t instanceof cc.Component ? t.node : t;
            if (!o._prefab) {
              return cc.error("Node in prefab should have PrefabInfo");
            }
            if (o === n) {
              i = a;
            } else {
              var c = (function e(r, t, n) {
                if (r === t) {
                  return;
                }
                n.push(r._prefab.fileId);
                let a = r._prefab.root;

                if (a !== r) {
                  e(a, t, n);
                } else {
                  if (r._parent &&
                      r._parent._prefab) {
                    e(r._parent._prefab.root, t, n);
                  }
                }

                return n;
              })(o, n, []);
              i = (function (e, r) {
                for (let t = r.length - 1; t >= 0; --t) {
                  let n = r[t];
                  if (!(e = h(e, n))) {
                    break;
                  }
                }
                return e;
              })(a, c);
            }

            if (i &&
              t instanceof cc.Component) {
              i = i.getComponent(t.constructor);
            }

            e[r] = i;
          })(t, n, a, r, e);
        }
      },
      { ignoreParent: true }
    );
  })(e, n);
  var a = Object.create(null);
  var i = Object.create(null);
  function c(e, r) {
    return new Error(
      `Can not revert prefab, the file id of ${e} is duplicated with ${r}, please recreate the prefab again by click [${Editor.T(
        "MAIN_MENU.node.title"
      )} - ${Editor.T(
        "MAIN_MENU.node.break_prefab_instance"
      )}] and [${Editor.T("MAIN_MENU.node.title")} - ${Editor.T(
        "MAIN_MENU.node.link_prefab"
      )}] in the menu.`
    );
  }

  _(n, function (r, o) {
    if (o) {
      var s = r._prefab;
      var f = s.fileId;
      if (!f) {
        throw new Error(
          'Can not revert the prefab, the file id of "' +
            r.name +
            '" is missing, please save the prefab to a new asset by dragging and drop the node from Node Tree into Assets.'
        );
      }
      if (f in i) {
        throw c(`"${r.name}" in prefab asset`, `"${i[f].name}"`);
      }
      i[f] = r;
      var d = h(e, f);

      if (!d) {
        if (b(r)) {
          (d = cc.instantiate(r))._prefab.fileId = f;
        } else {
          g(r, (d = new r.constructor()), false);
          m(d, s.asset, e, f);
        }
      }

      if (f in a) {
        throw c(`"${d.name}" in scene`, `"${a[f].name}"`);
      }
      a[f] = d;
      if ((r._parent)) {
        if (r._parent === n) {
          d.parent = e;
        } else {
          var l = r._parent._prefab.fileId;
          var u = a[l];

          console.assert(
            u,
            "parent should exist since we create them from ascendent to descendant"
          );

          d.parent = u;
        }
        console.assert(
          d._prefab.fileId === f,
          "old fileId should be preserved when reverting"
        );
      }
      return !(!o || !E(r, t)) || void 0;
    }
  });

  _(e, function (r, o) {
    if (r._prefab) {
      var c = r._prefab.fileId;
      var s = o ? i[c] : n;
      if (s) {
        g(s, r, !o);
        if ((o)) {
          var f;
          if (s._prefab.root !== n) {
            let e = s._prefab.root && s._prefab.root._prefab;
            if (!e) {
              throw new Error(
                'Can not revert the prefab, the root data of "' +
                  s.name +
                  '" is missing.'
              );
            }
            if (!(f = a[e.fileId])) {
              throw new Error(
                'Can not revert the prefab, the root node of "' +
                  s.name +
                  '" is missing.'
              );
            }
          } else {
            f = e;
          }
          r._prefab.root = f;
          r._prefab.asset = s._prefab.asset;
          r._prefab.sync = s._prefab.sync;
          return E(r, t);
        }
        return;
      }
    }
    r.destroy();
    return true;
  });

  cc.Object._deferredDestroy();

  _(n, function (e, r) {
    if (r && E(e, t)) {
      return true;
    }
    var n = e._children;
    if (n) {
      for (var o = 0; o < n.length; o++) {
        var i = n[o]._prefab.fileId;
        a[i].setSiblingIndex(o);
      }
    }
  });
};

p.revertPrefab = async function (r, t, n, a) {
  if ("function" == typeof n) {
    a = n;
    n = void 0;
  }

  if (CC_EDITOR && cc.engine.isPlaying) {
    return cc.warn("Disallow to revert prefab when the engine is playing.");
  }
  if (r._prefab && r._prefab.asset) {
    var o = r._prefab.asset._uuid;
    try {
      n = n || (await e(cc.assetManager.loadAny.bind(cc.assetManager))(o));

      if (require("./animation").verifyPrefab(r, n)) {
        p._doRevertPrefab(r, n, t);

        if (t === p.Deep.AllAssets) {
          (await (async function e(r, t, n) {
              if (t && (await n(r))) {
                return;
              }
              for (var a = r._children, o = a.length - 1; o >= 0; --o) {
                await e(a[o], true, n);
              }
            })(r, false, async function (e) {
              if (b(e) && e._prefab.sync) {
                await p.revertPrefab(e, t);
                return true;
              }
            }));
        }

        if (a) {
          a();
        }
      }
    } catch (e) {
      Editor.error(e);
    }
  }
};

p._setPrefabSync = function (e, r) {
    e._prefab.sync = r;
  };

p.setPrefabSync = function (e, r, t) {
  if (e._prefab.sync !== r && r && !CC_TEST) {
    var n;

    var o = {
      node: a.getNodePath(e),
      asset: Editor.assetdb.remote.uuidToUrl(e._prefab.asset._uuid),
    };

    if (t) {
      if (0 ===
      (n = Editor.Dialog.messageBox({
        type: "question",
        buttons: [Editor.T("MESSAGE.cancel"), Editor.T("MESSAGE.revert")],
        message: Editor.T("MESSAGE.prefab.revert_missing_prefab"),
        detail: Editor.T("MESSAGE.prefab.revert_missing_prefab_detail", o),
        defaultId: 1,
        cancelId: 0,
        noLink: true,
      }))) {
        return false;
      }
      _Scene.revertPrefab(e.uuid, p.Deep.SelfAsset);
    } else {
      let r = e._prefab.asset.readonly;

      let t = [
        Editor.T("MESSAGE.apply"),
        Editor.T("MESSAGE.cancel"),
        Editor.T("INSPECTOR.node.prefab_btn_revert"),
      ];

      if (r) {
        t = [
              Editor.T("INSPECTOR.node.prefab_btn_revert"),
              Editor.T("MESSAGE.cancel"),
            ];
      }

      if (1 ===
        (n = Editor.Dialog.messageBox({
          type: "question",
          buttons: t,
          message: Editor.T(
            "MESSAGE.prefab.apply_new_synced_prefab_message"
          ),
          detail: Editor.T("MESSAGE.prefab.apply_synced_prefab_detail", o),
          defaultId: 0,
          cancelId: 1,
          noLink: true,
        }))) {
        return false;
      }

      if (r || 0 !== n) {
        _Scene.revertPrefab(e.uuid, p.Deep.SelfAsset);
      } else {
        _Scene.applyPrefab(e.uuid, p.Deep.SelfAsset);
      }
    }
  }
  this._setPrefabSync(e, r);
  return true;
};

p.syncPrefab = function (e) {
    _(cc.director.getScene(), function (r) {
      if (!r) {
        return true;
      }
      var t = r._prefab;
      return (!(!t || !t.asset || t.asset._uuid !== e) && (t.sync && p.revertPrefab(r, p.Deep.SelfAsset), true));
    });
  };

p.validateSceneReference = function (e, r, t) {
  var n;
  var a;
  if (e instanceof cc.Component) {
    a = e;
    n = e.node;
  } else {
    if (!cc.Node.isNode(e)) {
      return true;
    }
    n = e;
  }
  return y(n, a, r, t, true);
};

p.validateAllSceneReferences = function (e) {
    o.walkProperties(e, function (e, r, t, n) {
      var a;
      var i;

      if (t instanceof cc.Component) {
        i = t;
        a = t.node;
      } else {
        if (cc.Node.isNode(t)) {
          a = t;
        }
      }

      if (
        (a)
      ) {
        var c;
        if (e instanceof cc.Component) {
          if ("node" === r) {
            return;
          }
          c = e;
        } else {
          if (e instanceof cc.Node) {
            return;
          }
          c = null;
          for (var s = n.length - 1; s >= 0; s--) {
            var f = n[s];
            if (f instanceof cc.Component) {
              c = f;
              break;
            }
            if (f instanceof cc.Node) {
              break;
            }
          }
          if (!c) {
            return;
          }
        }
        y(a, i, c, c === e ? r : o.getNextProperty(n, e, c), false);
      }
    });
  };

let P = false;

p.confirmPrefabSynced = async function (e, r) {
  console.trace("dzq confirmPrefabSynced", e, r);
  return (!(!P && e && (await savePrefabFile(e))) || (await new Promise(async (o) => {
    let i = "win32" === process.platform ? n.getFocusedWindow() : null;
    const c = await t.showMessageBox(i, {
      type: "question",
      buttons: [
        Editor.T("MESSAGE.apply"),
        Editor.T("INSPECTOR.node.prefab_btn_revert"),
      ],
      message: Editor.T("MESSAGE.prefab.apply_synced_prefab_message"),
      detail: Editor.T("MESSAGE.prefab.apply_synced_prefab_detail", {
        node: a.getNodePath(e),
        asset: Editor.assetdb.remote.uuidToUrl(e._prefab.asset._uuid),
      }),
      checkboxLabel: Editor.T("MESSAGE.prefab.do_not_notify"),
      checkboxChecked: false,
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    });
    P = c.checkboxChecked;
    try {
      if (0 === c.response) {
        const t = r && e._prefab.asset._uuid === r._prefab.asset._uuid;
        _Scene.applyPrefab(e.uuid, p.Deep.SelfAsset, t && r);
      } else {
        _Scene.revertPrefab(e.uuid, p.Deep.SelfAsset);
      }
    } catch (e) {}
    o(0 === c.response);
  })));
};

p.getSyncedRootInScene = function (e) {
    let r;
    return e && (r = e._prefab)
      ? r.root._prefab.sync
        ? r.root
        : p.getSyncedRootInScene(r.root._parent)
      : null;
  };

p.confirmEditingPrefabSynced = async function () {
  var e = Editor.Selection.curActivate("node");
  var r = e && cc.engine.getInstanceById(e);
  var t = p.getSyncedRootInScene(r);

  if (t) {
    (await p.confirmPrefabSynced(t));
  }
};

var w = -1;
var C = null;
function T(e, r) {
  if (e._prefab.asset) {
    let t = r.findIndex((r) => r._prefab.asset._uuid === e._prefab.asset._uuid);
    if (-1 !== t) {
      r.push(e);
      return r.slice(t).reverse();
    }
    r.push(e);
  }
  let t = e._prefab.root._parent;
  return t && t._prefab ? T(t._prefab.root, r) : null;
}

p.confirmPrefabSyncedLater = function (e) {
  if (C) {
    if (w) {
      clearTimeout(w);
      w = -1;
    }

    var r = C;
    if (r.isValid) {
      C = null;
      var t = Editor.Selection.curActivate("node");
      var n = t && cc.engine.getInstanceById(t);
      if (n) {
        var a = n._prefab && n._prefab.root;
        if (a === r) {
          return;
        }
        if (a && a.isChildOf(r)) {
          return;
        }
      }
      this.confirmPrefabSynced(r, a);
    }
  } else {
    if (!e) {
      return console.error("Root is invalid");
    }
  }

  if (e) {
    C = e;

    w = setTimeout(function () {
        p.confirmPrefabSyncedLater();
      }, 100);
  }
};

let M = Object.create(null);
function N(e) {
  let t = M[e];

  if (!t) {
    t = r(function () {
      Editor.error(e);
      delete M[e];
    }, 100);

    M[e] = t;
  }

  t();
}

p.checkCircularReference = function (e, r) {
  let t = [];
  _(e, function (e) {
    if (e instanceof cc.PrivateNode) {
      return true;
    }

    if (b(e) && e._prefab.asset) {
      t.push(e);
    }
  });
  for (const e of t) {
    let t = T(e, []);
    if (t) {
      let n = Editor.T("MESSAGE.prefab.circular_reference");

      let a = Editor.T("MESSAGE.prefab.circular_reference_detail", {
        prefabs: t.map((e) => e.name).join(" -> "),
        asset: Editor.assetdb.remote.uuidToUrl(e._prefab.asset._uuid),
      });

      let o = Editor.T("MESSAGE.prefab.message_and_detail", {
        message: n,
        detail: a,
      });

      if (r) {
        throw (
          (Editor.Dialog.messageBox({
            type: "error",
            buttons: [Editor.T("MESSAGE.ok")],
            message: n,
            detail: a,
            defaultId: 0,
            cancelId: 0,
            noLink: true,
          }),
          new Error(o))
        );
      }
      N(o);
      return;
    }
  }
};

module.exports = p;
