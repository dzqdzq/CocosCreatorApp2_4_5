"use strict";
const e = require("fs");
const t = require("path");
require("../lib/advice");
require("../lib/record");
require("../lib/info");
require("../lib/resource");
exports.components = {details:require("./manualDetails")};
exports.template = e.readFileSync(t.join(__dirname,"../template/manual.html"),"utf-8");
exports.props = [];
exports.data = function(){return{lastResources:[]}};

exports.methods = {addClick(){
  let e = this.$refs.details.list;
  let t = [];
  for(let s in e){e[s].list.forEach(e=>{
    if (e.selected) {
      t.push(e.uuid);
    }
  })}if (0===t.length) {
    this.close();
    return;
  }Editor.Ipc.sendToPanel("google-instant-games","google-instant-games:update-list",t,e=>{this.close()})
},queryLastResource(){Editor.Ipc.sendToPanel("google-instant-games","google-instant-games:query-last-resources",null,(e,t)=>{
  t.forEach(e=>{e.selected = false;});
  this.lastResources = t;
})},close(){Editor.Panel.close("google-instant-games.manual")},t:e=>Editor.T(e)};

exports.computed = {};
exports.created = function(){this.queryLastResource()};