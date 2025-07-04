"use strict";
let e = require("./controller-base");
let t = require("../utils/controller-utils");
const{setMeshColor:i}=require("../../../utils/engine");

module.exports = class extends e{constructor(e){
  super(e);
  this._color = cc.Color.WHITE;
  this.initShape();
}setColor(e){
  i(this._lightDirNode,e);
  this._color = e;
}initShape(){
  this.createShapeNode("DirectionLightController");
  let e = cc.v3(0,0,-1);
  let i = t.arcDirectionLine(cc.v3(),e,cc.v3(1,0,0),this._twoPI,20,100,9,this._color);
  i.parent = this.shape;
  this._lightDirNode = i;
  this.hide();
  this.registerCameraMovedEvent();
}};