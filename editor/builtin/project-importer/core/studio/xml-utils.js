"use strict";function r(r){return 3===r.nodeType||8===r.nodeType||4===r.nodeType}function e(r,e,n,o){
  var u=r;

  if (o) {
    u = t(r,o);
  }

  if(u){var i=u.getAttribute(e);return i||n}return n
}function t(e,t){if (!e) {
  return null;
}for(var n=e.childNodes,o=0,u=n.length;o<u;o++){var i=n[o];if (!r(i)&&i.nodeName===t) {
  return i
}}return null}module.exports = {shouldIgnoreNode:r,getPropertyOfNode:e,getIntPropertyOfNode:function(r,t,n,o){
  var u=e(r,t,n,o);

  if ("string"==typeof u&&u.constructor===String) {
    u = parseInt(u);
  }

  return u;
},getFloatPropertyOfNode:function(r,t,n,o){
  var u=e(r,t,n,o);

  if ("string"==typeof u&&u.constructor===String) {
    u = parseFloat(u);
  }

  return u;
},getBoolPropertyOfNode:function(r,t,n,o){var u=e(r,t,n,o);return"string"==typeof u&&u.constructor===String?"true"===u.toLowerCase():u},getFirstChildNodeByName:t,getChildNodesByName:function(e,t){var n=[];if (!e) {
  return n;
}for(var o=e.childNodes,u=0,i=o.length;u<i;u++){
  var d=o[u];

  if (!(r(d) || d.nodeName!==t)) {
    n.push(d);
  }
}return n},getAllChildren:function(e){var t=[];if (!e) {
  return t;
}for(var n=e.childNodes,o=0,u=n.length;o<u;o++){
  var i=n[o];

  if (!r(i)) {
    t.push(i);
  }
}return t}};