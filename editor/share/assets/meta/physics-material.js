"use strict";
const t = Editor.metas["custom-asset"];
const s = require("fire-path");

module.exports = class extends t {
  constructor(t) {
    super(t);
    this.friction = 0;
    this.restitution = 0;
  }
  static version() {
    return "1.0.0";
  }
  static defaultType() {
    return "physics-material";
  }
  import(t, i) {
    var e = this._assetdb;
    var r = new cc.PhysicsMaterial();
    r.name = s.basenameNoExt(t);
    r.friction = this.friction;
    r.restitution = this.restitution;
    e.saveAssetToLibrary(this.uuid, r);
    return i();
  }
};
