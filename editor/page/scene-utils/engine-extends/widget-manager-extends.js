cc._widgetManager.updateOffsetsToStayPut = function (t, e) {
  function i(t, e) {
    return Math.abs(t - e) > 1e-10 ? e : t;
  }
  var a = t.node;
  var o = a._parent;
  if (o) {
    var r = cc.Vec2.ZERO;
    var h = cc.Vec2.ONE;

    if (t._target) {
      o = t._target;
      this._computeInverseTransForTarget(a, o, r, h);
    }

    var g = o._anchorPoint;
    var s = this._getReadonlyNodeSize(o);
    var c = a.getAnchorPoint();
    var n = cc.v2();
    a.getPosition(n);
    var l = cc._widgetManager._AlignFlags;

    if (void 0 === e) {
      e = t._alignFlags;
    }

    if ((e & l.LEFT)) {
      var v = -g.x * s.width;
      v += r.x;
      v *= h.x;
      var y = n.x - c.x * a.width * a.scaleX - v;

      if (!t.isAbsoluteLeft) {
        y /= s.width;
      }

      y /= h.x;
      t.left = i(t.left, y);
    }
    if (e & l.RIGHT) {
      var d = (1 - g.x) * s.width;
      d += r.x;
      var f = (d *= h.x) - (n.x + (1 - c.x) * a.width * a.scaleX);

      if (!t.isAbsoluteRight) {
        f /= s.width;
      }

      f /= h.x;
      t.right = i(t.right, f);
    }
    if (e & l.TOP) {
      var x = (1 - g.y) * s.height;
      x += r.y;
      var u = (x *= h.y) - (n.y + (1 - c.y) * a.height * a.scaleY);

      if (!t.isAbsoluteTop) {
        u /= s.height;
      }

      u /= h.y;
      t.top = i(t.top, u);
    }
    if (e & l.BOT) {
      var _ = -g.y * s.height;
      _ += r.y;
      _ *= h.y;
      var w = n.y - c.y * a.height * a.scaleY - _;

      if (!t.isAbsoluteBottom) {
        w /= s.height;
      }

      w /= h.y;
      t.bottom = i(t.bottom, w);
    }
  }
};
