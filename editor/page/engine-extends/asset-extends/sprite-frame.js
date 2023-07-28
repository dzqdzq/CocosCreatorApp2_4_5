cc.SpriteFrame.prototype.createNode = function (e) {
  Editor.assetdb.queryMetaInfoByUuid(this._uuid, (t, i) => {
    let r = new cc.Node(this.name);
    let o = r.addComponent(cc.Sprite);
    o.spriteFrame = this;

    if ("none" === JSON.parse(i.json).trimType) {
      o.trim = false;
      o.sizeMode = cc.Sprite.SizeMode.RAW;
    }

    return e(null, r);
  });
};
