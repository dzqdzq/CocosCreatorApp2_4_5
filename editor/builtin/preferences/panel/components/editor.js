"use strict";
const t = require("fire-fs");
const e = require("path");
const i = require("electron").remote.dialog;
exports.template = t.readFileSync(Editor.url("packages://preferences/panel/template/editor.html"),"utf-8");
exports.props = ["editor"];

exports.methods = {T:Editor.T,chooseScriptEditor(){
  let t = Editor.isWin32?"Exe":"App";
  let r = i.showOpenDialogSync({defaultPath:this.editor.customizePictureEditor,properties:["openFile"],filters:[{name:t,extensions:[t.toLowerCase()]}]});

  if (Array.isArray(r)) {
    r = r[0];
  }

  if (r) {
    if (!this.editor.sctiptEditorList.some(t=>t.value===r)) {
      this.editor.sctiptEditorList.push({value:r,text:e.basename(r)});
    }

    this.editor.customizeScriptEditor = r;
  }
},removeScriptEditor(){let t=this.editor.customizeScriptEditor;this.editor.sctiptEditorList.some((e,i)=>{if (e.value===t) {
  this.editor.sctiptEditorList.splice(i,1);
  this.editor.customizeScriptEditor = "default";
  return true;
}})},choosePictureEditor(){
  let t = Editor.isWin32?"Exe":"App";
  let e = i.showOpenDialogSync({defaultPath:this.editor.customizePictureEditor,properties:["openFile"],filters:[{name:t,extensions:[t.toLowerCase()]}]});

  if (Array.isArray(e)) {
    e = e[0];
  }

  if (e) {
    this.editor.customizePictureEditor = e;
  }
}};

exports.created = function(){};