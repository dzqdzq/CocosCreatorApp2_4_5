"use strict";
const e = require("fs");
const t = require("path");
const r = require("../utils");
const a = Editor.Profile.load("global://dashborad.json");
exports.template = e.readFileSync(t.join(__dirname,"../template/tabs.html"),"utf-8");
exports.props = ["tab","filter","tutorial","hasreadnews","shouldreadnews"];
exports.data = function(){return{}};

exports.methods = {t:e=>Editor.T(e),getNewsRemind:(e,t)=>t.some(t=>!e.includes(t.pid)),changeTab(e){
  if ("help"===e) {
    a.set("lastRemindVersion",Editor.remote.versions.CocosCreator);
    a.save();
    this.tutorial = false;
  }

  r.event.emit("change-tab",e);
  r.event.emit("change-filter","");
},changeFilter(e){r.event.emit("change-filter",e.target.value)}};

exports.created = async function(){};