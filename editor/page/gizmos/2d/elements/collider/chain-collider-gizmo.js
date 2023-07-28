"use strict";
let t = require("./collider-gizmo");
let e = require("../tools");
let o = {None:0,Point:1,Line:2};

module.exports = class extends t{onCreateMoveCallbacks(){
  let t;
  let e;
  return {start:(l,i,r,n)=>{if (n===o.Point) {
    let o=r.currentTarget.instance;
    e = o.point.origin;
    t = e.clone();
    if(r.ctrlKey||r.metaKey){
      this.recordChanges();let t=this.target.points;
      t.splice(t.indexOf(e),1);
      this.commitChanges();
      return;
    }
  } else {
    if(n===o.Line){
      this.recordChanges();
      let t = this.screenToNodeLocalPos(cc.v2(l,i),this.node);
      let e = r.currentTarget.instance;
      let o = e.startSvgPoint.point.origin;
      let n = e.endSvgPoint.point.origin;
      let s = this.target.points.indexOf(o)+1;
      let c = o.x-n.x;
      let a = o.y-n.y;
      let h = (t.x-o.x)*(o.x-n.x)+(t.y-o.y)*(o.y-n.y);
      h /= c*c+a*a;
      t.x = o.x+h*c;
      t.y = o.y+h*a;
      this.adjustValue(t);
      this.target.points.splice(s,0,t);
      this.commitChanges();
    }
  }},update:(l,i,r,n)=>{let s=this.screenToNodeLocalDelta(cc.v2(l,i),this.node);if(n===o.Point){
    if (r.ctrlKey||r.metaKey) {
      return;
    }
    s.addSelf(t);
    this.adjustValue(s);
    e.x = s.x;
    e.y = s.y;
  }}};
}onCreateRoot(){
  let t = this._root;
  let l = t.linesGroup=t.group();
  let i = [];
  l.style("cursor","normal");
  let r = ()=>e.lineTool(l,cc.v2(0,0),cc.v2(0,0),"#7fc97a",null,this.createMoveCallbacks(o.Line));
  let n = t.pointsGroup=t.group();
  let s = [];
  n.hide();let c=()=>{
    let t=e.circleTool(n,5,{color:"#7fc97a"},null,"pointer",this.createMoveCallbacks(o.Point));

    t.on("mouseover",function(e){
      if ((e.ctrlKey || e.metaKey)) {
        t.fill({color:"#f00"});

        if (t.l1) {
          t.l1.stroke({color:"#f00"});
        }

        if (t.l2) {
          t.l2.stroke({color:"#f00"});
        }
      }
    });

    t.on("mouseout",function(e){
      t.fill({color:"#7fc97a"});

      if (t.l1) {
        t.l1.stroke({color:"#7fc97a"});
      }

      if (t.l2) {
        t.l2.stroke({color:"#7fc97a"});
      }
    });

    return t;
  };

  t.plot = function(t){let e=[];for(let o=0,l=t.length;o<l;o++){
    let n=t[o];e.push([n.x,n.y]);let a=s[o];

    if (!a) {
      a = s[o]=c();
    }

    a.point = n;
    a.show();
    a.center(n.x,n.y);
    if (o===l-1) {
      continue;
    }
    let h = o+1;
    let u = s[h];

    if (!u) {
      u = s[h]=c();
    }

    let p=i[o];

    if (!p) {
      p = i[o]=r();
    }

    let d = n;
    let g = t[h];
    p.show();
    p.plot(d.x,d.y,g.x,g.y);
    p.startSvgPoint = a;
    p.endSvgPoint = u;
    a.l1 = p;
    u.l2 = p;
  }for (let e=t.length,o=s.length; e<o; e++) {
    s[e].hide();
  }for (let e=t.length-1,o=s.length; e<o; e++) {
    if (i[e]) {
      i[e].hide();
    }
  }};
}onUpdate(){
  let t = this.target.points;
  let e = (this.node, cc.mat4());
  this.node.getWorldMatrix(e);let o=[];for(let l=0,i=t.length;l<i;l++){
    let i = t[l];
    let r = cc.v2();
    cc.Vec2.transformMat4(r,i,e);
    (r=this.worldToPixel(r)).origin = t[l];
    o.push(r);
  }this._root.plot(o)
}enterEditing(){
  let t=this._root;
  t.pointsGroup.show();
  t.linesGroup.style("cursor","copy");
}leaveEditing(){
  let t=this._root;
  t.pointsGroup.hide();
  t.linesGroup.style("cursor","normal");
}};