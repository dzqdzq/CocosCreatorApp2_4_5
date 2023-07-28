"use strict";
const t = require("../../../3d/elements/components/particle-system-component-gizmo");
const i = require("../../../utils/transform-tool-data");

module.exports = class extends Editor.Gizmo{init(){
  this._ParticleCompGizmo = new t(this.target);
  this._ParticleCompGizmo.init();
}visible(){return!i.is2D&&(this.selecting||this.editing)}onUpdate(){
  if (this._ParticleCompGizmo) {
    this._ParticleCompGizmo.updateControllerData();
  }
}onTargetUpdate(){
  if (this._ParticleCompGizmo) {
    this._ParticleCompGizmo.target = this.target;
  }
}onShow(){
  if (this._ParticleCompGizmo) {
    this._ParticleCompGizmo.onShow();
  }
}onHide(){
  if (this._ParticleCompGizmo) {
    this._ParticleCompGizmo.onHide();
  }
}};