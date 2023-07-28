"use strict";
const e = require("./joint-gizmo");
const t = Editor.require("scene://utils/node");

module.exports = class extends e{createAnchorGroup(){
  let e=this._root.group();
  e.path().plot("\n                M -6 -8 A 10 10, 0, 1, 0, 6 -8 L 6 -8\n                M -6 -2 L -6 -8 L -12 -8\n                M 6 -2 L 6 -8 L 12 -8\n            ").fill("none");
  e.circle(5).stroke("none").center(0,0);
  return e;
}createToolGroup(){
  let e=this._root.group();e.style("pointer-events","none");
  let t = e.line().stroke({width:2,color:"#4793e2"});
  let o = e.line().stroke({width:2,color:"#4793e2"});
  let r = e.circle(5).fill({color:"#4793e2"});
  let l = e.circle(5).fill({color:"#4793e2"});
  let n = e.path().fill({color:"#4793e2",opacity:.5});

  e.plot = (i => {if (this.target.enableLimit) {
    let s = i.lowerAngle*Math.PI/180;
    let c = i.upperAngle*Math.PI/180;
    let a = i.anchor.x;
    let h = i.anchor.y;
    let p = a+20*Math.cos(s);
    let g = h+20*Math.sin(s);
    let u = a+30*Math.cos(c);
    let M = h+30*Math.sin(c);
    o.plot(p,g,a,h);
    t.plot(u,M,a,h);
    l.center(p,g);
    r.center(u,M);
    let A = a+15*Math.cos(s);
    let d = h+15*Math.sin(s);
    let L = a+15*Math.cos(c);
    let w = h+15*Math.sin(c);
    let $ = (i.upperAngle-i.lowerAngle)%360>180?1:0;
    n.plot(`\n                    M ${A} ${d} A 15 15 0 ${$} 1 ${L} ${w}\n                    L ${a} ${h}\n                    Z\n                `);
    e.show();
  } else {
    e.hide()
  }});

  return e;
}createArgs(){let o=e.prototype.createArgs.call(this);if(this.target.enableLimit){
  let e=t.getWorldRotation(this.node.parent);
  o.lowerAngle = e+this.target.lowerAngle;
  o.upperAngle = e+this.target.upperAngle;
}return o}};