"use strict";
const t = require("../../../../utils");
const e = require("../../../../utils/external");
const o = e.NodeUtils;
let r = require("../../controller/sphere-controller");
let l = require("../../gizmo-base");
const s=e.EditorMath;

module.exports = class extends l{init(){
  this._radius = 0;
  this._maxScale = 1;
  this.createController();
  this._isInited = true;
}onShow(){
  this._controller.show();
  this.updateControllerData();
}onHide(){
  this._controller.hide();let t=this.nodes;
  this.unRegisterNodeEvents(t,this.onNodeChanged,this);
  this.unRegisterTransformEvent(t,this.onNodeTransformChanged,this);
}createController(){
  let t=this.getGizmoRoot();
  this._controller = new r(t);
  this._controller.setColor(cc.Color.GREEN);
  this._controller.editable = true;
  this._controller.hoverColor = cc.Color.YELLOW;
  this._controller.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  this._controller.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  this._controller.onControllerMouseUp = this.onControllerMouseUp.bind(this);
}onControllerMouseDown(){
  if (!this._isInited||null==this.target) {
    return;
  }let t=o.getWorldScale3D(this.node);
  this._maxScale = this.getMaxScale(t);
  this._radius = this.target.radius;
}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerData();
}onControllerMouseUp(){}getMaxScale(t){return Math.max(t.x,t.y,t.z)}updateDataFromController(){if(this._controller.updated){
  let e = this._controller.getDeltaRadius();
  let o = this._radius+e/this._maxScale;
  o = Math.abs(o);
  o = s.toPrecision(o,3);
  this.target.radius = o;
  let r=this.node;t.broadcastMessage("scene:node-changed",r)
}}updateControllerData(){if (this._isInited&&null!=this.target) {
  if (this.target instanceof cc.SphereCollider3D) {
    let t=this.node;
    this._controller.show();
    this._controller.checkEdit();
    let e = o.getWorldScale3D(t);
    let r = this.getMaxScale(e);
    let l = o.getWorldPosition3D(t);
    let s = o.getWorldRotation3D(t);
    this._controller.setScale(cc.v3(r,r,r));
    this._controller.setPosition(l);
    this._controller.setRotation(s);
    this._controller.updateSize(this.target.center,this.target.radius);
  } else {
    this._controller.hide();
    console.error("target is not a cc.SphereCollider3D");
  }
}}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};