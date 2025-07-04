"use strict";
const r = require("async");
const e = require("path");
const t = require("fire-fs");
const i = require("plist");
const n = require("fire-url");
const o = require("./ccb-importer");
const c = "resources-auto";
const s = "db://assets";
const a = "temp";
var u = "";
var l = "";
var d = "";
var f = "";
var y = "";
var p = [];
var m = [];
function S(r){
  if (t.existsSync(r)) {
    t.readdirSync(r).forEach(function(i){
      var n=e.join(r,i);

      if (t.lstatSync(n).isDirectory()) {
        S(n);
      } else {
        t.unlinkSync(n);
      }
    });

    t.rmdirSync(r);
  }
}function h(r,i,n){if (!t.existsSync(r)) {
  Editor.warn("%s is not found!",r);
  return;
}t.readdirSync(r).forEach(function(o){
  var s = e.join(r,o);
  var a = e.join(i,o);

  if (t.lstatSync(s).isDirectory()) {
    if (o===c) {
      a = i;
    }

    if (!t.existsSync(a)) {
      t.mkdirsSync(a);
    }

    h(s,a,n);
  } else {
    if (".ccb"===e.extname(s)) {
      a = e.join(l,e.relative(n,s));
      t.copySync(s,a);
      m.push(a);
    } else {
      if (!t.existsSync(a)) {
        t.copySync(s,a);
      }
    }
  }
})}

module.exports = {name:"Cocos Builder",exts:"ccbproj",importer:function(c,j){
  Editor.log("Import Cocos Builder project %s",c);try{(function(r){
    d = e.dirname(r);
    y = e.basename(r,e.extname(r));
    f = n.join(s,y);
    for(var o=t.readFileSync(r,"utf8"),c=i.parse(o),a=c.resourcePaths.length,u=0;u<a;u++){
      var l = c.resourcePaths[u];
      var m = e.normalize(e.join(d,l.path));
      p.push(m)
    }
  })(c)}catch(r){return j(new Error("Illegal format of project file."))}if (0===p.length) {
    return j(new Error("There is not any resources."));
  }
  var E;
  var x;
  for (function(){
         var r=n.basename(f);
         u = e.join(Editor.remote.Project.path,a,r);

         if (t.existsSync(u)) {
           S(u);
         }

         t.mkdirsSync(u);
         l = u+"_ccbs";

         if (t.existsSync(l)) {
           S(l);
         }

         t.mkdirsSync(l);
       }(),E=0,x=p.length;
       E<x;
       E++)
  {
    h(p[E],u,p[E]);
  }r.waterfall([function(r){Editor.assetdb.import([u],s,false,function(e,t){r()})},function(r){o.importCCBFiles(m,u,l,f,r)}],function(){
    Editor.log("Import Cocos Builder project finished.");
    Editor.log("Resources are imported to folder : %s",f);

    (function() {try{
      S(u);
      S(l);
    }catch(r){Editor.warn("Delete temp path %s failed, please delete it manually!",u)}})();

    j();
  })
}};