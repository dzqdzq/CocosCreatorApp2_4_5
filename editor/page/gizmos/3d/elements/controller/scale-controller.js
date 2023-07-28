"use strict";const e=cc.Vec3;
let t = require("./controller-base");
let s = require("../utils/controller-utils");
const i=require("../../../utils/external").NodeUtils;

module.exports = class extends t{constructor(e){
  super(e);
  this._deltaScale = cc.v3(0,0,0);
  this._scaleFactor = 125;
  this.initShape();
}initShape(){
  this.createShapeNode("ScaleController");
  this.registerSizeChangeEvents();
  this._baseCubeSize = 25;
  this._baseAxisLength = 140;
  this._axisSliderNodes = {};
  let e=s.scaleSlider(25,140,cc.Color.RED);
  e.name = "xSlider";
  e.parent = this.shape;
  i.setEulerAngles(e,cc.v3(-90,-90,0));
  this.initAxis(e,"x");
  let t=s.scaleSlider(25,140,cc.Color.GREEN);
  t.name = "ySlider";
  t.parent = this.shape;
  this.initAxis(t,"y");
  let l=s.scaleSlider(25,140,cc.Color.BLUE);
  l.name = "zSlider";
  l.parent = this.shape;
  i.setEulerAngles(l,cc.v3(90,0,90));
  this.initAxis(l,"z");
  let a=s.cube(25,25,25,cc.Color.GRAY);
  a.name = "xyzScale";
  a.parent = this.shape;
  this._axisDir.xyz = cc.v3(1,1,1);
  this.initAxis(a,"xyz");
  this.shape.active = false;
}onInitAxis(e,t){
  if ("xyz"===t) {
    return;
  }let s={};
  s.head = e.getChildByName("ScaleSliderHead");
  s.body = e.getChildByName("ScaleSliderBody");
  this._axisSliderNodes[t] = s;
}onAxisSliderMove(e,t){for(let s=0;s<e.length;s++){
  let i=e.charAt(s);if (null==i) {
    return;
  }
  let l = this._axisSliderNodes[i].head;
  let a = this._axisSliderNodes[i].body;
  let o = this._baseAxisLength+t;
  let r = o/this._baseAxisLength;
  a.setScale(r,1,1);
  l.setPosition(0,o,0);
}}getAlignAxisDeltaScale(t,s){
  let i = this._axisDir[t];
  let l = this.getAlignAxisMoveDistance(this.localToWorldDir(i),s);
  let a = cc.v3();
  let o = l/this._scaleFactor;
  e.scale(a,i,o);
  this.onAxisSliderMove(t,l);
  return a;
}getAllAxisDeltaScale(e,t){
  let s = 0;
  let i = false;
  let l = Math.abs(t.x);
  let a = Math.abs(t.y);

  if (Math.abs(l-a)/Math.max(l,a)>.1&&l<a) {
    i = true;
  }

  let o=t.mag();
  s = i?Math.sign(t.y)*o:Math.sign(t.x)*o;
  this._cubeDragValue += s;
  let r = this._cubeDragValue/this._scaleFactor;
  let h = cc.v3(r,r,r);
  this.onAxisSliderMove(e,this._cubeDragValue);
  return h;
}onMouseDown(e){
  this._deltaScale = cc.v3(0,0,0);
  this._mouseDeltaPos = cc.v2(0,0);
  this._cubeDragValue = 0;
  cc.game.canvas.style.cursor = "pointer";
  this._moveAxisName = e.axisName;
  this.onAxisSliderMove(e.axisName,0);

  if (null!=this.onControllerMouseDown) {
    this.onControllerMouseDown();
  }
}onMouseMove(t){
  this._mouseDeltaPos.x += t.moveDeltaX;
  this._mouseDeltaPos.y += t.moveDeltaY;
  e.set(this._deltaScale,0,0,0);

  if ("xyz"===t.axisName) {
    this._deltaScale = this.getAllAxisDeltaScale(t.axisName,cc.v2(t.moveDeltaX,t.moveDeltaY));
  } else {
    this._deltaScale = this.getAlignAxisDeltaScale(t.axisName,this._mouseDeltaPos);
  }

  if (null!=this.onControllerMouseMove) {
    this.onControllerMouseMove(t);
  }

  this.updateController();
}onMouseUp(e){
  cc.game.canvas.style.cursor = "default";
  this.onAxisSliderMove(this._moveAxisName,0);

  if (null!=this.onControllerMouseUp) {
    this.onControllerMouseUp();
  }
}onMouseLeave(){this.onMouseUp()}onHoverIn(e){this.setAxisColor(e.axisName,s.YELLOW)}onHoverOut(){this.resetAxisColor()}getDeltaScale(){return this._deltaScale}onShow(){
  if (this.is2D) {
    this._axisDataMap.z.topNode.active = false;
    this.updateController();
  } else {
    this._axisDataMap.z.topNode.active = true;
  }
}};