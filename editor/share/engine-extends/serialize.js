var compressUuid = require("../editor-utils/uuid-utils").compressUuid;
var i = cc.Object;
var r = cc.Asset;
var t = cc._BaseNode;
var s = cc.Node;
var n = cc.Component;
const {
  PersistentMask: a,
  DontSave: _,
  DontDestroy: o,
  EditorOnly: l,
} = i.Flags;

var f = (
    CC_TEST
      ? cc._Test.IntantiateJit
      : Editor.require(
          "unpack://engine-dev/cocos2d/core/platform/instantiate-jit"
        )
  ).equalsToDefault;

var u = require("./serialize-nicify");

var c = ["_objFlags", "_parent", "_prefab"].concat(
  "_name",
  "_active",
  "_trs",
  "_eulerAngles",
  "_localZOrder"
);

function d(e, r) {
  r = r || {};
  this._exporting = r.exporting;
  this._discardInvalid = !("discardInvalid" in r) || r.discardInvalid;
  this._dontStripDefault = !this._exporting || !("dontStripDefault" in r) || r.dontStripDefault;
  this._missingClassReporter = r.missingClassReporter;
  this._missingObjectReporter = r.missingObjectReporter;
  this._assetExists = this._missingObjectReporter && {};
  this.serializedList = [];
  this._parsingObjs = [];
  this._parsingData = [];
  this._objsToResetId = [];
  this._reserveContentsForAllSyncablePrefab = !!r.reserveContentsForSyncablePrefab;

  if (e instanceof cc.Prefab) {
    this._prefabRoot = e.data;
  }

  (function (e, r) {
    if (r instanceof i || cc.Class._isCCClass(r.constructor)) {
      m(e, r);
    } else {
      if (ArrayBuffer.isView(r)) {
        e.serializedList = m(e, r);
      } else {
        if ("object" == typeof r && r) {
          var t;
          if (Array.isArray(r)) {
            t = [];
          } else {
            t = {};
            var s = cc.js._getClassId(r, false);

            if (s) {
              t.__type__ = s;
            }

            if (r._serialize) {
              t.content = r._serialize(e._exporting);
              e.serializedList.push(t);
              return;
            }
          }
          r.__id__ = 0;
          e._objsToResetId.push(r);
          e.serializedList.push(t);
          j(e, r, t);
        } else {
          e.serializedList.push(r || null);
        }
      }
    }
  })(this, e);

  for (var t = 0; t < this._objsToResetId.length; ++t) {
    this._objsToResetId[t].__id__ = void 0;
  }
  this._parsingObjs = null;
  this._parsingData = null;
  this._objsToResetId = null;
}
var p = cc.Class.Attr;
var g = p.DELIMETER + "editorOnly";
var y = p.DELIMETER + "serializable";
var v = p.DELIMETER + "default";
var h = p.DELIMETER + "formerlySerializedAs";
function b(e, i, r, s, a) {
  for (
    var _ = p.getClassAttrs(s), o = a || s.__props__, l = 0;
    l < o.length;
    l++
  ) {
    var u = o[l];
    if (false !== _[u + y]) {
      var c = i[u];
      if (e._exporting) {
        if (_[u + g]) {
          continue;
        }
        if (!e._dontStripDefault && f(_[u + v], c)) {
          continue;
        }
      }
      r[u] = A(e, c);
      var d = _[u + h];

      if (d) {
        r[d] = r[u];
      }
    }
  }
  if ((t && i instanceof t) || (n && i instanceof n)) {
    if (e._exporting) {
      if (!(i instanceof t && i._parent instanceof cc.Scene)) {
        return;
      }
      if (!e._dontStripDefault && !i._id) {
        return;
      }
    }
    r._id = i._id;
  }
}
function j(e, i, r) {
  if (Array.isArray(i)) {
    for (var t = 0; t < i.length; ++t) {
      var n = A(e, i[t]);

      if (void 0 !== n) {
        r.push(n);
      }
    }
  } else {
    var a = i.constructor;
    if (s && s.isNode(i)) {
      (function (e, i, r, t) {
        if (z(e, i)) {
          if (i._prefab.root === i) {
            b(e, i, r, t, c);

            (function (e) {
              let i = e._trs.array;
              i[7] = 1;
              i[8] = 1;
              i[9] = 1;
            })(r);
          }
        } else {
          b(e, i, r, t);
        }
      })(e, i, r, a);

      return;
    }
    var _;
    var o = a && a.__props__;
    if (o) {
      if (o.length > 0) {
        if ("_$erialized" !== o[o.length - 1]) {
          if (i._onBeforeSerialize) {
            _ = i._onBeforeSerialize(o);
          }

          b(e, i, r, a, _);
        } else {
          if (i._$erialized) {
            r.__type__ = i._$erialized.__type__;
            j(e, i._$erialized, r);

            if (e._missingClassReporter) {
              e._missingClassReporter(i, r.__type__);
            }
          }
        }
      }
    } else {
      for (var l in i) if (!((i.hasOwnProperty && !i.hasOwnProperty(l)) || (95 === l.charCodeAt(0) && 95 === l.charCodeAt(1)))) {
        r[l] = A(e, i[l]);
      }
    }
  }
}
function z(e, i) {
  return !(
    e._reserveContentsForAllSyncablePrefab ||
    !(function (e) {
      var i = e._prefab;
      return i && i.root && i.root._prefab.sync;
    })(i) ||
    e._prefabRoot === i
  );
}
function A(t, n) {
  var a = typeof n;
  if ("object" === a) {
    if (!n) {
      return null;
    }
    var f = n.__id__;
    if (void 0 !== f) {
      return { __id__: f };
    }
    if (n instanceof i) {
      if (n instanceof r) {
        var u = n._uuid;
        return u
          ? ((function (e, i, r) {
              if (e._missingObjectReporter) {
                var t = e._assetExists[r];

                if (void 0 === t) {
                  t = e._assetExists[r] =
                      !!Editor.assetdb.remote.uuidToFspath(r);
                }

                if (!t) {
                  e._missingObjectReporter(i);
                }
              }
            })(t, n, u),
            t._exporting && (u = compressUuid(u, true)),
            { __uuid__: u })
          : null;
      }
      var c = n._objFlags;
      if (t._exporting && c & l) {
        return;
      }
      if (t._discardInvalid) {
        if (c & _) {
          return;
        }
        if (!n.isValid) {
          if (t._missingObjectReporter) {
            t._missingObjectReporter(n);
          }

          return null;
        }
      } else {
        if (c & _ && c & o) {
          return;
        }
        if (!n.isRealValid) {
          return null;
        }
      }
      if (s && s.isNode(n)) {
        if (z(t, n) && n !== n._prefab.root) {
          return null;
        }
      }
    }
    return m(t, n);
  }
  return "function" !== a ? n : null;
}
function m(e, r) {
  var t;
  var s = r instanceof i;
  var n = r.constructor;
  var _ = cc.js._getClassId(r, false);
  if (s || cc.Class._isCCClass(n)) {
    t = e.serializedList.length;
    r.__id__ = t;
    e._objsToResetId.push(r);
    var o = {};
    e.serializedList.push(o);

    if (_) {
      o.__type__ = _;
    }

    if (r._serialize) {
      o.content = r._serialize(e._exporting);
    } else {
      j(e, r, o);

      if (s && r._objFlags > 0) {
        o._objFlags &= a;
      }
    }

    return { __id__: t };
  }
  if (ArrayBuffer.isView(r)) {
    return {
      __type__: "TypedArray",
      ctor: r.constructor.name,
      array: Array.from(r),
    };
  }
  if (!n || n === Object || Array.isArray(r) || _) {
    if (r._serialize) {
      return _
        ? { content: r._serialize(e._exporting), __type__: _ }
        : { content: r._serialize(e._exporting) };
    }
    var l = (function (e, i) {
      var r = e._parsingObjs.indexOf(i);
      if (-1 !== r) {
        return e._parsingData[r];
      }
    })(e, r);
    return l
      ? ((t = e.serializedList.length),
        (r.__id__ = t),
        e._objsToResetId.push(r),
        false === Array.isArray(r) && _ && (l.__type__ = _),
        e.serializedList.push(l),
        { __id__: t })
      : (function (e, i) {
      var r;
      if (Array.isArray(i)) {
        r = [];
      } else {
        r = {};
        var t = cc.js._getClassId(i, false);

        if (t) {
          r.__type__ = t;
        }
      }
      var s = e.serializedList.length;
      e._parsingObjs.push(i);
      e._parsingData.push(r);
      j(e, i, r);
      e._parsingObjs.pop();
      e._parsingData.pop();
      if (
        (e.serializedList.length > s)
      ) {
        var n = e.serializedList.indexOf(r, s);
        if (-1 !== n) {
          return { __id__: n };
        }
      }
      return r;
    })(e, r);
  }
  return null;
}
function R(e, i) {
  var r;
  var t = !("stringify" in (i = i || {})) || i.stringify;
  var minify = i.minify;
  var n = minify || i.nicify;
  var a = new d(e, i).serializedList;

  if (n) {
    u(a);
  }

  r = 1 !== a.length || Array.isArray(a[0]) ? a : a[0];
  return false === t ? r : JSON.stringify(r, null, minify ? 0 : 2);
}

R.asAsset = function (e) {
  if (!e) {
    cc.error("[Editor.serialize.asAsset] The uuid must be non-nil!");
    return null;
  }
  var i = new r();
  i._uuid = e;
  return i;
};

R.setName = function (e, i) {
  if (Array.isArray(e)) {
    e[0]._name = i;
  } else {
    e._name = i;
  }
};

R.findRootObject = function (e, i) {
    if (Array.isArray(e)) {
      for (var r = 0; r < e.length; r++) {
        var t = e[r];
        if (t.__type__ === i) {
          return t;
        }
      }
    } else {
      if (e.__type__ === i) {
        return e;
      }
    }
    return null;
  };

Editor.serialize = module.exports = R;
require("./serialize-compiled/parser");
