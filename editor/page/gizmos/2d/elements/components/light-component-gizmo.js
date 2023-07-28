"use strict";
const t = require("../../../3d/elements/components/light-component-gizmo");
const i = require("../../../utils/transform-tool-data");

module.exports = class extends Editor.Gizmo{init(){
  this._LightCompGizmo = new t(this.target);
  this._LightCompGizmo.init();
}visible(){return!i.is2D&&(this.selecting||this.editing)}onUpdate(){
  if (this._LightCompGizmo) {
    this._LightCompGizmo.updateControllerData();
  }
}onTargetUpdate(){
  if (this._LightCompGizmo) {
    this._LightCompGizmo.target = this.target;
  }
}onShow(){
  if (this._LightCompGizmo) {
    this._LightCompGizmo.onShow();
  }
}onHide(){
  if (this._LightCompGizmo) {
    this._LightCompGizmo.onHide();
  }
}};