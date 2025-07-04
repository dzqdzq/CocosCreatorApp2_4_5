"use strict";
const t = require("./tools");
const i = Editor.require("scene://utils/node");

module.exports = class extends Editor.Gizmo{init(){this._style = "";}url(){return""}onCreateRoot(){this._icon = t.icon(this._root,this.url(),40,40,this.node);}visible(){return true;}onUpdate(){
  let t="";

  if (this.editing||this.selecting) {
    t = "editing";
  } else {
    if (this.hovering) {
      t = "hovering";
    }
  }

  if (t!==this._style) {
    if (""===t) {
      this._icon.unfilter();
    } else {
      if ("editing"===t) {
        this._icon.filter(function(t){t.componentTransfer({rgb:{type:"linear",slope:.2}})});
      } else {
        if ("hovering"===t) {
          this._icon.filter(function(t){t.componentTransfer({rgb:{type:"linear",slope:.4}})});
        }
      }
    }

    this._style = t;
  }

  let e = Editor.Math.clamp(this._view.scale,.5,2);
  let n = i.getScenePosition(this.node);
  let s = this.sceneToPixel(n);
  this._icon.scale(e,e).translate(s.x,s.y)
}rectHitTest(t,e){
  let n = this._icon.tbox();
  let s = i.getWorldPosition(this.node);
  return e?t.containsRect(cc.rect(s.x-n.width/2,s.y-n.height/2,n.width,n.height)):t.intersects(cc.rect(s.x-n.width/2,s.y-n.height/2,n.width,n.height))
}};