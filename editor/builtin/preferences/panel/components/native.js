"use strict";
const e = require("electron");
const t = e.remote.dialog;
const i = require("fire-fs");
exports.template = i.readFileSync(Editor.url("packages://preferences/panel/template/native.html"),"utf-8");
exports.props = ["native"];
exports.data = function(){return{dev:Editor.dev}};

exports.methods = {T:Editor.T,_onUseDefaultCppEngineChanged(e){let t=e.target.value;if (0===this.askUpdateSimulatorConfig()) {
  e.target.checked = !t;
  return;
}this.native.useDefaultCppEngine = t;},_onJavaScriptEngineChanged(e){Editor.warn(Editor.T("PREFERENCES.native.js_engine_changed_info"))},async choosePath(e){let i=await function(e){
  e = e||Editor.Project.path;
  return new Promise(async i=>{
    let a={defaultPath:e,properties:["openDirectory"]};

    if ("darwin"===process.platform) {
      a.properties.push("openFile");
      a.properties.push("treatPackageAsDirectory");
      a.filters = [{name:"Application",extensions:["app"]}];
    }

    i((await t.showOpenDialog(a)).filePaths[0]);
  });
}(this.native[e]);if(i){if ("cppEnginePath"===e) {if (0===this.askUpdateSimulatorConfig()) {
  return
}} else {
  if ("jsEnginePath"===e) {
    this._onJavaScriptEngineChanged();
  }
}this.native[e] = i;}},openPath(t){
  let a=this.native[t];

  if (!i.existsSync(a)) {
    Editor.warn(`Folder does not exist: ${a}`);
    a = Editor.appPath;
  }

  e.shell.showItemInFolder(a);
  e.shell.beep();
},askUpdateSimulatorConfig:()=>Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("MESSAGE.cancel"),Editor.T("PREFERENCES.native.confirm_and_update")],title:"Need update simulator config",message:Editor.T("PREFERENCES.native.need_update_simulator"),detail:"",defaultId:1,cancelId:0,noLink:true})};

exports.created = function(){};