"use strict";
const e = require("fs");
const t = require("path");
const o = require("../utils/event");
exports.template = e.readFileSync(t.join(__dirname,"../template/tools.html"),"utf-8");
exports.props = ["filter","regular","type","fsize","collapse","aclear"];
exports.data = function(){return {sizes:[8,10,12,14,16,18,20],options:false};};
exports.components = {};

exports.methods = {t:e=>Editor.T(`CONSOLE.${e}`),showOptions(e){
  e.stopPropagation();
  e.preventDefault();
  clearTimeout(this._hideOptionsTimer);
  this.options = true;
},hideOptions(e){
  e.stopPropagation();
  e.preventDefault();
  clearTimeout(this._hideOptionsTimer);
  this._hideOptionsTimer = setTimeout(()=>{this.options = false;},300);
},onClearAll(){Editor.Ipc.sendToMain("console:clear","^(?!.*?SyntaxError)",true)},onOpenLogFile(e){let t=e.target.getBoundingClientRect();Editor.Ipc.sendToPackage("console","popup-open-log-menu",t.left,t.bottom+5)},onFilterChanged(e){o.emit("filter-changed",e.target.value)},onRegularChanged(e){o.emit("regular-changed",e.target.value)},onTypeChanged(e){o.emit("type-changed",e.target.value)},onFontSizeChanged(e){o.emit("font-size-changed",e.target.value)},onCollapseChanged(e){o.emit("collapse-changed",e.target.value)},onAutoClearChanged(e){o.emit("auto-clear-changed",e.target.value)}};

exports.created = function(){};