let e = require("./jszip.min.js");
let t = require("path");
let i = require("fs-extra");
let r = (require("./worker-util.js"), require("./adapter-util.js"));
let a = require("./tinypack-util.js");
let o = require("./subpackage-util.js");
let n = {};

e.prototype.directory = function (e, r) {
  if (!i.statSync(e).isDirectory()) {
    Editor.error(e + " is not a folder!");
    return;
  }
  i.readdirSync(e).forEach(
    function (e) {
      let r = this.zip;
      let a = t.join(this.srcPath, e);
      let o = i.statSync(a);

      if (o.isDirectory()) {
        r.directory(a, e);
      } else {
        if (o.isFile()) {
          r.file(e, i.readFileSync(a));
        } else {
          Editor.error(a + " was not added to zip!");
        }
      }
    }.bind({ srcPath: e, zip: this.folder(r) })
  );
};

e.prototype.append = function (e, t) {
    if (!i.statSync(e).isFile()) {
      Editor.error(e + " is not a file!");
      return;
    }
    this.file(t, i.readFileSync(e));
  };

module.exports = {
    async gatherInfo(s, c) {
      n.customConfig = Editor.Profile.load(
          "project://link-sure-runtime.json"
        ).getSelfData();

      if (false === this.checkData(n, s, c)) {
        return false;
      }
      n.md5Cache = c.md5Cache;
      let u = n.customConfig;
      n.isTinyPackage = "" !== u.tinyPackageServer;
      n.projectPath = c.project;
      n.buildPath = c.dest;
      n.options = c;
      n.title = c.title;
      n.cpkName = c.title + ".cpk";
      let p = u.outputCpkPath;
      let d = u.useCustomCpkPath;
      n.buildResults = c.buildResults;
      n.startScene = c.startScene;

      if (true === d) {
        if ("" !== p && i.existsSync(p)) {
          n.cpkPath = t.join(p, n.cpkName);
        } else {
          Editor.log(Editor.T("link-sure-runtime.out_cpk_path_error"));
          n.cpkPath = t.join(n.buildPath, n.cpkName);
        }
      } else {
        n.cpkPath = t.join(n.buildPath, n.cpkName);
      }

      n.gameConfig = {};
      n.JsZip = e;
      n.cpk = new e();
      await r.gatherInfo(n);
      await a.gatherInfo(n);
      await o.gatherInfo(n);
      return true;
    },
    checkData: (e, r, a) => (
      0,
      i.existsSync(t.join(a.dest, "remote")) &&
        "" === e.customConfig.tinyPackageServer &&
        Editor.warn(
          Editor.T("link-sure-runtime.had_set_remote_without_tiny_mode")
        ),
      true
    ),
    async organizeResources(e) {
      let a = n.buildPath;
      return (false !== (await r.organizeResources(e)) && (await o.organizeResources(), i.writeJSONSync(t.join(a, "game.config.json"), n.gameConfig), true));
    },
    async pack(e) {
      let s = n.cpk;
      let c = n.cpkPath;
      let u = n.buildPath;

      if (i.existsSync(c)) {
        i.unlinkSync(c);
      }

      await r.pack();
      await a.pack();
      await o.pack();
      s.directory(t.join(u, "src"), "src");
      s.directory(t.join(u, "assets"), "assets");
      s.append(t.join(u, "main.js"), "main.js");
      s.append(t.join(u, "game.config.json"), "game.config.json");

      s
        .generateAsync({
          type: "nodebuffer",
          base64: false,
          compression: "DEFLATE",
        })
        .then(function (t) {
        i.writeFileSync(c, t);
        e.reply();
      });
    },
  };
