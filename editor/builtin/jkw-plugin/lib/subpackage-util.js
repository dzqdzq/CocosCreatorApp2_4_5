let e;
let n;
let i;
let s;
let a;
let t;
let r;
let o = require("../lib/hashes.min.js");
let c = require("path");
let u = require("fs-extra");

module.exports = {
  gatherInfo(o) {
    t = o.JsZip;
    a = o.cpk;
    s = o.gameConfig;
    i = o.title;
    e = o.buildPath;
    r = o.options;
    n = [];
  },
  organizeResources() {
    let i = (s.subpackages = []);
    for (var a = 0, t = r.bundles.length; a < t; a++) {
      var o = r.bundles[a];
      if (!o.isSubpackage) {
        continue;
      }
      let s = o.bundleName;
      let t = c.join(e, "assets", s);
      if (n.includes(t)) {
        break;
      }
      n.push(t);

      if (u.existsSync(c.join(t, "index.js"))) {
        u.renameSync(c.join(t, "index.js"), c.join(t, "main.js"));
      }

      i.push({ name: s, root: s + "/" });
    }
  },
  pack() {
    let s = c.join(e, "subpackages");
    u.emptyDirSync(s);

    n.forEach(function (e) {
      let n = new t();
      let a = c.win32.basename(e);
      let r = o.CRC32(a + "/");
      let p = c.join(s, i + "." + r + ".cpk");

      if (u.existsSync(p)) {
        u.unlinkSync(p);
      }

      let l = u.createWriteStream(p);
      n.directory(e, a);

      n
        .generateNodeStream({
          type: "nodebuffer",
          base64: false,
          compression: "DEFLATE",
        })
        .pipe(l)
        .on("finish", function () {});
    });
  },
};
