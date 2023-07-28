"use strict";
const o = require("chroma-js");
const t = require("../utils").addMoveHandles;
var e={};
module.exports = e;

e.scaleSlider = function(e,r,l,n){
  var i = e.group();
  var c = i.line(0,0,r,0).stroke({width:1,color:l});
  var a = i.polygon([[r,5],[r,-5],[r+10,-5],[r+10,5]]).fill({color:l}).stroke({width:1,color:l});
  var s = false;
  i.style("pointer-events","bounding-box");

  i.resize = function(o){
    c.plot(0,0,o,0);
    a.plot([[o,5],[o,-5],[o+10,-5],[o+10,5]]);
  };

  i.on("mouseover",function(t){
    var e=o(l).brighter().hex();
    c.stroke({color:e});
    a.fill({color:e}).stroke({width:1,color:e});
  });

  i.on("mouseout",function(o){
    o.stopPropagation();

    if (!s) {
      c.stroke({color:l});
      a.fill({color:l}).stroke({width:1,color:l});
    }
  });

  t(i,{start:function(o,t,e){
    s = true;
    c.stroke({color:"#ff0"});
    a.fill({color:"#ff0"}).stroke({width:1,color:"#ff0"});

    if (n.start) {
      n.start.call(i,o,t,e);
    }
  },update:function(o,t,e){
    if (n.update) {
      n.update.call(i,o,t,e);
    }
  },end:function(o){
    s = false;
    c.stroke({color:l});
    a.fill({color:l}).stroke({width:1,color:l});

    if (n.end) {
      n.end.call(i,o);
    }
  }});

  return i;
};

e.freemoveTool = function(e,r,l,n){
  var i = false;
  var c = e.circle(r,r).move(.5*-r,.5*-r).fill({color:l,opacity:.6}).stroke({width:2,color:l});
  c.on("mouseover",function(t){var e=o(l).brighter().hex();this.fill({color:e}).stroke({color:e})});

  c.on("mouseout",function(o){
    o.stopPropagation();

    if (!i) {
      this.fill({color:l}).stroke({color:l});
    }
  });

  t(c,{start:function(o,t,e){
    i = true;
    this.fill({color:"#cc5"}).stroke({color:"#cc5"});

    if (n.start) {
      n.start.call(c,o,t,e);
    }
  },update:function(o,t,e){
    if (n.update) {
      n.update.call(c,o,t,e);
    }
  },end:function(o){
    i = false;
    this.fill({color:l}).stroke({color:l});

    if (n.end) {
      n.end.call(c,o);
    }
  }});

  return c;
};

e.arrowTool = function(e,r,l,n){
  var i = e.group();
  var c = i.line(0,0,r,0).stroke({width:1,color:l});
  var a = i.polygon([[r,5],[r,-5],[r+15,0]]).fill({color:l}).stroke({width:1,color:l});
  var s = false;
  i.style("pointer-events","bounding-box");

  i.on("mouseover",function(t){
    var e=o(l).brighter().hex();
    c.stroke({color:e});
    a.fill({color:e}).stroke({width:1,color:e});
  });

  i.on("mouseout",function(o){
    o.stopPropagation();

    if (!s) {
      c.stroke({color:l});
      a.fill({color:l}).stroke({width:1,color:l});
    }
  });

  t(i,{start:function(o,t,e){
    s = true;
    c.stroke({color:"#ff0"});
    a.fill({color:"#ff0"}).stroke({width:1,color:"#ff0"});

    if (n.start) {
      n.start.call(i,o,t,e);
    }
  },update:function(o,t,e){
    if (n.update) {
      n.update.call(i,o,t,e);
    }
  },end:function(o){
    s = false;
    c.stroke({color:l});
    a.fill({color:l}).stroke({width:1,color:l});

    if (n.end) {
      n.end.call(i,o);
    }
  }});

  return i;
};

