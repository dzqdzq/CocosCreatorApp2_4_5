"use strict";
const e = require("fs");
const t = require("path");
const r = require("../utils/event");
exports.template = e.readFileSync(t.join(__dirname,"../template/console.html"),"utf-8");
exports.data = function(){return {length:0,filter:"",regular:false,type:"all",fsize:16,collapse:true,aclear:false};};
exports.components = {tools:require("./tools"),list:require("./list")};
exports.methods = {};

exports.created = function(){
  r.on("filter-changed",e=>{this.filter = e;});
  r.on("regular-changed",e=>{this.regular = e;});
  r.on("type-changed",e=>{this.type = e;});
  r.on("font-size-changed",e=>{this.fsize = e;});
  r.on("collapse-changed",e=>{this.collapse = e;});
  r.on("auto-clear-changed",e=>{this.aclear = e;});
};