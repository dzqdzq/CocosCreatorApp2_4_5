let e;
let t;
let r;
let a = require("path");
let i = require("fs-extra");
let s = require("./build-jsb-adapter.js");

module.exports = {
  gatherInfo(i) {
    e = i.cpk;
    r = i.options.debug;
    t = a.join(i.buildPath, "jsb-adapter");
  },
  async organizeResources(e) {
    let d = a.join(t, "engine", "index.js");
    i.emptyDirSync(t);
    let n = Editor.url("packages://runtime-adapters/platforms/qtt");

    await s.build({
      rootPath: a.join(n, "engine", "index.js"),
      dstPath: d,
      excludedModules: [],
      isDebug: r,
    });

    return true;
  },
  pack() {
    e.directory(t, "jsb-adapter");
  },
};
