"use strict";
const e = require("../libs/dump");
const {promisify:t} = require("util");
const i = require("../libs/advice");
const a = require("../libs/manager");
let n=false;

module.exports = {ready(){this.vm.init()},reloading(){this.vm.init()},"animation-clips-changed"(t,i){
  if (i.node===e.root&&"cc.Animation"===i.component) {
    e.update(()=>{
      this.vm.updateState();
      this.vm.updateClips();
    });
  }
},async"animation-clip-changed"(e,i){
  let n=await t(cc.assetManager.editorExtend.loadJson)(i.data);
  n._uuid = i.uuid;
  a.unregister(n);
  a.register(n);
},"animation-state-changed"(e,t){if ("play"===t.state) {
  this.vm.paused = false;

  (async(e,t,a)=>{if (n) {
    return;
  }n = true;let o=()=>{Editor.Ipc.sendToPanel("scene","scene:query-animation-time",{rootId:e,clip:t},(e,t)=>{
    let s=Math.round(t*a);
    i.emit("change-frame",s);

    if (n) {
      requestAnimationFrame(o);
    }
  })};requestAnimationFrame(o)})(this.vm.hierarchy[0].id,this.vm.clip.name,this.vm.sample);
} else {
  this.vm.paused = true;
  n = false;
}},async"animation-record-changed"(e,n){if(n){this.vm.record = true;this.vm.hierarchy[0].id;let e=this.vm.clip.name;Editor.Ipc.sendToPanel("scene","scene:change-animation-current-clip",e)}else{
  this.vm.record = false;
  let e=this.vm.clip?this.vm.clip.id:"";if (!e) {
    return;
  }let n=await t(cc.assetManager.loadAny.bind(cc.assetManager))(e);
  a.unregister(n);
  a.register(n);
  i.emit("clip-data-update");
  i.emit("change-event",-1);
  i.emit("change-eline",null);
  this.vm.init();
}},"node-component-added"(t,i){
  if (i.node===e.root&&"cc.Animation"===i.component) {
    e.update(()=>{
      this.vm.updateState();
      this.vm.updateClips();
    });
  }
},"revert-prefab-changed"(t,i){
  if (i===e.root) {
    e.update(()=>{
      this.vm.updateState();
      this.vm.updateClips();
    });
  }
},"node-component-removed"(t,i){
  if (i.node===e.root) {
    e.update(()=>{this.vm.updateState()});
  }
},"node-component-pasted"(t,i){
  if (i.node===e.root&&"cc.Animation"===i.component) {
    e.update(()=>{this.vm.updateState()});
  }
},async"node-component-updated"(t,i){
  if (i.node&&i.node===e.root) {
    await this.vm.updateClips();
  }
}};