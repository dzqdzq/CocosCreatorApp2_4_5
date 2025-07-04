"use strict";
const e = require("../libs/advice");
const p = require("../libs/dump");
const r = (require("../libs/utils"), require("../libs/manager"));

module.exports = {"record-node-changed"(i,o){
  let t = o[0];
  let d = p.diff(t.id,t.dump);
  let n = this.vm;

  d.forEach(e=>{
    let p=r.Clip.queryCurve(n.clip.id,n.node.path);if (e.component) {if (!p.comps[e.component]||!p.comps[e.component][e.property]) {
      return
    }} else {
      if (!p.props[e.property]) {
        return;
      }
    }
    r.Clip.deleteKey(n.clip.id,n.node.path,e.component,e.property,n.frame);
    r.Clip.addKey(n.clip.id,n.node.path,e.component,e.property,n.frame,e.value);
  });

  e.emit("clip-data-update");
}};