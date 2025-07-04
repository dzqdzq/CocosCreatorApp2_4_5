"use strict";
const t = require("fire-fs");
const e = require("path");
const s = require("../libs/advice");
exports.template = t.readFileSync(e.join(__dirname,"../template/preview-list.html"),"utf-8");
exports.components = {"preview-row":require("./preview-row")};
exports.props = ["height","width","hierarchy","mnodes","node","clip","scale","offset","sample","selected"];
exports.data = function(){return {shadow:false,select_box_point_x:0,select_box_point_y:0,size:{width:0,height:0,top:0},box_style:{width:0,height:0,top:0,left:0,opacity:0},box:{d:false,x:0,y:0,w:0,h:0}};};

exports.watch = {width(){try{this.updateSize()}catch(t){Editor.error(t)}},height(){try{this.updateSize()}catch(t){Editor.error(t)}},box_style:{deep:true,handler(t){
  this.box.y = t.top;
  this.box.h = t.height;
  this.box.x = t.left-this.offset;
  this.box.w = t.width;
}},box:{deep:true,handler(){if (this.box.d) {
  for (; this.selected.length; ) {
    this.selected.pop()
  }
}}}};

exports.methods = {t:(t,...e)=>Editor.T(`timeline.preview_list.${t}`,...e),updateSize(){
  this.size.width = this.$el.clientWidth;
  this.size.height = this.$el.clientHeight;
  this.size.top = this.$el.scrollTop;
},updateSelectPoint(t,e){
  this.select_box_point_x = e.x;
  this.select_box_point_y = e.y;
  t.some(t=>t===this.$el||(this.select_box_point_y+=t.offsetTop,false));
  this.select_box_point_y += this.$el.scrollTop;
},updateStyle(t,e){
  this.box_style.top = e<0?this.select_box_point_y+e:this.select_box_point_y;
  this.box_style.height = Math.abs(e);

  if (this.box_style.top<0) {
    this.box_style.height += this.box_style.top;
    this.box_style.top = 0;
  }

  if (this.box_style.top+this.box_style.height>=this.$el.scrollHeight-2) {
    this.box_style.height = this.$el.scrollHeight-this.box_style.top-2;
  }

  this.box_style.left = t<0?this.select_box_point_x+t:this.select_box_point_x;
  this.box_style.width = Math.abs(t);

  if (this.box_style.left-(this.offset-10)<0) {
    this.box_style.width += this.box_style.left-(this.offset-10);
    this.box_style.left = this.offset-10;
  }
},_onMouseWheel(t){
  if (Math.abs(t.deltaX)>Math.abs(t.deltaY)) {
    s.emit("drag-move",t.deltaX);
  } else {
    s.emit("drag-zoom",t.deltaY,t.offsetX);
  }
},_onMouseDown(t){
  if (1!==t.button&&2!==t.button) {
    return;
  }
  let e = false;
  let i = 0;
  Editor.UI.startDrag("-webkit-grabbing",t,(t,o,h,r,l)=>{
    if (o) {
      s.emit("drag-move",-Math.round(o));
    }

    i += h;

    if (!e) {
      e = true;

      requestAnimationFrame(()=>{
        s.emit("hierarchy-scroll",this.$el.scrollTop-i);
        i = 0;
        e = false;
      });
    }
  },(...t)=>{})
},_onClick(){for (; this.selected.length; ) {
  this.selected.pop()
}},_onDragStart(t){
  this.updateSelectPoint(t.path,{x:t.offsetX,y:t.offsetY});
  this.box_style.opacity = .4;
  this.updateStyle(0,0);

  Editor.UI.startDrag("default",t,(t,e,s,i,o)=>{
    this.box.d = true;
    this.updateStyle(i,o);
  },(t,e,s,i,o)=>{
    this.box.d = false;
    this.box_style.opacity = 0;
    if (Math.abs(i)<5&&Math.abs(o)<5) {
      for (; this.selected.length; ) {
        this.selected.pop()
      }
    }
  });
},onHierarchyScroll(t){
  this.$el.scrollTop = t;
  this.updateSize();
},onDragKeyStart(){this.shadow = true;},onDragKeyEnd(){this.shadow = false;}};

exports.created = function(){
  s.on("hierarchy-scroll",this.onHierarchyScroll);
  s.on("drag-key-start",this.onDragKeyStart);
  s.on("drag-key-end",this.onDragKeyEnd);
};

exports.destroyed = function(){
  s.removeListener("hierarchy-scroll",this.onHierarchyScroll);
  s.removeListener("drag-key-start",this.onDragKeyStart);
  s.removeListener("drag-key-end",this.onDragKeyEnd);
};