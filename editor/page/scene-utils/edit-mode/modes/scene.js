"use strict";
const e = require("fire-url");
const r = require("../../lib/sandbox");
const t = require("../../lib/tasks");
const i = require("../../utils/animation");
const n = require("../../utils/prefab");
let s=function(e){
  let r = Editor.remote.currentSceneUuid;
  let t = cc.director.getScene();
  let s = new cc.SceneAsset;
  s.scene = t;
  i.pauseAnimation();
  cc.Object._deferredDestroy();
  n.validateAllSceneReferences(t);
  let o = new(0,Editor.require("app://editor/page/scene-utils/missing-class-reporter").MissingClassReporter)(s);
  let c = new(Editor.require("app://editor/page/scene-utils/missing-object-reporter"))(s);
  let a = Editor.serialize(s,{missingClassReporter:o.stash.bind(o),missingObjectReporter:c.stash.bind(c)});
  try{
    o.report();
    c.report();
  }catch(e){Editor.error(e)}Editor.Ipc.sendToMain("scene:save-scene",a,r,e,-1)
};

module.exports = {name:"scene",title:"",open:function(){},softReload:function(e,i){t.push({name:"soft-reload",run:function(t){r.reload(e,()=>{t()})}})},save:s,beforePushOther:function(){},confirmClose:function(){
  if (!this.dirty()) {
    return 2;
  }
  let r = "Untitled";
  let t = Editor.remote.currentSceneUuid;
  if(t){
    let i=Editor.assetdb.remote.uuidToUrl(t);

    if (i) {
      r = e.basename(i);
    }
  }return Editor.Dialog.messageBox({type:"warning",buttons:[Editor.T("MESSAGE.save"),Editor.T("MESSAGE.cancel"),Editor.T("MESSAGE.dont_save")],title:Editor.T("MESSAGE.scene.save_confirm_title"),message:Editor.T("MESSAGE.scene.save_confirm_message",{name:r}),detail:Editor.T("MESSAGE.scene.save_confirm_detail"),defaultId:0,cancelId:1,noLink:true});
},close:function(e,r){switch(e){case 0:s((t,i)=>{if (i) {
  return r(t,1);
}r(t,e)});break;case 1:case 2:r(null,e)}},dirty:function(){return _Scene.Undo.dirty()}};