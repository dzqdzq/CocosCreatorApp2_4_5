var t = cc.Class.Attr.DELIMETER;
var e = "A$$ETprops" + t + "A$$ETprops";
function r(t) {
  this.owner = t;
  this.watchingInfos = Object.create(null);
}
const s = Object.create(null);
function n(t) {
  return t instanceof cc.Asset && t._uuid
    ? t._uuid
    : "string" == typeof t && t
    ? Editor.Utils.UuidCache.urlToUuid(t)
    : "";
}
function a(t, e) {
  var r = (function (t, e) {
    for (; t; ) {
      var r = Object.getOwnPropertyDescriptor(t, e);
      if (r) {
        return { owner: t, pd: r };
      }
      t = Object.getPrototypeOf(t);
    }
    return null;
  })(t.prototype, e);
  if (!r) {
    console.warn(
      "Failed to get property descriptor of %s.%s",
      cc.js.getClassName(t),
      e
    );

    return;
  }
  var n = r.pd;
  if (false === n.configurable) {
    console.warn(
      "Failed to register notifier for %s.%s",
      cc.js.getClassName(t),
      e
    );

    return;
  }
  if ("value" in n) {
    console.warn(
      "Cannot watch instance variable of %s.%s",
      cc.js.getClassName(t),
      e
    );

    return;
  }
  var a = n.set;

  n.set = function (t, r) {
    a.call(this, t, r);
    if (
      (this._watcherHandle && this._watcherHandle !== s)
    ) {
      let t = this[e];
      this._watcherHandle.changeWatchAsset(e, t);
    }
  };

  Object.defineProperty(r.owner, e, n);
}
function i(t, e, r) {
  var s = cc.js.getPropertyDescriptor(t, e);
  if (s && s.set) {
    s.set.call(t, r, true);
  }
}

r.initComponent = function (t) {
  t._watcherHandle = null;
};

r.initHandle = function (n) {
  var i = cc.Class.Attr.getClassAttrs(n.constructor)[e];

  if (void 0 === i) {
    i = (function (e) {
        for (
          var r = null,
            s = e.constructor,
            n = cc.Class.Attr.getClassAttrs(s),
            i = 0,
            o = s.__props__;
          i < o.length;
          i++
        ) {
          var c = o[i];
          var l = c + t;
          if (n[l + "hasSetter"] && n[l + "hasGetter"]) {
            var u = e[c];

            if ((u instanceof cc.Asset || null == u)) {
              a(s, c);

              if (r) {
                r.push(c);
              } else {
                r = [c];
              }
            }
          }
        }
        return r;
      })(n);

    cc.Class.Attr.setClassAttr(n.constructor, "A$$ETprops", "A$$ETprops", i);
  }

  n._watcherHandle = i ? new r(n) : s;
};

r.start = function (t) {
  if (!t._watcherHandle) {
    r.initHandle(t);
  }

  if (t._watcherHandle !== s) {
    t._watcherHandle.start();
  }
};

r.stop = function (t) {
  if (t._watcherHandle && t._watcherHandle !== s) {
    t._watcherHandle.stop();
  }
};

r.prototype.start = function () {
    for (
      var t = this.owner,
        r = cc.Class.Attr.getClassAttrs(t.constructor)[e],
        s = 0;
      s < r.length;
      s++
    ) {
      var a = r[s];
      var i = t[a];
      if (Array.isArray(i)) {
        let t = (this.watchingInfos[a] = []);
        this._registerToArray(a, i, t);
      } else {
        var o = n(i);

        if (o) {
          this._register(a, o);
        }
      }
    }
  };

r.prototype.stop = function () {
    for (var t in this.watchingInfos) {
      var e = this.watchingInfos[t];

      if (e) {
        cc.assetManager.editorExtend.assetListener.off(e.uuid, e.callback);
      }
    }
    this.watchingInfos = Object.create(null);
  };

r.prototype._register = function (t, e) {
  var r = i.bind(null, this.owner, t);
  cc.assetManager.editorExtend.assetListener.on(e, r);
  this.watchingInfos[t] = { uuid: e, callback: r };
};

r.prototype._registerToArray = function (t, e, r) {
    var s = function (t, e, r, s) {
      let a = n(s);
      for (let t = 0; t < r.length; t++) {
        if (n(r[t]) === a) {
          r[t] = s;
        }
      }
      i(t, e, r);
    }.bind(null, this.owner, t, e);
    for (let t = 0; t < e.length; t++) {
      let a = n(e[t]);

      if (a) {
        cc.assetManager.editorExtend.assetListener.on(a, s);
        r.push({ uuid: a, callback: s });
      }
    }
  };

r.prototype.changeWatchAsset = function (t, e) {
    var r = this.watchingInfos[t];
    if (Array.isArray(r)) {
      for (let t = 0; t < r.length; t++) {
        cc.assetManager.editorExtend.assetListener.off(
          r[t].uuid,
          r[t].callback
        );
      }
      if (Array.isArray(e)) {
        r.length = 0;
        this._registerToArray(t, e, r);
      } else {
        let r = n(e);

        if (r) {
          this._register(t, r);
        }
      }
    } else {
      if (Array.isArray(e)) {
        if (r) {
          cc.assetManager.editorExtend.assetListener.off(r.uuid, r.callback);
        }

        this.watchingInfos[t] = r = [];
        this._registerToArray(t, e, r);
      } else {
        let s = n(e);
        if (r) {
          if (r.uuid === s) {
            return;
          }
          this.watchingInfos[t] = null;
          cc.assetManager.editorExtend.assetListener.off(r.uuid, r.callback);
        }

        if (s) {
          this._register(t, s);
        }
      }
    }
  };

module.exports = r;
