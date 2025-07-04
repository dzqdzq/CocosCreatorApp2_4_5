"use strict";
const e = require("../../../utils");
const t = require("../../../utils/external");
const o = t.NodeUtils;
const i = require("../controller/sphere-controller");
const r = require("../controller/box-controller");
const s = require("../controller/circle-controller");
const a = require("../controller/particlesystem-cone-controller");
const l = require("../controller/hemisphere-controller");
let n=require("../gizmo-base");
const {create3DNode:h} = require("../../../utils/engine");
const c = t.EditorMath;
const {Vec3:u,Quat:d} = cc;
let C=cc.v3();
const _ = {Box:0,Circle:1,Cone:2,Sphere:3,Hemisphere:4};
const p = {Constant:0,Curve:1,TwoCurves:2,TwoConstants:3};

module.exports = class extends n{init(){
  this._curEmitterShape = _.Box;
  this._shapeControllers = {};
  this._PSGizmoColor = new cc.Color(100,100,255);
  this._activeController = null;
  this._scale = cc.v3();
  this._size = cc.v3();
  this._radius = 0;
  this._arc = 0;
  this._coneHeight = 0;
  this._coneAngle = 0;
  this._bottomRadius = 0;
  this._isInited = true;
}onShow(){this.updateControllerData()}onHide(){
  if (this._activeController) {
    this._activeController.hide();
  }
}createControllerByShape(e){
  let t=this.getGizmoRoot();if(!this._pSGizmoRoot){
    let e=h("ParticleSystemGizmo");
    e.parent = t;
    this._pSGizmoRoot = e;
  }let o=null;switch(e){case _.Box:o = new r(this._pSGizmoRoot);break;case _.Sphere:o = new i(this._pSGizmoRoot);break;case _.Circle:o = new s(this._pSGizmoRoot);break;case _.Cone:o = new a(this._pSGizmoRoot);break;case _.Hemisphere:o = new l(this._pSGizmoRoot);break;default:console.error("Invalid Type:",e)}

  if (o) {
    o.editable = true;
    o.setColor(this._PSGizmoColor);
    o.onControllerMouseDown = this.onControllerMouseDown.bind(this);
    o.onControllerMouseMove = this.onControllerMouseMove.bind(this);
    o.onControllerMouseUp = this.onControllerMouseUp.bind(this);
  }

  return o;
}getControllerByShape(e){
  let t=this._shapeControllers[e];

  if (!t) {
    t = this.createControllerByShape(e);
    this._shapeControllers[e] = t;
  }

  return t;
}getConeData(e){
  let t = e.shapeModule;
  let o = t.radius;
  let i = t.angle;
  let r = t.length;
  let s = 0;

  if (i<0) {
    i = 0;
  }

  return {topRadius:o,height:r,bottomRadius:o+(s=i>=90?1e3:Math.tan(i*c.D2R)*r),coneAngle:i};
}modifyConeData(e,t,o,i){let r=e.shapeModule;if (0!==t) {
  let e=this._radius+t;

  if ((e=c.toPrecision(e,3))<0) {
    e = 1e-4;
  }

  r.radius = e;
} else {
  if (0!==o) {
    let e=this._coneHeight+o;

    if ((e=c.toPrecision(e,3))<=0) {
      e = 1e-4;
    }

    r.length = e;
  } else {
    if(0!==i){
      let e=this._bottomRadius+i;

      if (e<this._radius) {
        e = this._radius;
      }

      let t=Math.atan2(e-this._radius,this._coneHeight)*c.R2D;
      r.angle = c.toPrecision(t,3);
    }
  }
}}setCurveRangeInitValue(e,t){switch(e.mode){case p.Constant:e.constant = t;break;case p.Curve:
  let o=e.curve.keyFrames[0];

  if (o) {
    o.value = t;
  }

  break;case p.TwoCurves:
  if ((o = e.curveMax.keyFrames[0])) {
    o.value = t;
  }

  break;case p.TwoConstants:e.constantMax = t;break;default:console.error("unknown cure range mode:",e.mode)}}onControllerMouseDown(){if (!this._isInited||null==this.target) {
  return;
}let e=this.target.shapeModule;switch(this._curEmitterShape=e.shapeType,this._scale=o.getWorldScale3D(this.node),this._curEmitterShape){case _.Box:this._size = e.scale.clone();break;case _.Sphere:this._radius = e.radius;break;case _.Circle:
  this._radius = e.radius;
  this._arc = e.arc;
  break;case _.Cone:
  let t=this.getConeData(this.target);
  this._radius = t.topRadius;
  this._coneHeight = t.height;
  this._coneAngle = t.coneAngle;
  this._bottomRadius = t.bottomRadius;case _.Hemisphere:this._radius = e.radius;}}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerData();
}onControllerMouseUp(){this.commitChanges()}getScaledDeltaRadius(e,t,o){
  if (0!==t.x) {
    e /= o.x;
  } else {
    if (0!==t.y) {
      e /= o.y;
    } else {
      if (0!==t.z) {
        e /= o.z;
      }
    }
  }

  return e;
}updateDataFromController(){if(this._activeController.updated){
  this.recordChanges();
  let r = this.node;
  let s = this.target.shapeModule;
  switch(this._curEmitterShape){case _.Box:
    let r=this._activeController.getDeltaSize();
    u.divide(r,r,this._scale);
    u.multiplyScalar(r,r,2);
    let a=u.add(C,this._size,r);
    e.clampSize(a);
    s.scale = a;
    break;case _.Sphere:
    var t = this._activeController.getDeltaRadius();
    var o = this._activeController.getControlDir();
    t = this.getScaledDeltaRadius(t,o,this._scale);
    var i=this._radius+t;
    i = Math.abs(i);
    i = c.toPrecision(i,3);
    s.radius = i;
    break;case _.Circle:
    t = this._activeController.getDeltaRadius();

    if (0!==(o=this._activeController.getControlDir()).x) {
      t /= this._scale.x;
    } else {
      if (0!==o.y) {
        t /= this._scale.y;
      }
    }

    i = this._radius+t;
    i = Math.abs(i);
    i = c.toPrecision(i,3);
    s.radius = i;
    break;case _.Cone:
    let l = this._activeController.getDeltaRadius();
    let n = this._activeController.getDeltaHeight();
    let h = this._activeController.getDeltaBottomRadius();
    this.modifyConeData(this.target,l,n,h);break;case _.Hemisphere:
    t = this._activeController.getDeltaRadius();
    o = this._activeController.getControlDir();
    t = this.getScaledDeltaRadius(t,o,this._scale);
    i = this._radius+t;
    i = Math.abs(i);
    i = c.toPrecision(i,3);
    s.radius = i;}e.broadcastMessage("scene:node-changed",r)
}}updateControllerTransform(){if(this.target&&this.target.shapeModule){let e=this.target.shapeModule;if(e.enable&&this._pSGizmoRoot){
  let t = this.node;
  let i = cc.quat(0,0,0,1);
  let r = o.getWorldPosition3D(t);
  i = o.getWorldRotation3D(t);
  let s=o.getWorldScale3D(t);
  this._pSGizmoRoot.setWorldPosition(r);
  this._pSGizmoRoot.setWorldRotation(i);
  this._pSGizmoRoot.setWorldScale(s);
  let a = e.rotation;
  let l = cc.quat();
  d.fromEuler(l,a.x,a.y,a.z);
  this._activeController.setPosition(e.position);
  this._activeController.setRotation(l);
  this._activeController.setScale(e.scale);
}}}getConeRadius(e,t){return Math.tan(e/2*c.D2R)*t}updateControllerData(){if (!this._isInited||null==this.target) {
  return;
}let e=this.target.shapeModule;if (e.enable) {
  switch(this._activeController&&this._activeController.hide(),this._activeController=this.getControllerByShape(e.shapeType),this._activeController.checkEdit(),e.shapeType){case _.Box:break;case _.Sphere:this._activeController.radius = e.radius;break;case _.Circle:this._activeController.updateSize(cc.v3(),e.radius,e.arc);break;case _.Cone:let t=this.getConeData(this.target);this._activeController.updateSize(cc.v3(),t.topRadius,t.height,t.bottomRadius);break;case _.Hemisphere:this._activeController.radius = e.radius;}
  this._activeController.show();
  this.updateControllerTransform();
} else {
  if (this._activeController) {
    this._activeController.hide();
  }
}}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};