let r;
let e;
let t;
let o;
let i;
let c = require("path");
let n = require("fs-extra");

module.exports = {
  gatherInfo(n) {
    i = n.cpk;
    o = n.buildPath;

    if ((e = (function (e, t) {
      if (void 0 !== (r = t.workerPath) && "" !== (r = r.replace(/%s/g, ""))) {
        return c.join(e, r);
      }
    })(n.projectPath, n.customConfig))) {
      Editor.log("workerPath: ", e);
      n.gameConfig.workers = r;
      t = c.join(n.buildPath, r);
      Editor.log("workerDestPath: ", t);
    }
  },
  organizeResources() {
    if (!e) {
      return;
    }
    if (!n.existsSync(e)) {
      throw "Please configure the worker path correctly!";
    }
    if (n.existsSync(t)) {
      if (n.statSync(t).isDirectory()) {
        n.removeSync(t);
      } else {
        n.unlinkSync(t);
      }
    }
    let r = n.statSync(e);

    if (r.isDirectory() || r.isFile()) {
      n.copySync(e, t);
    } else {
      Editor.error(e + " was not copy to " + t);
    }
  },
  pack() {
    if (e) {
      let e = r.split(/\/|\\/)[0];
      let o = n.statSync(t);

      if (o.isDirectory()) {
        i.directory(t, e);
      } else {
        if (o.isFile()) {
          i.append(t, e);
        } else {
          Editor.error(t + " was not added to zip!");
        }
      }
    }
  },
};
