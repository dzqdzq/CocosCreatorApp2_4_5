"use strict";
const e = Editor.require("scene://utils/node");
const {SegmentTool:t,CurveTool:i} = require("./trajectory-tool");
let o;
let n = require("./utils");
let s = n.Segment;
try{o = Editor.require("unpack://engine-dev/cocos/animation/motion-path-helper").sampleMotionPaths;}catch(e){o = Editor.require("unpack://engine-dev/cocos2d/animation/motion-path-helper").sampleMotionPaths;}
let l = cc.v2;
let r = 1e-6;
function a(e,t){return Math.abs(e-t)<r}class p extends Editor.Gizmo{init(){
  this._selectedSegTool = null;
  this._selectedCurveTool = null;
  this._animationState = null;
  this._sampledCurve = null;
  this._clip = null;
  this._childPath = "";
  this._lastMapping = null;
  this._curParentMatrix = cc.mat4();
  this._lastParentMatrix = cc.mat4();
  this._segments = [];
  this._processing = false;
  this._clipChanging = false;
}}

p.prototype.show = function(e,t,i){
  if (!e) {
    return;
  }let o=e.getComponent(cc.Animation);if (!o) {
    return;
  }let n=o.getAnimationState(t.name);if (!n) {
    Editor.error(`Cant't find animation state with clip name [${t.name}]`);
    return;
  }
  Editor.Gizmo.prototype.show.call(this);
  this._animationState = n;
  this._clip = t;
  this._childPath = i;
  this._initSampledCurve();
  this._initSegments();
};

p.prototype.onCreateRoot = function(){
  let e=this._root;
  this._sampledCurveGroup = e.group();
  this._curveGroup = e.group();
  this._segmentGroup = e.group();
};

p.prototype._viewDirty = function(){
  let t = cc.director.getScene();
  let i = e.getWorldPosition(t);
  let o = this._view.worldToPixel(i);
  let n = false;

  if (!(this._lastMapping&&a(this._lastMapping.x,o.x) && a(this._lastMapping.y,o.y))) {
    n = true;
  }

  this._lastMapping = o;
  return n;
};

p.prototype._parentDirty = function(){
  let e = this.target.parent.getWorldMatrix(this._curParentMatrix);
  let t = this._lastParentMatrix;
  let i = false;

  if (!(t&&a(t.m[0],e.m[0])&&a(t.m[1],e.m[1])&&a(t.m[4],e.m[4])&&a(t.m[5],e.m[5])&&a(t.m[12],e.m[12]) && a(t.m[13],e.m[13]))) {
    i = true;
  }

  cc.Mat4.copy(t,e);
  return i;
};

p.prototype.visible = function(){return!this._hidden&&(this._viewDirty()||this._parentDirty())};

p.prototype.update = function(){
  if (this.targetValid()&&this.visible()) {
    this._updateSegments();
  }
};

p.prototype._pixelVecToArray = function(e){
  let t = this._view;
  let i = this.target.parent.convertToNodeSpaceAR(t.pixelToWorld(e));
  return[i.x,i.y]
};

p.prototype._segToArray = function(e){
  let t = this._pixelVecToArray(e.pos);
  let i = this._pixelVecToArray(e.inControl);
  let o = this._pixelVecToArray(e.outControl);
  return t.concat(i).concat(o)
};

p.prototype._initSegments = function(){
  let e = this._clip.getProperty("position","",this._childPath)||[];
  let t = [];
  for(let i=0,o=e.length;i<o;i++){
    let o = e[i];
    let n = new s;
    n.originValue = o.value;
    n.keyframe = o;
    t.push(n);
    let l=o.motionPath||[];for(let e=0;e<l.length;e++){
      let i = l[e];
      let o = new s;
      o.originValue = i;
      t.push(o);
    }
  }
  this._segments = t;
  this.initCurveTools();
  this._updateSegments();
};

p.prototype._updateSegments = function(){
  let e = this.target.parent;
  let t = this._view;
  function i(i,o){
    let n=cc.v2(i,o);
    n = e.convertToWorldSpaceAR(n);
    return t.worldToPixel(n);
  }let o=this._segments;for(let e=0,t=o.length;e<t;e++){
    let t = o[e];
    let n = t.originValue;

    if (2===n.length||3===n.length) {
      t.pos = i(n[0],n[1]);
      t.inControl = t.pos.clone();
      t.outControl = t.pos.clone();
    } else {
      if (6===n.length) {
        t.pos = i(n[0],n[1]);
        t.inControl = i(n[2],n[3]);
        t.outControl = i(n[4],n[5]);
      }
    }

    t.tool.plot();

    if (t.keyframe) {
      t.tool.curveTools[0].plot();
    }
  }
};

p.prototype._createSegmentTool = function(e){
  let i = this._segmentGroup;
  let o = this;
  let n = false;

  let s = new t(i,e,{beforeSelected:function(e){
    if (-1===e.curveTools.indexOf(o._selectedCurveTool)) {
      e.curveTools[0].select();
    }

    if (o._selectedSegTool) {
      o._selectedSegTool.unselect();
    }

    o._selectedSegTool = e;
  },onDelete:function(e){o._removeSegment(e)},start:function(){
    o._processing = true;
    o._initSampledCurve();
    n = false;
  },update:function(e){
    n = true;
    e.curveTools.forEach(function(e){e.plot()});
    o._updateSampledCurves();
    o._animationState.sample();
    cc.engine.repaintInEditMode();
  },end:function(){
    o._processing = false;

    if (n) {
      o._clipChanged();
    }
  }});

  e.tool = s;
  return s;
};

