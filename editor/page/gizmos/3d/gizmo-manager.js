"use strict";
const { create3DNode: e, getRaycastResults: o } = require("../utils/engine");
const t = require("./gizmo-defines");
const i = require("../../../3d/manager/node");
const s = require("../../selection");
const n = require("../utils/transform-tool-data");
const l = require("../../operation");
const r = require("./elements/controller/world-axis-controller");
let h = cc.v3();

n.on("tool-name-changed", (e) => {
  Manager.Ipc.send("broadcast", "scene:gizmo-tool-changed", e);
});

module.exports = new (class {
    queryToolName() {
      return this.transformToolName;
    }
    setTransformToolName(e) {
      if (["position", "rotation", "scale"].includes(e)) {
        this.transformToolName = e;
      }
    }
    init() {
      this.gizmoRootNode = e("gizmoRoot");
      this.gizmoRootNode.parent = Manager.foregroundNode;
      this.hoverinNode = null;
      this.curSelectNode = null;
      l.on("mousedown", this.onMouseDown.bind(this));
      l.on("mousemove", this.onMouseMove.bind(this));
      l.on("mouseup", this.onMouseUp.bind(this));
      l.on("wheel", this.onMouseWheel.bind(this));
      l.on("keydown", this.onKeyDown.bind(this));
      l.on("keyup", this.onKeyUp.bind(this));
      this._gizmoToolMap = {};
      this._selection = [];
      this._gizmosPool = {};

      s.on("select", (e, o) => {
        this.select(e, o);
      });

      s.on("unselect", (e) => {
        this.unselect([e]);
      });

      this._worldAxisController = new r(this.gizmoRootNode);
    }
    onSceneLoaded() {
      this.clearAllGizmos();
      this.transformToolName = "position";
      let e = s.query();
      this.select(e);
    }
    get transformTool() {
      return this._transformTool;
    }
    get transformToolName() {
      return n.toolName;
    }
    set transformToolName(e) {
      n.toolName = e;
      let o = this.getGizmoToolByName(n.toolName);
      if (null != o && o !== this._transformTool) {
        let e = [];

        if (null != this._transformTool) {
          this._transformTool.hide();
          e = this._transformTool.target;
        }

        this._transformTool = o;
        this.edit(e);
      }
    }
    get coordinate() {
      return n.coordinate;
    }
    set coordinate(e) {
      n.coordinate = e;

      if (this._transformTool) {
        this.edit(this._transformTool.target);
      }
    }
    get pivot() {
      return n.pivot;
    }
    set pivot(e) {
      n.pivot = e;

      if (this._transformTool) {
        this.edit(this._transformTool.target);
      }
    }
    lockGizmoTool(e) {
      n.isLocked = e;
    }
    isGizmoToolLocked() {
      return n.isLocked;
    }
    getGizmoToolByName(e) {
      let o = this._gizmoToolMap[e];
      if (null == o) {
        let i;
        switch (e) {
          case "position":
            i = t.position;
            break;
          case "rotation":
            i = t.rotation;
            break;
          case "scale":
            i = t.scale;
        }

        if (null != i) {
          this._gizmoToolMap[e] = this.createGizmo(e, i);
          o = this._gizmoToolMap[e];
        } else {
          console.error("Unknown transform tool %s", e);
        }
      }
      return o;
    }
    clearAllGizmos() {
      Object.keys(this._gizmosPool).forEach((e) => {
        this._gizmosPool[e].forEach((e) => {
          this.destoryGizmo(e);
        });
      });
    }
    createGizmo(e, o, t) {
      if (null == o) {
        return;
      }
      let i = this._gizmosPool[e];
      let s = null;
      if (null == i) {
        i = [];
        s = new o(t);
        i.push(s);
        this._gizmosPool[e] = i;
      } else {
        for (let e = 0; e < i.length; e++) {
          if (!i[e].visible()) {
            (s = i[e]).target = t;
            break;
          }
        }

        if (!s) {
          s = new o(t);
          i.push(s);
        }
      }
      return s;
    }
    destoryGizmo(e) {
      if (e) {
        e.hide();
      }
    }
    showNodeGizmo(e) {
      if (!e) {
        return;
      }
      let o = null;
      let i = null;
      if (null == e.gizmo) {
        let s = cc.js.getClassName(e);

        if ((o = t[s])) {
          (i = this.createGizmo(s, o, e)).show();
          e.gizmo = i;
        }
      }
      e._components.forEach((s) => {
        if (e.active && s.enabled && null == s.gizmo) {
          o = null;
          i = null;
          let e = cc.js.getClassName(s);

          if (null != (o = t.components[e])) {
            (i = this.createGizmo(e, o, s)).show();
            s.gizmo = i;
          }
        }
      });
    }
    hideNodeGizmo(e) {
      if (e) {
        if (e.gizmo) {
          this.destoryGizmo(e.gizmo);
          e.gizmo = null;
        }

        e._components.forEach((e) => {
          if (e.gizmo) {
            this.destoryGizmo(e.gizmo);
            e.gizmo = null;
          }
        });
      }
    }
    onComponentEnable(e) {
      let o = cc.engine.getInstanceById(e);

      if (-1 !== this._selection.indexOf(o.node.uuid)) {
        this.showNodeGizmo(o.node);
      }
    }
    onComponentDisable(e) {
      let o = cc.engine.getInstanceById(e);

      if (o && o.gizmo) {
        this.destoryGizmo(o.gizmo);
        o.gizmo = null;
      }
    }
    updateGizmosState(e, o) {
      if (!e) {
        return;
      }
      let t = e._components;
      Object.keys(o).forEach((i) => {
        if (e.gizmo) {
          e.gizmo[i] = o[i];
        }

        t.forEach((e) => {
          if (e.gizmo) {
            e.gizmo[i] = o[i];
          }
        });
      });
    }
    select(e, o) {
      if (!e || !o) {
        return;
      }
      let t = i.query(e);
      if (!t) {
        return;
      }
      this.showNodeGizmo(t);
      this._selection = o;
      let s = [];

      o.forEach((e) => {
        let o = i.query(e);

        if (o) {
          this.updateGizmosState(o, { selecting: true, editing: false });
          s.push(o);
        }
      });

      this.edit(s);
    }
    unselect(e) {
      e.forEach((e) => {
        let o = this._selection.indexOf(e);

        if (-1 !== o) {
          this._selection.splice(o, 1);
        }

        let t = i.query(e);
        this.updateGizmosState(t, { selecting: false, editing: false });
        this.hideNodeGizmo(t);
      });
      let o = this._selection.map((e) => i.query(e));
      this.edit(o.filter((e) => !!e));
    }
    edit(e) {
      if (0 === e.length) {
        if (this._transformTool) {
          this._transformTool.target = [];
        }

        return;
      }

      if (1 === e.length) {
        this.updateGizmosState(e[0], { selecting: false, editing: true });
      }

      if (null != this.transformTool) {
        this.transformTool.target = e;
        this.transformTool.show();
      }
    }
    onMouseDown(e) {
      if (e.leftButton) {
        let t = e.x;
        let i = cc.game.canvas.height - e.y;
        let s = o(this.gizmoRootNode, t, i);
        let n = s.ray;
        if (s.length > 0) {
          let e = s[0];
          let o = new cc.Event("mouseDown", true);
          cc.Vec3.scale(h, n.d, e.distance);
          cc.Vec3.add(h, n.o, h);
          o.hitPoint = h;
          o.x = t;
          o.y = i;
          this.curSelectNode = e.node;
          this.curSelectNode.emit(o.type, o);
          return true;
        }
        return false;
      }
    }
    onMouseWheel(e) {}
    onMouseMove(e) {
      let t = e.x;
      let i = cc.game.canvas.height - e.y;
      let s = o(this.gizmoRootNode, t, i);
      let n = new cc.Event("mouseMove", true);
      n.x = t;
      n.y = i;
      n.moveDeltaX = e.moveDeltaX;
      n.moveDeltaY = -e.moveDeltaY;
      if (null != this.curSelectNode) {
        this.curSelectNode.emit(n.type, n);
      } else {
        if (s.length > 0) {
          let e = s[0].node;

          if (e !== this.hoverinNode) {
            if (null != this.hoverinNode) {
              n = new cc.Event("hoverOut", true);
              this.hoverinNode.emit(n.type, n);
            }

            this.hoverinNode = e;
            (n = new cc.Event("hoverIn", true)).x = t;
            n.y = i;
            this.hoverinNode.emit(n.type, n);
          }
        } else {
          if (null != this.hoverinNode) {
            n = new cc.Event("hoverOut", true);
            this.hoverinNode.emit(n.type, n);
          }

          this.hoverinNode = null;
        }
      }
    }
    onMouseUp(e) {
      let t = e.x;
      let i = cc.game.canvas.height - e.y;
      let s = new cc.Event("mouseUp", true);
      if (null != this.curSelectNode) {
        this.curSelectNode.emit(s.type, s);
        this.curSelectNode = null;
        return false;
      }
      {
        let e = o(this.gizmoRootNode, t, i);
        for (let o = 0; o < e.length; o++) {
          e[o].node.emit(s.type, s);
        }
      }
    }
    onMouseLeave() {
      let e = new cc.Event("mouseLeave", true);

      if (null != this.curSelectNode) {
        this.curSelectNode.emit(e.type, e);
        this.curSelectNode = null;
      }
    }
    onKeyDown(e) {
      if (!this.isGizmoToolLocked()) {
        switch (e.key.toLowerCase()) {
          case "g":
            this.coordinate = "global";
            break;
          case "l":
            this.coordinate = "local";
        }
      }

      if (this.transformTool &&
        this.transformTool.onGizmoKeyDown) {
        this.transformTool.onGizmoKeyDown(e);
      }
    }
    onKeyUp(e) {
      if (this.transformTool &&
        this.transformTool.onGizmoKeyUp) {
        this.transformTool.onGizmoKeyUp(e);
      }
    }
    onNodeChanged(e) {
      if (null != e) {
        e.emit("change");
      }

      this.hideNodeGizmo(e);

      if (-1 !== this._selection.indexOf(e.uuid)) {
        this.showNodeGizmo(e);
      }
    }
    onNodeRemoved(e) {
      if (null != e) {
        this.hideNodeGizmo(e);
      }
    }
    onComponentAdded(e, o) {
      this.showNodeGizmo(o);
    }
    onBeforeComponentRemove(e, o) {
      this.destoryGizmo(e.gizmo);
    }
  })();
