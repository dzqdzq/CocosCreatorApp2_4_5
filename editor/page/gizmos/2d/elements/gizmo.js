"use strict";
const t = Editor.require("scene://utils/node");
const e = Editor.require("scene://utils/animation");
const i = require("../../utils/external").EditorCamera;
let r = require("./tools").rectTool.Type;
let s = Editor.GizmosUtils.snapPixelWihVec2;
let o = 1e-6;
const{Vec3:n,Mat4:a}=cc.math;
let l = cc.mat4();
let h = cc.v3();
function c(t,e){return Math.abs(t-e)<o}

module.exports = class{constructor(t,e){
  this.hovering = false;
  this.selecting = false;
  this.editing = false;
  this._view = t;
  this._root = null;
  this._hidden = true;
  this._controller = null;
  this._adjustMap = [];
  this.registerAdjustValue(cc.Vec2,["x","y"]);
  this.registerAdjustValue(cc.Vec3,["x","y","z"]);
  this.registerAdjustValue(cc.Size,["width","height"]);
  this._dirty = true;
  this._lastMats = {};
  this._isInited = false;
  this.target = e;
}get target(){return this._target}set target(t){
  this._target = t;

  if (!(null==this.target || this.target.length<=0)) {
    if (this.onTargetUpdate) {
      this.onTargetUpdate();
    }
  }
}layer(){return"scene"}createRoot(){
  let t=this._view[this.layer()];if (!t) {
    Editor.warn(`Plase make gizmo layer exists [${this.layer()}] in Gizmo View`);
    return;
  }
  this._root = t.group();
  this._registerEvent();

  if (this.onCreateRoot) {
    this.onCreateRoot();
  }
}ensureController(){
  if (!this._controller) {
    this.createController();
  }
}createController(){
  if (this.onCreateController) {
    this.onCreateController();
  }
}registerMoveSvg(t,e,i){
  if (i) {
    Editor.GizmosUtils.addMoveHandles(t,i,this.createMoveCallbacks(e));
  } else {
    Editor.GizmosUtils.addMoveHandles(t,this.createMoveCallbacks(e));
  }
}createMoveCallbacks(t){
  if (!this._moveCallbacks) {
    this._moveCallbacks = this.onCreateMoveCallbacks();
  }

  let e = this._moveCallbacks;
  let i = false;
  return {start:function(r,s,o){
    i = false;
    s = cc.view.getCanvasSize().height-s;
    let n=Array.prototype.slice.call(arguments,2,arguments.length);
    n = [r,s].concat(n);
    n = void 0!==t?n.concat(t):n;

    if (e.start) {
      e.start.apply(this,n);
    }
  }.bind(this),update:function(r,s,o){
    if (0===r&&0===s) {
      return;
    }
    i = true;
    s = -s;
    this.recordChanges();
    let n=Array.prototype.slice.call(arguments,2,arguments.length);
    n = [r,s].concat(n);
    n = void 0!==t?n.concat(t):n;

    if (e.update) {
      e.update.apply(this,n);
    }

    this._view.repaintHost();
  }.bind(this),end:function(r){
    let s=Array.prototype.slice.call(arguments,0,arguments.length);
    s = void 0!==t?s.concat(t):s;

    if (e.end) {
      e.end.apply(this,s);
    }

    if (i) {
      this.commitChanges();
    }

    i = false;
  }.bind(this)};
}onCreateMoveCallbacks(){return{start(t,e,i){},update(t,e,i){},end(t){}}}recordChanges(){
  this.nodes.forEach(t=>{_Scene.Undo.recordNode(t.uuid)});
  this._dirty = true;
}commitChanges(){
  e.recordNodeChanged(this.nodes);
  _Scene.Undo.commit();
  this._dirty = true;
}worldToPixel(t){return s(this._view.worldToPixel(t))}pixelToWorld(t){return this._view.pixelToWorld(t)}sceneToPixel(t){return s(this._view.sceneToPixel(t))}pixelToScene(t){return this._view.pixelToScene(t)}defaultMinDifference(){return Editor.Math.numOfDecimalsF(1/this._view.scale)}registerAdjustValue(t,e){this._adjustMap.push({ctor:t,keys:e})}_checkLockStatus(){return this.node._objFlags&cc.Object.Flags.LockedInEditor}adjustValue(t,e,i){
  if (!Array.isArray(t)) {
    t = [t];
  }

  if (!(void 0===e || Array.isArray(e))) {
    e = [e];
  }

  i = i||this.defaultMinDifference();
  let r=(t,e)=>{if (e&&"number"==typeof t[e]) {
    t[e] = Editor.Math.toPrecision(t[e],i);
    return;
  }{
    let i = e?t[e]:t;
    let s = this._adjustMap;
    for(let t=0;t<s.length;t++){let e=s[t];if(i===e.ctor||i.constructor===e.ctor){for (let t=0; t<e.keys.length; t++) {
      r(i,e.keys[t]);
    }return}}
  }Editor.warn(`Try to adjust non-number value [${e}}]`)};for(let i=0;i<t.length;i++){let s=t[i];if (void 0===e) {
    r(s);
  } else {
    for (let t=0; t<e.length; t++) {
      r(s,e[t])
    }
  }}
}targetValid(){
  let t=this.target;

  if (Array.isArray(t)) {
    t = t[0];
  }

  return t&&t.isValid;
}visible(){return this.selecting||this.editing}_viewDirty(){
  let e = cc.director.getScene();
  let i = t.getWorldPosition(e);
  let r = this._view.worldToPixel(i);
  let s = false;

  if (!(this._lastMapping&&c(this._lastMapping.x,r.x) && c(this._lastMapping.y,r.y))) {
    s = true;
  }

  this._lastMapping = r;
  return s;
}_nodeDirty(t){
  (t=t||this.node).getWorldMatrix(l);
  let e = false;
  let i = this._lastMats[t.uuid];

  if (i) {
    if (!(c(i.a,l.a)&&c(i.b,l.b)&&c(i.c,l.c)&&c(i.d,l.d)&&c(i.tx,l.tx) && c(i.ty,l.ty))) {
      e = true;
    }
  } else {
    this._lastMats[t.uuid] = i=cc.mat4();
    e = true;
  }

  a.copy(i,l);
  return e;
}dirty(){return this._viewDirty()||this._nodeDirty()||this._dirty}update(){
  if (!this.targetValid()||!this.visible()||this._checkLockStatus()) {
    this.hide();
    return;
  }
  this.show();
  if (!this.dirty()) {
    return;
  }let t=cc.director&&cc.director.getScene();

  if (this.onUpdate&&t) {
    this.onUpdate();
  }

  this._dirty = false;
}remove(){
  if (this._root) {
    this._root.remove();
    this._root = null;
  }
}ensureRoot(){
  if (!this._root) {
    this.createRoot();
  }
}hide(){
  if (!this._hidden) {
    if (this._root) {
      this._root.hide();
    }

    if (this.onHide) {
      this.onHide();
    }

    this._hidden = true;
    this._dirty = true;
  }
}show(){
  if (this._hidden) {
    if (!this._isInited) {
      if (this.init) {
        this.init();
      }

      this._isInited = true;
    }

    this.ensureRoot();

    if (this._root) {
      this._root.show();
    }

    if (this.onShow) {
      this.onShow();
    }

    this._hidden = false;
    this._dirty = true;
  }
}rectHitTest(t,e){return false;}_registerEvent(){
  let t=this._root.node;
  t.addEventListener("mousedown",()=>{let t=this.nodes.map(t=>t.uuid);Editor.Selection.select("node",t)},true);
  t.addEventListener("mouseover",()=>{Editor.Selection.hover("node",this.node.uuid)},true);
  t.addEventListener("mouseleave",()=>{Editor.Selection.hover("node",null)},true);

  t.addEventListener("mousemove",t=>{
    if (!t.srcElement.instance.ignoreMouseMove) {
      t.stopPropagation();
    }
  });
}get node(){
  let t=this.target;

  if (Array.isArray(t)) {
    t = t[0];
  }

  return cc.Node.isNode(t)?t:t instanceof cc.Component?t.node:null;
}get nodes(){
  let t = [];
  let e = this.target;
  if (Array.isArray(e)) {
    for(let i=0;i<e.length;++i){
      let r=e[i];

      if (cc.Node.isNode(r)) {
        t.push(r);
      } else {
        if (r instanceof cc.Component) {
          t.push(r.node);
        }
      }
    }
  } else {
    if (cc.Node.isNode(e)) {
      t.push(e);
    } else {
      if (e instanceof cc.Component) {
        t.push(e.node);
      }
    }
  }return t
}get topNodes(){return this.target.filter(t=>{let e=t.parent;for(;e;){if (-1!==this.target.indexOf(e)) {
  return false;
}e = e.parent;}return true;});}get selecting(){return this._selecting}set selecting(t){
  this._dirty = t!==this._selecting;
  this._selecting = t;
}get editing(){return this._editing}set editing(t){
  this._dirty = t!==this._editing;
  this._editing = t;
}get hovering(){return this._hovering}set hovering(t){
  this._dirty = t!==this._hovering;
  this._hovering = t;
}screenToWorld(t){
  let e = i._camera._camera;
  let r = cc.v3();
  n.set(h,t.x,t.y,1);
  e.screenToWorld(r,h,cc.visibleRect.width,cc.visibleRect.height);
  return r;
}worldToScreen(t){
  let e = i._camera._camera;
  let r = cc.v3();
  e.worldToScreen(r,t,cc.visibleRect.width,cc.visibleRect.height);
  return r;
}getWorldDelta(t){
  let e = this.screenToWorld(cc.Vec2.ZERO);
  let i = this.screenToWorld(t);
  i.subSelf(e);
  return i;
}getScreenDelta(t){
  let e = this.worldToScreen(n.ZERO);
  let i = this.worldToScreen(t);
  i.subSelf(e);
  return i;
}screenToNodeLocalDelta(t,e){
  let i=this.getWorldDelta(t);

  if (e) {
    e.getWorldMatrix(l);
    a.invert(l,l);
    l.m[12] = l.m[13]=0;
    n.transformMat4(i,i,l);
  }

  return cc.v2(i.x,i.y);
}screenToNodeLocalPos(t,e){
  let i=this.screenToWorld(t);

  if (e) {
    e.getWorldMatrix(l);
    a.invert(l,l);
    n.transformMat4(i,i,l);
  }

  return cc.v2(i.x,i.y);
}getLocalAxisAlignDelta(t,e,i){
  let s=cc.quat();i.getWorldRotation(s);
  let o = cc.v3(e.x,e.y,0);
  let a = cc.v2();

  if (t===r.Left||t===r.Right) {
    n.transformQuat(h,n.RIGHT,s);
    a.x = o.dot(h);
  } else {
    if (t===r.Top||t===r.Bottom) {
      n.transformQuat(h,n.UP,s);
      a.y = o.dot(h);
    } else {
      if (!(t!==r.LeftTop&&t!==r.LeftBottom&&t!==r.RightTop && t!==r.RightBottom)) {
        n.transformQuat(h,n.RIGHT,s);
        a.x = o.dot(h);
        n.transformQuat(h,n.UP,s);
        a.y = o.dot(h);
      }
    }
  }

  return a;
}};