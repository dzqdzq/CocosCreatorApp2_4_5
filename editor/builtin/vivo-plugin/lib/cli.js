var { exec: t, execSync: n } = require("child_process");
var e = require("path");
var i = require("fire-fs");
var o = require("fix-path");
var r = require("net");
function s(t) {
  var n = new r.Socket();
  var e = false;

  n.connect("443", "www.google-analytics.com", () => {
    n.end();

    if (false === e) {
      e = true;
      t(true);
    }
  });

  setTimeout(function () {
    n.end();

    if (false === e) {
      e = true;
      t(false);
    }
  }, 1e3);
}
let a = {
  init: function (t, n, e) {
    this.options = t;
    this.initEnvironmentPath(n, e);
  },
  initVivoProject: function (n) {
    Editor.log(Editor.T("vivo-runtime.installing_npm_network"));

    t(
      "mg init qgame --force",
      { env: this.environmentPath, cwd: e.join(this.options.dest, "..") },
      (t) => {
        n(t);
      }
    );
  },
  initEnvironmentPath: function (t, n) {
    this.environmentPath = {};

    if (t) {
      Editor.log(Editor.T("vivo-runtime.custom_npm_path_config"), t);

      if ("win32" === process.platform) {
        this.environmentPath.Path = t;
      } else {
        this.environmentPath.PATH = t;
        this.environmentPath.PATH += ":/usr/bin:/bin:/usr/sbin:/sbin";
      }
    } else {
      if (n) {
        Editor.log(Editor.T("vivo-runtime.custom_npm_path_not_config"));
      }

      o();
      this.environmentPath = process.env;
    }
  },
  isInitVivoProject: function () {
    return !(
      !i.existsSync(e.join(this.options.dest, "node_modules")) ||
      i.existsSync(e.join(this.options.dest, "node_modules", ".staging"))
    );
  },
  isInstallVivoMinigameTool: function () {
    try {
      result = n("mg -v", { env: this.environmentPath });
    } catch (t) {
      return false;
    }
    return true;
  },
  isCliProject: function () {
    return !!i.existsSync(
      e.join(this.options.dest, "node_modules", "@vivo-minigame")
    );
  },
  getEnvirommentPath: function () {
    return this.environmentPath;
  },
  isInstallNodeJs: function (t, e) {
    try {
      n("node -v", { env: this.environmentPath });
    } catch (n) {
      return e
        ? (t.reply(
            new Error(Editor.T("vivo-runtime.custom_npm_path_config_error"))
          ),
          void 0)
        : (Editor.Ipc.sendToWins("builder:events", "npmPath-show"),
          t.reply(),
          "win32" === process.platform
            ? Editor.log(
                Editor.T("vivo-runtime.not_install_nodejs_windows_error")
              )
            : Editor.log(Editor.T("vivo-runtime.not_install_nodejs_mac_error")),
          false);
    }
    return true;
  },
  isInstallQGameAdapter: function () {
    return !!i.existsSync(this.getQGameAdapterPath());
  },
  installQGameAdapter: function (n) {
    var e = this;
    s(function (i) {
      if (false === i) {
        n("no internet");
        return;
      }
      var o = "win32" === process.platform ? "npm.cmd" : "npm";
      t(
        `${o} i -S @qgame/adapter@latest`,
        { env: e.environmentPath, cwd: e.options.dest },
        (t) => {
          n(t);
        }
      );
    });
  },
  isLatestVersion: function (n) {
    let o = this;
    s(function (r) {
      if (false === r) {
        n(false);
        return;
      }
      if (!o.isInstallQGameAdapter()) {
        n(false);
        return;
      }

      var s = e.join(
          o.options.dest,
          "node_modules",
          "@qgame",
          "adapter",
          "package.json"
        );

      var a = i.readJsonSync(s, { throws: false });
      if (null === a) {
        n(false);
        return;
      }
      Editor.log("the current version @qgame/adapter is:", a.version);
      var d = "win32" === process.platform ? "npm.cmd" : "npm";
      t(
        `${d} view @qgame/adapter@latest version`,
        { env: o.environmentPath, cwd: o.options.dest },
        (t, e) => {
          if (t) {
            if (n) {
              n(o.isInstallQGameAdapter(), t);
            }

            return;
          }
          let i = e.toString().trim();
          Editor.log("the latest version of @qgame/adapter is:", i);
          if (a && a.version === i) {
            n(true);
            return;
          }
          n(false);
        }
      );
    });
  },
  getQGameAdapterPath: function () {
    return e.join(
      this.options.dest,
      "node_modules",
      "@qgame",
      "adapter",
      "dist",
      "main.js"
    );
  },
  isSupportSeparateEngine: function (t) {
    var n = e.join(this.options.dest, "package.json");

    var o = i.readJsonSync(n, { throws: false }).devDependencies[
      "@vivo-minigame/cli-service"
    ];

    return (
      parseInt(o.replace(/[^\d]/g, "")) >=
      parseInt("1.3.0".replace(/[^\d]/g, ""))
    );
  },
};
module.exports = a;
