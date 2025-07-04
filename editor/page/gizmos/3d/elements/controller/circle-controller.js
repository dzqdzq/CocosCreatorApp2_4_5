"use strict";
let t = require("./editable-controller");
let i = require("../utils/controller-shape");
let e = require("../utils/controller-utils");
const {gfx:s,getModel:r,updateVBAttr:o,setMeshColor:l,setNodeOpacity:h} = require("../../../utils/engine");
const a = cc.math.Vec3;
let c=cc.v3();

module.exports = class extends t{constructor(t){
  super(t);
  this._oriDir = cc.v3(0,0,-1);
  this._color = cc.Color.WHITE;
  this._center = cc.v3();
  this._radius = 100;
  this._arc = 360;
  delete this._axisDir.z;
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._deltaRadius = 0;
  this.initShape();
}get radius(){return this._radius}set radius(t){this.updateSize(this._center,t)}setColor(t){
  l(this._circleNode,t);
  this.setEditCtrlColor(t);
  this._color = t;
}_updateEditController(t){
  let i = this._axisDataMap[t].topNode;
  let e = this._axisDir[t];
  let s = new a;
  a.multiplyScalar(c,e,this._radius);
  s.add(c);
  let r=new a(s);
  r.add(this._center);
  i.setPosition(r);
}initShape(){
  this.createShapeNode("CircleController");
  this._circleFromDir = cc.v3(1,0,0);
  let t=e.arc(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius,this._color);
  t.parent = this.shape;
  this._circleNode = t;
  this._circleMR = r(t);
  this.hide();
}updateSize(t,e,r){
  this._center = t;
  this._radius = e;
  this._arc = r;
  let l=i.calcArcPoints(this._center,this._oriDir,this._circleFromDir,-this._arc*this._degreeToRadianFactor,this._radius);
  o(this._circleMR.mesh,s.ATTR_POSITION,l);

  if (this._edit) {
    this.updateEditControllers();
  }

  this.adjustEditControllerSize();
}getDistScalar(){return 1}onMouseDown(t){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();
  this._deltaRadius = 0;
  this._controlDir = cc.v3();

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){if(this._isMouseDown){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  let i=this._axisDir[t.axisName];
  this._controlDir = i;
  let e=this.getAlignAxisMoveDistance(this.localToWorldDir(i),this._mouseDeltaPos)*this._curDistScalar;
  this._deltaRadius = e;

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }
}}onMouseUp(t){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}getDeltaRadius(){return this._deltaRadius}getControlDir(){return this._controlDir}};