let e = require("./jszip.min.js"),
  t = require("path"),
  i = require("fs-extra"),
  r = (require("./worker-util.js"), require("./adapter-util.js")),
  a = require("./tinypack-util.js"),
  o = require("./subpackage-util.js"),
  n = {};
(e.prototype.directory = function (e, r) {
  if (!i.statSync(e).isDirectory())
    return Editor.error(e + " is not a folder!"), void 0;
  i.readdirSync(e).forEach(
    function (e) {
      let r = this.zip,
        a = t.join(this.srcPath, e),
        o = i.statSync(a);
      o.isDirectory()
        ? r.directory(a, e)
        : o.isFile()
        ? r.file(e, i.readFileSync(a))
        : Editor.error(a + " was not added to zip!");
    }.bind({ srcPath: e, zip: this.folder(r) })
  );
}),
  (e.prototype.append = function (e, t) {
    if (!i.statSync(e).isFile())
      return Editor.error(e + " is not a file!"), void 0;
    this.file(t, i.readFileSync(e));
  }),
  (module.exports = {
    async gatherInfo(s, c) {
      if (
        ((n.customConfig = Editor.Profile.load(
          "project://link-sure-runtime.json"
        ).getSelfData()),
        !1 === this.checkData(n, s, c))
      )
        return !1;
      n.md5Cache = c.md5Cache;
      let u = n.customConfig;
      (n.isTinyPackage = "" !== u.tinyPackageServer),
        (n.projectPath = c.project),
        (n.buildPath = c.dest),
        (n.options = c),
        (n.title = c.title),
        (n.cpkName = c.title + ".cpk");
      let p = u.outputCpkPath,
        d = u.useCustomCpkPath;
      return (
        (n.buildResults = c.buildResults),
        (n.startScene = c.startScene),
        !0 === d
          ? "" !== p && i.existsSync(p)
            ? (n.cpkPath = t.join(p, n.cpkName))
            : (Editor.log(Editor.T("link-sure-runtime.out_cpk_path_error")),
              (n.cpkPath = t.join(n.buildPath, n.cpkName)))
          : (n.cpkPath = t.join(n.buildPath, n.cpkName)),
        (n.gameConfig = {}),
        (n.JsZip = e),
        (n.cpk = new e()),
        await r.gatherInfo(n),
        await a.gatherInfo(n),
        await o.gatherInfo(n),
        !0
      );
    },
    checkData: (e, r, a) => (
      0,
      i.existsSync(t.join(a.dest, "remote")) &&
        "" === e.customConfig.tinyPackageServer &&
        Editor.warn(
          Editor.T("link-sure-runtime.had_set_remote_without_tiny_mode")
        ),
      !0
    ),
    async organizeResources(e) {
      let a = n.buildPath;
      return (
        !1 !== (await r.organizeResources(e)) &&
        (await o.organizeResources(),
        i.writeJSONSync(t.join(a, "game.config.json"), n.gameConfig),
        !0)
      );
    },
    async pack(e) {
      let s = n.cpk,
        c = n.cpkPath,
        u = n.buildPath;
      i.existsSync(c) && i.unlinkSync(c),
        await r.pack(),
        await a.pack(),
        await o.pack(),
        s.directory(t.join(u, "src"), "src"),
        s.directory(t.join(u, "assets"), "assets"),
        s.append(t.join(u, "main.js"), "main.js"),
        s.append(t.join(u, "game.config.json"), "game.config.json"),
        s
          .generateAsync({
            type: "nodebuffer",
            base64: !1,
            compression: "DEFLATE",
          })
          .then(function (t) {
            i.writeFileSync(c, t), e.reply();
          });
    },
  });
