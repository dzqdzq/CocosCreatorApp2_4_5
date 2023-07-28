const e=Editor.require("unpack://engine-dev/cocos2d/core/physics/CCPolygonSeparator");function t(e,t){
  if (0===e.width&&0===e.height) {
    return t(null,[cc.v2(-50,-50),cc.v2(50,-50),cc.v2(50,50),cc.v2(-50,50)]);
  }
  var r = -e.anchorX*e.width;
  var i = -e.anchorY*e.height;
  var o = r+e.width;
  var h = i+e.height;
  t(null,[cc.v2(r,i),cc.v2(r,h),cc.v2(o,h),cc.v2(o,i)])
}function r(r,i,o){
  var h=r.getComponent(cc.Sprite);if (!h) {
    return t(r,o);
  }var n=h.spriteFrame;if (!n) {
    return t(r,o);
  }var c=n._texture&&n._texture.nativeUrl;if (!c) {
    return t(r,o);
  }
  var u = require("./marching-squares");
  var d = require("./rdp");
  var a = require(Editor.url("app://editor/share/sharp"));
  var g = n.getRect();
  let l = g.width;
  let s = g.height;
  let v = n.isRotated();

  if (v) {
    l = g.height;
    s = g.width;
  }

  a(c).extract({left:g.x,top:g.y,width:l,height:s}).rotate(v?90:0).raw().toBuffer((t,h)=>{
    if (t) {
      return o(t);
    }var n=u.getBlobOutlinePoints(h,g.width,g.height,i.loop);

    if ((n=d(n,i.threshold)).length>0&&n[0].equals(n[n.length-1])) {
      n.length -= 1;
    }

    n.forEach(e=>{
      e.y = g.height-e.y;
      e.x *= r.width/g.width;
      e.y *= r.height/g.height;
      e.x -= r.anchorX*r.width;
      e.y -= r.anchorY*r.height;
    });

    e.ForceCounterClockWise(n);

    if (o) {
      o(null,n);
    }
  });
}module.exports = {getContourPoints:r,resetPoints:function(e,t){r(e.node,t,(t,r)=>{
  if (t) {
    return Editor.error(t);
  }
  _Scene.Undo.recordNode(e.node.uuid);
  e.points = r;
  _Scene.Undo.commit();
})}};