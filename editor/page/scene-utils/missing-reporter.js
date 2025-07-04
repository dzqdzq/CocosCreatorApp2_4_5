function e(e) {
  this.missingObjects = new Set();
  this.missingOwners = new Map();
  this.root = e;
}

e.prototype.reset = function () {
  this.missingObjects.clear();
  this.missingOwners.clear();
  this.root = null;
};

e.prototype.stash = function (e) {
    this.missingObjects.add(e);
  };

e.prototype.stashByOwner = function (e, t, n) {
  var s = this.missingOwners.get(e);

  if (!s) {
    s = {};
    this.missingOwners.set(e, s);
  }

  s[t] = n;
};

e.prototype.removeStashedByOwner = function (e, t) {
    var n = this.missingOwners.get(e);
    if (n && t in n) {
      var s = n[t];
      for (var i in (delete n[t], n)) return s;
      this.missingOwners.delete(e);
      return s;
    }
  };

e.prototype.report = null;
e.prototype.reportByOwner = null;

e.getObjectType = function (e) {
    return e instanceof cc.Component
      ? "component"
      : e instanceof cc.Prefab
      ? "prefab"
      : e instanceof cc.SceneAsset
      ? "scene"
      : "asset";
  };

e.INFO_DETAILED = " Detailed information:\n";
module.exports = e;
