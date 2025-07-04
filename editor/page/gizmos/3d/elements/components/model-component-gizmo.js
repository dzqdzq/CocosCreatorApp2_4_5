"use strict";const t=require("../../../utils/external").NodeUtils;
let e = require("../controller/box-controller");
let o = require("../gizmo-base");
const{getBoudingBox:r}=require("../../../utils/engine");

module.exports = class extends o{init(){
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
  this._controller = new e(t);
  this._controller.setOpacity(150);
}updateControllerTransform(){this.updateControllerData()}updateControllerData(){
  if (!this._isInited||null==this.target) {
    return;
  }
  let e = this.node;
  let o = r(this.target);
  if (o) {
    this._controller.show();
    let r = cc.v3();
    let i = t.getWorldScale3D(e);
    let l = t.getWorldPosition3D(e);
    let s = t.getWorldRotation3D(e);
    this._controller.setScale(i);
    this._controller.setPosition(l);
    this._controller.setRotation(s);
    cc.Vec3.scale(r,o.halfExtents,2);
    let n=cc.v3(o.center.x,o.center.y,o.center.z);this._controller.updateSize(n,r)
  } else {
    this._controller.hide()
  }
}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};