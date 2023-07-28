"use strict";const t=cc.Vec3;
let e = require("./controller-base");
let s = require("../utils/controller-utils");
const o = require("../../../utils/external").NodeUtils;
const {getRaycastResults:i,setNodeOpacity:a,panPlaneLayer:n} = require("../../../utils/engine");

module.exports = class extends e{constructor(t){
  super(t);
  this._deltaPosition = cc.v3(0,0,0);
  this._mouseDownPos = cc.v3(0,0,0);
  this.onControllerMouseDown = null;
  this.onControllerMouseMove = null;
  this.onControllerMouseUp = null;
  this.initShape();
}createAxis(t,e,i){
  let a=s.arrow(25,10,140,e);
  a.name = t+"Axis";
  a.parent = this.shape;
  o.setEulerAngles(a,i);
  this.initAxis(a,t);
}createControlPlane(e,i,l){
  let r=cc.v3();for(let s=0;s<e.length;s++){
    let o=cc.v3();
    t.scale(o,this._axisDir[e.charAt(s)],12.5);
    r = r.add(o);
  }let h=s.borderPlane(25,25,i,128);
  h.name = e+"Plane";
  h.parent = this.shape;
  o.setEulerAngles(h,l);
  h.setPosition(r.x,r.y,r.z);
  let c=s.quad(1e5,1e5);
  c.parent = this._rootNode;
  c.name = e+"PanPlane";
  c.active = false;
  c.layer = n;
  o.setEulerAngles(c,l);
  a(c,0);
  this.initAxis(h,e);
  this._axisDataMap[e].panPlane = c;
}initShape(){
  this.createShapeNode("PositionController");
  this.registerSizeChangeEvents();
  this.createAxis("x",cc.Color.RED,cc.v3(-90,-90,0));
  this.createAxis("y",cc.Color.GREEN,cc.v3());
  this.createAxis("z",cc.Color.BLUE,cc.v3(90,0,90));
  this.createControlPlane("xy",cc.Color.BLUE,cc.v3());
  this.createControlPlane("xz",cc.Color.GREEN,cc.v3(90,0,0));
  this.createControlPlane("yz",cc.Color.RED,cc.v3(0,-90,0));
  this.hide();
}getDeltaPosition(){return this._deltaPosition}onMouseDown(t){
  this._deltaPosition = cc.v3(0,0,0);
  this._mouseDownPos = this._position;
  this._mouseDeltaPos = cc.v2(0,0);
  this._mouseDownAxis = t.axisName;
  this._curDistScalar = this.getDistScalar();

  if (this._mouseDownAxis.length>1) {
    this._isInPanDrag = true;
    this._dragPanPlane = this._axisDataMap[this._mouseDownAxis].panPlane;
    this._dragPanPlane.setPosition(this._position);
    this._dragPanPlane.active = true;
    this._mouseDownOnPlanePos = cc.v3();
    this.getPositionOnPanPlane(this._mouseDownOnPlanePos,t.x,t.y,this._dragPanPlane);
  }

  cc.game.canvas.style.cursor = "move";

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}getAlignAxisDeltaPosition(e,s){
  let o = this._axisDir[e];
  let i = this.getAlignAxisMoveDistance(this.localToWorldDir(o),s);
  let a = cc.v3();
  t.scale(a,o,i*this._curDistScalar);
  return a;
}getPositionOnPanPlane(e,s,o,a){
  let n = i(a,s,o);
  let l = n.ray;
  if(n.length>0){
    let s=n[0];
    t.scale(e,l.d,s.distance);
    t.add(e,l.o,e);
    return true;
  }return false;
}onMouseMove(e){
  if(this._isInPanDrag){
    let t=cc.v3();

    if (this.getPositionOnPanPlane(t,e.x,e.y,this._dragPanPlane)) {
      this._deltaPosition = t.sub(this._mouseDownOnPlanePos);
    }
  }else{
    this._mouseDeltaPos.x += e.moveDeltaX;
    this._mouseDeltaPos.y += e.moveDeltaY;
    t.set(this._deltaPosition,0,0,0);
    for(let s=0;s<e.axisName.length;s++){let o=this.getAlignAxisDeltaPosition(e.axisName.charAt(s),this._mouseDeltaPos);t.add(this._deltaPosition,this._deltaPosition,o)}t.transformQuat(this._deltaPosition,this._deltaPosition,this._rotation)
  }
  this._position = this._mouseDownPos.add(this._deltaPosition);

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(e);
  }

  this.updateController();
}onMouseUp(){
  if (this._isInPanDrag) {
    this._dragPanPlane.active = false;
    this._isInPanDrag = false;
  }

  cc.game.canvas.style.cursor = "default";

  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}onHoverIn(t){this.setAxisColor(t.axisName,s.YELLOW)}onHoverOut(){this.resetAxisColor()}onShow(){
  if (this.is2D) {
    this._axisDataMap.z.topNode.active = false;
    this._axisDataMap.xz.topNode.active = false;
    this._axisDataMap.yz.topNode.active = false;
    this.updateController();
  } else {
    this._axisDataMap.z.topNode.active = true;
    this._axisDataMap.xz.topNode.active = true;
    this._axisDataMap.yz.topNode.active = true;
  }
}};