e.positionTool = function(r,l){
  var n;
  var i;
  var c;
  var a = r.group();
  a.position = cc.v2(0,0);
  a.rotation = 0;

  (n=e.arrowTool(r,80,"#f00",{start:function(o,t,e){
    if (l.start) {
      l.start.call(a,o,t,e);
    }
  },update:function(o,t,e){
    var r = Editor.Math.deg2rad(a.rotation);
    var n = Math.cos(r);
    var i = Math.sin(r);
    var c = Math.sqrt(o*o+t*t);
    var s = Math.atan2(i,n)-Math.atan2(t,o);
    c *= Math.cos(s);

    if (l.update) {
      l.update.call(a,n*c,i*c,e);
    }
  },end:function(o){
    if (l.end) {
      l.end.call(a,o);
    }
  }})).translate(20,0);

  a.add(n);

  (i=e.arrowTool(r,80,"#5c5",{start:function(o,t,e){
    if (l.start) {
      l.start.call(a,o,t,e);
    }
  },update:function(o,t,e){
    var r = Editor.Math.deg2rad(a.rotation+90);
    var n = Math.cos(r);
    var i = Math.sin(r);
    var c = Math.sqrt(o*o+t*t);
    var s = Math.atan2(i,n)-Math.atan2(t,o);
    c *= Math.cos(s);

    if (l.update) {
      l.update.call(a,n*c,i*c,e);
    }
  },end:function(o){
    if (l.end) {
      l.end.call(a,o);
    }
  }})).translate(0,-20);

  i.rotate(-90,0,0);
  a.add(i);
  var s=false;
  (c=a.rect(20,20).move(0,-20).fill({color:"#05f",opacity:.4}).stroke({width:1,color:"#05f"})).on("mouseover",function(t){var e=o("#05f").brighter().hex();this.fill({color:e}).stroke({color:e})});

  c.on("mouseout",function(o){
    o.stopPropagation();

    if (!s) {
      this.fill({color:"#05f"}).stroke({color:"#05f"});
    }
  });

  t(c,{start:function(o,t,e){
    s = true;
    this.fill({color:"#cc5"}).stroke({color:"#cc5"});

    if (l.start) {
      l.start.call(a,o,t,e);
    }
  },update:function(o,t,e){
    if (l.update) {
      l.update.call(a,o,t,e);
    }
  },end:function(o){
    s = false;
    this.fill({color:"#05f"}).stroke({color:"#05f"});

    if (l.end) {
      l.end.call(a,o);
    }
  }});

  return a;
};

e.rotationTool = function(e,r){
  var l;
  var n;
  var i;
  var c;
  var a;
  var s = e.group();
  var u = false;
  var f = "#f00";
  s.position = new cc.Vec2(0,0);
  s.rotation = 0;
  l = s.path("M50,-10 A50,50, 0 1,0 50,10").fill("none").stroke({width:2,color:f});
  (c=s.path().fill({color:f,opacity:.4}).stroke({width:1,color:f})).hide();
  var d;
  var h;
  n = s.line(0,0,50,0).stroke({width:1,color:f});
  i = s.polygon([[50,5],[50,-5],[65,0]]).fill({color:f}).stroke({width:1,color:f});
  a = s.text("0").plain("").fill({color:"white"}).font({anchor:"middle"}).hide().translate(30,0);
  s.style("pointer-events","visibleFill");

  s.on("mouseover",function(t){
    var e=o(f).brighter().hex();
    l.fill({color:e,opacity:.1}).stroke({color:e});
    n.stroke({color:e});
    i.fill({color:e}).stroke({width:1,color:e});
  });

  s.on("mouseout",function(o){
    o.stopPropagation();

    if (!u) {
      l.fill({color:"none"}).stroke({color:f});
      n.stroke({color:f});
      i.fill({color:f}).stroke({width:1,color:f});
    }
  });

  t(s,{start:function(o,t,e){
    u = true;
    l.fill({color:"none"}).stroke({color:"#cc5"});
    n.stroke({color:"#cc5"});
    i.fill({color:"#cc5"}).stroke({width:1,color:"#cc5"});
    c.show();
    c.plot("M40,0 A40,40, 0 0,1 40,0 L0,0 Z");
    a.plain("0°");
    a.rotate(0,-30,0);
    a.show();
    d = o-s.position.x;
    h = t-s.position.y;

    if (r.start) {
      r.start.call(s,o,t,e);
    }
  },update:function(o,t,e){
    var l = new cc.Vec2(d,h);
    var n = new cc.Vec2(d+o,h+t);
    var i = l.magSqr();
    var u = n.magSqr();
    if(i>0&&u>0){
      var f = l.dot(n);
      var p = -l.cross(n);
      var y = Math.sign(p)*Math.acos(f/Math.sqrt(i*u));
      var x = Math.cos(y);
      var k = Math.sin(y);
      var g = Editor.Math.rad2deg(y);
      a.rotate(g,-30,0);

      if (y>0) {
        c.plot("M40,0 A40,40, 0 0,1 "+40*x+","+40*k+" L0,0");
        a.plain("+"+g.toFixed(0)+"°");
      } else {
        c.plot("M40,0 A40,40, 0 0,0 "+40*x+","+40*k+" L0,0");
        a.plain(g.toFixed(0)+"°");
      }
    }var v=Math.atan2(l.y,l.x)-Math.atan2(n.y,n.x);

    if (r.update) {
      r.update.call(s,Editor.Math.rad2deg(v),e);
    }
  },end:function(o){
    u = false;
    l.stroke({color:f});
    n.stroke({color:f});
    i.fill({color:f}).stroke({width:1,color:f});
    c.hide();
    a.hide();

    if (r.end) {
      r.end.call(s,o);
    }
  }});

  return s;
};

