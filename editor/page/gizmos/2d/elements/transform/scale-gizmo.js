"use strict";
let r = require("./transform-gizmo");
let e = require("../../../3d/elements/transform/scale-gizmo");

module.exports = class extends r{init(){
  this._proxyTransformGizmo = new e(this.target);
  this._proxyTransformGizmo.init();
}};