const e = require("fs");
const i = Editor.require("scene://edit-mode");
const t = Editor.require("packages://scene/panel/tools");
const n = Editor.require("app://editor/page/gizmos/utils/transform-tool-data");
const o = Editor.require("scene://utils/scene");
const s = Editor.require("scene://dump/hierarchy");
const c = require("mousetrap");
const d = Editor.require("packages://scene/panel/tools/camera");
Editor.require("app://editor/page/gizmos/2d/init.js");
const r = Editor.require("packages://scene/gizmo");
window.customElements.define("scene-gizmo", r);
let l = {
  template: e.readFileSync(
    Editor.url("packages://scene/panel/scene-view.html"),
    "utf8"
  ),
  style: e.readFileSync(
    Editor.url("packages://scene/panel/scene-view.css"),
    "utf8"
  ),
  $: {
    gizmosView: "#gizmosView",
    editButtons: "#editButtons",
    helpText: "#helpText",
    grid: "#grid",
    engineCanvas: "#engine-canvas",
  },
  ready() {
    this._vm = (function (e) {
      return new window.Vue({
        el: e,
        data: { mode: "scene", isInEditMode: false, editModeIcon: "" },
        watch: { mode: "_onModeChanged" },
        methods: {
          _T: (e) => Editor.T(e),
          _onModeChanged() {
            this.isInEditMode = "scene" !== this.mode;

            this.editModeIcon = this.isInEditMode
                ? Editor.url(`app://editor/builtin/scene/icon/${this.mode}.png`)
                : "";
          },
          _onSaveEditMode() {
            i.save();
          },
          _onCloseEditMode() {
            i.pop();
          },
        },
      });
    })(this.shadowRoot);

    this.scale = 1;
    this._policy = null;
    this._registerShortcuts();

    this.$editButtons.addEventListener("mousedown", (e) =>
      e.stopPropagation()
    );

    n.on("dimension-changed", this.onDimensionChanged.bind(this));
  },
  init() {
    this.designSize = [0, 0];

    this._initTimer = setInterval(() => {
      let e = this.getBoundingClientRect();

      if (!(0 === e.width && 0 === e.height)) {
        clearInterval(this._initTimer);

        if (cc.engine.isInitialized) {
          this.dispatchEvent(new Event("engine-ready", { bubbles: true }));

          this.dispatchEvent(
            new Event("scene-view-ready", { bubbles: true })
          );

          this._resize();
        } else {
          this._initEngine(() => {
            this.$gizmosView.sceneToPixel = this.sceneToPixel.bind(this);
            this.$gizmosView.worldToPixel = this.worldToPixel.bind(this);
            this.$gizmosView.pixelToScene = this.pixelToScene.bind(this);
            this.$gizmosView.pixelToWorld = this.pixelToWorld.bind(this);
            this._resize();
          });
        }
      }
    }, 100);

    var e = cc.ContainerStrategy.extend({
      apply(e, i) {
        var t;
        var n;
        var o = e._frameSize.width;
        var s = e._frameSize.height;
        var c = cc.game.container.style;
        var d = i.width;
        var r = i.height;
        var l = o / d;
        var a = s / r;

        if (l < a) {
          t = o;
          n = r * l;
        } else {
          t = d * a;
          n = s;
        }

        t = o - 2 * Math.round((o - t) / 2);
        n = s - 2 * Math.round((s - n) / 2);
        this._setupContainer(e, t, n);
        c.margin = "0";
      },
    });

    this._policy = new cc.ResolutionPolicy(
      new e(),
      cc.ContentStrategy.SHOW_ALL
    );
  },
  _initBuiltinNodes() {
    function e(e) {
      let i = new cc.Node(e);
      i.is3DNode = true;
      i._objFlags |= cc.Object.Flags.DontSave | cc.Object.Flags.HideInHierarchy;
      i.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG;
      cc.game.addPersistRootNode(i);
      return i;
    }
    this.foregroundNode = e("Editor Scene Foreground");
    this.backgroundNode = e("Editor Scene Background");
    this.foregroundNode.zIndex = cc.macro.MAX_ZINDEX;
    this.backgroundNode.zIndex = -cc.macro.MAX_ZINDEX;
  },
  onDimensionChanged(e) {
    this.$helpText.innerHTML = e
      ? this._vm._T("SCENE.pan_hint")
      : this._vm._T("SCENE.3d_transform_hint");
  },
  onSceneLaunched() {
    let e = cc.director.getScene();
    e.setScale(1);
    e.setPosition(0, 0, 0);
    for (let e = 0; e < t.length; e++) {
      if (t[e].onSceneLaunched) {
        t[e].onSceneLaunched();
      }
    }
  },
  _resize() {
    if (cc.engine.isInitialized && cc.director.getScene()) {
      let e = this.getBoundingClientRect();
      if (0 === e.width && 0 === e.height) {
        return;
      }
      cc.view.setCanvasSize(e.width, e.height);

      cc.view.setDesignResolutionSize(
        e.width,
        e.height,
        _Scene.view._policy || cc.ResolutionPolicy.SHOW_ALL
      );

      for (let e = 0; e < t.length; e++) {
        if (t[e].onResize) {
          t[e].onResize();
        }
      }
    }
  },
  _hackSceneClass() {
    [
      "_position",
      "_eulerAngles",
      "_scaleX",
      "_scaleY",
      "_scaleZ",
      "_skewX",
      "_skewY",
      "scale",
      "_name",
    ].forEach(function (e) {
      cc.Class.Attr.setClassAttr(cc.Scene, e, "serializable", false);
    });
  },
  _initEngine(e) {
    var i = this.$engineCanvas;
    var n = this.getBoundingClientRect();
    i.width = n.width;
    i.height = n.height;
    var o = Editor.remote._projectProfile;

    var s = {
      id: this.$engineCanvas,
      width: n.width,
      height: n.height,
      designWidth: n.width,
      designHeight: n.height,
      groupList: o.get("group-list"),
      collisionMatrix: o.get("collision-matrix"),
    };

    _Scene._inited = false;

    cc.engine.init(s, () => {
      this.dispatchEvent(new Event("engine-ready", { bubbles: true }));
      this._hackSceneClass();
      this._initBuiltinNodes();
      for (let e = 0; e < t.length; e++) {
        if (t[e].init) {
          t[e].init();
        }
      }
      _Scene.initScene((i) => {
        _Scene._inited = true;
        if ((i)) {
          let e = new Event("scene-view-init-error");
          e.error = i;
          this.dispatchEvent(e);
          return;
        }
        this.dispatchEvent(new Event("scene-view-ready", { bubbles: true }));
        cc.engine.emit("scene-view-ready", { bubbles: true });

        if (e) {
          e();
        }
      });
    });
  },
  sceneToPixel(e) {
    return cc.v2(this.$grid.valueToPixelH(e.x), this.$grid.valueToPixelV(e.y));
  },
  worldToPixel(e) {
    var i = cc.director.getScene();
    if (i) {
      var t = i.convertToNodeSpaceAR(e);
      return this.sceneToPixel(t);
    }
    return this.sceneToPixel(e);
  },
  pixelToScene(e) {
    return cc.v2(this.$grid.pixelToValueH(e.x), this.$grid.pixelToValueV(e.y));
  },
  pixelToWorld(e) {
    var i = cc.director.getScene();
    return i
      ? cc.v2(i.convertToWorldSpaceAR(this.pixelToScene(e)))
      : this.pixelToScene(e);
  },
  copyEditorCameraDataToNodes() {
    let e = d._camera.node;
    let i = Editor.Selection.curSelection("node");
    o.copyNodeDataToNodes(e, i);
  },
  _registerShortcuts() {
    let e = new c(this);
    e.bind(["ctrl+a", "command+a"], this.selectAll.bind(this));

    e.bind(
      ["command+backspace", "del"],
      this.deleteCurrentSelected.bind(this)
    );

    e.bind(["ctrl+d", "command+d"], this.duplicateCurrentSelected.bind(this));
    e.bind(["f", "f"], this.focusNode.bind(this));

    document.addEventListener("keydown", (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return;
      }
      let i = e.target && e.target.children && e.target.children.scene;

      if ("KeyF" === e.code && i && "scene" === i.id) {
        this.focusNode();
      }
    });
  },
  focusNode() {
    let e = Editor.Selection.curSelection("node");

    if (e &&
      e.length > 0) {
      Editor.Ipc.sendToPanel("scene", "scene:center-nodes", e);
    }
  },
  selectAll(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let i = [];

    s.node().forEach((e) => {
      (function e(t) {
        if (!t.hidden) {
          if (!t.locked) {
            i.push(t.id);
          }

          if (t.children) {
            t.children.forEach((i) => {
              e(i);
            });
          }
        }
      })(e);
    });

    Editor.Selection.select("node", i, true, false);
  },
  deleteCurrentSelected(e) {
    if (e) {
      e.stopPropagation();
    }

    let i = Editor.Selection.curSelection("node");
    o.deleteNodes(i);
  },
  duplicateCurrentSelected(e) {
    if (e) {
      e.stopPropagation();
    }

    let i = Editor.Selection.curSelection("node");
    o.duplicateNodes(i);
  },
};

[
  "onMouseDown",
  "onMouseWheel",
  "onMouseMove",
  "onMouseLeave",
  "onMouseUp",
  "onKeyDown",
  "onKeyUp",
].forEach(function (e) {
  l[e] = function (i) {
    i.stopPropagation();
    if (cc.engine.isInitialized) {
      for (let n = 0; n < t.length && (!t[n][e] || !t[n][e](i)); n++)
        {}
    }
  };
});

Object.assign(l, {
  listeners: {
    mousedown: l.onMouseDown,
    mousewheel: l.onMouseWheel,
    mousemove: l.onMouseMove,
    mouseup: l.onMouseUp,
    mouseleave: l.onMouseLeave,
    keydown: l.onKeyDown,
    keyup: l.onKeyUp,
  },
});

Editor.UI.registerElement("scene-view", l);
