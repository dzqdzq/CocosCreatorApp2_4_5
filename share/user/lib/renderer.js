"use strict";
const e = require("../../@base/electron-base-ipc");
const {EventEmitter:r} = require("events");

module.exports = new (class extends r {constructor(){
  super();
  this._enable = e.sendSync("creator-lib-user:query","_enable");
}enable(r){
  if (void 0!==r) {
    e.send("creator-libs-user:call","enable",!!r);
    this._enable = !!r;
  }

  return this._enable;
}async getUserData(){return e.send("creator-libs-user:call","getUserData").promise()}async isLoggedIn(r){
  if (r) {
    Editor.warn("'isLoggedIn' returns a standard 'promise' , please use 'await' to wait for the data");
  }

  return e.send("creator-libs-user:call","isLoggedIn").promise();
}async login(r,s){return e.send("creator-libs-user:call","login",r,s).promise()}async logout(){return e.send("creator-libs-user:call","logout").promise()}async getUserToken(){return e.send("creator-libs-user:call","getUserToken").promise()}async getSessionCode(r,s){
  if (s) {
    Editor.warn("'getSessionCode' returns a standard 'promise' , please use 'await' to wait for the data");
  }

  return e.send("creator-libs-user:call","getSessionCode",r).promise();
}async getSessionToken(r,s){return e.send("creator-libs-user:call","getSessionToken",r,s).promise()}async signParam(r,s,t){return e.send("creator-libs-user:call","signParam",r,s,t).promise()}});

e.on("creator-lib-user:emit",(e,r,...s)=>{module.exports.emit(r,...s)});
e.on("creator-lib-user:flag",(e,r,s)=>{module.exports[r] = s;});
let s=require("../element/login-frame");window.customElements.define("login-frame",s);