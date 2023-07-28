"use strict";
const t = require("fire-fs");
const e = require("path");
const o = require("../libs/advice");
exports.template = t.readFileSync(e.join(__dirname,"../template/prop-list.html"),"utf-8");
exports.components = {"prop-row":require("./prop-row")};
exports.props = ["node","offset","scale","props","clip","sample","selected"];
exports.data = function(){return {shadow:false,keys:[{frame:1},{frame:4}],select_box_point_x:0,select_box_point_y:0,box_style:{width:0,height:0,top:0,left:0,opacity:0},box:{d:false,x:0,y:0,w:0,h:0}};};

exports.watch = {box_style:{deep:true,handler(t){
  this.box.y = t.top;
  this.box.h = t.height;
  this.box.x = t.left-this.offset;
  this.box.w = t.width;
}},box:{deep:true,handler(){if (this.box.d) {
  for (; this.selected.length; ) {
    this.selected.pop()
  }
}}}};

exports.methods = {t:Editor.T,updateSelectPoint(t,e){
  this.select_box_point_x = e.x;
  this.select_box_point_y = e.y;
  this.select_box_point_y += this.$el.scrollTop;
},updateStyle(t,e){
  this.box_style.top = e<0?this.select_box_point_y+e:this.select_box_point_y;
  this.box_style.height = Math.abs(e);

  if (this.box_style.top<0) {
    this.box_style.height += this.box_style.top;
    this.box_style.top = 0;
  }

  if (this.box_style.top+this.box_style.height>=this.$el.scrollHeight-3) {
    this.box_style.height = this.$el.scrollHeight-this.box_style.top-3;
  }

  this.box_style.left = t<0?this.select_box_point_x+t:this.select_box_point_x;
  this.box_style.width = Math.abs(t);

  if (this.box_style.left-(this.offset-10)<0) {
    this.box_style.width += this.box_style.left-(this.offset-10);
    this.box_style.left = this.offset-10;
  }
},_onMouseWheel(t){
  if (Math.abs(t.deltaX)>Math.abs(t.deltaY)) {
    o.emit("drag-move",t.deltaX);
  } else {
    o.emit("drag-zoom",t.deltaY,t.offsetX);
  }
},_onMouseDown(t){
  if (1!==t.button) {
    return;
  }
  let e = false;
  let s = 0;
  Editor.UI.startDrag("-webkit-grabbing",t,(t,i,r,h,l)=>{
    o.emit("drag-move",-Math.round(i));
    s += r;

    if (!e) {
      e = true;

      requestAnimationFrame(()=>{
        o.emit("property-scroll",this.$el.scrollTop-s);
        s = 0;
        e = false;
      });
    }
  },(...t)=>{})
},_onDragStart(t){
  this.updateSelectPoint(t.path,{x:t.offsetX,y:t.offsetY});
  this.box_style.opacity = .4;
  this.updateStyle(0,0);

  Editor.UI.startDrag("default",t,(t,e,o,s,i)=>{
    this.box.d = true;
    this.updateStyle(s,i);
  },(t,e,o,s,i)=>{
    this.box.d = false;
    this.box_style.opacity = 0;
    if (Math.abs(s)<5&&Math.abs(i)<5) {
      for (; this.selected.length; ) {
        this.selected.pop()
      }
    }
  });
},_onClick(){for (; this.selected.length; ) {
  this.selected.pop()
}},onPropertyScroll(t){this.$el.scrollTop = t;},onDragKeyStart(){this.shadow = true;},onDragKeyEnd(){this.shadow = false;}};

exports.created = function(){
  o.on("property-scroll",this.onPropertyScroll);
  o.on("drag-key-start",this.onDragKeyStart);
  o.on("drag-key-end",this.onDragKeyEnd);
};

exports.destroyed = function(){
  o.removeListener("property-scroll",this.onPropertyScroll);
  o.removeListener("drag-key-start",this.onDragKeyStart);
  o.removeListener("drag-key-end",this.onDragKeyEnd);
};