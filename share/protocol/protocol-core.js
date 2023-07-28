"use strict";
const e = require("fire-path");
const t = require("fire-url");
const r = require("fire-fs");
if(Editor.isMainProcess){
  const e=require("electron").protocol;let o=e.registerFileProtocol("unpack",(e,r)=>{
    let o = decodeURIComponent(e.url);
    let i = n(t.parse(o));
    r(i?{path:i}:-6)
  });

  if (o) {
    Editor.success("protocol unpack registerred");
  } else {
    Editor.failed("Failed to register protocol unpack");
  }

  if ((o = e.registerStringProtocol("disable-commonjs",(e,o)=>{
    let i;
    let n = t.parse(e.url);
    if (!n.slashes) {
      Editor.error('Please use "disable-commonjs://" + fspath.');
      return o(-6);
    }
    let s = decodeURIComponent(n.hostname);
    let a = decodeURIComponent(n.pathname);
    console.log(`Parsing disable-commonjs protocol, url: "${e.url}", hostname: "${s}", pathname: "${a}"`);

    if ((i = Editor.isWin32?s+":"+a:a)) {
      r.readFile(i,"utf8",(e,t)=>{if (e) {
        Editor.error(`Failed to read ${i}, ${e}`);
        return o(-6);
      }o({data:function(e){const t="(function(){var require = undefined;var module = undefined; ";let r=e.lastIndexOf("\n");if(-1!==r){
        let o=e.slice(r).trimLeft();

        if (!o) {
          r = e.lastIndexOf("\n",r-1);
          o = e.slice(r).trimLeft();
        }

        if (o.startsWith("//")) {
          return t+e.slice(0,r)+"\n})();\n"+o
        }
      }return t+e+"\n})();\n"}(t),charset:"utf-8"})});
    } else {
      o(-6);
    }
  }))) {
    Editor.success("protocol disable-commonjs registerred");
  } else {
    Editor.failed("Failed to register protocol disable-commonjs");
  }
}
let o = {engine:{dev:"engine",release:"../engine"},"engine-dev":{dev:"engine/bin/.cache/dev",release:"../engine/bin/.cache/dev"},simulator:{dev:"simulator",release:"simulator"},static:{dev:"editor/static",release:"../static"},templates:{dev:"templates",release:"../templates"},utils:{dev:"utils",release:"../utils"},editor:{dev:"editor",release:"../app.asar.unpacked/editor"},node_modules:{dev:"",release:"../app.asar.unpacked/node_modules"}};
let i = e.relative(o.engine.release,o["engine-dev"].release);
function n(t){
  let r = t.hostname;
  let n = t.pathname||"";
  let s = o[r];
  if (!s) {
    Editor.error("Unrecognized unpack host! Please validate your url.");
    return null;
  }
  let a = Editor.isMainProcess?Editor.Profile:Editor.remote.Profile;
  let l = a.load("local://settings.json");

  if (!(l && false===l.get("use-global-engine-setting"))) {
    l = a.load("global://settings.json");
  }

  let d = Editor.isMainProcess?Editor.App.path:Editor.appPath;
  let c = Editor.dev?s.dev:s.release;
  if (!c) {
    return n.replace(/^[/\\]/,"");
  }switch(r){case"simulator":d = l.get("use-default-cpp-engine")?Editor.builtinCocosRoot||Editor.remote.builtinCocosRoot||"":l.get("cpp-engine-path")||"";break;case"engine-dev":case "engine":
    if (!l.get("use-default-js-engine")&&l.get("js-engine-path")) {
      d = l.get("js-engine-path");
      c = "engine-dev"===r?i:"";
    }}return e.join(d,c,n)
}Editor.Protocol.register("unpack",n);