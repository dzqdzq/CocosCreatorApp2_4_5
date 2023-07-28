"use strict";
const {EventEmitter:e} = require("events");
const {ipcMain:r,BrowserWindow:n} = require("electron");
const {WindowSender:s,EventSender:t} = require("./sender");
const {MessageEvent:a} = require("./event");
const l = require("../package.json");
const o = `${l.name}@${l.version}`;

module.exports = new (class extends e {broadcast(e,...r){let s={message:e,arguments:r};n.getAllWindows().forEach(e=>{e.send(`${o}:broadcast`,s)})}emit(e,...r){
  let n=this._events[e];

  if (!n) {
    n = [];
  }

  if (!Array.isArray(n)) {
    n = [n];
  }

  return new t(n,{message:e,arguments:r});
}sendToWin(e,r,...n){return new s(e,{message:r,arguments:n})}});

r.on(`${o}:send`,(r,n)=>{
  let s=new a("renderer");
  s.sender = r.sender;

  if (n.needCallback) {
    s.needCallback = true;
    s.reply = function(...e){r.sender.send(`${o}:send-reply`,n.cid,JSON.stringify(e||[]))};
  }

  e.prototype.emit.call(module.exports,n.message,s,...n.arguments);
});

r.on(`${o}:sendSync`,(e,r)=>{
  let n = new a("renderer");
  let s = module.exports._events[r.message];
  if (!s) {
    e.returnValue = Object.create(null);
    return;
  }if (!Array.isArray(s)) {
    e.returnValue = {value:s(n,...r.arguments)};
    return;
  }let t=[];for(let e=0;e<s.length;e++){let a=s[e];t.push(a(n,...r.arguments))}
  e.returnValue = {value:t};
});

r.on(`${o}:send-reply`,(e,r,n)=>{
  let t=s.query(r);if (!t) {
    console.warn("Sender does not exist");
    return;
  }

  if (t._callback) {
    t._callback(...JSON.parse(n));
  }

  s.remove(r);
});