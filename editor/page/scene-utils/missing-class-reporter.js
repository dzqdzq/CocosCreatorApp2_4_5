var e = require("lodash");
var s = require("fire-url");
var r = require("../../share/engine-extends/object-walker");
var i = Editor.require("app://editor/page/scene-utils/utils/node");
var t = cc.js._getClassById;
var n = require("./missing-reporter");
function o(r, t, o, a, c, d) {
  d = d || (r._$erialized && r._$erialized.__type__);

  (function (e, r, t, o) {
    var a = n.getObjectType(t);
    var c = o && s.basename(o);
    if (t instanceof cc.SceneAsset || t instanceof cc.Prefab) {
      var d;
      var l;
      var p;

      if (e instanceof cc.Component) {
        p = (l = e).node;
      } else {
        if (cc.Node.isNode(e)) {
          p = e;
        }
      }

      var u = c ? ` in ${a} "${c}"` : "";
      var f = r;
      var h = false;
      if (l) {
        var g = cc.js.getClassName(l);

        if (l instanceof cc._MissingScript) {
          h = true;
          f = g = l._$erialized.__type__;
        }

        d = `Class "${r}" used by component "${g}"${u} is missing or invalid.`;
      } else {
        if (!p) {
          return;
        }
        h = true;
        d = `Script attached to "${p.name}"${u} is missing or invalid.`;
      }
      d += n.INFO_DETAILED;
      d += `Node path: "${i.getNodePath(p)}"\n`;

      if (o) {
        d += `Asset url: "${o}"\n`;
      }

      if (h &&
        Editor.Utils.UuidUtils.isUuid(f)) {
        d += `Script UUID: "${Editor.Utils.UuidUtils.decompressUuid(
            f
          )}"\n`;

        d += `Class ID: "${f}"\n`;
      }

      d.slice(0, -1);
      Editor.warn(d);
    }
  })(
    t instanceof cc.Component || cc.Node.isNode(t)
      ? t
      : e.findLast(o, (e) => e instanceof cc.Component || cc.Node.isNode(e)),
    d,
    a,
    c
  );
}
function a(e) {
  n.call(this, e);
}
cc.js.extend(a, n);

a.prototype.report = function () {
    r.walk(this.root, (e, s, r, i) => {
      if (this.missingObjects.has(r)) {
        o(r, e, i, this.root);
      }
    });
  };

a.prototype.reportByOwner = function () {
  var e;

  if (this.root instanceof cc.Asset) {
    e = Editor.assetdb.remote.uuidToUrl(this.root._uuid);
  }

  r.walkProperties(
    this.root,
    (s, r, i, t) => {
      var n = this.missingOwners.get(s);
      if (n && r in n) {
        var a = n[r];
        o(i, s, t, this.root, e, a);
      }
    },
    { dontSkipNull: true }
  );
};

var c = {
  reporter: new a(),
  classFinder: function (e, s, r, i) {
    var n = t(e);
    return (n || (e && ((c.hasMissingClass = true), c.reporter.stashByOwner(r, i, e)), null));
  },
  hasMissingClass: false,
  reportMissingClass: function (e) {
    if (c.hasMissingClass) {
      c.reporter.root = e;
      c.reporter.reportByOwner();
      c.hasMissingClass = false;
    }
  },
  reset() {
    c.reporter.reset();
  },
};

c.classFinder.onDereferenced = function (e, s, r, i) {
  var t = c.reporter.removeStashedByOwner(e, s);

  if (t) {
    c.reporter.stashByOwner(r, i, t);
  }
};

module.exports = { MissingClass: c, MissingClassReporter: a };
