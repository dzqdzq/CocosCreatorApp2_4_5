const o=require("../../../3d/elements/components/model-component-gizmo");module.exports = class extends Editor.Gizmo{init(){
  this._ModelCompGizmo = new o(this.target);
  this._ModelCompGizmo.init();
}onUpdate(){
  if (this._ModelCompGizmo) {
    this._ModelCompGizmo.updateControllerTransform();
  }
}onTargetUpdate(){
  if (this._ModelCompGizmo) {
    this._ModelCompGizmo.target = this.target;
  }
}onShow(){
  if (this._ModelCompGizmo) {
    this._ModelCompGizmo.onShow();
  }
}onHide(){
  if (this._ModelCompGizmo) {
    this._ModelCompGizmo.onHide();
  }
}};