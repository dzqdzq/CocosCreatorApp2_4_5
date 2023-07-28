"use strict";
var e = require("async");
var s = require("lodash");

if ("undefined" == typeof _Scene) {
  window._Scene = {};
}

var t = Editor.require("app://editor/page/scene-utils/utils/node");
var i = require("./build-asset");
class r {
  constructor(t, n, a) {
    this._ownerCaches = Object.create(null);
    this._results = Object.create(null);
    this.texturePacker = a;

    this.queue = e.queue((e, n) => {
      t.build(e, (t, a) => {
        if (t) {
          if (t.message === i.AssetMissing) {
            var u = this._ownerCaches[e];

            if (u) {
              r._reportMissingAsset(e, u);
            }
          } else {
            Editor.error(t.message || t);
          }
        } else {
          var d = a.dependUuids;
          var o = a.redirect;
          var h = a.nativePaths;
          var l = null;
          if (d && d.length > 0) {
            var c = s.uniq(d);
            (l = l || {}).dependUuids = c;
            var p = {
              assetUuid: e,
              dependUuids: d,
              ownersForDependUuids: a.ownersForDependUuids,
            };
            this.parse(c, p);
          }

          if (h) {
            (l = l || {}).nativePath = h[0];
            l.nativePaths = h;
          }

          if (o) {
            (l = l || {}).redirect = o;
          }

          if (l) {
            this._results[e] = l;
          }
        }
        this._ownerCaches[e] = void 0;
        n();
      });
    }, n);
  }
  static _reportMissingAsset(e, s) {
    var i = s.assetUuid;

    var r = `Cannot find the asset referenced in "${Editor.assetdb.remote.uuidToUrl(
      i
    )}", it may have been deleted. Detailed information:\n`;

    var n = s.ownersForDependUuids;
    if (n) {
      var a = s.dependUuids.indexOf(e);
      if (-1 !== a) {
        var u = n[a];
        if (u instanceof cc.Component) {
          var d = u.node;
          r += `Node path: "${t.getNodePath(d)}"\n`;
          r += `Used in Component: "${cc.js.getClassName(u)}"\n`;
        } else {
          if ("string" == typeof u.name) {
            r += `Used in object: "${u.name}"\n`;
          } else {
            var o = cc.js.getClassName(u);

            if (o) {
              r += `Used by "${o}"\n`;
            }
          }
        }
      }
    }
    r += `uuid: "${e}"`;
    Editor.warn(r);
  }
  parse(e, s) {
    if (this.texturePacker) {
      e = e.filter((e) => !this.texturePacker.needPack(e));
    }

    if (
      (1 === e.length)
    ) {
      let t = e[0];
      if (this._results[t]) {
        return;
      }

      if (s) {
        this._ownerCaches[t] = s;
      }

      this._results[t] = true;
      this.queue.push(t);
    } else {
      var t = [];
      for (let i = 0; i < e.length; i++) {
        let r = e[i];

        if (!this._results[r]) {
          if (s) {
            this._ownerCaches[r] = s;
          }

          t.push(r);
          this._results[r] = true;
        }
      }
      this.queue.push(t);
    }
  }
  start(e, s) {
    this.queue.drain(() => {
      Editor.error("task not pushed");
    });

    this.parse(e);

    this.queue.drain(() => {
      s(null, this._results);
    });
  }
}
module.exports = r;
