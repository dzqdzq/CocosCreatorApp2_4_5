"use strict";
const {ipcRenderer:e} = require("electron");
const t = require("../package.json");
const s = `${t.name}@${t.version}`;
let r = 0;
let i = Object.create(null);
class c{static query(e){return i[e]}static remove(e){delete i[e]}constructor(e){
  this.id = r++;
  e.cid = this.id;
  this.options = e;
}callback(e){return "function"!=typeof e?this:(this.options.needCallback=true,i[this.id]=this,this._callback=e,this);}promise(){return new Promise((e,t)=>{
  this.options.needCallback = true;
  i[this.id] = this;
  this._callback = function(s,r){return s?t(s):e(r)};
});}timeout(e){
  clearTimeout(this._timer);
  return "number"!=typeof e||e<0?this:(this._timer=setTimeout(()=>{
    if (this._callback) {
      this._callback(new Error("Message timeout"));
    }

    delete i[this.id];
  },e),this);
}}

exports.EventSender = class extends c{constructor(e,t){
  super(t);

  process.nextTick(()=>{
    let s = this._callback;

    let r = {senderType:process.type,reply(...e){
      if (s) {
        s(...e);
      }

      s = null;
    }};

    e.forEach(e=>{e(r,...t.arguments)})
  });
}};

exports.MainSender = class extends c{constructor(t){
  super(t);
  process.nextTick(()=>{e.send(`${s}:send`,t)});
}};

exports.WindowSender = class extends c{constructor(e,t){
  super(t);
  process.nextTick(()=>{e.send(`${s}:send`,t)});
}};