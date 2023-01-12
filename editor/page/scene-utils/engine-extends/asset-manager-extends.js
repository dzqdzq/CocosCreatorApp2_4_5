"use strict";
var e = require("electron");
const t = require("minimatch");
var n = Editor.assetdb.remote,
  s = require("fire-path"),
  a = e.ipcRenderer;
const r = require("async");
var i = Editor.require(
  "unpack://engine-dev/cocos2d/core/platform/callbacks-invoker"
);
let c = Editor.remote.importPath.replace(/\\/g, "/");
var o = cc.assetManager,
  u = (o.editorExtend = o.editorExtend || {});
function d(e) {
  o.releaseAsset(o.assets.get(e), !0);
}
a.on("asset-db:assets-moved", function (e, t) {
  t.forEach(function (e) {
    u.onAssetMoved(e.uuid, e.srcPath, e.destPath);
  });
}),
  a.on("asset-db:asset-changed", function (e, t) {
    u.onAssetChanged(t.uuid);
  }),
  a.on("asset-db:assets-deleted", function (e, t) {
    t.forEach(function (e) {
      u.onAssetRemoved(e.uuid, e.path);
    });
  });
var f = (u.assetListener = new i());
function l(e, t) {
  var n = e.type;
  return (
    e.uuid &&
    "folder" !== n &&
    "javascript" !== n &&
    "typescript" !== n &&
    (!t || Editor.assets[n] === t)
  );
}
(u.onAssetMoved = function (e, t, n) {
  var a = s.basenameNoExt(t),
    r = s.basenameNoExt(n);
  f.hasEventListener(e) &&
    u.queryAssetInfo(e, function (t, n, s) {
      t ||
        (d(e),
        cc.js.isChildClassOf(s, cc.Scene) ||
          cc.assetManager.loadAny(e, function (t, n) {
            f.emit(e, n);
          }));
    }),
    "undefined" != typeof _Scene &&
      u.queryAssetInfo(e, function (t, n, s) {
        t ||
          (cc.js.isChildClassOf(s, cc.Prefab) &&
            _Scene.walk(cc.director.getScene(), !1, (t) => {
              var n = t._prefab;
              if (n) {
                if (n.asset && n.asset._uuid === e)
                  t.name !== a || (t.name = r);
                return !0;
              }
            }));
      });
}),
  (u.onAssetChanged = function (e) {
    u.queryAssetInfo(e, function (t, n, s) {
      t ||
        (f.hasEventListener(e) &&
          (d(e),
          cc.js.isChildClassOf(s, cc.Scene) ||
            o.loadAny(e, function (t, n) {
              f.emit(e, n);
            })));
    });
  }),
  (u.onAssetRemoved = function (e, t) {
    d(e), console.log("delete cache of " + t), f.emit(e, null);
  }),
  (u.queryAssetInfo = function (e, t) {
    Editor.Ipc.sendToMain(
      "scene:query-asset-info-by-uuid",
      e,
      function (n, s) {
        if (s) {
          Editor.Utils.UuidCache.cache(s.url, e);
          var a = Editor.assets[s.type];
          a
            ? t(null, s.url, a)
            : t(new Error("Can not find asset type " + s.type));
        } else {
          var r = new Error(
            'Can not get asset url by uuid "' +
              e +
              '", the asset may be deleted.'
          );
          (r.errorCode = "db.NOTFOUND"), t(r);
        }
      },
      -1
    );
  });
var h = new cc.AssetManager.Bundle();
h.init({
  name: cc.AssetManager.BuiltinBundleName.RESOURCES,
  nativeBase: c,
  importBase: c,
});
var v = new cc.AssetManager.Bundle();
function p(e, s, a) {
  if (!e) return;
  "/" === e[e.length - 1] && (e = e.slice(0, -1)),
    (e = "db://" + a + "/resources/" + e);
  let r = n.urlToFspath(e + (s !== cc.SpriteFrame ? "?(.*)" : "?(.*)/*"));
  var i = Object.keys(n._path2uuid);
  let c = t.match(i, r);
  for (let e = 0; e < c.length; e++) {
    var o = n.assetInfoByPath(c[e]);
    if (l(o, s)) return { uuid: o.uuid };
  }
  return null;
}
function g(e, s, a, r) {
  e = (e = "db://" + a + "/resources/" + e).replace(/\/*$/, "");
  var i = n.assetInfo(e),
    c = r || [];
  if (i.uuid && "folder" === i.type) {
    var o = n.urlToFspath(`${e}/**/*`),
      u = Object.keys(n._path2uuid);
    let a = t.match(u, o);
    for (let e = 0; e < a.length; e++) {
      var d = n.assetInfoByPath(a[e]);
      l(d, s) && c.push({ compressUuid: d.uuid, uuid: d.uuid });
    }
  }
  return c;
}
v.init({
  name: cc.AssetManager.BuiltinBundleName.INTERNAL,
  nativeBase: c,
  importBase: c,
}),
  (h._config.getInfoWithPath = function (e, t) {
    return p(e, t, "assets");
  }),
  (v._config.getInfoWithPath = function (e, t) {
    return p(e, t, "internal");
  }),
  (h._config.getDirWithPath = function (e, t, n) {
    return g(e, t, "assets", n);
  }),
  (v._config.getDirWithPath = function (e, t, n) {
    return g(e, t, "internal", n);
  });
let m = o.builtins.init;
o.builtins.init = function (e) {
  m.call(o.builtins, () => {
    r.eachSeries(
      ["db://assets/**/*.effect", "db://internal/effects/**/*.effect"],
      (e, t) => {
        Editor.assetdb.queryAssets(e, null, async (e, n) => {
          if (e) return t(e);
          r.eachSeries(
            n,
            (e, t) => {
              cc.assetManager.loadAny(e.uuid, () => {
                t();
              });
            },
            (e) => {
              t(e);
            }
          );
        });
      },
      (t) => {
        e(t);
      }
    );
  });
};
