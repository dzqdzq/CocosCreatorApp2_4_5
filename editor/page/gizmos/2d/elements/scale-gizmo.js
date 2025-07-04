"use strict";
const t = require("./tools");
const e = Editor.require("scene://utils/node");

module.exports = class extends Editor.Gizmo{init(){}layer(){return"foreground"}onCreateMoveCallbacks(){
  let t;
  let o = [];
  let i = [];
  return {start:()=>{o = [];let s=this.topNodes;for(let t=0;t<s.length;++t){let e=s[t];o.push(cc.v2(e.scaleX,e.scaleY))}if("center"===this._view.pivot){
    t = Editor.GizmosUtils.getCenter(this.target);
    i.length = 0;
    for(let o=0;o<s.length;++o){let r=e.getScenePosition(s[o]);i.push(r.sub(t))}
  }},update:(s,r)=>{
    let l;
    let n = cc.v2(1+s,1+r);
    let h = this.topNodes;
    if("center"===this._view.pivot){for(l=0;l<o.length;++l){h[l].setScale(o[l].x*n.x,o[l].y*n.y);let s=cc.v2(i[l].x*n.x,i[l].y*n.y);e.setScenePosition(h[l],t.add(s))}this.adjustValue(h,["x","y","scaleX","scaleY"],2)}else{for (l=0; l<o.length; ++l) {
      h[l].setScale(o[l].x*n.x,o[l].y*n.y);
    }this.adjustValue(h,["scaleX","scaleY"],2)}
  }};
}onCreateRoot(){this._tool = t.scaleTool(this._root,this.createMoveCallbacks());}onKeyDown(t){
  if (!this.target) {
    return;
  }let e=Editor.KeyCode(t.which);if ("left"!==e&&"right"!==e&&"up"!==e&&"down"!==e) {
    return;
  }
  let o = t.shiftKey?1:.1;
  let i = cc.v2();

  if ("left"===e) {
    i.x = -1*o;
  } else {
    if ("right"===e) {
      i.x = o;
    } else {
      if ("up"===e) {
        i.y = o;
      } else {
        if ("down"===e) {
          i.y = -1*o;
        }
      }
    }
  }

  this.recordChanges();

  this.topNodes.forEach(function(t){
    t.scaleX = Editor.Math.toPrecision(t.scaleX+i.x,3);
    t.scaleY = Editor.Math.toPrecision(t.scaleY+i.y,3);
  });

  this._view.repaintHost();
}onKeyUp(t){
  if (!this.target) {
    return;
  }let e=Editor.KeyCode(t.which);

  if (!("left"!==e&&"right"!==e&&"up"!==e && "down"!==e)) {
    this.commitChanges();
  }
}visible(){return true;}dirty(){return true;}onUpdate(){
  let t;
  let o;
  let i;
  let s = this.node;

  if ("center"===this._view.pivot) {
    t = Editor.GizmosUtils.getCenter(this.target);
    o = this.sceneToPixel(t);
    i = 0;
  } else {
    t = e.getScenePosition(s);
    o = this.sceneToPixel(t);
    i = e.getSceneRotation(s);
  }

  this._tool.position = o;
  this._tool.rotation = i;
  this._tool.translate(this._tool.position.x,this._tool.position.y).rotate(this._tool.rotation,0,0);
}};