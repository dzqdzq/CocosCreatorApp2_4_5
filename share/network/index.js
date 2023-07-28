"use strict";
const e = require("os");
const t = require("https");

exports.canConnectPassport = function(e){
  let o = false;

  let r = t.request({method:"GET",host:"passport.cocos.com",port:443,path:"/oauth/token?xxx",headers:{}},t=>{if(200!==t.statusCode){
    Editor.log("failed to connect login server... skipping login");
    if (o) {
      return;
    }
    o = true;
    return e(false);
  }if (!o) {
    o = true;
    Editor.log("connected!");
    return e(true);
  }}).on("error",t=>{if (!o) {
    o = true;
    Editor.log("failed to connect login server... skipping login");
    return e(false);
  }});

  r.write("");
  r.end();

  setTimeout(function(){if (!o) {
    Editor.log("failed to connect login server due to request timeout");
    o = true;
    return e(false);
  }},3e3);
};

exports.queryIpList = function(){
  let t = e.networkInterfaces();
  let o = [];
  for(let e in t)t[e].forEach(e=>{
    if ("IPv4"===e.family&&false===e.internal) {
      o.push(e.address);
    }
  });

  if ("win32"===process.platform) {
    o = o.filter(e=>/^(?!169\.254)/.test(e));
  }

  return o;
};