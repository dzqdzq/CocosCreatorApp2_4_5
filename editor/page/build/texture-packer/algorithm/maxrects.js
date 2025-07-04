function t(t,e,i,h){
  this.x = t||0;
  this.y = e||0;
  this.width = i||0;
  this.height = h||0;
}
t.prototype = {constructor:t,clone:function(){return new t(this.x,this.y,this.width,this.height)}};
t.isContainedIn = function(t,e){return t.x>=e.x&&t.y>=e.y&&t.x+t.width<=e.x+e.width&&t.y+t.height<=e.y+e.height};
function e(t,e,i){
  this.binWidth = 0;
  this.binHeight = 0;
  this.allowRotate = false;
  this.usedRectangles = [];
  this.freeRectangles = [];
  this.init(t,e,i);
}

e.prototype = {constructor:e,init:function(e,i,h){
  this.binWidth = e;
  this.binHeight = i;
  this.allowRotate = h||false;
  this.usedRectangles.length = 0;
  this.freeRectangles.length = 0;
  this.freeRectangles.push(new t(0,0,e,i));
},insertRects:function(e,i){for(var h=[];e.length>0;){
  for(var a=1/0,n=1/0,o=-1,s=new t,l=0;l<e.length;l++){
    var r = {value:0};
    var u = {value:0};
    var v = this._scoreRectangle(e[l].width,e[l].height,i,r,u);

    if ((r.value<a || r.value===a&&u.value<n)) {
      a = r.value;
      n = u.value;
      s = v;
      o = l;
    }
  }if (-1===o) {
    return h;
  }this._placeRectangle(s);var d=e.splice(o,1)[0];
  d.x = s.x;
  d.y = s.y;

  if (d.width!==d.height&&d.width===s.height&&d.height===s.width) {
    d.rotated = !d.rotated;
  }

  h.push(d);
}return h},_placeRectangle:function(t){
  for (var e=0; e<this.freeRectangles.length; e++) {
    if (this._splitFreeNode(this.freeRectangles[e],t)) {
      this.freeRectangles.splice(e,1);
      e--;
    }
  }
  this._pruneFreeList();
  this.usedRectangles.push(t);
},_scoreRectangle:function(e,i,h,a,n){
  var o=new t;switch(a.value=1/0,n.value=1/0,h){case 0:o = this._findPositionForNewNodeBestShortSideFit(e,i,a,n);break;case 3:o = this._findPositionForNewNodeBottomLeft(e,i,a,n);break;case 4:
    o = this._findPositionForNewNodeContactPoint(e,i,a);
    a = -a;
    break;case 1:o = this._findPositionForNewNodeBestLongSideFit(e,i,n,a);break;case 2:o = this._findPositionForNewNodeBestAreaFit(e,i,a,n);break;case 5:o = this._findPositionForNewNodeLeftoverArea(e,i,a,n);}

  if (0===o.height) {
    a.value = 1/0;
    n.value = 1/0;
  }

  return o;
},_findPositionForNewNodeBottomLeft:function(e,i,h,a){
  var n;
  var o;
  var s = this.freeRectangles;
  var l = new t;
  h.value = 1/0;
  for (var r=0; r<s.length; r++) {
    if ((n=s[r]).width>=e&&n.height>=i&&((o=n.y+i)<h.value||o===h.value&&n.x<a.value)) {
      l.x = n.x;
      l.y = n.y;
      l.width = e;
      l.height = i;
      h.value = o;
      a.value = n.x;
    }

    if (this.allowRotate&&n.width>=i&&n.height>=e&&((o=n.y+e)<h.value||o===h.value&&n.x<a.value)) {
      l.x = n.x;
      l.y = n.y;
      l.width = i;
      l.height = e;
      h.value = o;
      a.value = n.x;
    }
  }return l
},_findPositionForNewNodeBestShortSideFit:function(e,i,h,a){
  var n;
  var o;
  var s;
  var l;
  var r;
  var u = this.freeRectangles;
  var v = new t;
  h.value = 1/0;
  for(var d=0;d<u.length;d++){
    var g;
    var w;
    var c;
    var f;

    if ((n=u[d]).width>=e&&n.height>=i) {
      o = Math.abs(n.width-e);
      s = Math.abs(n.height-i);
      l = Math.min(o,s);
      r = Math.max(o,s);

      if ((l<h.value || l===h.value&&r<a.value)) {
        v.x = n.x;
        v.y = n.y;
        v.width = e;
        v.height = i;
        h.value = l;
        a.value = r;
      }
    }

    if (this.allowRotate&&n.width>=i&&n.height>=e) {
      g = Math.abs(n.width-i);
      w = Math.abs(n.height-e);
      c = Math.min(g,w);
      f = Math.max(g,w);

      if ((c<h.value || c===h.value&&f<a.value)) {
        v.x = n.x;
        v.y = n.y;
        v.width = i;
        v.height = e;
        h.value = c;
        a.value = f;
      }
    }
  }return v
},_findPositionForNewNodeBestLongSideFit:function(e,i,h,a){
  var n;
  var o;
  var s;
  var l;
  var r;
  var u = this.freeRectangles;
  var v = new t;
  a.value = 1/0;
  for (var d=0; d<u.length; d++) {
    if ((n=u[d]).width>=e&&n.height>=i) {
      o = Math.abs(n.width-e);
      s = Math.abs(n.height-i);
      l = Math.min(o,s);

      if (((r=Math.max(o,s))<a.value || r===a.value&&l<h.value)) {
        v.x = n.x;
        v.y = n.y;
        v.width = e;
        v.height = i;
        h.value = l;
        a.value = r;
      }
    }

    if (this.allowRotate&&n.width>=i&&n.height>=e) {
      o = Math.abs(n.width-i);
      s = Math.abs(n.height-e);
      l = Math.min(o,s);

      if (((r=Math.max(o,s))<a.value || r===a.value&&l<h.value)) {
        v.x = n.x;
        v.y = n.y;
        v.width = i;
        v.height = e;
        h.value = l;
        a.value = r;
      }
    }
  }return v
},_findPositionForNewNodeBestAreaFit:function(e,i,h,a){
  var n;
  var o;
  var s;
  var l = this.freeRectangles;
  var r = new t;
  var u = e*i;
  h.value = 1/0;
  for(var v=0;v<l.length;v++){
    let t = l[v];
    let d = t.width*t.height-u;

    if (t.width>=e&&t.height>=i) {
      n = t.width-e;
      o = t.height-i;
      s = Math.min(n,o);

      if ((d<h.value || d===h.value&&s<a.value)) {
        r.x = t.x;
        r.y = t.y;
        r.width = e;
        r.height = i;
        a.value = s;
        h.value = d;
      }
    }

    if (this.allowRotate&&t.width>=i&&t.height>=e) {
      n = t.width-i;
      o = t.height-e;
      s = Math.min(n,o);

      if ((d<h.value || d===h.value&&s<a.value)) {
        r.x = t.x;
        r.y = t.y;
        r.width = i;
        r.height = e;
        a.value = s;
        h.value = d;
      }
    }
  }return r
},_findPositionForNewNodeLeftoverArea:function(e,i,h,a){
  var n;
  var o;
  var s;
  var l;
  var r;
  var u = this.freeRectangles;
  var v = new t;
  h.value = 0;
  a.value = 0;
  for (var d=0; d<u.length; d++) {
    r = (n=u[d]).width*n.height-e*i;

    if (n.width>=e&&n.height>=i) {
      o = Math.abs(n.width-e);
      s = Math.abs(n.height-i);
      l = Math.min(o,s);

      if ((r>h.value || r===h.value&&l>a.value)) {
        v.x = n.x;
        v.y = n.y;
        v.width = e;
        v.height = i;
        a.value = l;
        h.value = r;
      }
    }

    if (this.allowRotate&&n.width>=i&&n.height>=e) {
      o = Math.abs(n.width-i);
      s = Math.abs(n.height-e);
      l = Math.min(o,s);

      if ((r>h.value || r===h.value&&l>a.value)) {
        v.x = n.x;
        v.y = n.y;
        v.width = i;
        v.height = e;
        a.value = l;
        h.value = r;
      }
    }
  }
  h.value = this.binWidth*this.binHeight-h.value;
  a.value = Math.min(this.binWidth,this.binHeight)-a.value;
  return v;
},_commonIntervalLength:function(t,e,i,h){return e<i||h<t?0:Math.min(e,h)-Math.max(t,i)},_contactPointScoreNode:function(t,e,i,h){
  var a;
  var n = this.usedRectangles;
  var o = 0;

  if (!(0!==t && t+i!==this.binWidth)) {
    o += h;
  }

  if (!(0!==e && e+h!==this.binHeight)) {
    o += i;
  }

  for (var s=0; s<n.length; s++) {
    if (!((a=n[s]).x!==t+i && a.x+a.width!==t)) {
      o += this._commonIntervalLength(a.y,a.y+a.height,e,e+h);
    }

    if (!(a.y!==e+h && a.y+a.height!==e)) {
      o += this._commonIntervalLength(a.x,a.x+a.width,t,t+i);
    }
  }return o
},_findPositionForNewNodeContactPoint:function(e,i,h){
  var a;
  var n;
  var o = this.freeRectangles;
  var s = new t;
  h.value = -1;
  for (var l=0; l<o.length; l++) {
    if ((a=o[l]).width>=e&&a.height>=i&&(n=this._contactPointScoreNode(a.x,a.y,e,i))>h.value) {
      s.x = a.x;
      s.y = a.y;
      s.width = e;
      s.height = i;
      h = n;
    }

    if (this.allowRotate&&a.width>=i&&a.height>=e&&(n=this._contactPointScoreNode(a.x,a.y,i,e))>h.value) {
      s.x = a.x;
      s.y = a.y;
      s.width = i;
      s.height = e;
      h.value = n;
    }
  }return s
},_splitFreeNode:function(t,e){
  var i;
  var h = this.freeRectangles;
  return !(e.x>=t.x+t.width||e.x+e.width<=t.x||e.y>=t.y+t.height||e.y+e.height<=t.y)&&(e.y>t.y&&e.y<t.y+t.height&&((i=t.clone()).height=e.y-t.y,h.push(i)),e.y+e.height<t.y+t.height&&((i=t.clone()).y=e.y+e.height,i.height=t.y+t.height-i.y,h.push(i)),e.x>t.x&&e.x<t.x+t.width&&((i=t.clone()).width=e.x-t.x,h.push(i)),e.x+e.width<t.x+t.width&&((i=t.clone()).x=e.x+e.width,i.width=t.x+t.width-i.x,h.push(i)),true);
},_pruneFreeList:function(){for (var e=this.freeRectangles,i=0; i<e.length; i++) {
  for(var h=i+1;h<e.length;h++){
    if(t.isContainedIn(e[i],e[h])){
      e.splice(i,1);
      i--;
      break
    }

    if (t.isContainedIn(e[h],e[i])) {
      e.splice(h,1);
      h--;
    }
  }
}}};

e.heuristices = {BestShortSideFit:0,BestLongSideFit:1,BestAreaFit:2,BottomLeftRule:3,ContactPointRule:4,LeftoverArea:5};
module.exports = e;