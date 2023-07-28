"use strict";let t;try{t = Editor.require("unpack://engine-dev/cocos/animation/motion-path-helper").Bezier;}catch(o){t = Editor.require("unpack://engine-dev/cocos2d/animation/motion-path-helper").Bezier;}let o=cc.v2;function n(t,n,e){
  this.pos = t?t.clone():o();
  this.inControl = n||this.pos.clone();
  this.outControl = e||this.pos.clone();
  this.keyframe = null;
}
n.prototype.clone = function(){return new n(this.pos,this.inControl,this.outControl)};
n.prototype.getValue = function(){return[this.pos.x,this.pos.y,this.inControl.x,this.inControl.y,this.outControl.x,this.outControl.y]};

module.exports = {Segment:n,getNearestParameter:function(o,n,e){
  let r=new t;
  r.start = o.pos;
  r.end = n.pos;
  r.startCtrlPoint = o.outControl;
  r.endCtrlPoint = n.inControl;
  let i = null;
  let s = 1/0;
  let l = 0;
  function u(t){if(t>=0&&t<=1){
    let o = r.getPoint(t);

    let n = function(t,o){
      let n = t.x-o.x;
      let e = t.y-o.y;
      return Math.sqrt(n*n+e*e)
    }(e,o);

    if (n<s) {
      s = n;
      l = t;
      i = o;
      return true;
    }
  }}for (let t=0; t<=100; t++) {
    u(t/100);
  }let p=.005;for (; p>4e-7; ) {
    if (!(u(l-p) || u(l+p))) {
      p /= 2;
    }
  }return{t:l,dist:s,pos:i}
},createSegmentWithNearset:function(t){
  let e = t.t;
  let r = t.seg1.segment;
  let i = t.seg2.segment;
  let s = r.pos.x;
  let l = r.pos.y;
  let u = r.outControl.x;
  let p = r.outControl.y;
  let c = i.inControl.x;
  let h = i.inControl.y;
  let C = 1-e;
  let a = C*s+e*u;
  let y = C*l+e*p;
  let f = C*u+e*c;
  let g = C*p+e*h;
  let m = C*c+e*i.pos.x;
  let x = C*h+e*i.pos.y;
  let d = C*a+e*f;
  let P = C*y+e*g;
  let k = C*f+e*m;
  let q = C*g+e*x;
  let v = C*d+e*k;
  let w = C*P+e*q;
  r.outControl = o(a,y);
  i.inControl = o(m,x);
  let z=new n;
  z.pos = o(v,w);
  z.inControl = o(d,P);
  z.outControl = o(k,q);
  return z;
}};