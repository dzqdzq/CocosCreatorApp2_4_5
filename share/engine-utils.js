"use strict";
const o = require("path");
const t = require("fire-fs");
const i = Editor.isWin32?"/simulator/win32/config.json":"/simulator/mac/Simulator.app/Contents/Resources/config.json";
function n(){
  let i="";
  i = Editor.dev?Editor.url("app://cocos2d-x"):o.join(Editor.url("app://"),"..","cocos2d-x");
  return t.isDirSync(i)?i:null;
}
module.exports = {getSimulatorConfigPath:function(t){let n=Editor.builtinCocosRoot||Editor.remote.builtinCocosRoot;return o.join(t||n,i)},getSimulatorConfigAt:function(o){try{let i=this.getSimulatorConfigPath(o);return t.readJsonSync(i)}catch(o){return Editor.require("unpack://static/simulator/config.json")}},getEnginePath:n,getConsolePath:function(){let t=n();return t?o.join(t,"tools","cocos2d-console","bin"):null}};