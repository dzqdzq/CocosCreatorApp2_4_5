"use strict";
const e = require("async");
const r = require("path");
const t = require("fire-fs");
const i = require("xmldom").DOMParser;
const n = require("fire-url");
const o = require("plist");
const a = require("./csd-importer");
const s = require("./xml-utils");
const c = "db://assets";
const l = "cocosstudio";
const f = "temp";
const d = /page [^\n]*(\n|$)/gi;
const u = /\w+=[^ \r\n]+/gi;
const m = /^[\-]?\d+$/;
var g = "";
var y = "";
var v = "";
var S = "";
var p = "";
var E = [];
function h(e){
  if (t.existsSync(e)) {
    t.readdirSync(e).forEach(function(i){
      var n=r.join(e,i);

      if (t.lstatSync(n).isDirectory()) {
        h(n);
      } else {
        t.unlinkSync(n);
      }
    });

    t.rmdirSync(e);
  }
}function b(e){
  if (!t.existsSync(e)) {
    Editor.warn("%s is not found!",e);
    return;
  }
  var i = r.relative(v,e);
  var n = r.join(g,i);

  if (!t.existsSync(n)) {
    t.copySync(e,n);
  }
}function j(e){
  var i = r.relative(v,e);
  var n = r.join(g,i);

  if (!t.existsSync(n)) {
    t.mkdirsSync(n);
  }
}function x(e){
  b(e);
  if(t.existsSync(e)){var i=o.parse(t.readFileSync(e,"utf8"));if(i){
    var n=r.join(r.dirname(e),i.textureFileName);

    if (t.existsSync(n)) {
      b(n);
    }
  }}
}function F(e){
  b(e);
  if(t.existsSync(e)){
    var n = t.readFileSync(e,"utf-8");
    var o = (new i).parseFromString(n);
    if (!o) {
      Editor.warn("Parse %s failed.",e);
      return;
    }for(var a=o.documentElement.getElementsByTagName("tileset"),s=0,c=a.length;s<c;s++){
      var l = a[s];
      var f = l.getAttribute("source");
      if(f){
        var d=r.join(r.dirname(e),f);
        b(d);
        if(t.existsSync(d)){
          var u = t.readFileSync(d,"utf-8");
          var m = (new i).parseFromString(u);

          if (m) {
            g(m,d);
          } else {
            Editor.warn("Parse %s failed.",d);
          }
        }
      }g(l,e)
    }
  }function g(e,t){for(var i=e.getElementsByTagName("image"),n=0,o=i.length;n<o;n++){var a=i[n].getAttribute("source");if (a) {
    b(r.join(r.dirname(t),a))
  }}}
}function w(e){
  b(e);
  if(t.existsSync(e)){var i=t.readFileSync(e,"utf8").match(d);if (!i||0===i.length) {
    Editor.warn("Parse fnt file %s failed!",e);
    return;
  }var n=i[0].match(u);if (n) {for(var o={},a=0,s=n.length;a<s;a++){
    var c = n[a];
    var l = c.indexOf("=");
    var f = c.substring(0,l);
    var g = c.substring(l+1);

    if (g.match(m)) {
      g = parseInt(g);
    } else {
      if ('"'===g[0]) {
        g = g.substring(1,g.length-1);
      }
    }

    o[f] = g;
  }if (o.file) {
    b(r.join(r.dirname(e),o.file));
  } else {
    Editor.warn("Get image file config from fnt file %s failed!",e)
  }} else {
    Editor.warn('Get "page" config from fnt file %s failed!',e)
  }}
}

module.exports = {name:"Cocos Studio",exts:"ccs",importer:function(o,d){
  Editor.log("Import Cocos Studio project : ",o);
  y = r.dirname(o);
  v = r.join(y,l);
  if (!t.existsSync(v)||!t.isDirSync(v)) {
    d(new Error(`Resource directory ${v} is not existed.`));
    return;
  }
  var u = t.readFileSync(o,"utf-8");
  var m = (new i).parseFromString(u);
  if (!m) {
    d(new Error(`Parse ${o} failed.`));
    return;
  }var N=m.documentElement;try{(function(e){
    var r=e.getElementsByTagName("PropertyGroup")[0];
    p = r.getAttribute("Name");
    var t=r.getAttribute("Version");
    S = n.join(c,p);
    Editor.log("Project Name : %s, Cocos Studio Version : %s",p,t);
  })(N)}catch(e){
    d(new Error("Illegal format of project file."));
    return;
  }(function(){
    var e=n.basename(S);
    g = r.join(Editor.remote.Project.path,f,e);

    if (t.existsSync(g)) {
      h(g);
    }

    t.mkdirsSync(g);
  })();try{
    j(v);var P=N.getElementsByTagName("SolutionFolder");

    (function e(t,i){for(var n=0,o=t.childNodes.length;n<o;n++){var a=t.childNodes[n];if(!s.shouldIgnoreNode(a)){
      var c = a.getAttribute("Name");
      var l = r.join(i,c);
      switch(a.nodeName){case "Folder":
        j(l);
        e(a,l);
        break;case"Project":E.push(l);break;case"PlistInfo":break;case"Image":case"TTF":case"Audio":b(l);break;case"PlistImageFolder":var f=r.join(i,a.getAttribute("PListFile"));b(f);var d=r.join(i,a.getAttribute("Image"));b(d);break;case"Fnt":w(l);break;case"PlistParticleFile":x(l);break;case"TmxFile":F(l)}
    }}})((P=(P=P[0].getElementsByTagName("Group"))[0].getElementsByTagName("RootFolder"))[0],v);

    e.waterfall([function(e){Editor.assetdb.import([g],c,false,function(r,t){e()})},function(e){a.importCSDFiles(E,v,g,S,e)}],function(){
      Editor.log("Import Cocos Studio project finished.");
      Editor.log("Resources are imported to folder : %s",S);
      (function() {try{h(g)}catch(e){Editor.warn("Delete temp path %s failed, please delete it manually!",g)}})();
      d();
    });
  }catch(e){d(new Error("Import resource files failed."))}
}};