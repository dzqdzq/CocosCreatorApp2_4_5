"use strict";
const e = require("../lib/tasks");
const n = require("./node");
const t = require("./animation");
const o = require("./prefab");
const c = require("../edit-mode");
const { Vec3: r, Quat: i, Mat4: d } = cc.math;
let a = null;
let s = null;

let l = function (e) {
  return Editor.Utils.arrayCmpFilter(e, (e, n) =>
    e === n ? 0 : n.isChildOf(e) ? 1 : e.isChildOf(n) ? -1 : 0
  );
};

let u = function (e, t, o, c, r) {
  let i;

  if (t) {
    i = cc.engine.getInstanceById(t);
  }

  if (!i) {
    i = cc.director.getScene();
  }

  Editor.Selection.unselect(
    "node",
    Editor.Selection.curSelection("node"),
    false
  );

  let d = e.map((e) => {
    return new Promise(function (t, r) {
      n.createNodeFromAsset(e, (e, n) => {
        if (e) {
          return r(e);
        }
        let d;
        if (n) {
          d = n.uuid;

          if (i) {
            n.parent = i;
          }

          if ((c)) {
            n.parent = null;
            let e = cc.engine.getInstanceById(c).getSiblingIndex();
            n.parent = i;
            n.setSiblingIndex(e);
          }
          _Scene.Undo.recordCreateNode(d);
        }

        if (d) {
          Editor.Selection.select("node", d, false, false);
        }

        cc.engine.repaintInEditMode();

        if (o &&
          o.unlinkPrefab) {
          if (!(n && n.parent && n.parent._prefab)) {
            _Scene.breakPrefabInstance([d]);
          }
        }

        t(n);
      });
    }).catch((n) => {
      Editor.failed(
        `Failed to drop asset ${Editor.remote.assetdb.uuidToUrl(
          e
        )}, message: ${n.stack}`
      );
    });
  });
  Promise.all(d)
    .then((e) => {
    _Scene.Undo.commit();
    Editor.Selection.confirm();

    if (r) {
      r(null, e);
    }
  })
    .catch((e) => {
    _Scene.Undo.commit();
    Editor.Selection.cancel();

    if (r) {
      r(e);
    }
  });
};

let m = function (e, n, t) {
  if (n._disallowMultiple) {
    let o = e.getComponent(n._disallowMultiple);
    if (o) {
      let e;
      let c;

      e = o.constructor === n
        ? Editor.T("MESSAGE.scene.contain_same_component")
        : Editor.T("MESSAGE.scene.contain_derive_component", {
            className: cc.js.getClassName(o),
          });

      c = t
        ? "MESSAGE.scene.cant_add_required_component"
        : "MESSAGE.scene.cant_add_component";

      Editor.Dialog.messageBox({
        type: "warning",
        buttons: ["OK"],
        title: Editor.T("MESSAGE.warning"),
        message: Editor.T(c, { className: cc.js.getClassName(n) }),
        detail: e,
        noLink: true,
      });

      return false;
    }
  }
  let o = n._requireComponent;
  return !(o && !e.getComponent(o)) || m(e, o, true);
};

let g = function (e, n) {
  let t = Editor.Utils.UuidUtils.isUuid(n);
  let o = cc.js._getClassById(n);
  if (!o) {
    return t
      ? (Editor.error(`Can not find cc.Component in the script ${n}.`), false)
      : (Editor.error(`Failed to get component ${n}`), false);
  }
  let c = cc.engine.getInstanceById(e);
  return c ? m(c, o) : (Editor.error(`Can not find node ${e}`), false);
};

let p = function (e, n) {
  let o = cc.engine.getInstanceById(n);
  if (!o) {
    Editor.error(`Can not find component ${n}`);
    return false;
  }
  if (t.STATE.RECORD) {
    if (o instanceof cc.Animation) {
      Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.ok")],
            title: Editor.T("MESSAGE.warning"),
            message: Editor.T("MESSAGE.scene.cant_remove_component", {
              className: cc.js.getClassName(o),
            }),
            detail: Editor.T("MESSAGE.scene.cant_remove_component_detail", {
              className: Editor.T("MAIN_MENU.panel.timeline"),
            }),
            noLink: true,
          });
    } else {
      Editor.Dialog.messageBox({
            type: "warning",
            buttons: [Editor.T("MESSAGE.ok")],
            title: Editor.T("MESSAGE.warning"),
            message: Editor.T("MESSAGE.animation_editor.recording_tips"),
            detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
            noLink: true,
          });
    }

    return false;
  }
  let c = cc.engine.getInstanceById(e);
  if (!c) {
    Editor.error(`Can not find node ${e}`);
    return;
  }
  let r = c._getDependComponent(o);
  return (!r || (Editor.Dialog.messageBox({
    type: "warning",
    buttons: [Editor.T("MESSAGE.ok")],
    title: Editor.T("MESSAGE.warning"),
    message: Editor.T("MESSAGE.scene.cant_remove_component", {
      className: cc.js.getClassName(o),
    }),
    detail: Editor.T("MESSAGE.scene.cant_remove_component_detail", {
      className: cc.js.getClassName(r),
    }),
    noLink: true,
  }), false));
};

