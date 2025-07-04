"use strict";
exports.equalArray = function(e,t){return e.length===t.length&&e.every(e=>-1!==t.indexOf(e))};

exports.forEachCurve = function(e,t){
  if (e) {
    Object.keys(e.props).forEach(r=>{let n=e.props[r];t(null,r,n)});
    Object.keys(e.comps).forEach(r=>{let n=e.comps[r];Object.keys(n).forEach(e=>{let o=n[e];t(r,e,o)})});
  }
};

exports.packKey = function(e,t,r,n,o,c){return{id:e,path:t,component:r,property:n,frame:o,value:c}};

exports.indexOf = function(e,t){let r=Object.keys(t);for(let n=0;n<e.length;n++){let o=e[n];if (r.every(e=>o[e]===t[e])) {
  return n
}}return-1};