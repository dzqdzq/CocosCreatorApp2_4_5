const e = require("fire-fs");
Editor.Panel.extend({
  template: e.readFileSync(
    Editor.url("packages://game-window/panel/index.html")
  ),
  $: { canvas: "#game-canvas", image: "#game-image", container: "#container" },
  listeners: {
    "panel-resize"() {
      this.resize();
    },
    "panel-hide"() {
      this._enable(false);
    },
    "panel-show"() {
      if (this._inited) {
        this._enable(true);
      } else {
        this._init();
      }

      this.resize();
    },
  },
  messages: {
    "scene:ready"() {
      this._init();
    },
    "scene:panel-unload"() {
      this._inited = false;
      clearInterval(this._intervalID);
    },
  },
  ready() {
    Editor.Ipc.sendToPanel(
      "scene",
      "scene:is-ready",
      (e, i) => {
        if (i) {
          this._init();
        }
      },
      -1
    );
  },
  _init() {
    if ("none" !== this.style.display) {
      if (!this._inited) {
        this._inited = true;
        this._isInMainWindow = !!cc.engine;
        this._renderElement = null;

        Editor.Scene.callSceneScript("game-window", "initPreviewCamera", () => {
          if (this._isInMainWindow) {
            this._initMainWindow();
          } else {
            this._initPopup();
          }
        });
      }
    }
  },
  _initMainWindow() {
    Editor.require("packages://game-window/scene-script").setCanvas(
      this.$canvas
    );

    this._renderElement = this.$canvas;
    this.$image.style.display = "none";
    this.resize();
  },
  _initPopup() {
    this._renderElement = this.$image;
    this.$canvas.style.display = "none";
    let e = true;

    this._intervalID = setInterval(() => {
      Editor.Scene.callSceneScript("game-window", "getBase64Data", (i, t) => {
        if (t) {
          this.$image.src = t;

          if (0 !== this.$image.width && e) {
            this.resize();
            e = false;
          }
        }
      });
    }, 30);
  },
  _enable(e) {
    Editor.Scene.callSceneScript("game-window", "enabled", e);
  },
  resize() {
    let e = this._renderElement;

    if (e) {
      if (e.width / e.height >
        this.$container.clientWidth / this.$container.clientHeight) {
        e.style.height = "";
        e.style.width = "100%";
        this.$container.className = "layout horizontal center";
      } else {
        e.style.height = "100%";
        e.style.width = "";
        this.$container.className = "layout vertical center";
      }
    }
  },
});
