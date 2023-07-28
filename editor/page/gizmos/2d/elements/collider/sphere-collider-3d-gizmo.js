const e=require("../../../3d/elements/components/colliders/sphere-collider-component-gizmo");module.exports = class extends Editor.Gizmo{init(){
  this._sphereColliderCompGizmo = new e(this.target);
  this._sphereColliderCompGizmo.init();
}onUpdate(){
  if (this._sphereColliderCompGizmo) {
    this._sphereColliderCompGizmo.updateControllerData();
  }
}onTargetUpdate(){
  if (this._sphereColliderCompGizmo) {
    this._sphereColliderCompGizmo.target = this.target;
  }
}onShow(){
  if (this._sphereColliderCompGizmo) {
    this._sphereColliderCompGizmo.onShow();
  }
}onHide(){
  if (this._sphereColliderCompGizmo) {
    this._sphereColliderCompGizmo.onHide();
  }
}};