var t = cc.Asset;
var e = cc.Class.Attr;
var r = e.DELIMETER + "serializable";
var s = cc.js._getClassId;
function o(t) {
  this.root = t;
}
function n(t, e, r) {
  o.call(this, t);
  this.iteratee = e;
  this.parsedObjects = [];
  this.parsedKeys = [];
  this.walked = new Set();
  this.walked.add(t);
  this.ignoreParent = r && r.ignoreParent;
  if (this.ignoreParent) {
    if (this.root instanceof cc.Component) {
      this.ignoreParent = this.root.node;
    } else {
      if (!(this.root instanceof cc._BaseNode)) {
        return cc.error("can only ignore parent of scene node");
      }
      this.ignoreParent = this.root;
    }
  }
  this.parseObject(t);
}
o.prototype.walk = null;

o.prototype.parseObject = function (e) {
    if (Array.isArray(e)) {
      this.forEach(e);
    } else {
      var r = e.constructor;
      if ((e instanceof t || (r !== Object && !s(e, false))) && e !== this.root) {
        return;
      }
      var o = r && r.__props__;

      if (o) {
        this.parseCCClass(e, r, o);
      } else {
        this.forIn(e);
      }
    }
  };

o.prototype.parseCCClass = function (t, s, o) {
    for (var n = e.getClassAttrs(s), i = 0; i < o.length; i++) {
      var a = o[i];

      if (false !== n[a + r]) {
        this.walk(t, a, t[a]);
      }
    }
  };

o.prototype.forIn = function (t) {
    for (var e in t) if (!(!t.hasOwnProperty(e) || (95 === e.charCodeAt(0) && 95 === e.charCodeAt(1)))) {
      this.walk(t, e, t[e]);
    }
  };

o.prototype.forEach = function (t) {
    for (var e = 0, r = t.length; e < r; ++e) {
      this.walk(t, "" + e, t[e]);
    }
  };

cc.js.extend(n, o);

n.prototype.walk = function (t, e, r) {
    if (r && "object" == typeof r) {
      if (this.walked.has(r)) {
        return;
      }
      if (this.ignoreParent) {
        if (r instanceof cc._BaseNode) {
          if (!r.isChildOf(this.ignoreParent)) {
            return;
          }
        } else {
          if (r instanceof cc.Component &&
          !r.node.isChildOf(this.ignoreParent)) {
            return;
          }
        }
      }
      this.walked.add(r);
      this.iteratee(t, e, r, this.parsedObjects, this.parsedKeys);
      this.parsedObjects.push(t);
      this.parsedKeys.push(e);
      this.parseObject(r);
      this.parsedObjects.pop();
      this.parsedKeys.pop();
    }
  };

var i = new o(null);
function a(t, e) {
  i.root = null;
  i.walk = e;
  i.parseObject(t);
}
i.walk = null;

module.exports = {
    walk: function (t, e) {
      new n(t, e);
    },
    walkProperties: function (t, e, r) {
      var s = r && r.dontSkipNull;
      new n(
        t,
        function (t, r, o, n) {
          if (!(!o || "object" != typeof o)) {
            n.push(t);

            a(o, function (t, r, o) {
              if ("object" == typeof o && (s || o)) {
                e(t, r, o, n);
              }
            });

            n.pop();
          }
        },
        r
      );
    },
    getNextProperty: function (t, e, r) {
      var s;
      var o = t.lastIndexOf(r);
      if (o === t.length - 1) {
        s = e;
      } else {
        if (!(0 <= o && o < t.length - 1)) {
          return "";
        }
        s = t[o + 1];
      }
      var n = "";

      a(r, function (t, e, r) {
        if (r === s) {
          n = e;
        }
      });

      return n;
    },
    ObjectWalkerBehavior: o,
  };
