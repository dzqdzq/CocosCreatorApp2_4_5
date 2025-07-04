"use strict";const e=require("./joint-gizmo");module.exports = class extends e{createAnchorGroup(){
  let e=this._root.group();
  e.path().plot("\n                M -8 -8 L 0 -7 L 8 -8 L 7 0 L 8 8 L 0 7 L -8 8 L -7 0\n                Z\n            ").fill("none");
  e.rect(5,5).stroke("none").center(0,0);
  return e;
}createToolGroup(){
  let e = this._root.group();
  let t = e.line().stroke({width:2,color:"#4793e2",opacity:.5});
  let o = e.line().stroke({width:2,color:"#4793e2",opacity:.5});
  let r = e.line().stroke({width:2,color:"#4793e2",opacity:.5});

  e.plot = (l => {if (this.target.enableLimit) {
    t.plot(l.lowerPos.x,l.lowerPos.y,l.upperPos.x,l.upperPos.y);
    let s = l.upperPos.sub(l.lowerPos).normalizeSelf();
    let i = s.y;
    s.y = -s.x;
    s.x = i;
    let a=s.mul(10);o.plot(l.lowerPos.x+a.x,l.lowerPos.y+a.y,l.lowerPos.x-a.x,l.lowerPos.y-a.y);let c=s.mul(20);
    r.plot(l.upperPos.x+c.x,l.upperPos.y+c.y,l.upperPos.x-c.x,l.upperPos.y-c.y);
    e.show();
  } else {
    e.hide()
  }});

  return e;
}createArgs(){let t=e.prototype.createArgs.call(this);if(this.target.enableLimit){
  let e=cc.mat4();
  this.node.getWorldMatrix(e);
  e.m[12] = e.m[13]=0;
  let o = cc.v3(this.target.lowerLimit,0);
  let r = cc.v3(this.target.upperLimit,0);
  cc.Vec3.transformMat4(o,o,e);let l=this.getScreenDelta(o);
  l.z = 0;
  let s=l.mag();
  cc.Vec2.transformMat4(r,r,e);
  (l=this.getScreenDelta(r)).z = 0;
  let i = l.mag();
  let a = this.target.localAxisA.normalize();
  a.y *= -1;
  let c = a.mul(s);
  let p = a.mul(i);
  t.lowerPos = t.anchor.add(c);
  t.upperPos = t.anchor.add(p);
}return t}};