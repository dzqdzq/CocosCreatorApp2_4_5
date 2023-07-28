const e = require("fire-fs");
const i = require("fire-path");
const r = require("./lib/jszip.min.js");
const t = require("electron");
const o = "fb-instant-games";
function n(n, s) {
  if (n.platform !== o) {
    return s();
  }
  let d = new r();
  d.directory(n.dest, i.basenameNoExt(n.dest));
  let l = i.join(n.dest, n.title + ".zip");
  d.generateNodeStream({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  })
    .pipe(e.createWriteStream(l))
    .on("finish", () => {
    t.shell.showItemInFolder(l);
    s();
  });
}

r.prototype.directory = function (r, t) {
  if (!e.statSync(r).isDirectory()) {
    Editor.error(r + " is not a folder!");
    return;
  }
  e.readdirSync(r).forEach(
    function (r) {
      let t = this.zip;
      let o = i.join(this.srcPath, r);
      let n = e.statSync(o);

      if (n.isDirectory()) {
        t.directory(o, r);
      } else {
        if (n.isFile()) {
          t.file(r, e.readFileSync(o));
        } else {
          Editor.error(o + " was not added to zip!");
        }
      }
    }.bind({ srcPath: r, zip: this.folder(t) })
  );
};

module.exports = {
    load() {
      Editor.Builder.on("build-finished", n);
    },
    unload() {
      Editor.Builder.removeListener("build-finished", n);
    },
    messages: {},
  };
