cc.Font.prototype.createNode = function (e) {
  var n = new cc.Node(this.name);
  n.addComponent(cc.Label).font = this;
  return e(null, n);
};
