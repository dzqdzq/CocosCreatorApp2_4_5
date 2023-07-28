"use strict";
require("../utils/node");
require("../utils/animation");
const i = require("./lib/ticker");
const t = require("./lib/time");
const e = require("./lib/playable");

const n = cc.Class({
  name: "EditorEngine",
  extends: e,
  ctor: function () {
    var i = arguments[0];
    this._requestId = -1;
    this._useDefaultMainLoop = i;
    this._isInitializing = false;
    this._isInitialized = false;
    this._loadingScene = "";
    this._bindedTick = (CC_EDITOR || i) && this._tick.bind(this);
    this.maxDeltaTimeInEM = 0.2;
    this._flagCount = 0;
    this._flags = Object.create(null);
    this._animatingInEditMode = 0;
    this._shouldRepaintInEM = false;
    this._forceRepaintId = -1;
    this.attachedObjsForEditor = {};
    this._designWidth = 0;
    this._designHeight = 0;
  },
  properties: {
    isInitialized: {
      get: function () {
        return this._isInitialized;
      },
    },
    loadingScene: {
      get: function () {
        return this._loadingScene;
      },
    },
    forceRepaintIntervalInEM: {
      default: 500,
      notify:
        CC_EDITOR &&
        function () {
          if (-1 !== this._forceRepaintId) {
            clearInterval(this._forceRepaintId);
          }

          if (
            (this.forceRepaintIntervalInEM > 0)
          ) {
            var i = this;
            this._forceRepaintId = setInterval(function () {
              i.repaintInEditMode();
            }, this.forceRepaintIntervalInEM);
          }
        },
    },
    editingRootNode: null,
  },
  init: function (i, t) {
    if (this._isInitializing) {
      cc.error("Editor Engine already initialized");
      return;
    }
    this._isInitializing = true;
    var e = this;
    this.createGame(i, function (n) {
      e._isInitialized = true;
      e._isInitializing = false;
      t(n);

      if (CC_EDITOR && !i.dontTick) {
        e.startTick();
      }
    });
  },
  createGame: function (i, t) {
    cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
    cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
    var e = {
      width: i.width,
      height: i.height,
      showFPS: false,
      debugMode: cc.debug.DebugMode.INFO,
      frameRate: 60,
      id: i.id,
      renderMode: CC_EDITOR ? 2 : i.renderMode,
      registerSystemEvent: !CC_EDITOR,
      groupList: i.groupList,
      collisionMatrix: i.collisionMatrix,
    };
    cc.game.run(e, function () {
      if (CC_EDITOR) {
        cc.view.enableRetina(false);
        cc.game.canvas.style.imageRendering = "pixelated";
      }

      cc.view.setDesignResolutionSize(
        i.designWidth,
        i.designHeight,
        cc.ResolutionPolicy.SHOW_ALL
      );

      cc.view.setCanvasSize(e.width, e.height);
      var n = new cc.Scene();
      cc.director.runSceneImmediate(n);
      cc.game.pause();

      if (CC_EDITOR) {
        cc.game.canvas.setAttribute("tabindex", -1);
        cc.game.canvas.style.backgroundColor = "";
      }

      if (t) {
        t();
      }
    });
  },
  playInEditor: function () {
    if (CC_EDITOR) {
      Editor.require(
          "unpack://engine-dev/cocos2d/core/platform/CCInputManager"
        ).registerSystemEvent(cc.game.canvas);

      cc.game.canvas.setAttribute("tabindex", 99);
      cc.game.canvas.style.backgroundColor = "black";

      if (cc.imeDispatcher._domInputControl) {
        cc.imeDispatcher._domInputControl.setAttribute("tabindex", 2);
      }
    }

    cc.director.resume();
  },
  tick: function (i, t) {
    cc.director.mainLoop(i, t);
  },
  tickInEditMode: function (i, t) {
    if (CC_EDITOR) {
      cc.director.mainLoop(i, t);
    }
  },
  repaintInEditMode: function () {
    if (CC_EDITOR && !this._isUpdating) {
      this._shouldRepaintInEM = true;
    }
  },
  getInstanceById: function (i) {
    return this.attachedObjsForEditor[i] || null;
  },
  setDesignResolutionSize: function (i, t, e) {
    this._designWidth = i;
    this._designHeight = t;
    this.emit("design-resolution-changed");
  },
  getDesignResolutionSize: function () {
    return cc.size(this._designWidth, this._designHeight);
  },
  obbApplyMatrix(i, t, e, n, a, s) {
    var c = i.x;
    var r = i.y;
    var o = i.width;
    var d = i.height;
    var h = t.m[0];
    var _ = t.m[1];
    var u = t.m[4];
    var l = t.m[5];
    var g = h * c + u * r + t.m[12];
    var I = _ * c + l * r + t.m[13];
    var m = h * o;
    var E = _ * o;
    var p = u * d;
    var f = l * d;
    n.x = g;
    n.y = I;
    a.x = m + g;
    a.y = E + I;
    e.x = p + g;
    e.y = f + I;
    s.x = m + p + g;
    s.y = E + f + I;
  },
  onError: function (i) {
    if (CC_EDITOR) {
      switch (i) {
        case "already-playing":
          cc.warn("Fireball is already playing");
      }
    }
  },
  onResume: function () {
    if (CC_EDITOR) {
      cc.Object._clearDeferredDestroyTimer();
    }

    cc.game.resume();

    if (CC_DEV && !this._useDefaultMainLoop) {
      this._tickStop();
    }
  },
  onPause: function () {
    cc.game.pause();

    if (CC_EDITOR) {
      this._tickStart();
    }
  },
  onPlay: function () {
    if (CC_EDITOR && !this._isPaused) {
      cc.Object._clearDeferredDestroyTimer();
    }

    this.playInEditor();
    this._shouldRepaintInEM = false;
    if (this._useDefaultMainLoop) {
      var e = i.now();
      t._restart(e);
      this._tickStart();
    } else {
      if (CC_EDITOR) {
        this._tickStop();
      }
    }
  },
  onStop: function () {
    cc.game.pause();
    this._loadingScene = "";

    if (CC_EDITOR) {
      this.repaintInEditMode();
      this._tickStart();
    }
  },
  startTick: function () {
    this._tickStart();
    this.forceRepaintIntervalInEM = this.forceRepaintIntervalInEM;
  },
  _tick: function () {
    this._requestId = i.requestAnimationFrame(this._bindedTick);
    var e = i.now();

    if (this._isUpdating || this._stepOnce) {
      t._update(e, false, this._stepOnce ? 1 / 60 : 0);
      this._stepOnce = false;
      this.tick(t.deltaTime, true);
    } else {
      if (CC_EDITOR) {
        t._update(e, false, this.maxDeltaTimeInEM);

        if ((this._shouldRepaintInEM || this._animatingInEditMode > 0)) {
          this.tickInEditMode(t.deltaTime, this._animatingInEditMode > 0);
          this._shouldRepaintInEM = false;
        }
      }
    }
  },
  _tickStart: function () {
    if (-1 === this._requestId) {
      this._tick();
    }
  },
  _tickStop: function () {
    if (-1 !== this._requestId) {
      i.cancelAnimationFrame(this._requestId);
      this._requestId = -1;
    }
  },
  reset: function () {
    cc.game._prepared = false;
    cc.game._rendererInitialized = false;
    cc.assetManager.releaseAll();
  },
  setAnimatingInEditMode: function (i, t) {
    let e = 0;

    e = t in this._flags
      ? this._flags[t]
      : (this._flags[t] = 1 << this._flagCount++);

    this._animatingInEditMode = i
        ? this._animatingInEditMode | e
        : this._animatingInEditMode & ~e;
  },
  resetAnimatingInEditMode() {
    this._animatingInEditMode = 0;
  },
});

module.exports = n;
