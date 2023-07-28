"use strict";
const e = Editor.require("scene://edit-mode");
const n = Editor.require("scene://utils/animation");
const t = Editor.require("scene://utils/scene");
const i = Editor.require("scene://dump/hierarchy");
const r = require("../../../../share/engine-extends/object-walker");
const c = require("lodash");

module.exports = {"query-dirty-state"(n){if(n.reply){let t=e.dirtyMode();if (t) {
  n.reply(null,{dirty:true,name:t.name});
  return;
}n.reply(null,{name:"scene",dirty:_Scene.Undo.dirty()})}},"query-group-list"(e){
  if (e.reply) {
    e.reply(null,cc.game.groupList);
  }
},"query-hierarchy"(e){
  if (!cc.engine.isInitialized) {
    e.reply(null,"",[]);
    return;
  }
  let n = i.node();
  let t = _Scene.currentScene().uuid;
  e.reply(null,t,n)
},"query-nodes-by-comp-name"(e,n){
  let t = cc.director.getScene();
  let i = [];
  let r = cc.js.getClassByName(n);

  if (r) {
    _Scene.walk(t,false,e=>{
      if (e.getComponent(r)) {
        i.push(e.uuid);
      }
    });
  }

  e.reply(null,i);
},"query-node"(e,n,t){
  if(e.reply){
    let t=_Scene.dumpNode(n);
    t = JSON.stringify(t);
    e.reply(null,t);
    return;
  }let i=_Scene.dumpNode(t);
  i = JSON.stringify(i);
  Editor.Ipc.sendToWins("scene:reply-query-node",n,i);
},"query-node-info"(e,n,t){
  let i = null;
  let r = cc.engine.getInstanceById(n);

  if (r) {
    i = r instanceof cc.Component?r.node:r;
  }

  let c = null;
  let l = [];
  if(i&&"cc.Node"!==t){c = i.getComponent(cc.js._getClassById(t));const e=i.getComponents(cc.Component);for(let n of e)l.push({id:n.uuid,cid:n.__cid__,name:n.name,typename:cc.js.getClassName(n)})}e.reply(null,{name:i?i.name:"",missed:null===r,nodeID:i?i.uuid:null,compID:c?c.uuid:null,compIDList:l})
},"query-node-functions"(e,n){
  var t = cc.engine.getInstanceById(n);
  var i = Editor.getNodeFunctions(t);
  e.reply(null,i)
},"choose-last-rigid-body"(e,n){var t=cc.engine.getInstanceById(n);if(t instanceof cc.Joint){
  var i=t.node.getSiblingIndex()-1;

  if (i<0) {
    i = t.node.parent.children.length-1;
  }

  var r=t.node.parent.children[i];if (!r) {
    return;
  }
  _Scene.Undo.recordNode(t.node.uuid);
  t.connectedBody = r.getComponent(cc.RigidBody);
  _Scene.Undo.commit();
}},"choose-next-rigid-body"(e,n){var t=cc.engine.getInstanceById(n);if(t instanceof cc.Joint){
  var i=t.node.getSiblingIndex()+1;

  if (i>=t.node.parent.children.length) {
    i = 0;
  }

  var r=t.node.parent.children[i];

  if (!r) {
    r = t.node.parent;
  }

  _Scene.Undo.recordNode(t.node.uuid);
  t.connectedBody = r.getComponent(cc.RigidBody);
  _Scene.Undo.commit();
}},"is-child-class-of"(e,n,t){
  let i = cc.js._getClassById(n);
  let r = cc.js._getClassById(t);
  let c = cc.js.isChildClassOf(i,r);
  e.reply(null,c)
},"has-copied-component":function(e){
  if (e.reply) {
    e.reply(null,t.hasCopiedComponent());
  }
},"query-animation-hierarchy"(e,n){
  let t = cc.engine.getInstanceById(n);
  let r = t;
  for(;r&&!r.getComponent(cc.Animation);){if(r.parent instanceof cc.Scene){r = t;break}r = r.parent;}

  if (e.reply) {
    e.reply(null,JSON.stringify(i.node(r,true)));
  }
},"query-animation-list"(e,n){
  let t=cc.engine.getInstanceById(n);if (!t||t instanceof cc.Scene) {
    if (e.reply) {
      e.reply(null,[]);
    }

    return;
  }let i=t.getComponent(cc.Animation);if (!i) {
    if (e.reply) {
      e.reply(null,[]);
    }

    return;
  }
  let r = i.getClips();
  let c = (r=r.filter(function(e){return!!e})).map(e=>e._uuid);

  if (e.reply) {
    e.reply(null,c);
  }
},"query-animation-properties"(e,t){
  let i = cc.engine.getInstanceById(t);
  let r = i;
  for(;r&&!r.getComponent(cc.Animation);){if(r.parent instanceof cc.Scene){r = i;break}r = r.parent;}
  let c = Editor.getNodeDump(i);
  let l = n.queryEditProperties(c,r!==i);

  if (e.reply) {
    e.reply(null,l);
  }
},"query-animation-record"(t){
  let i = e.curMode();
  let r = n.Cache.rNode;
  let c = cc.engine.getInstanceById(n.Cache.component);
  let l = c&&c.getAnimationState(n.Cache.animation).clip;
  let o = {record:i&&"animation"===i.name,root:r,clip:l?{id:l._uuid,name:l.name}:null};

  if (t.reply) {
    t.reply(null,o);
  }
},"query-animation-clip"(e,t){
  if (!n.curAnim) {
    return e.reply&&e.reply(null,null);
  }let i=n.curAnim.getClips();for(let n=0;n<i.length;n++){let r=i[n];if (r._uuid===t) {
    return e.reply&&e.reply(null,Editor.serialize(r))
  }}

  if (e.reply) {
    e.reply(null,null);
  }
},"query-asset-info"(e,n){
  if (e.reply) {
    Editor.assetdb.queryInfoByUuid(n,(...n)=>{e.reply(...n)});
  }
},"query-nodes-by-usedby-uuid"(e,n){
  let t=[];

  r.walkProperties(cc.director.getScene(),(e,i,r,l)=>{if(r instanceof cc.Asset&&r._uuid===n){
    let e=c.findLast(l,e=>e instanceof cc.Node);

    if (e) {
      t.push(e.uuid);
    }
  }});

  e.reply(null,t);
}};