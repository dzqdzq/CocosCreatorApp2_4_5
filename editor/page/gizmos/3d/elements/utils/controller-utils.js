"use strict";let e=require("./controller-shape");
const t = require("../../../utils/external");
const r = t.NodeUtils;
const n = require("./controller-shape-collider");
const {gfx:o,create3DNode:c,addMeshToNode:i,setMeshColor:l,setNodeOpacity:u} = require("../../../utils/engine");
const s = require("../../../utils");
const a = t.EditorMath;
const d = cc.Vec3;
let f={};
f.YELLOW = new cc.Color(255,255,0);

f.arrow = function(t,r,u,s){
  let a = c("arrow");
  let d = c("ArrowBody");
  d.parent = a;
  i(d,e.lineWithBoundingBox(u),{alpha:200,noDepthTestForLines:true});
  l(d,s);
  d.eulerAngles = cc.v3(0,0,90);
  let f=d.addComponent(n);
  f.isDetectMesh = false;
  let D=c("ArrowHead");
  D.parent = a;
  i(D,e.cone(r,t),{cullMode:o.CULL_BACK});
  l(D,s);
  D.setPosition(cc.v3(0,u+t/2,0));
  (f=D.addComponent(n)).isDetectMesh = false;
  return a;
};

f.quad = function(t,r,n=cc.Color.RED,o={}){
  let u=c("quad");
  i(u,e.quad(t,r),o);
  l(u,n);
  return u;
};

f.borderPlane = function(t,r,o,s){
  let a = t/2;
  let d = r/2;
  let f = c("borderPlane");
  let D = c("Plane");
  function p(t,r,n){
    let o=c("border");
    i(o,e.line(t,r),{alpha:200,noDepthTestForLines:true});
    l(o,n);
    o.parent = f;
    return o;
  }
  i(D,e.quad(t,r));
  l(D,o);
  u(D,s);
  D.parent = f;
  D.addComponent(n).isDetectMesh = false;
  p(cc.v3(0,r/2,0),cc.v3(a,r/2,0),o);
  p(cc.v3(a,d,0),cc.v3(a,0,0),o);
  return f;
};

f.circle = function(t,r,n,o){
  let u=c("circle");
  i(u,e.circle(t,r,n));
  l(u,o);
  return u;
};

f.torus = function(t,r,u,s){
  let a=c("torus");
  i(a,e.torus(t,r,u),{cullMode:o.CULL_BACK});
  l(a,s);
  let d=a.addComponent(n);
  d.isDetectMesh = true;
  d.isRender = false;
  return a;
};

f.cube = function(t,r,u,s){
  let a=c("cube");
  i(a,e.cube(t,r,u),{cullMode:o.CULL_BACK});
  l(a,s);
  a.addComponent(n).isDetectMesh = false;
  return a;
};

f.scaleSlider = function(t,r,o){
  let u = c("scaleSlider");
  let s = f.cube(t,t,t,o);
  s.name = "ScaleSliderHead";
  s.parent = u;
  s.setPosition(0,r+t/2,0);
  let a=c("ScaleSliderBody");
  i(a,e.lineWithBoundingBox(r),{noDepthTestForLines:true});
  l(a,o);
  a.parent = u;
  a.eulerAngles = cc.v3(0,0,90);
  a.addComponent(n).isDetectMesh = false;
  return u;
};

f.getCameraDistanceFactor = function(e,t){let n=r.getWorldPosition3D(t);return d.distance(e,n)};

f.lineTo = function(t,r,n=cc.Color.RED,o){
  let u=c("line");
  i(u,e.line(t,r),o);
  l(u,n);
  return u;
};

f.disc = function(t,r,n,o=cc.Color.RED){
  let u=c("disc");
  i(u,e.disc(t,r,n));
  l(u,o);
  return u;
};

f.sector = function(t,r,n,o,u,s=cc.Color.RED,a){
  let d=c("sector");
  i(d,e.sector(t,r,n,o,u,60),a);
  l(d,s);
  return d;
};

f.arc = function(t,r,n,o,u,s=cc.Color.RED,a){
  let d=c("arc");
  i(d,e.arc(t,r,n,o,u),a);
  l(d,s);
  return d;
};

f.arcDirectionLine = function(t,r,n,o,u,s,a,d=cc.Color.RED){
  let f=c("arcDirLine");
  i(f,e.arcDirectionLine(t,r,n,o,u,s,a));
  l(f,d);
  return f;
};

f.lines = function(t,r,n=cc.Color.RED){
  let o=c("lines");
  i(o,e.lines(t,r));
  l(o,n);
  return o;
};

f.wireframeBox = function(t,r,n){
  let o=c("wireframeBox");
  i(o,e.wireframeBox(t,r));
  l(o,n);
  return o;
};

f.frustum = function(t,r,n,o,u){
  let s=c("frustumNode");
  i(s,e.frustum(t,r,n,o));
  l(s,u);
  return s;
};

f.angle = function(e,t){let r=Math.sqrt(s.getSqrMagnitude(e)*s.getSqrMagnitude(t));if (r<a.EPSILON) {
  return 0;
}let n=a.clamp(d.dot(e,t)/r,-1,1);return Math.acos(n)*a.R2D};

module.exports = f;