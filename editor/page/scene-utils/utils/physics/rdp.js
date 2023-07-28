function t(t,r,e){
  var n;
  var a;
  var x;

  if (r.x===e.x) {
    n = Math.abs(t.x-r.x);
  } else {
    a = (e.y-r.y)/(e.x-r.x);
    x = r.y-a*r.x;
    n = Math.abs(a*t.x-t.y+x)/Math.sqrt(Math.pow(a,2)+1);
  }

  return n;
}module.exports = function r(e,n){
  var a = e[0];
  var x = e[e.length-1];
  if (e.length<3) {
    return e;
  }for(var h=-1,l=0,c=1;c<e.length-1;c++){
    var i=t(e[c],a,x);

    if (i>l) {
      l = i;
      h = c;
    }
  }if(l>n){
    var o = e.slice(0,h+1);
    var s = e.slice(h);
    var u = r(o,n);
    var f = r(s,n);
    return u.slice(0,u.length-1).concat(f)
  }return[a,x]
};