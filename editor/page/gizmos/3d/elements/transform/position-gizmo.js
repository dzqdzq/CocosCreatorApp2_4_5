"use strict";
const o = require("../../../utils");
const t = require("../../../utils/external").NodeUtils;
const e = o.GizmoUtils;
let r = require("../controller/position-controller");
let s = require("./transform-gizmo");
const n=require("../../../utils/transform-tool-data");

module.exports = class extends s{init(){
  this.nodesWorldPosList = [];
  this.createController();
}layer(){return"foreground"}createController(){
  this._controller = new r(this.getGizmoRoot());
  this._controller.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  this._controller.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  this._controller.onControllerMouseUp = this.onControllerMouseUp.bind(this);
}onControllerMouseDown(){this.nodesWorldPosList.length = 0;let o=this.topNodes;for (let e=0; e<o.length; ++e) {
  this.nodesWorldPosList.push(t.getWorldPosition3D(o[e]))
}}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerTransform();
}onControllerMouseUp(){
  if (this._controller.updated) {
    this.commitChanges();
  }
}onGizmoKeyDown(t){
  if (!this.target) {
    return;
  }let e=t.key.toLowerCase();if ("arrowleft"!==e&&"arrowright"!==e&&"arrowup"!==e&&"arrowdown"!==e) {
    return;
  }
  let r = t.shiftKey?10:1;
  let s = cc.v3();

  if ("arrowleft"===e) {
    s.x = -r;
  } else {
    if ("arrowright"===e) {
      s.x = r;
    } else {
      if ("arrowup"===e) {
        s.y = r;
      } else {
        if ("arrowdown"===e) {
          s.y = -r;
        }
      }
    }
  }

  this.recordChanges();
  let n=cc.v3();

  this.topNodes.forEach(t=>{
    t.getPosition(n);
    n = n.add(s);
    t.setPosition(n.x,n.y,n.z);
    o.broadcastMessage("scene:node-changed",t);
  });

  o.repaintEngine();
}onGizmoKeyUp(o){
  if (!this.target) {
    return;
  }let t=o.key.toLowerCase();

  if (!("arrowleft"!==t&&"arrowright"!==t&&"arrowup"!==t && "arrowdown"!==t)) {
    this.commitChanges();
  }
}updateDataFromController(){if(this._controller.updated){
  this.recordChanges();
  let e;
  let r = this._controller.getDeltaPosition();
  let s = this.topNodes;
  for (let n=0; n<this.nodesWorldPosList.length; ++n) {
    e = this.nodesWorldPosList[n].add(r);
    t.setWorldPosition3D(s[n],e);
    o.broadcastMessage("scene:node-changed",s[n]);
  }
}}updateControllerTransform(){
  let o;
  let r = this.node;
  let s = cc.quat(0,0,0,1);
  o = "center"===n.pivot?e.getCenterWorldPos3D(this.target):t.getWorldPosition3D(r);

  if ("global"!==n.coordinate) {
    s = t.getWorldRotation3D(r);
  }

  this._controller.setPosition(o);
  this._controller.setRotation(s);
}};