"use strict";
const t = require("fire-fs");
const e = require("fire-path");
exports.template = t.readFileSync(Editor.url("packages://project-settings/panel/template/preview.html"),"utf-8");
exports.props = ["project","simulator"];
exports.data = function(){return{sceneList:[],simulatorTypes:[{title:Editor.T("PROJECT_SETTINGS.preview.global"),value:"global"},{title:Editor.T("PROJECT_SETTINGS.preview.project"),value:"project"}],orientationList:[{title:Editor.T("PREFERENCES.simulator_device_horizontal"),value:"horizontal"},{title:Editor.T("PREFERENCES.simulator_device_vertical"),value:"vertical"}]}};

exports.methods = {T:Editor.T,_setResolutionSize(){
  var t = this.simulator.resolution-0;
  var e = this.simulator.resolutionList[t];
  this.simulator.width = e.width;
  this.simulator.height = e.height;
},_setCustomResolution(){this.simulator.resolution = this.simulator.resolutionList.length-1;}};

exports.created = function(){Editor.assetdb.queryAssets(null,"scene",(t,i)=>{
  this.sceneList = i.map(function(t){return{value:t.uuid,text:e.basename(t.url)}});
  this.sceneList.unshift({value:"current",text:Editor.T("PROJECT_SETTINGS.preview.current_scene")});
})};