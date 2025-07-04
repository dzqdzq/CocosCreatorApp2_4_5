"use strict";
const t = require("fire-fs");
const e = require("path");
const s = require("../libs/advice");
const i = require("../libs/manager");
const r = {linear:{e:"Linear",c:"Default"},quadIn:{e:"Ease In",c:"Quad"},quadOut:{e:"Ease Out",c:"Quad"},quadInOut:{e:"Ease In Out",c:"Quad"},cubicIn:{e:"Ease In",c:"Cubic"},cubicOut:{e:"Ease Out",c:"Cubic"},cubicInOut:{e:"Ease In Out",c:"Cubic"},quartIn:{e:"Ease In",c:"Quart"},quartOut:{e:"Ease Out",c:"Quart"},quartInOut:{e:"Ease In Out",c:"Quart"},quintIn:{e:"Ease In",c:"Quint"},quintOut:{e:"Ease Out",c:"Quint"},quintInOut:{d:"Ease In Out",c:"Quint"},sineIn:{e:"Ease In",c:"Sine"},sineOut:{e:"Ease Out",c:"Sine"},sineInOut:{e:"Ease In Out",c:"Sine"},expoIn:{e:"Ease In",c:"Expo"},expoOut:{e:"Ease Out",c:"Expo"},expoInOut:{e:"Ease In Out",c:"Expo"},circIn:{e:"Ease In",c:"Circ"},circOut:{e:"Ease Out",c:"Circ"},circInOut:{e:"Ease In Out",c:"Circ"},constant:{e:"Constant",c:"Default"}};
exports.template = t.readFileSync(e.join(__dirname,"../template/edit-line.html"),"utf-8");
exports.props = ["eline","width","height"];

exports.watch = {scale(){try{
  this.drawSquares();
  this.updateSide();
  this.updateControls();
}catch(t){Editor.error(t)}},width(){try{
  this.drawSquares();
  this.updateSide();
  this.updateControls();
}catch(t){Editor.error(t)}},height(){try{
  this.drawSquares();
  this.updateSide();
  this.updateControls();
}catch(t){Editor.error(t)}},side(){try{this.drawSquares()}catch(t){Editor.error(t)}},ease(){try{this.updateControls()}catch(t){Editor.error(t)}},class(){try{this.updateControls()}catch(t){Editor.error(t)}},controls(){try{this.updateBezier()}catch(t){Editor.error(t)}}};

exports.data = function(){return {dirty:false,scale:1,side:0,num:10,hlines:[],vlines:[],bezier:"",controls:[],ease:"Linear",class:"Default",types:{Custom:{Custom:[.4,.4,.6,.6]},Constant:{Default:[]},Linear:{Default:[.3,.3,.7,.7]},"Ease In":{Cubic:[.4,0,.5,.5],Quad:[.55,.08,.68,.53],Quart:[.89,.03,.68,.21],Quint:[.75,.05,.85,.06],Sine:[.48,0,.73,.71],Expo:[.95,.04,.79,.03],Circ:[.6,.04,.98,.33]},"Ease Out":{Cubic:[.06,.12,.58,1],Quad:[.25,.46,.45,.95],Quart:[.16,.84,.43,1],Quint:[.22,1,.31,1],Sine:[.39,.59,.56,1],Expo:[.18,1,.22,1],Circ:[.08,.82,.01,1]},"Ease In Out":{Cubic:[.42,0,.58,1],Quad:[.48,.04,.52,.96],Quart:[.83,0,.17,1],Quint:[.94,0,.06,1],Sine:[.46,.05,.54,.95],Expo:[1,0,0,1],Circ:[.86,.14,.14,.86]},Back:{Forward:[.18,.89,.31,1.21],Reverse:[.6,-.27,.73,.04]}}};};

