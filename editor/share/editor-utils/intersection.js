"use strict";
var n = {};
function t(n, t, e, r) {
  var i = (r.x - e.x) * (n.y - e.y) - (r.y - e.y) * (n.x - e.x);
  var c = (t.x - n.x) * (n.y - e.y) - (t.y - n.y) * (n.x - e.x);
  var o = (r.y - e.y) * (t.x - n.x) - (r.x - e.x) * (t.y - n.y);
  if (0 !== o) {
    var x = i / o;
    var y = c / o;
    if (0 <= x && x <= 1 && 0 <= y && y <= 1) {
      return true;
    }
  }
  return false;
}
function e(n, e, r) {
  for (var i = r.points.length, c = 0; c < i; ++c) {
    if (t(n, e, r.points[c], r.points[(c + 1) % i])) {
      return true;
    }
  }
  return false;
}
n.lineLine = t;

n.lineRect = function (n, e, r) {
  var i = new cc.Vec2(r.x, r.y);
  var c = new cc.Vec2(r.x, r.yMax);
  var o = new cc.Vec2(r.xMax, r.yMax);
  var x = new cc.Vec2(r.xMax, r.y);
  return !!(t(n, e, i, c) || t(n, e, c, o) || t(n, e, o, x) || t(n, e, x, i));
};

n.linePolygon = e;

n.rectRect = function (n, t) {
  var e = n.x;
  var r = n.y;
  var i = n.x + n.width;
  var c = n.y + n.height;
  var o = t.x;
  var x = t.y;
  var y = t.x + t.width;
  var u = t.y + t.height;
  return e <= y && i >= o && r <= u && c >= x;
};

n.rectPolygon = function (n, t) {
  var r;
  var i = new cc.Vec2(n.x, n.y);
  var c = new cc.Vec2(n.x, n.yMax);
  var o = new cc.Vec2(n.xMax, n.yMax);
  var x = new cc.Vec2(n.xMax, n.y);
  if (e(i, c, t)) {
    return true;
  }
  if (e(c, o, t)) {
    return true;
  }
  if (e(o, x, t)) {
    return true;
  }
  if (e(x, i, t)) {
    return true;
  }
  for (r = 0; r < t.points.length; ++r) {
    if (n.contains(t.points[r])) {
      return true;
    }
  }
  return !!(t.contains(i) || t.contains(c) || t.contains(o) || t.contains(x));
};

n.polygonPolygon = function (n, t) {
    var r;
    for (r = 0; r < n.points.length; ++r) {
      if (e(n.points[r], n.points[(r + 1) % n.points.length], t)) {
        return true;
      }
    }
    for (r = 0; r < t.points.length; ++r) {
      if (n.contains(t.points[r])) {
        return true;
      }
    }
    for (r = 0; r < n.points.length; ++r) {
      if (t.contains(n.points[r])) {
        return true;
      }
    }
    return false;
  };

module.exports = n;
