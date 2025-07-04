const { promisify: s } = require("util");
module.exports = class {
  constructor(s) {
    this.parent = s;
    this._assetInfos = Object.create(null);
  }
  addGeneratedAsset(s, t, e, n) {
    this._assetInfos[s] = {
      uuid: s,
      path: t,
      type: e,
      isSubAsset: n,
      url: `[Generated Asset (${s})]`,
    };
  }
  queryInfoByUuid(s, t) {
    var e = this._assetInfos[s];

    if (e) {
      process.nextTick(function () {
            return t(null, e);
          });
    } else {
      this.parent.queryInfoByUuid(
            s,
            (e, n) => (n && (this._assetInfos[s] = n), t(null, n || null))
          );
    }
  }
};
