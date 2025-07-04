"use strict";
const t = require("fire-fs");
const e = require("path");
const a = require("../utils/data");
const r = Editor.Profile.load("global://features.json").get("cloud-function");
exports.template = t.readFileSync(e.join(__dirname,"../template/home.html"),"utf-8");
exports.props = [];
exports.data = function(){return{zoom:a.queryZoom(),tab:-1,tabs:[Editor.T("node-library.tab.creator"),Editor.T("node-library.tab.cfunc"),Editor.T("node-library.tab.user")],hideCloud:!r,list:[]}};
exports.components = {classification:require("./classification")};

exports.methods = {async updateData(){this.list = await a.queryList(this.tab);},async changeTab(t){
  this.tab = t;
  this.list = await a.queryList(t);
  let e=a.get();

  if (e.global) {
    e.global.set("tab",t);
    e.global.save();
  }
},onZoomChanged(t){
  this.zoom = t.target.value;
  clearTimeout(this._zoomTimer);
  this._zoomTimer = setTimeout(()=>{a.setZoom(this.zoom)},500);
},onDropAreaMove(t){
  if (2===this.tab&&t.detail.dragOptions&&"node-library"!==t.detail.dragOptions.from) {
    Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer,"copy");
  } else {
    Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer,"none");
  }
},onDropAreaAccept(t){
  t.preventDefault();

  if (2===this.tab&&t.detail.dragItems&&t.detail.dragItems.length) {
    t.detail.dragItems.forEach(t=>{Editor.assetdb.queryMetaInfoByUuid(t.id,(e,r)=>{if ("prefab"!==r.defaultType) {
      return Editor.warn(Editor.T("node-library.warning.prefab_only"));
    }a.pushUserPrefab(t.id)})});
  }
}};

exports.created = function(){
  this.changeTab(0);
  a.event.on("profile-save",this.updateData);
};

exports.destroyed = function(){a.event.removeListener("profile-save",this.updateData)};