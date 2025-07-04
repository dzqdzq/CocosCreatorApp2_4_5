"use strict";
const e = require("fire-fs");
const t = require("path");
const i = require("../libs/advice");
const s = require("../libs/manager");
exports.template = e.readFileSync(t.join(__dirname,"../template/edit-event.html"),"utf-8");
exports.props = ["event","clip"];
exports.watch = {};
exports.data = function(){return {dirty:false,keys:[]};};

exports.methods = {t:Editor.T,updateKeys(){for (; this.keys.length; ) {
  this.keys.pop();
}if (!this.clip) {
  return;
}let e=s.Clip.queryInfo(this.clip.id);s.Clip.queryEvents(this.clip.id).forEach(t=>{
  if (Math.round(t.frame*e.sample)===this.event) {
    this.keys.push({name:t.func,params:t.params.map(e=>{
      let t = e+"";
      let i = parseInt(e);
      let s = !!e;

      if (isNaN(i)) {
        i = 0;
      }

      return {type:typeof e,s:t,n:i,b:s};
    })});
  }
})},save(){
  let e = s.Clip.queryEvents(this.clip.id);
  let t = s.Clip.queryInfo(this.clip.id);
  for(let i=0;i<e.length;i++){
    let a=e[i];

    if (Math.round(a.frame*t.sample)===this.event) {
      s.Clip.deleteEvent(this.clip.id,a);
      i--;
    }
  }
  this.keys.forEach(e=>{let t=e.params.map(e=>"string"===e.type?e.s:"number"===e.type?e.n:e.b);s.Clip.addEvent(this.clip.id,this.event,e.name,t)});
  this.dirty = false;
  i.emit("change-info");
},_onAddFuncClick(){
  this.dirty = true;
  this.keys.push({name:"",params:[]});
},_onCloseClick(){if(this.dirty){
  let e=Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("MESSAGE.cancel"),Editor.T("MESSAGE.save"),Editor.T("MESSAGE.dont_save")],title:Editor.T("timeline.home.edit_title"),message:Editor.T("timeline.home.edit_message"),detail:"",defaultId:0,cancelId:0,noLink:true});if (0===e) {
    return;
  }

  if (1===e) {
    this.save();
  }
}i.emit("change-event",-1)},_onFuncNameChanged(e,t){
  this.dirty = true;
  t.name = e.target.value;
},_onFuncAddParamClick(e){
  this.dirty = true;
  e.params.push({type:"string",s:"",n:0,b:false});
},_onFuncRemoveParamClick(e){
  this.dirty = true;
  e.params.pop();
},_onFuncDeleteClick(e){
  if (0!==Editor.Dialog.messageBox({type:"question",buttons:[Editor.T("MESSAGE.cancel"),Editor.T("timeline.home.edit_delete")],title:Editor.T("timeline.home.edit_title2"),message:Editor.T("timeline.home.edit_remove_params"),detail:Editor.T("timeline.home.edit_detail2"),defaultId:0,cancelId:0,noLink:true})) {
    this.dirty = true;
    this.keys.some((t,i)=>t===e&&(this.keys.splice(i,1),true));
  }
},_onItemTypeChanged(e,t){
  this.dirty = true;
  t.type = e.target.value;
},_onItemSChanged(e,t){
  this.dirty = true;
  t.s = e.target.value+"";
},_onItemNChanged(e,t){
  this.dirty = true;
  t.n = e.target.value-0;
},_onItemBChanged(e,t){
  this.dirty = true;
  t.b = "true"===e.target.value;
}};

exports.created = function(){
  this.dirty = false;
  this.updateKeys();
};