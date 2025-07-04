"use strict";
let t = require("./editable-controller");
let e = require("../utils/controller-shape");
let i = require("../utils/controller-utils");
const {gfx:s,setMeshColor:r,getModel:h,updateVBAttr:o} = require("../../../utils/engine");
const l = cc.Vec3;
let c=cc.v3();

module.exports = class extends t{constructor(t){
  super(t);
  this._oriDir = cc.v3(0,0,-1);
  this._color = cc.Color.WHITE;
  this._center = cc.v3();
  this._radius = 100;
  this._height = 100;
  delete this._axisDir.z;
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._axisDir.neg_z = cc.v3(0,0,-1);
  this._deltaRadius = 0;
  this._deltaHeight = 0;
  this.initShape();
}get radius(){return this._radius}set radius(t){this.updateSize(this._center,t,this._height)}get height(){return this._height}set height(t){this.updateSize(this._center,this._radius,t)}setColor(t){
  r(this._coneLineNode,t);
  r(this._circleNode,t);
  this.setEditCtrlColor(t);
  this._color = t;
}_updateEditController(t){
  let e = this._axisDataMap[t].topNode;
  let i = this._axisDir[t];
  let s = cc.v3();
  l.scale(s,this._oriDir,this._height);

  if ("neg_z"!==t) {
    l.scale(c,i,this._radius);
    s = s.add(c);
  }

  let r=s.add(this._center);e.setPosition(r)
}initShape(){
  this.createShapeNode("ConeController");
  this._circleFromDir = cc.v3(1,0,0);
  let t = this.getConeLineData();
  let e = i.lines(t.vertices,t.indices,this._color);
  e.parent = this.shape;
  this._coneLineNode = e;
  this._coneLineMR = h(e);
  let s=i.arc(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius,this._color);
  s.parent = this.shape;
  let r=cc.v3();
  l.scale(r,this._oriDir,this._height);
  s.setPosition(r.x,r.y,r.z);
  this._circleNode = s;
  this._circleMR = h(s);
}getConeLineData(){
  let t = [];
  let i = [];
  let s = e.calcArcPoints(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius,5);
  s = s.slice(0,s.length-1);
  let r=cc.v3();
  l.scale(r,this._oriDir,this._height);
  t.push(this._center);
  for(let e=0;e<s.length;e++){
    let h=cc.v3();
    l.add(h,s[e],r);
    t.push(h);
    i.push(0,e+1);
  }return{vertices:t,indices:i}
}updateSize(t,i,r){
  this._center = t;
  this._radius = i;
  this._height = r;
  let h=this.getConeLineData();o(this._coneLineMR.mesh,s.ATTR_POSITION,h.vertices);let c=e.calcArcPoints(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius);o(this._circleMR.mesh,s.ATTR_POSITION,c);let a=cc.v3();
  l.scale(a,this._oriDir,this._height);
  this._circleNode.setPosition(a.x,a.y,a.z);

  if (this._edit) {
    this.updateEditControllers();
  }

  this.adjustEditControllerSize();
}getDistScalar(){return 1}onMouseDown(t){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();
  this._deltaRadius = 0;
  this._deltaHeight = 0;

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  let e = this._axisDir[t.axisName];
  let i = this.getAlignAxisMoveDistance(this.localToWorldDir(e),this._mouseDeltaPos)*this._curDistScalar;

  if ("neg_z"===t.axisName) {
    this._deltaHeight = i;
  } else {
    this._deltaRadius = i;
  }

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }
}onMouseUp(t){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}getDeltaRadius(){return this._deltaRadius}getDeltaHeight(){return this._deltaHeight}};