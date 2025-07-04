var e = require("lodash");
var t = require("fire-url");
var s = require("../../share/engine-extends/object-walker");
var i = Editor.require("app://editor/page/scene-utils/utils/node");
var o = require("./missing-reporter");
function n(e) {
  o.call(this, e);
}
cc.js.extend(n, o);

n.prototype.doReport = function (t, s, n, r, c) {
  var a;
  var d;
  var u = "";

  if ((a =
    t instanceof cc.Component || t instanceof cc.Asset
      ? t
      : e.findLast(
          n,
          (e) => e instanceof cc.Component || e instanceof cc.Asset
        )) instanceof cc.Component) {
    u = ` by ${o.getObjectType(a)} "${cc.js.getClassName(a)}"`;
  } else {
    if ((a = e.findLast(n, (e) => e instanceof cc.Node))) {
      u = ` by node "${a.name}"`;
    }
  }

  if ("string" == typeof s) {
    d = `Asset "${s}" used${u}${c} is missing.`;
  } else {
    var p = cc.js.getClassName(s);

    if (p.startsWith("cc.")) {
      p = p.slice(3);
    }

    d = s instanceof cc.Asset
      ? `The ${p} used${u}${c} is missing.`
      : `The ${p} referenced${u}${c} is invalid.`;
  }
  d += o.INFO_DETAILED;

  if (a instanceof cc.Component) {
    a = a.node;
  }

  if (a instanceof cc.Node) {
    d += `Node path: "${i.getNodePath(a)}"\n`;
  }

  if (r) {
    d += `Asset url: "${r}"\n`;
  }

  if (s instanceof cc.Asset && s._uuid) {
    d += `Missing uuid: "${s._uuid}"\n`;
  }

  d.slice(0, -1);
  Editor.warn(d);
};

n.prototype.report = function () {
  var e;

  if (this.root instanceof cc.Asset) {
    e = Editor.assetdb.remote.uuidToUrl(this.root._uuid);
  }

  var i = o.getObjectType(this.root);
  var n = e ? ` in ${i} "${t.basename(e)}"` : "";
  s.walk(this.root, (t, s, i, o, r) => {
    if (this.missingObjects.has(i)) {
      this.doReport(t, i, o, e, n);
    }
  });
};

n.prototype.reportByOwner = function () {
  var e;

  if (this.root instanceof cc.Asset) {
    e = Editor.assetdb.remote.uuidToUrl(this.root._uuid);
  }

  var i = o.getObjectType(this.root);
  var n = e ? ` in ${i} "${t.basename(e)}"` : "";
  s.walkProperties(
    this.root,
    (t, s, i, o) => {
      var r = this.missingOwners.get(t);
      if (r && s in r) {
        var c = r[s];
        this.doReport(t, c || i, o, e, n);
      }
    },
    { dontSkipNull: true }
  );
};

module.exports = n;
