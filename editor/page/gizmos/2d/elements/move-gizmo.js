"use strict";
const t = require("./tools");
const o = Editor.require("scene://utils/node");

module.exports = class extends Editor.Gizmo{init(){}layer(){return"foreground"}onCreateMoveCallbacks(){let t=[];return {start:()=>{t.length = 0;let e=this.topNodes;for (let i=0; i<e.length; ++i) {
  t.push(o.getWorldPosition(e[i]))
}},update:(e,i)=>{
  let s = new cc.Vec2(e,i);
  let r = this.topNodes;
  for (let e=0; e<t.length; ++e) {
    o.setWorldPosition(r[e],t[e].add(s));
  }this.adjustValue(r,["x","y"])
}};}onCreateRoot(){this._tool = t.positionTool(this._root,this.createMoveCallbacks());}visible(){return true;}dirty(){return true;}onUpdate(){
  let t;
  let e;
  let i;
  let s = this.node;

  if ("center"===this._view.pivot) {
    t = Editor.GizmosUtils.getCenter(this.target);
    e = this.sceneToPixel(t);
    i = 0;
  } else {
    t = o.getScenePosition(s);
    e = this.sceneToPixel(t);
    i = 0;

    if ("global"!==this._view.coordinate) {
      i = -o.getSceneRotation(s);
    }
  }

  this._tool.position = e;
  this._tool.rotation = i;
  this._tool.translate(this._tool.position.x,this._tool.position.y).rotate(this._tool.rotation,0,0);
}onKeyDown(t){
  if (!this.target) {
    return;
  }let o=Editor.KeyCode(t.which);if ("left"!==o&&"right"!==o&&"up"!==o&&"down"!==o) {
    return;
  }
  let e = t.shiftKey?10:1;
  let i = cc.v2();

  if ("left"===o) {
    i.x = -e;
  } else {
    if ("right"===o) {
      i.x = e;
    } else {
      if ("up"===o) {
        i.y = e;
      } else {
        if ("down"===o) {
          i.y = -e;
        }
      }
    }
  }

  this.recordChanges();
  this.topNodes.forEach(t=>{t.position = t.position.add(i);});
  this._view.repaintHost();
}onKeyUp(t){
  if (!this.target) {
    return;
  }let o=Editor.KeyCode(t.which);

  if (!("left"!==o&&"right"!==o&&"up"!==o && "down"!==o)) {
    this.commitChanges();
  }
}};