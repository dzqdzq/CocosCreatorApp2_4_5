"use strict";
const e = require("electron");
const t = require("fs");
const a = require("path");
const r = require("../utils");
exports.template = t.readFileSync(a.join(__dirname,"../template/tab-create.html"),"utf-8");
exports.props = ["templates","filter"];
let s="";
exports.data = function(){return{selected:0,info:"",path:s}};
exports.watch = {selected(){this.updateInfo()},path(){s = this.path;}};

exports.methods = {_onUpdatePath(e){this.path = e.target.value;},t:e=>Editor.T(e),getTemplateIcon:e=>e.banner,changeSelected(e){this.selected = e;},updateInfo(){let e=this.templates[this.selected];this.info = e.desc;},async resetPath(e){let s;e = e||(await r.getUserHome());let i=0;do{
  s = a.join(e,`NewProject${i?"_"+i:""}`);
  i++;
}while(t.existsSync(s));this.path = s;},async selectPath(){
  let t=e.remote.dialog.showOpenDialogSync({title:Editor.T("DASHBOARD.choose_project"),properties:["openDirectory","createDirectory"],defaultPath:await r.getUserHome()});

  if (t) {
    this.resetPath(t[0]);
  }
},createProject(){
  let e=this.templates[this.selected];if (!this.filterTemplate(e,this.filter)) {
    r.event.emit("change-error-message","No selected template");
    return;
  }
  let s = a.basename(this.path);
  let i = a.dirname(this.path);
  if (t.existsSync(this.path)) {
    r.event.emit("change-error-message",Editor.T("DASHBOARD.exists_project_name"));
    return;
  }if (!/^[_a-z0-9-]+$/gi.test(s)) {
    r.event.emit("change-error-message",Editor.T("DASHBOARD.invalid_project_name"));
    return;
  }if ("win32"===process.platform?!/^[a-z]:\\[_a-z0-9-\\]*$/gi.test(i):!/^\/[_a-z0-9-\/]+$/gi.test(i)) {
    r.event.emit("change-error-message",Editor.T("DASHBOARD.invalid_project_path"));
    return;
  }let o=this.templates[this.selected];Editor.Ipc.sendToMain("app:create-project",{path:this.path,template:o.path,templateName:o.templateName},e=>{
    r.event.emit("update-projects");
    r.event.emit("change-tab","project");

    if (e) {
      r.event.emit("change-error-message",e.message);
    }
  })
},filterTemplate:(e,t)=>!e.name||!t||-1!==e.name.toLowerCase().indexOf(t.toLowerCase())};

exports.ready = function(){
  this.updateInfo();
  this.resetPath(this.path?a.dirname(this.path):"");
};