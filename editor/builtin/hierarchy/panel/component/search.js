"use strict";
const e = require("fs");
const t = require("path");
const s = require("../utils/cache");
const r = require("../utils/operation");
exports.template = e.readFileSync(t.join(__dirname,"../template/search.html"),"utf-8");
exports.components = {node:require("./node")};
exports.props = ["filter"];
exports.data = function(){return{nodes:[]}};

exports.watch = {filter(){
  s.restoreShowIndex();
  this.nodes = [];
  let e=this.filter;if (/^t:.*/.test(e)) {
    let t = e.match(/t\:([^ ]+) ?([^ ]+)?/);
    let r = t?t[1]:null;

    if (t) {
      t[2];
    }

    if (r&&"cc.Node"!==r) {
      Editor.Ipc.cancelRequest(this._queryID);
      this._queryID = Editor.Ipc.sendToPanel("scene","scene:query-nodes-by-comp-name",r,(e,t)=>{this.nodes = s.findByUuids(t);},-1);
    }
  } else {
    if (/^used:.*/.test(e)) {
      let t = e.match(/used\:([^ ]+) ?([^ ]+)?/);
      let r = t?t[1]:"";

      if (r) {
        Editor.Ipc.cancelRequest(this._queryID);
        this._queryID = Editor.Ipc.sendToPanel("scene","scene:query-nodes-by-usedby-uuid",r,(e,t)=>{this.nodes = s.findByUuids(t);},-1);
      }
    } else {
      this.nodes = ""===e?s.queryNodes():s.findByFilter(this.filter);
    }
  }
}};

exports.methods = {onDragStart(e){
  e.stopPropagation();let t=Editor.Selection.contexts("node");if (!t||t.length<=0) {
    e.preventDefault();
    return;
  }
  r.staging(t);
  this.nodes = s.querySearchNodes();
  let o=this.nodes.filter(e=>e.selected);Editor.UI.DragDrop.start(e.dataTransfer,{buildImage:true,effect:"copyMove",type:"node",items:o.map(e=>({id:e.id,name:e.name}))})
},onDragEnd(e){
  e.stopPropagation();
  r.restore();
  Editor.UI.DragDrop.end();
}};