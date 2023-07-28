"use strict";module.exports = class{constructor(){
  this.eye = cc.v3();
  this.rotation = cc.quat();
}init(t){
  if (!this._init) {
    this._init = true;
    this.tool = t;
    this.node = t._camera.node;
    this._initInnerNode();
  }
}updateCamera(){this.tool.update()}setActive(t){}_initInnerNode(){}};