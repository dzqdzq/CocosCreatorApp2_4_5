"use strict";
const e = require("fs");
const t = require("path");
const i = require("../lib/resource");
const n = require("../lib/info");
t.join(Editor.Project.path,"temp","android-instant-games","profiles");
let r = null;
let u = null;
let s = {};
let l = null;
let f = [];
let o = [];

let d = function(i){
  let n = t.join(i,"timeline.json");
  let r = [];
  if(e.existsSync(n)){let t=e.readFileSync(n,"utf-8");try{r = JSON.parse(t);}catch(e){console.warn(e)}}return r
};

let c = function(e){
  let t = d(e);
  let i = t[0];
  return t[t.length-1].ts-i.ts
};

let a = function(){
  if (!r) {
    return[];
  }let e=f.filter(e=>{if (-1===r.indexOf(e)) {
    return e
  }});

  e = e.concat(o.filter(e=>{if (-1===r.indexOf(e)) {
    return e
  }}));

  return r.concat(e);
};

module.exports = {queryRecordMs:c,queryRecordScreenshots:function(e){let i=d(e);return i=(i=i.filter(e=>!!e.screenshot)).map(i=>t.join(e,i.screenshot))},queryRecordResources:async function(e,t){
  let n = l;
  let d = c(e);
  let h = n[0].ts+Math.round(d*t);
  r = [];
  u = [];
  for(let e=0;e<n.length;e++){let t=n[e];if (t.items) {
    for(let e=0;e<t.items.length;e++){let n=t.items[e];if(n.uuid){
      let e=await i.queryAssetInfo(n.uuid);if (!e) {
        continue;
      }
      s[e.uuid] = e;

      if (-1!==o.indexOf(e)) {
        e.selected = true;
      }

      if (-1!==f.indexOf(e)) {
        e.selected = false;
      }

      if (t.ts>h) {
        u.push(e);
      } else {
        r.push(e);
      }
    }}
  }}return a()
},querySelectedResource:a,queryLastResource:function(){
  if (!u) {
    return[];
  }

  let e = f.filter(e=>{if (-1===u.indexOf(e)) {
    return e
  }});

  let t = u.filter(e=>{if (-1===o.indexOf(e)) {
    return e
  }});

  return e.concat(t)
},moveToRemoveList:function(e){
  if (!r) {
    return;
  }let t=r.find(t=>t.uuid===e);

  if (t&&-1===f.indexOf(t)) {
    f.push(t);
  }

  let i=o.find(t=>t.uuid===e);

  if (i) {
    o.splice(o.indexOf(i),1);
  }

  if (i&&-1===f.indexOf(i)) {
    f.push(i);
  }
},moveToAddList:function(e){
  if (!u) {
    return;
  }let t=f.find(t=>t.uuid===e);

  if (t) {
    t.selected = true;
    f.splice(f.indexOf(t),1);

    if (-1===o.indexOf(t)) {
      o.push(t);
    }
  }

  let i=u.find(t=>t.uuid===e);

  if (i) {
    i.selected = true;

    if (-1===o.indexOf(i)) {
      o.push(i);
    }
  }
},addManualItem:function(e){let t="fail";do{
  if(s[e.uuid]){t = "exist";break}
  s[e.uuid] = e;

  if (-1!==f.indexOf(e)) {
    f.splice(f.indexOf(e),1);
  }

  if (-1===o.indexOf(e)) {
    o.push(e);
  }

  t = "success";
}while(0);return t},loadData:async function(e){
  let t=n.readJson(e);
  l = d(e);
  o.length = 0;
  f.length = 0;
  for(let e in s)delete s[e];for(let e=0;e<t.addList.length;e++){
    let n = t.addList[e];
    let r = await i.queryAssetInfo(n);
    r.selected = true;
    o.push(r);
  }if (t.removeList) {
    for(let e=0;e<t.removeList.length;e++){
      let n = t.removeList[e];
      let r = await i.queryAssetInfo(n);
      r.selected = false;
      f.push(r);
    }
  }
},removeList:f,addList:o};