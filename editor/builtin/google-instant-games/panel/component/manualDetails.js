"use strict";
const e = require("fs");
const t = require("path");
require("../lib/record");
require("../lib/advice");
require("../lib/resource");
exports.template = e.readFileSync(t.join(__dirname,"../template/manualDetails.html"),"utf-8");
exports.props = ["resources"];
exports.data = function(){return{list:{},listObj:{}}};
exports.watch = {list:{handler:function(e,t){for(let t in e)e[t].selected = this.checkAllSelected(t);},deep:true}};

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
  clearTimeout(this._updateTimer);

  this._updateTimer = setTimeout(async()=>{
    if (this._updateListLock) {
      return;
    }
    this._updateListLock = true;
    let e={};

    this.resources.forEach(t=>{
      this.listObj[t.uuid] = t;
      let i=e[t.type]=e[t.type]||{list:[],size:0,zsize:0};
      i.size = i.size||0;

      if (t.selected) {
        i.size += t.size;
        i.zsize += t.zsize;
      }

      if (-1==i.list.indexOf(t)) {
        i.list.push(t);
      }

      i.selectedLength = i.list.filter(e=>{if (e.selected) {
        return e
      }}).length;

      i.selected = false;
    });

    this.list = e;
    for(let t in e)this.sortByKey(t);
    this._updateListLock = false;
  },50);
},sortByKey(e){this.list[e].list.sort((e,t)=>t.size-e.size)},toggleAll(e){
  let t = this.list[e];
  let i = t.selected;
  for(let e=0;e<t.list.length;e++){t.list[e].selected = i;}this.updateSize(e)
},onItemChanged(e,t){
  if (this.listObj[t]) {
    this.updateSize(e);
  }
},checkAllSelected(e){
  let t = true;
  let i = this.list[e];
  for (let e=0; e<i.list.length; e++) {
    if(!i.list[e].selected){t = false;break}
  }return t
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
},handleSize:e=>e<1048576?`${(e/=1024).toFixed(2)}KB`:`${(e/=1048576).toFixed(2)}MB`,handleArraySize(e){
  let t=0;
  e.forEach(e=>{t += e.size;});
  return this.handleSize(t);
}};

exports.created = function(){this.updateList()};
exports.directives = {fold:{bind(){this.el.fold()}}};