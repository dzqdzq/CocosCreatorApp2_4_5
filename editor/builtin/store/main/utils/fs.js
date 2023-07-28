"use strict";
const e = require("fire-fs");
const r = require("fire-path");
const n = require("async");
const t = require("compressing");

exports.remove = function(t,i){e.readdir(t,function(o,c){if (o) {
  return i(o);
}n.eachSeries(c,function(n,i){
  var o = r.join(t,n);
  var c = e.statSync(o);
  setTimeout(function(){
    if (c.isDirectory()) {
      exports.remove(o,function(r){
        if (r) {
          i(r);
        } else {
          e.remove(o,i);
        }
      });
    } else {
      e.remove(o,i);
    }
  },20)
},function(r){setTimeout(function(){
  if (r) {
    i(r);
  } else {
    e.remove(t,i);
  }
},20)})})};

exports.copy = function(r,n,t){
  try{e.copySync(r,n)}catch(e){
    if (t) {
      t(e);
    }

    return;
  }

  if (t) {
    t(null);
  }
};

exports.unzip = function(e,r,n){t.zip.uncompress(e,r).then(()=>n()).catch(e=>n(e))};