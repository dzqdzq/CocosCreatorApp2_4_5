"use strict";
const e = require("fire-fs");
const t = require("path");
const o = require("../libs/advice");
const r = require("../libs/manager");
exports.template = e.readFileSync(t.join(__dirname,"../template/nodes.html"),"utf-8");
exports.props = ["node","hierarchy","mnodes","clip"];
exports.data = function(){return{}};
exports.watch = {node:{deep:true,handler(){this.updateScrollTop()}}};

exports.methods = {t:(e,...t)=>Editor.T(`timeline.nodes.${e}`,...t),getRoot(){let e=this.hierarchy&&this.hierarchy[0];return(e=e||{}).name||""},getPath:e=>e.replace(/\/[^\/]+(\/)?/,""),queryNodeStyle:e=>`text-indent: ${15*e}px;`,_onScroll(e){let t=e.target;o.emit("hierarchy-scroll",t.scrollTop)},_onNodeClick(e){
  Editor.Selection.select("node",e.id);
  o.emit("change-node",e);
},_onVNodeClick(e){
  Editor.Selection.unselect("node",e.id);
  o.emit("change-node",e);
},_onNodeMoreClick(e,t){Editor.Ipc.sendToMain("timeline:menu-node-operation",{path:t.path,type:"node",x:e.pageX,y:e.pageY})},_onVNodeMoreClick(e,t){Editor.Ipc.sendToMain("timeline:menu-node-operation",{path:t.name,type:"vnode",x:e.pageX,y:e.pageY})},_onNodeInputBlur(e,t){
  let i="/"+this.getRoot();

  if (e.target.value) {
    i += "/"+e.target.value;
  }

  if (i===t.path) {
    return;
  }let l=r.Clip.deleteCurve(this.clip.id,t.path);

  if (l) {
    r.Clip.addCurve(this.clip.id,i,l);
  }

  t.state = 0;
  o.emit("clip-data-update");
},_onVNodeInputBlur(e,t){
  let i="/"+this.getRoot();

  if (e.target.value) {
    i += "/"+e.target.value;
  }

  if (i===t.name) {
    return;
  }let l=r.Clip.deleteCurve(this.clip.id,t.name);

  if (l) {
    r.Clip.addCurve(this.clip.id,i,l);
  }

  t.state = 0;
  o.emit("clip-data-update");
},_onNodeInputKeydown(e,t){
  if (13===e.keyCode) {
    t.state = 0;
  } else {
    if (27===e.keyCode) {
      e.target.value = t.path.replace(/\/[^\/]+(\/)?/,"");
      t.state = 0;
    }
  }
},_onVNodeInputKeydown(e,t){
  if (13===e.keyCode) {
    t.state = 0;
  } else {
    if (27===e.keyCode) {
      e.target.value = t.name.replace(/\/[^\/]+(\/)?/,"");
      t.state = 0;
    }
  }
},updateScrollTop(){
  let e = this.$el;
  let t = e.getElementsByClassName("selected")[0];
  if (!t) {
    return;
  }let o=t.offsetTop-e.clientHeight+20;

  if (e.scrollTop<o) {
    e.scrollTop = o;
  }
},onHierarchyScroll(e){this.$el.scrollTop = e;}};

exports.created = function(){o.on("hierarchy-scroll",this.onHierarchyScroll)};
exports.destroyed = function(){o.removeListener("hierarchy-scroll",this.onHierarchyScroll)};
exports.directives = {focus:{bind(){setTimeout(()=>{this.el.focus()},200)}}};