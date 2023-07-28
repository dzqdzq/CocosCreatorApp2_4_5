"use strict";
const e = require("fs");
const t = require("path");
const i = require("../lib/record");
const s = require("../lib/advice");
const r = require("../lib/resource");
const l = require("electron").remote.dialog;
exports.template = e.readFileSync(t.join(__dirname,"../template/details.html"),"utf-8");
exports.props = ["percentage","record"];
exports.data = function(){return{list:{},addList:i.addList,removeList:i.removeList,listObj:{},nativeSize:8808038.4}};
exports.watch = {percentage(){this.updateList()},addList(){this.updateList()},removeList(){this.updateList()},record(){this.updateList()},list:{handler:function(e,t){for(let t in e)e[t].selected = this.checkAllSelected(t);},deep:true}};

exports.computed = {tf:function(){let e=0;for(let t in this.list){
  let i=this.list[t];

  if (i) {
    e += i.selectedLength;
  }
}return e},ts:function(){let e=0;for(let t in this.list){
  let i=this.list[t];

  if (i) {
    e += i.size;
  }
}return e},tzs:function(){let e=0;for(let t in this.list){
  let i=this.list[t];

  if (i) {
    e += i.zsize;
  }
}return e}};

exports.methods = {t:e=>Editor.T(e),async updateList(){
  if (this.record) {
    clearTimeout(this._updateTimer);

    this._updateTimer = setTimeout(async()=>{
      if (this._updateListLock) {
        return;
      }
      this._updateListLock = true;
      let e = {};
      let t = [];

      (await i.queryRecordResources(this.record.path,this.percentage)).forEach(i=>{
        let s;
        this.listObj[i.uuid] = i;

        if (!e[i.type]) {
          e[i.type] = {list:[],size:0,zsize:0,type:i.type};
          t.push(e[i.type]);
        }

        (s=e[i.type]).size = s.size||0;

        if (i.selected) {
          s.size += i.size;
          s.zsize += i.zsize;
        }

        if (-1==s.list.indexOf(i)) {
          s.list.push(i);
        }

        s.selectedLength = s.list.filter(e=>{if (e.selected) {
          return e
        }}).length;

        s.selected = false;
      });

      this.sortByKey(t);
      let r={};
      t.forEach(e=>{r[e.type] = e;});
      this.list = r;
      for(let t in e)this.sortByKey(e[t].list);
      this._updateListLock = false;
      s.emit("toggle-loading",false);
    },50);
  }
},sortByKey(e){e.sort((e,t)=>t.size-e.size)},toggleAll(e){
  let t = this.list[e];
  let i = t.selected;
  for(let s=0;s<t.list.length;s++){
    let r=t.list[s];
    r.selected = i;
    this.onItemChanged(e,r.uuid,true);
  }this.updateSize(e)
},checkAllSelected(e){
  let t = true;
  let i = this.list[e];
  for (let e=0; e<i.list.length; e++) {
    if(!i.list[e].selected){t = false;break}
  }return t
},onItemChanged(e,t,r){
  let l=this.listObj[t];

  if (l) {
    if (l.selected) {
      i.moveToAddList(t);
    } else {
      i.moveToRemoveList(t);
    }

    if (!r) {
      this.updateSize(e);
    }

    s.emit("record-modify",this.record,true);
  }
},updateSize(e){
  if (!this.list[e]) {
    return;
  }let t=this.list[e];
  t.size = 0;
  t.zsize = 0;
  t.selectedLength = 0;

  t.list.forEach(e=>{
    if (e.selected) {
      t.size += e.size;
      t.zsize += e.zsize;
      t.selectedLength++;
    }
  });
},handleSize:e=>e<1048576?`${(e/=1024).toFixed(2)}KB`:`${(e/=1048576).toFixed(2)}MB`,onDropAreaAccept(e){
  e.stopPropagation();let t=e.detail.dragItems;

  if (t) {
    this.addManualAssets(t);
  }
},async addManualAssets(e){
  let t={success:[],exist:[],fail:[]};for(let s=0;s<e.length;s++){
    let l = e[s];
    let o = await r.queryAssetInfo(l.id);
    o.manual = true;
    t[i.addManualItem(o)].push(o.name);
  }

  if (t.exist.length>0) {
    l.showErrorBox(Editor.T("BUILDER.error.refactor_error"),Editor.T("MESSAGE.refactor.resource_merge",{exist:t.exist.join(",")}));
  }

  s.emit("record-modify",this.record,true);
}};

exports.created = function(){this.updateList()};
exports.directives = {fold:{bind(){this.el.fold()}}};