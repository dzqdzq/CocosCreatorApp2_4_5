"use strict";
const e = require("electron").protocol;
const r = require("fire-url");
const t = require("fire-fs");
const o = require("querystring");
function i(e){let r=e.hostname;return Editor.assetdb.uuidToFspath(r)}function d(e){return Editor.assetdb._fspath(e.href)}let s=e.registerFileProtocol("uuid",(e,t)=>{let o=decodeURIComponent(e.url);t({path:i(r.parse(o))})});

if (s) {
  Editor.success("protocol uuid registerred");
} else {
  Editor.failed("Failed to register protocol uuid");
}

Editor.Protocol.register("uuid",i);

if ((s = e.registerFileProtocol("db",(e,r)=>{r({path:d(decodeURIComponent(e.url))})}))) {
  Editor.success("protocol db registerred");
} else {
  Editor.failed("Failed to register protocol uuid");
}

Editor.Protocol.register("db",d);

if ((s = e.registerBufferProtocol("thumbnail",(e,d)=>{
  let s = decodeURIComponent(e.url);
  let u = r.parse(s);
  let a = i(u);
  if (!t.existsSync(a)) {
    d(-6);
    return;
  }
  let l;
  let n = parseInt(u.query)||32;
  l = Editor.dev?"sharp":Editor.url("unpack://utils/sharp");
  const c=require(l);var p=/\.jpg$/.test(a);

  if (p) {
    c.cache(false);
  }

  let h = c(a);
  let f = o.parse(u.query);
  if(f){
    let e=function(e){return e&&void 0!==e.x&&void 0!==e.y&&void 0!==e.w&&void 0!==e.h?{left:parseInt(e.x),top:parseInt(e.y),width:parseInt(e.w),height:parseInt(e.h)}:null}(f);

    if (e) {
      h.extract(e);
    }

    if (f.rotate) {
      h.rotate(parseInt(f.rotate));
    }
  }h.resize({width:n,height:n,background:{r:255,g:255,b:255,alpha:0}}).toFormat(c.format.png).toBuffer((e,r)=>{
    if (p) {
      c.cache(true);
    }

    if (e) {
      d(-6);
      return;
    }d({mimeType:"image/png",data:r})
  })
}))) {
  Editor.success("protocol thumbnail registerred");
} else {
  Editor.failed("Failed to register protocol thumbnail");
}