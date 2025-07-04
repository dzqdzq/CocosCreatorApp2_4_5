cc.Texture2D.prototype.createNode = function (e) {
  Editor.assetdb.queryMetaInfoByUuid(this._uuid, (t, r) => {
    if (t) {
      return e(t);
    }
    let s = JSON.parse(r.json);
    if ("raw" === s.type) {
      return cc.warn(
        "The sprite component only supports the texture which imports as sprite type."
      );
    }
    {
      let t = require("fire-url").basenameNoExt(r.assetPath);
      let a = s.subMetas[t].uuid;
      cc.assetManager.loadAny(a, (t, r) => {
        if (t) {
          cc.info(t);
          return e(t, null);
        }
        r.createNode(e);
      });
    }
  });
};
