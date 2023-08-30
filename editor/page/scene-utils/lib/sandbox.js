"use strict";
const e = require("fire-path");
const r = (require("fire-url"), require("async"));
const i = (require("fire-fs"), require("node-uuid"));
const o = (require("./source-maps"), require("../global-variables-protecter"));
let a;
let s;
let t;
let n = require;
let l = false;
let c = require("../../project-scripts");
let d = c.loadScript;

c.loadScript = function (r, i) {
  var o = g._globalsVerifier_loadPluginScript;
  var a = e.relative(Editor.Project.path, r);

  if ("." === a[0]) {
    a = r;
  }

  o.info = "loading " + a;
  o.record();

  d.call(c, r, () => {
    o.restore();
    i();
  });
};

let _ = c.loadCommon;

c.loadCommon = function (e) {
  var r = g._globalsVerifier_loadScript;
  r.info = "loading common project scripts";
  r.record();

  _.call(c, () => {
    r.restore();
    e();
  });
};

let g = {
  reset() {
    cc.Object._deferredDestroy();
    cc._componentMenuItems = t.slice();
    cc.js._registeredClassIds = a;
    cc.js._registeredClassNames = s;

    if (this._globalsVerifier_editing.isRecorded()) {
      this._globalsVerifier_editing.restore();
    }

    if (this._globalsProtecter.isRecorded()) {
      this._globalsProtecter.restore();
    }

    cc._RF.reset();
    Editor.Utils.UuidCache.clear();
    cc.director.reset();
    cc.assetManager.releaseAll();
  },
  reload(e, i) {
    this.compiled = e;
    this.reloading = true;
    var o = _Scene.getEditingWorkspace();
    _Scene.reset();

    var a = {
        scene: cc.director.getScene(),
        sceneName: cc.director.getScene().name,
        undo: _Scene.Undo.dump(),
        stashedDatas: this._liveReloadableDatas,
      };

    var s = Editor.serialize(a, {
      stringify: false,
      discardInvalid: false,
      reserveContentsForSyncablePrefab: true,
    });

    var t = cc.deserialize.reportMissingClass;
    r.waterfall(
      [
        (e) => {
          e(null, Editor.Profile.load("global://settings.json"));
        },
        (e, r) => {
          if (e.get("auto-refresh")) {
            _Scene.stashScene(() => {
              Editor.Ipc.sendToMain("app:reload-on-device");
              r();
            });
          } else {
            r();
          }
        },
        (e) => {
          g.reset();
          e();
        },
        g.loadScripts,
        (e) => {
          this._globalsVerifier_loadScene.record();
          cc.deserialize.reportMissingClass = function () {};
          cc.assetManager.editorExtend.loadJson(s, e);
        },
        (e, r) => {
          cc.deserialize.reportMissingClass = t;
          this._globalsVerifier_loadScene.restore();
          e.scene.name = e.sceneName;
          e.scene._prefabSyncedInLiveReload = true;
          this._globalsVerifier_unloadScene.record();
          this._globalsVerifier_runScene.record();

          cc.director.runSceneImmediate(e.scene, () => {
            this._globalsVerifier_unloadScene.restore();
          });

          this._globalsVerifier_runScene.restore();
          this._globalsVerifier_editing.record();
          e.scene._prefabSyncedInLiveReload = false;
          _Scene.Undo.restore(e.undo);
          this._liveReloadableDatas = e.stashedDatas;
          _Scene.loadWorkspace(o);
          r(null);
        },
      ],
      (e, r) => {
        cc.deserialize.reportMissingClass = t;
        this.reloading = false;
        i(e, r);
      }
    );
  },
  loadScripts(e) {
    if (!l) {
      l = true;
      g._globalsProtecter.record();
      a = cc.js._registeredClassIds;
      s = cc.js._registeredClassNames;
      t = cc._componentMenuItems.slice();
    }

    c.load((r) => {
      let i = cc.js;

      let o = [
        "i18n:MAIN_MENU.component.renderers",
        "i18n:MAIN_MENU.component.mesh",
        "i18n:MAIN_MENU.component.ui",
        "i18n:MAIN_MENU.component.collider",
        "i18n:MAIN_MENU.component.physics",
        "i18n:MAIN_MENU.component.others",
        "i18n:MAIN_MENU.component.scripts",
        "|%%separator%%|",
      ];

      o.forEach((e, r) => {
        o[r] = Editor.i18n.formatPath(e);
      });
      let a = {};

      o.forEach((e) => {
        a[e] = [];
      });

      cc._componentMenuItems.forEach((e, r) => {
        let i = Editor.i18n.formatPath(e.menuPath.split("/")[0]);

        if (!a[i]) {
          a[i] = [];
          o.push(i);
        }

        a[i].push(e);
      });

      o.forEach((e) => {
        a[e].sort((e, r) =>
          e.menuPath.localeCompare(r.menuPath, "en", { numeric: true })
        );
      });

      let s = [];
      for (let e in a)
        if ("|%%separator%%|" === e) {
          s.push({ type: "separator" });
        } else {
          a[e].forEach((e) => {
            s.push({
              path: Editor.i18n.formatPath(e.menuPath),
              panel: "scene",
              message: "scene:add-component",
              params: [null, i._getClassId(e.component)],
            });
          });
        }
      Editor.Menu.register("add-component", s, true);
      Editor.MainMenu.update(Editor.T("MAIN_MENU.component.title"), s);
      e(r);
    });
  },
  _liveReloadableDatas: Object.create(null),
  registerReloadableData(e) {
    var r = i.v4();
    this._liveReloadableDatas[r] = e;
    return r;
  },
  popReloadableData(e) {
    var r = this._liveReloadableDatas[e];
    delete this._liveReloadableDatas[e];
    return r;
  },
  restoreElectronRequire() {
    require = n;
  },
  getElectronRequire: () => n,
  compiled: false,
  reloading: false,
  _globalsProtecter: new o(),
  _globalsVerifier_loadPluginScript: new o({
    ignoreNames: ["require"],
    callbacks: { modified: Editor.log, deleted: Editor.warn },
    dontRestore: { introduced: true },
  }),
  _globalsVerifier_loadScript: new o({
    ignoreNames: ["require"],
    callbacks: { modified: Editor.warn, deleted: Editor.warn },
    dontRestore: { introduced: true },
  }),
  _globalsVerifier_editing: new o({ info: "editing", callbacks: Editor.log }),
  _globalsVerifier_loadScene: new o({
    info: "deserializing scene by using new scripts",
    callbacks: Editor.warn,
  }),
  _globalsVerifier_unloadScene: new o({
    info: "unloading the last scene",
    callbacks: Editor.warn,
  }),
  _globalsVerifier_runScene: new o({
    info: "launching scene by using new scripts",
    callbacks: Editor.warn,
  }),
};
module.exports = g;
