"use strict";
const t = require("../../../../utils");
const e = require("../../../../utils/external");
const o = e.NodeUtils;
let r = require("../../controller/box-controller");
let l = require("../../gizmo-base");
const s = e.EditorMath;
const i = cc.Vec3;
let n=cc.v3();

module.exports = class extends l{init(){
  this._size = cc.v3();
  this._scale = cc.v3();
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
  if (this._isInited&&null!=this.target) {
    this._size = this.target.size.clone();
    this._scale = o.getWorldScale3D(this.node);
  }
}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerData();
}onControllerMouseUp(){}clampSize(t){
  t.x = Math.abs(t.x);
  t.y = Math.abs(t.y);
  t.z = Math.abs(t.z);
  t.x = s.toPrecision(t.x,3);
  t.y = s.toPrecision(t.y,3);
  t.z = s.toPrecision(t.z,3);
}updateDataFromController(){if(this._controller.updated){
  let e=this._controller.getDeltaSize();
  i.div(e,e,this._scale);
  i.scale(e,e,2);
  let o=i.add(n,this._size,e);
  this.clampSize(o);
  this.target.size = o;
  let r=this.node;t.broadcastMessage("scene:node-changed",r)
}}updateControllerData(){if (this._isInited&&null!=this.target) {
  if (this.target instanceof cc.BoxCollider3D) {
    let t=this.node;
    this._controller.show();
    this._controller.checkEdit();
    let e = o.getWorldScale3D(t);
    let r = o.getWorldPosition3D(t);
    let l = o.getWorldRotation3D(t);
    this._controller.setScale(e);
    this._controller.setPosition(r);
    this._controller.setRotation(l);
    this._controller.updateSize(this.target.center,this.target.size);
  } else {
    this._controller.hide();
    console.error("target is not a cc.BoxCollider3D");
  }
}}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};