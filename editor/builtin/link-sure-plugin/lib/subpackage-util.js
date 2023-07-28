let e;
let n;
let s;
let i;
let t;
let r;
let a;
let o = require("../lib/hashes.min.js");
let c = require("path");
let p = require("fs-extra");

module.exports = {
  gatherInfo(o) {
    r = o.JsZip;
    t = o.cpk;
    i = o.gameConfig;
    s = o.title;
    e = o.buildPath;
    a = o.options;
    n = [];
  },
  organizeResources() {
    let e = (i.subpackages = []);
    for (var s = 0, t = a.bundles.length; s < t; s++) {
      var r = a.bundles[s];
      if ("subpackage" !== r.compressionType) {
        continue;
      }
      let i = r.name;
      let t = r.scriptDest;
      if (n.includes(t)) {
        break;
      }
      n.push(t);
      let o = c.join(r.scriptDest, "index.js");

      if (p.existsSync(o)) {
        p.renameSync(o, c.join(r.scriptDest, "main.js"));
      }

      e.push({ name: i, root: i + "/" });
    }
  },
  pack() {
    let i = c.join(e, "subpackages");
    n.forEach(function (e) {
      let n = new r();
      let t = c.win32.basename(e);
      let a = o.CRC32(t + "/");
      let u = c.join(i, s + "." + a + ".cpk");

      if (p.existsSync(u)) {
        p.unlinkSync(u);
      }

      n.directory(e, t);

      n
        .generateAsync({
          type: "nodebuffer",
          base64: false,
          compression: "DEFLATE",
        })
        .then(function (e) {
          p.writeFileSync(u, e);
        });
    });
  },
};
