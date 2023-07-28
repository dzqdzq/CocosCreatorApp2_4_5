"use strict";
const e = require("fs");
const t = require("path");
const r = require("../lib/advice");
require("../lib/record");
require("../lib/info");
require("../lib/resource");
exports.components = {thumbnail:require("./thumbnail")};
exports.template = e.readFileSync(t.join(__dirname,"../template/multipleThumb.html"),"utf-8");
exports.props = ["records","width","select"];
exports.data = function(){return{}};

exports.methods = {t:e=>Editor.T(e),getNameByPath:e=>t.basename(e.path),changeClick(e){if(e!==this.select){if(this.select.modify){
  let t=Editor.Dialog.messageBox({type:"warning",title:Editor.T("MESSAGE.warning"),message:Editor.T("MESSAGE.refactor.modify_tips",{record:this.getNameByPath(this.select)}),buttons:[Editor.T("MESSAGE.yes"),Editor.T("MESSAGE.no")],defaultId:0,cancelId:1,noLink:true});

  if (0===t) {
    r.emit("record-save",e);
  } else {
    if (1===t) {
      r.emit("record-modify",this.select,false);
      r.emit("record-change",e);
    }
  }

  return;
}r.emit("record-change",e)}},removeClick(e){
  if (e!==this.select) {
    r.emit("record-remove",e);
  }
},openRecord(e){
  e.stopPropagation();let i=Editor.Dialog.openFile({defaultPath:t.join(Editor.Project.path,"/temp/android-instant-games/profiles"),properties:["openDirectory"]});

  if (i&&i[0]) {
    r.emit("record-add",i[0]);
  }
}};

exports.computed = {};
exports.created = function(){};