"use strict";
const {dirname:e,join:t} = require("fire-path");
const {addChildProcess:r,removeChildProcess:i} = require("@editor/user");
const {Tray:o,Menu:n,app:a} = require("electron");
const {dashboardOpen:d,dashboardClose:s} = require("./lib/metrics");
const {startup:l,closeAll:c,isEmpty:h} = require("./lib/editor");
const {create:u,add:E,remove:g,delete:p,check:m,getInfo:f} = require("../share/project");
const b = require("../share/engine-utils");
require("./lib/ipc");
require("../share/protocol/protocol-core");
Editor.User = require("../share/user");
Editor.versions.dashboard = "0.4.0";
Editor.builtinCocosRoot = b.getEnginePath();
Editor.Metrics = require("../share/metrics");
Editor.CocosAnalytics = require("../share/cocos-analytics");
let w;
let q = {};
require("../share/default-profiles");const v=Editor.Profile.load("global://settings.json");

module.exports = function(e,r){
  a.on("activate",()=>{
    if (Editor.Window.main) {
      Editor.Ipc.sendToMainWin("dashboard:refresh-recent-project");
      Editor.Ipc.sendToMainWin("dashboard:refresh-last-create");
      Editor.Window.main.show();
    }
  });

  Editor.requireLogin = !e.nologin;
  Editor.testing = !!e.testing;

  if (Editor.testing) {
    Editor.log("Running in testing environment");
  }

  Editor.showInternalMount = Editor.dev&&!!e.internal;
  Editor.lastLogin = v.get("last-login");
  Editor.log("checking language setting...");
  let i=v.get("language");if ("en"===i||"zh"===i) {
    Editor.lang = i;
  } else {
    let e=a.getLocale();

    if (e&&e.includes("zh")) {
      Editor.lang = "zh";
    } else {
      Editor.lang = "en";
    }

    v.set("language",Editor.lang);
    v.save();
  }
  Editor.log(`Language: ${Editor.lang}`);
  Editor.log("Initializing Cocos Creator Dashboard");
  Editor.init({i18n:require(`../share/i18n/${Editor.lang}/localization`),"main-menu":require("./main-menu")});
  Editor.Package.removePath(t(Editor.App.path,Editor.dev?"":"..","builtin"));

  if (r) {
    r();
  }
};

Editor.App.extend({_profile:{},createProject:function(t,r){
  t = t||{};
  try{if ("string"!=typeof t.path) {
    throw new Error("opts.path must be string")
  }}catch(e){
    if (r) {
      r(e);
    }

    return;
  }
  v.set("last-create",t.path);
  v.save();
  this.updateLastCreatePath(e(t.path));
  u(t.path,t.template,r);
},updateLastCreatePath(e){
  v.set("last-create-path",e);
  v.save();
},addProject(e){E(e)},deleteProject(e){p(e)},removeProject(e){g(e)},getProjectInfo(e,t){f(e,t)},checkProject(e,t){m(e,t)},runEditor(e,t,o,n){
  if (q[e]) {
    return;
  }let a=l(e,t,o);
  q[e] = a;
  r(a);

  a.on("close",()=>{
    i(q[e]);
    delete q[e];
  });

  n();
},run(){new Promise((e,t)=>{require("../share/network").canConnectPassport(function(t){
  Editor.isOffline = !t;

  if (Editor.isOffline) {
    Editor.requireLogin = false;
  }

  e();
})}).then(()=>{
  let e={title:"Cocos Creator",width:1024,height:680,minWidth:1024,minHeight:680,show:false,resizable:true,frame:false};

  if ("darwin"===process.platform) {
    delete e.frame;
    e.titleBarStyle = "hiddenInset";
  }

  Editor.Window.initWindowStates("global://layout.dashboard.json","default://layout.dashboard.json");
  Editor.run("app://dashboard/index.html",e);

  Editor.Window.main.nativeWin.on("close",e=>{
    if (!h()) {
      e.preventDefault();
      Editor.Window.main.nativeWin.closeDevTools();
      Editor.Window.main.nativeWin.hide();
    }
  });
}).then(()=>{
  (w=new o(Editor.url("app://dashboard/static/tray.png"))).setToolTip("Cocos Creator");

  w.on("click",()=>{
    if (Editor.Window.main) {
      Editor.Ipc.sendToMainWin("dashboard:refresh-recent-project");
      Editor.Ipc.sendToMainWin("dashboard:refresh-last-create");
      Editor.Window.main.show();
    }
  });

  let e=n.buildFromTemplate([{label:Editor.T("SHARED.exit"),click(){process.exit()}}]);
  w.setContextMenu(e);
  d();
})},quit(e){
  c();
  s(e);
}});