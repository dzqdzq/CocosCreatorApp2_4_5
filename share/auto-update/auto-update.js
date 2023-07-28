"use strict";
const e = require("electron");
const o = require("electron-dl");
const t = Editor.versions.CocosCreator;
const i = require("electron").ipcMain;
const r = require("child_process").spawn;
const n = require("http");
const a = require("fire-path");
const d = require("fire-fs");
const l = Editor.testing?"test":"";
const s = `http://fbupdater.leanapp.cn/updatemac/latest?testing=${l}&version=${t}`;
const u = `http://fbupdater.leanapp.cn/hotupdates/latest?testing=${l}&version=${t}`;
const c = a.join(Editor.App.path,"..");
const p = a.join(require("os").tmpdir(),"fireball-hotupdate");
let f = "";
let h = "";
let v = "";
let g = [];
let m = "";
let E = null;
let b = false;
function w(e){
  let t = Editor.Profile.load("global://updates.json");
  let i = require("lodash");
  let r = {};
  let n = "";
  for (let o=0; o<e.length; ++o) {
    r = e[o];
    if(!i.includes(t.get("installed-hotupdates"),r.objectId)&&(n=r.package_info[process.platform])){
      f = r.package_info["name_"+Editor.lang];
      h = r.notes;
      break
    }
  }if(n){let e=require("md5-file");o.download(Editor.Window.main.nativeWin,n).then(o=>{
    v = o.getSavePath();

    e(v,(e,o)=>e?(console.error(e),void 0):o!==r.md5?(console.log(`Downloaded hot-updates ${f} for v${r.version} failed md5 hash check. Abort updating.`),void 0):(m=r.objectId,function(){
      if (!d.existsSync(v)) {
        console.error("Auto update failed! Downloaded file is damaged or removed!");
        return;
      }if (".zip"!==a.extname(v)) {
        console.error("Hot update failed! Downloaded file is not zipped!");
        return;
      }let e=require("decompress");
      d.emptyDirSync(p);

      e(v,p).then(e=>{
        g = e.map(function(e){return a.join(c,e.path)});
        q();
      }).catch(console.error);
    }(),void 0));
  }).catch(console.error)}
}function q(){
  if (h) {
    let e = ["en","zh"];

    let o = h.split("!#").map(function(o){
      var t = o.slice(0,2);
      var i = e.indexOf(t);
      return -1===i?{notes:o,invalid:true}:{notes:o.slice(2),lang:e[i]};
    }).filter(function(e){return!(!e||!e.notes||e.invalid)});

    for(let e=0;e<o.length;++e){
      let t=o[e];

      if (t.lang===Editor.lang) {
        h = t.notes;
      }
    }
  } else {
    h = "";
  }
  E = new Editor.Window("Update",{title:Editor.T("DOWNLOADER.title"),width:600,height:700,alwaysOnTop:true,show:false,resizable:true});
  let e = Editor.Window.main;
  let o = e.nativeWin.getPosition();
  let t = e.nativeWin.getSize();
  let i = o[0]+t[0]/2-300;
  let r = o[1];
  E.load("app://dashboard/page/update-index.html");
  E.nativeWin.setPosition(Math.floor(i),Math.floor(r));
  E.nativeWin.setMenuBarVisibility(false);
  E.nativeWin.setTitle(Editor.T("DOWNLOADER.title"));
  E.show();
}

i.on("dashboard:query-update-info",e=>{
  let o=null;

  if (!(f && h)) {
    o = new Error("invalid update info");
  }

  e.reply(o,{releaseName:f,releaseNotes:h,downloadedPath:v,hotUpdateFiles:g});
});

i.on("dashboard:install-update",()=>{
  if (!d.existsSync(v)) {
    console.error("Auto update failed! Downloaded file is damaged or removed!");
    return;
  }
  e.shell.openPath(v);

  if (E) {
    E.close();
  }

  e.app.quit();
});

i.on("dashboard:cancel-update",()=>{
  if (E) {
    E.close();
  }
});

i.on("dashboard:install-hotupdate",()=>{d.copy(p,c,{clobber:true},function(o){
  if (o) {
    Editor.error(o);
    Editor.log("Hot update failed, please check if the application folder is writable and current user has permission.");
    return;
  }
  let t = Editor.Profile.load("global://updates.json");
  let i = t.get("installed-hotupdates");

  if (-1===i.indexOf(m)) {
    i.push(m);
    t.save();
  }

  if (E) {
    E.close();
  }

  e.app.quit();
})});

if (Editor.isWin32) {
  let o = e.app.getPath("exe");
  let t = a.join(a.dirname(o),"updater.exe");

  if (d.existsSync(t)) {
    r(t,["/silent"],{stdio:"inherit"});
  }
} else {
  n.get(s,function(e){
    let t="";
    e.setEncoding("utf8");
    if (200!==e.statusCode) {
      console.log("no valid update feed url.");
      return;
    }e.on("data",e=>{t += e;}).on("end",()=>{var e;try{if (e=JSON.parse(t)) {
      b = true;

      (function(e) {
        let t=require("md5-file");
        f = e.name;
        h = e.notes;

        o.download(Editor.Window.main.nativeWin,e.url).then(o=>{
          v = o.getSavePath();
          t(v,(o,t)=>o?(console.error(o),void 0):t!==e.md5?(console.log(`Downloaded v${e.version} update failed md5 hash check. Abort updating.`),void 0):(q(),void 0));
        }).catch(console.error);
      })(e);

      return;
    }}catch(e){
      console.error(e);
      return;
    }})
  }).on("error",e=>{console.log(`Got error: ${e.message}`)});
}

if (!b) {
  n.get(u,function(e){
    let o="";
    e.setEncoding("utf8");
    if (200!==e.statusCode) {
      console.log("no valid update feed url.");
      return;
    }e.on("data",e=>{o += e;}).on("end",()=>{var e;try{if (e=JSON.parse(o)) {
      w(e);
      return;
    }}catch(e){
      console.error(e);
      return;
    }})
  }).on("error",e=>{console.log(`Got error: ${e.message}`)});
}