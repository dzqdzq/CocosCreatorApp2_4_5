var r;
var e;
var o;
var i = require("path");
var t = require("child_process").execSync;
var n = require("child_process").spawn;
var s = require("fire-fs");
var d = require("fix-path");
let u = {
  npmRunServer: function (u, c) {
    var p = (function () {
      var r = {};
      let e = (o = Editor.remote.Profile.load(
        "profile://project/vivo-runtime.json"
      ).data).npmPath;

      if (e) {
        Editor.log(Editor.T("vivo-runtime.custom_npm_path_config"), e);

        if ("win32" === process.platform) {
          r.Path = o.npmPath;
          r.Path += ";C:\\Windows\\System32";
        } else {
          r.PATH = o.npmPath;
          r.PATH += ":/usr/bin:/bin:/usr/sbin:/sbin";
        }
      } else {
        Editor.log(Editor.T("vivo-runtime.custom_npm_path_not_config"));

        if ("win32" === !process.platform &&
          -1 === process.env.PATH.indexOf(NPM_PATH)) {
          process.env.PATH += `:${NPM_PATH}`;
        }

        d();
        r = process.env;
      }

      return r;
    })();
    if (!(function (r) {
      try {
        t("node -v", { env: r });
      } catch (r) {
        return false;
      }
      return true;
    })(p)) {
      (function () {
        if (o && o.npmPath) {
          Editor.error(
            Editor.T("vivo-runtime.custom_npm_path_config_error")
          );

          return;
        }

        if ("win32" === process.platform) {
          Editor.error(
                Editor.T(
                  "vivo-runtime.not_install_nodejs_windows_error_before_preview"
                )
              );
        } else {
          Editor.error(
                Editor.T(
                  "vivo-runtime.not_install_nodejs_mac_error_before_preview"
                )
              );
        }
      })();

      return;
    }
    var v = r.dest;
    var a = i.join(v, "node_modules");
    var f = i.join(v, "dist");
    if (!s.existsSync(a) || !s.existsSync(f)) {
      Editor.error(Editor.T("vivo-runtime.buidBeforePreview"));
      return;
    }
    var m;
    var _ = "win32" === process.platform ? "npm.cmd" : "npm";
    free = n(`${_}`, ["run", "server"], { env: p, cwd: v });

    free.stdout.on("data", function (r) {
      e = free.pid;
      if ((r && -1 !== r.indexOf("地址 http:"))) {
        var o = r.toString().replace(/[\n\r]/g, "");
        m = o.match(/http:\/\/[^\s]*:\d*/)[0];
        u(m);
        return;
      }
    });

    free.stderr.on("data", function (r) {
      Editor.error(r);
    });

    free.on("exit", function (r, e) {});
    free.on("close", function (r, e) {});
  },
  setOptions: function (e) {
    r = e;
  },
  closePort: function () {
    var r = require(Editor.url("packages://vivo-runtime/lib/killPort"));

    if (e) {
      r(e, void 0);
    }

    e = void 0;
  },
  options: r,
};
module.exports = u;
