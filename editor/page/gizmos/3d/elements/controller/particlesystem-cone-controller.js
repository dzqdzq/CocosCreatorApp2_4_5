"use strict";
let t = require("./editable-controller");
let i = require("../utils/controller-shape");
let e = require("../utils/controller-utils");
const {gfx:s,getModel:o,updateVBAttr:r,setMeshColor:h,setNodeOpacity:l} = require("../../../utils/engine");
const c = cc.Vec3;
let a=cc.v3();

module.exports = class extends t{constructor(t){
  super(t);
  this._oriDir = cc.v3(0,0,-1);
  this._color = cc.Color.WHITE;
  this._center = cc.v3();
  this._radius = 100;
  this._height = 100;
  this._bottomRadius = 120;
  delete this._axisDir.z;
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._deltaRadius = 0;
  this._deltaHeight = 0;
  this._axisDir.bottom_x = cc.v3(1,0,0);
  this._axisDir.bottom_y = cc.v3(0,1,0);
  this._axisDir.bottom_neg_x = cc.v3(-1,0,0);
  this._axisDir.bottom_neg_y = cc.v3(0,-1,0);
  this._axisDir.bottom_neg_z = cc.v3(0,0,-1);
  this._deltaBottomRadius = 0;
  this.initShape();
}get radius(){return this._radius}set radius(t){this.updateSize(this._center,t,this._height)}get height(){return this._height}set height(t){this.updateSize(this._center,this._radius,t)}setColor(t){
  h(this._coneLineNode,t);
  h(this._circleNode,t);
  h(this._bottomCircleNode,t);
  this.setEditCtrlColor(t);
  this._color = t;
}_updateEditController(t){
  let i = this._axisDataMap[t].topNode;
  let e = this._axisDir[t];
  let s = new c;

  if ("bottom"===t.substr(0,6)) {
    c.multiplyScalar(s,this._oriDir,this._height);

    if ("bottom_neg_z"!==t) {
      c.multiplyScalar(a,e,this._bottomRadius);
      s.add(a);
    }
  } else {
    c.multiplyScalar(a,e,this._radius);
    s.add(a);
  }

  let o=new c(s);
  o.add(this._center);
  i.setPosition(o);
}initShape(){
  this.createShapeNode("ConeController");
  this._circleFromDir = cc.v3(1,0,0);
  let t = this.getConeLineData();
  let i = e.lines(t.vertices,t.indices,this._color);
  i.parent = this.shape;
  this._coneLineNode = i;
  this._coneLineMR = o(i);
  let s=e.arc(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius,this._color);
  s.parent = this.shape;
  this._circleNode = s;
  this._circleMR = o(s);
  let r=e.arc(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._bottomRadius,this._color);
  r.parent = this.shape;
  let h=cc.v3();
  c.multiplyScalar(h,this._oriDir,this._height);
  r.setPosition(h.x,h.y,h.z);
  this._bottomCircleNode = r;
  this._bottomCircleMR = o(r);
  this.hide();
}getConeLineData(){
  let t = [];
  let e = [];
  let s = i.calcArcPoints(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius,5);
  s = s.slice(0,s.length-1);
  let o=cc.v3();c.multiplyScalar(o,this._oriDir,this._height);let r=cc.v3();c.add(r,this._center,o);let h=i.calcArcPoints(r,this._oriDir,this._circleFromDir,this._twoPI,this._bottomRadius,5);
  h = h.slice(0,h.length-1);
  for(let i=0;i<s.length;i++){
    t.push(s[i]);
    t.push(h[i]);
    let o=2*i;e.push(o,o+1)
  }return{vertices:t,indices:e}
}updateSize(t,e,o,h){
  this._center = t;
  this._radius = e;
  this._height = o;
  this._bottomRadius = h;
  let l=this.getConeLineData();r(this._coneLineMR.mesh,s.ATTR_POSITION,l.vertices);let a=i.calcArcPoints(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._radius);r(this._circleMR.mesh,s.ATTR_POSITION,a);let _=i.calcArcPoints(this._center,this._oriDir,this._circleFromDir,this._twoPI,this._bottomRadius);r(this._bottomCircleMR.mesh,s.ATTR_POSITION,_);let n=cc.v3();
  c.multiplyScalar(n,this._oriDir,this._height);
  this._bottomCircleNode.setPosition(n.x,n.y,n.z);

  if (this._edit) {
    this.updateEditControllers();
  }

  this.adjustEditControllerSize();
}getDistScalar(){return 1}onMouseDown(t){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();
  this._deltaRadius = 0;
  this._deltaHeight = 0;
  this._deltaBottomRadius = 0;

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){if(this._isMouseDown){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  let i = this._axisDir[t.axisName];
  let e = this.getAlignAxisMoveDistance(this.localToWorldDir(i),this._mouseDeltaPos)*this._curDistScalar;

  if ("bottom_neg_z"===t.axisName) {
    this._deltaHeight = e;
  } else {
    if ("bottom"===t.axisName.substr(0,6)) {
      this._deltaBottomRadius = e;
    } else {
      this._deltaRadius = e;
    }
  }

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }
}}onMouseUp(t){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}getDeltaRadius(){return this._deltaRadius}getDeltaHeight(){return this._deltaHeight}getDeltaBottomRadius(){return this._deltaBottomRadius}};