"use strict";
module.exports = class {
  constructor() {
    this.GizmoUtils = require("./misc");
    this.baseDist = 600;
  }
  requestPointerLock() {}
  exitPointerLock() {}
  broadcastMessage(e, t) {}
  getGizmoRoot() {}
  repaintEngine() {}
  recordChanges(e) {}
  commitChanges(e) {}
  getSqrMagnitude(e) {}
};
