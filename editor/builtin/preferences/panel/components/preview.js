"use strict";
const e = require("fire-fs");
const i = require("path");
const r = require("electron");
const t = r.remote.dialog;
exports.template = e.readFileSync(Editor.url("packages://preferences/panel/template/preview.html"),"utf-8");
exports.props = ["preview"];
exports.data = function(){return {orientationList:[{value:true,text:Editor.T("PREFERENCES.simulator_device_horizontal")},{value:false,text:Editor.T("PREFERENCES.simulator_device_vertical")}]};};

exports.watch = {"preview.simulatorDebugger"(e){
  if (!e) {
    this.preview.simulatorWaitForConnect = false;
  }
}};

exports.methods = {T:Editor.T,chooseBrowser(){
  let e = Editor.isWin32?"Exe":"App";
  let r = t.showOpenDialogSync({defaultPath:this.preview.previewBrowser,properties:["openFile"],filters:[{name:e,extensions:[e.toLowerCase()]}]});

  if (Array.isArray(r)) {
    r = r[0];
  }

  if (r) {
    if (!this.preview.previewBrowserList.some(e=>e.value===r)) {
      this.preview.previewBrowserList.push({value:r,text:i.basename(r)});
    }

    this.preview.previewBrowser = r;
  }
},removeBrowser(){let e=this.preview.previewBrowser;this.preview.previewBrowserList.some((i,r)=>{if (i.value===e) {
  this.preview.previewBrowserList.splice(r,1);
  this.preview.previewBrowser = "default";
  return true;
}})},openSimulatorDir(){
  let i=this.preview.simulatorPath;if (!e.existsSync(i)) {
    Editor.warn(`Folder does not exist: ${i}`);
    return;
  }
  r.shell.showItemInFolder(i);
  r.shell.beep();
},onResolutionChange(e){
  let i=this.preview.resolutionList[e];

  if (i.width&&i.height) {
    this.preview.customizeSize.width = i.width;
    this.preview.customizeSize.height = i.height;
  }
},onLandscapeChanged(e){this.preview.isLandscape = "true"===e.target.value;},onCustomizeSizeChange(){this.preview.resolution = this.preview.resolutionList.length-1;}};

exports.created = function(){};