"use strict";var c={};
module.exports = c;
const {gfx:t,createMesh:e} = require("../../../utils/engine");
const {Vec3:n,Quat:i} = cc.math;
const r = require("../../../utils/external").EditorMath;
const s = require("../../../utils");

c.cylinder = function(c=.5,t=.5,n=2,i={}){
  let r = .5*n;
  let s = i.radialSegments||16;
  let o = i.heightSegments||1;
  let l = void 0===i.capped||i.capped;
  let a = i.arc||2*Math.PI;
  let u = 0;

  if (!l) {
    if (c>0) {
      u++;
    }

    if (t>0) {
      u++;
    }
  }

  let v=(s+1)*(o+1);

  if (l) {
    v += (s+1)*u+s*u;
  }

  let h=s*o*2*3;

  if (l) {
    h += s*u*3;
  }

  let p = new Array(h);
  let f = new Array(v);
  let m = new Array(v);
  let d = new Array(v);
  let y = Math.max(c,t);
  let P = cc.v3(-y,-r,-y);
  let g = cc.v3(y,r,y);
  let x = 0;
  let A = 0;
  function M(e){
    let n;
    let i;
    let o = e?c:t;
    let l = e?1:-1;
    n = x;
    for (let c=1; c<=s; ++c) {
      f[x] = cc.v3(0,r*l,0);
      m[x] = cc.v3(0,l,0);
      d[x] = cc.v2(.5,.5);
      ++x;
    }
    i = x;
    for(let c=0;c<=s;++c){
      let t = c/s*a;
      let e = Math.cos(t);
      let n = Math.sin(t);
      f[x] = cc.v3(o*n,r*l,o*e);
      m[x] = cc.v3(0,l,0);
      d[x] = cc.v2(.5-.5*n*l,.5+.5*e);
      ++x;
    }for(let c=0;c<s;++c){
      let t = n+c;
      let r = i+c;

      if (e) {
        p[A] = r+1;
        p[++A] = t;
        p[++A] = r;
        ++A;
      } else {
        p[A] = t;
        p[++A] = r+1;
        p[++A] = r;
        ++A;
      }
    }
  }

  (function() {
    let e = [];
    let i = (c-t)/n;
    for(let l=0;l<=o;l++){
      let u = [];
      let v = l/o;
      let h = v*(c-t)+t;
      for(let c=0;c<=s;++c){
        let t = c/s;
        let e = t*a;
        let o = Math.sin(e);
        let l = Math.cos(e);
        f[x] = cc.v3(h*o,v*n-r,h*l);
        m[x] = cc.v3(o,-i,l).normalizeSelf();
        d[x] = cc.v2(2*(1-t)%1,v);
        u.push(x);
        ++x;
      }e.push(u)
    }for (let c=0; c<o; ++c) {
      for(let t=0;t<s;++t){
        let n = e[c][t];
        let i = e[c+1][t];
        let r = e[c+1][t+1];
        let s = e[c][t+1];
        p[A] = n;
        p[++A] = s;
        p[++A] = i;
        p[++A] = s;
        p[++A] = r;
        p[++A] = i;
        ++A;
      }
    }
  })();

  if (l) {
    if (t>0) {
      M(false);
    }

    if (c>0) {
      M(true);
    }
  }

  return e({positions:f,normals:m,uvs:d,indices:p,minPos:P,maxPos:g});
};

c.cone = function(t,e,n){return c.cylinder(0,t,e,n)};

c.quad = function(c,t){
  let n = c/2;
  let i = t/2;
  return e({positions:[cc.v3(-n,i,0),cc.v3(-n,-i,0),cc.v3(n,-i,0),cc.v3(n,i,0)],normals:Array(4).fill(cc.v3(0,0,1)),indices:[0,3,1,1,3,2],minPos:cc.v3(-n,-i,-1),maxPos:cc.v3(n,i,1),doubleSided:true});
};

c.line = function(c,n){return e({positions:[cc.v3(c.x,c.y,c.z),cc.v3(n.x,n.y,n.z)],normals:Array(2).fill(cc.v3(0,1,0)),indices:[0,1],primitiveType:t.PT_LINES})};
c.lineWithBoundingBox = function(c,n=3){return e({positions:[cc.v3(),cc.v3(c,0,0)],normals:Array(2).fill(cc.v3(0,1,0)),indices:[0,1],minPos:cc.v3(0,-n,-n),maxPos:cc.v3(c,n,n),primitiveType:t.PT_LINES})};
c.circle = function(t,e,n){let i=c.getBiNormalByNormal(e);return c.arc(t,e,i,r.TWO_PI,n,60)};

