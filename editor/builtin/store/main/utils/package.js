"use strict";
const r = require("fire-fs");
const e = require("path");
const n = require("./fs");
const t = Editor.remote?Editor.remote.App.home:Editor.App.home;
var o = function(r){return Editor.T(`store.package.${r}`)};
var i = e.join(t,"download",".temp");
r.removeSync(i);

exports.install = function(t,s,a){if (!r.existsSync(t)) {
  return a(new Error(o("exists_error")),false);
}if (!/\.zip/.test(t)) {
  return a(new Error(o("type_error")),false);
}Promise.resolve().then(function(){return new Promise((s,a)=>{
  var u=e.basename(t,".zip");
  u = e.join(i,u);

  n.unzip(t,u,e=>{if (e) {
    r.remove(u,r=>{
      if (r) {
        Editor.warn(r);
      }
    });

    Editor.warn(e);
    return a(new Error(o("unzip_error")));
  }s({tmp:u})});
});}).then(function(n){return new Promise((t,i)=>{(function(n,t){
  var i = r.readdirSync(n);
  var s = e.join(n,"package.json");
  if(r.existsSync(s)){let e=r.readFileSync(s,"utf-8");t(null,n,JSON.parse(e))}else{
    let s;
    i.some(t=>{var o=e.join(n,t,"package.json");return !!r.existsSync(o)&&(s=o,true);});
    if (s)
      {let n=r.readFileSync(s,"utf-8");t(null,e.dirname(s),JSON.parse(n))} else {
      t(new Error(o("pkg_invalid")))
    }
  }
})(n.tmp,(e,o,s)=>{
  if (e) {
    r.remove(n.tmp,r=>{
      if (r) {
        Editor.warn(r);
      }
    });

    Editor.warn(e);
    return i(e);
  }
  n.dir = o;
  n.json = s;
  t(n);
})});}).then(function(e){return new Promise((n,t)=>{exports.check(e.json.name,(i,s)=>{if (!s) {
  e.exists = false;
  return n(e);
}const a=Editor.Dialog.messageBox({title:o("install"),message:e.json.name+o("exists"),buttons:[Editor.T("store.button.cover"),Editor.T("store.button.cancel")],defaultId:0,cancelId:1,noLink:true});if (1===("number"==typeof a.response?a.response:a)) {
  e.exists = true;
  return n(e);
}exports.unload(e.json.name,i=>i?(r.remove(e.tmp,r=>{
  if (r) {
    Editor.warn(r);
  }
}),Editor.warn(i),t(new Error(o("uninstall_error")))):(e.exists=false,n(e)))})});}).then(function(t){return new Promise((i,a)=>{if (t.exists) {
  return i(t);
}var u="";u = "global"==s?Editor.App.home:Editor.Project.path;var c=e.join(u,"packages",t.json.name);setTimeout(()=>{n.copy(t.dir,c,e=>{if (e) {
  r.remove(t.tmp,r=>{
    if (r) {
      Editor.warn(r);
    }
  });

  n.remove(c,r=>{
    if (r) {
      Editor.warn(r);
    }
  });

  Editor.warn(e);
  return a(new Error(o("install_error")));
}i(t)})},1e3)});}).then(function(e){return new Promise((n,t)=>{r.remove(e.tmp,r=>{
  if (r) {
    Editor.warn(r);
  }

  n(e);
})});}).then(r=>{exports.load(r.dir,()=>{a(null,!r.exists)})}).catch(r=>{a(r,false)})};

exports.check = function(r,e){e(null,!!Editor.Package.find(r))};

exports.unload = function(r,e){const t=Editor.Package.find(r);Editor.Package.unload(t,function(r){if (r) {
  return e(r);
}setTimeout(()=>{n.remove(t,r=>{e(r)})},200)})};

exports.load = function(r,e){Editor.Package.load(r,function(){e(null)})};