e.scaleTool = function(r,l){
  var n;
  var i;
  var c;
  var a = r.group();
  a.position = new cc.Vec2(0,0);
  a.rotation = 0;

  n = e.scaleSlider(r,100,"#f00",{start:function(o,t,e){
    if (l.start) {
      l.start.call(a,o,t,e);
    }
  },update:function(o,t,e){
    var r = a.rotation*Math.PI/180;
    var i = Math.cos(r);
    var c = Math.sin(r);
    var s = Math.sqrt(o*o+t*t);
    var u = Math.atan2(c,i)-Math.atan2(t,o);
    s *= Math.cos(u);
    n.resize(s+100);

    if (l.update) {
      l.update.call(a,s/100,0,e);
    }
  },end:function(o){
    n.resize(100);

    if (l.end) {
      l.end.call(a,o);
    }
  }});

  a.add(n);

  (i=e.scaleSlider(r,100,"#5c5",{start:function(o,t,e){
    if (l.start) {
      l.start.call(a,o,t,e);
    }
  },update:function(o,t,e){
    var r = (a.rotation+90)*Math.PI/180;
    var n = Math.cos(r);
    var c = Math.sin(r);
    var s = Math.sqrt(o*o+t*t);
    var u = Math.atan2(c,n)-Math.atan2(t,o);
    s *= Math.cos(u);
    i.resize(-1*s+100);

    if (l.update) {
      l.update.call(a,0,s/100,e);
    }
  },end:function(o){
    i.resize(100);

    if (l.end) {
      l.end.call(a,o);
    }
  }})).rotate(-90,0,0);

  a.add(i);
  var s=false;
  (c=a.rect(20,20).move(-10,-10).fill({color:"#aaa",opacity:.4}).stroke({width:1,color:"#aaa"})).on("mouseover",function(t){var e=o("#aaa").brighter().hex();this.fill({color:e}).stroke({color:e})});

  c.on("mouseout",function(o){
    o.stopPropagation();

    if (!s) {
      this.fill({color:"#aaa"}).stroke({color:"#aaa"});
    }
  });

  t(c,{start:function(o,t,e){
    s = true;
    this.fill({color:"#cc5"}).stroke({color:"#cc5"});

    if (l.start) {
      l.start.call(a,o,t,e);
    }
  },update:function(o,t,e){
    var r = Math.sqrt(o*o+t*t);
    var c = Math.atan2(-1,1)-Math.atan2(t,o);
    r *= Math.cos(c);
    n.resize(r+100);
    i.resize(r+100);

    if (l.update) {
      l.update.call(a,1*r/100,-1*r/100,e);
    }
  },end:function(o){
    s = false;
    this.fill({color:"#aaa"}).stroke({color:"#aaa"});
    n.resize(100);
    i.resize(100);

    if (l.end) {
      l.end.call(a,o);
    }
  }});

  return a;
};

