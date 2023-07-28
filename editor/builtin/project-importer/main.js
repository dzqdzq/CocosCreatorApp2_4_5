"use strict";
const e = require("electron");
var r = false;
function o(o, t, i) {
  let n = (function (e, r) {
      var o = "";
      if (r) {
        for (var t = 0, i = r.length; t < i; t++) {
          if (o) {
            o += ",";
          }

          o += "*." + r[t];
        }
      } else {
        o = Editor.T("MAIN_MENU.file.import_select_folder");
      }
      return Editor.T("MAIN_MENU.file.import_project_fmt", {
        name: e,
        exts: o,
      });
    })(o, t);

  let c = null;

  if ((c = t
    ? e.dialog.showOpenDialogSync({
        title: n,
        filters: [{ name: o, extensions: t }],
        properties: ["openFile"],
      })
    : e.dialog.showOpenDialogSync({
        title: n,
        properties: ["openDirectory"],
      }))) {
    (function (o, t, i) {
      var n;
      function c(e, o) {
        if (n && !r) {
          var t = n;
          n = null;
          t.nativeWin.destroy();
        }
        Editor.error(o);
      }
      e.ipcMain.once("app:import-project-abort", c);
      var p = false;
      Editor.App.spawnWorker(
        "app://editor/builtin/project-importer/core/import-worker",
        function (a, s) {
          var l;
          n = a;

          if (!p) {
            p = true;

            s.once("closed", function () {
              if (!l) {
                e.ipcMain.removeListener("app:import-project-abort", c);
              }
            });
          }

          n.send(
            "app:init-import-worker",
            function (e) {
              if (e) {
                Editor.error(e);
                l = true;

                if (!(!n || r)) {
                  n.close();
                  n = null;
                }
              } else {
                if (n) {
                  Editor.Metrics.trackEvent({
                        category: "Project",
                        action: "Import Project",
                        label: t,
                      });

                  n.send(
                    "app:import-project",
                    o,
                    i,
                    function (e) {
                      if (e) {
                        Editor.error(e);
                      }

                      if (!(!n || r)) {
                        n.close();
                        n = null;
                      }
                    },
                    -1
                  );
                }
              }
            },
            -1
          );
        },
        r
      );
    })(c[0], o, i);
  }
}
module.exports = {
  messages: {
    "open-studio": function (e) {
      let r = require("./core/studio/studio-importer");
      o(
        r.name,
        r.exts,
        "packages://project-importer/core/studio/studio-importer"
      );
    },
    "open-builder": function (e) {
      let r = require("./core/ccb/ccbproj-importer");
      o(
        r.name,
        r.exts,
        "packages://project-importer/core/ccb/ccbproj-importer"
      );
    },
  },
};
