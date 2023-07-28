"use strict";
const t = Editor.require("scene://utils/node");
const e = require("../../utils/external").EditorMath;
let o = require("./tools");
let i = o.rectTool.Type;
let r = Editor.GizmosUtils.snapPixelWihVec2;
const{Vec2:n,Vec3:h,Mat4:l}=cc.math;
let s = cc.v2;
let c = cc.mat4();
let a = new s;
let g = new s;
let d = new s;
let x = cc.v3();

module.exports = class extends Editor.Gizmo{init(){
  this._processing = false;
  this._rect = cc.rect(0,0,0,0);
  this._tool = null;
}layer(){return"foreground"}onCreateMoveCallbacks(){
  let o = [];
  let r = [];
  let y = [];
  let u = [];
  let f = [];
  let w = this;
  function m(t,e,o,r){
    if (t===i.LeftBottom) {
      o.x *= -1;
    } else {
      if (t===i.LeftTop) {
        o.x *= -1;
        o.y *= -1;
      } else {
        if (t===i.RightTop) {
          o.y *= -1;
        } else {
          if (t===i.Left) {
            o.x *= -1;

            if (!r) {
              e.y = o.y=0;
            }
          } else {
            if (t===i.Right) {
              if (!r) {
                e.y = o.y=0;
              }
            } else {
              if (t===i.Top) {
                o.y *= -1;

                if (!r) {
                  e.x = o.x=0;
                }
              } else {
                if (t===i.Bottom) {
                  if (!r) {
                    e.x = o.x=0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }function p(t,e,o,r,n){
    if (t===i.Right||t===i.RightTop||t===i.RightBottom) {
      if (n) {
        r.x /= 1-e.x;
      }

      o.x = r.x*e.x;
    } else {
      if (n) {
        r.x /= e.x;
      }

      o.x = r.x*(1-e.x);
    }

    if (t===i.LeftBottom||t===i.Bottom||t===i.RightBottom) {
      if (n) {
        r.y /= 1-e.y;
      }

      o.y = r.y*e.y;
    } else {
      if (n) {
        r.y /= e.y;
      }

      o.y = r.y*(1-e.y);
    }

    return o;
  }return {start:()=>{
    o.length = 0;
    y.length = 0;
    r.length = 0;
    u.length = 0;
    f.length = 0;
    f.tempRect = function(t){return cc.rect(t[1].x,t[1].y,t[3].x-t[1].x,t[3].y-t[1].y)}(w.getBounds());
    w._processing = true;
    for(let e=0,i=w.target.length;e<i;++e){
      let i=w.target[e];
      o.push(t.getWorldPosition(i));
      r.push(i.position);
      y.push(i.getContentSize());
      u.push(i.getAnchorPoint());
      f.push(t.getWorldBounds(i));
    }
  },update:(P,v,W,_)=>{let A=new cc.Vec2(P,v);if (_===i.Anchor) {
    (function(e){
      let i = w.target[0];
      let r = y[0];
      i.getPosition(a);let s=w.getWorldDelta(e);
      t.makeVec3InPrecision(s,3);
      n.add(d,o[0],s);
      t.setWorldPosition(i,d);
      i.getWorldMatrix(c);
      l.invert(c,c);
      c.m[12] = c.m[13]=0;
      h.transformMat4(s,s,c);
      g.x = s.x/r.width;
      g.y = s.y/r.height;
      let x=u[0];
      g.addSelf(x);
      i.setAnchorPoint(g);
    })(A.clone());
  } else {
    if(_===i.Center){
      let t=cc.quat();w.node.getWorldRotation(t);
      let e = cc.v3(P,v,0);
      let i = cc.v2();
      h.transformQuat(x,h.RIGHT,t);
      i.x = e.dot(x);
      h.transformQuat(x,h.UP,t);
      i.y = e.dot(x);

      (function(t) {let e=w.target.length;for(let i=0;i<e;++i){
        let e = w.target[i];
        let r = (o[i], y[i]);
        let n = u[i];
        let h = w.screenToNodeLocalDelta(t,e.parent);
        let l = cc.v3();
        e.getScale(l);

        if (0!==r.width) {
          a.x = n.x-h.x/r.width/l.x;
        }

        if (0!==r.height) {
          a.y = n.y-h.y/r.height/l.y;
        }

        e.setAnchorPoint(a);
      }})(i);
    }else{
      let i = !!W&&W.shiftKey;
      let n = !!W&&W.altKey;

      if (w.target.length>1) {
        (function(e, i, r, n) {
          let h=f.tempRect;

          if (r) {
            i.y = i.x*(h.height/h.width);
          }

          let l = w.getWorldDelta(i);
          let c = cc.v2(l.x,l.y);
          m(e,c,l,r);
          p(e,n?s(.5,.5):s(0,0),c,l,n);
          let a=h.clone();
          a.x = h.x-c.x;
          a.y = h.y-c.y;
          a.width = h.width+l.x;
          a.height = h.height+l.y;
          w._rect = a;
          for(let e=0,i=w.target.length;e<i;e++){
            let i = w.target[e];
            let r = o[e];
            let n = (r.x-h.x)/h.width;
            let c = (r.y-h.y)/h.height;
            t.setWorldPosition(i,s(a.x+n*a.width,a.y+c*a.height));
            let g = f[e];
            let d = g.width/h.width;
            let x = g.height/h.height;
            let u = y[e];
            let m = u.width>0?1:-1;
            let p = u.height>0?1:-1;
            let P = l.clone();
            P.x = P.x*d*m;
            P.y = P.y*x*p;
            let v=cc.v3();
            i.getWorldScale(v);
            P.x = P.x/v.x;
            P.y = P.y/v.y;
            i.setContentSize(cc.size(u.width+P.x,u.height+P.y));
          }
        })(_,A.clone(),i,n);
      } else {
        (function(t, o, i, n) {
          let s=y[0];

          if (i) {
            o.y = o.x*(s.height/s.width);
          }

          let a = w.getWorldDelta(o);
          let g = cc.v2(a.x,a.y);
          let d = r[0];
          let u = w.target[0];
          let f = u.getAnchorPoint();
          g.x = e.toPrecision(g.x,3);
          g.y = e.toPrecision(g.y,3);
          p(t,f,a,g,n);
          m(t,a,g,i);

          if (u.parent) {
            u.parent.getWorldMatrix(c);
            l.invert(c,c);
            c.m[12] = c.m[13]=0;
            h.transformMat4(a,a,c);
          }

          if(!n){
            let t=cc.quat();
            u.getRotation(t);
            h.transformQuat(a,a,t);
            a.z = 0;
            x.set(d);
            x.addSelf(a);
            u.setPosition(x);
          }let P=cc.v3();
          u.getWorldScale(P);
          g.x = g.x/P.x;
          g.y = g.y/P.y;
          let v = s.width+g.x;
          let W = s.height+g.y;
          u.setContentSize(cc.size(v,W))
        })(_,this.getLocalAxisAlignDelta(_,A,w.node),i,n);
      }
    }
  }},end:(t,e,o)=>{if (t) {
    if (o<i.Center) {
      this.adjustValue(w.target,["anchorX","anchorY"]);
    } else {
      if (o===i.Anchor)
        {let t=w.target[0];this.adjustValue(t,["x","y"]);let e=(0|Math.max(t.width,t.height)).toString().length;this.adjustValue(t,["anchorX","anchorY"],this.defaultMinDifference()+e)} else {
        this.adjustValue(w.target,["x","y","width","height"]);
      }
    }
  }w._processing = false;}};
}onCreateRoot(){this._tool = o.rectTool(this._root,this.createMoveCallbacks());}formatBounds(t){return[this.worldToPixel(t[0]),this.worldToPixel(t[1]),this.worldToPixel(t[2]),this.worldToPixel(t[3])]}getBounds(e,o){
  let i;
  let r = Number.MAX_VALUE;
  let n = -Number.MAX_VALUE;
  let h = Number.MAX_VALUE;
  let l = -Number.MAX_VALUE;
  function s(t){
    if (t.x>n) {
      n = t.x;
    }

    if (t.x<r) {
      r = t.x;
    }

    if (t.y>l) {
      l = t.y;
    }

    if (t.y<h) {
      h = t.y;
    }
  }

  this.target.forEach(e=>{
    let o=t.getWorldOrientedBounds(e);
    s(o[0]);
    s(o[1]);
    s(o[2]);
    s(o[3]);
  });

  if (e) {
    i = r;
    r = n;
    n = i;
  }

  if (o) {
    i = h;
    h = l;
    l = i;
  }

  return [cc.v2(r,l),cc.v2(r,h),cc.v2(n,h),cc.v2(n,l)];
}onKeyDown(t){
  if (!this.target) {
    return;
  }let e=Editor.KeyCode(t.which);if ("left"!==e&&"right"!==e&&"up"!==e&&"down"!==e) {
    return;
  }
  let o = t.shiftKey?10:1;
  let i = cc.v2();

  if ("left"===e) {
    i.x = -1*o;
  } else {
    if ("right"===e) {
      i.x = o;
    } else {
      if ("up"===e) {
        i.y = o;
      } else {
        if ("down"===e) {
          i.y = -1*o;
        }
      }
    }
  }

  this.recordChanges();
  this.topNodes.forEach(t=>{t.position = t.position.add(i);});
  this._view.repaintHost();
}onKeyUp(t){
  if (!this.target) {
    return;
  }let e=Editor.KeyCode(t.which);

  if (!("left"!==e&&"right"!==e&&"up"!==e && "down"!==e)) {
    this.commitChanges();
  }
}visible(){return true;}dirty(){return true;}onUpdate(){let e=[];if(1===this.target.length){
  let o=this.target[0];
  e = t.getWorldOrientedBounds(o);
  e = this.formatBounds(e);
  let i = t.getWorldPosition(o);
  let n = t.getWorldPosition(o.parent);
  e.anchor = this.worldToPixel(i);
  e.origin = this.worldToPixel(n);
  e.localPosition = r(o.getPosition());

  if (o.getContentSize) {
    e.localSize = o.getContentSize();
  } else {
    e.localSize = cc.size();
  }
}else{
  let t = false;
  let o = false;

  if (this._processing) {
    t = this._rect.width<0;
    o = this._rect.height<0;
  }

  e = this.getBounds(t,o);
  e = this.formatBounds(e);
}this._tool.setBounds(e)}};