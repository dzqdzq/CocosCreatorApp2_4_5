"use strict";
let e = require("./controller-base");
let t = require("../utils/controller-utils");
const r = require("../../../utils/external");
const c = r.NodeUtils;
const i = r.EditorCamera;

module.exports = class extends e{constructor(e){
  super(e);
  this.initShape();
}createAxis(e,r,i){
  let s=t.lineTo(cc.v3(),cc.v3(0,28,0),r,{noDepthTestForLines:true});
  s.name = e+"Axis";
  s.parent = this.shape;
  c.setEulerAngles(s,i);
}initShape(){
  this.createShapeNode("WorldAxisController");
  this.createAxis("x",cc.Color.RED,cc.v3(-90,-90,0));
  this.createAxis("y",cc.Color.GREEN,cc.v3());
  this.createAxis("z",cc.Color.BLUE,cc.v3(90,0,90));
  this.registerCameraMovedEvent();
}getDistScalar(){return 1}onEditorCameraMoved(){
  let e = i._camera._camera;
  let t = cc.v3(30,30,.1);
  let r = cc.v3();
  e.screenToWorld(r,t,cc.winSize.width,cc.winSize.height);
  this.setPosition(r);
}};