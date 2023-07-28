var n=function(){
  var n={};
  window.requestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame;
  0;

  if (window.requestAnimationFrame) {
    n.requestAnimationFrame = function(n){return window.requestAnimationFrame(n)};
  } else {
    n.requestAnimationFrame = function(n){return window.setTimeout(n,1e3/60)};
  }

  window.cancelAnimationFrame = window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame;

  if (window.cancelAnimationFrame) {
    n.cancelAnimationFrame = function(n){window.cancelAnimationFrame(n)};
  } else {
    n.cancelAnimationFrame = function(n){window.clearTimeout(n)};
  }

  if (window.performance&&window.performance.now) {
    n.now = function(){return window.performance.now()/1e3};
  } else {
    n.now = function(){return Date.now()/1e3};
  }

  return n;
}();module.exports = n;