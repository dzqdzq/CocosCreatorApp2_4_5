"use strict";
const {EventEmitter:e} = require("events");
const {ipcRenderer:r} = require("electron");
const {MainSender:n,EventSender:s} = require("./sender");
const {MessageEvent:t} = require("./event");
const a = require("../package.json");
const d = `${a.name}@${a.version}`;

module.exports = new (class extends e {emit(e,...r){
  let n=this._events[e];

  if (!n) {
    n = [];
  }

  if (!Array.isArray(n)) {
    n = [n];
  }

  return new s(n,{message:e,arguments:r});
}send(e,...r){return new n({message:e,arguments:r})}sendSync(e,...n){let s={message:e,arguments:n};return r.sendSync(`${d}:sendSync`,s).value}});

r.on(`${d}:broadcast`,(r,n)=>{
  let s=new t("browser");
  s.sender = r.sender;
  e.prototype.emit.call(module.exports,n.message,s,...n.arguments);
});

r.on(`${d}:send-reply`,(e,r,s)=>{
  let t=n.query(r);if (!t) {
    console.warn("Sender does not exist");
    return;
  }

  if (t._callback) {
    t._callback(...JSON.parse(s));
  }

  n.remove(r);
});

r.on(`${d}:send`,(n,s)=>{
  let a=new t("renderer");
  a.sender = n.sender;

  if (s.needCallback) {
    a.reply = function(...e){r.send(`${d}:send-reply`,s.cid,JSON.stringify(e||[]))};
  }

  e.prototype.emit.call(module.exports,s.message,a,...s.arguments);
});