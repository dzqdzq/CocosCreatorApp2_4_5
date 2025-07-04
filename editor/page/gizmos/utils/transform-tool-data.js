"use strict";
let t = require("events");
module.exports = new (class extends t {
  constructor() {
    super();
    this._toolName = "position";
    this._coordinate = "local";
    this._pivot = "pivot";
    this._isLocked = false;
    this._is2D = false;
    this._scale2D = 1;
  }
  get toolName() {
    return this._toolName;
  }
  set toolName(t) {
    if (!this.isLocked) {
      this._toolName = t;
      this.emit("tool-name-changed", this._toolName);
    }
  }
  get coordinate() {
    return this._coordinate;
  }
  set coordinate(t) {
    if (!this.isLocked) {
      this._coordinate = t;
      this.emit("coordinate-changed", this._coordinate);
    }
  }
  get pivot() {
    return this._pivot;
  }
  set pivot(t) {
    if (!this.isLocked) {
      this._pivot = t;
      this.emit("pivot-changed", this._pivot);
    }
  }
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(t) {
    this._isLocked = t;
    this.emit("lock-changed", this._isLocked);
  }
  get is2D() {
    return this._is2D;
  }
  set is2D(t) {
    this._is2D = t;
    this.emit("dimension-changed", this._is2D);
  }
  get scale2D() {
    return this._scale2D;
  }
  set scale2D(t) {
    this._scale2D = t;
    this.emit("scale-2d-changed", this._scale2D);
  }
})();