let E = function (e) {
  var n = e.__asyncStates;
  for (var t in n) {
    if ("start" === n[t].state) {
      return true;
    }
  }
  return false;
};

module.exports = {
  createDefaultScene: function () {
    let e = new cc.Scene();
    let n = new cc.Node("Canvas");
    n.parent = e;
    n.addComponent(cc.Canvas);
    let t = n.addComponent(cc.Widget);
    t.isAlignTop = true;
    t.isAlignBottom = true;
    t.isAlignLeft = true;
    t.isAlignRight = true;
    return e;
  },
  loadScene: function (e, n) {
    cc.director.runSceneImmediate(e);

    Editor.Ipc.sendToMain(
      "scene:set-current-scene",
      null,
      function (e, ...t) {
        if (n) {
          n(e, ...t);
        }
      }
    );
  },
  loadSceneByUuid: function (n, t) {
    e.push(
      {
        name: "load-scene-by-uuid",
        run(e) {
          cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING);

          cc.assetManager.loadAny(n, (t, o) => {
            if (t) {
              if (e) {
                e(t);
              }

              return;
            }
            if (!(o instanceof cc.SceneAsset)) {
              t = "The asset " + n + " is not a scene";
              cc.error(t);

              if (e) {
                e(t);
              }

              return;
            }
            var c = o.scene;
            c._id = o._uuid;
            c._name = o._name;
            cc.director.runSceneImmediate(c);

            Editor.Ipc.sendToMain("scene:set-current-scene", n, (n) => {
              if (e) {
                e(n);
              }
            });
          });
        },
      },
      t
    );
  },
  isAnyChildClassOf: function (e, ...n) {
    for (var t = 0; t < n.length; ++t) {
      if (cc.js.isChildClassOf(e, n[t])) {
        return true;
      }
    }
    return false;
  },
  copyNodes: function (e) {
    let n = e.map((e) => cc.engine.getInstanceById(e)).filter((e) => !!e);

    n = (function (e) {
      return Editor.Utils.arrayCmpFilter(e, (e, n) =>
        e === n ? 0 : n.isChildOf(e) ? 1 : e.isChildOf(n) ? -1 : 0
      );
    })(n).filter((e) => !!e);

    let t = { sceneId: cc.director.getScene().uuid, nodes: {} };

    n.forEach((e) => {
      t.nodes[e.uuid] = cc.instantiate(e);
    });

    a = t;
  },
  pasteNodes: function (e) {
    if (!a || t.STATE.RECORD) {
      return;
    }
    let n;

    if (e) {
      n = cc.engine.getInstanceById(e);
    }

    if (!n) {
      n = cc.director.getScene();
    }

    let o = [];
    for (let e in a.nodes) {
      let t = cc.instantiate(a.nodes[e]);
      t.parent = n;
      o.push(t.uuid);
      _Scene.Undo.recordCreateNode(t.uuid);
    }
    _Scene.Undo.commit();
    Editor.Selection.select("node", o);
  },
  duplicateNodes: function (e) {
    if (t.STATE.RECORD) {
      return;
    }
    let n = e.map((e) => cc.engine.getInstanceById(e));
    n = n.filter((e) => !!e);
    let o = [];

    (n = l(n)).forEach((e) => {
      let n = cc.instantiate(e);
      n.parent = e.parent;
      let t = e.getSiblingIndex();
      n.name = e.name && e.name.endsWith(" copy") ? e.name : `${e.name} copy`;
      n.setSiblingIndex(t + 1);
      o.push(n.uuid);
      _Scene.Undo.recordCreateNode(n.uuid);
    });

    _Scene.Undo.commit();
    Editor.Selection.select("node", o);
  },
  moveNodes: function (e, n, t) {
    let r;

    let i = function (e) {
      return e._parent ? e._parent._children.indexOf(e) : -1;
    };

    r = n ? cc.engine.getInstanceById(n) : cc.director.getScene();
    let d = t ? cc.engine.getInstanceById(t) : null;
    if (!r) {
      return;
    }
    let a = "prefab" === c.curMode().name;

    e.forEach(async (e) => {
      let n;
      let t = cc.engine.getInstanceById(e);
      if (t && !r.isChildOf(t)) {
        _Scene.Undo.recordMoveNode(e);
        if ((!a)) {
          let t = cc.engine.getInstanceById(e);
          n = o.getSyncedRootInScene(t);
        }
        if (t.parent !== r) {
          let e = t.getWorldPosition(cc.v3());
          let n = t.worldEulerAngles;
          let o = t.getWorldScale(cc.v3());
          t.parent = r;
          t.setWorldPosition(e);
          t.worldEulerAngles = n;
          t.setWorldScale(o);
          _Scene.adjustNodePosition(t, 5);
          _Scene.adjustNodeScale(t, 5);
          t.parent = null;
          let c = d ? i(d) : -1;
          t.parent = r;
          t.setSiblingIndex(c);
        } else {
          let e = i(t);
          let n = d ? i(d) : -1;

          if (e < n) {
            n -= 1;
          }

          t.setSiblingIndex(n);
        }

        if (!a &&
          (n = n || o.getSyncedRootInScene(r))) {
          if (!(await o.confirmPrefabSynced(n))) {
            _Scene.Undo.undo();
          }
        }
      }
    });

    _Scene.Undo.commit();
  },
  hasCopiedComponent: function () {
    return !!s;
  },
  copyComponent: function (e) {
    let n = cc.engine.getInstanceById(e);

    if (n) {
      s = cc.instantiate(n, true);
    }
  },
  pasteComponent: function (e, n) {
    let t = cc.engine.getInstanceById(e);
    if (t && s) {
      let o = cc.instantiate(s, true);
      t._addComponentAt(o, n);
      cc.director._nodeActivator.resetComp(o, false);
      _Scene.Undo.recordAddComponent(t.uuid, o, n, "Paste Component");
      _Scene.Undo.commit();

      Editor.Ipc.sendToAll("scene:node-component-pasted", {
        node: e,
        component: cc.js.getClassName(o),
      });
    }
  },
  createNodes: u,
  createNodesAt: function (e, n, t, o) {
    u(e, null, o, null, (e, o) => {
      if (e) {
        Editor.error(e);
        return;
      }
      o.forEach((e) => {
        if (e) {
          e.setPosition(_Scene.view.pixelToScene(cc.v2(n, t)));
          _Scene.adjustNodePosition(e);
        }
      });
    });
  },
  createNodeByClassID: function (e, t, o, c) {
    let r;

    if (o) {
      r = cc.engine.getInstanceById(o);

      if (c) {
        r = r.parent;
      }
    }

    if (!r) {
      r = cc.director.getScene();
    }

    n.createNodeFromClass(t, (n, t) => {
      if (n) {
        return Editor.error(n);
      }
      t.name = e;
      t.parent = r;
      cc.engine.repaintInEditMode();
      Editor.Selection.select("node", t.uuid, true, true);
      _Scene.Undo.recordCreateNode(t.uuid);
      _Scene.Undo.commit();
    });
  },
  createNodeByPrefab: function (e, t, c, r) {
    let i;
    n.createNodeFromAsset(t, (n, t) => {
      if (n) {
        Editor.error(n);
        return;
      }
      o.unlinkPrefab(t, true);
      t.name = e;

      if (c) {
        i = cc.engine.getInstanceById(c);

        if (r) {
          i = i.parent;
        }
      }

      if (!i) {
        i = cc.director.getScene();
      }

      var d = t.getComponent(cc.Canvas);

      if (d) {
        _Scene._applyCanvasPreferences(d);
      }

      t.parent = i;
      cc.engine.repaintInEditMode();
      Editor.Selection.select("node", t.uuid, true, true);
      _Scene.Undo.recordCreateNode(t.uuid);
      _Scene.Undo.commit();
    });
  },
  deleteNodes: function (e) {
    if (t.STATE.RECORD) {
      return;
    }
    let o = [];
    for (let n = 0; n < e.length; ++n) {
      let t = cc.engine.getInstanceById(e[n]);

      if (t) {
        o.push(t);
      }
    }

    l(o).forEach((e) => {
      n._destroyForUndo(e, () => {
        _Scene.Undo.recordDeleteNode(e.uuid);
      });
    });

    _Scene.Undo.commit();
    Editor.Selection.unselect("node", e, true);
  },
  checkAddComponentID: g,
  addComponent: function (e, o) {
    if (!g(e, o)) {
      return;
    }
    let c = cc.engine.getInstanceById(e);
    let r = cc.js._getClassById(o);
    let i = c.addComponent(r);

    if (i) {
      cc.director._nodeActivator.resetComp(i, true);
      _Scene.Undo.recordAddComponent(e, i, c._components.indexOf(i));
      _Scene.Undo.commit();
      t.onAddComponent(c, i);
    }

    n.addComponentHandle(c, i);
  },
  checkRemoveComponentID: p,
  removeComponent: function (e, o) {
    if (!p(e, o)) {
      return;
    }
    let c = cc.engine.getInstanceById(o);
    let r = cc.engine.getInstanceById(e);

    n._destroyForUndo(c, () => {
      _Scene.Undo.recordRemoveComponent(e, c, r._components.indexOf(c));
    });

    _Scene.Undo.commit();
    t.onRemoveComponent(r, c);
  },
  createProperty: function (e, n, t) {
    const o = Editor.require(
      "unpack://engine-dev/cocos2d/core/platform/CCClass"
    ).getDefault;
    let c = cc.engine.getInstanceById(e);
    if (c) {
      try {
        let r;
        let i = cc.Class.attr(c.constructor, n);
        if (i && Array.isArray(o(i.default))) {
          r = [];
        } else {
          let e = cc.js._getClassById(t);
          if (e) {
            try {
              r = new e();
            } catch (t) {
              Editor.error(
                `Can not new property at ${n} for type ${cc.js.getClassName(
                  e
                )}.\n${t.stack}`
              );

              return;
            }
          }
        }

        if (r) {
          _Scene.Undo.recordObject(e);
          Editor.setDeepPropertyByPath(c, n, r, t);
          _Scene.Undo.commit();
          cc.engine.repaintInEditMode();
        }
      } catch (e) {
        Editor.warn(`Failed to new property ${c.name} at ${n}, ${e.message}`);
      }
    }
  },
  resetProperty: function (e, n, t) {
    let o = cc.engine.getInstanceById(e);
    if (o) {
      _Scene.Undo.recordObject(e);
      try {
        Editor.resetPropertyByPath(o, n, t);
      } catch (e) {
        Editor.warn(`Failed to reset property ${o.name} at ${n}, ${e.message}`);
      }
      _Scene.Undo.commit();
      cc.engine.repaintInEditMode();
    }
  },
  setProperty: function (e) {
    let n = cc.engine.getInstanceById(e.id);
    if (!n) {
      return false;
    }
    if (t.isRecordCurrentClip(n, e)) {
      return false;
    }
    try {
      let o = n;

      if (o instanceof cc.Component) {
        o = n.node;
      }

      _Scene.Undo.recordNode(o.uuid);
      Editor.setPropertyByPath(n, e);
      cc.engine.repaintInEditMode();
      if (E(n)) {
        let e = setInterval(() => {
          if (!E(n)) {
            clearInterval(e);
            t.recordNodeChanged([o], n);
          }
        }, 100);
      } else {
        t.recordNodeChanged([o], n);
      }
      return true;
    } catch (t) {
      if (!(t instanceof Editor.setPropertyByPath.ProhibitedException)) {
        Editor.warn(
          `Failed to set property ${n.name} to ${e.value} at ${e.path}, ${t.stack}`
        );
      }

      return false;
    }
  },
  copyNodeDataToNodes: function (e, n) {
    if (e && n && n.length > 0) {
      let t = (n = n.map((e) => cc.engine.getInstanceById(e)))[0];
      let o = cc.mat4();
      t.getWorldRT(o);
      d.invert(o, o);
      let c = t.getWorldRotation(cc.quat());
      i.invert(c, c);
      let a = e.getWorldPosition(cc.v3());
      let s = e.getWorldRotation(cc.quat());
      let l = cc.mat4();
      e.getWorldRT(l);
      _Scene.Undo.recordNode(t.uuid);
      t.setWorldPosition(a);
      t.setWorldRotation(s);
      if (n.length > 1) {
        for (let e = 1; e < n.length; e++) {
          let t = n[e];
          let d = t.getWorldPosition(cc.v3());
          let a = t.getWorldRotation(cc.quat());
          _Scene.Undo.recordNode(t.uuid);
          r.transformMat4(d, d, o);
          i.mul(a, c, a);
          r.transformMat4(d, d, l);
          t.setWorldPosition(d);
          i.mul(a, s, a);
          t.setWorldRotation(a);
        }
      }
      _Scene.Undo.commit();
    }
  },
};
