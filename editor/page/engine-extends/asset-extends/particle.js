cc.ParticleAsset.prototype.createNode = function (e) {
  var t = new cc.Node(this.name);
  var c = t.addComponent(cc.ParticleSystem);
  c.file = this;
  c.custom = false;
  return e(null, t);
};
