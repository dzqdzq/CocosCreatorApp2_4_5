"use strict";
let e = require("./utils.js");
let r = e.getCreatorHomePath()+"/local/service.json";
let s = ()=>e.getProjectPath()+"/settings/services.json";

module.exports = {needExecNative(){var r=e.readJson(s());return void 0===r.needExecNative?!!r.configs:r.needExecNative},readBindGame:()=>e.readJson(s()).game,writeBindGame(r){
  var i=e.readJson(s());
  i.game = r;
  if(i.configs){
    var a=false;for(var v of i.configs)a = v.appid===i.game.appid;

    if (!a) {
      i.configs.push({appid:r.appid});
    }
  }e.saveJson(s(),i)
},readEnableService(){
  var r = e.readJson(s());
  var i = [];
  if (r.configs) {
    for(var a of r.configs)if (a.appid===r.game.appid&&a.services) {
      for (var v of a.services) if (v.enable) {
        i.push(v.service_id);
      }
    }
  }return i
},wirteEnableService(r,i){
  var a = e.readJson(s());
  var v = false;

  if (i) {
    a.needExecNative = true;
  }

  if(a.configs){for(var d of a.configs)if (d.appid===a.game.appid) {
    if(d.services){for (var o of d.services) if (r===o.service_id) {
      o.enable = i;
      v = true;
    }if(!v){o = {service_id:r,enable:i};d.services.push(o)}}else{
      var n=[];
      n.push({service_id:r,enable:i});
      d.services = n;
    }
  }}else{
    var c=[];
    c.push({appid:a.game.appid,services:[{service_id:r,enable:i}]});
    a.configs = c;
  }e.saveJson(s(),a)
},writeServiceParam(r,i){
  var a = e.readJson(s());
  var v = false;
  if(a.configs){for(var d of a.configs)if (d.appid===a.game.appid) {
    if(d.services){for (var o of d.services) if (r===o.service_id) {
      o.params = i;
      v = true;
    }if(!v){o = {service_id:r,enable:isEnable,params:i};d.services.push(o)}}else{
      var n=[];
      n.push({service_id:r,enable:isEnable,params:i});
      d.services = n;
    }
  }}else{
    var c=[];
    c.push({appid:a.game.appid,services:[{service_id:r,enable:isEnable,params:i}]});
    a.configs = c;
  }e.saveJson(s(),a)
},readServiceParam(r){
  var i = e.readJson(s());
  var a = {};
  if (i.configs) {
    for(var v of i.configs)if (v.appid===i.game.appid&&v.services) {
      for (var d of v.services) if (r===d.service_id&&d.params) {
        a = d.params;
      }
    }
  }return a
},writeServiceList(s){
  var i=e.readJson(r);

  if (i&&i.devmode) {
    i.dev_services = s;
  } else {
    i.services = s;
  }

  i.lang = e.getLang();
  e.saveJson(r,i);
},readServiceList(){var s=e.readJson(r);return s?s.devmode&&s.dev_services?s.dev_services:!s.devmode&&s.services?s.services:null:null},readDebugMode(){var s=e.readJson(r);return void 0!==s.debug&&s.debug},readDevMode:()=>false,writeDevMode(s){
  var i=e.readJson(r);
  i.devmode = s;
  e.saveJson(r,i);
},readServiceConfig:()=>e.readJson(r)};