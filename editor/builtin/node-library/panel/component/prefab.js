"use strict";
const e = require("fire-fs");
const t = require("path");
const r = require("../utils/data");
const i = require("../utils/cloud");
exports.template = e.readFileSync(t.join(__dirname,"../template/prefab.html"),"utf-8");
exports.props = ["prefab","zoom"];
exports.data = function(){return {time:0,rename:false,img:{width:60*this.zoom,height:60*this.zoom},text:{width:60*this.zoom}};};
exports.watch = {zoom(){this.text.width = this.img.width=this.img.height=60*this.zoom;}};

exports.methods = {queryIcon:(e,t)=>e.icon?`${e.icon}?_t=${t}`:`${r.queryIcon(e.uuid)}?_t=${t}`,whetherRename(e){this.rename = this.prefab.uuid===e;},updatIcon(e){
  if (e===this.prefab.uuid) {
    this.time++;
  }
},onMouseUp(e){
  e.preventDefault();
  if (2!==e.button||this.prefab.component) {
    return false;
  }Editor.Ipc.sendToMain("node-library:popup-prefab-menu",e.x,e.y,{id:this.prefab.uuid})
},onDragStart(e){
  e.stopPropagation();
  if (this.prefab.component) {
    Editor.UI.DragDrop.start(e.dataTransfer,{effect:"copyMove",type:"cloud-function",items:[{path:this.prefab.component}],options:{unlinkPrefab:true,from:"node-library"}});
    return;
  }Editor.UI.DragDrop.start(e.dataTransfer,{effect:"copyMove",type:"asset",items:[{id:this.prefab.uuid,name:this.prefab.name,assetType:"prefab"}],options:{unlinkPrefab:true,from:"node-library"}})
},onDragEnd(e){
  Editor.UI.DragDrop.end();

  if (this.prefab.file) {
    i.dropCloudFunction(this.prefab.file);
  }
},onInputBlur(e){
  this.rename = false;
  r.renameUserPrefab(this.prefab.uuid,e.target.value);
},onInputKeyUp(e){switch(e.keyCode){case 13:
  this.rename = false;
  r.renameUserPrefab(this.prefab.uuid,e.target.value);
  break;case 27:
  this.rename = false;
  e.target.value = this.prefab.name;}}};

exports.directives = {"input-init"(){requestAnimationFrame(()=>{this.el.focus()})}};

exports.created = function(){
  r.event.on("start-rename",this.whetherRename);
  r.event.on("prefab-icon-changed",this.updatIcon);
};

exports.destroyed = function(){
  r.event.removeListener("start-rename",this.whetherRename);
  r.event.removeListener("prefab-icon-changed",this.updatIcon);
};