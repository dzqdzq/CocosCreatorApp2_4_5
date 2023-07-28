"use strict";
const t = Editor.require("scene://utils/node");
const o = require("../../utils/transform-tool-data");
let e = cc.mat4();
let l = cc.v3();
let i = cc.quat();

module.exports = class extends Editor.Gizmo{init(){this._currentName = this.target.name;}onCreateRoot(){
  let t=this._root;
  t.bounds = t.polygon();
  t.compGroup = t.group();
  t.compGroup.compBounds = [];
  let o = t.rect({fill:"none"});
  let e = t.text(this._currentName);
  e.font({family:"Helvetica",size:"12px",anchor:"left",weight:"bold"});let l=e.bbox();
  o.width(l.width+10);
  o.height(l.height);
  t.labelBG = o;
  t.label = e;
  let i=t.errorInfo=t.group();
  i.l1 = i.line(0,0,0,0).stroke({width:1,color:"#f00"});
  i.l2 = i.line(0,0,0,0).stroke({width:1,color:"#f00"});
}visible(){return o.is2D&&(this.selecting||this.editing||this.hovering||false);}onUpdate(){
  let o = this.selecting||this.editing;
  let r = this.hovering;
  let s = this.target;
  let h = t.getWorldOrientedBounds(s);
  let n = this.worldToPixel(h[0]);
  let a = this.worldToPixel(h[1]);
  let d = this.worldToPixel(h[2]);
  let c = this.worldToPixel(h[3]);
  false;
  this._root.errorInfo.hide();
  if (o||r) {
    this._root.bounds.show();
    this._root.bounds.plot([[n.x,n.y],[a.x,a.y],[d.x,d.y],[c.x,c.y]]).fill("none");
    let h = s._components.filter(t=>!!t._getLocalBounds);
    let g = this._root.compGroup;
    let u = g.compBounds;
    if (u.length>h.length) {for (let t=h.length,o=u.length; t<o; t++) {
      u[t].remove();
    }u.length = h.length;} else {
      if (u.length<h.length) {
        for(let t=u.length,o=h.length;t<o;t++){let t=g.polygon();u.push(t)}
      }
    }u.forEach((l,i)=>{
      let n = h[i];
      let a = cc.rect();
      n._getLocalBounds(a);
      s.getWorldMatrix(e);
      let d=t.getObbFromRect(e,a);
      d[0] = this.worldToPixel(d[0]);
      d[1] = this.worldToPixel(d[1]);
      d[2] = this.worldToPixel(d[2]);
      d[3] = this.worldToPixel(d[3]);
      l.plot(d).fill("none");

      if (o) {
        l.stroke({color:"#09f",width:1});
      } else {
        if (r) {
          l.stroke({color:"#999",width:1});
        }
      }
    });
    let b = -s.getWorldRotation(i).toEuler(l).z;
    let _ = Editor.Math.deg2rad(b);
    this._root.label.translate(n.x+19*Math.sin(_)+5*Math.cos(_),n.y-19*Math.cos(_)+5*Math.sin(_)).rotate(b,0,0);
    this._root.labelBG.translate(n.x+14*Math.sin(_),n.y-14*Math.cos(_)).rotate(b,0,0);
    if(this._currentName!==s.name){
      this._currentName = s.name;
      this._root.label.text(this._currentName);
      let t=this._root.label.bbox();
      this._root.labelBG.width(t.width+10);
      this._root.labelBG.height(t.height);
    }

    if (o) {
      this._root.bounds.stroke({color:"#09f",width:1});
      this._root.label.fill("none");
      this._root.labelBG.fill("none");
      this._root.labelBG.stroke({color:"none",width:1});
    } else {
      if (r) {
        this._root.bounds.stroke({color:"#999",width:1});
        this._root.label.fill("#333");
        this._root.labelBG.fill("#999");
        this._root.labelBG.stroke({color:"#999",width:1});
      }
    }
  } else {
    this._root.bounds.hide()
  }
}};