"use strict";
let e = require("./editable-controller");
let t = require("../utils/controller-shape");
let s = require("../utils/controller-utils");
const {gfx:i,getModel:o,updateVBAttr:r,setMeshColor:a,setNodeOpacity:l} = require("../../../utils/engine");
const h = require("../../../utils/external").EditorCamera;
const n = cc.Vec3;

module.exports = class extends e{constructor(e){
  super(e);
  this._color = cc.Color.WHITE;
  this._center = cc.v3();
  this._size = cc.v3(1,1,1);
  this._axisDir.neg_x = cc.v3(-1,0,0);
  this._axisDir.neg_y = cc.v3(0,-1,0);
  this._axisDir.neg_z = cc.v3(0,0,-1);
  this._deltaSize = cc.v3();
  this.initShape();
}setColor(e){
  if (this._wireframeBoxNode) {
    this._color = e;
    a(this._wireframeBoxNode,e);
  }
}setOpacity(e){
  if (this._wireframeBoxNode) {
    l(this._wireframeBoxNode,e);
  }
}_updateEditController(e){
  let t = this._axisDataMap[e].topNode;
  let s = this._axisDir[e];
  let i = cc.v3();
  n.mul(i,s,this._size);
  n.scale(i,i,.5);
  let o = i.add(this._center);
  let r = this._editCtrlScales[e];
  t.setScale(r/this._scale.x,r/this._scale.y,r/this._scale.z);
  t.setPosition(o.x,o.y,o.z);
}initShape(){
  this.createShapeNode("BoxController");
  this._wireframeBoxNode = s.wireframeBox(this._center,this._size,this._color);
  this._wireframeBoxNode.parent = this.shape;
  this._wireframeBoxMeshRenderer = o(this._wireframeBoxNode);
  this.hide();
  h._camera.node.on("transform-changed",this.onEditorCameraMoved,this);
}updateSize(e,s){
  this._center = e;
  this._size = s;
  let o=t.calcBoxPoints(this._center,this._size);
  r(this._wireframeBoxMeshRenderer.mesh,i.ATTR_POSITION,o);

  if (this._edit) {
    this.updateEditControllers();
  }

  this.adjustEditControllerSize();
}getDistScalar(){return 1}onMouseDown(e){
  this._mouseDeltaPos = cc.v2(0,0);
  this._curDistScalar = super.getDistScalar();
  n.set(this._deltaSize,0,0,0);

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(e){
  this._mouseDeltaPos.x += e.moveDeltaX;
  this._mouseDeltaPos.y += e.moveDeltaY;
  let t = this._axisDir[e.axisName];
  let s = this.getAlignAxisMoveDistance(this.localToWorldDir(t),this._mouseDeltaPos)*this._curDistScalar;

  if ("x"===e.axisName||"neg_x"===e.axisName) {
    this._deltaSize.x = s;
  } else {
    if ("y"===e.axisName||"neg_y"===e.axisName) {
      this._deltaSize.y = s;
    } else {
      if (!("z"!==e.axisName && "neg_z"!==e.axisName)) {
        this._deltaSize.z = s;
      }
    }
  }

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(e);
  }
}onMouseUp(e){
  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}onHoverIn(e){this.setAxisColor(e.axisName,s.YELLOW)}onHoverOut(){this.resetAxisColor()}getDeltaSize(){return this._deltaSize}};