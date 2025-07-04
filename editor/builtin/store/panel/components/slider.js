"use strict";
const e = require("fs");
const t = require("path");
exports.props = ["list"];
exports.template = e.readFileSync(t.join(__dirname,"./slider.html"),"utf8");
exports.data = function(){return{lang:Editor.lang}};

exports.methods = {tr:(e,...t)=>Editor.T(`store.${e}`,t),getDate(e){
  var t = new Date;
  var r = new Date(e);
  if(t-e<864e5&&t.getDate()==r.getDate()){
    let e = r.getHours();
    let t = r.getMinutes();

    if (e<10) {
      e = `0${e}`;
    }

    if (t<10) {
      t = `0${t}`;
    }

    return `${e}:${t}`;
  }return r.toLocaleDateString()
},install(e,t){Editor.Ipc.sendToPackage("store","install",e,t)},unzip(e,t){Editor.Ipc.sendToPackage("store","unzip",e,t)},remove(e,t){Editor.Ipc.sendToPackage("store","remove",e,t)},clear(){Editor.Ipc.sendToPackage("store","clear")}};

exports.mounted = function(){};