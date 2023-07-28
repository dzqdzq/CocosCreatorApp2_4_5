"use strict";
const { create3DNode: e, getRaycastResults: o } = require("../utils/engine");
let t = cc.v3();
module.exports = {
  init() {
    this.gizmoRootNode = e("gizmoRoot");
    this.gizmoRootNode.parent = _Scene.view.foregroundNode;
    this.recordLastX = 0;
    this.recordLastY = 0;
    this.hoverinNode = null;
    this.curSelectNode = null;
  },
  onMouseDown(e) {
    if (!e.button && 1 === e.which) {
      let i = e.offsetX;
      let n = cc.game.canvas.height - e.offsetY;
      this.recordLastX = i;
      this.recordLastY = n;
      let s = o(this.gizmoRootNode, i, n);
      let c = s.ray;
      if (s.length > 0) {
        let e = s[0];
        let o = new cc.Event("mouseDown", true);
        cc.Vec3.scale(t, c.d, e.distance);
        cc.Vec3.add(t, c.o, t);
        o.hitPoint = t;
        o.x = i;
        o.y = n;
        this.curSelectNode = e.node;
        this.curSelectNode.emit(o.type, o);
        return true;
      }
    }
  },
  onMouseWheel() {},
  onMouseMove(e) {
    let t = e.offsetX;
    let i = cc.game.canvas.height - e.offsetY;
    let n = o(this.gizmoRootNode, t, i);
    let s = new cc.Event("mouseMove", true);
    s.x = t;
    s.y = i;
    s.moveDeltaX = e.movementX;
    s.moveDeltaY = -e.movementY;
    if (null != this.curSelectNode) {
      this.curSelectNode.emit(s.type, s);
    } else {
      if (n.length > 0) {
        let e = n[0].node;

        if (e != this.hoverinNode) {
          if (null != this.hoverinNode) {
            s = new cc.Event("hoverOut", true);
            this.hoverinNode.emit(s.type, s);
          }

          this.hoverinNode = e;
          s = new cc.Event("hoverIn", true);
          this.hoverinNode.emit(s.type, s);
        }
      } else {
        if (null != this.hoverinNode) {
          s = new cc.Event("hoverOut", true);
          this.hoverinNode.emit(s.type, s);
        }

        this.hoverinNode = null;
      }
    }
  },
  onMouseUp(e) {
    let t = e.offsetX;
    let i = cc.game.canvas.height - e.offsetY;
    let n = new cc.Event("mouseUp", true);
    if (null != this.curSelectNode) {
      this.curSelectNode.emit(n.type, n);
      this.curSelectNode = null;
      return true;
    }
    {
      let e = o(this.gizmoRootNode, t, i);
      for (let o = 0; o < e.length; o++) {
        e[o].node.emit(n.type, n);
      }
    }
  },
  onMouseLeave() {
    let e = new cc.Event("mouseLeave", true);

    if (null != this.curSelectNode) {
      this.curSelectNode.emit(e.type, e);
      this.curSelectNode = null;
    }
  },
  onKeyDown(e) {
    if (_Scene.gizmosView &&
      _Scene.gizmosView.svg.transform &&
      _Scene.gizmosView.svg.transform.onGizmoKeyDown) {
      _Scene.gizmosView.svg.transform.onGizmoKeyDown(e);
    }
  },
  onKeyUp(e) {
    if (_Scene.gizmosView &&
      _Scene.gizmosView.svg.transform &&
      _Scene.gizmosView.svg.transform.onGizmoKeyUp) {
      _Scene.gizmosView.svg.transform.onGizmoKeyUp(e);
    }
  },
};
