"use strict";
const e = require("fire-fs");
const t = require("path");
const r = require("../libs/advice");
exports.template = e.readFileSync(t.join(__dirname,"../template/tools.html"),"utf-8");
exports.props = ["frame","sample","record","paused","hierarchy"];
exports.watch = {};
exports.data = function(){return{}};
let i=null;

exports.methods = {t:(e,...t)=>Editor.T(`timeline.tools.${e}`,...t),queryNum(e,t){
  if (void 0===e) {
    e = 0;
  }

  if (void 0===t) {
    t = 60;
  }

  let r=e/t|0;

  if (r<10) {
    r = `0${r}`;
  }

  let i=e%t|0;

  if (i<10) {
    i = `0${i}`;
  }

  return `${r}-${i}`;
},_onRecordClick(){Editor.Ipc.sendToPanel("scene","scene:change-animation-record",!this.record)},_onJumpFirstFrameClick(){r.emit("select-frame",0)},_onJumpPrevFrameClick(){let e=this.frame-1;r.emit("select-frame",e>=0?e:0)},_onJumpNextFrameClick(){r.emit("select-frame",this.frame+1)},_onPausedClick(){
  clearTimeout(i);
  i = setTimeout(()=>{let e=!this.paused;r.emit("change-paused",e)},300);
},_onAddClipClick(){},_onAddEventClick(){r.emit("add-empty-event")},_onCreateClipClick(){r.emit("create-new-clip")}};

exports.created = function(){};