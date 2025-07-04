"use strict";
const t = require("../../../utils");
const e = require("../../../utils/external").NodeUtils;
const o = t.GizmoUtils;
let r = require("./transform-gizmo");
let s = require("../controller/scale-controller");
const i=require("../../../utils/transform-tool-data");

module.exports = class extends r{init(){
  this._localScaleList = [];
  this._offsetList = [];
  this._center = cc.v2(0,0);
  this.createController();
}layer(){return"foreground"}createController(){
  this._controller = new s(this.getGizmoRoot());
  this._controller.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  this._controller.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  this._controller.onControllerMouseUp = this.onControllerMouseUp.bind(this);
}onControllerMouseDown(){this._localScaleList = [];let t=this.topNodes;for(let e=0;e<t.length;++e){
  let o = t[e];
  let r = cc.v3();
  o.getScale(r);
  this._localScaleList.push(r);
}if("center"===i.pivot){
  this._center = o.getCenterWorldPos3D(this.target);
  this._offsetList.length = 0;
  for(let o=0;o<t.length;++o){let r=e.getWorldPosition3D(t[o]);this._offsetList.push(r.sub(this._center))}
}}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerTransform();
}onControllerMouseUp(){
  if (this._controller.updated) {
    this.commitChanges();
  }
}onGizmoKeyDown(e){
  if (!this.target) {
    return;
  }let o=e.key.toLowerCase();if ("arrowleft"!==o&&"arrowright"!==o&&"arrowup"!==o&&"arrowdown"!==o) {
    return;
  }
  let r = e.shiftKey?1:.1;
  let s = cc.v2();

  if ("arrowleft"===o) {
    s.x = -1*r;
  } else {
    if ("arrowright"===o) {
      s.x = r;
    } else {
      if ("arrowup"===o) {
        s.y = r;
      } else {
        if ("arrowdown"===o) {
          s.y = -1*r;
        }
      }
    }
  }

  this.recordChanges();
  let i=cc.v3();

  this.topNodes.forEach(function(e){
    e.getScale(i);
    i.x = i.x+s.x;
    i.y = i.y+s.y;
    this.setScaleWithPrecision(e,i,3);
    t.broadcastMessage("scene:node-changed",e);
  }.bind(this));

  t.repaintEngine();
}onGizmoKeyUp(t){
  if (!this.target) {
    return;
  }let e=t.key.toLowerCase();

  if (!("arrowleft"!==e&&"arrowright"!==e&&"arrowup"!==e && "arrowdown"!==e)) {
    this.commitChanges();
  }
}setScaleWithPrecision(t,o,r){
  o = e.makeVec3InPrecision(o,r);
  t.setScale(o.x,o.y,o.z);
}updateDataFromController(){if(this._controller.updated){
  let o;this.recordChanges();
  let r = this._controller.getDeltaScale();
  let s = cc.v3(1+r.x,1+r.y,1+r.z);
  let l = cc.v3();
  let n = this.topNodes;
  if ("center"===i.pivot) {let r;for(o=0;o<this._localScaleList.length;++o){
    l.x = this._localScaleList[o].x*s.x;
    l.y = this._localScaleList[o].y*s.y;
    l.z = this._localScaleList[o].z*s.z;
    this.setScaleWithPrecision(n[o],l,3);
    let i=cc.v3(this._offsetList[o].x*s.x,this._offsetList[o].y*s.y,this._offsetList[o].z*s.z);
    r = this._center.add(i);
    e.setWorldPosition3D(n[o],r);
    t.broadcastMessage("scene:node-changed",n[o]);
  }} else {
    for (o=0; o<this._localScaleList.length; ++o) {
      l.x = this._localScaleList[o].x*s.x;
      l.y = this._localScaleList[o].y*s.y;
      l.z = this._localScaleList[o].z*s.z;
      this.setScaleWithPrecision(n[o],l,3);
      t.broadcastMessage("scene:node-changed",n[o]);
    }
  }
}}updateControllerTransform(){
  let t;
  let r = this.node;
  let s = cc.quat(0,0,0,1);
  t = "center"===i.pivot?o.getCenterWorldPos3D(this.target):e.getWorldPosition3D(r);
  s = e.getWorldRotation3D(r);
  this._controller.setPosition(t);
  this._controller.setRotation(s);
}};