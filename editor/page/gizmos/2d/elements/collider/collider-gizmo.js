"use strict";const t=Editor.require("scene://utils/node");module.exports = class extends Editor.Gizmo{hide(){
  Editor.Gizmo.prototype.hide.call(this);
  this.target.editing = false;
}rectHitTest(i,e){
  if (!this._root) {
    return false;
  }
  let r = this._root.tbox();
  let o = t.getWorldPosition(this.node);
  return!!e&&i.containsRect(cc.rect(o.x-r.width/2,o.y-r.height/2,r.width,r.height))
}createMoveCallbacks(t){
  let i = Editor.Gizmo.prototype.createMoveCallbacks.call(this,t);
  let e = (this._root, this);
  return {start:function(){
    if (e.target.editing) {
      i.start.apply(e,arguments);
    }
  },update:function(){
    if (e.target.editing) {
      i.update.apply(e,arguments);
    }
  },end:function(){
    if (e.target.editing) {
      i.end.apply(e,arguments);
    }
  }};
}dirty(){
  var t=Editor.Gizmo.prototype.dirty.call(this);

  if (this.target.editing) {
    if (!this._targetEditing) {
      this._targetEditing = true;
      this.enterEditing();
      t = true;
    }
  } else {
    if (this._targetEditing) {
      this._targetEditing = false;
      this.leaveEditing();
      t = true;
    }
  }

  return t;
}};