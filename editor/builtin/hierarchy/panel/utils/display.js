"use strict";const e=require("./cache");let t=e.queryNodes();e.queryCache();function n(n){
  let r = 1;
  let o = n;
  for (; o.parent&&!o.next; ) {
    o = e.queryNode(o.parent);
  }if (o&&o.next)
    {r = e.queryNode(o.next).showIndex-n.showIndex;} else {
    for(let e=t.length-1;e>=0;e--){let o=t[e];if(o.show){r = o.showIndex-n.showIndex+1;break}}
  }return r
}

exports.point = function(n){let r=null;for(let o=t.length-1;o>=0;o--){let l=t[o];if(l.show){
  let o=20*l.showIndex+19;

  if (n<0) {
    n = 0;
    r = t[0];
  } else {
    if (n>o) {
      n = o;
      r = e.getRootNodeByTargetNode(l);
    }
  }

  break
}}let o=n/20|0;if (!r&&t.length>0) {
  for(let e=o;e<t.length;e++){let n=t[e];if(n.showIndex===o){r = n;break}}
}return{y:n,node:r,remaining:n-20*o}};

exports.info = function(t){let r=e.queryNode(t);return r?{length:n(r),slength:function(t){
  let r = 0;
  let o = e.queryNode(t.prev);
  for (; o; ) {
    r += n(o);
    o = e.queryNode(o.prev);
  }return r
}(r)}:null;};