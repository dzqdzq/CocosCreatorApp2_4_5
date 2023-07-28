"use strict";
const t = require("../../../3d/elements/components/camera-component-gizmo");
const i = require("../../../utils/transform-tool-data");

module.exports = class extends Editor.Gizmo{init(){
  this._CameraCompGizmo = new t(this.target);
  this._CameraCompGizmo.init();
}visible(){return!i.is2D&&(this.selecting||this.editing)}onUpdate(){
  if (this._CameraCompGizmo) {
    this._CameraCompGizmo.updateControllerData();
  }
}onTargetUpdate(){
  if (this._CameraCompGizmo) {
    this._CameraCompGizmo.target = this.target;
  }
}onShow(){
  if (this._CameraCompGizmo) {
    this._CameraCompGizmo.onShow();
  }
}onHide(){
  if (this._CameraCompGizmo) {
    this._CameraCompGizmo.onHide();
  }
}};