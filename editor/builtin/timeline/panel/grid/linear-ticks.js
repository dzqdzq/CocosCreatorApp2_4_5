"use strict";module.exports = class{constructor(){
  this.ticks = [];
  this.tickLods = [];
  this.tickRatios = [];
  this.minScale = .1;
  this.maxScale = 1e3;
  this.minValueScale = 1;
  this.maxValueScale = 1;
  this.minValue = -500;
  this.maxValue = 500;
  this.pixelRange = 500;
  this.minSpacing = 10;
  this.maxSpacing = 80;
}initTicks(i,t,s){
  if (t<=0) {
    t = 1;
  }

  if (s<=0) {
    s = 1;
  }

  if (s<t) {
    s = t;
  }

  this.tickLods = i;
  this.minScale = t;
  this.maxScale = s;
  this.ticks = [];
  let h = 1;
  let e = 0;
  this.ticks.push(h);
  let a = t;
  let c = s;
  let l = 1;
  let n = 1;
  for (; h*this.tickLods[e]<=c; ) {
    h *= this.tickLods[e];
    e = e+1>this.tickLods.length-1?0:e+1;
    this.ticks.push(h);
    l = h;
  }for (this.minValueScale=1/l*100,e=this.tickLods.length-1,h=1; h/this.tickLods[e]>=a; ) {
    h /= this.tickLods[e];
    e = e-1<0?this.tickLods.length-1:e-1;
    this.ticks.unshift(h);
    n = h;
  }
  this.maxValueScale = 1/n*100;
  return this;
}spacing(i,t){
  this.minSpacing = i;
  this.maxSpacing = t;
  return this;
}range(i,t,s){
  this.minValue = Math.fround(Math.min(i,t));
  this.maxValue = Math.fround(Math.max(i,t));
  this.pixelRange = s;
  this.minTickLevel = 0;
  this.maxTickLevel = this.ticks.length-1;
  for(let i=this.ticks.length-1;i>=0;--i){
    let t=this.ticks[i]*this.pixelRange/(this.maxValue-this.minValue);
    this.tickRatios[i] = (t-this.minSpacing)/(this.maxSpacing-this.minSpacing);

    if (this.tickRatios[i]>=1) {
      this.maxTickLevel = i;
    }

    if(t<=this.minSpacing){this.minTickLevel = i;break}
  }for (let i=this.minTickLevel; i<=this.maxTickLevel; ++i) {
    this.tickRatios[i] = Editor.Math.clamp01(this.tickRatios[i]);
  }return this
}ticksAtLevel(i,t){
  let s = [];
  let h = this.ticks[i];
  let e = Math.floor(this.minValue/h);
  let a = Math.ceil(this.maxValue/h);
  for (let c=e; c<=a; ++c) {
    if ((!t||i>=this.maxTickLevel || c%Math.round(this.ticks[i+1]/h)!=0)) {
      s.push(c*h);
    }
  }return s
}levelForStep(i){for (let t=0; t<this.ticks.length; ++t) {
  if (this.ticks[t]*this.pixelRange/(this.maxValue-this.minValue)>=i) {
    return t;
  }
}return-1}};