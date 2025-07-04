"use strict";
const t = require("numeral");
const e = require("./linear-ticks");
function i(t){return Math.floor(t)}function s(t,e){
  e = (e-=t)||1/e;
  return function(i){return(i-t)/e};
}function h(t,e){return function(i){return t*(1-i)+e*i}}

module.exports = class extends window.HTMLElement{constructor(){
  super();
  this.canvas = {element:document.createElement("canvas"),width:0,height:0};
  this.label = {vElement:document.createElement("div"),vLabels:[],hElement:document.createElement("div"),hLabels:[]};
  this.hticks = null;
  this.xAxisScale = 1;
  this.xAxisOffset = 0;
  this.xAnchor = .5;
  this.vticks = null;
  this.yAxisScale = 1;
  this.yAxisOffset = 0;
  this.yAnchor = .5;
  this.attachShadow({mode:"open"});
  let t=document.createElement("style");
  t.type = "text/css";
  t.textContent = require("fs").readFileSync(require("path").join(__dirname,"./grid.css"),"utf-8");
  this.shadowRoot.appendChild(t);
  this.shadowRoot.appendChild(this.canvas.element);
  this.label.vElement.className = "vLabels";
  this.shadowRoot.appendChild(this.label.vElement);
  this.label.hElement.className = "hLabels";
  this.shadowRoot.appendChild(this.label.hElement);
}static get observedAttributes(){return["show-label-h","show-label-v"]}attributeChangedCallback(t,e,i){switch(t){case"show-label-h":case"show-label-v":this._updateLabel()}}setAnchor(t,e){
  this.xAnchor = Editor.Math.clamp(t,-1,1);
  this.yAnchor = Editor.Math.clamp(e,-1,1);
}setScaleH(t,i,s,h){
  this.hticks = (new e).initTicks(t,i,s).spacing(10,80);
  this.xAxisScale = Editor.Math.clamp(this.xAxisScale,this.hticks.minValueScale,this.hticks.maxValueScale);

  if ("frame"===h) {
    this.hformat = (t => Editor.Utils.formatFrame(t,60));
  }

  this.pixelToValueH = (t => (t-this.xAxisOffset)/this.xAxisScale);
  this.valueToPixelH = (t => t*this.xAxisScale+this.xAxisOffset);
}setMappingH(t,e,i){
  this._xAnchorOffset = t/(e-t);
  this.xDirection = e-t>0?1:-1;

  this.pixelToValueH = (l => {
    let a = this.xAxisOffset;
    let n = this.canvas.width/i;
    let c = s(0,this.canvas.width);
    return h(t*n,e*n)(c(l-a))/this.xAxisScale
  });

  this.valueToPixelH = (l => {
    let a = this.xAxisOffset;
    let n = this.canvas.width/i;
    let c = s(t*n,e*n);
    return h(0,this.canvas.width)(c(l*this.xAxisScale))+a
  });
}setScaleV(t,i,s,h){
  this.vticks = (new e).initTicks(t,i,s).spacing(10,80);
  this.yAxisScale = Editor.Math.clamp(this.yAxisScale,this.vticks.minValueScale,this.vticks.maxValueScale);

  if ("frame"===h) {
    this.vformat = (t => Editor.Utils.formatFrame(t,60));
  }

  this.pixelToValueV = (t => (this.canvas.height-t+this.yAxisOffset)/this.yAxisScale);
  this.valueToPixelV = (t => -t*this.yAxisScale+this.canvas.height+this.yAxisOffset);
}setMappingV(t,e,i){
  this._yAnchorOffset = t/(e-t);
  this.yDirection = e-t>0?1:-1;

  this.pixelToValueV = (l => {
    let a = this.yAxisOffset;
    let n = this.canvas.height/i;
    let c = s(0,this.canvas.height);
    return h(t*n,e*n)(c(l-a))/this.yAxisScale
  });

  this.valueToPixelV = (l => {
    let a = this.yAxisOffset;
    let n = this.canvas.height/i;
    let c = s(t*n,e*n);
    return h(0,this.canvas.height)(c(l*this.yAxisScale))+a
  });
}pan(t,e){
  this.panX(t);
  this.panY(e);
}panX(t){
  if (!this.valueToPixelH) {
    return;
  }
  let e;
  let i;
  let s = this.xAxisOffset+t;
  this.xAxisOffset = 0;

  if (void 0!==this.xMinRange&&null!==this.xMinRange) {
    e = this.valueToPixelH(this.xMinRange);
  }

  if (void 0!==this.xMaxRange&&null!==this.xMaxRange) {
    i = this.valueToPixelH(this.xMaxRange);
    i = Math.max(0,i-this.canvas.width);
  }

  this.xAxisOffset = s;
  return void 0!==e&&void 0!==i?(this.xAxisOffset=Editor.Math.clamp(this.xAxisOffset,-i,-e),void 0):void 0!==e?(this.xAxisOffset=Math.min(this.xAxisOffset,-e),void 0):void 0!==i?(this.xAxisOffset=Math.max(this.xAxisOffset,-i),void 0):void 0;
}panY(t){
  if (!this.valueToPixelV) {
    return;
  }
  let e;
  let i;
  let s = this.yAxisOffset+t;
  this.yAxisOffset = 0;

  if (void 0!==this.yMinRange&&null!==this.yMinRange) {
    e = this.valueToPixelV(this.yMinRange);
  }

  if (void 0!==this.yMaxRange&&null!==this.yMaxRange) {
    i = this.valueToPixelV(this.yMaxRange);
    i = Math.max(0,i-this.canvas.height);
  }

  this.yAxisOffset = s;
  return void 0!==e&&void 0!==i?(this.yAxisOffset=Editor.Math.clamp(this.yAxisOffset,-i,-e),void 0):void 0!==e?(this.yAxisOffset=Math.min(this.yAxisOffset,-e),void 0):void 0!==i?(this.yAxisOffset=Math.max(this.yAxisOffset,-i),void 0):void 0;
}xAxisScaleAt(t,e){let i=this.pixelToValueH(t);this.xAxisScale = Editor.Math.clamp(e,this.hticks.minValueScale,this.hticks.maxValueScale);let s=this.valueToPixelH(i);this.pan(t-s,0)}yAxisScaleAt(t,e){let i=this.pixelToValueV(t);this.yAxisScale = Editor.Math.clamp(e,this.vticks.minValueScale,this.vticks.maxValueScale);let s=this.valueToPixelV(i);this.pan(0,t-s)}xAxisSync(t,e){
  this.xAxisOffset = t;
  this.xAxisScale = e;
}yAxisSync(t,e){
  this.yAxisOffset = t;
  this.yAxisScale = e;
}resize(t,e){
  if(!t||!e){
    let i=this.canvas.element.getBoundingClientRect();
    t = t||i.width;
    e = e||i.height;
    t = Math.round(t);
    e = Math.round(e);
  }

  if (0!==this.canvas.width) {
    this.panX((t-this.canvas.width)*(this.xAnchor+this._xAnchorOffset));
  }

  if (0!==this.canvas.height) {
    this.panY((e-this.canvas.height)*(this.yAnchor+this._yAnchorOffset));
  }

  this.canvas.width = t;
  this.canvas.height = e;
}repaint(){this._updateLabel()}_updateLabel(){if (null!==this.getAttribute("show-label-h")&&this.hticks) {
  let e = this.pixelToValueH(0);
  let s = this.pixelToValueH(this.canvas.width);
  this.hticks.range(e,s,this.canvas.width);
  let h = this.hticks.levelForStep(50);
  let l = this.hticks.ticksAtLevel(h,false);
  let a = this.hticks.ticks[h];
  let n = Math.max(0,-Math.floor(Math.log10(a)));
  let c = "0,"+Number(0).toFixed(n);
  for(l.forEach((e,s)=>{
    let h = i(this.valueToPixelH(e))+5;
    let l = this.label.hElement.children[s];

    if (!l) {
      l = document.createElement("span");
      this.label.hElement.appendChild(l);
    }

    l.innerText = t(e).format(c);
    l.style.transform = `translateX(${i(h)}px)`;
  });this.label.hElement.children.length>l.length;){
    let t = this.label.hElement.children.length-1;
    let e = this.label.hElement.children[t];
    this.label.hElement.removeChild(e)
  }
} else {
  for(;this.label.hElement.children.length>0;){
    let t = this.label.hElement.children.length-1;
    let e = this.label.hElement.children[t];
    this.label.hElement.removeChild(e)
  }
}if (null!==this.getAttribute("show-label-v")&&this.vticks) {
  let e = this.pixelToValueV(0);
  let s = this.pixelToValueV(this.canvas.height);
  this.vticks.range(e,s,this.canvas.height);
  let h = this.vticks.levelForStep(50);
  let l = this.vticks.ticksAtLevel(h,false);
  let a = this.vticks.ticks[h];
  let n = Math.max(0,-Math.floor(Math.log10(a)));
  let c = "0,"+Number(0).toFixed(n);
  for(l.forEach((e,s)=>{
    let h = i(this.valueToPixelV(e))-15;
    let l = this.label.vElement.children[s];

    if (!l) {
      l = document.createElement("span");
      this.label.vElement.appendChild(l);
    }

    l.innerText = t(e).format(c);
    l.style.transform = `translateY(${i(h)}px)`;
  });this.label.vElement.children.length>l.length;){
    let t = this.label.vElement.children.length-1;
    let e = this.label.vElement.children[t];
    this.label.vElement.removeChild(e)
  }
} else {
  for(;this.label.vElement.children.length>0;){
    let t = this.label.vElement.children.length-1;
    let e = this.label.vElement.children[t];
    this.label.vElement.removeChild(e)
  }
}}};