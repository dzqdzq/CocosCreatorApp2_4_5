module.exports = {deepQueryChildren:function(e,n,r){
  if (r) {
    (function e(n, r) {for(var o=n.children,d=o.length-1;d>=0;d--){
      var i=o[d];
      e(i,r);
      r(i);
    }})(e,r);
  }

  if (n&&r) {
    r(e);
  }
}};