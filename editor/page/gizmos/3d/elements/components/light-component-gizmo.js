"use strict";
const t = require("../../../utils");
const e = require("../../../utils/external");
const o = e.NodeUtils;
let i = require("../controller/direction-light-controller");
let r = require("../controller/sphere-controller");
let s = require("../controller/cone-controller");
let l = require("../gizmo-base");
require("../utils/controller-utils");
const {create3DNode:n,getLightData:h,setLightData:a} = require("../../../utils/engine");
const g = e.EditorMath;

module.exports = class extends l{init(){
  this.Direction = 0;
  this.Point = 1;
  this.Spot = 2;
  this._curLightType = 0;
  this._pointLightRange = 0;
  this._spotAngle = 0;
  this._spotLightHeight = 0;
  this._lightGizmoColor = new cc.Color(255,255,50);
  this._lightCtrlHoverColor = new cc.Color(0,255,0);
  this.createController();
  this._isInited = true;
}onShow(){this.updateControllerData()}onHide(){
  this._activeController.hide();let t=this.nodes;
  this.unRegisterNodeEvents(t,this.onNodeChanged,this);
  this.unRegisterTransformEvent(t,this.onNodeTransformChanged,this);
}createController(){
  let t = this.getGizmoRoot();
  let e = n("LightGizmo");
  e.parent = t;
  this._lightController = [];
  this._lightController[this.Direction] = new i(e);
  this._lightController[this.Direction].setColor(this._lightGizmoColor);
  let o=new r(e);
  o.setColor(this._lightGizmoColor);
  this._lightController[this.Point] = o;
  o.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  o.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  o.onControllerMouseUp = this.onControllerMouseUp.bind(this);
  o.editable = true;
  o.hoverColor = this._lightCtrlHoverColor;
  let l=new s(e);
  this._lightController[this.Spot] = l;
  l.setColor(this._lightGizmoColor);
  l.onControllerMouseDown = this.onControllerMouseDown.bind(this);
  l.onControllerMouseMove = this.onControllerMouseMove.bind(this);
  l.onControllerMouseUp = this.onControllerMouseUp.bind(this);
  l.editable = true;
  l.hoverColor = this._lightCtrlHoverColor;
  this._activeController = this._lightController[2];
}onControllerMouseDown(){if (!this._isInited||null==this.target) {
  return;
}let t=h(this.target);switch(this._curLightType){case this.Direction:break;case this.Point:this._pointLightRange = t.range;break;case this.Spot:
  this._spotLightHeight = t.range;
  this._spotAngle = t.spotAngle;}}onControllerMouseMove(){
  this.updateDataFromController();
  this.updateControllerData();
}onControllerMouseUp(){}updateDataFromController(){if(this._activeController.updated){let e=this.node;switch(this._curLightType){case this.Direction:break;case this.Point:
  let t = this._activeController.getDeltaRadius();
  let e = this._pointLightRange+t;
  e = g.toPrecision(e,3);
  e = Math.abs(e);
  a(this.target,{range:e});
  break;case this.Spot:
  let o = this._activeController.getDeltaRadius();
  let i = this._activeController.getDeltaHeight();
  let r = this._spotLightHeight;

  if (0!==i) {
    r = this._spotLightHeight+i;
    r = g.toPrecision(r,3);

    if ((r=Math.abs(r))<.01) {
      r = .01;
    }
  }

  let s = this.getConeRadius(this._spotAngle,r);
  let l = this._spotAngle;

  if (0!==o) {
    s = this.getConeRadius(this._spotAngle,r)+o;
    s = Math.abs(s);

    if ((l=2*Math.atan2(s,r))<g.D2R) {
      l = g.D2R;
    }

    l *= g.R2D;
    l = g.toPrecision(l,3);
  }

  a(this.target,{spotAngle:l,range:r});}t.broadcastMessage("scene:node-changed",e)}}updateControllerTransform(){
  let t = this.node;
  let e = cc.quat(0,0,0,1);
  let i = o.getWorldPosition3D(t);

  if (this._curLightType!==this.Point) {
    e = o.getWorldRotation3D(t);
  }

  this._activeController.setPosition(i);
  this._activeController.setRotation(e);
}getConeRadius(t,e){return Math.tan(t/2*g.D2R)*e}updateControllerData(){if (!this._isInited||null==this.target) {
  return;
}let t=h(this.target);if(t){
  if (this._activeController) {
    this._activeController.hide();
  }

  this._curLightType = t.type;
  if (this._curLightType>=this._lightController.length) {
    return;
  }switch(this._activeController=this._lightController[this._curLightType],this._curLightType){case this.Direction:break;case this.Point:
    this._activeController.checkEdit();
    this._activeController.radius = t.range;
    break;case this.Spot:this._activeController.checkEdit();let e=this.getConeRadius(t.spotAngle,t.range);this._activeController.updateSize(cc.v3(),e,t.range)}
  this._activeController.show();
  this.updateControllerTransform();
}}onTargetUpdate(){this.updateControllerData()}onNodeChanged(){this.updateControllerData()}};