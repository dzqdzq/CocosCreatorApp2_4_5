"use strict";
const e = require("fire-fs");
const t = require("path");
const r = require("../libs/manager");
const s = require("../libs/advice");
const i = require("../libs/utils");
const {promisify:a} = require("util");
exports.template = e.readFileSync(t.join(__dirname,"../template/prop-row.html"),"utf-8");
exports.components = {"texture-preview":require("./texture-preview")};
exports.props = ["offset","scale","node","component","property","clip","sample","box","selected"];

exports.watch = {sample(){try{this.updateKeys()}catch(e){Editor.error(e)}},box:{deep:true,handler(e){
  if (!(e.y>=this.$el.offsetTop+20 || e.h+e.y<=this.$el.offsetTop+4)) {
    this.keys.forEach(t=>{
      let r=t.frame*this.scale;if (r<e.x||r>e.x+e.w) {
        return;
      }let s=i.packKey(this.clip.id,this.node.path,this.component,this.property,t.frame,t.value);

      if (!this.checkSelected(s)) {
        this.selected.push(s);
      }
    });
  }
}}};

exports.data = function(){return{keys:[],lines:[],virtualkeys:[]}};

exports.methods = {t:Editor.T,updateKeys(){for (; this.keys.length; ) {
  this.keys.pop();
}for (; this.lines.length; ) {
  this.lines.pop();
}let e=null;r.Clip.queryProperty(this.clip.id,this.node.path,this.component,this.property).forEach(t=>{
  if ("spriteFrame"===this.property) {
    t.value = 0===t.value?null:t.value;
  }

  let r = t.value&&t.value._uuid;
  let s = {frame:Math.round(t.frame*this.sample),isAsset:r,value:r?Editor.serialize(t.value):JSON.stringify(t.value),source:t.value};

  if (e&&s.value!==e.value) {
    this.lines.push({frame:e.frame,length:s.frame-e.frame});
  }

  e = s;
  this.keys.push(s);
})},queryLineStyle:(e,t,r,s)=>`transform: translateX(${e*r+s-1|0}px); width: ${t*r}px`,checkSelected(e){return-1!==i.indexOf(this.selected,{component:this.component,property:this.property,frame:e.frame})},dragKeyStart(){this.keys.forEach(e=>{
  if (this.checkSelected(e)) {
    this.virtualkeys.push({frame:parseFloat(e.frame),offset:0,source:e.source,value:e.value});
  }
})},dragKeyMove(e){this.virtualkeys.forEach(t=>{t.offset = e;})},dragKeyEnd(){for (; this.virtualkeys.length; ) {
  this.virtualkeys.pop();
}this.updateKeys()},queryKeyStyle:(e,t,r)=>`transform: translateX(${e*t+r-1|0}px);`,queryVKeyStyle:(e,t,r,s)=>`transform: translateX(${(e+t)*r+s-1|0}px);`,_onDragEnter(e){
  if ("spriteFrame"===this.property) {
    e.dataTransfer.dropEffect = "copy";
  }

  s.emit("ignore-pointer",true);
},_onDragLeave(e){
  if ("spriteFrame"===this.property) {
    e.dataTransfer.dropEffect = "default";
  }

  s.emit("ignore-pointer",false);
},_onDragOver(e){
  if ("spriteFrame"!==this.property) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  let t = e.offsetX-this.offset;
  let r = Math.round(t/this.scale);
  s.emit("change-frame",r)
},async _onDrop(e){
  s.emit("ignore-pointer",false);
  if ("spriteFrame"!==this.property) {
    return;
  }Editor.UI.DragDrop.type(e.dataTransfer);
  let t = Editor.UI.DragDrop.items(e.dataTransfer);
  let i = e.offsetX-this.offset;
  let o = Math.round(i/this.scale);
  let p = a(cc.assetManager.loadAny.bind(cc.assetManager));
  let n = [];
  for(let e=0;e<t.length;e++){
    let r = t[e];
    let s = await p(r.id);
    if (s instanceof cc.Texture2D) {
      let e = await a(Editor.assetdb.queryMetaInfoByUuid)(r.id);
      let t = JSON.parse(e.json);
      let s = Object.keys(t.subMetas);
      for(let e=0;e<s.length;e++){
        let r = t.subMetas[s[e]];
        let i = await p(r.uuid);
        n.push(i)
      }
    } else {
      if (s instanceof cc.SpriteFrame) {
        n.push(s);
      }
    }
  }
  n.forEach((e,t)=>{r.Clip.addKey(this.clip.id,this.node.path,this.component,this.property,o+t,e)});
  s.emit("clip-data-update");
},_onMouseDown(e){if (2!==e.button) {
  return;
}let t=this.selected.some(e=>e.component===this.component&&e.property===this.property);Editor.Ipc.sendToMain("timeline:menu-keyframe-operation",{uuid:this.clip.id,path:this.node.path,component:this.component,property:this.property,selected:t,hasKeyframe:false,offsetX:e.offsetX,x:e.pageX,y:e.pageY})},_onKeyClick(e,t){
  if (e) {
    e.preventDefault();
  }

  if (e) {
    e.stopPropagation();
  }
},_onKeyMouseDown(e,t){
  let r=i.packKey(this.clip.id,this.node.path,this.component,this.property,t.frame,t.value);if (e&&!e.ctrlKey&&!e.metaKey&&!this.checkSelected(r)) {
    for (; this.selected.length; ) {
      this.selected.pop();
    }
  }

  if (!this.checkSelected(r)) {
    this.selected.push(r);
  }

  if (2===e.button) {
    Editor.Ipc.sendToMain("timeline:menu-keyframe-operation",{uuid:this.clip.id,path:this.node.path,component:this.component,property:this.property,selected:true,hasKeyframe:true,x:e.pageX,y:e.pageY});
  }

  if (e) {
    e.stopPropagation();
  }
},_onKeyMouseUp(e,t){
  let r=i.packKey(this.clip.id,this.node.path,this.component,this.property,t.frame,t.value);

  if (!this.checkSelected(r)) {
    this.selected.push(r);
  }
},_onKeyDragStart(e,t){
  let r = 0;
  let i = 1/0;

  this.selected.forEach(e=>{
    if (e.frame<i) {
      i = e.frame;
    }
  });

  s.emit("drag-key-start");
  Editor.UI.startDrag("ew-resize",e,(e,t,a,o,p)=>{r += isNaN(t)?0:t;let n=Math.round(r/this.scale);s.emit("drag-key-move",Math.max(-i,n))},(...e)=>{let t=Math.round(r/this.scale);s.emit("drag-key-end",Math.max(-i,t))});
},_onLineClick(e,t){
  e.preventDefault();
  e.stopPropagation();
  let r = t.frame;
  let s = t.frame+t.length;
  if (!e.ctrlKey&&!e.metaKey) {
    for (; this.selected.length; ) {
      this.selected.pop();
    }
  }for(let e=0;e<this.keys.length;e++){
    let t=this.keys[e];

    if (!(t.frame!==r && t.frame!==s)) {
      this.selected.push(i.packKey(this.clip.id,this.node.path,this.component,this.property,t.frame,t.value));
    }
  }
},_onLineDBLClick(e){s.emit("change-eline",{id:this.clip.id,path:this.node.path,component:this.component,property:this.property,frame:e.frame})}};

exports.created = function(){
  s.on("drag-key-start",this.dragKeyStart);
  s.on("drag-key-move",this.dragKeyMove);
  s.on("drag-key-end",this.dragKeyEnd);
};

exports.compiled = function(){this.updateKeys()};

exports.destroyed = function(){
  s.removeListener("drag-key-start",this.dragKeyStart);
  s.removeListener("drag-key-move",this.dragKeyMove);
  s.removeListener("drag-key-end",this.dragKeyEnd);
};