"use strict";
const e = require("fs");
const t = require("path");
let n=function(n){
  let r = t.join(n,"packageInfo.json");
  let i = {first:{scope:1,items:[]},addList:[],removeList:[]};
  if(e.existsSync(r)){let t=e.readFileSync(r,"utf-8");try{i = JSON.parse(t);}catch(e){console.warn(e)}}return i
};

module.exports = {readJson:n,saveJson:function(n,r){
  let i = n;

  let s = function(n){
    if (e.existsSync(n)) {
      return true;
    }let r=t.dirname(i);

    if (!e.existsSync(r)) {
      s(r);
    }

    t.mkdirSync(n);
    return true;
  };

  s(i);let o=JSON.stringify(r);
  e.writeFileSync(t.join(i,"packageInfo.json"),o);
  return true;
},queryScope:function(e){return n(e).first.scope}};