p.prototype.initCurveTools = function(){
  let e = this._segments;
  let t = this._curveGroup;
  let o = this._segmentGroup;
  t.clear();
  o.clear();
  let n = this;

  let s = {beforeSelected:function(e){
    if (n._selectedCurveTool) {
      n._selectedCurveTool.unselect();
    }

    n._selectedCurveTool = e;
  },addSegment:function(e,t){let i=l(e,t);n._addSegment(i)}};

  let r = i(t,"",s);
  for(let o=0,n=e.length;o<n;o++){
    let l = e[o];
    let a = this._createSegmentTool(l);
    a.curveTools.push(r);
    r.segmentTools.push(a);

    if (o>0&&l.keyframe) {
      r.plot();

      if (o<n-1) {
        (r=i(t,"",s)).segmentTools.push(a);
        a.curveTools.push(r);
      }
    }
  }
};

p.prototype._addSegment = function(e){
  let t=this._selectedCurveTool;if (!t) {
    return;
  }
  let i;
  let o;
  let s = t.segmentTools;
  for(let t=0,l=s.length-1;t<l;t++){
    o = s[t];
    let l = s[t+1];
    let r = n.getNearestParameter(o.segment,l.segment,e);

    if ((!i || r.dist<i.dist)) {
      (i=r).seg1 = o;
      i.seg2 = l;
    }
  }let l=n.createSegmentWithNearset(i);
  l.originValue = this._segToArray(l);
  let r = this._segments;
  let a = r.indexOf(i.seg2.segment);
  r.splice(a,0,l);
  o = this._createSegmentTool(l);
  let p=t.segmentTools.indexOf(i.seg2);
  t.segmentTools.splice(p,0,o);
  o.curveTools.push(t);
  o.show();
  o.select();
  t.plot();
  this._updateSampledCurves();
  this._clipChanged();
};

p.prototype._addKeySegment = function(e,t,i){
  let o;
  let n;
  if (0===i.length||t<i[0].frame) {
    o = 0;
  } else {
    for (o=0,n=i.length; o<n&&!(i[o].frame>t); o++)
      {}
  }let s={frame:t,value:[e.x,e.y],motionPath:[]};
  i.splice(o,0,s);
  return o;
};

p.prototype._removeSegment = function(e){
  let t = this._segments;
  let i = e.segment;
  let o = e.curveTools[0];
  let n = o.segmentTools;
  e.hide();
  t.splice(t.indexOf(i),1);
  n.splice(n.indexOf(e),1);
  o.plot();
  this._updateSampledCurves();
  this._clipChanged();

  if (this._selectedSegTool===e) {
    this._selectedSegTool = null;
  }
};

p.prototype._clipChanged = function(){
  this._clipChanging = true;
  Editor.Ipc.sendToWins("scene:animation-clip-changed",{uuid:this._clip._uuid,data:this._clip.serialize(),clip:this._clip.name});
};

p.prototype._initSampledCurve = function(){
  let e;
  let t = this._animationState.curves;
  for(let i=0,o=t.length;i<o;i++){let o=t[i];if(o.target===this.target&&"position"===o.prop){e = o;break}}
  this._sampledCurve = e;
};

p.prototype._updateSampledCurves = function(){
  let e;
  let t;
  let i;
  let n = this._segments;
  let s = [];
  let l = this._clip;
  let r = this._sampledCurve;
  if (!r) {
    return;
  }let a=Editor.Math.numOfDecimalsF(1/this._view.scale);function p(e){for (let t=0,i=e.length; t<i; t++) {
    e[t] = Editor.Math.toPrecision(e[t],a);
  }return e}for(t=0,i=n.length;t<i;t++){let i=n[t];if(i.keyframe){
    e = i.keyframe;
    i.originValue = e.value=p(this._pixelVecToArray(i.pos));
    e.motionPath = [];
    s.push(e);
    continue
  }let o=i.originValue=p(this._segToArray(i));e.motionPath.push(o)}let u=[];for(r.ratios=[],r.types=[],r.values=[],t=0,i=s.length;t<i;t++){
    let i=(e=s[t]).frame/l.duration;
    r.ratios.push(i);
    r.values.push(e.value);
    r.types.push(e.curve);

    if (e.motionPath&&e.motionPath.length>0) {
      u.push(e.motionPath);
    } else {
      u.push(null);
    }
  }o(u,r,l.duration,l.sample)
};

p.prototype.assetChanged = function(e){
  let t=this._clip;

  if (t&&t._uuid===e&&!this._hidden) {
    cc.assetManager.loadAny(e,function(e,t){this.updateClip(t)}.bind(this));
  }
};

p.prototype.updateClip = function(e){
  if (this._clipChanging) {
    this._clipChanging = false;
    return;
  }

  if (!(this._clip._uuid!==e._uuid || this._hidden)) {
    this._clip = e;
    this._initSampledCurve();
    this._initSegments();
  }
};

p.animationChanged = false;
p.state = "segment";
module.exports = p;