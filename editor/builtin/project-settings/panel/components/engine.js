"use strict";
const e = require("fire-fs");
const t = require("electron");
const n = t.remote.dialog;
exports.template = e.readFileSync(Editor.url("packages://project-settings/panel/template/engine.html"),"utf-8");
exports.props = ["engine"];

exports.methods = {T:Editor.T,_onJavaScriptEngineChanged(e){Editor.warn(Editor.T("PREFERENCES.native.js_engine_changed_info"))},choosePath(e){(function(e,t){
  e = e||Editor.Project.path;
  let i=n.showOpenDialogSync({defaultPath:e,properties:["openDirectory"]});

  if (Array.isArray(i)) {
    i = i[0];
  }

  if (t) {
    t(i);
  }
})(this.engine[e],t=>{
  this.engine[e] = t;
  this._onJavaScriptEngineChanged();
})},openPath(n){
  let i=this.engine[n];

  if (e.existsSync(i)) {
    t.shell.showItemInFolder(i);
    t.shell.beep();
  }
}};

exports.created = function(){};