function t(t) {
  this.points = t;

  if (this.points.length < 3) {
    console.warn("Invalid polygon, the data must contains 3 or more points.");
  }
}

t.prototype.intersects = function (t) {
  return Editor.Utils.Intersection.polygonPolygon(this, t);
};

t.prototype.contains = function (t) {
    for (
      var n = false, i = t.x, o = t.y, s = this.points.length, e = 0, r = s - 1;
      e < s;
      r = e++
    ) {
      var p = this.points[e].x;
      var h = this.points[e].y;
      var c = this.points[r].x;
      var l = this.points[r].y;

      if (h > o != l > o && i < ((c - p) * (o - h)) / (l - h) + p) {
        n = !n;
      }
    }
    return n;
  };

Object.defineProperty(t.prototype, "center", {
  get: function () {
    if (this.points.length < 3) {
      return null;
    }
    for (
      var t = this.points[0].x,
        n = this.points[0].y,
        i = this.points[0].x,
        o = this.points[0].y,
        s = 1;
      s < this.points.length;
      ++s
    ) {
      var e = this.points[s].x;
      var r = this.points[s].y;

      if (e < t) {
        t = e;
      } else {
        if (e > i) {
          i = e;
        }
      }

      if (r < n) {
        n = r;
      } else {
        if (r > o) {
          o = r;
        }
      }
    }
    return new cc.Vec2(0.5 * (i + t), 0.5 * (o + n));
  },
});

module.exports = t;
