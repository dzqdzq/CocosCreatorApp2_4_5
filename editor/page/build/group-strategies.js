"use strict";
var e = require("lodash");
var r = require("async");
class GroupStrategyBase {
  constructor() {
    this.groupManager = null;
  }
  init(e) {
    this.groupManager = e;
  }
  shouldPack(e) {
    return false;
  }
  transformGroups(e, r) {
    r(null, (e = e.map((e) => ({ uuids: e, name: "", type: "normal" }))));
  }
  mergeSmallFiles(e, r, n) {
    n(null, r);
  }
}

module.exports = {
  GroupStrategyBase: GroupStrategyBase,
  Balanced: class extends GroupStrategyBase {
    shouldPack(e) {
      return (
        "scene" === e.type ||
        !!Editor.assetdb.remote.containsSubAssetsByUuid(e.uuid)
      );
    }
  },
  SizeMinimized: class extends GroupStrategyBase {
    shouldPack(e) {
      return !e.isSubAsset;
    }
    transformGroups(e, r) {
      r(
        null,
        (e = (e = this.splitGroups(e)).map((e) => ({
          uuids: e,
          name: "",
          type: "normal",
        })))
      );
    }
    splitGroups(r, n) {
      n = void 0 !== n && n;
      if (r.length < 2) {
        return r;
      }
      var t = [r[0]];
      e: for (var s = 1; s < r.length; s++) {
        for (var i = r[s], u = t.length, a = 0; a < u; a++) {
          var l = t[a];
          var o = e.intersection(l, i);
          var d = l.length;
          var p = i.length;
          var c = o.length;
          if (0 !== c) {
            if (c === d) {
              if (d === p) {
                continue e;
              }
              i = e.difference(i, o);
            } else {
              if (c === p) {
                if (d !== p) {
                  l = e.difference(l, o);
                  t[a] = l;
                  t.push(o);
                }

                continue e;
              }
              i = e.difference(i, o);
              l = e.difference(l, o);
              t[a] = l;
              t.push(o);
            }
          }
        }
        t.push(i);
      }
      if (n) {
        var f = e.flatten(t);
        var m = e.uniq(f);
        if (m.length < f.length) {
          Editor.warn(
            "Internal error: SizeMinimized.transformGroups: res not unique, transform canceled"
          );

          return r;
        }
        var h = e.flatten(r);
        if (e.difference(h, m).length > 0) {
          Editor.warn(
            "Internal error: SizeMinimized.transformGroups: not have the same members, transform canceled"
          );

          return r;
        }
      }
      return t;
    }
  },
  ForHotUpdate: class extends GroupStrategyBase {
    mergeSmallFiles(e, n, t) {
      this.groupManager.queryAssetInfosInBuild(cc.SpriteFrame, (s, i) => {
        var u = new Editor.Utils.MultipleValueDict();
        this.groupManager.writer;

        r.each(
          i,
          (r, n) => {
            let t = r.uuid;
            let s = e[t];
            if (s && s.redirect) {
              return n();
            }
            let i = s.dependUuids && s.dependUuids[0];

            if (i) {
              u.add(i, t);
            }

            n();
          },
          () => {
            u = u.multiple();
            for (let e in u) {
              let r = u[e];
              this.groupManager.removeFromGroups(n, r);
              n.push({ name: "", uuids: r });
            }
            t(null, n);
          }
        );
      });
    }
  },
  MergeAllJson: class extends GroupStrategyBase {
    shouldPack() {
      return false;
    }
    transformGroups(e, r) {
      r(null, [
        {
          name: "",
          type: "normal",
          uuids: this.groupManager.getAllUuidsInBuild(),
        },
      ]);
    }
  },
};
