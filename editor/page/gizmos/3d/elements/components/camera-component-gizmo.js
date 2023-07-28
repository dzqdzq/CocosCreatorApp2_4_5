"use strict";
const t = require("../../../utils");
const e = require("../../../utils/external");
const o = e.NodeUtils;
let r = require("../controller/frustum-controller");
let i = require("../gizmo-base");
const {getCameraData:s,setCameraData:a,ProjectionType:l} = require("../../../utils/engine");
const n = e.EditorMath;

module.exports = class extends i{init(){
  this._fov = 0;
  this._near = 0;
  this._far = 0;
  this._aspect = 0;
  this._farHalfWidth = 0;
  this._farHalfHeight = 0;
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
  this._controller.editable = true;
  this._controller.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  this._controller.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  this._controller.onControllerMouseUp = this.onControllerMouseUp.bind(this);
}onControllerMouseDown(){
  if (!this._isInited||null==this.target) {
    return;
  }let t=s(this.target);
  this._projection = t.projection;
  this._fov = t.fov;
  this._near = t.near;
  this._far = t.far;
  this._aspect = t.aspect;

  if (this._projection===l.PERSPECTIVE) {
    this._farHalfHeight = Math.tan(n.deg2rad(this._fov/2))*this._far;
  } else {
    this._farHalfHeight = t.orthoHeight;
  }

  this._farHalfWidth = this._farHalfHeight*this._aspect;
}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerData();
}onControllerMouseUp(){}updateDataFromController(){if(this._controller.updated){
  let e = this._controller.getDeltaWidth();
  let o = this._controller.getDeltaHeight();
  let r = this._controller.getDeltaDistance();
  let i = this._farHalfHeight;

  if (0!==e) {
    i = (this._farHalfWidth+e)/this._aspect;
  }

  if (0!==o) {
    i = this._farHalfHeight+o;
  }

  let s=this._far;

  if (0!==r) {
    s = this._far+r;

    if ((s=Math.abs(s))<this._near) {
      s = this._near+.01;
    }

    s = n.toPrecision(s,3);
  }

  i = Math.abs(i);
  if (this._projection===l.PERSPECTIVE) {
    let t=this._fov;

    if (i!==this._farHalfHeight) {
      if ((t=2*Math.atan2(i,this._far))<n.D2R) {
        t = n.D2R;
      }

      t *= n.R2D;
      t = n.toPrecision(t,3);
    }

    a(this.target,{fov:t,far:s});
  } else {
    i = n.toPrecision(i,3);
    a(this.target,{orthoHeight:i,far:s});
  }let h=this.node;t.broadcastMessage("scene:node-changed",h)
}}updateControllerTransform(){
  let t = this.node;
  let e = o.getWorldPosition3D(t);
  let r = o.getWorldRotation3D(t);
  this._controller.setPosition(e);
  this._controller.setRotation(r);
}updateControllerData(){
  if (!this._isInited||null==this.target) {
    return;
  }let t=s(this.target);

  if (t) {
    this._controller.checkEdit();
    this._controller.updateSize(t.projection,t.orthoHeight,t.fov,t.aspect,t.near,t.far);
    this.updateControllerTransform();
  }
}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};