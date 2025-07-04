"use strict";let e=require("./editor-camera");const i=require("./grid");window.customElements.define("scene-grid",i);module.exports = class extends e{constructor(){
  super();
  this.settings = {speed:1,farClip:2046,nearClip:1};
}init(e){
  super.init(e);
  this._initGrid();
  this._initInnerNode();
  this.apply();
}_initGrid(){
  var e = [0,1,1];
  var i = [1,0,1];
  _Scene.view.$grid.setScaleH([5,2],.01,5e3);
  _Scene.view.$grid.setMappingH(e[0],e[1],e[2]);
  _Scene.view.$grid.setScaleV([5,2],.01,5e3);
  _Scene.view.$grid.setMappingV(i[0],i[1],i[2]);
  _Scene.view.$grid.setAnchor(.5,.5);
}_initInnerNode(){
  let e=new cc.Node("Design Resolution");
  this._designResolutionCtx = e.addComponent(cc.Graphics);
  e.parent = _Scene.view.foregroundNode;
  e.zIndex = 1-cc.macro.MAX_ZINDEX;
  cc.engine.on("design-resolution-changed",this.onDesignResolutionChanged,this);
}_drawDesignResolution(){
  let e = cc.engine.getDesignResolutionSize();
  let i = this._designResolutionCtx;
  i.lineWidth = 2;
  i.strokeColor = cc.color("#AA00AA");
  i.clear();
  i.rect(0,0,this.tool.scale*e.width,this.tool.scale*e.height);
  i.stroke();
  i.node.scale = 1/this.tool.scale;
}_updateGrid(e,i,t,s){let n=_Scene.view.$grid;if (n.hticks) {
  for(let c=n.hticks.minTickLevel;c<=n.hticks.maxTickLevel;++c){let o=n.hticks.tickRatios[c];if(o>0){let a=t.clone();a.a = 255*o;let r=n.hticks.ticksAtLevel(c,true);for(let t=0;t<r.length;++t){
    let n=r[t];
    e.push(cc.v2(n,-s));
    e.push(cc.v2(n,s));
    i.push(a);
    i.push(a);
  }}}
}if (n.vticks) {
  for(let c=n.vticks.minTickLevel;c<=n.vticks.maxTickLevel;++c){let o=n.vticks.tickRatios[c];if(o>0){let a=t.clone();a.a = 255*o;let r=n.vticks.ticksAtLevel(c,true);for(let t=0;t<r.length;++t){
    let n=r[t];
    e.push(cc.v2(-s,n));
    e.push(cc.v2(s,n));
    i.push(a);
    i.push(a);
  }}}
}}onDesignResolutionChanged(){
  this._updateOrthoSize();
  this._drawDesignResolution();
}setActive(e){
  if (e) {
    _Scene.view.$grid.style.display = "";
    this._designResolutionCtx.node.active = true;
  } else {
    _Scene.view.$grid.style.display = "none";
    this._designResolutionCtx.node.active = false;
  }
}zoomTo(e,i,t){
  this.tool.scale = e;
  i = void 0!==i?i:this.offsetWidth/2|0;
  t = void 0!==t?t:this.offsetHeight/2|0;
  _Scene.view.$grid.xAxisScaleAt(i,e);
  _Scene.view.$grid.yAxisScaleAt(t,e);
  _Scene.view.$grid.repaint();
  _Scene.view.$gizmosView.scale = e;
  this.apply();
}initPosition(e,i,t){
  this.tool.scale = t;
  _Scene.view.$grid.xAxisSync(e,t);
  _Scene.view.$grid.yAxisSync(i,t);
  _Scene.view.$grid.repaint();
  _Scene.view.$gizmosView.scale = t;
  this.apply();
}apply(){
  let e = _Scene.view.$grid.xDirection*_Scene.view.$grid.xAxisOffset;
  let i = _Scene.view.$grid.yDirection*_Scene.view.$grid.yAxisOffset;
  let t = this.tool.scale;
  let s = cc.v2(cc.game.canvas.width/2/t-e/t,cc.game.canvas.height/2/t-i/t);
  this.eye.set(cc.v3(s.x,s.y,1e3));
  this._drawDesignResolution();
  this._updateOrthoSize(t);
  this.updateCamera();
}_updateOrthoSize(e){
  e = e=this.tool.scale;
  this.tool._camera.orthoSize = cc.game.canvas.height/2/cc.view._scaleY/e;
}adjustSceneToNodes(e,i){
  let t;
  i = i||50;
  let s = -1e10;
  let n = -1e10;
  let c = 1e10;
  let o = 1e10;

  e.forEach(e=>{
    let i=cc.engine.getInstanceById(e);
    t = i.getBoundingBoxToWorld();
    s = Math.max(t.xMax,s);
    n = Math.max(t.yMax,n);
    c = Math.min(t.xMin,c);
    o = Math.min(t.yMin,o);
  });

  t = cc.rect(c,o,s-c,n-o);
  this.adjustToCenter(i,t);
}adjustToCenter(e,i){
  var t;
  var s;
  var n;
  var c;
  var o;
  if (i) {
    n = i.width;
    c = i.height;
    t = i.x;
    s = i.y;
  } else {
    var a=cc.engine.getDesignResolutionSize();
    n = a.width;
    c = a.height;
    t = 0;
    s = 0;
  }
  var r = _Scene.view.getBoundingClientRect();
  var l = r.width-2*e;
  var h = r.height-2*e;
  if (n<=l&&c<=h) {
    o = 1;
  } else {
    var d=Editor.Utils.fitSize(n,c,l,h);
    o = d[0]<d[1]?n<=0?1:d[0]/n:c<=0?1:d[1]/c;
    n = d[0];
    c = d[1];
  }this.initPosition(_Scene.view.$grid.xDirection*((r.width-n)/2-t*o),_Scene.view.$grid.yDirection*((r.height-c)/2-s*o),o)
}onMouseDown(e){if (3===e.which||2===e.which||this.movingScene) {
  e.stopPropagation();

  Editor.UI.startDrag("-webkit-grabbing",e,(e,i,t)=>{
    _Scene.view.$grid.pan(i,t);
    _Scene.view.$grid.repaint();
    this.apply();
  });

  return true;
}}onMouseWheel(e){
  var i=Editor.Utils.smoothScale(this.tool.scale,e.wheelDelta*this.settings.speed);
  i = Editor.Math.clamp(i,_Scene.view.$grid.hticks.minValueScale,_Scene.view.$grid.hticks.maxValueScale);
  this.tool.scale = i;
  _Scene.view.$grid.xAxisScaleAt(e.offsetX,i);
  _Scene.view.$grid.yAxisScaleAt(e.offsetY,i);
  _Scene.view.$grid.repaint();
  _Scene.view.$gizmosView.scale = i;
  this.apply();
}onMouseMove(){}onMouseUp(e){}onKeyDown(e){
  if ("space"===Editor.KeyCode(e.which)) {
    _Scene.view.style.cursor = "-webkit-grab";
    this.movingScene = true;
  }
}onKeyUp(e){
  if ("space"===Editor.KeyCode(e.which)) {
    _Scene.view.style.cursor = "";
    this.movingScene = false;
  }
}onResize(){
  let e=_Scene.view.getBoundingClientRect();

  if (!(0===e.width && 0===e.height)) {
    _Scene.view.$grid.resize();
    _Scene.view.$grid.repaint();
    _Scene.view.$gizmosView.resize();
    this.apply();
  }
}};