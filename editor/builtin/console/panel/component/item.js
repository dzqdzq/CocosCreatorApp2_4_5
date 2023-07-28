"use strict";
const t = require("fs");
const e = require("path");
const i = require("../utils/event");
exports.template = t.readFileSync(e.join(__dirname,"../template/item.html"),"utf-8");
exports.props = ["log","offset","fsize","width"];
exports.data = function(){return{}};
exports.components = {};

exports.methods = {onUpdateTransform(t,e,i){
  let o="";

  if (t) {
    o += `transform: translateY(${t}px);`;
  }

  if (e) {
    o += ` font-size: ${e}px;`;
    o += ` line-height: ${2*e}px;`;
  }

  return o;
},onShowInfo(){
  this.log.fold = false;
  requestAnimationFrame(()=>{this.onUpdateHeight()});
  i.emit("update-list");
},onHideInfo(){
  this.log.fold = true;
  requestAnimationFrame(()=>{this.onUpdateHeight()});
  i.emit("update-list");
},onUpdateHeight(){this.log.height = this.$el.clientHeight;}};

exports.created = function(){};