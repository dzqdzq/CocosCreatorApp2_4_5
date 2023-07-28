"use strict";
const e = require("fire-fs");
const i = require("path");
const t = require("../libs/advice");
const n = require("../libs/manager");
const a = require("../libs/dump");
const {promisify:r} = require("util");
exports.template = e.readFileSync(i.join(__dirname,"../template/home.html"),"utf-8");
const s = -1;
const h = 0;
const o = 1;
const c = 2;
const l = 3;

exports.watch = {state(){if (this.record) {
  switch(this.state){case o:case c:Editor.Ipc.sendToPanel("scene","scene:change-animation-record",false)}
}},width(){try{
  let e=this.$els.grid;
  e.resize();
  e.repaint();
}catch(e){Editor.error(e)}},frame(){
  this.dragMoveGrid();
  a.update();
},clip(){try{
  if (this.clip) {
    this.clip.id;
  }

  this.updateState();
  this.updateMNodes();
  t.emit("change-info");
  t.emit("select-frame",0);
}catch(e){Editor.error(e)}},hierarchy(){try{
  let e=Editor.Selection.curActivate("node");
  this.hierarchy.some(i=>i.id===e&&(t.emit("change-node",i),true));
  this.updateState();
  this.updateClips();
}catch(e){Editor.error(e)}},sample(){try{this.initGrid()}catch(e){Editor.error(e)}},record(){if (!(this.hierarchy&&this.hierarchy.length&&this.clip&&this.clip.id)) {
  t.emit("change-frame",0);
  return;
}for (; this.selected.length; ) {
  this.selected.pop();
}Editor.Ipc.sendToPanel("scene","scene:query-animation-time",{rootId:this.hierarchy[0].id,clip:this.clip.id},(e,i)=>{if (e) {
  Editor.warn(e);
  return;
}let n=Math.round(i*this.sample);t.emit("change-frame",n)})}};

exports.data = function(){return {state:-1,record:false,paused:true,event:-1,eline:null,scale:20,offset:-10,width:0,height:0,duration:0,speed:1,sample:60,mode:0,ignore_pointer:false,frame:0,node:"",clip:null,hierarchy:[],mnodes:[],clips:[],props:[],selected:[]};};

