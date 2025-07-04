"use strict";
const {Vec3:e,Vec2:t} = cc.math;
const i = require("../../../utils/external");
const s = (i.NodeUtils, i.EditorCamera);
const o = require("../utils/controller-utils");
const r = require("../utils/controller-shape-collider");
const {setNodeOpacity:n,create3DNode:a,setMeshColor:h,getModel:l,getMeshColor:c,getNodeOpacity:d} = require("../../../utils/engine");
let u=require("../../../utils/transform-tool-data");const p=require("../../../utils");let g=cc.v3();

module.exports = class{constructor(e){
  this._position = cc.v3(0,0,0);
  this._rotation = cc.quat(0,0,0,1);
  this._scale = cc.v3(1,1,1);
  this._updated = false;
  this.shape = null;
  this._rootNode = e;
  this._baseDist = 600;
  this._axisDataMap = {};
  this._axisDir = {};
  this._axisDir.x = cc.v3(1,0,0);
  this._axisDir.y = cc.v3(0,1,0);
  this._axisDir.z = cc.v3(0,0,1);
  this._twoPI = 2*Math.PI;
  this._halfPI = Math.PI/2;
  this._degreeToRadianFactor = Math.PI/180;
}get is2D(){return u.is2D}get scale2D(){return u.scale2D}createShapeNode(e){
  this.shape = a(e);
  this.shape.parent = this._rootNode;
}registerSizeChangeEvents(){
  this.registerCameraMovedEvent();
  u.on("dimension-changed",this.onDimensionChanged.bind(this));
  u.on("scale2D-changed",this.onScale2DChanged.bind(this));
}registerCameraMovedEvent(){s._camera.node.on("transform-changed",this.onEditorCameraMoved,this)}onEditorCameraMoved(){this.adjustControllerSize()}initAxis(e,t){
  let i={};
  i.topNode = e;
  i.rendererNodes = this.getRendererNodes(e);
  let s = [];
  let o = [];

  i.rendererNodes.forEach(e=>{
    let t=c(e);
    s.push(new cc.Color(t.r,t.g,t.b));
    o.push(d(e));
  });

  i.oriColors = s;
  i.oriOpacitys = o;
  this._axisDataMap[t] = i;
  this.getRayDetectNodes(e).forEach(e=>{this.registerMouseEvents(e,t)});

  if (this.onInitAxis) {
    this.onInitAxis(e,t);
  }
}setAxisColor(e,t,i=255){
  let s=this._axisDataMap[e].rendererNodes;

  if (null!=s) {
    s.forEach(e=>{
      h(e,t);
      n(e,i);
    });
  }
}resetAxisColor(){for(let e in this._axisDataMap)if(e){
  let t = this._axisDataMap[e];
  let i = t.rendererNodes;
  let s = t.oriColors;
  let o = t.oriOpacitys;
  for(let e=0;e<i.length;e++){
    let t=i[e];
    h(t,s[e]);
    n(t,o[e]);
  }
}}registerMouseEvents(e,t){
  e.on("mouseDown",function(i){
    i.axisName = t;
    i.node = e;
    this._updated = false;

    if (this.onMouseDown) {
      this.onMouseDown(i);
    }

    i.stopPropagation();
  }.bind(this));

  e.on("mouseMove",function(i){
    this._updated = true;
    i.axisName = t;
    i.node = e;

    if (this.onMouseMove) {
      this.onMouseMove(i);
    }

    i.stopPropagation();
    p.repaintEngine();
  }.bind(this));

  e.on("mouseUp",function(i){
    i.axisName = t;
    i.node = e;

    if (this.onMouseUp) {
      this.onMouseUp(i);
    }

    i.stopPropagation();
    this._updated = false;
  }.bind(this));

  e.on("mouseLeave",function(e){
    if (this.onMouseLeave) {
      this.onMouseLeave(e);
    }

    e.stopPropagation();
    this._updated = false;
  }.bind(this));

  e.on("hoverIn",function(i){
    i.axisName = t;
    i.node = e;

    if (this.onHoverIn) {
      this.onHoverIn(i);
    }

    i.stopPropagation();
    p.repaintEngine();
  }.bind(this));

  e.on("hoverOut",function(i){
    i.axisName = t;
    i.node = e;

    if (this.onHoverOut) {
      this.onHoverOut(i);
    }

    i.stopPropagation();
    p.repaintEngine();
  }.bind(this));
}get updated(){return this._updated}setPosition(e){
  if (e instanceof cc.Vec3) {
    this._position = e;
  } else {
    this._position = cc.v3(e.x,e.y,0);
  }

  this.shape.setPosition(this._position);
  this.updateController();
}getPosition(){return this._position}setRotation(e){
  this._rotation = e;
  this.shape.setRotation(this._rotation);
  this.updateController();
}getScale(){return this._scale}setScale(e){
  this._scale = e;
  this.updateController();
}updateController(){this.adjustControllerSize()}getCameraDistScalar(e){let t=s._camera.node;return o.getCameraDistanceFactor(e,t)/this._baseDist}getDistScalar(){let e=1;return e=this.is2D?1/this.scale2D:this.getCameraDistScalar(this._position)}adjustControllerSize(){let e=this.getDistScalar();this.shape.setScale(this._scale.mul(e))}needRender(e){let t=e.getComponent(r);return !t||false!==t.isRender;}getRendererNodes(e){
  let t=[];

  if (l(e)&&this.needRender(e)) {
    t.push(e);
  }

  for(let i=0;i<e.childrenCount;i++){let s=e._children[i];t = t.concat(this.getRendererNodes(s));}return t
}getRayDetectNodes(e){
  let t=[];

  if (l(e)) {
    t.push(e);
  }

  for(let i=0;i<e.childrenCount;i++){let s=e._children[i];t = t.concat(this.getRayDetectNodes(s));}return t
}localToWorldPosition(t){
  let i = cc.mat4();
  let s = cc.v3();
  this.shape.getWorldMatrix(i);
  e.transformMat4(s,t,i);
  return s;
}localToWorldDir(t){
  let i = cc.mat4();
  let s = cc.v3();
  this.shape.getWorldMatrix(i);
  e.transformMat4Normal(s,t,i);
  e.normalize(s,s);
  return s;
}worldPosToScreenPos(e){
  let t = s._camera._camera;
  let i = cc.v2();
  t.worldToScreen(i,e,cc.visibleRect.width,cc.visibleRect.height);
  return i;
}getScreenPos(e){return this.worldPosToScreenPos(this.localToWorldPosition(e))}getAlignAxisMoveDistance(i,s){
  let o = e.add(g,this._position,i);
  let r = this.worldPosToScreenPos(o);
  let n = this.worldPosToScreenPos(this._position);
  t.sub(r,r,n);
  t.normalize(r,r);
  return t.dot(s,r);
}show(){
  this.shape.active = true;

  if (this.onShow) {
    this.onShow();
  }
}hide(){
  this.shape.active = false;

  if (this.onHide) {
    this.onHide();
  }
}get visible(){return this.shape.active}onDimensionChanged(){
  if (this.visible) {
    this.show();
  }
}onScale2DChanged(){
  if (this.visible) {
    this.adjustControllerSize();
  }
}};