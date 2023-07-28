"use strict";const e=Editor.require("scene://utils/node");
let t = require("./collider-gizmo");
let o = require("../tools");
let i = o.rectTool.Type;
let {Vec3:r,Mat4:s} = cc.math;
let l = new s;

module.exports = class extends t{onCreateMoveCallbacks(){
  let e;
  let t;
  let o = this;
  function n(n,c,h,a){
    let y = o.getWorldDelta(c);
    let d = cc.v2(y.x,y.y);
    let x = o.node;
    let g = o.target;

    (function(e,t,o,r,s){
      if (e===i.Right||e===i.RightTop||e===i.RightBottom) {
        if (s) {
          r.x /= 1-t.x;
        }

        o.x = r.x*t.x;
      } else {
        if (s) {
          r.x /= t.x;
        }

        o.x = r.x*(1-t.x);
      }

      if (e===i.LeftBottom||e===i.Bottom||e===i.RightBottom) {
        if (s) {
          r.y /= 1-t.y;
        }

        o.y = r.y*t.y;
      } else {
        if (s) {
          r.y /= t.y;
        }

        o.y = r.y*(1-t.y);
      }

      return o;
    })(n,cc.v2(.5,.5),y,d,a);

    (function(e, t, o, r) {
      if (e===i.LeftBottom) {
        o.x *= -1;
      } else {
        if (e===i.LeftTop) {
          o.x *= -1;
          o.y *= -1;
        } else {
          if (e===i.RightTop) {
            o.y *= -1;
          } else {
            if (e===i.Left) {
              o.x *= -1;

              if (!r) {
                t.y = o.y=0;
              }
            } else {
              if (e===i.Right) {
                if (!r) {
                  t.y = o.y=0;
                }
              } else {
                if (e===i.Top) {
                  o.y *= -1;

                  if (!r) {
                    t.x = o.x=0;
                  }
                } else {
                  if (e===i.Bottom) {
                    if (!r) {
                      t.x = o.x=0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    })(n,y,d,h);

    if (h) {
      d.y = d.x*(t.height/t.width);
    }

    if (x) {
      x.getWorldMatrix(l);
      s.invert(l,l);
      l.m[12] = l.m[13]=0;
      r.transformMat4(y,y,l);
    }

    let f=cc.v3();
    x.getWorldScale(f);
    d.x = d.x/f.x;
    d.y = d.y/f.y;
    let u=cc.size(t.width+d.x,t.height+d.y);if(!a){
      let t=cc.quat();
      x.getRotation(t);
      r.transformQuat(y,y,t);

      if (u.width<0) {
        y.x -= u.width/2;
      }

      if (u.height<0) {
        y.y -= u.height/2;
      }

      y = e.add(y);
      g.offset = y;
    }

    if (u.width<0) {
      u.width = 0;
    }

    if (u.height<0) {
      u.height = 0;
    }

    g.size = u;
  }return {start:()=>{
    e = this.target.offset.clone();
    t = this.target.size.clone();
  },update:(t,r,s,l)=>{let c=new cc.Vec2(t,r);if (l===i.Center) {
    (function(t){
      let i=o.screenToNodeLocalDelta(t,o.node);
      i.addSelf(e);
      o.target.offset = i;
    })(c.clone());
  } else {
    let e = !!s&&s.shiftKey;
    let t = !!s&&s.altKey;
    n(l,this.getLocalAxisAlignDelta(l,c,this.node),e,t)
  }},end:(e,t,r)=>{
    if (!e) {
      return;
    }let s=o.target;

    if (r===i.Center) {
      this.adjustValue(s,["offset"]);
    } else {
      this.adjustValue(s,["offset","size"]);
    }
  }};
}onCreateRoot(){
  let e;
  let t;
  let r;
  let s;
  let l;
  let n;
  let c;
  let h;
  let a;
  let y;
  let d = this._root;
  let x = d.sideGroup=d.group().style("pointer-events","none");
  d.dragArea = y=d.polygon("0,0,0,0,0,0").fill({color:"rgba(0,128,255,0.2)"}).stroke("none").style("pointer-events","none");
  this.registerMoveSvg(y,i.Center);
  let g=(e,t)=>o.lineTool(x,cc.v2(0,0),cc.v2(0,0),"#7fc97a",t,this.createMoveCallbacks(e)).style("cursor",t);
  t = g(i.Left,"col-resize");
  r = g(i.Top,"row-resize");
  s = g(i.Right,"col-resize");
  l = g(i.Bottom,"row-resize");
  (e=d.sidePointGroup=d.group()).hide();
  let f=(e,t,i)=>o.circleTool(t,5,{color:"#7fc97a"},null,this.createMoveCallbacks(e)).style("cursor",i);
  n = f(i.LeftBottom,e,"nwse-resize");
  c = f(i.LeftTop,e,"nesw-resize");
  h = f(i.RightTop,e,"nwse-resize");
  a = f(i.RightBottom,e,"nesw-resize");

  d.plot = (e => {
    y.plot([[e[0].x,e[0].y],[e[1].x,e[1].y],[e[2].x,e[2].y],[e[3].x,e[3].y]]);
    t.plot(e[0].x,e[0].y,e[1].x,e[1].y);
    r.plot(e[1].x,e[1].y,e[2].x,e[2].y);
    s.plot(e[2].x,e[2].y,e[3].x,e[3].y);
    l.plot(e[3].x,e[3].y,e[0].x,e[0].y);

    if (this._targetEditing) {
      n.center(e[0].x,e[0].y);
      c.center(e[1].x,e[1].y);
      h.center(e[2].x,e[2].y);
      a.center(e[3].x,e[3].y);
    }
  });
}onUpdate(){
  let t = this.target;
  let o = t.size;
  let i = t.offset;
  let r = cc.rect(i.x-o.width/2,i.y-o.height/2,o.width,o.height);
  this.node.getWorldMatrix(l);let s=e.getObbFromRect(l,r);
  s[0] = this.worldToPixel(s[0]);
  s[1] = this.worldToPixel(s[1]);
  s[2] = this.worldToPixel(s[2]);
  s[3] = this.worldToPixel(s[3]);
  this._root.plot(s);
}enterEditing(){
  let e=this._root;
  e.sideGroup.style("pointer-events","stroke");
  e.dragArea.style("pointer-events","fill");
  e.dragArea.style("cursor","move");
  e.sidePointGroup.show();
}leaveEditing(){
  let e=this._root;
  e.sideGroup.style("pointer-events","none");
  e.dragArea.style("pointer-events","none");
  e.dragArea.style("cursor",null);
  e.sidePointGroup.hide();
}};