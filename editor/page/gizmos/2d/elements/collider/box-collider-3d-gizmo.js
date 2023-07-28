const o=require("../../../3d/elements/components/colliders/box-collider-component-gizmo");module.exports = class extends Editor.Gizmo{init(){
  this._boxColliderCompGizmo = new o(this.target);
  this._boxColliderCompGizmo.init();
}onUpdate(){
  if (this._boxColliderCompGizmo) {
    this._boxColliderCompGizmo.updateControllerData();
  }
}onTargetUpdate(){
  if (this._boxColliderCompGizmo) {
    this._boxColliderCompGizmo.target = this.target;
  }
}onShow(){
  if (this._boxColliderCompGizmo) {
    this._boxColliderCompGizmo.onShow();
  }
}onHide(){
  if (this._boxColliderCompGizmo) {
    this._boxColliderCompGizmo.onHide();
  }
}};