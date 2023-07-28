"use strict";const{Vec3:t,Quat:i}=cc.math;
let e = require("./controller-base");
let a = require("../utils/controller-utils");
let s = require("../utils/controller-shape");
const {gfx:o,setNodeOpacity:r,getModel:c,updateVBAttr:h,create3DNode:n,panPlaneLayer:l,getRaycastResults:d,setMeshColor:_} = require("../../../utils/engine");
const u = require("../../../utils");
const p = require("../../../utils/external");
const D = p.NodeUtils;
const x = p.EditorMath;
const N = p.EditorCamera;
let v=cc.quat();

module.exports = class extends e{constructor(t){
  super(t);
  this._deltaRotation = cc.quat(0,0,0,1);
  this._rotFactor = 1;
  this._zDeltaAngle = 0;
  this.initShape();
}createRotationShape(t,i,e,s,o,c){
  let h = this._baseRadius;
  let l = this._tubeRadius;
  let d = n(t+"Rotation");
  d.parent = this.shape;
  let _=a.torus(h,l,{arc:Math.abs(o)},c);
  _.name = t+"RotationTorus";
  _.parent = d;
  r(_,0);
  D.setEulerAngles(_,i);
  let u=a.arrow(25,10,140,c);
  u.name = t+"Axis";
  u.parent = d;
  D.setEulerAngles(u,e);
  let p=a.arc(cc.v3(),this._axisDir[t],s,o,h,c,{noDepthTestForLines:true});
  p.parent = d;
  p.name = t+"RotationArc";
  (p=a.arc(cc.v3(),this._axisDir[t],s,this._twoPI,h,c,{noDepthTestForLines:true})).parent = d;
  p.active = false;
  p.name = t+"IndicatorCircle";
  this.initAxis(d,t);
}initShape(){
  this.createShapeNode("RotationController");
  this.registerSizeChangeEvents();
  this._baseRadius = 100;
  this._tubeRadius = 3;
  this.createRotationShape("x",cc.v3(0,0,90),cc.v3(-90,-90,0),this._axisDir.z,-this._twoPI,cc.Color.RED);
  this.createRotationShape("y",cc.v3(0,0,0),cc.v3(0,0,0),this._axisDir.z,this._twoPI,cc.Color.GREEN);
  this.createRotationShape("z",cc.v3(-90,0,0),cc.v3(90,0,90),this._axisDir.x,this._twoPI,cc.Color.BLUE);
  this._axisDir.w = cc.v3(0,0,1);
  this.createRotationShape("w",cc.v3(-90,0,0),cc.v3(0,0,-90),this._axisDir.x,this._twoPI,cc.Color.BLUE);
  let i = N._camera.node.getWorldRotation(v);
  let e = cc.v3();
  t.transformQuat(e,cc.v3(0,0,1),i);let s=a.circle(cc.v3(),e,this._baseRadius,cc.Color.GRAY);
  s.name = "circleBorder";
  s.parent = this._rootNode;
  r(s,200);
  this._circleBorderNode = s;
  this._circleBorderMR = c(s);
  this._circleBorderNode.setWorldPosition(this._position);
  let o=a.quad(2*this._baseRadius,2*this._baseRadius);
  r(o,0);
  o.parent = this._rootNode;
  o.layer = l;
  this._cutoffNode = o;
  this._cutoffMR = c(o);
  let h={};
  h.sectorNode = a.sector(cc.v3(),cc.v3(0,1,0),cc.v3(1,0,0),Math.PI,this._baseRadius,a.YELLOW,{unlit:true});
  r(h.sectorNode,200);
  h.sectorNode.parent = this._rootNode;
  h.sectorNode.active = false;
  h.meshRenderer = c(h.sectorNode);
  this._indicator = h;
  this.shape.active = false;
}onInitAxis(t,i){
  let e=this._axisDataMap[i];
  e.normalTorusNode = t.getChildByName(i+"RotationArc");
  e.indicatorCircle = t.getChildByName(i+"IndicatorCircle");
  e.arrowNode = t.getChildByName(i+"Axis");
  e.arrowNode.active = false;
  e.normalTorusMR = c(e.normalTorusNode);
}isHitOnAxisArrow(t,i){let e=this._axisDataMap[i].arrowNode;for (let i=0; i<e.childrenCount; i++) {
  if (t===e._children[i]) {
    return true;
  }
}return false;}isInCutoffBack(t,i,e){
  let a = this._axisDataMap[t].normalTorusNode;
  let s = d(this._cutoffNode,i,e);
  if(s.length>0){let t=s[0].distance;if ((s=d(a,i,e)).length>0&&s[0].distance>t) {
    return true;
  }}return false;
}onMouseDown(e){
  if (!this.is2D&&this.isInCutoffBack(e.axisName,e.x,e.y)) {
    return;
  }
  this._mouseDownRot = i.clone(this._rotation);
  this._mouseDeltaPos = cc.v2(0,0);
  let a = e.hitPoint;
  let s = t.clone(this._axisDir[e.axisName]);
  let o = cc.v3();
  let r = cc.v3();
  this._indicatorStartDir = cc.v3();

  if (this.is2D) {
    if (this.isHitOnAxisArrow(e.node,e.axisName)) {
      t.transformQuat(o,cc.v3(1,0,0),this._rotation);
    } else {
      t.sub(o,a,this._position);
    }

    t.transformQuat(this._indicatorStartDir,cc.v3(1,0,0),this._rotation);
    this._zDeltaAngle = 0;
  } else {
    t.sub(o,a,this._position);
    this._indicatorStartDir = o;
  }

  t.normalize(o,o);
  t.transformQuat(s,s,this._rotation);
  t.cross(r,o,s);
  t.cross(o,s,r);
  this._rotateAlignDir = r;
  this._transformAxisDir = s;
  this.updateRotationIndicator(this._transformAxisDir,this._indicatorStartDir,0);
  this._indicator.sectorNode.active = true;
  this._axisDataMap[e.axisName].indicatorCircle.active = true;
  this._circleBorderNode.active = false;

  Object.keys(this._axisDataMap).forEach(t=>{
    if (t===e.axisName) {
      this._axisDataMap[t].normalTorusNode.active = false;
      this._axisDataMap[t].arrowNode.active = true;
    } else {
      this._axisDataMap[t].topNode.active = false;
    }
  });

  u.requestPointerLock();

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){
  let e;
  let a = x.clamp(t.moveDeltaX,-10,10);
  let s = x.clamp(t.moveDeltaY,-10,10);
  this._mouseDeltaPos.x += a;
  this._mouseDeltaPos.y += s;
  i.identity(this._deltaRotation);
  if(1===t.axisName.length){
    let a=this.getAlignAxisMoveDistance(this._rotateAlignDir,this._mouseDeltaPos);
    e = -a/this._rotFactor*this._degreeToRadianFactor;
    i.fromAxisAngle(this._deltaRotation,this._axisDir[t.axisName],e);

    if (this.is2D) {
      this._zDeltaAngle = -a/this._rotFactor;
    }
  }
  this.updateRotationIndicator(this._transformAxisDir,this._indicatorStartDir,e);
  i.mul(this._rotation,this._mouseDownRot,this._deltaRotation);

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }

  this.updateController();
}onMouseUp(){
  u.exitPointerLock();
  this._indicator.sectorNode.active = false;
  this._deltaRotation = cc.quat(0,0,0,1);
  this._circleBorderNode.active = true;

  if (this.is2D) {
    this._axisDataMap.w.indicatorCircle.active = false;
    this._axisDataMap.w.normalTorusNode.active = true;
    this._axisDataMap.w.topNode.active = true;
  } else {
    Object.keys(this._axisDataMap).forEach(t=>{
      if ("w"!==t) {
        this._axisDataMap[t].normalTorusNode.active = true;
        this._axisDataMap[t].topNode.active = true;
        this._axisDataMap[t].indicatorCircle.active = false;
        this._axisDataMap[t].arrowNode.active = false;
      }
    });
  }

  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}onHoverIn(t){
  if (!(!this.is2D && this.isInCutoffBack(t.axisName,t.x,t.y))) {
    this.setAxisColor(t.axisName,a.YELLOW);

    Object.keys(this._axisDataMap).forEach(i=>{
      if (i!==t.axisName) {
        this.setNodesOpacity(this._axisDataMap[i].rendererNodes,50);
      }
    });
  }
}onHoverOut(){
  this.resetAxisColor();
  Object.keys(this._axisDataMap).forEach(t=>{this.setNodesOpacity(this._axisDataMap[t].rendererNodes,255)});
}setNodesOpacity(t,i){t.forEach(t=>{r(t,i)})}getDeltaRotation(){return this._deltaRotation}getZDeltaAngle(){return this._zDeltaAngle}onShow(){
  if (this.is2D) {
    this._axisDataMap.x.topNode.active = false;
    this._axisDataMap.y.topNode.active = false;
    this._axisDataMap.z.topNode.active = false;
    this._axisDataMap.w.topNode.active = true;
    this._axisDataMap.w.arrowNode.active = true;
    this._circleBorderNode.active = false;
    this._cutoffNode.active = false;
    this.updateController();
  } else {
    this._axisDataMap.x.topNode.active = true;
    this._axisDataMap.y.topNode.active = true;
    this._axisDataMap.z.topNode.active = true;
    this._axisDataMap.w.topNode.active = false;
    this._axisDataMap.w.arrowNode.active = false;
    this._circleBorderNode.active = true;
    this._cutoffNode.active = true;
  }
}onHide(){
  this._circleBorderNode.active = false;
  this._cutoffNode.active = false;
}updateRotationIndicator(t,i,e){let a=s.calcSectorPoints(this._position,t,i,e,this._baseRadius*this.getDistScalar(),60);h(this._indicator.meshRenderer.mesh,o.ATTR_POSITION,a)}adjustControllerSize(){
  let i = this.getDistScalar();
  let e = this._scale.mul(i);
  this.shape.setScale(e);
  this._circleBorderNode.setScale(e);
  this._circleBorderNode.setWorldPosition(this._position);
  let a = N._camera.node.getWorldRotation(v);
  let r = cc.v3();
  t.transformQuat(r,cc.v3(0,0,1),a);let c=s.calcCirclePoints(cc.v3(),r,this._baseRadius);
  h(this._circleBorderMR.mesh,o.ATTR_POSITION,c);
  this._cutoffNode.setScale(e);
  this._cutoffNode.setWorldPosition(this._position);
  this._cutoffNode.setWorldRotation(a);
  let n = cc.v3();
  let l = cc.mat4();
  this.shape.getWorldMatrix(l);
  cc.Mat4.invert(l,l);
  t.transformMat4Normal(n,r,l);

  if (!this.is2D) {
    Object.keys(this._axisDataMap).forEach(i=>{if("w"!==i){
      let e = cc.v3();
      let a = this._axisDir[i];
      t.cross(e,a,n);
      t.normalize(e,e);
      c = s.calcArcPoints(cc.v3(),a,e,-Math.PI,this._baseRadius);
      let r=this._axisDataMap[i];h(r.normalTorusMR.mesh,o.ATTR_POSITION,c)
    }});
  }
}};