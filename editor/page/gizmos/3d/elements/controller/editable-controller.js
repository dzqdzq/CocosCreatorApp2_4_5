"use strict";
let t = require("./controller-base");
let e = require("../utils/controller-utils");
const {create3DNode:i,setMeshColor:o} = require("../../../utils/engine");
const r = require("../../../utils/external").EditorCamera;
let l=cc.v3();

module.exports = class extends t{constructor(t){
  super(t);
  this._editable = false;
  this._edit = false;
  this._editControllerShape = null;
  this._defaultEditCtrlSize = 5;
  this._hoverColor = cc.Color.GREEN;
  this._editCtrlScales = {};
  r._camera.node.on("transform-changed",this.onEditorCameraMoved,this);
}get editable(){return this._editable}set editable(t){this._editable = t;}get edit(){return this._edit}set edit(t){
  if (this._editable) {
    this._edit = t;

    if (true===this._edit) {
      this.initEditController();
      this._editControllerShape.active = true;
    } else {
      this.hideEditController();
    }
  }
}get hoverColor(){return this._hoverColor}set hoverColor(t){this._hoverColor = t;}createEditControllerShape(){
  this._editControllerShape = i("EditControllerShape");
  this._editControllerShape.parent = this.shape;
}setEditCtrlColor(t){
  if (this.editable&&this.edit) {
    Object.keys(this._axisDir).forEach(e=>{let i=this._axisDataMap[e];if(i){let e=i.topNode;o(e,t)}});
  }
}hideEditController(){
  if (this._editControllerShape) {
    this._editControllerShape.active = false;
  }
}createEditController(t,i){
  let o = this._defaultEditCtrlSize;
  let r = e.quad(o,o,i,{unlit:true});
  r.name = t;
  r.parent = this._editControllerShape;
  this._editCtrlScales[t] = cc.v3(1,1,1);
  this.initAxis(r,t);
  this._updateEditController(t);
}initEditController(){
  if (!this._editControllerShape) {
    this.createEditControllerShape();
    Object.keys(this._axisDir).forEach(t=>{this.createEditController(t,this._color)});
  }
}_updateEditController(t){}updateEditControllers(){Object.keys(this._axisDir).forEach(t=>{this._updateEditController(t)})}checkEdit(){
  if (this.editable) {
    this.edit = true;
  } else {
    this.hideEditController();
  }
}onHoverIn(t){this.setAxisColor(t.axisName,this.hoverColor)}onHoverOut(){this.resetAxisColor()}onEditorCameraMoved(){this.adjustEditControllerSize()}adjustEditControllerSize(){
  if (this.edit) {
    Object.keys(this._axisDir).forEach(t=>{let e=this._axisDataMap[t];if(e){
      let t=e.topNode;t.getWorldPosition(l);let i=1;
      i = this.is2D?1/this.scale2D:this.getCameraDistScalar(l);
      this._editCtrlScales[this._axisDir] = i;
      t.setWorldScale(cc.v3(i,i,i));
      let o=cc.quat();
      r._camera.node.getWorldRotation(o);
      t.setWorldRotation(o);
    }});
  }
}setPosition(t){
  super.setPosition(t);

  if (this._editControllerShape) {
    this._editControllerShape.setPosition(t);
  }
}setRotation(t){
  super.setRotation(t);

  if (this._editControllerShape) {
    this._editControllerShape.setRotation(t);
  }
}onShow(){
  if (this._editControllerShape) {
    this._editControllerShape.active = true;
  }
}onHide(){
  if (this._editControllerShape) {
    this._editControllerShape.active = false;
  }
}};