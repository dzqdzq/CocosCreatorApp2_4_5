const e = require("fire-fs");
const t = require("fire-path");
const i = require("xcode");
const r = require("./utils.js");
function o(t){
  this.pbxPath = `${t.dest}/frameworks/runtime-src/proj.ios_mac/${t.projectName}.xcodeproj/project.pbxproj`;
  if(e.existsSync(this.pbxPath)){var r=i.project(this.pbxPath);this.project = r.parseSync();}
}function n(e){}function s(e){
  this.options = e;
  this.iOS = new o(e);
  this.Android = new n(e);
}function a(e){if (e) {
  return e.replace(/^"(.*)"$/,"$1")
}}

s.prototype = {insertCodeLine:function(t,i,o,n=false){if (!e.existsSync(t)) {
  return;
}let s=e.readFileSync(t,"utf8");if (s.indexOf(o)>=0) {
  return;
}let a=s.split("\n");for(let e=0;e<a.length;e++){if(a[e].match(i)){
  a.splice(n?e:e+1,0,o);
  r.printLog(`insert code "${o} to "${t}" in line ${e}`);
  break
}}e.writeFileSync(t,a.join("\n"))},noteCodeLine(t,i,o){let n=e.readFileSync(t,"utf8").split("\n");for(let e=0;e<n.length;e++){let s=n[e];if(s.match(i)){
  n[e] = o+s;
  r.printLog(`note code line form "${t}" in line ${e}`);
  break
}}e.writeFileSync(t,n.join("\n"))},appendCodeLine:function(t,i){
  if (!e.existsSync(t)) {
    return;
  }let o=e.readFileSync(t,"utf8");
  o += i;
  r.printLog(`append code "${i} to "${t}"`);
  e.writeFileSync(t,o);
},insertToMainJS:function(e,i){
  let r=t.join(this.options.dest,"main.js");

  if (i) {
    this.insertCodeLine(r,i,e);
  } else {
    this.appendCodeLine(r,e);
  }
},insertRequireWithMainJS:function(e){var t=`        require('${e}');`;this.insertToMainJS(t,/require\(['|"]jsb-adapter\/jsb-engine.js['|"]\)/)},insertScriptToIndexHTML:function(e){let i=t.join(this.options.dest,"index.html");this.insertCodeLine(i,/src *= *["|']main.js["|']/,e,true)},replaceCodeSegment:function(t,i,o){
  if (!e.existsSync(t)) {
    return;
  }let n=e.readFileSync(t,"utf8");
  n = n.replace(i,o);
  r.printLog(`replace code "${o} to "${t}" with regular "${i}"`);
  e.writeFileSync(t,n);
}};

o.prototype = {removeFromHeaderSearchPaths:function(e){
  var t;
  var i;
  var r = this.project.hash.project.objects.XCBuildConfiguration;
  for(t in r)if((i=r[t].buildSettings)&&i.SDKROOT&&"iphoneos"==a(i.SDKROOT)){
    if (i.HEADER_SEARCH_PATHS&&"Array"==typeof i.HEADER_SEARCH_PATHS) {
      i.HEADER_SEARCH_PATHS.filter(t=>t.indexOf(e)>-1).forEach(e=>{var t=i.HEADER_SEARCH_PATHS.indexOf(e);i.HEADER_SEARCH_PATHS.splice(t,1)});
    }

    if (i.HEADER_SEARCH_PATHS.length<=1) {
      i.HEADER_SEARCH_PATHS = ['"$(inherited)"'];
    }
  }this.savePBXProjectConfig()
},addToHeaderSearchPaths:function(e){
  var t;
  var i;
  var o = this.project.hash.project.objects.XCBuildConfiguration;
  for (t in o) if ((i=o[t].buildSettings)&&i.SDKROOT&&"iphoneos"==a(i.SDKROOT)) {
    if (!(i.HEADER_SEARCH_PATHS && "string"!=typeof i.HEADER_SEARCH_PATHS)) {
      if (2===i.HEADER_SEARCH_PATHS.length) {
        i.HEADER_SEARCH_PATHS = ['"$(inherited)"'];
      } else {
        i.HEADER_SEARCH_PATHS = [i.HEADER_SEARCH_PATHS];
      }
    }

    if (i.HEADER_SEARCH_PATHS.indexOf(e)<=-1) {
      i.HEADER_SEARCH_PATHS.push(e);
    }
  }
  r.printLog(`add searchPath "${e} to iOS project`);
  this.savePBXProjectConfig();
},removeFromLibrarySearchPaths:function(e){
  var t;
  var i;
  var r = this.project.hash.project.objects.XCBuildConfiguration;
  for(t in r)if((i=r[t].buildSettings)&&i.SDKROOT&&"iphoneos"==a(i.SDKROOT)){
    if (i.LIBRARY_SEARCH_PATHS) {
      i.LIBRARY_SEARCH_PATHS.filter(t=>t.indexOf(e)>-1).forEach(e=>{var t=i.LIBRARY_SEARCH_PATHS.indexOf(e);i.LIBRARY_SEARCH_PATHS.splice(t,1)});
    }

    if (0==i.LIBRARY_SEARCH_PATHS.length) {
      i.LIBRARY_SEARCH_PATHS = ['"$(inherited)"'];
    }
  }this.savePBXProjectConfig()
},addToLibrarySearchPaths:function(e){
  var t;
  var i;
  var o = this.project.hash.project.objects.XCBuildConfiguration;
  for (t in o) if ((i=o[t].buildSettings)&&i.SDKROOT&&"iphoneos"==a(i.SDKROOT)) {
    if (!(i.LIBRARY_SEARCH_PATHS && "string"!=typeof i.LIBRARY_SEARCH_PATHS)) {
      if (2===i.LIBRARY_SEARCH_PATHS.length) {
        i.LIBRARY_SEARCH_PATHS = ['"$(inherited)"'];
      } else {
        i.LIBRARY_SEARCH_PATHS = [i.LIBRARY_SEARCH_PATHS];
      }
    }

    if (i.LIBRARY_SEARCH_PATHS.indexOf(e)<=-1) {
      i.LIBRARY_SEARCH_PATHS.push(e);
    }
  }
  this.savePBXProjectConfig();
  r.printLog(`add librarySearchPath "${e} to iOS project`);
},addLibaryToTarget:function(e,t){
  if(this._searchTarget(t)){
    this.project.addStaticLibrary(e,{target:this._searchTarget(t),embed:false});
    var i = e.lastIndexOf("/");
    var o = `"$(SRCROOT)/${e.substring(0,i)}"`;
    this.addToLibrarySearchPaths(o)
  }
  r.printLog(`add static library "${e} to iOS project`);
  this.savePBXProjectConfig();
},removeLibraryFromTarget:function(t){if (!e.existsSync(this.pbxPath)) {
  return;
}let i=e.readFileSync(this.pbxPath,"utf8").split("\n");for(let e=0;e<i.length;e++){if(i[e].match(t)){i[e] = "";break}}e.writeFileSync(this.pbxPath,i.join("\n"))},addFrameworkToTarget:function(e,t){
  if (this._searchTarget(t)) {
    this.project.addFramework(e,{customFramework:true,target:this._searchTarget(t),embed:false});
  }

  r.printLog(`add framework "${e} to iOS project`);
  this.savePBXProjectConfig();
},removeFrameworkFromTarget:function(e,t){
  if (this._searchTarget(t)) {
    this.project.removeFramework(e,{customFramework:true,target:this._searchTarget(t),embed:false});
  }

  this.savePBXProjectConfig();
},addHeaderFileToProject:function(e,t,i){
  let o = this._searchPBXGroup(t);
  let n = this._searchTarget(i);

  if (o) {
    this.project.addHeaderFile(e,{target:n},o);
  }

  r.printLog(`add hrader file "${e} to iOS project`);
  this.savePBXProjectConfig();
},removeHeaderFileFromProject:function(e,t){
  let i=this._searchPBXGroup(t);

  if (i) {
    this.project.removeHeaderFile(e,null,i);
  }

  this.savePBXProjectConfig();
},addSourceFileToProject:function(e,t,i){
  let o = this._searchPBXGroup(t);
  let n = this._searchTarget(i);

  if (o) {
    this.project.addSourceFile(e,{target:n},o);
  }

  r.printLog(`add source file "${e} to iOS project`);
  this.savePBXProjectConfig();
},removeSourceFileFromProject:function(e,t){
  let i=this._searchPBXGroup(t);

  if (i) {
    this.project.removeSourceFile(e,null,i);
  }

  this.savePBXProjectConfig();
},addPbxGroup:function(e,t,i){
  this.project.addPbxGroup(e,t,i);
  r.printLog(`add pbxGroup "${t} to iOS project`);
  this.savePBXProjectConfig();
},_searchPBXGroup(e){
  if (!this.project) {
    return;
  }
  let t = this.project.getPBXObject("PBXGroup");
  let i = null;
  for(let r in t){let o=t[r];if("string"==typeof o&&o===e){i = r.split("_")[0];break}}return i
},_searchTarget(e){
  let t = this.project.pbxNativeTargetSection();
  let i = null;
  for(let r in t){let o=t[r];if("string"==typeof o&&o===e){i = r.split("_")[0];break}}return i
},savePBXProjectConfig:function(){e.writeFileSync(this.pbxPath,this.project.writeSync())},printPBXProjectConfig:function(){console.log(this.project)}};

n.prototype = {};
module.exports = s;