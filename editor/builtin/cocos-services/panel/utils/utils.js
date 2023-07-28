"use strict";
const e = require("fire-fs");
const r = require("path");
const t = require("./jszip");
const i = require("compressing");
const n = require("watch");
let o=y()+"/local/logs/service.log";var s;function c(t){
  if (!e.existsSync(r.dirname(t))) {
    c(r.dirname(t));
  }

  e.mkdirSync(t);
}function a(t,i){
  var n=r.dirname(i);

  if (!e.existsSync(n)) {
    c(n);
  }

  e.copySync(String(t),String(i));
}function l(r){try{return JSON.parse(e.existsSync(r)?e.readFileSync(r,"utf8"):"{}")}catch(e){return null}}function d(r,t){e.writeFileSync(r,JSON.stringify(t,null,"\t"))}function u(r,t=false){
  var i=[];

  e.readdirSync(r).forEach(n=>{
    var o = r+"/"+n;
    var s = e.statSync(o);

    if (s&&s.isDirectory()) {
      if (t) {
        i.push(o+"/");
      }

      i = i.concat(u(o,t));
    } else {
      i.push(o);
    }
  });

  return i;
}function f(r,t,i){
  var n = u(r,true);
  var o = n.length;
  var s = 0;
  var l = "";
  for(var d of(0==e.existsSync(t)&&c(t),n)){
    if ("/"===(l=d.replace(r,t)).charAt(l.length-1)) {
      if (0==e.existsSync(l)) {
        c(l);
      }
    } else {
      a(d,l);
    }

    if (i) {
      i(++s/o*100|0)
    }
  }
}function p(r){if(e.existsSync(r)){for(var t of e.readdirSync(r)){
  var i=r+"/"+t;

  if (e.statSync(i).isDirectory()) {
    p(i);
  } else {
    e.unlinkSync(i);
  }
}e.rmdirSync(r)}}function h(){return Editor.isMainProcess?Editor.Project?Editor.Project:Editor.projectInfo:Editor.remote.Project?Editor.remote.Project:Editor.remote.projectInfo}function v(){return h().name}function y(){return h().path}

