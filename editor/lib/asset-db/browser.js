"use strict";
const t = require("path");
const e = require("../../../asset-db");
Editor.metaBackupPath = "temp/RemovedMetas";
Editor.assetBackupPath = "temp/BackupAssets";
Editor.log("Initializing Asset Database");
const a = new e({
  cwd: t.join(Editor.Project.path),
  library: "library",
  dev: Editor.dev,
  cachePath: t.join(Editor.Project.path, "temp/general-asset-caches"),
  metaBackupPath: t.join(Editor.Project.path, Editor.metaBackupPath),
  assetBackupPath: t.join(Editor.Project.path, Editor.assetBackupPath),
});
Editor.libraryPath = a.library;
Editor.importPath = a._importPath;

Editor.externalMounts = (function (e) {
    if (!e || !Array.isArray(e)) {
      return null;
    }
    for (
      var a = [], r = ["assets", "internal"], i = 0, n = e.length;
      i < n;
      i++
    ) {
      let n = e[i];

      n = t.isAbsolute(n)
          ? t.normalize(n)
          : t.normalize(t.join(Editor.Project.path, n));

      if (
        (!_checkMountValid(n))
      ) {
        Editor.warn(`${n} is not a valid mount path.`);
        continue;
      }
      let o = _getUniqueName(t.basename(n), r);
      r.push(o);
      a.push({ path: n, name: o });
    }
    return a;
  })(Editor.argv.mount);

Editor.mountsWritable = Editor.argv.writable;
const r = ["asset-db:watch-state-changed", "asset-db:state-changed"];
a.setEventCallback((t, e) => {
  if (r.indexOf(t) >= 0) {
    if (Editor.Window.main) {
      Editor.Ipc.sendToMainWin(t, e);
    }
  } else {
    Editor.Ipc.sendToAll(t, e);
  }
});

module.exports = new (class {
  get loading() {
    return !!this.loadingWin;
  }
  set loading(t) {
    t = !!t;
    let e = Editor.Window.main;

    if (t &&
      e) {
      e.nativeWin.webContents.send(
        "update-loading-tips",
        Editor.T("MESSAGE.assets.import_waiting")
      );
    }
  }
  constructor(t) {
    this.assetdb = t;
  }
  async mountInternal() {
    return new Promise((t, e) => {
      Editor.assetdb.mount(
        Editor.url("unpack://static/default-assets/"),
        "internal",
        { hidden: !Editor.showInternalMount, readonly: !Editor.dev },
        (a) => {
          if (a) {
            e(a);
          } else {
            t();
          }
        }
      );
    });
  }
  async mountExternal() {
    if (Editor.externalMounts && 0 !== Editor.externalMounts.length) {
      return Promise.all(
        Editor.externalMounts.map(
          (t) =>
            new Promise((e, a) => {
              Editor.assetdb.mount(
                t.path,
                t.name,
                { readonly: !Editor.mountsWritable },
                (t) => {
                  if (t) {
                    a(t);
                  } else {
                    e();
                  }
                }
              );
            })
        )
      );
    }
  }
  async mountMain() {
    return new Promise((e, a) => {
      Editor.assetdb.mount(
        t.join(Editor.Project.path, "assets"),
        "assets",
        (t) => {
          if (t) {
            a(t);
          } else {
            e();
          }
        }
      );
    });
  }
  async init() {
    return new Promise((t, e) => {
      Editor.assetdb.init((e, a) => {
        Editor.assetdbInited = true;
        t();
      });
    });
  }
})(a);
