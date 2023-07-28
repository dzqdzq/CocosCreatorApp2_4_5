class o extends Editor.Gizmo{constructor(o,r){
  super(o,r);
  this._proxyTransformGizmo = null;
}layer(){return"foreground"}onKeyDown(o){}onKeyUp(o){}onGizmoKeyDown(o){
  if (this._proxyTransformGizmo) {
    this._proxyTransformGizmo.onGizmoKeyDown(o);
  }
}onGizmoKeyUp(o){
  if (this._proxyTransformGizmo) {
    this._proxyTransformGizmo.onGizmoKeyUp(o);
  }
}visible(){return o.show}dirty(){return true;}onUpdate(){
  if (this._proxyTransformGizmo) {
    this._proxyTransformGizmo.updateControllerTransform();
  }
}onTargetUpdate(){
  if (this._proxyTransformGizmo) {
    this._proxyTransformGizmo.target = this.target;
  }
}onShow(){
  if (this._proxyTransformGizmo) {
    this._proxyTransformGizmo.onShow();
  }
}onHide(){
  if (this._proxyTransformGizmo) {
    this._proxyTransformGizmo.onHide();
  }
}}
o.show = true;
module.exports = o;