e.circleTool = function(e,r,l,n,i,c){
  if ("string"!=typeof i) {
    c = i;
    i = "default";
  }

  let a;
  let s = e.group().style("cursor",i).fill(l||"none").stroke(n||"none");
  let u = s.circle().radius(r/2);

  if (n) {
    a = s.circle().stroke({width:8}).fill("none").style("stroke-opacity",0).radius(r/2);
  }

  let f=false;
  s.style("pointer-events","bounding-box");
  s.on("mouseover",function(){if(l){let t=o(l.color).brighter().hex();s.fill({color:t})}if(n){let t=o(n.color).brighter().hex();s.stroke({color:t})}});

  s.on("mouseout",function(o){
    o.stopPropagation();

    if (!f) {
      if (l) {
        s.fill(l);
      }

      if (n) {
        s.stroke(n);
      }
    }
  });

  t(s,{cursor:i},{start:function(t,e,r){
    f = true;
    if(l){let t=o(l.color).brighter().brighter().hex();s.fill({color:t})}if(n){let t=o(n.color).brighter().brighter().hex();s.stroke({color:t})}

    if (c.start) {
      c.start(t,e,r);
    }
  },update:function(o,t,e){
    if (c.update) {
      c.update(o,t,e);
    }
  },end:function(o){
    f = false;

    if (l) {
      s.fill(l);
    }

    if (n) {
      s.stroke(n);
    }

    if (c.end) {
      c.end(o);
    }
  }});

  s.radius = function(o){
    u.radius(o);

    if (a) {
      a.radius(o);
    }

    return this;
  };

  s.cx = function(o){return this.x(o)};
  s.cy = function(o){return this.y(o)};
  return s;
};

e.lineTool = function(e,r,l,n,i,c){
  var a = e.group().style("cursor",i).stroke({color:n});
  var s = a.line(r.x,r.y,l.x,l.y).style("stroke-width",1);
  var u = a.line(r.x,r.y,l.x,l.y).style("stroke-width",8).style("stroke-opacity",0);
  var f = false;
  a.on("mouseover",function(t){var e=o(n).brighter().hex();a.stroke({color:e})});

  a.on("mouseout",function(o){
    o.stopPropagation();

    if (!f) {
      a.stroke({color:n});
    }
  });

  t(a,{cursor:i},{start:function(t,e,r){
    f = true;
    var l=o(n).brighter().brighter().hex();
    a.stroke({color:l});

    if (c.start) {
      c.start(t,e,r);
    }
  },update:function(o,t,e){
    if (c.update) {
      c.update(o,t,e);
    }
  },end:function(o){
    f = false;
    a.stroke({color:n});

    if (c.end) {
      c.end(o);
    }
  }});

  a.plot = function(){
    s.plot.apply(s,arguments);
    u.plot.apply(u,arguments);
    return this;
  };

  return a;
};

e.positionLineTool = function(o,t,e,r,l,n){
  var i = o.group();
  var c = i.line(t.x,e.y,e.x,e.y).stroke({width:1,color:l});
  var a = i.line(e.x,t.y,e.x,e.y).stroke({width:1,color:l});
  var s = i.text(""+r.x).fill(n);
  var u = i.text(""+r.y).fill(n);
  let f=function(o){let t=o.offset(0,0).in(o.sourceAlpha).gaussianBlur(1);o.blend(o.source,t)};
  s.filter(f);
  u.filter(f);
  i.style("stroke-dasharray","5 5");
  i.style("stroke-opacity",.8);

  i.plot = function(o,t,e){
    c.plot.call(a,o.x,t.y,t.x,t.y);
    a.plot.call(c,t.x,o.y,t.x,t.y);
    s.text(""+Math.floor(e.x)).move(o.x+(t.x-o.x)/2,t.y);
    u.text(""+Math.floor(e.y)).move(t.x,o.y+(t.y-o.y)/2);
    return this;
  };

  return i;
};

var r={None:0,LeftBottom:1,LeftTop:2,RightTop:3,RightBottom:4,Left:5,Right:6,Top:7,Bottom:8,Center:9,Anchor:10};

