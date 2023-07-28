"use strict";
let e = cc.v2;
let t = Editor.GizmosUtils.addMoveHandles;

module.exports = {SegmentTool:function(o,n,l){
  let r=o.group();
  r.segment = n;
  r.curveTools = [];
  let s = r.group();
  let c = n.pos;
  let i = n.inControl;
  let u = n.outControl;
  function d(e){return e.fill({color:"#fff"}).stroke({color:"#000"})}
  let f = s.line(c.x,c.y,i.x,i.y).stroke({color:"#eee",width:1});
  let a = s.line(c.x,c.y,u.x,u.y).stroke({color:"#eee",width:1});
  let y = r.rect(5,5).style("cursor","move");
  y.center(c.x,c.y);let p=d(s.circle(8,8)).style("cursor","move");p.center(i.x,i.y);let h=d(s.circle(8,8)).style("cursor","move");
  h.center(u.x,u.y);

  r.select = function(){
    if (l.beforeSelected) {
      l.beforeSelected(r);
    }

    d(y);

    if (!n.keyframe) {
      s.show();
    }
  };

  r.unselect = function(){
    y.fill({color:"#4793e2"});

    if (!n.keyframe) {
      s.hide();
    }
  };

  let m=r.show;

  r.show = function(){
    let e=n.pos;
    y.width(10);
    y.height(10);
    y.center(e.x,e.y);
    y.stroke({color:"#000"});

    if (!n.keyframe) {
      m.call(r);
    }
  };

  let x=r.hide;

  r.hide = function(){
    let e=n.pos;
    y.width(5);
    y.height(5);
    y.center(e.x,e.y);
    y.stroke("none");

    if (!n.keyframe) {
      x.call(r);
    }
  };

  s.hide();
  r.unselect();
  r.hide();

  r.plot = function(){
    let e = n.pos;
    let t = n.inControl;
    let o = n.outControl;
    y.center(e.x,e.y);
    f.plot(e.x,e.y,t.x,t.y);
    p.center(t.x,t.y);
    a.plot(e.x,e.y,o.x,o.y);
    h.center(o.x,o.y);
  };

  let g=null;function k(t){return {start:function(){
    r.select();
    g = n.clone();

    if (l.start) {
      l.start(r,t);
    }
  },update:function(o,s){
    if (0===o&&0===s) {
      return;
    }let c=e(o,s);
    n[t] = g[t].add(c);

    if ("pos"===t) {
      n.inControl = g.inControl.add(c);
      n.outControl = g.outControl.add(c);
    }

    r.plot();

    if (l.update) {
      l.update(r,t,o,s);
    }
  },end:function(){
    if (l.end) {
      l.end(r,t);
    }
  }};}function C(e){
    e.stopPropagation();

    if (!n.keyframe&&l.onDelete) {
      l.onDelete(r);
    }
  }
  t(y,k("pos"));
  t(p,k("inControl"));
  t(h,k("outControl"));
  r.node.tabIndex = -1;
  let w=Mousetrap(r.node);
  w.bind("command+backspace",C);
  w.bind("del",C);
  return r;
},CurveTool:function(e,t,o){
  let n=e.group();function l(){
    let e=_Scene.view.scale;

    if (e<1) {
      e = 1;
    }

    return 3*e;
  }
  n.segmentTools = [];
  let r = n.path(t).fill("none").stroke({color:"#4793e2",width:5});
  let s = n.path(t).fill("none").stroke({color:"#4793e2",width:1}).style("stroke-dasharray",l());

  n.select = function(){
    if (o.beforeSelected) {
      o.beforeSelected(n);
    }

    n.segmentTools.forEach(function(e){e.show()});
    r.style("stroke-opacity",1).style("cursor","copy");
    n._selected = true;
  };

  n.unselect = function(){
    n.segmentTools.forEach(function(e){
      e.unselect();
      e.hide();
    });

    r.style("stroke-opacity",0).style("cursor","default");
    n._selected = false;
  };

  n.on("mouseover",function(){
    if (!n._selected) {
      r.style("stroke-opacity",.5);
    }
  });

  n.on("mouseout",function(){
    if (!n._selected) {
      r.style("stroke-opacity",0);
    }
  });

  n.on("mousedown",function(e){
    e.stopPropagation();

    if (n._selected) {
      if (o.addSegment) {
        o.addSegment(e.offsetX,e.offsetY);
      }
    } else {
      n.select();
    }
  });

  n.plot = function(){
    let e=n.segmentTools;if (!e[e.length-1].segment.keyframe) {
      return;
    }let t="";for(let o=0,n=e.length;o<n;o++){
      let n = e[o].segment;
      let l = n.pos;
      if(0===o){t = `M ${l.x} ${l.y}`;continue}
      let r = e[o-1].segment.outControl;
      let s = n.inControl;
      t += ` C ${r.x} ${r.y} ${s.x} ${s.y} ${l.x} ${l.y}`;
    }
    r.plot(t);
    s.plot(t).style("stroke-dasharray",l());
  };

  n.unselect();
  return n;
}};