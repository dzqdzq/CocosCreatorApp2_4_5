"use strict";
const e = require("fire-fs");
const t = require("path");
const i = require("../libs/advice");
const s = require("../libs/manager");
exports.template = e.readFileSync(t.join(__dirname,"../template/events.html"),"utf-8");
exports.props = ["clip","frame","offset","scale","sample","duration","event"];
exports.watch = {clip(){try{this.updateEvents()}catch(e){Editor.error(e)}},event(){try{this.updateEvents()}catch(e){Editor.error(e)}}};
exports.data = function(){return {shadow:false,events:[],virtualevents:[]};};

exports.methods = {t:Editor.T,updateEvents(){for (; this.events.length; ) {
  this.events.pop();
}if (!this.clip) {
  return;
}let e=s.Clip.queryInfo(this.clip.id);(s.Clip.queryEvents(this.clip.id)||[]).forEach(t=>{
  let i=Math.round(t.frame*e.sample);

  if (-1===this.events.indexOf(i)) {
    this.events.push(i);
  }
})},updateDuration:(e,t,i,s)=>`transform: translateX(${e}px); width: ${t*i*s}px;`,queryEventStyle:(e,t,i)=>`transform: translateX(${e+i*t}px);`,checkHover(e){return this.virtualevents.some(t=>t.frame===e)},_onMouseWheel(e){
  if (Math.abs(e.deltaX)>Math.abs(e.deltaY)) {
    i.emit("drag-move",e.deltaX);
  } else {
    i.emit("drag-zoom",e.deltaY,Math.round(e.offsetX+this.offset));
  }
},_onMouseDown(e){if(1!==e.button&&2!==e.button){
  let t=Math.round((e.offsetX-(this.$el===e.target?this.offset:0))/this.scale);i.emit("select-frame",t);let s=0;
  Editor.UI.startDrag("ew-resize",e,(e,r,a,n,o)=>{s += isNaN(r)?0:r;let l=Math.round(s/this.scale);i.emit("select-frame",Math.max(l+t,0))},(...e)=>{let r=Math.round(s/this.scale);i.emit("select-frame",Math.max(r+t,0))});
  return;
}Editor.UI.startDrag("-webkit-grabbing",e,(e,t,s,r,a)=>{i.emit("drag-move",-Math.round(t))},(...e)=>{})},_onKeyMouseDown(e,t){
  e.stopPropagation();

  if (2===e.button) {
    e.preventDefault();
    Editor.Ipc.sendToMain("timeline:menu-event-operation",{frame:t,x:e.pageX,y:e.pageY});
  }
},_onKeyDragStart(e,t){
  let r=0;
  this.shadow = true;
  this.virtualevents.push({frame:t,offset:0});

  Editor.UI.startDrag("ew-resize",e,(e,t,i,s,a)=>{r += isNaN(t)?0:t;let n=Math.round(r/this.scale);this.virtualevents.forEach(e=>{
    if (e.frame+n>=0) {
      e.offset = n;
    } else {
      e.offset = -e.frame;
    }
  })},(...e)=>{
    for(this.shadow=false;this.virtualevents.length;){
      let e=this.virtualevents.pop();if (0===e.offset) {
        continue;
      }
      let t = s.Clip.queryEvents(this.clip.id);
      let i = s.Clip.queryInfo(this.clip.id);
      let r = [];
      for(let a=0;a<t.length;a++){
        let n=t[a];

        if (Math.round(n.frame*i.sample)===e.frame) {
          r.push(s.Clip.deleteEvent(this.clip.id,n));
          a--;
        }
      }r.forEach(t=>{s.Clip.addEvent(this.clip.id,e.frame+e.offset,t.func,t.params)})
    }
    this.updateEvents();
    i.emit("clip-data-update");
  });
},_onKeyClick(e,t){
  e.stopPropagation();
  e.preventDefault();
  i.emit("select-frame",t);
},_onKeyDBLClick(e,t){i.emit("change-event",t)},onAddEmptyEvent(){
  s.Clip.addEvent(this.clip.id,this.frame,"",[]);
  this.updateEvents();
  i.emit("clip-data-update");
},onRemoveEmptyEvent(e){
  let t = s.Clip.queryEvents(this.clip.id);
  let i = s.Clip.queryInfo(this.clip.id);
  for(let r=0;r<t.length;r++){
    let a=t[r];

    if (Math.round(a.frame*i.sample)===e) {
      s.Clip.deleteEvent(this.clip.id,a);
      r--;
    }
  }this.updateEvents()
}};

exports.created = function(){
  this.updateEvents();
  i.on("add-empty-event",this.onAddEmptyEvent);
  i.on("remove-empty-event",this.onRemoveEmptyEvent);
};

exports.destroyed = function(){
  i.removeListener("add-empty-event",this.onAddEmptyEvent);
  i.removeListener("remove-empty-event",this.onRemoveEmptyEvent);
};