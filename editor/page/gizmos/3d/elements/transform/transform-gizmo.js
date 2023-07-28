let r=require("../gizmo-base");module.exports = class extends r{constructor(r){
  super(r);
  this._controller = null;
}onShow(){
  if (this._controller) {
    this._controller.show();

    if (this.updateControllerTransform) {
      this.updateControllerTransform();
    }
  }
}onHide(){
  if (this._controller) {
    this._controller.hide();
  }
}onTargetUpdate(){
  if (this._controller&&this.updateControllerTransform) {
    this.updateControllerTransform();
  }
}};