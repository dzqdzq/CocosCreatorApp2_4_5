"use strict";
let e = require("./collider-gizmo");
let t = require("../tools");
let r = {None:0,Side:1,Center:2};

module.exports = class extends e{onCreateMoveCallbacks(){
  let e;
  let t;
  let o;
  let s;
  return {start:(r,i,l,a)=>{
    e = this.target.offset;
    t = this.target.radius;
    o = r;
    s = i;
  },update:(t,i,l,a)=>{if(a===r.Center){
    let r=this.screenToNodeLocalDelta(cc.v2(t,i),this.node);
    r.addSelf(e);
    this.target.offset = r;
    this.adjustValue(this.target,"offset");
  }else{
    let r=this.screenToNodeLocalPos(cc.v2(o+t,s+i),this.node).subSelf(e).mag();
    this.target.radius = r;
    this.adjustValue(this.target,"radius");
  }}};
}onCreateRoot(){
  let e;
  let o;
  let s;
  let i;
  let l;
  let a;
  let n;
  let c = this._root;
  let d = (e,o)=>t.circleTool(e,5,{color:"#7fc97a"},null,this.createMoveCallbacks(r.Side)).style("cursor",o);
  c.dragArea = n=c.circle("0,0,0,0,0,0").fill({color:"rgba(0,128,255,0.2)"}).stroke("none").style("pointer-events","none");
  this.registerMoveSvg(n,r.Center);
  (e=c.circle=t.circleTool(c,0,null,{color:"#7fc97a"},this.createMoveCallbacks(r.Side))).style("pointer-events","none");
  (o=c.sidePointGroup=c.group()).hide();
  s = d(o,"col-resize");
  i = d(o,"row-resize");
  l = d(o,"col-resize");
  a = d(o,"row-resize");

  c.plot = ((t, r) => {
    e.radius(r).center(t.x,t.y);
    n.radius(r).center(t.x,t.y);

    if (this._targetEditing) {
      s.center(t.x-r,t.y);
      i.center(t.x,t.y+r);
      l.center(t.x+r,t.y);
      a.center(t.x,t.y-r);
    }
  });
}onUpdate(){
  let e = this.node;
  let t = this.target.radius;
  let r = this.worldToPixel(e.convertToWorldSpaceAR(this.target.offset));
  let o = this.worldToPixel(e.convertToWorldSpaceAR(cc.v2(0,0)));
  let s = this.worldToPixel(e.convertToWorldSpaceAR(cc.v2(t,0)));
  let i = o.sub(s).mag();
  this._root.plot(r,i)
}enterEditing(){
  let e=this._root;
  e.circle.style("pointer-events","stroke");
  e.dragArea.style("cursor","move");
  e.dragArea.style("pointer-events","fill");
  e.sidePointGroup.show();
}leaveEditing(){
  let e=this._root;
  e.circle.style("pointer-events","none");
  e.dragArea.style("cursor",null);
  e.dragArea.style("pointer-events","none");
  e.sidePointGroup.hide();
}};