"use strict";
const e = require("fs");
const t = require("path");
const o = require("../utils/cache");
const s = require("../utils/operation");
const i = require("../utils/event");
const r = require("../utils/display");
const n = require("../utils/communication");
function a(e,t){let o=Editor.assets[t];if("javascript"===t||"typescript"===t){
  let t = Editor.Utils.UuidUtils.compressUuid(e);
  let o = cc.js._getClassById(t);
  return cc.js.isChildClassOf(o,cc.Component)
}return o&&o.prototype.createNode}
exports.template = e.readFileSync(t.join(__dirname,"../template/nodes.html"),"utf-8");
exports.props = ["length"];
exports.components = {node:require("./node"),highlight:require("./highlight")};
exports.data = function(){return {focused:false,start:0,nodes:o.queryNodes(),list:[],uh:{height:0},y:-999,highlight:{node:null,state:0}};};
exports.watch = {start(){this.reset()},length(){this.reset()},nodes:{deep:true,handler(){this.reset()}}};

exports.methods = {reset(){
  if (!this._updateLock) {
    this._updateLock = true;

    requestAnimationFrame(()=>{
      this._updateLock = false;
      this.updateShowList();
    });
  }
},updateShowList(){
  this.uh.height = 0;
  this.start = this.$el.scrollTop/20|0;
  for(let e=this.nodes.length-1;e>=0;e--){let t=this.nodes[e];if(-1!==t.showIndex){this.uh.height = 20*t.showIndex+24;break}}let e=this.length;for (; this.list.length; ) {
    this.list.pop();
  }for(let t=0;t<this.nodes.length;t++){
    let o=this.nodes[t];

    if (o.show&&o.showIndex>=this.start) {
      this.list.push(o);
    }

    if (this.list.length>=e) {
      break
    }
  }
},onMouseDown(e){
  Editor.Selection.setContext("node",null);
  if (2===e.button) {
    n.popup("node",{x:e.clientX,y:e.clientY});
    return;
  }Editor.Selection.select("node")
},onScroll(e){let t=e.target.scrollTop;this.start = t/20|0;},onFocus(){this.focused = true;},onBlur(){this.focused = false;},onDragStart(e){e.stopPropagation();let t=Editor.Selection.contexts("node");if (!t||t.length<=0) {
  e.preventDefault();
  return;
}s.staging(t);let o=this.nodes.filter(e=>e.selected);Editor.UI.DragDrop.start(e.dataTransfer,{buildImage:true,effect:"copyMove",type:"node",items:o.map(e=>({id:e.id,name:e.name}))})},onDragOver(e){
  if ("tab"!==Editor.UI.DragDrop.type(e.dataTransfer)) {
    e.stopPropagation();
  }
},onDragEnd(e){
  e.stopPropagation();
  s.restore();
  Editor.UI.DragDrop.end();
  this.y = -999;
},onDropAreaMove(e){
  e.stopPropagation();
  if (o.recording) {
    Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,"none");
    return;
  }let t=this.$el.getBoundingClientRect();
  this.y = this.$el.scrollTop+e.detail.clientY-t.top-5;
  let s = e.detail.dragType;
  let i = "none";

  if ("asset"===s) {
    i = function(e){let t="copy";for(let o of e.detail.dragItems){if("folder"===o.assetType||"skeleton-animation-clip"===o.assetType&&o.isSubAsset){t = "none";break}if(!a(o.id,o.assetType)){if(!o.subAssetTypes||0===o.subAssetTypes.length){t = "none";break}for(let e of o.subAssetTypes)if(!a(e)){t = "none";break}}}return t}(e);
  } else {
    if ("cloud-function"===s) {
      i = "copy";
    } else {
      if ("node"===s) {
        i = "move";
      }
    }
  }

  Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer,i);
},async onDropAreaAccept(e){
  e.stopPropagation();
  let t = r.point(this.y);
  let o = 0;
  let i = t.y%20;
  o = i<=5?1:i<=10?2:3;
  this.y = -999;

  let n = await Promise.all(e.detail.dragItems.map(async t=>"cloud-function"===e.detail.dragType?new Promise((e,o)=>{Editor.Ipc.sendToPackage("node-library","import-cloud-component",t.path,(t,s)=>{if (t) {
    return o(t);
  }e(s)})}):t.id));

  let a = t.node&&t.node.id;
  switch(e.detail.dragType){case"asset":case"cloud-function":s.prefab(n,a,o,{unlinkPrefab:e.detail.dragOptions.unlinkPrefab});break;case"node":s.move(n,a,o)}
},scrollToItem(e){
  let t=o.queryNode(e);if (!t) {
    return;
  }let i=o.queryNodes().indexOf(t);

  if (!(i < 0)) {
    s.foldAllParentNodeState(t,false);

    setTimeout(()=>{
      this.$el.scrollTop = o.lineHeight*i-o.lineHeight*this.length/2;
      s.hint(e);
    },50);
  }
}};

exports.directives = {init(e,t){requestAnimationFrame(()=>{this.vm.reset()})}};

exports.created = function(){
  i.on("refresh-node-tree",()=>{this.reset()});

  i.on("nodes_focus",e=>{
    this.focused = e||true;

    if (e&&this.$el) {
      this.$el.focus();
    }
  });
};