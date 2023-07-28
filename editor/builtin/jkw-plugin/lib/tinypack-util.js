let e;
let r;
let t = require("path");
let i = require("fs");
let o = false;

module.exports = {
  gatherInfo(t) {
    e = t.cpk;
    o = "" !== t.customConfig.tinyPackageServer;
    r = t.buildPath;
  },
  async organizeResources() {},
  pack() {
    if (true === o) {
      return;
    }
    let a = t.join(r, "remote");

    if (i.existsSync(a)) {
      e.directory(a, "remote");
    }
  },
  packFinished() {},
};
