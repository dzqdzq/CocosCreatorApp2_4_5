"use strict";
let e = 24;
let t = [];
let n = [];

module.exports = {add:function(n){t.push(function(t){
  let n = t.message.split("\n");
  let r = (n=n.filter(e=>!!e))[0];
  let i = n.splice(1);
  let l = /(^ *at (\S+ )*)(\(*[^\:]+\:.*\d+\:\d+\)*)/;
  return {message:r,infos:i=i.map(e=>{let t=e.match(l);return{info:(t=t||["",e,void 0,""])[1]||"",path:t[3]||""}}),type:t.type,num:1,fold:true,height:e,bright:false};
}(n))},remove:function(e){
  let n=t.indexOf(e);

  if (-1!==n) {
    t.splice(n,1);
  }
},clear:function(e,n){if (n) {
  try{e = new RegExp(e);}catch(e){return}
} else {
  try{let t=e.split("\n");e = (t=t.filter(e=>!!e))[0];}catch(e){console.error(e)}
}for(let r=t.length-1;r>=0;r--){
  let i=t[r];

  if (n) {
    if (e.exec(i.message)) {
      t.splice(r,1);
    }
  } else {
    if (-1!==i.message.indexOf(e)) {
      t.splice(r,1);
    }
  }
}},query:function(e){
  let r=e.filter;if (e.regular) {
    try{r = new RegExp(r);}catch(e){r = /.*/;}
  }
  let i = t.filter(t=>!!t.message&&(!e.type||"all"===e.type||t.type===e.type)&&(e.regular?r.test(t.message):-1!==t.message.indexOf(r)));
  let l = null;
  let s = 0;

  (i=i.filter(t=>e.collapse&&l&&l.message===t.message&&l.infos.join(" ")===t.infos.join(" ")&&l.type===t.type?(l.num+=1,false):((l=t).num=1,true))).forEach((e,t)=>{
    s += e.height;
    e.bright = t%2==1;
  });

  e.start = "start"in e?e.start:0;
  e.end = "end"in e?e.end:i.length;
  n = i;
  return {height:s,total:i.length,list:i.filter((t,n)=>n>=e.start&&n<=e.end)};
},queryIndex:function(e){let t=0;for (let r=0; r<n.length; r++) {
  if ((t+=n[r].height)>e.height) {
    return r;
  }
}return 0},queryOffset:function(e){let t=0;for(let r=0;r<e;r++){let e=n[r];if (!e) {
  break;
}t += e.height;}return t},changeHeight:function(n){
  e = parseInt(n);

  t.forEach(t=>{
    t.fold = true;
    t.height = e;
  });
},messages:t};