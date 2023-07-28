"use strict";
const t = require("fs");
const e = require("path");
const s = require("../utils/cache");
const i = require("../utils/event");
exports.template = t.readFileSync(e.join(__dirname,"../template/list.html"),"utf-8");
exports.props = ["length","filter","regular","type","fsize","collapse"];
exports.data = function(){return{messages:s.messages,offset:0,start:0,list:[],ul:{height:0}}};

exports.watch = {messages(){
  if ((!this.list.length || this.$el.clientHeight+this.$el.scrollTop>=this.ul.height-26)) {
    setTimeout(()=>{this.onUpdateScrollTop()},50);
  }

  this.update();
},start(){
  this.update();
  this.offset = s.queryOffset(this.start);
},length(){this.update()},filter(){this.update()},regular(){this.update()},type(){this.update()},fsize(){this.update()},collapse(){this.update()}};

exports.components = {item:require("./item")};

exports.methods = {update(){
  if (this._updateLocked) {
    return false;
  }
  this._updateLocked = true;

  requestAnimationFrame(()=>{
    this.onUpdate();
    this._updateLocked = false;
  });
},onUpdateScrollTop(){this.$el.scrollTop = this.ul.height;},onUpdate(){
  let t=s.query({collapse:this.collapse,start:this.start,end:this.start+this.length,filter:this.filter||"",regular:this.regular||false,type:this.type||"all"});for (; this.list.length>0; ) {
    this.list.pop();
  }
  t.list.forEach((t,e)=>{this.list[e];return this.list.push(t)});
  this.ul.height = t.height;
},onScroll(t){this.start = s.queryIndex({height:t.target.scrollTop});}};

exports.created = function(){
  this.update();
  i.on("update-list",()=>{this.update()});
};