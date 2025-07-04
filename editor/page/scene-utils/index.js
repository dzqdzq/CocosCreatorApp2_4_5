"use strict";
const e = require("async");
const t = require("fire-url");

const i = (require("fire-path"), Editor.require("unpack://engine-dev/cocos2d/core/platform/CCClass")
  .getDefault, require("./edit-mode"));

const r = require("./lib/sandbox");
const n = require("./lib/tasks");
const o = require("./utils/prefab");
const s = require("./utils/node");
const a = require("./utils/animation");
const c = require("./utils/effect");
const d = require("./utils/scene");
const l = Editor.require("packages://scene/panel/tools/camera");
const u = Editor.Profile.load("global://settings.json");
let f = {
  _UndoImpl: require("./undo/scene-undo-impl"),
  Undo: require("./undo"),
  EngineEvents: require("./lib/engine-events"),
  DetectConflict: require("./lib/detect-conflict"),
  AssetsWatcher: require("./lib/asset-watcher"),
  StashInPage: require("./lib/stash-scene"),
  PhysicsUtils: require("./utils/physics"),
  PrefabUtils: require("./utils/prefab"),
  AnimUtils: require("./utils/animation"),
  SceneUtils: require("./utils/scene"),
  MaterialUtils: require("./utils/material"),
  _inited: false,
  isLoadingScene: false,
  gizmos: {},
  Sandbox: Editor.require("scene://lib/sandbox"),
  init(e) {
    if (!this.view) {
      this.view = document.createElement("scene-view");
      this.view.id = "sceneView";
      this.view.classList.add("fit");
      this.view.tabIndex = -1;
    }

    if (!this.gizmosView) {
      this.gizmosView = this.view.$gizmosView;
    }

    this.Undo.init();

    this.Undo.on("changed", () => {
      this.updateTitle(this.title());
    });
  },
  reset() {
    Editor.Selection.clear("node");
    this.gizmosView.reset();
    a.pauseAnimation();
    cc.engine.resetAnimatingInEditMode();
  },
  newScene(e) {
    this.reset();
    let t = d.createDefaultScene();
    d.loadScene(t);

    if (e) {
      e();
    }
  },
  loadSceneByUuid(e, t) {
    this.reset();

    d.loadSceneByUuid(e, () => {
      if (t) {
        t();
      }
    });
  },
  initScene(t) {
    let i = Editor.remote.stashedScene;
    let n = i && i.sceneJson;

    if (n) {
      e.waterfall(
            [
              r.loadScripts,
              (e) => {
                _Scene.reset();
                cc.assetManager.editorExtend.loadJson(n, e);
              },
              (e, t) => {
                cc.director.runSceneImmediate(e.scene);
                t();
              },
              _Scene.loadWorkspace.bind(this, i),
            ],
            t
          );
    } else {
      e.waterfall(
            [
              r.loadScripts,
              (e) => {
                let t = Editor.remote.currentSceneUuid;
                if (t) {
                  d.loadSceneByUuid(t, (t) => {
                    e(t, null);
                  });
                } else {
                  let t = d.createDefaultScene();
                  d.loadScene(t);
                  e(null, null);
                }
              },
              _Scene.loadWorkspace,
            ],
            t
          );
    }
  },
  getEditingWorkspace() {
    let e = Editor.Selection.curGlobalActivate();
    return {
      cameraSetting: l.setting,
      designWidth: this.gizmosView.designSize[0],
      designHeight: this.gizmosView.designSize[1],
      sceneSelection: Editor.Selection.curSelection("node"),
      activeType: e ? e.type : null,
    };
  },
  loadWorkspace(e, t) {
    if (e) {
      Editor.Selection.select("node", e.sceneSelection, true, true);
      if (
        (e.activeType && "node" !== e.activeType)
      ) {
        let t = Editor.Selection.curSelection(e.activeType);
        Editor.Selection.select(e.activeType, t);
      }
      l.setting = e.cameraSetting;
    }

    if (t) {
      t();
    }
  },
  stashScene(e) {
    let t;
    let r = i.curMode();
    if (r && r.getPreviewScene) {
      t = r.getPreviewScene();
    } else {
      var n = cc.director.getScene();
      let e = new cc.SceneAsset();
      e.scene = n;
      e.name = n.name;
      t = Editor.serialize(e, { stringify: true });
    }
    var o = this.getEditingWorkspace();
    o.sceneJson = t;
    Editor.remote.stashedScene = o;

    if (e) {
      e(null, t);
    }
  },
  _applyCanvasPreferences(e, t) {
    if (!(e = e || cc.Canvas.instance)) {
      return;
    }
    let i = Editor.Profile.load("project://project.json");
    let r = i.get("design-resolution-width");
    let n = i.get("design-resolution-height");
    e.designResolution = cc.size(r, n);
    e.fitWidth = i.get("fit-width");
    e.fitHeight = i.get("fit-height");

    if (t) {
      t();
    }
  },
  currentScene: () => cc.director.getScene(),
  title: () => i.title(),
  updateTitle(e) {
    Editor.Ipc.sendToMain("scene:update-title", this.Undo.dirty(), e);
  },
  adjustNumber(e, t) {
    t = t || Editor.Math.numOfDecimalsF(1 / this.view.scale);
    return Editor.Math.toPrecision(e, t);
  },
  adjustVec2(e, t) {
    t = t || Editor.Math.numOfDecimalsF(1 / this.view.scale);
    e.x = Editor.Math.toPrecision(e.x, t);
    e.y = Editor.Math.toPrecision(e.y, t);
    return e;
  },
  adjustSize(e, t) {
    t = t || Editor.Math.numOfDecimalsF(1 / this.view.scale);
    e.width = Editor.Math.toPrecision(e.width, t);
    e.height = Editor.Math.toPrecision(e.height, t);
    return e;
  },
  adjustNodePosition(e, t) {
    if (void 0 === t) {
      t = Editor.Math.numOfDecimalsF(1 / this.view.scale);
    }

    e.setPosition(
      Editor.Math.toPrecision(e.position.x, t),
      Editor.Math.toPrecision(e.position.y, t),
      Editor.Math.toPrecision(e.position.z, t)
    );
  },
  adjustNodeScale(e, t) {
    if (void 0 === t) {
      t = Editor.Math.numOfDecimalsF(1 / this.view.scale);
    }

    e.setScale(
      Editor.Math.toPrecision(e.scaleX, t),
      Editor.Math.toPrecision(e.scaleY, t),
      Editor.Math.toPrecision(e.scaleX, t)
    );
  },
  adjustNodeRotation(e, t) {
    if (void 0 === t) {
      t = Editor.Math.numOfDecimalsF(1 / this.view.scale);
    }

    e.rotation = Editor.Math.toPrecision(e.rotation, t);
  },
  adjustNodeSize(e, t) {
    if (void 0 === t) {
      t = Editor.Math.numOfDecimalsF(1 / this.view.scale);
    }

    e.setContentSize(
      Editor.Math.toPrecision(e.width, t),
      Editor.Math.toPrecision(e.height, t)
    );
  },
  adjustNodeAnchor(e, t) {
    if (void 0 === t) {
      t = Editor.Math.numOfDecimalsF(1 / this.view.scale);
    }

    e.setAnchorPoint(
      Editor.Math.toPrecision(e.anchorX, t),
      Editor.Math.toPrecision(e.anchorY, t)
    );
  },
  walk(e, t, i) {
    if (e) {
      if (!i) {
        Editor.warn("walk need a callback");
        return;
      }
      if (t) {
        if (i(e)) {
          return;
        }
      }
      (function e(t, i) {
        let r = t._children;
        for (let t = 0; t < r.length; t++) {
          let n = r[t];

          if (!i(n)) {
            e(n, i);
          }
        }
      })(e, i);
    }
  },
  createPrefab(e, i) {
    let r = cc.engine.getInstanceById(e);
    let n = o.createPrefabFrom(r);
    let s = t.join(i, r.name + ".prefab");
    let a = Editor.serialize(n);
    Editor.Ipc.sendToMain("scene:create-prefab", s, a, (e, t) => {
      if (e) {
        Editor.error(e);
        o.unlinkPrefab(r);
        return;
      }
      n._uuid = t;

      if (u.get("auto-sync-prefab")) {
        o._setPrefabSync(r, true);
      }
    });
  },
  _doApplyPrefab(e, t) {
    if (!e._prefab.asset) {
      return;
    }
    let i = e._prefab.asset._uuid;
    if (!!!Editor.assetdb.remote.uuidToFspath(i)) {
      return Editor.error(
        `Failed to apply "${e._prefab.root.name}" because the prefab asset is missing, please save the prefab to a new asset by dragging and drop the node from Node Tree into Assets.`
      );
    }
    let r = o.createAppliedPrefab(e);
    let n = Editor.serialize(r);

    if (t) {
      this.revertPrefab(t.uuid, o.Deep.SelfAsset, r);
    }

    Editor.Ipc.sendToMain("scene:apply-prefab", i, n);
  },
  applyPrefab(e, t, r) {
    let n = cc.engine.getInstanceById(e);
    if (!n || !n._prefab) {
      return;
    }
    let s = n._prefab.root;

    if (t === o.Deep.AllAssets) {
      this.walk(s, true, (e) => {
        if (e._prefab &&
          e._prefab.root === e) {
          this._doApplyPrefab(e, e === s && r);
        }
      });
    } else {
      this._doApplyPrefab(s, r);
    }

    let a = i.curMode();

    if ("prefab" === a.name && s.uuid === a.rootPrefabId) {
      _Scene.Undo.save();
    }
  },
  revertPrefab(e, t, i) {
    let r = cc.engine.getInstanceById(e);
    if (!r || !r._prefab) {
      return;
    }
    let n = r._prefab.root;
    o.revertPrefab(n, t, i, () => {
      a.onRevertPrefab(n.uuid);
    });
  },
  setPrefabSync(e) {
    let t = cc.engine.getInstanceById(e);

    if (t &&
      t._prefab) {
      t = t._prefab.root;
      o.setPrefabSync(t, !t._prefab.sync);
    }
  },
  setGroupSync(e, t) {
    let i = cc.engine.getInstanceById(e);
    if (i && i.children.length > 0) {
      if (0 ===
        Editor.Dialog.messageBox({
          type: "info",
          buttons: [Editor.T("MESSAGE.confirm"), Editor.T("MESSAGE.cancel")],
          title: "",
          message: Editor.T("MESSAGE.node.sync_group_message"),
          detail: Editor.T("MESSAGE.node.sync_group_detail", { group: t }),
          defaultId: 0,
          cancelId: 1,
          noLink: true,
        })) {
        this.walk(i, false, (e) => {
          e.group = t;
        });
      }
    }
  },
  breakPrefabInstance(e) {
    if (e.length > 0) {
      let t = false;
      for (let i of e) {
        let e = cc.engine.getInstanceById(i);
        if (e && e._prefab) {
          this.Undo.recordNode(i);
          t = true;
          e = e._prefab.root;
          o.unlinkPrefab(e);
          if (
            (e.parent && e.parent._prefab)
          ) {
            let t = e.parent._prefab.root;
            o.linkPrefab(t._prefab.asset, t, e);
          }
          Editor.Utils.refreshSelectedInspector("node", i);
        }
      }

      if (t) {
        this.Undo.commit();
      }
    } else {
      Editor.Dialog.messageBox({
        type: "info",
        buttons: [Editor.T("MESSAGE.ok")],
        message: Editor.T("MESSAGE.prefab.select_prefab_first"),
        noLink: true,
      });
    }
  },
  linkPrefab() {
    let e = {
        type: "info",
        buttons: [Editor.T("MESSAGE.sure")],
        message: Editor.T("MESSAGE.prefab.select_asset_first"),
      };

    let t = {
      type: "info",
      buttons: [Editor.T("MESSAGE.sure")],
      message: Editor.T("MESSAGE.prefab.select_node_first"),
    };

    let i = Editor.Selection.curActivate("node");
    let r = i && cc.engine.getInstanceById(i);
    if (!r) {
      return Editor.Dialog.messageBox(t);
    }
    let n = Editor.Selection.curActivate("asset");

    if (n) {
      Editor.assetdb.queryInfoByUuid(n, (t, i) => {
        if (!t &&
          i) {
          if ("prefab" === i.type) {
            cc.assetManager.loadAny(n, (e, t) => {
              if (t) {
                if (r._prefab) {
                  o.unlinkPrefab(r._prefab.root);
                }

                o.linkPrefab(t, r);

                if (r.name.endsWith(o.MISSING_PREFAB_SUFFIX) &&
                  o.setPrefabSync(r, true, true)) {
                  r.name = r.name.slice(
                      0,
                      -o.MISSING_PREFAB_SUFFIX.length
                    );
                }
              }
            });
          } else {
            Editor.Dialog.messageBox(e);
          }
        }
      });
    } else {
      Editor.Dialog.messageBox(e);
    }
  },
  dumpNode(e) {
    let t = cc.engine.getInstanceById(e);
    return Editor.getNodeDump(t);
  },
  select(e) {
    this.gizmosView.select(e);
  },
  unselect(e) {
    this.gizmosView.unselect(e);
  },
  hoverin(e) {
    this.gizmosView.hoverin(e);
  },
  hoverout(e) {
    this.gizmosView.hoverout(e);
  },
  activate(e) {
    let t = cc.engine.getInstanceById(e);
    if (t) {
      a.activate(t);
      for (let e = 0; e < t._components.length; ++e) {
        let i = t._components[e];
        if (cc.isValid(i) && i.constructor._executeInEditMode) {
          if (i.onFocusInEditor) {
            try {
              i.onFocusInEditor();
            } catch (e) {
              cc._throw(e);
            }
          }

          if (i.constructor._playOnFocus &&
            i.enabledInHierarchy) {
            cc.engine.setAnimatingInEditMode(true, "component_playOnFocus");
          }
        }
      }
    }
  },
  deactivate(e) {
    let t = cc.engine.getInstanceById(e);
    if (t && t.isValid) {
      if (!(n.runningTask && n.runningTask.run === this._softReload)) {
        let e = o.getSyncedRootInScene(t);
        if (e) {
          if (!("prefab" === i.curMode().name)) {
            o.confirmPrefabSyncedLater(e);
          }
        }
      }
      a.deactivate(t);
      for (let e = 0; e < t._components.length; ++e) {
        let i = t._components[e];
        if (cc.isValid(i) && i.constructor._executeInEditMode) {
          if (i.onLostFocusInEditor) {
            try {
              i.onLostFocusInEditor();
            } catch (e) {
              cc._throw(e);
            }
          }

          if (i.constructor._playOnFocus &&
            i.enabledInHierarchy) {
            cc.engine.setAnimatingInEditMode(false, "component_playOnFocus");
          }
        }
      }
    }
  },
  async _syncPrefab(e, t) {
    let i = Editor.Selection.curActivate("node");
    let r = i && cc.engine.getInstanceById(i);
    if (
      r &&
      r._prefab &&
      r._prefab.asset &&
      r._prefab.asset._uuid === e.uuid &&
      r._prefab.root &&
      r._prefab.root._prefab.sync
    ) {
      if (await o.confirmPrefabSynced(r._prefab.root)) {
        return t();
      }
    }
    o.syncPrefab(e.uuid);
    t();
  },
  syncPrefab(e) {
    n.push({
      name: "sync-prefab",
      target: this,
      run: this._syncPrefab,
      params: [e],
    });
  },
  assetChanged(e) {
    a.assetChanged(e);
    c.assetChanged(e);
    if (("prefab" === e.type)) {
      let t = i.curMode();

      if ("prefab" === t.name) {
        t.prefabAssetChanged(e);
      } else {
        this.syncPrefab(e);
      }
    }
  },
  assetsMoved(e) {
    a.assetsMoved(e);
    c.assetsMoved(e);
  },
  assetsCreated(e) {
    c.assetsCreated(e);
  },
  assetsDeleted(e) {
    c.assetsDeleted(e);
  },
  setTransformTool(e) {
    if (this.gizmosView) {
      this.gizmosView.transformTool = e;
    }

    if (cc.engine.isInitialized) {
      cc.engine.repaintInEditMode();
    }
  },
  setPivot(e) {
    if (this.gizmosView) {
      this.gizmosView.pivot = e;
    }

    if (cc.engine.isInitialized) {
      cc.engine.repaintInEditMode();
    }
  },
  setCoordinate(e) {
    if (this.gizmosView) {
      this.gizmosView.coordinate = e;
    }

    if (cc.engine.isInitialized) {
      cc.engine.repaintInEditMode();
    }
  },
  setGizmoDimension(e) {
    if (this.gizmosView) {
      this.gizmosView.is2D = e;
    }

    if (cc.engine.isInitialized) {
      cc.engine.repaintInEditMode();
    }
  },
  isGizmoToolLocked() {
    return this.gizmosView.lockGizmoTool;
  },
  lockGizmoTool(e) {
    if (this.gizmosView) {
      this.gizmosView.lockGizmoTool = e;
    }
  },
  alignSelection(e) {
    let t = Editor.Selection.curSelection("node");
    if (t.length <= 1) {
      return;
    }
    let i = 1e10;
    let r = 1e10;
    let n = -1e10;
    let o = -1e10;

    let a = (t = (t = t.map((e) => cc.engine.getInstanceById(e))).filter((e) => {
      let i = e.parent;
      for (; i; ) {
        if (-1 !== t.indexOf(i)) {
          return false;
        }
        i = i.parent;
      }
      return true;
    })).map((e) => {
      let t = s.getWorldBounds(e);
      i = Math.min(i, t.x);
      r = Math.min(r, t.y);
      n = Math.max(n, t.xMax);
      o = Math.max(o, t.yMax);
      return { node: e, bounds: t };
    });

    let c = cc.rect(i, r, n - i, o - r);

    a.forEach((t) => {
      let i;
      let r = t.node;
      switch ((this.Undo.recordNode(r.uuid), e)) {
        case "top":
          i = cc.v2(0, c.yMax - t.bounds.yMax);
          break;
        case "v-center":
          i = cc.v2(0, c.center.y - t.bounds.center.y);
          break;
        case "bottom":
          i = cc.v2(0, c.y - t.bounds.y);
          break;
        case "left":
          i = cc.v2(c.x - t.bounds.x, 0);
          break;
        case "h-center":
          i = cc.v2(c.center.x - t.bounds.center.x, 0);
          break;
        case "right":
          i = cc.v2(c.xMax - t.bounds.xMax, 0);
          break;
        default:
          i = cc.v2();
      }
      let n = s.getWorldPosition(r);
      s.setWorldPosition(r, n.add(i));
      var o = Editor.Math.numOfDecimalsF(1 / this.view.scale);
      this.adjustNodePosition(r, o);
      cc.engine.repaintInEditMode();
    });

    this.Undo.commit();
  },
  distributeSelection: function (e) {
    let t = Editor.Selection.curSelection("node");
    if (t.length <= 2) {
      return;
    }
    let i = (t = (t = t.map((e) => cc.engine.getInstanceById(e))).filter(
      (e) => {
        let i = e.parent;
        for (; i; ) {
          if (-1 !== t.indexOf(i)) {
            return false;
          }
          i = i.parent;
        }
        return true;
      }
    )).map((e) => {
      return { node: e, bounds: s.getWorldBounds(e) };
    });
    i.sort((t, i) => {
      let r = true;
      switch (e) {
        case "top":
          r = t.bounds.yMax - i.bounds.yMax;
          break;
        case "v-center":
          r = t.bounds.center.y - i.bounds.center.y;
          break;
        case "bottom":
          r = t.bounds.y - i.bounds.y;
          break;
        case "left":
          r = t.bounds.x - i.bounds.x;
          break;
        case "h-center":
          r = t.bounds.center.x - i.bounds.center.x;
          break;
        case "right":
          r = t.bounds.center.xMax - i.bounds.center.xMax;
      }
      return r;
    });
    let r = i.length - 1;
    let n = i[0].bounds;
    let o = i[r].bounds;

    i.forEach((t, i) => {
      let a;
      let c = t.node;
      let d = t.bounds;
      switch ((this.Undo.recordNode(c.uuid), e)) {
        case "top":
          a = cc.v2(0, n.yMax + ((o.yMax - n.yMax) * i) / r - d.yMax);
          break;
        case "v-center":
          a = cc.v2(
            0,
            n.center.y + ((o.center.y - n.center.y) * i) / r - d.center.y
          );
          break;
        case "bottom":
          a = cc.v2(0, n.y + ((o.y - n.y) * i) / r - d.y);
          break;
        case "left":
          a = cc.v2(n.x + ((o.x - n.x) * i) / r - d.x, 0);
          break;
        case "h-center":
          a = cc.v2(
            n.center.x + ((o.center.x - n.center.x) * i) / r - d.center.x,
            0
          );
          break;
        case "right":
          a = cc.v2(n.xMax + ((o.xMax - n.xMax) * i) / r - d.xMax, 0);
          break;
        default:
          a = cc.v2();
      }
      let l = s.getWorldPosition(c);
      s.setWorldPosition(c, l.add(a));
      var u = Editor.Math.numOfDecimalsF(1 / this.view.scale);
      this.adjustNodePosition(c, u);
      cc.engine.repaintInEditMode();
    });

    this.Undo.commit();
  },
  projectProfileUpdated: function (e) {
    cc.game.collisionMatrix = e.get("collision-matrix");
    cc.game.groupList = e.get("group-list");
  },
};
window._Scene = f;
require("./engine-extends");
Object.assign(Editor, require("./debug-helper"));
require("./reset-node");
const h = require("./editor-engine");
cc.engine = new h(false);
Editor.getNodeDump = require("./dump/get-node-dump");
Editor.getNodeFunctions = require("./dump/get-node-functions");
let p = require("./set-property-by-path");
Editor.setAsset = p.setAsset;
Editor.getPropertyByPath = p.getPropertyByPath;
Editor.setPropertyByPath = p.setPropertyByPath;
Editor.resetPropertyByPath = p.resetPropertyByPath;
Editor.setDeepPropertyByPath = p.setDeepPropertyByPath;
Editor.fillDefaultValue = p.fillDefaultValue;
Editor.setNodePropertyByPath = p.setNodePropertyByPath;
Editor.preprocessForSetProperty = p.preprocessForSetProperty;
