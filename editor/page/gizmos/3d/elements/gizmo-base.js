"use strict";let e=require("../../utils");cc.mat4();module.exports = class{constructor(e){
  this.hovering = false;
  this.selecting = false;
  this.editing = false;
  this._isInited = false;
  this._hidden = true;
  this.target = e;
}get target(){return this._target}set target(e){
  let t=this.nodes;

  if (t&&t.length>0) {
    this.unRegisterTransformEvent(this.nodes);
    this.unRegisterNodeEvents(this.nodes);
  }

  this._target = e;

  if ((t=this.nodes)&&t.length>0) {
    this.registerTransformEvent(this.nodes);
    this.registerNodeEvents(this.nodes);

    if (this.onTargetUpdate) {
      this.onTargetUpdate();
    }
  } else {
    this.hide();
  }
}layer(){return"scene"}getGizmoRoot(){
  if (!this._rootNode) {
    this._rootNode = e.getGizmoRoot();
  }

  return this._rootNode;
}recordChanges(){
  if (!this._recorded) {
    e.recordChanges(this.nodes);
    this._recorded = true;
  }
}commitChanges(){
  this._recorded = false;
  e.commitChanges(this.nodes);
}_checkLockStatus(){return this.node._objFlags&cc.Object.Flags.LockedInEditor}targetValid(){
  let e=this.target;

  if (Array.isArray(e)) {
    e = e[0];
  }

  return e&&e.isValid;
}visible(){return!this._hidden}hide(){
  if (!this._hidden) {
    if (this.onHide) {
      this.onHide();
    }

    this._hidden = true;
  }
}show(){
  if (this._hidden) {
    if (!this._isInited) {
      if (this.init) {
        this.init();
      }

      this._isInited = true;
    }

    if (this.onShow) {
      this.onShow();
    }

    this._hidden = false;
  }
}onNodeTransformChanged(){
  if (this.updateControllerTransform) {
    this.updateControllerTransform();
  }
}registerTransformEvent(e){if (this.onNodeTransformChanged) {
  for (let t=0; t<e.length; t++) {
    e[t].on("transform-changed",this.onNodeTransformChanged,this)
  }
}}unRegisterTransformEvent(e){if (this.onNodeTransformChanged) {
  for (let t=0; t<e.length; t++) {
    e[t].off("transform-changed",this.onNodeTransformChanged,this)
  }
}}registerNodeEvents(e){if (this.onNodeChanged) {
  for (let t=0; t<e.length; t++) {
    e[t].on("change",this.onNodeChanged,this)
  }
}}unRegisterNodeEvents(e){if (this.onNodeChanged) {
  for (let t=0; t<e.length; t++) {
    e[t].off("change",this.onNodeChanged,this)
  }
}}get node(){
  let e=this.target;

  if (Array.isArray(e)) {
    e = e[0];
  }

  return cc.Node.isNode(e)?e:e instanceof cc.Component?e.node:null;
}get nodes(){
  let e = [];
  let t = this.target;
  if (Array.isArray(t)) {
    for(let s=0;s<t.length;++s){
      let i=t[s];

      if (cc.Node.isNode(i)) {
        e.push(i);
      } else {
        if (i instanceof cc.Component) {
          e.push(i.node);
        }
      }
    }
  } else {
    if (cc.Node.isNode(t)) {
      e.push(t);
    } else {
      if (t instanceof cc.Component) {
        e.push(t.node);
      }
    }
  }return e
}get topNodes(){return this.target.filter(e=>{let t=e.parent;for(;t;){if (-1!==this.target.indexOf(t)) {
  return false;
}t = t.parent;}return true;});}get selecting(){return this._selecting}set selecting(e){this._selecting = e;}get editing(){return this._editing}set editing(e){this._editing = e;}get hovering(){return this._hovering}set hovering(e){this._hovering = e;}};