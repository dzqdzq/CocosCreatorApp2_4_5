"use strict";
const t = require("numeral");
const e = require("pixi.js");
const i = require("./linear-ticks");
function s(t){return Math.floor(t)}function h(t,e){
  e = (e-=t)||1/e;
  return function(i){return(i-t)/e};
}function l(t,e){return function(i){return t*(1-i)+e*i}}
e.utils._saidHello = true;

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
  this.renderer = null;
  this.stage = null;
  this.bgGraphics = null;
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
  this._xAnchorOffset = 0;
  this._yAnchorOffset = 0;
}connectedCallback(){
  let t=this.canvas.element.getBoundingClientRect();
  this.renderer = new e.WebGLRenderer(t.width,t.height,{view:this.canvas.element,transparent:true,antialias:false,forceFXAA:false});
  this.stage = new e.Container;
  let i=new e.Container;
  this.stage.addChild(i);
  this.bgGraphics = new e.Graphics;
  i.addChild(this.bgGraphics);
}static get observedAttributes(){return["show-label-h","show-label-v"]}attributeChangedCallback(t,e,i){switch(t){case"show-label-h":case"show-label-v":this._updateLabel()}}setAnchor(t,e){
  this.xAnchor = Editor.Math.clamp(t,-1,1);
  this.yAnchor = Editor.Math.clamp(e,-1,1);
}setScaleH(t,e,s,h){
  this.hticks = (new i).initTicks(t,e,s).spacing(10,80);
  this.xAxisScale = Editor.Math.clamp(this.xAxisScale,this.hticks.minValueScale,this.hticks.maxValueScale);

  if ("frame"===h) {
    this.hformat = (t => Editor.Utils.formatFrame(t,sample||60));
  } else {
    if ("time"===h) {
      this.hformat = (t => t<1e3?`${t.toFixed(2)}ms`:t<6e4?`${(t/1e3).toFixed(2)}s`:t<36e5?`${(t/6e4).toFixed(2)}m`:`${(t/36e5).toFixed(2)}h`);
    }
  }

  this.pixelToValueH = (t => (t-this.xAxisOffset)/this.xAxisScale);
  this.valueToPixelH = (t => t*this.xAxisScale+this.xAxisOffset);
}setMappingH(t,e,i){
  this._xAnchorOffset = t/(e-t);
  this.xDirection = e-t>0?1:-1;

  this.pixelToValueH = (s => {
    let a = this.xAxisOffset;
    let n = this.canvas.width/i;
    let c = h(0,this.canvas.width);
    return l(t*n,e*n)(c(s-a))/this.xAxisScale
  });

  this.valueToPixelH = (s => {
    let a = this.xAxisOffset;
    let n = this.canvas.width/i;
    let c = h(t*n,e*n);
    return l(0,this.canvas.width)(c(s*this.xAxisScale))+a
  });
}setScaleV(t,e,s,h){
  this.vticks = (new i).initTicks(t,e,s).spacing(10,80);
  this.yAxisScale = Editor.Math.clamp(this.yAxisScale,this.vticks.minValueScale,this.vticks.maxValueScale);

  if ("frame"===h) {
    this.vformat = (t => Editor.Utils.formatFrame(t,60));
  } else {
    if ("time"===h) {
      this.hformat = (t => t<1e3?`${t.toFixed(2)}ms`:t<6e4?`${(t/1e3).toFixed(2)}s`:t<36e5?`${(t/6e4).toFixed(2)}m`:`${(t/36e5).toFixed(2)}h`);
    }
  }

  this.pixelToValueV = (t => (this.canvas.height-t+this.yAxisOffset)/this.yAxisScale);
  this.valueToPixelV = (t => -t*this.yAxisScale+this.canvas.height+this.yAxisOffset);
}setMappingV(t,e,i){
  this._yAnchorOffset = t/(e-t);
  this.yDirection = e-t>0?1:-1;

  this.pixelToValueV = (s => {
    let a = this.yAxisOffset;
    let n = this.canvas.height/i;
    let c = h(0,this.canvas.height);
    return l(t*n,e*n)(c(s-a))/this.yAxisScale
  });

  this.valueToPixelV = (s => {
    let a = this.yAxisOffset;
    let n = this.canvas.height/i;
    let c = h(t*n,e*n);
    return l(0,this.canvas.height)(c(s*this.yAxisScale))+a
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

  if (this.renderer) {
    this.renderer.resize(this.canvas.width,this.canvas.height);
  }
}repaint(){
  if (this.renderer) {
    this._updateGrids();
    this._updateLabel();

    if (!this._requestID) {
      this._requestID = window.requestAnimationFrame(()=>{
        this._requestID = null;
        this.renderer.render(this.stage);
      });
    }
  }
}_updateGrids(){
  let t;
  let e;
  let i;
  let h;
  this.bgGraphics.clear();
  this.bgGraphics.beginFill("#171717");
  if(this.hticks){
    let h = this.pixelToValueH(0);
    let l = this.pixelToValueH(this.canvas.width);
    this.hticks.range(h,l,this.canvas.width);for (let h=this.hticks.minTickLevel; h<=this.hticks.maxTickLevel; ++h) {
      if((e=this.hticks.tickRatios[h])>0){
        this.bgGraphics.lineStyle(1,"#171717",.5*e);
        t = this.hticks.ticksAtLevel(h,true);
        for (let e=0; e<t.length; ++e) {
          i = this.valueToPixelH(t[e]);
          this.bgGraphics.moveTo(s(i),-1);
          this.bgGraphics.lineTo(s(i),this.canvas.height);
        }
      }
    }
  }if(this.vticks){
    let i = this.pixelToValueV(0);
    let l = this.pixelToValueV(this.canvas.height);
    this.vticks.range(i,l,this.canvas.height);for (let i=this.vticks.minTickLevel; i<=this.vticks.maxTickLevel; ++i) {
      if((e=this.vticks.tickRatios[i])>0){
        this.bgGraphics.lineStyle(1,"#171717",.5*e);
        t = this.vticks.ticksAtLevel(i,true);
        for (let e=0; e<t.length; ++e) {
          h = this.valueToPixelV(t[e]);
          this.bgGraphics.moveTo(0,s(h));
          this.bgGraphics.lineTo(this.canvas.width,s(h));
        }
      }
    }
  }
  this.bgGraphics.endFill();

  if (this.showDebugInfo) {
    this.set("debugInfo.xAxisScale",this.xAxisScale.toFixed(3));
    this.set("debugInfo.xAxisOffset",this.xAxisOffset.toFixed(3));

    if (this.hticks) {
      this.set("debugInfo.xMinLevel",this.hticks.minTickLevel);
      this.set("debugInfo.xMaxLevel",this.hticks.maxTickLevel);
    }

    this.set("debugInfo.yAxisScale",this.yAxisScale.toFixed(3));
    this.set("debugInfo.yAxisOffset",this.yAxisOffset.toFixed(3));

    if (this.vticks) {
      this.set("debugInfo.yMinLevel",this.vticks.minTickLevel);
      this.set("debugInfo.yMaxLevel",this.vticks.maxTickLevel);
    }
  }
}_updateLabel(){if (null!==this.getAttribute("show-label-h")&&this.hticks) {
  let e = this.hticks.levelForStep(50);
  let i = this.hticks.ticksAtLevel(e,false);
  let h = this.hticks.ticks[e];
  let l = Math.max(0,-Math.floor(Math.log10(h)));
  let a = "0,"+Number(0).toFixed(l);
  for(i.forEach((e,i)=>{
    let h = s(this.valueToPixelH(e))+5;
    let l = this.label.hElement.children[i];

    if (!l) {
      l = document.createElement("span");
      this.label.hElement.appendChild(l);
    }

    if (this.hformat) {
      l.innerText = this.hformat(e);
    } else {
      l.innerText = t(e).format(a);
    }

    l.style.transform = `translateX(${s(h)}px)`;
  });this.label.hElement.children.length>i.length;){
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
  let e = this.vticks.levelForStep(50);
  let i = this.vticks.ticksAtLevel(e,false);
  let h = this.vticks.ticks[e];
  let l = Math.max(0,-Math.floor(Math.log10(h)));
  let a = "0,"+Number(0).toFixed(l);
  for(i.forEach((e,i)=>{
    let h = s(this.valueToPixelV(e))-15;
    let l = this.label.vElement.children[i];

    if (!l) {
      l = document.createElement("span");
      this.label.vElement.appendChild(l);
    }

    if (this.vformat) {
      l.innerText = this.vformat(e);
    } else {
      l.innerText = t(e).format(a);
    }

    l.style.transform = `translateY(${s(h)}px)`;
  });this.label.vElement.children.length>i.length;){
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