"use strict";
const e = require("fire-fs");
const t = require("fire-path");
const s = require("del");
let r = {
  runAssetDB(r) {
    beforeEach(function (s) {
      var o = r;
      var i = t.join(Editor.Project.path, "assets");
      e.copySync(o, i);

      Editor.assetdb.mount(i, "assets", "asset", () => {
        Editor.assetdb.init(s);
      });
    });

    afterEach(function (e) {
      Editor.assetdb._dbReset();

      s(t.join(Editor.Project.path, "assets").replace(/\\/g, "/"), {
        force: true,
      })
        .then((t) => {
          e();
        })
        .catch(e);
    });
  },
};
module.exports = r;
