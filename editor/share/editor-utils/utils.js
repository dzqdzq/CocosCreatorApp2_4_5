"use strict";
var r = require("fire-fs");
var t = require("fire-url");
var e = require("lodash");
module.exports = exports = Editor.Utils || {};

exports.urlToPath = function (r) {
    return decodeURIComponent(t.parse(r).pathname);
  };

exports.filterAsync = function (r, t, e) {
  var i = require("async");

  if (i.someSeries) {
    i.filter(r, t, e);
  } else {
    i.filter(
          r,
          function (r, e) {
            t(r, function (r, t) {
              e(t);
            });
          },
          function (r) {
            e(null, r);
          }
        );
  }
};

exports.asyncif = function (r, t) {
    return r
      ? t
      : function (r) {
          r();
        };
  };

exports.MultipleValueDict = class {
    constructor() {
      this.dict = {};
    }
    get(r) {
      return this.dict[r];
    }
    add(r, t) {
      var e = this.dict;
      var i = e[r];

      if (i) {
        if (Array.isArray(i)) {
          i.push(t);
        } else {
          e[r] = [i, t];
        }
      } else {
        e[r] = t;
      }

      return this;
    }
    value() {
      return this.dict;
    }
    multiple() {
      return e.pickBy(this.dict, e.isArray);
    }
  };

exports.toString = function (r) {
    return r ? (r.toString ? r.toString() : "Object") : "" + r;
  };

exports.refreshSelectedInspector = function (r, t) {
  var e = Editor.Selection.curGlobalActivate();

  if (e &&
    e.id === t &&
    e.type === r) {
    Editor.Selection.unselect(r, t);

    if ((e = Editor.Selection.curGlobalActivate()) && e.type === r && e.id) {
      setTimeout(function () {
            Editor.Selection.select(r, t, false);
          }, 200);
    } else {
      Editor.Selection.select(r, t, false);
    }
  }
};

exports.getDependsRecursively = (function () {
    return function (r, t, e) {
      if (!t || Array.isArray(t)) {
        return Editor.error("uuid can not be null or an array!");
      }
      var i = Object.create(null);

      (function r(t, e, i, n, o, u) {
        t[i] = o;
        var c = e[i];
        if (c && (u && (c = c[u]), c && c.length > 0)) {
          for (var s = 0; s < c.length; s++) {
            var a = c[s];

            if ((void 0 === t[a] || (t[a] <= o && a !== i && !n.some((r) => r === a)))) {
              r(t, e, a, n.concat(i), o + 1, u);
            }
          }
        }
      })(i, r, t, [], 0, e);

      delete i[t];
      return Object.keys(i).sort((r, t) => i[r] - i[t]);
    };
  })();

exports.UuidCache = (function () {
  var t = /\\/g;
  var e = {};
  function i(t) {
    if (!t) {
      return "";
    }
    var e = cc.assetManager.editorExtend.parseUuid(t);
    if (e) {
      return e;
    }
    var i = Editor.Utils.urlToPath(t + ".meta");
    if (r.existsSync(i)) {
      try {
        var n = r.readFileSync(i);
        e = JSON.parse(n).uuid || "";
      } catch (r) {}
    }
    return e;
  }
  return Editor.isRendererProcess
    ? {
        urlToUuid: function (r) {
          r = r.replace(t, "/");
          var n = e[r];
          return n || ((n = i(r)) && (e[r] = n), n);
        },
        cache: function (r, n) {
          r = r.replace(t, "/");
          if ((!n)) {
            if ((n = e[r])) {
              return;
            }
            n = i(r);
          }

          if (n) {
            e[r] = n;
          }
        },
        clear: function () {
          e = {};
        },
      }
    : {
        urlToUuid: function (r) {
          return Editor.assetdb.urlToUuid(r);
        },
      };
})();
