"use strict";const e=require("fire-fs");
exports.template = e.readFileSync(Editor.url("packages://preferences/panel/template/general.html"),"utf-8");
exports.props = ["general"];
exports.data = function(){return{languageList:[{value:"zh",text:"中文"},{value:"en",text:"English"}],nodeStateLsit:[{value:1,text:Editor.T("PREFERENCES.expand_all")},{value:2,text:Editor.T("PREFERENCES.collapse_all")},{value:3,text:Editor.T("PREFERENCES.memory_last_state")}],ipList:Editor.remote.Network.ipList.map((e,t)=>({value:t+2,text:e}))}};
exports.methods = {T:Editor.T};
exports.created = function(){};