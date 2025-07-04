"use strict";
const e = require("./utils-interface");
const t = require("../../operation");

module.exports = new (class extends e {
  constructor() {
    super();
    this.baseDist = 600;
  }
  requestPointerLock() {
    t.requestPointerLock();
  }
  exitPointerLock() {
    t.exitPointerLock();
  }
  broadcastMessage(e, t) {
    let r = t;
    Manager.Node.emit("changed", r);
    Manager.Ipc.send("broadcast", e, r.uuid);
  }
  getGizmoRoot() {
    return Manager.foregroundNode.getChildByName("gizmoRoot");
  }
  repaintEngine() {}
  recordChanges(e) {
    Manager.History.snapshot();
  }
  commitChanges(e) {}
  getSqrMagnitude(e) {
    return cc.Vec3.sqrMag(e);
  }
})();
