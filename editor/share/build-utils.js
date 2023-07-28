const e = require("fire-fs");
const t = require("fire-path");
const i = Editor.require("app://editor/share/build-platforms");

module.exports = {
  combineDestJson({ dest: i }, o, a) {
    try {
      let s = t.join(i, a);
      let r = e.readJsonSync(s);
      Object.assign(r, o);
      Object.assign(o, r);
    } catch (e) {}
  },
  combineBuildTemplateJson({ actualPlatform: i }, o, a) {
    try {
      let s = t.join(Editor.Project.path, "build-templates", i, a);
      let r = e.readJsonSync(s);
      Object.assign(o, r);
    } catch (e) {}
  },
  getAbsoluteBuildPath: (e) => (
    t.posix.isAbsolute(e) ||
      t.win32.isAbsolute(e) ||
      (e = t.join(Editor.Project.path, e)),
    e
  ),
  getOptions(e, t) {
    if (!e) {
      e = Editor.isMainProcess
          ? Editor.Profile.load("project://builder.json")
          : Editor.remote.Profile.load("project://builder.json");
    }

    if (!t) {
      t = Editor.isMainProcess
          ? Editor.Profile.load("local://builder.json")
          : Editor.remote.Profile.load("local://builder.json");
    }

    let i = Object.assign({}, e.getSelfData(), t.getSelfData());
    this.updateOptions(i);
    return i;
  },
  getCommonOptions: function (e) {
    if (!e) {
      e = this.getOptions();
    }

    let t = Object.assign({}, e);
    delete t.keystorePath;
    delete t.keystorePassword;
    delete t.keystoreAlias;
    delete t.keystoreAliasPassword;
    return t;
  },
  updateOptions(e) {
    let o = (e.buildPath = this.getAbsoluteBuildPath(e.buildPath));
    let a = t.join(o, this._getOutputDir(e.actualPlatform) || e.actualPlatform);

    if (i[e.platform].useTemplate) {
      a = t.join(o, "jsb-" + e.template);
    }

    e.dest = a;
  },
  _getOutputDir(e) {
    let t = (
      "browser" === process.type ? Editor.Builder : Editor.remote.Builder
    ).simpleBuildTargets[e];
    return (t && t.output) || null;
  },
  supportSubpackage: (e) =>
    [
      "huawei",
      "qgame",
      "quickgame",
      "wechatgame",
      "baidugame",
      "xiaomi",
      "cocos-runtime",
      "link-sure",
      "bytedance",
    ].includes(e),
  supportZip: (e) =>
    [
      "bytedance",
      "huawei",
      "qgame",
      "quickgame",
      "wechatgame",
      "baidugame",
      "xiaomi",
      "cocos-runtime",
      "alipay",
      "jkw-game",
      "qtt-game",
      "link-sure",
    ].includes(e),
  supportRemote(e) {
    return (
      !this.isWebPlatform(e) &&
      ![
        "baidugame-subcontext",
        "wechatgame-subcontext",
        "bytedance-subcontext",
      ].includes(e)
    );
  },
  isWebPlatform: (e) =>
    ["web-mobile", "web-desktop", "fb-instant-games"].includes(e),
  isNativePlatform: (e) =>
    [
      "android",
      "huawei-agc",
      "android-instant",
      "ios",
      "mac",
      "win32",
    ].includes(e),
};
