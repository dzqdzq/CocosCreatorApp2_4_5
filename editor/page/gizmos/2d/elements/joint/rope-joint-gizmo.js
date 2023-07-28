"use strict";
const e = require("../tools");
const t = require("./joint-gizmo");

module.exports = class extends t{createAnchorGroup(){
  let e=this._root.group();
  e.circle(15).fill("none").center(0,0);
  e.circle(5).stroke("none").center(0,0);
  return e;
}createToolGroup(){
  let t = this._root.group();
  let c = t.line().stroke({width:4,color:"#4793e2",opacity:.5});
  let o = t.line().stroke({width:3,color:"#00cccc",opacity:.5});
  let r = t.circle(6).fill({color:"#cccc00",opacity:.5});

  t.plot = (n => {
    if (n.distance) {
      c.plot(n.anchor.x,n.anchor.y,n.connectedAnchor.x,n.connectedAnchor.y);
      o.plot(n.anchor.x,n.anchor.y,n.distance.x,n.distance.y);
      o.style("stroke-dasharray",e.dashLength([5,3]));
      r.center(n.distance.x,n.distance.y);
      t.show();
    } else {
      t.hide();
    }
  });

  return t;
}createArgs(){let e=t.prototype.createArgs.call(this);if(this.target.connectedBody){
  let t=cc.mat4();
  this.node.getWorldMatrix(t);
  t.m[12] = t.m[13]=0;
  let c=cc.v3(this.target.maxLength,0,0);cc.Vec3.transformMat4(c,c,t);let o=this.getScreenDelta(c);
  o.z = 0;
  let r = o.mag();
  let n = cc.v2(e.connectedAnchor.x-e.anchor.x,e.connectedAnchor.y-e.anchor.y);
  e.distance = n.normalizeSelf().mulSelf(r).addSelf(e.anchor);
}return e}};