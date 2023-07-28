const e = require("./utils");
const t = Editor.require("scene://utils/node");

module.exports = {getIntersectionList(i,n){
  var o = cc.engine.getInstanceById(cc.engine.editingRootNode);
  var c = true;

  if (!o) {
    c = false;
    o = cc.director.getScene();
  }

  var r = [];
  var d = new cc.Vec2;
  var l = new cc.Vec2;
  var s = new cc.Vec2;
  var u = new cc.Vec2;
  var a = new Editor.Utils.Polygon([d,l,s,u]);
  var f = new cc.Rect;
  var g = new cc.Rect;
  var v = cc.mat4();
  function h(e,t){if(t._getLocalBounds){
    var o=f;
    t._getLocalBounds(o);
    if (o.width<=0||o.height<=0) {
      return null;
    }
    e.getWorldMatrix(v);
    cc.engine.obbApplyMatrix(o,v,d,l,s,u);
    var c=g;
    Editor.Math.calculateMaxRect(c,d,l,s,u);
    if (n) {
      return i.containsRect(c)?{aabb:c}:null;
    }if (i.intersects(c)&&Editor.Utils.Intersection.rectPolygon(i,a)) {
      return{aabb:c,obb:a}
    }
  }return t.gizmo&&t.gizmo.rectHitTest(i,n)?{}:null}

  e.deepQueryChildren(o,c,function(e){if(e.activeInHierarchy&&!e.getComponent(cc.Canvas)){var o=function(e,o){if (0===o.width||0===o.height) {
    return null;
  }var c=t.getWorldBounds(e,o);if (n) {
    return i.containsRect(c)?{aabb:c}:null;
  }if(i.intersects(c)){
    var r = t.getWorldOrientedBounds(e,o);
    var d = new Editor.Utils.Polygon(r);
    if (Editor.Utils.Intersection.rectPolygon(i,d)) {
      return{aabb:c,obb:d}
    }
  }return null}(e,e.getContentSize());if (o) {
    o.node = e;
    r.push(o);
    return;
  }for(var c=e._components,d=0,l=c.length;d<l;d++){var s=c[d];if(s.enabled&&(o=h(e,s))){
    o.node = e;
    r.push(o);
    break
  }}}});

  return r;
},hitTest(e,i){
  let n;
  let o = _Scene.view.pixelToWorld(cc.v2(e,i));
  let c = Number.MAX_VALUE;

  this.getIntersectionList(new cc.Rect(o.x,o.y,1,1)).forEach(e=>{
    let i=e.node;if (!i) {
      return;
    }
    let r = e.aabb||t.getWorldBounds(i);
    let d = o.sub(r.center).magSqr();
    if(d-c<-1e-6&&!(i._objFlags&(cc.Object.Flags.LockedInEditor|cc.Object.Flags.HideInHierarchy))){
      let e=i;for(;e;){if (e._objFlags&cc.Object.Flags.LockedInEditor) {
        return;
      }e = e.parent;}
      c = d;
      n = i;
    }
  });

  return n;
},rectHitTest(e,t,i,n){
  let o = _Scene.view.pixelToWorld(cc.v2(e,t));
  let c = _Scene.view.pixelToWorld(cc.v2(e+i,t+n));
  let r = cc.Rect.fromMinMax(o,c);
  let d = [];

  this.getIntersectionList(r,true).forEach(e=>{let t=e.node;if (!t||t._objFlags&cc.Object.Flags.LockedInEditor||t instanceof cc.PrivateNode) {
    return;
  }let i=t;for(;i;){if (i._objFlags&cc.Object.Flags.LockedInEditor) {
    return;
  }i = i.parent;}d.push(t)});

  return d;
},onMouseDown(e){if(1===e.which){
  var t = false;
  var i = Editor.Selection.curSelection("node");

  if ((e.metaKey || e.ctrlKey)) {
    t = true;
  }

  var n = e.offsetX;
  var o = e.offsetY;
  Editor.UI.startDrag("default",e,function(e,c,r,d,l){if(!(d*d+l*l<4)){
    var s = n;
    var u = o;

    if (d<0) {
      s += d;
      d = -d;
    }

    if (l<0) {
      u += l;
      l = -l;
    }

    _Scene.view.$gizmosView.updateSelectRect(s,u,d,l);
    var a;
    var f;
    var g = this.rectHitTest(s,u,d,l);
    if (t) {
      for (f=i.slice(),a=0; a<g.length; ++a) {
        if (-1===f.indexOf(g[a].uuid)) {
          f.push(g[a].uuid);
        }
      }
    } else {
      for (f=[],a=0; a<g.length; ++a) {
        f.push(g[a].uuid);
      }
    }Editor.Selection.select("node",f,true,false)
  }}.bind(this),function(e,c,r,d,l){if (d*d+l*l>=4) {
    Editor.Selection.confirm();
    _Scene.view.$gizmosView.fadeoutSelectRect();
    return;
  }var s=this.hitTest(n,o);return s?t?(-1===i.indexOf(s.uuid)?Editor.Selection.select("node",s.uuid,false,true):Editor.Selection.unselect("node",s.uuid,true),void 0):(Editor.Selection.select("node",s.uuid,true,true),void 0):(Editor.Selection.clear("node"),void 0);}.bind(this))
}},onMouseMove(e){
  var t=this.hitTest(e.offsetX,e.offsetY);

  if (t) {
    Editor.Selection.hover("node",t.uuid);
  }
},onMouseLeave(e){Editor.Selection.hover("node",null)}};