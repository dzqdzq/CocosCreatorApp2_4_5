"use strict";require("../utils");const e=require("./clip");
let i = {};
let n = [];
let u = null;

let t = function(e){
  if (-1===n.indexOf(e)) {
    n.push(e);
  }

  clearTimeout(u);

  u = setTimeout(()=>{for(;n.length;){
    let e = n.pop();
    let u = i[e];

    if (u) {
      Editor.Ipc.sendToPanel("scene","scene:animation-clip-changed",{uuid:u._uuid,clip:u.name,data:u.serialize(),dirty:true});
    }
  }},250);
};

module.exports = {register:function(e){return i[e._uuid]?null:i[e._uuid]=e},unregister:function(e){return i[e._uuid]?(delete i[e._uuid],e):null},clear:function(){Object.keys(i).forEach(e=>{delete i[e]})},sync:t,isExists:function(e){return!!i[e]},equal:function(e,n){let u=i[e];return!!u&&Editor.serialize(u)===Editor.serialize(n)},Clip:e,Undo:null};

Object.keys(e).forEach(n=>{
  let u=e[n];

  if (0===n.indexOf("query")) {
    e[n] = function(e,...n){
      t(e);
      return u(i[e],...n);
    };
  } else {
    e[n] = function(e,...n){return u(i[e],...n)};
  }
});