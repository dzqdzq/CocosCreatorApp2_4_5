Editor.require(
  "unpack://engine-dev/cocos2d/core/3d/CCModel"
).prototype.createNode = function (e) {
  Editor.assetdb.queryMetaInfoByUuid(this._uuid, function (n, t) {
    if (n) {
      return e(n);
    }
    let r = require("fire-url").basenameNoExt(t.assetPath);
    let i = JSON.parse(t.json).subMetas[r + ".prefab"];
    if (!i) {
      Editor.warn(`Can not find prefab ${r}`);
      return e(null, new cc.Node());
    }
    let u = i.uuid;
    cc.assetManager.loadAny(u, function (n, t) {
      if (n) {
        cc.info(n);
        return e(n, null);
      }
      let r = cc.instantiate(t);
      return e(null, r);
    });
  });
};
