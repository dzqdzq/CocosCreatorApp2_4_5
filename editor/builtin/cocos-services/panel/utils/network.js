"use strict";
let s = require("fs");
let t = require("request");
const e={ciphers:"ALL",secureProtocol:"TLSv1_method"};

exports.post = function(s,r,o){t.post({url:s,json:true,form:r,agentOptions:e},(s,t,e)=>{
  if (s||200!=t.statusCode) {
    o({status:t.statusCode,msg:s},null);
  } else {
    if (0===e.status||"success"===e.error_code) {
      resolve(e);
      o(null,e);
    } else {
      o({status:e.status?e.status:e.err_code,msg:e.status?e.msg:e.error_msg},null);
    }
  }
})};

exports.postAsync = function(s,r){return new Promise((o,u)=>{t.post({url:s,json:true,form:r,agentOptions:e},(s,t,e)=>{try{
  if (s||200!=t.statusCode) {
    u({status:t.statusCode,msg:s});
  } else {
    if (0===e.status||"success"===e.error_code) {
      o(e);
    } else {
      u({status:e.status?e.status:e.err_code,msg:e.status?e.msg:e.error_msg});
    }
  }
}catch(s){}})});};

exports.get = function(s,r,o){t.get({url:s,json:true,form:r,agentOptions:e},(s,t,e)=>{
  if (s||200!=t.statusCode) {
    o({err_code:t.statusCode,err_msg:s},null);
  } else {
    if (0===e.status||"success"===e.error_code) {
      resolve(e);
      o(null,e);
    } else {
      o({err_code:e.status?e.status:e.err_code,err_msg:e.status?e.msg:e.error_msg},null);
    }
  }
})};

exports.download = function(r,o,u){
  var n = 0;
  var a = 0;
  var l = 0;
  var c = t({method:"GET",uri:r,agentOptions:e});
  var d = s.createWriteStream(o);
  c.pipe(d);

  c.on("response",s=>{if (200!==s.statusCode) {
    u(new Error(s.statusMessage),null);
    return;
  }n = parseInt(s.headers["content-length"],10);});

  c.on("data",s=>{
    var t=(a+=s.length)/n*100|0;

    if (l!==t) {
      l = t;
      u(null,{status:"downloading",progress:t});
    }
  });

  c.on("complete",()=>{u(null,{status:"complete",progress:l})});
  c.on("error",s=>{u(s,null)});
};