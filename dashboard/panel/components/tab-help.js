"use strict";
const e = require("electron");
const p = require("fs");
const t = require("path");
const a = require("../utils");
exports.template = p.readFileSync(t.join(__dirname,"../template/tab-help.html"),"utf-8");
exports.props = [];
exports.data = function(){return{version:Editor.remote.versions.CocosCreator}};

exports.methods = {t:e=>Editor.T(e),changeTab(e){a.event.emit("change-tab",e)},openDoc(e){
  let p=[];switch(e){case 0:
    p.push("app:open-manual-doc");
    p.push("getting-started");
    break;case 1:
    p.push("app:open-manual-doc");
    p.push("quick-start");
    break;case 2:
    p.push("app:open-manual-doc");
    p.push("home");
    break;case 3:
    p.push("app:open-api-doc");
    p.push("home");
    break;case 4:
    p.push("app:open-api-doc");
    p.push("services");}
  p.push(function(e){});
  Editor.Ipc.sendToMain(...p);
},openUrl(p){e.remote.shell.openExternal(p)}};

exports.ready = function(){};