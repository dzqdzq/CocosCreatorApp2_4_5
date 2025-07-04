"use strict";
const e = require("fire-fs");
const t = require("path");
const r = require("../libs/manager");
const o = require("../libs/advice");
exports.template = e.readFileSync(t.join(__dirname,"../template/props.html"),"utf-8");
exports.props = ["props","node","clip","selected"];
exports.watch = {node(e){try{this.updateProps(e,this.clip)}catch(e){Editor.error(e)}},clip(e){try{this.updateProps(this.node,e)}catch(e){Editor.error(e)}}};
exports.data = function(){return{}};

exports.methods = {
  t:Editor.T,
  updateProps(e,t){
  for (; this.props.length; ) {
    this.props.pop();
  }
  if (!e||!t) {
    return;
  }
  let o=r.Clip.queryCurve(t.id,e.path);

  if (o) {
    Object.keys(o.props).forEach(e=>{this.props.push({component:null,property:e})});
    Object.keys(o.comps).forEach(e=>{Object.keys(o.comps[e]).forEach(t=>{this.props.push({component:e,property:t})})});
  }
},
_onScroll(e){let t=e.target;o.emit("property-scroll",t.scrollTop)},_onAddPropertyClick(e){Editor.Ipc.sendToMain("timeline:menu-add-property",{x:e.pageX,y:e.pageY,nodeId:this.node.id})},_onPropertyClick(e,t,r){let o=this.selected.some(e=>e.component===t&&e.property===r);Editor.Ipc.sendToMain("timeline:menu-property-operation",{uuid:this.clip.id,path:this.node.path,component:t,property:r,type:this.clip.type,selected:o,x:e.pageX,y:e.pageY})},onPropertyScroll(e){this.$el.scrollTop = e;},onClipDataUpdate(){this.updateProps(this.node,this.clip)}};

exports.created = function(){
  o.on("property-scroll",this.onPropertyScroll);
  o.on("clip-data-update",this.onClipDataUpdate);
};

exports.destroyed = function(){
  o.removeListener("property-scroll",this.onPropertyScroll);
  o.removeListener("clip-data-update",this.onClipDataUpdate);
};