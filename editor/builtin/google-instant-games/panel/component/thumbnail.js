"use strict";
const e = require("fs");
const t = require("path");
const i = require("../lib/record");
const s = require("../lib/advice");
const r = require("../lib/info");
const h = 40;
const n = 22;
exports.template = e.readFileSync(t.join(__dirname,"../template/thumbnail.html"),"utf-8");
exports.props = ["width","select","record"];
exports.data = function(){return{spacing:0,minspacing:0,ms:0,offset:2,screenshots:[],proportion:1,length:0,imgw:0,mpointerx:-1,percentage:1}};

exports.watch = {ms(){this.minspacing = (this.$el.clientWidth-2*n)/this.ms;},spacing(){this.updateLength()},minspacing(){this.updateGrid()},width(){this.updateWidth()},proportion(){this.updateLength()},select(){
  if (this.select===this.record) {
    this.updatePercentage(this.percentage);
  }
}};

exports.methods = {initGrid(){
  let e=this.$els.grid;
  e.setScaleH([5,2,3,2],10,2e6,"time");
  e.xAxisScaleAt(0,this.minspacing);
  e.panX(1);
  e.setAnchor(0,0);

  requestAnimationFrame(()=>{
    e.resize();
    e.repaint();
  });
},updateWidth(){
  let e = (this.$el.clientWidth-2*n)/this.ms;
  let t = e/this.minspacing;
  this.minspacing = e;

  if (this.spacing<=this.minspacing) {
    this.spacing = this.minspacing;
  } else {
    this.spacing = this.spacing*t;
  }
},updateGrid(){
  if (!this._updateGridLock) {
    this._updateGridLock = true;

    requestAnimationFrame(()=>{
      let e=this.$els.grid;
      e.xAxisSync(2,this.spacing);
      e.resize();
      e.repaint();
      this._updateGridLock = false;
    });
  }
},updateLength(){
  let e=h/this.proportion;
  this.imgw = Math.floor(e);
  let t=this.spacing*this.ms/e;
  this.length = isNaN(t)?0:Math.floor(t);
  this.linew = Math.round(t%1*e/(this.length-1));
},querySrc(e){
  e = Math.floor(e/this.length*this.screenshots.length);
  return this.screenshots[e]||"";
},queryImgStyle(e,t,i){return`width: ${e}px; left: ${(this.spacing*this.ms+4)/this.length*t}; transform: translateX(${i}px) scaleY(-1);`},scale(e,t){
  let i = this.$els.grid;
  let r = Editor.Utils.smoothScale(this.spacing,e);
  r = Editor.Math.clamp(r,i.hticks.minValueScale,i.hticks.maxValueScale);
  r = Math.max(r,this.minspacing);
  r = Math.min(r,10*this.minspacing);
  i.xAxisScaleAt(t,r);

  if (i.xAxisOffset>2) {
    i.panX(-i.xAxisOffset);
  }

  i.repaint();
  this.spacing = r;
  this.offset = i.xAxisOffset;
  let h=Math.floor((this.minspacing-this.spacing)*this.ms)+2;

  if (i.xAxisOffset+e<h) {
    this.move(h-i.xAxisOffset);
  }

  s.emit("change-preview",{percentage:0,src:"",record:this.record});
},move(e){
  let t=this.$els.grid;if (t.xAxisOffset+e>2) {
    e = t.xAxisOffset-2;
  } else {
    let i=Math.floor((this.minspacing-this.spacing)*this.ms)+2;

    if (t.xAxisOffset+e<i) {
      e = i-t.xAxisOffset;
    }
  }
  t.panX(e);
  t.repaint();
  this.offset = t.xAxisOffset;
  s.emit("change-preview",{percentage:0,src:"",record:this.record});
},moveNeedle(e){
  let t = this.$els.grid;
  let i = this.spacing*this.ms+4;
  let s = i*this.percentage-t.xAxisOffset;
  this.percentage = (s+e+t.xAxisOffset)/i;

  if (this.percentage<0) {
    this.percentage = 0;
  } else {
    if (this.percentage>1) {
      this.percentage = 1;
    }
  }

  if (this.select===this.record) {
    this.updatePercentage(this.percentage);
  }
},_onDragStart(e){Editor.UI.startDrag("-webkit-grabbing",e,(e,t,i,s,r)=>{this.moveNeedle(t)},(...e)=>{})},_onMouseDown(e){if(0===e.button){
  let t = this.$els.grid;
  let i = this.spacing*this.ms+4;
  this.percentage = Math.min((-t.xAxisOffset+(e.clientX-30-158))/i,1);

  if (this.select===this.record) {
    this.updatePercentage(this.percentage);
  }

  if (this.select===this.record) {
    s.emit("record-modify",this.record,true);
  }

  return;
}if(2===e.button){
  this.$els.grid;
  Editor.UI.startDrag("-webkit-grabbing",e,(e,t,i,s,r)=>{this.move(t)},(...e)=>{});
  return;
}},_onMouseWheel(e){
  this.$els.grid;

  if (Math.abs(e.deltaX)>Math.abs(e.deltaY)) {
    this.move(e.deltaX);
  } else {
    this.scale(-e.deltaY,e.clientX-30);
  }
},_onMouseLeave(e){
  this.mpointerx = -1;
  s.emit("change-preview",{percentage:0,src:"",record:this.record});
},_onMouseMove(e){
  let t = this.$els.grid;
  let i = e.clientX-30-158;
  this.mpointerx = i;
  let r = this.spacing*this.ms+4;
  let h = (i-t.xAxisOffset)/r;
  let n = Math.floor(h*this.screenshots.length);
  s.emit("change-preview",{percentage:i/(this.$el.clientWidth-20),src:this.screenshots[n]||"",record:this.record})
},updatePercentage(e){s.emit("change-range",e)}};

exports.computed = {};

exports.compiled = function(){
  let e=i.queryRecordScreenshots(this.record.path,1);

  e.forEach(e=>{
    let t=document.createElement("img");
    t.src = e;
    let i=()=>{
      t.removeEventListener("load",i);
      this.proportion = t.clientHeight/t.clientWidth;
    };
    t.addEventListener("load",i);
    this.$els.cache.appendChild(t);
  });

  this.screenshots = e;
  this.percentage = r.queryScope(this.record.path);

  if (this.select===this.record) {
    this.updatePercentage(this.percentage);
  }

  this.ms = i.queryRecordMs(this.record.path);
  this.initGrid();
  process.nextTick(()=>{this.updateWidth()});
};