module.exports = {t:function(e,...r){return Editor.T(`cocos-services.${e}`,...r)},getLang:function(){return Editor.lang},getCreatorHomePath:function(){return Editor.isMainProcess?Editor.App.home:Editor.remote.App.home},getProjectInfo:h,getProjectPath:y,getProjectName:v,getProjectID:function(){return void 0!==h().id?h().id:""},validateString:function(e){return void 0!==e&&""!==e},zip:function(e,t,n){var o=`${t||r.dirname(e)}/${r.basename(filename)}.zip`;i.zip.compressDir(e,o).then(()=>n&&n(null,true)).catch(e=>n&&n(e,false))},unzip:function(e,r,t){i.zip.uncompress(e,r).then(()=>t(null)).catch(e=>t(e))},mkdirs:c,copyDir:f,moveDir:function(e,r,t){
  f(e,r,t);
  p(e);
},removeDir:p,walk:u,copyFile:a,readJson:l,saveJson:d,parseProjectJson:function(e,r,t=false){
  var i=l(e);

  if (!i.serviceClassPath) {
    i.serviceClassPath = [];
  }

  if (t) {
    if (i.serviceClassPath.indexOf(r)<=-1) {
      i.serviceClassPath.push(r);
    }
  } else {
    var n=i.serviceClassPath.indexOf(r);

    if (n>=-1) {
      i.serviceClassPath.splice(n,1);
    }
  }
  this.printLog(`insert array element to "${e}" node of serviceClassPath`);
  d(e,i);
},insertCodeLine:function(r,t,i,n=false){if (!e.existsSync(r)) {
  return;
}let o=e.readFileSync(r,"utf8").split("\n");for (let e=0; e<o.length; e++) {
  if(o[e].match(t)){o.splice(n?e:e+1,0,i);break}
}e.writeFileSync(r,o.join("\n"))},appendCodeLine:function(r,t){
  if (!e.existsSync(r)) {
    return;
  }let i=e.readFileSync(r,"utf8");
  i += t;
  e.writeFileSync(r,i);
},copyServicePackages:function(r){r.forEach(r=>{
  if (e.statSync(r.src).isDirectory()) {
    f(r.src,r.dst);
    this.printLog(`copy folder "${r.src} to "${r.dst}"`);
  } else {
    a(r.src,r.dst);
    this.printLog(`copy file "${r.src} to "${r.dst}"`);
  }
})},deleteServicePackages:function(r){r.forEach(r=>{
  if (e.statSync(r.src).isDirectory()) {
    p(r.dst);
    this.printLog(`delete folder from "${r.dst}"`);
  } else {
    if (e.existsSync(r.dst)) {
      e.unlinkSync(r.dst);
    }

    this.printLog(`delete file from"${r.dst}"`);
  }
})},printLog:function(t,i=false){
  if (!s) {
    if (!e.existsSync(r.dirname(o))) {
      this.mkdirs(r.dirname(o));
    }

    s = e.createWriteStream(o,{flags:"a"});
  }

  try{
    var n=`Cocos Service ${(new Date).toLocaleString()} ${v()}\t${t}\n\n`;

    if (i) {
      this.printToCreatorConsole("log",n);
    }

    s.write(n);
  }catch(e){console.error(e)}
},openUrlWithDefaultExplorer:function(e){require("electron").shell.openExternal(e)},printToCreatorConsole:function(e,r){
  var t="Cocos Service --- "+r;

  if ("log"===e) {
    if (Editor.isMainProcess) {
      Editor.log(t);
    } else {
      Editor.Ipc.sendToMain("cocos-services:log",t);
    }
  } else {
    if ("error"===e) {
      if (Editor.isMainProcess) {
        Editor.error(t);
      } else {
        Editor.Ipc.sendToMain("cocos-services:error",t);
      }
    } else {
      if ("info"===e) {
        if (Editor.isMainProcess) {
          Editor.info(t);
        } else {
          Editor.Ipc.sendToMain("cocos-services:info",t);
        }
      } else {
        if ("warn"===e) {
          if (Editor.isMainProcess) {
            Editor.warn(t);
          } else {
            Editor.Ipc.sendToMain("cocos-services:warnning",t);
          }
        } else {
          if ("success"===e) {
            if (Editor.isMainProcess) {
              Editor.success(t);
            } else {
              Editor.Ipc.sendToMain("cocos-services:success",t);
            }
          } else {
            if ("failed"===e) {
              if (Editor.isMainProcess) {
                Editor.failed(t);
              } else {
                Editor.Ipc.sendToMain("cocos-services:failed",t);
              }
            }
          }
        }
      }
    }
  }
},unzipWithProgress:function(r,i,n){
  var o=i;

  if ("/"!=o.charAt(o.length-1)) {
    i += "/";
  }

  var s=new t;try{e.readFile(r,function(r,t){if (r) {
    throw (n&&n(r,null), r);
  }s.loadAsync(t).then(r=>{
    var t=[];for(var o in r.files)t.push(o);t.sort();
    var s = t.length;
    var a = 0;
    for(var o of t){
      var l=i+o;

      if ("/"===o.charAt(o.length-1)) {
        if (0==e.existsSync(l)) {
          c(l);
        }
      } else {
        r.file(o).nodeStream().pipe(e.createWriteStream(l)).on("finish",function(){e.chmodSync(l,493)});
      }

      if (n) {
        n(null,{status:"unziping",progress:++a/s*100|0});
      }
    }

    if (n) {
      n(null,{status:"complete",progress:100});
    }
  })})}catch(e){
    if (n) {
      n(e,null);
    }
  }
},watch:n,replaceTagAtoUILink:function(e){return e.replace(/\<a /g,'<a style="color: #DDDDDD; cursor: pointer;" ').replace(/href=/g,"onclick=\"require('electron').shell.openExternal(this.getAttribute('value'))\" value=").replace(/\<\/a\>/g,"</a>")}};