"use strict";
let r = require("./transform-gizmo");
let t = require("../../../3d/elements/transform/rotation-gizmo");

module.exports = class extends r{init(){
  this._proxyTransformGizmo = new t(this.target);
  this._proxyTransformGizmo.init();
}};