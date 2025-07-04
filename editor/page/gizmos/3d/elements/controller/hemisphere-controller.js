"use strict";
let t = require("./editable-controller");
let e = require("../utils/controller-shape");
let i = require("../utils/controller-utils");
const {gfx:s,getModel:r,updateVBAttr:o,setMeshColor:a,setNodeOpacity:l} = require("../../../utils/engine");
const c = require("../../../utils/external").EditorMath;
const h = cc.Vec3;

module.exports = class extends t{constructor(t){
  super(t);
  this._color = cc.Color.WHITE;
  this._center = cc.v3();
  this._radius = 100;
  delete this._axisDir.z;
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._axisDir.neg_z = cc.v3(0,0,-1);
  this._deltaRadius = 0;
  this.initShape();
}get radius(){return this._radius}set radius(t){this.updateSize(this._center,t)}setColor(t){
  Object.keys(this._circleDataMap).forEach(e=>{let i=this._circleDataMap[e];a(i.arcMR.node,t)});
  this.setEditCtrlColor(t);
  this._color = t;
}createCircleByAxis(t,e,s){
  let o = this._axisDir[t];
  let a = this._axisDir[e];
  let l = Math.PI;

  if ("neg_z"===t) {
    l = c.TWO_PI;
  }

  let h=i.arc(this._center,o,a,l,this._radius,s);
  h.parent = this.shape;
  let n={};
  n.arcMR = r(h);
  n.normalDir = o;
  n.fromDir = a;
  this._circleDataMap[t] = n;
}_updateEditController(t){
  let e = this._axisDataMap[t].topNode;
  let i = this._axisDir[t];
  let s = new h;
  h.multiplyScalar(s,i,this._radius);let r=new h(s);
  r.add(this._center);
  e.setPosition(r.x,r.y,r.z);
}initShape(){
  this.createShapeNode("SphereController");
  this._circleDataMap = {};
  this.createCircleByAxis("x","neg_y",this._color);
  this.createCircleByAxis("y","x",this._color);
  this.createCircleByAxis("neg_z","x",this._color);
  this.hide();
}updateSize(t,e){
  this._center = t;
  this._radius = e;

  Object.keys(this._circleDataMap).forEach(t=>{
    let e = this._circleDataMap[t].normalDir;
    let i = this._circleDataMap[t].fromDir;
    let s = this._circleDataMap[t].arcMR;
    let r = Math.PI;

    if ("neg_z"===t) {
      r = c.TWO_PI;
    }

    this.updateArcMesh(s,this._center,e,i,r,this._radius);
  });

  if (this._edit) {
    this.updateEditControllers();
  }

  this.adjustEditControllerSize();
}getDistScalar(){return 1}updateArcMesh(t,i,r,a,l,c){let h=e.calcArcPoints(i,r,a,l,c);o(t.mesh,s.ATTR_POSITION,h)}onMouseDown(t){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();
  this._controlDir = cc.v3(0,0,0);

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){if(this._isMouseDown){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  let e=this._axisDir[t.axisName];
  this._controlDir = e;
  this._deltaRadius = this.getAlignAxisMoveDistance(this.localToWorldDir(e),this._mouseDeltaPos)*this._curDistScalar;

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }
}}onMouseUp(t){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}getDeltaRadius(){return this._deltaRadius}getControlDir(){return this._controlDir}};