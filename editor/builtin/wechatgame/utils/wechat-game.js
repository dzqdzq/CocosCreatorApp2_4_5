require("compare-versions");
const r = require("electron").dialog;
const o = Editor.Profile.load("global://settings.json");

module.exports = {
  run(e) {
    const t = require("fire-path");
    const i = require("fire-fs");
    let n;
    let a = o.get("wechatgame-app-path");
    if (!a) {
      Editor.error(Editor.T("PREFERENCES.error.wechatgame_app_path_empty"));
      return;
    }

    if ("darwin" === process.platform) {
      n = t.join(a, "Contents/Resources/app.nw/bin/cli");

      if (!i.existsSync(n)) {
        n = t.join(a, "Contents/MacOS/cli");
      }
    } else {
      n = t.join(a, "cli.bat");
    }

    if (!i.existsSync(n)) {
      r.showErrorBox(
        Editor.T("BUILDER.error.build_error"),
        Editor.T("wechatgame.client_path_error", { path: n })
      );

      return;
    }
    let s = ["-o", e.dest, "-f", "cocos"];
    console.log(`Run command : ${s.join(" ")}`);
    let c = (0, require("child_process").spawn)(n, s);

    c.stdout.on("data", function (r) {
      Editor.log(r.toString());
    });

    c.stderr.on("data", function (r) {
      Editor.error(r.toString());
    });
  },
};
