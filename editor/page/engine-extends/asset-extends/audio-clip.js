cc.AudioClip.prototype.createNode = function (c) {
  var e = new cc.Node(this.name);
  e.addComponent(cc.AudioSource).clip = this;
  return c(null, e);
};
