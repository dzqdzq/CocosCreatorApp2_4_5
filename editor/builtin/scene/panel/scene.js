const e = require("electron");
const n = require("fs-extra");
const t = (require("path"), require("util"));
const i = Editor.require("scene://edit-mode");
const o = Editor.require("packages://scene/panel/tools/camera");
const r = Editor.require("scene://utils/scene");
const s = Editor.require("scene://lib/sandbox");
const a = Editor.require("scene://utils/prefab");
const c = Editor.require("scene://utils/animation");
function l(e) {
  let n = Editor.assets[e];
  return n && n.prototype.createNode;
}
Editor.require("packages://scene/panel/settings/rendering-setting");
Editor.require("packages://scene/panel/scene-view");
let d = {
  template: n.readFileSync(
    Editor.url("packages://scene/panel/scene.html"),
    "utf8"
  ),
  style: n.readFileSync(Editor.url("packages://scene/panel/scene.css"), "utf8"),
  $: { dropArea: "#dropArea", loader: "#loader", border: "#border" },
  messages: Editor.require("packages://scene/panel/messages"),
  ready() {
    this._vm = (function (e) {
      return new window.Vue({
        el: e,
        data: { selection: [], align: false, distribute: false },
        watch: { selection: "_selectionChanged" },
        methods: {
          _T: (e) => Editor.T(e),
          _selectionChanged() {
            this.align = this.selection.length > 1;
            this.distribute = this.selection.length > 2;
          },
          _onZoomUp() {
            o.zoomUp();
          },
          _onZoomDown() {
            o.zoomDown();
          },
          _onZoomReset() {
            o.zoomReset();
          },
          _onAlignTop() {
            _Scene.alignSelection("top");
          },
          _onAlignVCenter() {
            _Scene.alignSelection("v-center");
          },
          _onAlignBottom() {
            _Scene.alignSelection("bottom");
          },
          _onAlignLeft() {
            _Scene.alignSelection("left");
          },
          _onAlignHCenter() {
            _Scene.alignSelection("h-center");
          },
          _onAlignRight() {
            _Scene.alignSelection("right");
          },
          _onDistributeTop() {
            _Scene.distributeSelection("top");
          },
          _onDistributeVCenter() {
            _Scene.distributeSelection("v-center");
          },
          _onDistributeBottom() {
            _Scene.distributeSelection("bottom");
          },
          _onDistributeLeft() {
            _Scene.distributeSelection("left");
          },
          _onDistributeHCenter() {
            _Scene.distributeSelection("h-center");
          },
          _onDistributeRight() {
            _Scene.distributeSelection("right");
          },
        },
      });
    })(this.shadowRoot);

    this._viewReady = false;
    this._ipcList = [];
    this._copyingIds = null;
    this._pastingId = "";
    this._ensureClose = false;
    console.time("scene:reloading");
    Editor.Ipc.sendToAll("scene:reloading");
    this.multi = true;
    this.$dropArea.setAttribute("droppable", "asset,file,cloud-function");
    _Scene.init();
    this.$loader.hidden = true;
    this.$border.insertBefore(_Scene.view, this.$loader);
    _Scene.view.init();

    e.ipcRenderer.on("editor:panel-undock", (e) => {
      if ("scene" === e) {
        _Scene.EngineEvents.unregister();
      }
    });
  },
  run(e) {
    if (!e || !e.uuid) {
      return;
    }
    this.confirmCloseScene(() => {
      this._loadScene(e.uuid);
    });
  },
  async canClose() {
    if (!this._ensureClose) {
      let e = await t.promisify(this.confirmCloseScene)();

      if (!(2 !== e && 0 !== e)) {
        this._ensureClose = true;
      }
    }
    return this._ensureClose;
  },
  close() {
    this._clearSelection();
    let n = e.ipcRenderer.sendSync("app:is-main-window-attemp-to-close");
    let t = Editor.remote.Panel.findWindow("scene");

    if (n) {
      t.nativeWin.close();
    } else {
      t.nativeWin.reload();
    }
  },
  async confirmCloseScene(e) {
    await a.confirmEditingPrefabSynced();
    i.close(e);
  },
  _clearSelection: function () {
    Editor.Selection.clear("node");
    _Scene.unselect(this._vm.selection);
    this._vm.selection = [];
  },
  _onDropAreaEnter(e) {
    e.stopPropagation();
  },
  _onDropAreaLeave(e) {
    e.stopPropagation();
  },
  async _onDropAreaAccept(e) {
    e.stopPropagation();
    let n = e.detail.dragOptions.unlinkPrefab;

    let t = await Promise.all(
      e.detail.dragItems.map(async (n) =>
        "cloud-function" === e.detail.dragType
          ? new Promise((e, t) => {
              Editor.Ipc.sendToPackage(
                "node-library",
                "import-cloud-component",
                n.path,
                (n, i) => {
                  if (n) {
                    return t(n);
                  }
                  e(i);
                }
              );
            })
          : n.id
      )
    );

    t = t.filter(Boolean);
    let i = e.detail.offsetX;
    let o = e.detail.offsetY;
    r.createNodesAt(t, i, o, { unlinkPrefab: n });
  },
  _onDropAreaMove(e) {
    if (c.STATE.RECORD) {
      Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, "none");
      return;
    }
    if ("cloud-function" === e.detail.dragType) {
      Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, "copy");
      return;
    }
    if ("asset" !== e.detail.dragType && "file" !== e.detail.dragType) {
      Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, "none");
      return;
    }
    let n = "copy";
    for (let t of e.detail.dragItems) {
      if (
        "folder" === t.assetType ||
        ("skeleton-animation-clip" === t.assetType && t.isSubAsset)
      ) {
        n = "none";
        break;
      }
      if (!l(t.assetType)) {
        if (!t.subAssetTypes || 0 === t.subAssetTypes.length) {
          n = "none";
          break;
        }
        for (let e of t.subAssetTypes)
          if (!l(e)) {
            n = "none";
            break;
          }
      }
    }
    Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, n);
  },
  _onEngineReady() {
    _Scene.EngineEvents.register();
  },
  _onSceneViewReady() {
    this._loadSceneScripts();
    this._viewReady = true;
    this.$loader.hidden = true;
    _Scene.Undo.clear();
    Editor.Ipc.sendToAll("scene:ready");
    console.timeEnd("scene:reloading");
  },
  _onSceneViewInitError(e) {
    let n = e.error;
    Editor.failed(`Failed to init scene: ${n.stack}`);
    this.$loader.hidden = true;
  },
  _onPanelResize() {
    if (!this._resizeDebounceID) {
      this._resizeDebounceID = setTimeout(() => {
        this._resizeDebounceID = null;
        _Scene.view._resize();
      }, 10);
    }
  },
  _onPanelCopy() {
    let e = Editor.Selection.curSelection("node");
    r.copyNodes(e);
  },
  _onPanelPaste() {
    let e = Editor.Selection.curActivate("node");
    r.pasteNodes(e);
  },
  _onPanelUnload() {
    Editor.Ipc.sendToAll("scene:panel-unload");
  },
  _loadScene(e) {
    _Scene.isLoadingScene = true;
    Editor.Ipc.sendToAll("scene:reloading");
    this.$loader.hidden = false;

    _Scene.loadSceneByUuid(e, (e) => {
      _Scene.isLoadingScene = false;
      if ((e)) {
        let n = new Event("scene-view-init-error");
        n.error = e;
        this.dispatchEvent(n);
        return;
      }
      this.dispatchEvent(new Event("scene-view-ready"));
    });
  },
  _newScene() {
    this.$loader.hidden = false;
    Editor.Ipc.sendToAll("scene:reloading");

    _Scene.newScene(() => {
      this.dispatchEvent(new Event("scene-view-ready"));
      _Scene._applyCanvasPreferences();
    });
  },
  _loadSceneScript: function (e, n) {
    let t;
    let i = Editor.url(n);
    try {
      if (i) {
        t = require(i);
      }
    } catch (t) {
      Editor.error(`Package [${e}] scene script [${n}] not exists.\n ${t}`);
      return;
    }
    this._sceneScripts[e] = { path: i, messages: [] };
    for (let n in t) {
      let i = t[n];
      if ("function" != typeof i) {
        Editor.warn(`[${n}] in package [${e}] is not a function.`);
        return;
      }
      let o = `${e}:${n}`;
      this.messages[o] = i.bind(t);
      this._sceneScripts[e].messages.push(o);
    }
  },
  _unloadSceneScript: function (e) {
    let n = this._sceneScripts[e].messages;
    for (let e = 0; e < n.length; e++) {
      let t = n[e];
      delete this.messages[t];
    }
    delete s.getElectronRequire().cache[this._sceneScripts[e].path];
    delete this._sceneScripts[e];
  },
  _loadSceneScripts: function () {
    this._sceneScripts = {};
    for (let e in Editor.sceneScripts) {
      let n = Editor.sceneScripts[e];
      this._loadSceneScript(e, n);
    }
  },
};

Object.assign(d, {
  listeners: {
    "drop-area-enter": d._onDropAreaEnter,
    "drop-area-leave": d._onDropAreaLeave,
    "drop-area-accept": d._onDropAreaAccept,
    "drop-area-move": d._onDropAreaMove,
    "engine-ready": d._onEngineReady,
    "scene-view-ready": d._onSceneViewReady,
    "scene-view-init-error": d._onSceneViewInitError,
    "panel-show": d._onPanelResize,
    "panel-resize": d._onPanelResize,
    "panel-copy": d._onPanelCopy,
    "panel-paste": d._onPanelPaste,
    "panel-unload": d._onPanelUnload,
  },
});

Editor.Panel.extend(d);
