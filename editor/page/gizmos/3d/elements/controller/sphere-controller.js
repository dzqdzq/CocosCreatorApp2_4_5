"use strict";
let t = require("./editable-controller");
let e = require("../utils/controller-shape");
let i = require("../utils/controller-utils");
const {gfx:r,setNodeOpacity:s,getModel:a,updateVBAttr:o,setMeshColor:c} = require("../../../utils/engine");
const h = require("../../../utils");
const l = require("../../../utils/external");
const n = l.NodeUtils;
const d = l.EditorCamera;
const _ = l.EditorMath;
const {Vec3:u,Quat:M} = cc.math;
let p=cc.v3();

module.exports = class extends t{constructor(t){
  super(t);
  this._color = cc.Color.WHITE;
  this._center = cc.v3();
  this._radius = 100;
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._axisDir.neg_z = cc.v3(0,0,-1);
  this._deltaRadius = 0;
  this.initShape();
}get radius(){return this._radius}set radius(t){this.updateSize(this._center,t)}setColor(t){
  Object.keys(this._circleDataMap).forEach(e=>{
    let i=this._circleDataMap[e];
    c(i.frontArcMR.node,t);
    c(i.backArcMR.node,t);
  });

  c(this._borderCircle,t);
  this.setEditCtrlColor(t);
  this._color = t;
}createCircleByAxis(t,e,r){
  let o = this._axisDir[t];
  let c = this._axisDir[e];
  let h = i.arc(this._center,o,c,2*Math.PI,this._radius,r);
  h.parent = this.shape;
  let l=i.arc(this._center,o,c,2*Math.PI,this._radius,r);
  l.parent = this.shape;
  s(l,70);
  let n={};
  n.frontArcMR = a(h);
  n.backArcMR = a(l);
  n.normalDir = o;
  n.fromDir = c;
  this._circleDataMap[t] = n;
}createBorderCircle(){
  this._borderCircle = i.circle(this._center,cc.v3(0,0,1),this._radius,this._color);
  this._borderCircle.name = "borderCircle";
  this._borderCircle.parent = this.shape;
  this._borderCircelMR = a(this._borderCircle);
}_updateEditController(t){
  let e = this._axisDataMap[t].topNode;
  let i = this._axisDir[t];
  let r = cc.v3();
  u.scale(r,i,this._radius);let s=r.add(this._center);e.setPosition(s.x,s.y,s.z)
}initShape(){
  this.createShapeNode("SphereController");
  this._circleDataMap = {};
  this.createCircleByAxis("x","z",this._color);
  this.createCircleByAxis("y","x",this._color);
  this.createCircleByAxis("z","x",this._color);
  this.createBorderCircle();
  this.hide();
  d._camera.node.on("transform-changed",this.onEditorCameraMoved,this);
}updateSize(t,e){
  this._center = t;
  this._radius = e;

  if (this._edit) {
    this.updateEditControllers();
  }

  this.updateShape();
}getDistScalar(){return 1}updateShape(){
  let t = d._camera.node;
  let s = n.getWorldPosition3D(t);
  let a = cc.mat4();
  this.shape.getWorldMatrix(a);
  cc.Mat4.invert(a,a);
  u.transformMat4(s,s,a);
  let c=cc.v3();u.sub(c,this._center,s);
  let l = h.getSqrMagnitude(c);
  let D = this._radius*this._radius;
  let C = D*D/l;
  let m = C/D;
  if (m<1) {
    this._borderCircle.active = true;
    let t = Math.sqrt(D-C);
    let i = u.scale(p,c,D/l);
    let s = u.sub(p,this._center,i);
    let a = e.calcCirclePoints(s,c,t);
    o(this._borderCircelMR.mesh,r.ATTR_POSITION,a)
  } else {
    this._borderCircle.active = false;
  }

  Object.keys(this._circleDataMap).forEach(t=>{
    let e = this._circleDataMap[t].normalDir;
    let r = this._circleDataMap[t].frontArcMR;
    let s = this._circleDataMap[t].backArcMR;
    if (m<1) {
      let a=i.angle(c,e);
      a = 90-Math.min(a,180-a);
      let o = Math.tan(a*_.D2R);
      let h = Math.sqrt(C+o*o*C)/this._radius;
      if (h<1) {
        let t = Math.asin(h);
        let i = u.cross(p,e,c).normalize();
        let a = cc.quat(0,0,0,1);
        M.fromAxisAngle(a,e,t);
        u.transformQuat(i,i,a);
        this.updateArcMesh(r.mesh,this._center,e,i,2*(_.HALF_PI-t),this._radius);
        r.node.active = true;
        this.updateArcMesh(s.mesh,this._center,e,i,2*(_.HALF_PI-t)-_.TWO_PI,this._radius);
      } else {
        this.updateArcMesh(s.mesh,this._center,e,this._circleDataMap[t].fromDir,_.TWO_PI,this._radius);
        r.node.active = false;
      }
    } else {
      this.updateArcMesh(s.mesh,this._center,e,this._circleDataMap[t].fromDir,_.TWO_PI,this._radius);
      r.node.active = false;
    }
  });

  this.adjustEditControllerSize();
}updateArcMesh(t,i,s,a,c,h){let l=e.calcArcPoints(i,s,a,c,h);o(t,r.ATTR_POSITION,l)}onEditorCameraMoved(){this.updateShape()}onMouseDown(t){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  let e=this._axisDir[t.axisName];
  this._deltaRadius = this.getAlignAxisMoveDistance(this.localToWorldDir(e),this._mouseDeltaPos)*this._curDistScalar;

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }
}onMouseUp(t){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}getDeltaRadius(){return this._deltaRadius}};