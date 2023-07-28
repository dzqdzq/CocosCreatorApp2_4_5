"use strict";
const e = Editor.require("scene://utils/node");
var n = {};
module.exports = n;

n.addMoveHandles = function (e, n, t) {
  var o;
  var l;

  if (2 === arguments.length) {
    t = n;
    n = {};
  }

  var r = n.cursor || "default";
  var u = n.ignoreWhenHoverOther || false;

  var i = function (n) {
    n.stopPropagation();
    if (
      ("undefined" == typeof _Scene || cc.director.getScene())
    ) {
      var r = n.clientX - o;
      var u = n.clientY - l;

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
      var s = Editor.Selection.hovering("node");
      if (-1 === c.indexOf(s)) {
        return;
      }
    }

    if (1 === n.which) {
      o = n.clientX;
      l = n.clientY;
      Editor.UI.addDragGhost(r);
      document.addEventListener("mousemove", i);
      document.addEventListener("mouseup", d);

      if (t.start) {
        t.start.call(e, n.offsetX, n.offsetY, n);
      }
    }

    if (3 !== n.which) {
      n.stopPropagation();
    }
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
  for (var t = null, o = null, l = null, r = null, u = 0; u < n.length; ++u) {
    for (var i, d = n[u], c = e.getWorldOrientedBounds(d), s = 0; s < c.length; ++s) {
      i = c[s];

      if ((null === t || i.x < t)) {
        t = i.x;
      }

      if ((null === l || i.x > l)) {
        l = i.x;
      }

      if ((null === o || i.y < o)) {
        o = i.y;
      }

      if ((null === r || i.y > r)) {
        r = i.y;
      }
    }
    i = e.getWorldPosition3D(d);

    if ((!t || i.x < t)) {
      t = i.x;
    }

    if ((!l || i.x > l)) {
      l = i.x;
    }

    if ((!o || i.y < o)) {
      o = i.y;
    }

    if ((!r || i.y > r)) {
      r = i.y;
    }
  }
  var a = 0.5 * (t + l);
  var g = 0.5 * (o + r);
  return cc.v2(a, g);
};

n.getCenterWorldPos3D = function (e) {
    return n.getWorldBounds3D(e).center;
  };

n.getWorldBounds3D = function (n) {
  for (
    var t = null, o = null, l = null, r = null, u = null, i = null, d = 0;
    d < n.length;
    ++d
  ) {
    for (var c, s = n[d], a = e.getWorldOrientedBounds(s), g = 0; g < a.length; ++g) {
      c = a[g];

      if ((null === t || c.x < t)) {
        t = c.x;
      }

      if ((null === r || c.x > r)) {
        r = c.x;
      }

      if ((null === o || c.y < o)) {
        o = c.y;
      }

      if ((null === u || c.y > u)) {
        u = c.y;
      }

      if ((null === l || c.z < l)) {
        l = c.z;
      }

      if ((null === i || c.z > i)) {
        i = c.z;
      }
    }
    c = e.getWorldPosition3D(s);

    if ((null === t || c.x < t)) {
      t = c.x;
    }

    if ((null === r || c.x > r)) {
      r = c.x;
    }

    if ((null === o || c.y < o)) {
      o = c.y;
    }

    if ((null === u || c.y > u)) {
      u = c.y;
    }

    if ((null === l || c.z < l)) {
      l = c.z;
    }

    if ((null === i || c.z > i)) {
      i = c.z;
    }
  }
  var v = 0.5 * (t + r);
  var f = 0.5 * (o + u);
  var x = 0.5 * (l + i);
  return new cc.geomUtils.Aabb(v, f, x, r - t, u - o, i - l);
};

n.getRecursiveNodes = function (e, t) {
    for (let o = 0; o < e.length; o++) {
      if (e[o].active) {
        t.push(e[o]);
        n.getRecursiveNodes(e[o].children, t);
      }
    }
  };

n.getRecursiveWorldBounds3D = function (e) {
  let t = [];
  n.getRecursiveNodes(e, t);
  return n.getWorldBounds3D(t);
};
