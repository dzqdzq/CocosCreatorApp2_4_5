"use strict";const e=require("https");let t=require("request");
const {stringify:r} = require("querystring");
const {parse:o} = require("url");

exports.get = function(t,s){return new Promise((n,i)=>{const c=o(t);s = r(s||{});const u={method:"GET",host:c.hostname,port:c.port||443,path:c.pathname+"?"+s,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cocos Creator 3D/0.8.5 Chrome/73.0.3683.119 Electron/5.0.0 Safari/537.36"},ciphers:"ALL",secureProtocol:"TLSv1_method"};e.request(u,e=>{
  const t=e.statusCode;let r;

  if (200!==t) {
    r = new Error(`请求失败。\n状态码: ${t}`);
  }

  if (r) {
    Editor.error(r);
    i(r);
    e.resume();
    return;
  }e.setEncoding("utf8");let o="";
  e.on("data",e=>o+=e);
  e.on("end",()=>{try{let e=JSON.parse(o);process.nextTick(()=>{n(e)})}catch(e){i(e)}});
}).on("error",e=>{i(e)}).end()});};

exports.post = function(e,r){return new Promise((o,s)=>{t.post({url:e,json:true,form:r,agentOptions:{ciphers:"ALL",secureProtocol:"TLSv1_method"}},(e,t,r)=>{try{
  if (e||200!=t.statusCode) {
    s(e||{status:t.statusCode,msg:e});
  } else {
    o(r);
  }
}catch(e){}})});};