exports.methods = {t:Editor.T,save(){
  let t;
  Object.keys(r).some(e=>{let s=r[e];return s.e===this.ease&&s.c===this.class&&(t=e,true);});

  if (!t) {
    t = this.types[this.ease][this.class];
  }

  let e=this.eline;
  i.Clip.mountCurveToKey(e.id,e.path,e.component,e.property,e.frame,t);
  this.dirty = false;
  s.emit("change-info");
},updateSide(){
  let t = this.$el.clientHeight-2;
  let e = this.$el.clientWidth-224-2;
  this.side = Math.min(t,e);
},updateControls(){
  let t=this.types[this.ease][this.class];if (!t||!t.length) {
    this.controls = [];
    return;
  }
  let e = .8*this.scale;
  let s = this.side*e;
  let i = (this.side-s)/2;
  let r = i;
  let a = i;
  let o = {x:r+t[0]*s,y:a+(1-t[1])*s,lx:r+0,ly:a+s};
  let n = {x:r+t[2]*s,y:a+(1-t[3])*s,lx:r+s,ly:a+0};
  this.controls = [o,n];
},drawSquares(){
  let t = .8*this.scale;
  let e = this.side*t;
  let s = (this.side-e)/2;
  let i = {x:s,y:s};
  let r = e/this.num;
  for(let t=0;t<=this.num;t++){
    let s=this.hlines[t];

    if (!s) {
      s = {x1:0,y1:0,x2:0,y2:0,color:"#2D2D2D"};
      this.hlines.splice(t,0,s);
    }

    s.x1 = Math.floor(i.x)+.5;
    s.y1 = Math.floor(i.y+r*t)+.5;
    s.x2 = Math.floor(i.x+e)+.5;
    s.y2 = Math.floor(i.y+r*t)+.5;
  }for(let t=0;t<this.num-1;t++){
    let s=this.vlines[t];

    if (!s) {
      s = {x1:0,y1:0,x2:0,y2:0,color:"#2D2D2D"};
      this.vlines.splice(t,0,s);
    }

    s.x1 = Math.floor(i.x+r*(t+1))+.5;
    s.y1 = Math.floor(i.y)+.5;
    s.x2 = Math.floor(i.x+r*(t+1))+.5;
    s.y2 = Math.floor(i.y+e)+.5;
  }
},updateBezier(){
  let t = .8*this.scale;
  let e = this.side*t;
  let s = (this.side-e)/2;
  let i = s;
  let r = s;
  let a = `M ${i} ${r+e}`;
  let o = this.controls;
  a = `${a=o&&o.length>0?`${a} C ${o[0].x},${o[0].y} ${o[1].x},${o[1].y}`:`${a} L ${i+e},${r+e}`} ${i+e},${r}`;
  this.bezier = a;
},_onEaseClick(t){
  this.ease = t;
  let e=Object.keys(this.types[t]);
  this.class = e[0];
  this.dirty = true;
},_onClassClick(t){
  this.class = t;
  this.dirty = true;
},_onCloseClick(){if(this.dirty){
  let t=Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("MESSAGE.cancel"),Editor.T("MESSAGE.save"),Editor.T("MESSAGE.dont_save")],title:Editor.T("timeline.home.edit_title"),message:Editor.T("timeline.home.edit_message"),detail:"",defaultId:0,cancelId:0,noLink:true});if (0===t) {
    return;
  }

  if (1===t) {
    this.save();
  }
}s.emit("change-eline",null)},_onSvgMouseWheel(t){
  t.stopPropagation();let e=this.scale+t.wheelDelta/1e3;

  if (e>1) {
    e = 1;
  }

  if (e<.1) {
    e = .1;
  }

  this.scale = e;
},_onControlPointMouseDown(t,e){
  let s = .8*this.scale;
  let i = this.side*s;
  let r = (this.side-i)/2;
  let a = r;
  let o = r;
  let n = this.types[this.ease][this.class];
  let u = this.controls.indexOf(e);
  this.ease = "Custom";
  this.class = "Custom";
  let h=this.types.Custom.Custom;
  n.forEach((t,e)=>{h[e] = t;});

  Editor.UI.startDrag("",t,(t,e,s,r,n)=>{
    if (0===e&&0===s) {
      return;
    }
    this.dirty = true;
    let l=this.controls[u];
    l.x += e;
    return l.x<0||l.x>this.side?(l.x-=e,void 0):(l.y+=s,l.y<0||l.y>this.side?(l.x-=e,l.y-=s,void 0):(u?(h[2]=(l.x-a)/i,h[3]=1-(l.y-o)/i):(h[0]=(l.x-a)/i,h[1]=1-(l.y-o)/i),this.updateBezier(),void 0));
  },(t,e,s,i,r)=>{});
}};

exports.created = function(){this.dirty = false;};

exports.compiled = function(){
  let t = this.eline;
  let e = i.Clip.queryInfo(t.id);
  let s = i.Clip.queryProperty(t.id,t.path,t.component,t.property);
  let a = "";
  for(let i=0;i<s.length;i++){
    let r=s[i];

    if (Math.round(r.frame*e.sample)===t.frame) {
      a = r.curve;
    }
  }

  if (a) {
    if ("string"==typeof a&&r[a]) {
      this.ease = r[a].e;
      this.class = r[a].c;
    } else {
      if (Array.isArray(a)) {
        this.types.Custom.Custom = a;
      }

      this.ease = "Custom";
      this.class = "Custom";
    }
  } else {
    this.ease = "Linear";
    this.class = "Default";
  }

  setTimeout(()=>{
    this.drawSquares();
    this.updateSide();
    this.updateControls();
  },50);
};