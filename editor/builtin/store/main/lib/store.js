"use strict";
const t = require("fs-extra");
const e = require("path");
const i = require("url");
const o = require("querystring");
const r = require("../utils/network");
const {downloadZip:s} = require("../utils/download");
const n = require("../utils/package");
const a = require("../utils/cloud-function");
const d = require("../utils/fs");
const u = Editor.remote?Editor.remote.App.home:Editor.App.home;
const l = e.join(u,".store.json");
const c = e.join(u,"download");
t.ensureDirSync(c);const p=function(){if (!t.existsSync(l)) {
  return[];
}try{return t.readJSONSync(l)}catch(t){return[]}}();
exports.getList = function(){return p};
let f=null;function m(){
  clearTimeout(f);

  f = setTimeout(()=>{
    t.writeJSONSync(l,p);
    Editor.Ipc.sendToAll("store:update");
  },200);
}

p.forEach(t=>{
  t.id;

  if ("download"==t.status) {
    t.status = "error";
    m();
  }

  if (!("unzip"!=t.status && "install"!=t.status)) {
    t.status = "finish";
    m();
  }

  p.sort((t,e)=>e.timestamp-t.timestamp);
});

exports.download = async function(t){
  const n = i.parse(t);
  const a = o.parse(n.query);
  const d = await r.get(t,a);
  if (!d||"SUCCESS"!==d.status||200===d.status) {
    throw new Error(Editor.T("store.tips.data_error"));
  }if (p.some(t=>t.production_id===d.production_id&&t.version_id===d.version_id)) {
    throw (Editor.warn(Editor.T("store.tips.package_exists")), new Error(Editor.T("store.tips.package_exists")));
  }const u={name:d.name,name_en:d.name_en,file:e.join(c,d.production_id+"-"+d.version_id+".zip"),type:d.type_id,production_id:d.production_id,version_id:d.version_id,progress:0,status:"download",timestamp:Date.now()};
  p.splice(0,0,u);
  m();

  await s(d.download_url,u.file,function(t){
    u.progress = t;
    m();
  });

  u.status = "finish";
  m();

  if (!(33!=d.type_id && 35!=d.type_id)) {
    await new Promise(t=>{setTimeout(t,500)});
    await exports.install(u.production_id,d.version_id);
  }

  return u.file;
};

exports.downloadZip = async function(t,i,o){const r=e.join(c,i);return new Promise((e,i)=>{s(t,r,o).then(()=>{e(r)}).catch(t=>{i(t)})})};

exports.remove = function(e,i){
  const o=exports.find(e,i);if (!o) {
    return;
  }const r=p.indexOf(o);

  if (-1!==r) {
    if (t.existsSync(o.file)) {
      t.removeSync(o.file);
    }

    p.splice(r,1);
    m();
  }
};

exports.find = function(t,e){return p.find(i=>i.production_id===t&&i.version_id===e)||null};

exports.install = async function(e,i){
  const o=exports.find(e,i);if (!o) {
    throw new Error(Editor.T("store.tips.package_no_exists"));
  }if (!t.existsSync(o.file)) {
    throw new Error(Editor.T("store.tips.package_incorrect"));
  }
  o.status = "install";
  m();
  let r=o.name;

  if ("zh"!=Editor.lang) {
    r = o.name_en;
  }

  if(33==o.type){
    const t = await Editor.Dialog.messageBox({title:Editor.T("store.dialog.install"),message:Editor.T("store.dialog.install_message"),buttons:[Editor.T("store.button.global"),Editor.T("store.button.project"),Editor.T("store.button.cancel")],defaultId:0,cancelId:2,noLink:true});
    const e = "number"==typeof t.response?t.response:t;
    return 2==e?(o.status="finish",m(),void 0):new Promise((t,i)=>{n.install(o.file,0==e?"global":"project",(e,r)=>{
      o.status = "finish";
      m();
      if (e) {
        return i(e);
      }t()
    })});
  }if(35==o.type){
    try{await a.install(o.production_id,o.file)}catch(t){throw (o.status="finish", m(), t)}
    o.status = "finish";
    m();
    return;
  }
  Editor.Dialog.messageBox({title:Editor.T("store.dialog.install"),message:Editor.T("store.dialog.unknown_type"),buttons:[Editor.T("store.button.confirm")],defaultId:0,cancelId:0});
  o.status = "finish";
  m();
};

exports.unzip = async function(i,o){
  const r=exports.find(i,o);if (!r) {
    throw new Error(Editor.T("store.tips.package_no_exists"));
  }if (!t.existsSync(r.file)) {
    throw new Error(Editor.T("store.tips.package_incorrect"));
  }
  r.status = "unzip";
  m();
  const s = Editor.Dialog.openFile({defaultPath:process.env.HOME||c,properties:["openDirectory"]});
  const n = s&&s[0]?s[0]:"";
  if (!n) {
    r.status = "finish";
    m();
    return;
  }let a="";
  a = "zh"==Editor.lang?r.name||r.name_en:r.name_en||r.name;
  let u = e.join(n,a);
  let l = u;
  let p = 0;
  for (; t.existsSync(u); ) {
    u = `${l}_${++p}`;
  }return new Promise((t,e)=>{d.unzip(r.file,u,i=>{
    r.status = "finish";
    m();
    if (i) {
      return e(i);
    }t()
  })});
};