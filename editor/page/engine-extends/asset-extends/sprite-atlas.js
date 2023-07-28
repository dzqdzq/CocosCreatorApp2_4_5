cc.js.mixin(cc.SpriteAtlas.prototype, {
  createNode(e) {
    var t = new cc.Node(this.name);
    var r = t.addComponent(cc.Sprite);
    var c = this.getSpriteFrames();

    if (c.length > 0) {
      r.spriteFrame = c[0];
    }

    return e(null, t);
  },
});
