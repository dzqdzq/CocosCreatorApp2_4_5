"use strict";
const e = require("../libs/manager");
const t = require("../libs/advice");
const p = require("../libs/dump");

module.exports = {"property-add"(p,i){
  let r = null;
  let a = i.name;
  let d = a.split(".");

  if (d.length>1) {
    a = d.pop();
    r = d.join(".");
  }

  e.Clip.addProperty(this.vm.clip.id,this.vm.node.path,r,a);
  this.vm.clip.type = i.type;
  t.emit("clip-data-update");
},"property-remove"(p,i){
  e.Clip.deleteProperty(this.vm.clip.id,this.vm.node.path,i.component,i.property);
  t.emit("clip-data-update");
},"property-add-key"(i,r){
  let a=this.vm.frame;

  if (r.offsetX) {
    a = Math.round(Math.abs(this.vm.offset-r.offsetX)/this.vm.scale);
  }

  this.vm.sample;try{let i=p.getProperty(this.vm.node.id,r.component,r.property);if (!e.Clip.addKey(r.uuid,r.path,r.component,r.property,a,i,this.vm.clip.type)) {
    return;
  }t.emit("clip-data-update")}catch(e){Editor.warn(e)}
},"property-delete-selected-key"(p,i){
  this.vm.selected.forEach(t=>{e.Clip.deleteKey(t.id,t.path,t.component,t.property,t.frame)});
  this.vm.selected.length = 0;
  t.emit("clip-data-update");
},"property-clear"(p,i){
  let r = e.Clip.queryProperty(i.uuid,i.path,i.component,i.property);
  let a = e.Clip.queryInfo(i.uuid);
  r.map(e=>Math.round(e.frame*a.sample)).forEach(t=>{e.Clip.deleteKey(i.uuid,i.path,i.component,i.property,t)});
  t.emit("clip-data-update");
},"exists-clip"(t,p){
  if (t) {
    t.reply(null,e.isExists(p));
  }
},"edit-event"(e,p){t.emit("change-event",p.frame)},"delete-event"(e,p){t.emit("remove-empty-event",p.frame)},"clear-node"(p,i){
  if (e.Clip.deleteCurve(this.vm.clip.id,i.path)) {
    t.emit("clip-data-update");
  }
},"rename-node"(e,t){
  if ("vnode"===t.type) {
    this.vm.mnodes.some(e=>e.name===t.path&&(e.state=1,true));
  } else {
    this.vm.hierarchy.some(e=>e.path===t.path&&(e.state=1,true));
  }
}};