c.cube = function(c,t,n,i={}){
  let r = i.widthSegments?i.widthSegments:1;
  let s = i.heightSegments?i.heightSegments:1;
  let o = i.lengthSegments?i.lengthSegments:1;
  let l = .5*c;
  let a = .5*t;
  let u = .5*n;
  let v = [cc.v3(-l,-a,u),cc.v3(l,-a,u),cc.v3(l,a,u),cc.v3(-l,a,u),cc.v3(l,-a,-u),cc.v3(-l,-a,-u),cc.v3(-l,a,-u),cc.v3(l,a,-u)];
  let h = [[2,3,1],[4,5,7],[7,6,2],[1,0,4],[1,4,2],[5,0,6]];
  let p = [cc.v3(0,0,1),cc.v3(0,0,-1),cc.v3(0,1,0),cc.v3(0,-1,0),cc.v3(1,0,0),cc.v3(-1,0,0)];
  let f = [];
  let m = [];
  let d = [];
  let y = [];
  let P = cc.v3(-l,-a,-u);
  let g = cc.v3(l,a,u);
  function x(c,t,e){
    let n;
    let i;
    let r;
    let s;
    let o = f.length;
    let l = h[c];
    let a = p[c];
    for (s=0; s<=e; s++) {
      for(r=0;r<=t;r++){
        n = r/t;
        i = s/e;
        let c = v[l[0]].lerp(v[l[1]],n);
        let u = v[l[0]].lerp(v[l[2]],i);
        f.push(c.add(u.sub(v[l[0]])));
        m.push(a.clone());
        d.push(cc.v2(n,i));
        if(r<t&&s<e){
          let c = t+1;
          let e = r+s*c;
          let n = r+(s+1)*c;
          let i = r+1+(s+1)*c;
          let l = r+1+s*c;
          y.push(o+e,o+l,o+n);
          y.push(o+n,o+l,o+i);
        }
      }
    }
  }
  x(0,r,s);
  x(4,o,s);
  x(1,r,s);
  x(5,o,s);
  x(3,r,o);
  x(2,r,o);
  return e({positions:f,indices:y,normals:m,minPos:P,maxPos:g});
};

c.torus = function(c,t,n={}){
  let i = n.radialSegments||30;
  let r = n.tubularSegments||20;
  let s = n.arc||2*Math.PI;
  let o = [];
  let l = [];
  let a = [];
  let u = [];
  let v = cc.v3(-c-t,-t,-c-t);
  let h = cc.v3(c+t,t,c+t);
  for (let e=0; e<=i; e++) {
    for(let n=0;n<=r;n++){
      let v = n/r;
      let h = e/i;
      let p = v*s;
      let f = h*Math.PI*2;
      let m = (c+t*Math.cos(f))*Math.sin(p);
      let d = t*Math.sin(f);
      let y = (c+t*Math.cos(f))*Math.cos(p);
      let P = Math.sin(p)*Math.cos(f);
      let g = Math.sin(f);
      let x = Math.cos(p)*Math.cos(f);
      o.push(cc.v3(m,d,y));
      l.push(cc.v3(P,g,x));
      a.push(cc.v2(v,h));
      if(n<r&&e<i){
        let c = r+1;
        let t = c*e+n;
        let i = c*(e+1)+n;
        let s = c*(e+1)+n+1;
        let o = c*e+n+1;
        u.push(t,o,i);
        u.push(o,s,i);
      }
    }
  }return e({positions:o,indices:u,normals:l,uvs:a,minPos:v,maxPos:h})
};

c.calcArcPoints = function(c,t,e,r,s,o=60){
  n.normalize(e,e);
  n.normalize(t,t);
  let l = cc.quat(0,0,0,1);
  let a = o;
  i.fromAxisAngle(l,t,r/(a-1));let u=cc.v3();n.scale(u,e,s);let v=[];for (let t=0; t<a; t++) {
    v[t] = c.add(u);
    n.transformQuat(u,u,l);
  }return v
};

c.getBiNormalByNormal = function(c){
  let t=cc.v3();
  n.cross(t,c,cc.v3(0,1,0));

  if (s.getSqrMagnitude(t)<.001) {
    n.cross(t,c,cc.v3(1,0,0));
  }

  return t;
};

