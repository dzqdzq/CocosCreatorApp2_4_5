"use strict";
const {Vec3:t,Quat:e} = cc.math;
const o = require("../../../utils");
const r = require("../../../utils/external");
const i = r.NodeUtils;
const s = o.GizmoUtils;
let l = require("./transform-gizmo");
let n = require("../controller/rotation-controller");
const a = require("../../../utils/transform-tool-data");
const h = r.EditorMath;

module.exports = class extends l{init(){
  this._rotList = [];
  this._offsetList = [];
  this._center = cc.v2(0,0);
  this._rotating = false;
  this._degreeToRadianFactor = Math.PI/180;
  this.createController();
}layer(){return"foreground"}createController(){
  this._controller = new n(this.getGizmoRoot());
  this._controller.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  this._controller.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  this._controller.onControllerMouseUp = this.onControllerMouseUp.bind(this);
}onControllerMouseDown(){
  this._rotating = true;
  this._rotList = [];
  let t=this.topNodes;for (let o=0; o<t.length; ++o) {
    if (this._controller.is2D) {
      this._rotList.push(t[o].angle);
    } else
      {let r=i.getWorldRotation3D(t[o]);this._rotList.push(e.clone(r))}
  }if("center"===a.pivot){
    this._center = s.getCenterWorldPos3D(this.target);
    this._offsetList.length = 0;
    for(let e=0;e<t.length;++e){let o=i.getWorldPosition3D(t[e]);this._offsetList.push(o.sub(this._center))}
  }o.requestPointerLock()
}onControllerMouseMove(t){
  this.updateDataFromController();
  this.updateControllerTransform();
}onControllerMouseUp(){
  if("center"===a.pivot){
    let t = s.getCenterWorldPos3D(this.target);
    let e = cc.quat(0,0,0,1);
    this._controller.setPosition(t);
    this._controller.setRotation(e);
  }
  this._rotating = false;

  if (this._controller.updated) {
    this.commitChanges();
  }

  o.exitPointerLock();
}onGizmoKeyDown(t){
  if (!this.target) {
    return;
  }
  this._rotating = true;
  let e=t.key.toLowerCase();if ("arrowleft"!==e&&"arrowright"!==e&&"arrowup"!==e&&"arrowdown"!==e) {
    return;
  }let r=t.shiftKey?10:1;

  if (!("arrowright"!==e && "arrowdown"!==e)) {
    r *= -1;
  }

  if(!this.keydownDelta){this.keydownDelta = 0;let t=this.topNodes;this._rotList = [];for (let e=0; e<t.length; ++e) {
    this._rotList.push(t[e].angle)
  }}
  this.keydownDelta += r;
  this.recordChanges();
  this.updateRotationByZDeltaAngle(this.keydownDelta);
  o.repaintEngine();
}onGizmoKeyUp(t){if (!this.target) {
  return;
}let e=t.key.toLowerCase();if("arrowleft"===e||"arrowright"===e||"arrowup"===e||"arrowdown"===e){
  if("center"===a.pivot){
    let t=s.getCenterWorldPos3D(this.target);
    this._controller.setPosition(t);
    this._controller.setRotation(cc.quat(0,0,0,1));
  }
  this.keydownDelta = null;
  this._rotating = false;
  this.commitChanges();
}}updateDataFromController(){
  if (this._controller.is2D) {
    this.updateDataFromController2D();
  } else {
    this.updateDataFromController3D();
  }
}updateDataFromController3D(){if(this._controller.updated){
  let r;this.recordChanges();
  let s = cc.quat(0,0,0,1);
  let l = this._controller.getDeltaRotation();
  let n = this.topNodes;
  if ("center"===a.pivot) {
    for(r=0;r<n.length;++r){
      let h=this._rotList[r];if (null==h) {
        return;
      }

      if ("global"===a.coordinate) {
        e.mul(s,l,h);
      } else {
        e.mul(s,h,l);
      }

      let c=cc.v3();
      t.transformQuat(c,this._offsetList[r],l);
      i.setWorldPosition3D(n[r],this._center.add(c));
      i.setWorldRotation3D(n[r],s);
      o.broadcastMessage("scene:node-changed",n[r]);
    }
  } else {
    for (r=0; r<n.length; ++r) {
      if ("global"===a.coordinate) {
        e.mul(s,l,this._rotList[r]);
      } else {
        e.mul(s,this._rotList[r],l);
      }

      i.setWorldRotation3D(n[r],s);
      o.broadcastMessage("scene:node-changed",n[r]);
    }
  }
}}updateDataFromController2D(){if(this._controller.updated){this.recordChanges();let t=this._controller.getZDeltaAngle();this.updateRotationByZDeltaAngle(t)}}updateRotationByZDeltaAngle(r){
  let s;
  r = h.toPrecision(r,3);
  let l = cc.quat();
  let n = this.topNodes;
  if ("center"===a.pivot) {
    for(s=0;s<n.length;++s){
      let a=this._rotList[s];if (null==a) {
        return;
      }let h=a+r;
      n[s].angle = h;
      e.fromAngleZ(l,r);
      let c=cc.v3();
      t.transformQuat(c,this._offsetList[s],l);
      i.setWorldPosition3D(n[s],this._center.add(c));
      o.broadcastMessage("scene:node-changed",n[s]);
    }
  } else {
    for(s=0;s<n.length;++s){
      let t=this._rotList[s]+r;
      n[s].angle = t;
      o.broadcastMessage("scene:node-changed",n[s]);
    }
  }
}updateControllerTransform(){
  let t;
  let e = this.node;
  let o = cc.quat(0,0,0,1);
  if ("center"===a.pivot) {if (this._rotating) {
    return;
  }t = s.getCenterWorldPos3D(this.target);} else {
    t = i.getWorldPosition3D(e);
  }
  o = "global"===a.coordinate?this._controller.getDeltaRotation():i.getWorldRotation3D(e);
  this._controller.setPosition(t);
  this._controller.setRotation(o);
}};