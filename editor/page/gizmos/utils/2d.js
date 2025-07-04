"use strict";
const e = require("./utils-interface");
const t = Editor.require("scene://utils/animation");

module.exports = new (class extends e {
  constructor() {
    super();
    this.baseDist = 500;
  }
  requestPointerLock() {
    cc.game.canvas.requestPointerLock();
  }
  exitPointerLock() {
    document.exitPointerLock();
  }
  broadcastMessage(e, t) {}
  getGizmoRoot() {
    return _Scene.view.foregroundNode.getChildByName("gizmoRoot");
  }
  repaintEngine() {
    if (cc.engine) {
      cc.engine.repaintInEditMode();
    }
  }
  recordChanges(e) {
    e.forEach((e) => {
      _Scene.Undo.recordNode(e.uuid);
    });
  }
  commitChanges(e) {
    t.recordNodeChanged(e);
    _Scene.Undo.commit();
  }
  getSqrMagnitude(e) {
    return cc.Vec3.squaredMagnitude(e);
  }
})();
