"use strict";const t=require("fire-fs");
exports.template = t.readFileSync(Editor.url("packages://project-settings/panel/template/group.html"),"utf-8");
exports.props = ["list","collision"];

exports.methods = {T:Editor.T,reverse(t){for (var s=[],e=t.length-1; e>=0; e--) {
  s.push(t[e]);
}return s},_addGroup(t,s){var e=[];this.collision.push(e);for (let t=0; t<this.collision.length; t++) {
  e.push(false);
}this.list.push(`New Group ${this.list.length+2}`)},_collisionChanged(t,s,e){
  this.collision[t][s] = e;
  this.collision[s][t] = e;
}};

exports.created = function(){};