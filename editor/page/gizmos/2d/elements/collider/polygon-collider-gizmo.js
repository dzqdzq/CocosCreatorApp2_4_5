"use strict";
let e = require("./collider-gizmo");
let t = require("../tools");
let o = {None:0,Point:1,Line:2,Center:3};
let r = cc.mat4();

module.exports = class extends e{onCreateMoveCallbacks(){
  let e;
  let t;
  let r;
  return {start:(i,l,s,n)=>{if (n===o.Point) {
    let t=s.currentTarget.instance;
    r = t.point.origin;
    e = r.clone();
    if(s.ctrlKey||s.metaKey){
      this.recordChanges();let e=this.target.points;
      e.splice(e.indexOf(r),1);
      this.commitChanges();
    }
  } else {
    if (n===o.Center) {
      t = this.target.offset;
    } else {
      if(n===o.Line){
        this.recordChanges();
        let e = this.screenToNodeLocalPos(cc.v2(i,l),this.node).sub(this.target.offset);
        let t = s.currentTarget.instance;
        let o = t.startSvgPoint.point.origin;
        let r = t.endSvgPoint.point.origin;
        let n = this.target.points.indexOf(o)+1;
        let a = o.x-r.x;
        let c = o.y-r.y;
        let h = (e.x-o.x)*(o.x-r.x)+(e.y-o.y)*(o.y-r.y);
        h /= a*a+c*c;
        e.x = o.x+h*a;
        e.y = o.y+h*c;
        this.adjustValue(e);
        this.target.points.splice(n,0,e);
        this.commitChanges();
      }
    }
  }},update:(i,l,s,n)=>{let a=this.screenToNodeLocalDelta(cc.v2(i,l),this.node);if (n===o.Point) {
    if (s.ctrlKey||s.metaKey) {
      return;
    }
    a = a.addSelf(e);
    this.adjustValue(a);
    r.x = a.x;
    r.y = a.y;
  } else {
    if (n===o.Center) {
      a = a.addSelf(t);
      this.adjustValue(a);
      this.target.offset = a;
    }
  }this._view.repaintHost()}};
}onCreateRoot(){
  let e = this._root;
  let r = e.dragArea=e.polygon().fill({color:"rgba(0,128,255,0.2)"}).stroke("none").style("pointer-events","none");
  this.registerMoveSvg(r,o.Center);
  let i = e.linesGroup=e.group();
  let l = [];
  i.style("pointer-events","stroke").style("cursor","copy").hide();
  let s = ()=>t.lineTool(i,cc.v2(0,0),cc.v2(0,0),"#7fc97a",null,this.createMoveCallbacks(o.Line));
  let n = e.pointsGroup=e.group();
  let a = [];
  n.hide();let c=()=>{
    let e=t.circleTool(n,5,{color:"#7fc97a"},null,"pointer",this.createMoveCallbacks(o.Point));

    e.on("mouseover",function(t){
      if ((t.ctrlKey || t.metaKey)) {
        e.fill({color:"#f00"});
        e.l1.stroke({color:"#f00"});
        e.l2.stroke({color:"#f00"});
      }
    });

    e.on("mouseout",function(t){
      e.fill({color:"#7fc97a"});
      e.l1.stroke({color:"#7fc97a"});
      e.l2.stroke({color:"#7fc97a"});
    });

    return e;
  };

  e.plot = (e => {let t=[];for(let o=0,r=e.length;o<r;o++){
    let i = o===r-1?0:o+1;
    let n = e[o];
    t.push([n.x,n.y]);
    if (!this.target.editing) {
      continue;
    }let h=a[o];

    if (!h) {
      h = a[o]=c();
    }

    h.point = n;
    h.show();
    h.center(n.x,n.y);
    let g=a[i];

    if (!g) {
      g = a[i]=c();
    }

    let d=l[o];

    if (!d) {
      d = l[o]=s();
    }

    let u = n;
    let p = e[i];
    d.show();
    d.plot(u.x,u.y,p.x,p.y);
    d.startSvgPoint = h;
    d.endSvgPoint = g;
    h.l1 = d;
    g.l2 = d;
  }r.plot(t);for (let t=e.length,o=a.length; t<o; t++) {
    a[t].hide();
    l[t].hide();
  }});
}onUpdate(){
  let e = this.target.points;
  let t = this.target.offset;
  this.node.getWorldMatrix(r);let o=[];for(let i=0,l=e.length;i<l;i++){
    let l=e[i].add(t);
    cc.Vec2.transformMat4(l,l,r);
    (l=this.worldToPixel(l)).origin = e[i];
    o.push(l);
  }this._root.plot(o)
}enterEditing(){
  let e=this._root;
  e.pointsGroup.show();
  e.dragArea.style("cursor","move");
  e.dragArea.style("pointer-events","fill");
  e.linesGroup.show();
}leaveEditing(){
  let e=this._root;
  e.pointsGroup.hide();
  e.linesGroup.hide();
  e.dragArea.style("cursor",null);
  e.dragArea.style("pointer-events","none");
}};