"use strict";
const e = require("../libs/advice");
const {promisify:i} = require("util");
const t = require("../libs/dump");
let r=null;

module.exports = {selected(e,i,r){
  if ("node"===i) {
    t.update(()=>{this.vm.updateState()});
  }
},unselected(e,i){
  if ("node"===i) {
    t.update();
  }
},async activated(a,d,h){
  if ("node"!==d||!h) {
    return;
  }
  clearTimeout(r);

  if (this.vm) {
    this.vm.hierarchy.some(i=>i.id===h&&(e.emit("change-node",i),true));
  }

  if (!this.vm||this.vm.record) {
    return;
  }let n=await i(Editor.Ipc.sendToPanel)("scene","scene:query-animation-hierarchy",h);
  n = JSON.parse(n);

  if (!(this.vm.hierarchy&&this.vm.hierarchy[0] && n[0].id===this.vm.hierarchy[0].id)) {
    e.emit("change-hierarchy",function(e){
      let i=[];for (; i.length; ) {
        i.pop();
      }
      let t = [];

      let r = function(e,a,d){
        if (e.hidden) {
          return;
        }
        d = `${d}/${e.name}`;
        let h=false;

        if (-1===t.indexOf(d)) {
          t.push(d);
        } else {
          h = true;
        }

        i.push({id:e.id,path:d,name:e.name,level:a,state:0,disabled:h});

        if (e.children) {
          e.children.forEach(e=>{r(e,a+1,d)});
        }
      };

      e.forEach(e=>{r(e,0,"")});
      return i;
    }(n));

    t.root = n[0].id;
    this.vm.updateClips();
  }
},deactivated(i,a,d){if ("node"===a&&d) {
  return this.vm.record?(r=setTimeout(()=>{e.emit("change-node",{id:"",path:"////"})},100),void 0):(r=setTimeout(()=>{
    e.emit("change-hierarchy",[]);
    t.root = "";
    this.vm.updateClips();
  },100),void 0);
}}};