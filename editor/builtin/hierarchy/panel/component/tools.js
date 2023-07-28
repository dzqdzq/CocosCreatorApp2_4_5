"use strict";
const e = require("fs");
const t = require("path");
const r = require("../utils/cache");
const i = require("../utils/operation");
const o = require("../utils/event");
const n = require("../utils/communication");
exports.template = e.readFileSync(t.join(__dirname,"../template/tools.html"),"utf-8");
exports.props = ["filter"];
exports.data = function(){return {input:false,foldState:r.foldState};};
exports.created = function(){o.on("fold-state-changed",e=>{this.foldState = e;})};

exports.methods = {t:e=>Editor.T(e),refresh(){o.emit("refresh-node-tree")},createPopup(e){n.popup("create",{x:e.x,y:e.y+5})},searchPopup(e){n.popup("search",{x:e.x,y:e.y+5})},changeFold(){
  let e = r.queryNodes();
  let t = !e.some(e=>!(!e.children||0===e.children.length)&&e.fold);

  e.forEach(e=>{
    if (e.children.length>0) {
      i.fold(e.id,t);
    }
  });

  this.foldState = !this.foldState;
},onFilterChange(e){let t=e.target.value;o.emit("filter-changed",t)},onInputnFocus(){this.input = true;},onInputBlur(){this.input = false;},emptyFilter(){
  r.restoreShowIndex();
  o.emit("filter-changed","");
  o.emit("empty-filter");
}};