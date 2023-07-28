"use strict";
const e = require("electron").ipcMain;
const {EventEmitter:t} = require("events");
const o = require("../../request.js").sendRequest;
const c = require("md5");
const r = require("getmac");
const n = require("../lib/config").trackID;
const i = require("../../cocos-analytics");
let l = "";
let a = "";
let s=module.exports=new (class extends t {constructor(){
  super();
  this.trackID = n;
}trackEvent(e,t){
  if (!l) {
    console.log("no valid user ID");
    return;
  }if (!a) {
    console.log("no valid client ID");
    return;
  }let c={v:1,tid:n,cid:a,uid:l,t:"event",ec:e.category,ea:e.action};

  if (e.label) {
    c.el = e.label;
  }

  o({method:"POST",host:"www.google-analytics.com",path:"/collect",protocol:"https",data:c},function(e,o){
    if (e) {
      console.log(e);
    }

    if (t) {
      t(e,o);
    }
  });

  i.trackEvent(e);
}trackException(e,t){
  if (!a) {
    console.log("no valid client ID");
    return;
  }

  o({method:"POST",host:"www.google-analytics.com",path:"/collect",protocol:"https",data:{v:1,tid:n,cid:a,uid:l,t:"exception",exd:e,exf:0}},function(e,o){
    if (e) {
      console.log(e);
    }

    if (t) {
      t(e,o);
    }
  });

  i.trackException(e);
}prepareUserIdentity(){
  let e=Editor.Profile.load("global://user_token.json");
  e.get("nickname");
  e.get("email");
  l = e.get("cocos_uid");
}sendAppInfo(e){
  if (!a) {
    console.log("no valid client ID");
    return;
  }
  let t = require("semver");
  let c = Editor.versions.CocosCreator;
  let r = `${t.major(c)}.${t.minor(c)}.${t.patch(c)}`;
  o({method:"POST",host:"www.google-analytics.com",path:"/collect",protocol:"https",data:{v:1,tid:n,cid:a,uid:l,t:"screenview",an:"CocosCreator",aid:"com.cocos.creator",av:r,cd:"Home"}},function(t,o){
    if (t) {
      console.log(t);
    }

    if (e) {
      e(t,o);
    }
  })
}setClientId(e){r.getMac(function(t,o){
  let r="";if (t) {
    console.log(t);
    let e = require("os").networkInterfaces();
    let o = false;
    for(var n in e){let t=e[n];for(let e=0;e<t.length;++e){let n=t[e];if(!n.internal&&n.mac){
      r = c(n.mac);
      o = true;
      break
    }}if (o) {
      break
    }}

    if (!o) {
      r = c("00:00:00:00:00:00");
    }
  } else {
    r = c(o);
  }
  a = r;
  e();
})}});
e.on("metrics:track-event",(e,t)=>{s.trackEvent(t,null)});
e.on("metrics:track-exception",(e,t)=>{s.trackException(t,null)});