e.rectTool = function(o,l){
  var n;
  var i;
  var c;
  var a;
  var s;
  var u;
  var f;
  var d;
  var h;
  var p;
  var y;
  var x;
  var k;
  var g;
  var v;
  var M = o.group();
  var w = M.group();
  function m(o){return {start:function(t,e,r){
    M.type = o;

    if (l.start) {
      l.start.call(M,t,e,r,o);
    }
  },update:function(t,e,r){
    if (l.update) {
      l.update.call(M,t,e,r,o);
    }
  },end:function(t){
    M.type = r.None;

    if (l.end) {
      l.end.call(M,t,o);
    }
  }};}
  M.type = r.None;
  (h=M.polygon("0,0,0,0,0,0").fill("none").stroke("none")).style("pointer-events","fill");
  h.ignoreMouseMove = true;
  t(h,{ignoreWhenHoverOther:true},m(r.Center));
  function b(o,t){return e.lineTool(w,cc.v2(0,0),cc.v2(0,0),"#8c8c8c",t,m(o))}
  v = e.circleTool(M,20,{color:"#eee",opacity:.3},{color:"#eee",opacity:.5,width:2},m(r.Center));
  s = b(r.Left,"col-resize");
  u = b(r.Top,"row-resize");
  f = b(r.Right,"col-resize");
  d = b(r.Bottom,"row-resize");
  var T=8;function z(o,t){return e.circleTool(w,T,{color:"#0e6dde"},null,t,m(o)).style("cursor",t)}
  n = z(r.LeftBottom,"nwse-resize");
  i = z(r.LeftTop,"nesw-resize");
  c = z(r.RightTop,"nwse-resize");
  a = z(r.RightBottom,"nesw-resize");
  y = e.positionLineTool(M,cc.v2(0,0),cc.v2(0,0),cc.v2(0,0),"#8c8c8c","#eee");
  p = e.circleTool(M,10,null,{width:3,color:"#0e6dde"},m(r.Anchor)).style("cursor","pointer");
  x = M.group();
  k = x.text("0").fill("#eee");
  g = x.text("0").fill("#eee");
  let L=function(o){let t=o.offset(0,0).in(o.sourceAlpha).gaussianBlur(1);o.blend(o.source,t)};
  k.filter(L);
  g.filter(L);

  M.setBounds = function(o){
    if (Math.abs(o[2].x-o[0].x)<10&&Math.abs(o[2].y-o[0].y)<10) {
      w.hide();
      p.hide();
      v.show();
      v.center(o[0].x+(o[2].x-o[0].x)/2,o[0].y+(o[2].y-o[0].y)/2);
    } else {
      w.show();
      v.hide();
      h.plot([[o[0].x,o[0].y],[o[1].x,o[1].y],[o[2].x,o[2].y],[o[3].x,o[3].y]]);
      s.plot(o[0].x,o[0].y,o[1].x,o[1].y);
      u.plot(o[1].x,o[1].y,o[2].x,o[2].y);
      f.plot(o[2].x,o[2].y,o[3].x,o[3].y);
      d.plot(o[3].x,o[3].y,o[0].x,o[0].y);
      n.center(o[0].x,o[0].y);
      i.center(o[1].x,o[1].y);
      c.center(o[2].x,o[2].y);
      a.center(o[3].x,o[3].y);

      if (o.anchor) {
        p.show();
        p.center(o.anchor.x,o.anchor.y);
      } else {
        p.hide();
      }
    }

    if (!o.origin||M.type!==r.Center&&M.type!==r.Anchor) {
      y.hide();
    } else {
      y.show();
      y.plot(o.origin,o.anchor,o.localPosition);
    }

    if (o.localSize&&M.type>=r.LeftBottom&&M.type<=r.Bottom) {
      x.show();
      k.text(""+Math.floor(o.localSize.width));
      g.text(""+Math.floor(o.localSize.height));
      k.center(o[1].x+(o[2].x-o[1].x)/2,o[1].y+(o[2].y-o[1].y)/2+5);
      g.center(o[2].x+(o[3].x-o[2].x)/2+15,o[2].y+(o[3].y-o[2].y)/2);
    } else {
      x.hide();
    }
  };

  return M;
};

e.rectTool.Type = r;

e.icon = function(o,t,e,r){
  var l=o.image(t).move(.5*-e,.5*-r).size(e,r);
  l.on("mouseover",function(o){o.stopPropagation()});
  return l;
};

e.dashLength = function(o){
  let t=_Scene.view.scale;

  if (t<1) {
    t = 1;
  }

  return "number"==typeof o?o*t:Array.isArray(o)?o.map(o=>o*t):3*t;
};