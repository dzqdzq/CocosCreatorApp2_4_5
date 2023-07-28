"use strict";
const {app:e,dialog:o,BrowserWindow:t} = require("electron");
const {spawn:r} = require("child_process");
const {join:n} = require("path");
let s = [];
let i = e.getPath("exe");

exports.startup = function(t,d,a){
  let c = n(t,"local/logs/project.log");
  let l = [Editor.App.path,"--path",t,"--logfile",c];

  if (!d) {
    l.push("--nologin");
  }

  if (a) {
    l.push("--dev");
    l.push("--inspect=1988");
  }

  if (Editor.showInternalMount) {
    l.push("--internal");
  }

  let h=r(i,l,{stdio:[0,1,2,"ipc"],env:process.env});
  process.env.checkedVersion = false;
  let p = [];
  let u = false;

  let f = function(){if (u) {
    return;
  }u = true;let e=p.shift();if (1!==o.showMessageBoxSync({type:"error",buttons:["OK","Abort"],title:"Error",message:e.message,detail:e.stack,defaultId:0,cancelId:0})) {
    if (p.length>0) {
      f();
    }

    u = false;
    return;
  }setTimeout(()=>{
    p.length = 0;
    h.kill();
    u = false;
  },200)};

  h.on("message",e=>{
    if ("show-dashboard"===e.channel) {
      Editor.Ipc.sendToMainWin("dashboard:refresh-recent-project");
      Editor.Ipc.sendToMainWin("dashboard:refresh-last-create");
      Editor.Window.main.show();
    } else {
      if ("editor-error"===e.channel) {
        p.push(e);
        f();
      }
    }
  });

  h.on("close",()=>{
    let o=s.indexOf(h);

    if (-1!==o) {
      s.splice(o,1);
    }

    if (0===s.length) {
      Editor.Ipc.sendToMainWin("dashboard:refresh-recent-project");
      Editor.Ipc.sendToMainWin("dashboard:refresh-last-create");
      Editor.Window.main.show();

      if (e.dock) {
        e.dock.show();
      }
    }
  });

  s.push(h);

  if (e.dock) {
    e.dock.hide();
  }

  return h;
};

exports.closeAll = function(){for (; s.length>0; ) {
  s.pop().kill()
}};

exports.isEmpty = function(){return s.length<=0};