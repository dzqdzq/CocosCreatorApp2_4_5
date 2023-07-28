"use strict";
const t = require("../../../utils/external");
const e = t.NodeUtils;
let o = require("../controller/box-controller");
let r = require("../gizmo-base");
const{getBoudingBox:l,getRootBoneNode:i,getRootBindPose:n}=require("../../../utils/engine");let s=t.GeometryUtils.aabb;

module.exports = class extends r{init(){
  this._degreeToRadianFactor = Math.PI/180;
  this.createController();
  this._isInited = true;
}onShow(){
  this._controller.show();
  this.updateControllerTransform();
}onHide(){
  this._controller.hide();let t=this.nodes;
  this.unRegisterNodeEvents(t,this.onNodeChanged,this);
  this.unRegisterTransformEvent(t,this.onNodeTransformChanged,this);
}createController(){
  let t=this.getGizmoRoot();
  this._controller = new o(t);
  this._controller.setOpacity(150);
}updateControllerTransform(){this.updateControllerData()}updateControllerData(){if (!this._isInited||null==this.target) {
  return;
}let t=i(this.target);if (!t) {
  this._controller.hide();
  return;
}let o=n(this.target);if (o) {
  this._controller.show();
  let r = e.getWorldPosition3D(t);
  let i = e.getWorldRotation3D(t);
  let n = e.getWorldScale3D(t);
  this._controller.setPosition(r);
  this._controller.setRotation(i);
  this._controller.setScale(n);
  let a = cc.v3();
  let h = l(this.target);
  if (!h) {
    this._controller.hide();
    return;
  }let c=s.create(0,0,0,0,0,0);
  h.transform(o,null,null,null,c);
  cc.Vec3.scale(a,c.halfExtents,2);
  let d=cc.v3(c.center.x,c.center.y,c.center.z);this._controller.updateSize(d,a)
} else {
  this._controller.hide()
}}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};