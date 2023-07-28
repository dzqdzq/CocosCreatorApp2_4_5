let e = require("./jszip.min.js");
let t = require("path");
let i = require("fs-extra");
let n = require("./adapter-util.js");
let o = require("./tinypack-util.js");
let r = {};

e.prototype.directory = function (e, n) {
  if (!i.statSync(e).isDirectory()) {
    Editor.error(e + " is not a folder!");
    return;
  }
  i.readdirSync(e).forEach(
    function (e) {
      let n = this.zip;
      let o = t.join(this.srcPath, e);
      let r = i.statSync(o);

      if (r.isDirectory()) {
        n.directory(o, e);
      } else {
        if (r.isFile()) {
          n.file(e, i.readFileSync(o));
        } else {
          Editor.error(o + " was not added to zip!");
        }
      }
    }.bind({ srcPath: e, zip: this.folder(n) })
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
    async gatherInfo(a, s) {
      r.customConfig = Editor.Profile.load(
          "project://qtt-runtime.json"
        ).getSelfData();

      if (false === this.checkData(r, s, a)) {
        return false;
      }
      let c = r.customConfig;
      r.isTinyPackage = "" !== c.tinyPackageServer;
      r.projectPath = a.project;
      r.buildPath = a.dest;
      r.options = a;
      r.title = a.title;

      r.cpkName = r.customConfig.package +
      "_" +
      r.customConfig.versionName +
      "_" +
      r.customConfig.versionCode +
      ".cpk";

      let m = c.outputCpkPath;
      let u = c.useCustomCpkPath;
      r.buildResults = a.buildResults;
      r.startScene = a.startScene;

      if (true === u) {
        if ("" !== m && i.existsSync(m)) {
          r.cpkPath = t.join(m, r.cpkName);
        } else {
          Editor.log(Editor.T("qtt-runtime.out_cpk_path_error"));
          r.cpkPath = t.join(r.buildPath, r.cpkName);
        }
      } else {
        r.cpkPath = t.join(r.buildPath, r.cpkName);
      }

      r.gameConfig = {
        deviceOrientation: c.deviceOrientation,
        showStatusBar: c.showStatusBar,
        runtimeVersion: c.runtimeVersion,
      };

      r.mainfest = {
        deviceOrientation: c.deviceOrientation,
        package: c.package,
        name: c.name,
        versionName: c.versionName,
        versionCode: c.versionCode,
        icon: "logo.png",
      };

      r.JsZip = e;
      r.cpk = new e();
      await n.gatherInfo(r);
      await o.gatherInfo(r);
      return true;
    },
    checkData(e, n, o) {
      var r = e.customConfig.package;
      var a = e.customConfig.name;
      var s = e.customConfig.versionName;
      var c = e.customConfig.versionCode;
      var m = e.customConfig.icon;
      var u = true;
      var d = [];
      var p = "";

      [
        { name: Editor.T("qtt-runtime.package"), value: r },
        { name: Editor.T("qtt-runtime.name"), value: a },
        { name: Editor.T("qtt-runtime.desktop_icon"), value: m },
        { name: Editor.T("qtt-runtime.version_name"), value: s },
        { name: Editor.T("qtt-runtime.version_number"), value: c },
      ].forEach(function (e) {
        if (!e.value) {
          u = false;
          d.push(e.name);
        }
      });

      if (!u) {
        p += d.join("、") + Editor.T("qtt-runtime.not_empty");
      }

      if (m) {
        if (!i.existsSync(m)) {
          u = false;
          p += m + Editor.T("qtt-runtime.icon_not_exist");
        }
      }

      if (!r.match(/^[a-zA-Z]+[0-9a-zA-Z]*(\.[a-zA-Z]+[0-9a-zA-Z]*)*$/)) {
        u = false;
        p += Editor.T("qtt-runtime.package_name_error");
      }

      if (!a.match(/^[0-9a-zA-Z]*(\.[a-zA-Z]+[0-9a-zA-Z]*)*$/)) {
        u = false;
        p += Editor.T("qtt-runtime.game_name_error");
      }

      if (!s.match(/^[0-9]*(\.[0-9]*)*$/)) {
        p += Editor.T("qtt-runtime.game_version_name_error");
      }

      if (!c.match(/^[1-9]+[0-9]*]*$/)) {
        p += Editor.T("qtt-runtime.game_version_number_error");
      }

      return u
        ? (i.existsSync(t.join(o.dest, "remote")) &&
            "" === e.customConfig.tinyPackageServer &&
            Editor.warn(
              Editor.T("qtt-runtime.had_set_remote_without_tiny_mode")
            ),
          true)
        : (n.reply(new Error(p)), false);
    },
    async organizeResources(e) {
      let o = r.buildPath;
      return (false !== (await n.organizeResources(e)) && (i.writeJSONSync(t.join(o, "game.config.json"), r.gameConfig), i.writeJSONSync(t.join(o, "manifest.json"), r.mainfest), true));
    },
    async pack(e) {
      let a = r.cpk;
      let s = r.cpkPath;
      let c = r.buildPath;

      if (i.existsSync(s)) {
        i.unlinkSync(s);
      }

      await n.pack();
      await o.pack();
      a.directory(t.join(c, "src"), "src");
      a.directory(t.join(c, "assets"), "assets");
      a.append(r.customConfig.icon, "logo.png");
      a.append(t.join(c, "main.js"), "main.js");
      a.append(t.join(c, "game.config.json"), "game.config.json");
      a.append(t.join(c, "manifest.json"), "manifest.json");

      a
        .generateAsync({
          type: "nodebuffer",
          base64: false,
          compression: "DEFLATE",
        })
        .then(function (t) {
        i.writeFileSync(s, t);
        e.reply();
      });
    },
  };
