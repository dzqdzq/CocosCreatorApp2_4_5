"use strict";require("../../lib/tasks");
const e = require("../../utils/animation");
const n = require("../../lib/sandbox");
const t = require("./scene");
let o = e.STATE;
let i = e.Cache;
let c = false;

module.exports = {name:"animation",title:"",open:function(e){
  if (o.RECORD) {
    return e&&e();
  }
  o.RECORD = true;
  let t=cc.engine.getInstanceById(i.aNode);for(;t&&!t.getComponent(cc.Animation);){if(t.parent instanceof cc.Scene){t = node;break}t = t.parent;}
  i.rNode = t.uuid;
  Editor.Ipc.sendToAll("scene:animation-record-changed",true,t.uuid);

  if (t) {
    i.component = t.getComponent(cc.Animation).uuid;
  }

  cc.engine.editingRootNode = t.uuid;
  let c=Object.create(null);

  _Scene.walk(t,true,e=>{
    let n = c[e.uuid]=_Scene._UndoImpl.recordNode(e);
    let t = e.getComponent(cc.Animation);

    if (t) {
      delete n.comps[t.uuid];
    }
  });

  i.recordDumps = n.registerReloadableData(c);
  i.undoDump = n.registerReloadableData(_Scene.Undo.dump());
  _Scene.Undo.clear();

  if (e) {
    e();
  }
},softReload:function(e,n){
  c = true;
  return false;
},save:e.save,beforePushOther:function(e){require("../index").popAll()},confirmClose:function(n){
  n = void 0===n?2:n;
  return e.confirm(n);
},close:function(r,a){
  if (!o.RECORD) {
    return a&&a();
  }
  o.RECORD = false;
  if (1===r) {
    return a&&a();
  }let d={save(){e.save(()=>{d.exit()})},doNotSave(){e.restoreClip(()=>{d.exit()})},exit(){
    let o=cc.engine.getInstanceById(i.component).getAnimationState(i.animation);

    if (o) {
      o.setTime(0);
      e.pauseAnimation();
    }

    cc.engine.setAnimatingInEditMode(false,"timeline");
    e.hideTrajectoryGizmo();
    Editor.Ipc.sendToAll("scene:animation-record-changed",false);
    let r=n.popReloadableData(i.recordDumps);for(let e in r){
      let n = cc.engine.getInstanceById(e);
      let t = r[e];
      let o = n._children.slice();
      _Scene._UndoImpl.restoreNode(n,t);
      n._children = o;
    }
    cc.engine.editingRootNode = "";
    _Scene.Undo.restore(n.popReloadableData(i.undoDump));
    i.undoDump = null;
    i.recordDumps = null;
    i.animation = null;
    i.component = null;

    if (c) {
      t.softReload();
      c = false;
    }

    return a&&a();
  }};

  if (0===r) {
    d.save();
  } else {
    d.doNotSave();
  }
},dirty:function(){return o.DIRTY}};