"use strict";
let r = require("./transform-gizmo");
let i = require("../../../3d/elements/transform/position-gizmo");

module.exports = class extends r{init(){
  this._proxyTransformGizmo = new i(this.target);
  this._proxyTransformGizmo.init();
}};