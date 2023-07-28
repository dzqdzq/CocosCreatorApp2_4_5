"use strict";
const o = require("./fs");
const t = require("fs-extra");
const e = require("path");
const n = Editor.remote?Editor.remote.App.home:Editor.App.home;
const r = e.join(n,"cloud-component");
t.ensureDirSync(r);

exports.install = function(n,i){return new Promise((n,s)=>{
  const c=e.join(r,".temp");

  if (t.existsSync(c)) {
    t.removeSync(c);
  }

  o.unzip(i,c,function(o){
    if (o) {
      return s(o);
    }const d=t.readdirSync(c).filter(o=>{
      const n=e.join(c,o);
      !t.existsSync(n);
      return "__MACOSX"!==o&&(!!t.statSync(n).isDirectory()||void 0);
    });if (1!==d.length) {
      Editor.warn(Editor.T("store.cloudComponent.do_not_install")+"\n"+i);
      return s(new Error(Editor.T("store.cloudComponent.do_not_install")));
    }const l=e.join(r,d[0]);if(t.existsSync(l)){const o=Editor.Dialog.messageBox({title:Editor.T("store.cloudComponent.install"),message:Editor.T("store.cloudComponent.exists"),buttons:[Editor.T("store.button.confirm"),Editor.T("store.button.cancel")],defaultId:0,cancelId:0});if (1===("number"==typeof o.response?o.response:o)) {
      n();
      return;
    }t.removeSync(l)}
    t.copySync(e.join(c,d[0]),e.join(r,d[0]));
    Editor.Ipc.sendToAll("store:cloud-component-install");
    Editor.Dialog.messageBox({title:Editor.T("store.cloudComponent.install"),message:Editor.T("store.cloudComponent.success"),buttons:[Editor.T("store.button.confirm")],defaultId:0,cancelId:0});
    Editor.Ipc.sendToAll("store:cloud-component-installation-completed");
    return n();
  });
});};