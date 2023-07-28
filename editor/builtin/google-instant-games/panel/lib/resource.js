"use strict";
const e = require("fs");
const t = require("path");
const r = require("zlib");
let i = {};

let n = async function(t){return new Promise((r,i)=>{e.exists(t,n=>{if (!n) {
  return i(`File does not exist - ${t}`);
}e.stat(t,(e,t)=>{r(t.size)})})});};

let s = async function(e,t){return new Promise((r,i)=>{
  let n;
  let s;
  let o;

  if ("texture"===t) {
    r(o=`background-image:${s='url("'+(n=`thumbnail://${e}?32`)+'")'}`);
  } else {
    if ("sprite-frame"===t) {
      Editor.assetdb.queryMetaInfoByUuid(e,(e,i)=>{if (i)
        {let e=JSON.parse(i.json);o = `background-image:${a(e)}`;} else {
        o = `background-image:${u(t)}`;
      }r(o)});
    } else {
      o = `background-image:${u(t)}`;
      r(o);
    }
  }
});};

let a = function(e){
  let t;
  let r;
  let i = `thumbnail://${e.rawTextureUuid}?32`;
  let n = e.trimX;
  let s = e.trimY;
  let a = 0;

  if (e.rotated) {
    t = e.height;
    r = e.width;
    a = 270;
  } else {
    t = e.width;
    r = e.height;
  }

  let u=`&x=${n}&y=${s}&w=${t}&h=${r}`;

  if (0!==a) {
    u += `&rotate=${a}`;
  }

  return 'url("'+(i+=u)+'")';
};

let u = function(e){
  let t;
  let r = Editor.metas[e];
  return r&&r["asset-icon"]?'url("'+(t=r["asset-icon"])+'")':'url("'+(t="packages://assets/static/icon/"+e+".png")+'")'
};

module.exports = {queryFileSize:n,queryAssetInfo:async function(a){return i[a]?i[a]:new Promise((u,o)=>{Editor.Ipc.sendToPanel("scene","scene:query-asset-info",a,async(c,l)=>{
  if (c) {
    return o(c);
  }if (!l) {
    return u(null);
  }try{l.size = await n(l.path);}catch(c){l.size = 0;}
  l.name = t.basename(l.path);
  l.iconUrl = await s(l.uuid,l.type);
  l.selected = true;
  i[a] = l;
  try{l.zsize = await async function(t){return new Promise((i,n)=>{e.exists(t,s=>{if (!s) {
    return n(`File does not exist - ${t}`);
  }e.readFile(t,(e,s)=>{if (e) {
    return n(`File cannot be read - ${t}`);
  }r.gzip(s,(e,r)=>{if (e) {
    return n(`The file cannot be compressed - ${t}`);
  }i(r.length)})})})});}(l.path);}catch(c){l.zsize = 0;}u(l)
})});},queryMetaInfo:s};