c.calcCirclePoints = function(t,e,n,i=60){let s=c.getBiNormalByNormal(e);return c.calcArcPoints(t,e,s,r.TWO_PI,n,i)};
c.calcDiscPoints = function(t,e,n,i=60){let s=c.getBiNormalByNormal(e);return c.calcSectorPoints(t,e,s,r.TWO_PI,n,i)};
c.calcSectorPoints = function(t,e,n,i,r,s){let o=[];o.push(t);let l=c.calcArcPoints(t,e,n,i,r,s);return o=o.concat(l)};
c.disc = function(t,e,n){let i=c.getBiNormalByNormal(e);return c.sector(t,e,i,r.TWO_PI,n,60)};
c.sector = function(n,i,r,s,o,l){return e({positions:c.calcSectorPoints(n,i,r,s,o,l),normals:Array(l+1).fill(cc.v3(i)),indices:[...Array(l+1).keys()],primitiveType:t.PT_TRIANGLE_FAN})};
c.arc = function(n,i,r,s,o,l=60){return e({positions:c.calcArcPoints(n,i,r,s,o,l),normals:Array(l).fill(cc.v3(i)),indices:[...Array(l).keys()],primitiveType:t.PT_LINE_STRIP})};

c.arcDirectionLine = function(i,r,s,o,l,a,u){
  let v = [];
  let h = [];
  let p = c.calcArcPoints(i,r,s,o,l,u);
  let f = cc.v3();
  n.scale(f,r,a);for(let c=0;c<p.length;c++){
    let t=cc.v3();
    n.add(t,p[c],f);
    v.push(p[c],t);
    h.push(2*c,2*c+1);
  }for (let c=1; c<p.length; c++) {
    v.push(p[c-1]);
    h.push(v.length-1);
    v.push(p[c]);
    h.push(v.length-1);
  }return e({positions:v,normals:Array(v.length).fill(cc.v3(0,1,1)),indices:h,primitiveType:t.PT_LINES})
};

c.lines = function(c,n){return e({positions:c,normals:Array(c.length).fill(cc.v3(0,1,0)),indices:n,primitiveType:t.PT_LINES})};

c.calcBoxPoints = function(c,t){
  let e=cc.v3();n.scale(e,t,.5);let i=[];
  i[0] = c.add(cc.v3(-e.x,-e.y,-e.z));
  i[1] = c.add(cc.v3(-e.x,e.y,-e.z));
  i[2] = c.add(cc.v3(e.x,e.y,-e.z));
  i[3] = c.add(cc.v3(e.x,-e.y,-e.z));
  i[4] = c.add(cc.v3(-e.x,-e.y,e.z));
  i[5] = c.add(cc.v3(-e.x,e.y,e.z));
  i[6] = c.add(cc.v3(e.x,e.y,e.z));
  i[7] = c.add(cc.v3(e.x,-e.y,e.z));
  return i;
};

c.wireframeBox = function(n,i){
  let r = c.calcBoxPoints(n,i);
  let s = [];
  for (let c=1; c<4; c++) {
    s.push(c-1,c);
  }s.push(0,3);for (let c=5; c<8; c++) {
    s.push(c-1,c);
  }s.push(4,7);for (let c=0; c<4; c++) {
    s.push(c,c+4);
  }return e({positions:r,normals:Array(r.length).fill(cc.v3(0,1,0)),indices:s,primitiveType:t.PT_LINES})
};

c.calcFrustum = function(c,t,e,n,i,s){
  let o;
  let l;
  let a;
  let u;
  let v = [];
  let h = [];

  if (c) {
    l = u=(o=a=t)*n;
  } else {
    l = (o=Math.tan(r.deg2rad(e/2))*i)*n;
    u = (a=Math.tan(r.deg2rad(e/2))*s)*n;
  }

  v[0] = cc.v3(-l,-o,-i);
  v[1] = cc.v3(-l,o,-i);
  v[2] = cc.v3(l,o,-i);
  v[3] = cc.v3(l,-o,-i);
  v[4] = cc.v3(-u,-a,-s);
  v[5] = cc.v3(-u,a,-s);
  v[6] = cc.v3(u,a,-s);
  v[7] = cc.v3(u,-a,-s);
  for (let c=1; c<4; c++) {
    h.push(c-1,c);
  }h.push(0,3);for (let c=5; c<8; c++) {
    h.push(c-1,c);
  }h.push(4,7);for (let c=0; c<4; c++) {
    h.push(c,c+4);
  }return{vertices:v,indices:h}
};

c.frustum = function(n,i,r,s){let o=c.calcFrustum(n,i,r,s);return e({positions:o.vertices,normals:Array(o.vertices.length).fill(cc.v3(0,1,0)),indices:o.indices,primitiveType:t.PT_LINES})};