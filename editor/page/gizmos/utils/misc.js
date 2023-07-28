"use strict";
const e = require("./external").NodeUtils;
var n = {};
module.exports = n;

n.addMoveHandles = function (e, n, t) {
  var l;
  var o;

  if (2 === arguments.length) {
    t = n;
    n = {};
  }

  var r = n.cursor || "default";
  var u = n.ignoreWhenHoverOther || false;

  var i = function (n) {
    n.stopPropagation();
    if ((cc.director.getScene())) {
      var r = n.clientX - l;
      var u = n.clientY - o;

      if (t.update) {
        t.update.call(e, r, u, n);
      }
    }
  }.bind(e);

  var d = function (n) {
    document.removeEventListener("mousemove", i);
    document.removeEventListener("mouseup", d);
    Editor.UI.removeDragGhost();
    window.getSelection().removeAllRanges();

    if (t.end) {
      t.end.call(e, n);
    }

    n.stopPropagation();
  }.bind(e);

  e.on("mousedown", function (n) {
    if (u) {
      var c = Editor.Selection.curSelection("node");
      var a = Editor.Selection.hovering("node");
      if (-1 === c.indexOf(a)) {
        return;
      }
    }

    if (1 === n.which) {
      l = n.clientX;
      o = n.clientY;
      Editor.UI.addDragGhost(r);
      document.addEventListener("mousemove", i);
      document.addEventListener("mouseup", d);

      if (t.start) {
        t.start.call(e, n.offsetX, n.offsetY, n);
      }
    }

    n.stopPropagation();
  });
};

n.snapPixel = function (e) {
    return Math.floor(e) + 0.5;
  };

n.snapPixelWihVec2 = function (e) {
  e.x = n.snapPixel(e.x);
  e.y = n.snapPixel(e.y);
  return e;
};

n.getCenter = function (e) {
    let t = n.getCenterWorldPos(e);
    return cc.director.getScene().convertToNodeSpace(t);
  };

n.getCenterWorldPos = function (n) {
  for (var t = null, l = null, o = null, r = null, u = 0; u < n.length; ++u) {
    for (var i, d = n[u], c = e.getWorldOrientedBounds(d), a = 0; a < c.length; ++a) {
      i = c[a];

      if ((null === t || i.x < t)) {
        t = i.x;
      }

      if ((null === o || i.x > o)) {
        o = i.x;
      }

      if ((null === l || i.y < l)) {
        l = i.y;
      }

      if ((null === r || i.y > r)) {
        r = i.y;
      }
    }
    i = e.getWorldPosition3D(d);

    if ((!t || i.x < t)) {
      t = i.x;
    }

    if ((!o || i.x > o)) {
      o = i.x;
    }

    if ((!l || i.y < l)) {
      l = i.y;
    }

    if ((!r || i.y > r)) {
      r = i.y;
    }
  }
  var s = 0.5 * (t + o);
  var v = 0.5 * (l + r);
  return cc.v2(s, v);
};

n.getCenterWorldPos3D = function (n) {
  for (
    var t = null, l = null, o = null, r = null, u = null, i = null, d = 0;
    d < n.length;
    ++d
  ) {
    for (var c, a = n[d], s = e.getWorldOrientedBounds(a), v = 0; v < s.length; ++v) {
      c = s[v];

      if ((null === t || c.x < t)) {
        t = c.x;
      }

      if ((null === r || c.x > r)) {
        r = c.x;
      }

      if ((null === l || c.y < l)) {
        l = c.y;
      }

      if ((null === u || c.y > u)) {
        u = c.y;
      }

      if ((null === o || c.z < o)) {
        o = c.z;
      }

      if ((null === i || c.z > i)) {
        i = c.z;
      }
    }
    c = e.getWorldPosition3D(a);

    if ((null === t || c.x < t)) {
      t = c.x;
    }

    if ((null === r || c.x > r)) {
      r = c.x;
    }

    if ((null === l || c.y < l)) {
      l = c.y;
    }

    if ((null === u || c.y > u)) {
      u = c.y;
    }

    if ((null === o || c.z < o)) {
      o = c.z;
    }

    if ((null === i || c.z > i)) {
      i = c.z;
    }
  }
  var x = 0.5 * (t + r);
  var g = 0.5 * (l + u);
  var f = 0.5 * (o + i);
  return cc.v3(x, g, f);
};