exports.methods = {t:(e,...i)=>Editor.T(`timeline.home.${e}`,...i),dragMoveGrid:function(){
  let e = this.$els.grid;
  let i = this.frame*this.scale;
  let n = e.clientWidth;
  try{
    let a=i+e.xAxisOffset;

    if ((a<0 || a>n)) {
      t.emit("drag-move",e.xAxisOffset+i-n/2);
    }
  }catch(e){Editor.error(e)}
},init(){
  let e = Editor.Selection.curActivate("node");
  let i = Editor.Selection.curSelection("node");

  if (this.hierarchy.every(e=>-1===i.indexOf(e.id))) {
    this.hierarchy = [];
  }

  if (e) {
    Editor.Ipc.sendToPanel("timeline","selection:activated","node",e);
  }

  if (i&&i.length) {
    Editor.Ipc.sendToPanel("timeline","selection:selected","node",i);
  }

  Editor.Ipc.sendToPanel("scene","scene:query-animation-record",(e,i)=>{
    if (e) {
      Editor.warn(e);
      return;
    }

    if (i.record) {
      Editor.Ipc.sendToPanel("timeline","selection:activated","node",i.root);
    }

    setTimeout(()=>{
      if (i.clip) {
        this.clip = i.clip||{};
      }

      this.record = i.record;
    },200);
  });
},initEngine(){return this._initEngineFlag||window._Scene?Promise.resolve():new Promise((e,i)=>{
  window._Scene = {};

  cc.game.run({id:this.$els.game},()=>{
    this._initEngineFlag = true;
    e();
  });
});},initGrid(){
  let e=this.$els.grid;
  e.setScaleH([5,2,3,2],20,100,"frame",this.sample);
  e.xAxisScaleAt(this.offset,this.scale);

  requestAnimationFrame(()=>{
    e.resize();
    e.repaint();
    this.offset = e.xAxisOffset;
  });
},updateState(){
  this.state = s;
  clearTimeout(this._updateStateTimer);

  this._updateStateTimer = setTimeout(()=>{
    if (this.hierarchy&&this.hierarchy.length) {
      if (a.hasAnimaiton(this.hierarchy[0].id)) {
        if (this.clips&&this.clips.length) {
          this.state = l;
        } else {
          this.state = c;
        }
      } else {
        this.state = o;
      }
    } else {
      this.state = h;
    }
  },500);
},async updateClips(){
  if (!this.hierarchy||!this.hierarchy.length||!this.hierarchy[0].id) {
    t.emit("change-clips",[]);
    return;
  }
  let e = this.hierarchy[0].id;
  let i = r(cc.assetManager.loadAny.bind(cc.assetManager));
  let n = r(Editor.Ipc.sendToPanel);
  let a = r(cc.assetManager.editorExtend.loadJson);
  let s = await n("scene","scene:query-animation-list",e);
  let h = [];
  for(let e=0;e<s.length;e++){
    let t = s[e];
    let r = await n("scene","scene:query-animation-clip",t);
    if (r) {
      (r=await a(r))._uuid = t;
    } else {
      try{
        r = await i(t);
        h.push(r);
      }catch(e){}
    }
  }if(h.length===this.clips.length){let e=false;for(let i=0;i<h.length;++i){h[i];let t=this.clips[i];if(h[i]._uuid!==t.id||h[i].name!==t.name){e = true;break}}if (!e) {
    return
  }}t.emit("change-clips",h)
},updateMNodes(){
  let e = this.clip?this.clip.id:"";
  let i = this.hierarchy[0];
  let t = n.Clip.queryPaths(e)||[];
  this.mnodes = t.map(e=>({state:0,name:`/${i.name}/${e}`,path:e})).filter(e=>!this.hierarchy.some(i=>i.path===e.name));
},scaleToChart(e,i){
  let t = this.$els.grid;
  let n = Editor.Utils.smoothScale(this.scale,e);
  n = Editor.Math.clamp(n,t.hticks.minValueScale,t.hticks.maxValueScale);
  this.scale = n;
  t.xAxisScaleAt(i,n);
  t.repaint();
  this.offset = t.xAxisOffset;
},moveToChart(e){
  let i=this.$els.grid;
  i.pan(-e,0);
  i.repaint();
  this.offset = i.xAxisOffset;
},queryPinterStyle:(e,i,t)=>`transform: translateX(${e+i*t-1|0}px);`,_onClipChanged(e){this.clips.some(i=>i.name===e.target.value&&(this.clip=i,Editor.Ipc.sendToPanel("scene","scene:change-animation-current-clip",i.name),true))},_onSampleChanged(e){
  let i=this.clip?this.clip.id:"";
  n.Clip.changeSample(i,e.target.value);
  t.emit("change-info");
},_onSpeedChanged(e){
  let i=this.clip?this.clip.id:"";
  n.Clip.changeSpeed(i,e.target.value);
  t.emit("change-info");
},_onModeChanged(e){
  let i=this.clip?this.clip.id:"";
  n.Clip.changeMode(i,e.target.value);
  t.emit("change-info");
},_onPointerMouseDown(e){
  let i = 0;
  let n = this.frame;
  Editor.UI.startDrag("ew-resize",e,(e,a,r,s,h)=>{i += isNaN(a)?0:a;let o=Math.round(i/this.scale);t.emit("select-frame",Math.max(o+n,0))},(...e)=>{let a=Math.round(i/this.scale);t.emit("select-frame",Math.max(a+n,0))})
},_onAddAnimationComponentClick(){
  if (this.hierarchy&&this.hierarchy.length) {
    Editor.Ipc.sendToPanel("scene","scene:add-component",this.hierarchy[0].id,"cc.Animation");
  }
},_onCreateClipClick(){
  if (this.hierarchy&&this.hierarchy.length) {
    Editor.Ipc.sendToMain("timeline:create-clip-file",this.hierarchy[0].id,e=>{setTimeout(()=>{this.updateClips()},200)},-1);
  }
}};

