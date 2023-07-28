"use strict";
const e = require("fire-fs");
const t = require("path");
const s = require("../libs/manager");
const r = require("../libs/advice");
const i = require("../libs/utils");
exports.template = e.readFileSync(t.join(__dirname,"../template/preview-row.html"),"utf-8");
exports.props = ["size","offset","scale","clip","node","sample","selected","box"];

exports.watch = {size:{deep:true,handler(){try{this.updateDisplay()}catch(e){Editor.error(e)}}},clip(){try{this.updateKeys()}catch(e){Editor.error(e)}},sample(){try{this.updateKeys()}catch(e){Editor.error(e)}},box:{deep:true,handler(e){
  if (!(e.y>=this.$el.offsetTop+20 || e.h+e.y<=this.$el.offsetTop+4)) {
    this.keys.forEach(t=>{
      let s=t.frame*this.scale;

      if (!(s<e.x || s>e.x+e.w)) {
        t.rows.map(e=>i.packKey(this.clip.id,this.node.path,e.component,e.property,t.frame,t.value)).forEach(e=>{
          if (-1===i.indexOf(this.selected,e)) {
            this.selected.push(e);
          }
        });
      }
    });
  }
}}};

exports.data = function(){return {display:true,keys:[],lines:[],virtualkeys:[]};};

exports.methods = {t:Editor.T,updateDisplay(){this.display = this.size.top<=this.$el.offsetTop+24&&this.size.top+this.size.height>this.$el.offsetTop;},queryLineStyle:(e,t,s,r)=>`transform: translateX(${e*s+r-1|0}px); width: ${t*s}px`,checkSelected(e){if (!this.clip) {
  return false;
}return e.rows.every(t=>-1!==i.indexOf(this.selected,{id:this.clip.id,path:this.node.path,component:t.component,property:t.property,frame:e.frame}))},updateKeys(){
  for (; this.keys.length; ) {
    this.keys.pop();
  }for (; this.lines.length; ) {
    this.lines.pop();
  }if (!this.clip||this.node.disabled) {
    return;
  }
  let e = this.clip.id;
  let t = this.node.path;
  if (!e||!t) {
    return;
  }
  let r = s.Clip.queryCurve(this.clip.id,this.node.path);
  let a = {};
  i.forEachCurve(r,(e,t,s)=>{s.forEach(s=>{
    let r=Math.round(s.frame*this.sample);

    if (!a[r]) {
      a[r] = {list:[],rows:[]};
    }

    let i=a[r];

    if (s.value) {
      i.list.push(Editor.serialize(s.value));
    } else {
      i.list.push(null);
    }

    i.rows.push({component:e,property:t});
  })});let o=null;Object.keys(a).forEach(e=>{
    let t = a[e];
    let s = {frame:parseInt(e),value:t.list,rows:t.rows};

    if (o&&!i.equalArray(o.value,s.value)) {
      this.lines.push({frame:o.frame,length:s.frame-o.frame});
    }

    o = s;
    this.keys.push(s);
  })
},dragKeyStart(){this.keys.forEach(e=>{
  if (this.checkSelected(e)) {
    this.virtualkeys.push({frame:parseFloat(e.frame),offset:0,source:e});
  }
})},dragKeyMove(e){this.virtualkeys.forEach(t=>{t.offset = e;})},dragKeyEnd(){for (; this.virtualkeys.length; ) {
  this.virtualkeys.pop();
}this.updateKeys()},queryKeyStyle:(e,t,s)=>`transform: translateX(${e*t+s-1|0}px);`,queryVKeyStyle:(e,t,s,r)=>`transform: translateX(${(e+t)*s+r-1|0}px);`,_onKeyMouseDown(e,t){
  r.emit("change-node",this.node);
  let s = t.rows.map(e=>i.packKey(this.clip.id,this.node.path,e.component,e.property,t.frame,t.value));
  let a = this.checkSelected(t);
  if (e&&!e.ctrlKey&&!e.metaKey&&!a) {
    for (; this.selected.length; ) {
      this.selected.pop();
    }
  }s.forEach(e=>{
    if (!a) {
      this.selected.push(e);
    }
  })
},_onKeyMouseUp(e,t){t.rows.map(e=>i.packKey(this.clip.id,this.node.path,e.component,e.property,t.frame,t.value)).forEach(e=>{
  if (!this.checkSelected(t)) {
    this.selected.push(e);
  }
})},_onKeyClick(e){
  if (e) {
    e.preventDefault();
  }

  if (e) {
    e.stopPropagation();
  }
},_onKeyDragStart(e,t){
  let s = 0;
  let i = 1/0;

  this.selected.forEach(e=>{
    if (e.frame<i) {
      i = e.frame;
    }
  });

  r.emit("drag-key-start");
  Editor.UI.startDrag("ew-resize",e,(e,t,a,o,h)=>{s += isNaN(t)?0:t;let p=Math.round(s/this.scale);r.emit("drag-key-move",Math.max(-i,p))},(e,t,a,o,h)=>{let p=Math.round(s/this.scale);r.emit("drag-key-end",Math.max(-i,p))});
},_onLineClick(e,t){
  if (e) {
    e.preventDefault();
  }

  if (e) {
    e.stopPropagation();
  }

  let r = t.frame;
  let a = t.frame+t.length;
  let o = s.Clip.queryInfo(this.clip.id);
  if (!e.ctrlKey&&!e.metaKey) {
    for (; this.selected.length; ) {
      this.selected.pop();
    }
  }let h=s.Clip.queryCurve(this.clip.id,this.node.path);i.forEachCurve(h,(e,t,s)=>{s.forEach(s=>{let h=Math.round(s.frame*o.sample);if(h===r||h===a){let r=i.packKey(this.clip.id,this.node.path,e,t,h,s.value);this.selected.push(r)}})})
}};

exports.created = function(){
  r.on("drag-key-start",this.dragKeyStart);
  r.on("drag-key-move",this.dragKeyMove);
  r.on("drag-key-end",this.dragKeyEnd);
  r.on("clip-data-update",this.updateKeys);
};

exports.compiled = function(){requestAnimationFrame(()=>{
  if (this.$el) {
    this.updateDisplay();
    this.updateKeys();
  }
})};

exports.destroyed = function(){
  r.removeListener("drag-key-start",this.dragKeyStart);
  r.removeListener("drag-key-move",this.dragKeyMove);
  r.removeListener("drag-key-end",this.dragKeyEnd);
  r.removeListener("clip-data-update",this.updateKeys);
};