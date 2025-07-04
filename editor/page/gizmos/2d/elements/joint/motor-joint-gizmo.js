"use strict";
const e = require("./joint-gizmo");
const t = Editor.require("scene://utils/node");

module.exports = class extends e{createAnchorGroup(){
  let e=this._root.group();
  e.path().plot("\n                M -4 4 L -10 0 L -4 -4\n                L 0 -10 L 4 -4\n                L 10 0 L 4 4\n                L 0 10\n                Z\n            ").fill("none");
  e.circle(5).stroke("none").center(0,0);
  return e;
}createToolGroup(){
  let e = this._root.group();
  let t = e.line().stroke({width:2,color:"#4793e2",opacity:.5});
  let o = e.line().stroke({width:3,color:"#4793e2"});

  e.plot = (r => {if (r.offset) {
    t.plot(r.anchor.x,r.anchor.y,r.offset.x,r.offset.y);
    let n = r.offset.sub(r.anchor).normalizeSelf();
    let s = n.y;
    n.y = -n.x;
    n.x = s;
    n.rotateSelf(r.angularOffset*Math.PI/180);
    let l=n.mul(20);
    o.plot(r.offset.x+l.x,r.offset.y+l.y,r.offset.x-l.x,r.offset.y-l.y);
    e.show();
  } else {
    e.hide()
  }});

  return e;
}createArgs(){
  let e = {};
  let o = this.node;
  let r = o.convertToWorldSpaceAR(this.target.anchor);
  e.anchor = this.worldToPixel(r);
  e.pos = this.worldToPixel(o.convertToWorldSpaceAR(cc.Vec2.ZERO));
  if(this.target.connectedBody){
    let r=this.target.connectedBody.node;
    e.connectedAnchor = e.connectedPos=this.worldToPixel(r.convertToWorldSpaceAR(cc.Vec2.ZERO));
    let n=t.getWorldRotation(this.node);
    e.angularOffset = n+this.target.angularOffset;
    e.offset = this.worldToPixel(o.convertToWorldSpaceAR(cc.v2(this.target.linearOffset.x,this.target.linearOffset.y)));
  }return e
}};