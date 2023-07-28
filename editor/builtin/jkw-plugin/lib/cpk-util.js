let e = require("./jszip.min.js");
let t = require("path");
let i = require("fs-extra");
let a = require("./worker-util.js");
let r = require("./adapter-util.js");
let o = require("./tinypack-util.js");
let n = require("./separate-engine-util.js");
let s = {};

e.prototype.directory = function (e, a) {
  if (!i.statSync(e).isDirectory()) {
    Editor.error(e + " is not a folder!");
    return;
  }
  i.readdirSync(e).forEach(
    function (e) {
      let a = this.zip;
      let r = t.join(this.srcPath, e);
      let o = i.statSync(r);

      if (o.isDirectory()) {
        a.directory(r, e);
      } else {
        if (o.isFile()) {
          a.file(e, i.readFileSync(r));
        } else {
          Editor.error(r + " was not added to zip!");
        }
      }
    }.bind({ srcPath: e, zip: this.folder(a) })
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
    async gatherInfo(c, p) {
      s.customConfig = Editor.Profile.load(
          "project://cpk-publish.json"
        ).getSelfData();

      if (false === this.checkData(s, c, p)) {
        return false;
      }
      s.md5Cache = p.md5Cache;
      let u = s.customConfig;
      s.isTinyPackage = "" !== u.tinyPackageServer;
      s.projectPath = p.project;
      s.buildPath = p.dest;
      s.options = p;
      s.title = p.title;
      s.cpkName = p.title + ".cpk";
      let d = u.outputCpkPath;
      let l = u.useCustomCpkPath;
      s.buildResults = p.buildResults;
      s.startScene = p.startScene;

      if (true === l) {
        if ("" !== d && i.existsSync(d)) {
          s.cpkPath = t.join(d, s.cpkName);
        } else {
          Editor.log(Editor.T("cpk-publish.out_cpk_path_error"));
          s.cpkPath = t.join(s.buildPath, s.cpkName);
        }
      } else {
        s.cpkPath = t.join(s.buildPath, s.cpkName);
      }

      s.gameConfig = {
        deviceOrientation: u.deviceOrientation,
        showStatusBar: u.showStatusBar,
        runtimeVersion: u.runtimeVersion,
      };

      s.JsZip = e;
      s.cpk = new e();
      await a.gatherInfo(s);
      await r.gatherInfo(s);
      await o.gatherInfo(s);
      await n.gatherInfo(s);
      return true;
    },
    checkData: (e, a, r) => (
      0,
      i.existsSync(t.join(r.dest, "remote")) &&
        "" === e.customConfig.tinyPackageServer &&
        Editor.warn(Editor.T("cpk-publish.had_set_remote_without_tiny_mode")),
      true
    ),
    async organizeResources(e) {
      let o = s.buildPath;
      await a.organizeResources();
      return false !== (await r.organizeResources(e)) &&
        (await n.organizeResources(),
        i.writeJSONSync(t.join(o, "game.config.json"), s.gameConfig),
        true);
    },
    async pack(e) {
      let c = s.cpk;
      let p = s.cpkPath;
      let u = s.buildPath;

      if (i.existsSync(p)) {
        i.unlinkSync(p);
      }

      await a.pack();
      await r.pack();
      await o.pack();
      await n.pack();
      c.directory(t.join(u, "src"), "src");
      c.directory(t.join(u, "assets"), "assets");
      c.append(t.join(u, "main.js"), "main.js");
      c.append(t.join(u, "game.config.json"), "game.config.json");

      c
        .generateAsync({
          type: "nodebuffer",
          base64: false,
          compression: "DEFLATE",
        })
        .then(function (t) {
        i.writeFileSync(p, t);
        e.reply();
      });
    },
  };
