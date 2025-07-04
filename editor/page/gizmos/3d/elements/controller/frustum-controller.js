"use strict";
let t = require("./editable-controller");
let e = require("../utils/controller-shape");
let i = require("../utils/controller-utils");
const {gfx:s,setNodeOpacity:r,getModel:a,updateVBAttr:o,ProjectionType:h} = require("../../../utils/engine");
const l = require("../../../utils/external").EditorMath;
const _ = cc.Vec3;
let n=cc.v3();

module.exports = class extends t{constructor(t){
  super(t);
  this._color = cc.Color.WHITE;
  this._aspect = 1;
  this._near = 1;
  this._far = 10;
  this._cameraProjection = 1;
  this._fov = 30;
  this._orthoHeight = 0;
  this._oriDir = cc.v3(0,0,-1);
  delete this._axisDir.z;
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._axisDir.neg_z = cc.v3(0,0,-1);
  this._deltaWidth = 0;
  this._deltaHeight = 0;
  this._deltaDistance = 0;
  this.initShape();
}getFarClipSize(t,e,i,s,r){
  let a;
  let o;
  o = t?(a=e)*s:(a=Math.tan(l.deg2rad(i/2))*r)*s;
  return {farHalfHeight:a,farHalfWidth:o};
}_updateEditController(t){
  let e = this._axisDataMap[t].topNode;
  let i = this._axisDir[t];
  let s = cc.v3();
  _.scale(s,this._oriDir,this._far);
  if("neg_z"!==t){
    let e=this.getFarClipSize(this._cameraProjection===h.ORTHO,this._orthoHeight,this._fov,this._aspect,this._far);

    if ("x"===t||"neg_x"===t) {
      _.scale(n,i,e.farHalfWidth);
    } else {
      if (!("y"!==t && "neg_y"!==t)) {
        _.scale(n,i,e.farHalfHeight);
      }
    }

    s = s.add(n);
  }e.setPosition(s)
}initShape(){
  this.createShapeNode("FrustumController");
  this._frustumNode = i.frustum(this._fov,this._aspect,this._near,this._far,this._color);
  r(this._frustumNode,150);
  this._frustumNode.parent = this.shape;
  this._frustumMeshRenderer = a(this._frustumNode);
  this.hide();
}updateSize(t,i,r,a,l,_){
  this._cameraProjection = t;
  this._orthoHeight = i;
  this._fov = r;
  this._aspect = a;
  this._near = l;
  this._far = _;
  let n=e.calcFrustum(this._cameraProjection===h.ORTHO,this._orthoHeight,this._fov,this._aspect,this._near,this._far).vertices;
  o(this._frustumMeshRenderer.mesh,s.ATTR_POSITION,n);

  if (this._edit) {
    this.updateEditControllers();
  }

  this.adjustEditControllerSize();
}getDistScalar(){return 1}onMouseDown(t){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();
  this._deltaWidth = 0;
  this._deltaHeight = 0;
  this._deltaDistance = 0;

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  let e = this._axisDir[t.axisName];
  let i = this.getAlignAxisMoveDistance(this.localToWorldDir(e),this._mouseDeltaPos)*this._curDistScalar;

  if ("neg_z"===t.axisName) {
    this._deltaDistance = i;
  } else {
    if ("x"===t.axisName||"neg_x"===t.axisName) {
      this._deltaWidth = i;
    } else {
      if (!("y"!==t.axisName && "neg_y"!==t.axisName)) {
        this._deltaHeight = i;
      }
    }
  }

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }
}onMouseUp(t){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}getDeltaWidth(){return this._deltaWidth}getDeltaHeight(){return this._deltaHeight}getDeltaDistance(){return this._deltaDistance}};