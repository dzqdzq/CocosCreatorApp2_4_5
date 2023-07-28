"use strict";
const e = require("fs");
const t = require("path");
const r = require("url");
const n = require("electron");
const s = require("../utils");
exports.template = e.readFileSync(t.join(__dirname,"../template/tab-news.html"),"utf-8");
exports.props = ["hasreadnews","shouldreadnews","news_category_url","news_msg_time"];
exports.data = function(){return {src:"",loading:true};};

exports.methods = {t:e=>Editor.T(e),getPids(){
  const e=[];

  this.shouldreadnews.forEach(t=>{
    if (-1!==this.hasreadnews.indexOf(t.pid)) {
      e.push(t.pid);
    }
  });

  return e;
},handleUrl(e){
  let t=true;

  if (-1!==e.indexOf("?")) {
    t = false;
  }

  e += (t?"?":"&")+`ver=${Editor.remote.versions.CocosCreator.replace(/-.+$/,"")}`;
  e += `&pids=${this.getPids().join(",")}`;
  return e+=`&lang=${Editor.lang}`;
},newWindow(e){
  e.stopPropagation();
  e.preventDefault();
  n.shell.openExternal(e.url);
  const t=r.parse(e.url).pathname.split(/(\/|\\)/);let o=t[t.length-1];if (void 0===o) {
    console.warn("Failed to get the page id");
    return;
  }
  o -= 0;

  if (!isNaN(o)) {
    s.event.emit("record-news-id",o);
    console.log(`Open the news: ${o}`);
  }
},startLoading(e){this.loading = true;},stopLoading(e){
  this.loading = false;
  if (!e.target||!e.target.src) {
    console.warn("Could not get a link to the wall page");
    return;
  }const t=r.parse(e.target.src).pathname.split(/(\/|\\)/);let n=t[t.length-1];if (void 0===n) {
    console.warn("Failed to get the page id");
    return;
  }
  n -= 0;

  if (!isNaN(n)) {
    s.event.emit("record-news-id",n);
    console.log(`Open the news: ${n}`);
  }
}};

exports.ready = async function(){
  if (Date.now()-this.news_msg_time>3e4) {
    await this.$root.updateNewsMsg();
  }

  let e = "";
  let t = this.getPids();
  for(let r of this.shouldreadnews)if(-1===t.indexOf(r.pid)){
    if(2==r.msg_type){
      e = r.url;
      s.event.emit("record-news-id",r.pid);
      break
    }

    if (!(e || "announcement"!==r.category&&"news"!==r.category)) {
      e = this.news_category_url.replace("{{language}}",Editor.lang).replace("{{category}}",r.category);
    }
  }
  e = (e=e||this.news_category_url.replace("{{language}}",Editor.lang).replace("{{category}}","announcement")).replace("/zh","");
  this.src = this.handleUrl(e);
};

exports.beforeDestroy = async function(){await this.$root.updateNewsMsg()};