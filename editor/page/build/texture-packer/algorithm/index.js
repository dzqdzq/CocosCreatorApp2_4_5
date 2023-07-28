const e = require("max-rects-packing");
const t = require("./maxrects");
function i(e){return e.map(e=>({width:e.width,height:e.height,origin:e}))}function r(e,i,r,n,c,a){
  let h = new t(i,r,c).insertRects(e,n);
  let l = 0;
  let o = 0;
  let s = 0;
  let d = 0;
  for(let e=0;e<h.length;e++){
    let t=h[e];
    l += t.width*t.height;
    let i = t.x+(t.rotated?t.height:t.width);
    let r = t.y+(t.rotated?t.width:t.height);

    if (i>s) {
      s = i;
    }

    if (r>d) {
      d = r;
    }
  }let f=l/(o=s*d);

  if ((l>a.packedArea || f>a.score&&l>=a.packedArea)) {
    a.packedRects = h;
    a.unpackedRects = e;
    a.score = f;
    a.packedArea = l;
    a.binWidth = i;
    a.binHeight = r;
    a.heuristice = n;
  }
}function n(e,t,n,c,a){for (let h=0; h<=5; h++) {
  if (4!==h) {
    r(i(e),t,n,h,c,a);
  }
}}

module.exports = {ipacker(t,r,n,c){
  let a = new e.Packer(r,n,{allowRotate:c});
  let h = i(t);
  return a.fit(h).rects.map(e=>Object.assign(e.origin,e.fitInfo))
},MaxRects(e,t,i,r){
  let c=0;for (let t=0; t<e.length; t++) {
    c += e[t].width*e[t].height;
  }let a={packedRects:[],unpackedRects:[],score:-1/0,packedArea:-1/0};if (c<t*i) {let h=4;for(let l=h;l<=t;l=Math.min(2*l,t)){for(let t=h;t<=i;t=Math.min(2*t,i)){let h=l*t;if(h>=c){let i=c;for(;;){
    let c=Math.pow(i,.5);

    if (c<=l&&c<=t) {
      n(e,c,c,r,a);
    }

    n(e,i/t,t,r,a);
    n(e,l,i/l,r,a);
    let o=a.unpackedRects;if(o.length>0){let e=0;for (let t=0; t<o.length; t++) {
      e += o[t].width*o[t].height;
    }i += e/2;}if (i>=h||0===o.length) {
      break
    }
  }}if (t>=i) {
    break
  }}if (l>=t) {
    break
  }}} else {
    n(e,t,i,r,a);
  }
  console.log(`Best heuristice: ${a.heuristice}`);
  return function(e){return e.map(e=>{let t=e.origin;for (let i in e) if ("origin"!==i) {
    t[i] = e[i];
  }return t});}(a.packedRects);
}};