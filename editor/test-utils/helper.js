"use strict";
const e = require("fire-fs"),
  t = require("fire-path"),
  s = require("del");
let r = {
  runAssetDB(r) {
    beforeEach(function (s) {
      var o = r,
        i = t.join(Editor.Project.path, "assets");
      e.copySync(o, i),
        Editor.assetdb.mount(i, "assets", "asset", () => {
          Editor.assetdb.init(s);
        });
    }),
      afterEach(function (e) {
        Editor.assetdb._dbReset(),
          s(t.join(Editor.Project.path, "assets").replace(/\\/g, "/"), {
            force: !0,
          })
            .then((t) => {
              e();
            })
            .catch(e);
      });
  },
};
module.exports = r;
