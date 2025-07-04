var e = function (e, i, t, o, f, r, l) {
    if (0 !== o.width && 0 !== o.height) {
      for (var d = o.x,
             n = o.xMax,
             a = o.y,
             h = o.yMax,
             c = 4 * t,
             p = 0,
             g = f.length,
             x = 0,
             y = 0,
             u = 0,
             s = 0,
             m = a * c + 4 * d,
             b = a,
             v = 0;
           b < h;
           ++b, m += c)
      {
        for (s = m, v = d; v < n; ++v, s += 4) {
          if (0 === i[s + 3]) {
            for (p = 0; p < g; p++) {
              x = v + f[p];
              y = b + r[p];
              if (
                (x >= d && x < n && y >= a && y < h && i[(u = s + l[p]) + 3] > 0)
              ) {
                e[s] = i[u];
                e[s + 1] = i[u + 1];
                e[s + 2] = i[u + 2];
                break;
              }
            }
          }
        }
      }
    }
  };

var i = function (e, i, t, o, f) {
  if (0 !== f.width && 0 !== f.height) {
    var r = f.y;
    var l = f.yMax - 1;
    var d = f.x;
    var n = f.xMax - 1;
    var a = 4 * t;
    var h = 4 * d;
    var c = 4 * n;
    var p = r * a;
    var g = l * a;
    var x = 0;
    var y = 0;
    if (r - 1 >= 0) {
      for (x = p + h, y = p + c + 3; x <= y; ++x) {
        e[x - a] = i[x];
      }
    }
    if (l + 1 < o) {
      for (x = g + h, y = g + c + 3; x <= y; ++x) {
        e[x + a] = i[x];
      }
    }
    if (d - 1 >= 0) {
      for (x = p + h, y = g + h; x <= y; x += a) {
        e[x - 4] = i[x];
        e[x - 3] = i[x + 1];
        e[x - 2] = i[x + 2];
        e[x - 1] = i[x + 3];
      }
    }
    if (n + 1 < t) {
      for (x = p + c, y = g + c; x <= y; x += a) {
        e[x + 4] = i[x];
        e[x + 5] = i[x + 1];
        e[x + 6] = i[x + 2];
        e[x + 7] = i[x + 3];
      }
    }
    if (d - 1 >= 0 && r - 1 >= 0) {
      for (y = (x = p + h) + 4; x < y; x++) {
        e[x - a - 4] = i[x];
      }
    }
    if (n + 1 < t && r - 1 >= 0) {
      for (y = (x = p + c) + 4; x < y; x++) {
        e[x - a + 4] = i[x];
      }
    }
    if (d - 1 >= 0 && l + 1 < o) {
      for (y = (x = g + h) + 4; x < y; x++) {
        e[x + a - 4] = i[x];
      }
    }
    if (n + 1 < t && l + 1 < o) {
      for (y = (x = g + c) + 4; x < y; x++) {
        e[x + a + 4] = i[x];
      }
    }
  }
};

module.exports = {
  applyBleed: function (t, o, f, r) {
    var l = 0;
    var d = null;
    if (t.contourBleed) {
      console.time("apply contour bleed");
      for (var n = 4 * o.width,
             a = [-1, 0, 1, -1, 1, -1, 0, 1],
             h = [-1, -1, -1, 0, 0, 1, 1, 1],
             c = [],
             p = 0;
           p < a.length;
           p++)
      {
        c[p] = 4 * a[p] + h[p] * n;
      }
      for (l = 0, d = null; l < o.files.length; l++) {
        d = o.files[l].trim;

        e(
          r,
          f,
          o.width,
          cc.rect(d.x, d.y, d.rotatedWidth, d.rotatedHeight),
          a,
          h,
          c
        );
      }
      console.timeEnd("apply contour bleed");
    }
    if (t.paddingBleed) {
      for (console.time("apply padding bleed"), l = 0, d = null; l < o.files.length; l++) {
        d = o.files[l].trim;

        i(
          r,
          f,
          o.width,
          o.height,
          cc.rect(d.x, d.y, d.rotatedWidth, d.rotatedHeight)
        );
      }
      console.timeEnd("apply padding bleed");
    }
  },
};
