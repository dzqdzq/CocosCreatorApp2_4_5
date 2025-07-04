"use strict";
const e = require("fs");
const t = require("path");
const o = require("../utils");
exports.template = e.readFileSync(t.join(__dirname,"../template/tab-project.html"),"utf-8");
exports.props = ["projects","filter","isloggedin","skip"];
exports.data = function(){return{selected:-1,path:""}};

exports.methods = {t:e=>Editor.T(e),jumpCreateProject(){
  o.event.emit("change-tab","create");
  o.event.emit("change-filter","");
},updatePath(e){if(!e){let t=this.projects[this.selected];e = t?t.path:"";}this.path = e;},getProjectIcon:()=>Editor.url("app://dashboard/static/img/cocos_logo.png"),clearSelected(){
  this.selected = -1;
  this.updatePath();
},selectProject(e){
  event.stopPropagation();
  event.preventDefault();
  this.selected = e;
},openProject(e){
  event.stopPropagation();
  event.preventDefault();

  Editor.Ipc.sendToMain("app:open-project",e,!!this.isloggedin,(e,t)=>{
    if (e) {
      o.event.emit("change-error-message",e.message);
    }

    if (t&&!t.abort) {
      o.event.emit("update-projects");
    }
  });

  this.clearSelected();
},removeProject(e){
  let t = Editor.isWin32?Editor.T("MESSAGE.move_to_trash_win"):Editor.T("MESSAGE.move_to_trash_mac");
  let r = Editor.Dialog.messageBox({type:"warning",buttons:[Editor.T("MESSAGE.remove_from_list"),t,Editor.T("MESSAGE.cancel")],title:Editor.T("MESSAGE.dashboard.delete_title"),message:Editor.T("MESSAGE.dashboard.delete_message"),detail:Editor.T("MESSAGE.dashboard.delete_detail",{path:e}),defaultId:0,cancelId:2,noLink:true});
  switch(r){case 1:Editor.Ipc.sendToMain("app:delete-project",e);break;case 0:Editor.Ipc.sendToMain("app:close-project",e)}

  if (!(1!==r && 0!==r)) {
    o.event.emit("update-projects");
  }
},filterProject:(e,t)=>!e.name||!t||-1!==e.name.toLowerCase().indexOf(t.toLowerCase())};

exports.ready = function(){};