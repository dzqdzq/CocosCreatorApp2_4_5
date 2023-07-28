"use strict";
const e = require("fire-fs");
const t = require("path");
const r = require("../lib/advice");
const i = require("../lib/record");
const o = require("../lib/info");
const s = require("../lib/resource");
const a = require("electron").remote.dialog;
exports.components = {thumbnail:require("./thumbnail"),details:require("./details"),multipleThumb:require("./multipleThumb")};
exports.template = e.readFileSync(t.join(__dirname,"../template/home.html"),"utf-8");
exports.props = [];
exports.data = function(){return {width:0,previewx:0,previewy:300,previewsrc:"",percentage:1,records:[],select:null,loading:true};};

exports.methods = {manualClick(){Editor.Panel.open("google-instant-games.manual")},canClose(){return 0===this.records.filter(e=>{if (e.modify) {
  return true;
}}).length;},computeStyle(){return`transform: translate(${this.previewx}px,${this.previewy}px) scaleY(-1);`},async save(){
  clearTimeout(this._updateTimer);
  r.emit("toggle-loading",true);
  this._updateTimer = setTimeout(()=>{r.emit("toggle-loading",false)},500);
  let e = await i.queryRecordResources(this.select.path,1);
  let t = await i.queryRecordResources(this.select.path,this.percentage);
  for(let e=0;e<t.length;e++){
    let r=t[e];

    if (!(await s.queryAssetInfo(r.uuid))) {
      t.splice(e,1);
      e--;
    }
  }
  t = t.filter(e=>e.selected);
  for(let t=0;t<e.length;t++){
    let r=e[t];

    if (!(await s.queryAssetInfo(r.uuid))) {
      e.splice(t,1);
      t--;
    }
  }
  o.saveJson(this.select.path,{totalCount:e.length,selectCount:t.length,first:{scope:this.percentage,items:t.map(e=>e.uuid)},addList:i.addList.map(e=>e.uuid),removeList:i.removeList.map(e=>e.uuid)});
  r.emit("record-modify",this.select,false);
},close(){
  Editor.Panel.close("google-instant-games");
  Editor.Panel.close("google-instant-games.manual");
},t:e=>Editor.T(e)};

exports.computed = {};

exports.created = function(){
  r.on("query-record-path-ret",async r=>{
    if(!r){
      let i = t.join(Editor.Project.path,"/temp/android-instant-games/profiles/");
      let o = e.readdirSync(i);
      if (0===(o=o.filter(r=>e.isDirSync(t.join(i,r)))).length) {
        a.showErrorBox(Editor.T("REFACTOR.file_not_found_title"),Editor.T("REFACTOR.file_not_found"));
        return;
      }
      o.sort((e,t)=>parseInt(t)-parseInt(e));
      r = t.join(Editor.Project.path,`/temp/android-instant-games/profiles/${o[0]}`);
    }
    let s = o.readJson(r);
    let n = {path:r,modify:false};
    this.records.push(n);
    await i.loadData(n.path);

    if (s&&s.first&&"number"==typeof s.first.scope) {
      this.percentage = s.first.scope;
    }

    this.select = n;
  });

  r.emit("query-record-path");

  r.on("change-preview",e=>{
    let t=this.width-40-.3*this.width;
    this.previewx = Math.min((this.width-40)*e.percentage,t);
    this.previewy = 75*this.records.indexOf(e.record);
    this.previewsrc = e.src;
  });

  r.on("change-range",e=>{this.percentage = e;});
  r.on("record-modify",(e,t)=>{this.records.find(t=>t.path===e.path).modify = t;});

  r.on("record-change",e=>{
    if (this.select!==e) {
      this.select = e;
      i.loadData(e.path);
    }
  });

  r.on("record-remove",e=>{
    let t=this.records.indexOf(e);

    if (-1!==t) {
      this.records.splice(t,1);
    }
  });

  r.on("record-add",r=>{
    let i=this.records.findIndex(e=>e.path===r);if (!e.existsSync(t.join(r,"timeline.json"))) {
      Editor.error(Editor.T("REFACTOR.config_not_found"));
      return;
    }

    if (-1===i) {
      this.records.push({path:r,modify:false});
    }
  });

  r.on("toggle-loading",e=>{this.loading = e;});

  r.on("record-save",async e=>{
    await this.save();

    if (e) {
      r.emit("record-change",e);
    }
  });

  r.on("manual-add-resource",e=>{
    if (e) {
      e.forEach(e=>{i.moveToAddList(e)});
    }

    r.emit("record-modify",this.select,true);
  });
};