let e;
let r;
let t;
let a = require("path");
let i = require("fs-extra");
let s = require("./build-jsb-adapter.js");

module.exports = {
  gatherInfo(i) {
    e = i.cpk;
    t = i.options.debug;
    r = a.join(i.buildPath, "jsb-adapter");
  },
  async organizeResources(e) {
    let d = a.join(r, "engine", "index.js");
    i.emptyDirSync(r);
    let n = Editor.url("packages://runtime-adapters/platforms/link-sure");

    await s.build({
      rootPath: a.join(n, "engine", "index.js"),
      dstPath: d,
      excludedModules: [],
      isDebug: t,
    });

    return true;
  },
  pack() {
    e.directory(r, "jsb-adapter");
  },
};
