"use strict";
const e = require("../../@base/electron-base-ipc");
const t = process.send?require("@editor/user/dist/platform/child"):require("@editor/user");
const {EventEmitter:o} = require("events");
const {shell:r,app:i} = require("electron");
const n = require("url");
const a = require("md5");
const s = require("@editor/user/dist/utils/network");
let l=Editor.Profile.load("global://user_token.json");const u="https://creator-api.cocos.com/";
let c = "";

let d = async function(e){
  let o = await t.getData();
  let r = module.exports.enable();
  let i = o.nickname||c;
  let n = `${Editor.T("SHARED.help")}/${Editor.T("MAIN_MENU.account.none")}`;
  let a = `${Editor.T("SHARED.help")}/${Editor.T("MAIN_MENU.account.logged_user",{username:i})}`;
  let s = `${Editor.T("SHARED.help")}/${Editor.T("MAIN_MENU.account.logout")}`;
  c = o.nickname;

  if (Editor.MainMenu.exists(n)) {
    Editor.MainMenu.remove(n);
  }

  if (Editor.MainMenu.exists(a)) {
    Editor.MainMenu.remove(a);
  }

  if (Editor.MainMenu.exists(s)) {
    Editor.MainMenu.remove(s);
  }

  if (e) {
    Editor.MainMenu.add(Editor.T("SHARED.help"),{label:Editor.T("MAIN_MENU.account.logged_user",{username:i}),enabled:r,visible:!!i&&r});
    Editor.MainMenu.add(Editor.T("SHARED.help"),{label:Editor.T("MAIN_MENU.account.logout"),click(){module.exports.logout()},enabled:r});
  } else {
    Editor.MainMenu.add(Editor.T("SHARED.help"),{label:Editor.T("MAIN_MENU.account.none"),enabled:false});
  }
};

if (!process.send) {
  t.on("info-update",()=>{
    l.clear();
    l.set(null,t.getData());
    l.save();
  });
}

let g=module.exports=new (class extends o {constructor(){
  super();
  this._enable = true;
  this._preUserId = null;

  if (t.setData) {
    t.setData(l.get(null));
  }

  this.isLoggedIn();
}enable(t){
  if (void 0!==t) {
    this._enable = !!t;
    e.broadcast("creator-lib-user:flag","_enable",this._enable);
  }

  return this._enable;
}async isLoggedIn(e){
  const o=await t.isLoggedIn();
  d(o);
  return o;
}async login(e,o){return await t.login(e,o)}async logout(){return await t.logout()}async getUserToken(){return await t.getUserToken()}async getSessionCode(e,o){
  if (o) {
    Editor.warn("'getSessionCode' returns a standard 'promise' , please use 'await' to wait for the data");
  }

  return await t.getSessionCode(e);
}async getUserData(){return await t.getData()}async redirect(e){
  e = `https://creator-api.cocos.com/api/account/client_signin?session_id=${(await t.getData()).session_id}&redirect_url=${e}`;
  r.openExternal(e);
}async getUserId(){return(await t.getData()).cocos_uid}getCocosServerURL(e){return n.resolve(u,e)}async getSessionToken(e,t){
  const o=this.getCocosServerURL("api/session/token");let r={session_code:(await this.getSessionCode(e)).session_code,ip:"127.0.0.1",plugin_id:e,client_type:1};
  r = this.signParam(r,e,t);
  return await s.sendPostRequest(o,r);
}signParam(e,t,o){
  e.plugin_id = t;
  let r={};Object.keys(e).sort().forEach(t=>{r[t] = e[t];});let i="";for(let e in r)i += `${e}=${encodeURIComponent(r[e])}&`;
  i += o;
  e.sign = a(i);
  return e;
}});

t.on("login",()=>{
  g.emit("login");
  e.broadcast("creator-lib-user:emit","login");
  d(true);
});

t.on("logout",()=>{
  g.emit("logout");
  e.broadcast("creator-lib-user:emit","logout");
  d(false);
});

e.on("creator-libs-user:call",async(e,t,...o)=>{
  let r;
  let i = g[t];
  try{r = await i.call(g,...o);}catch(t){return e.reply(t.message,null)}e.reply(null,r)
});

e.on("creator-lib-user:query",(e,t)=>module.exports[t]);

t.on("login",()=>{
  module.exports.emit("login");
  e.broadcast("creator-lib-user:emit","login");
});

t.on("waiting",()=>{
  module.exports.emit("waiting");
  e.broadcast("creator-lib-user:emit","waiting");
});

t.on("logout",()=>{
  module.exports.emit("logout");
  e.broadcast("creator-lib-user:emit","logout");
});

t.on("exception",t=>{
  module.exports.emit("exception",t);
  e.broadcast("creator-lib-user:emit","exception",t);
});