exports.created = function(){
  let e=null;

  t.on("drag-zoom",(i,t)=>{
    this.ignore_pointer = true;
    this.scaleToChart(-i,t);
    clearTimeout(e);
    e = setTimeout(()=>{this.ignore_pointer = false;},500);
  });

  t.on("drag-move",i=>{
    this.ignore_pointer = true;
    this.moveToChart(i);
    clearTimeout(e);
    e = setTimeout(()=>{this.ignore_pointer = false;},500);
  });

  t.on("drag-key-end",e=>{
    let i = this.selected.map(e=>n.Clip.queryKey(e.id,e.path,e.component,e.property,e.frame));
    let a = this.selected.filter(t=>{let a=n.Clip.queryKey(t.id,t.path,t.component,t.property,t.frame+e);return!(!a||-1!==i.indexOf(a))});
    if(a&&a.length){
      let i=a.map(i=>{n.Clip.queryInfo(i.id);return`${i.path.replace(/\/[^\/]+/,"")} - ${i.component?`${i.component}.${i.property}`:i.property} - ${i.frame+e|0}`});

      if (i.length>5) {
        i.length = 5;
        i.push("...");
      }

      if (0===Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("timeline.manager.move_key_button_cancel"),Editor.T("timeline.manager.move_key_button_confirm")],title:"",message:Editor.T("timeline.manager.move_key_title"),detail:`${i.join("\n")}\n${Editor.T("timeline.manager.move_key_title")}`,defaultId:0,cancelId:0,noLink:true})) {
        return false;
      }
    }a.forEach(i=>{n.Clip.deleteKey(i.id,i.path,i.component,i.property,i.frame+e)});let r=this.selected.map(e=>{return n.Clip.deleteKey(e.id,e.path,e.component,e.property,e.frame)});

    this.selected.forEach((i,t)=>{let a=r[t];if(a){
      let t=n.Clip.addKey(i.id,i.path,i.component,i.property,i.frame+e,a.value);

      if (a.curve) {
        t.curve = a.curve;
      }
    }});

    this.selected.forEach(i=>{i.frame += e;});
    t.emit("change-info");
  });

  t.on("ignore-pointer",e=>{this.ignore_pointer = e;});

  t.on("clip-data-update",()=>{
    this.updateMNodes();
    t.emit("change-info");
  });

  t.on("change-hierarchy",e=>{this.hierarchy = e;});
  t.on("change-node",e=>{this.node = e;});

  t.on("change-clips",e=>{
    this.clips.length = 0;
    n.clear();

    e.forEach(e=>{
      n.register(e);
      this.clips.push({id:e._uuid,name:e.name});
    });

    if (0===this.clips.length) {
      this.clip = null;
    } else {
      if (this.clip) {
        if (this.clips.every(e=>e.id!==this.clip.id||e.name!==this.clip.name)) {
          this.clip = this.clips[0];
        }
      } else {
        this.clip = this.clips[0];
      }
    }a.update(()=>{this.updateState()})
  });

  t.on("change-frame",e=>{
    if (this.frame===e) {
      this.dragMoveGrid();
    } else {
      this.frame = e;
    }
  });

  t.on("change-record",e=>{this.record = e;});
  t.on("change-paused",async e=>{Editor.Ipc.sendToPanel("scene","scene:change-animation-state",{nodeId:this.node.id,clip:this.clip.name,state:e?"pause":"play"})});

  t.on("change-info",()=>{
    if (!this.clip) {
      return;
    }
    let e = this.clip?this.clip.id:"";
    let i = n.Clip.queryInfo(e);
    this.duration = i.duration;
    this.speed = i.speed;
    this.sample = i.sample;
    this.mode = i.wrapMode;
  });

  t.on("change-event",e=>{this.event = e;});
  t.on("change-eline",e=>{this.eline = e;});

  t.on("select-frame",e=>{
    if (this.clip) {
      Editor.Ipc.sendToPanel("scene","scene:animation-time-changed",{nodeId:this.node.id,clip:this.clip.name,time:e/this.sample});
      t.emit("change-frame",e);
    }
  });

  require("../message/selection").activated(null,"node",Editor.Selection.curActivate("node"));
  t.on("create-new-clip",()=>{this._onCreateClipClick()});
};

exports.compiled = function(){
  this.initEngine();
  this.initGrid();

  Editor.Ipc.sendToPanel("scene","scene:is-ready",(e,i)=>{
    if (i) {
      this.init();
    }
  },-1);
};