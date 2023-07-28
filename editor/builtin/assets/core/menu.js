"use strict";
const e = require("electron");
const t = require("fire-fs");
const s = require("fire-path");
const r = require("async");
const a = require("fire-url");
const i = require("./create-menu");
const l = require("./search");
const o = require("./sort");
const n = require("../package.json");
function d() {
  let e = Editor.Selection.contexts("asset");
  return e.length > 0 ? e[0] : "";
}
function c(e) {
  let s = Editor.assetdb.loadMetaByUuid(e);
  if (!s) {
    Editor.info(e + " does not exists in library");
    return {};
  }
  if (s.useRawfile()) {
    Editor.info("This asset does not contain in the library");
    return {};
  }
  let r = s.dests(Editor.assetdb);
  return 0 !== r.length && t.existsSync(r[0])
    ? { path: r[0], type: s.assetType() }
    : (Editor.failed(
        "The asset %s is not exists in library",
        Editor.assetdb.uuidToUrl(e)
      ),
      {});
}
function u(e, t, s) {
  let r = i();
  r.forEach((t) => {
    if (t.params) {
      t.params.push(e);
    }
  });
  let a = [
    {
      label: Editor.T("ASSETS.folder"),
      message: "assets:new-asset",
      params: [{ name: "New Folder" }, e],
    },
  ];
  a.push({ type: "separator" });
  return a.concat(r);
}

module.exports = {
  getContextTemplate: function (i) {
    const {
      assetType: l,
      allowAssign: o,
      id: E,
      copyEnable: p,
      isSubAsset: S,
      selected: T,
      allowPaste: b,
    } = i;
    var f = [
      { label: Editor.T("ASSETS.create"), enabled: !S, submenu: u(true) },
      { type: "separator" },
      {
        label: Editor.T("ASSETS.copy"),
        enabled: !!p && "mount" !== l,
        click() {
          let e = d();

          if (e) {
            Editor.Ipc.sendToPanel("assets", "assets:copy", e);
          }
        },
      },
      {
        label: Editor.T("ASSETS.paste"),
        enabled: !!p && b,
        click() {
          let e = d();

          if (e) {
            Editor.Ipc.sendToPanel("assets", "assets:paste", e);
          }
        },
      },
      { type: "separator" },
      {
        label: Editor.T("ASSETS.rename"),
        enabled: "mount" !== l && !S,
        click() {
          let e = d();

          if (e) {
            Editor.Ipc.sendToPanel(n.name, "assets:rename", e);
          }
        },
      },
      {
        label: Editor.T("ASSETS.delete"),
        enabled: "mount" !== l && !S,
        click() {
          let e = Editor.Selection.contexts("asset");

          if (e.length > 0) {
            Editor.Ipc.sendToPanel(n.name, "assets:delete", e);
          }
        },
      },
    ];
    let h = Editor.assetdb.getAssetBackupPath(Editor.assetdb.uuidToFspath(E));

    if (h &&
      t.existsSync(h) &&
      !(function (e) {
        let t = Editor.assetdb.uuidToUrl(e);
        try {
          let e = t.split(s.sep);
          return 3 === e.length.length || (4 === e.length && "" === e[3]);
        } catch (e) {
          return false;
        }
      })(E)) {
      f.push({
        label: Editor.T("ASSETS.rollback"),
        click() {
          let e = Editor.assetdb.uuidToUrl(E);

          if (1 ===
            Editor.Dialog.messageBox({
              type: "warning",
              buttons: ["Cancel", "OK"],
              title: "Rollback Asset",
              message: Editor.T("ASSETS.sure_rollback", { url: e }),
              defaultId: 1,
              cancelId: 0,
              noLink: true,
            })) {
            r.waterfall(
              [
                function (s) {
                  t.readFile(h, (t, r) => {
                    if (t) {
                      return s(t);
                    }
                    Editor.assetdb.saveExists(e, r, (t) => {
                      if (t) {
                        Editor.error(`Rollback ${e} failed: ${t.stack}`);
                        return;
                      }
                      Editor.Dialog.messageBox({
                        type: "warning",
                        buttons: ["OK"],
                        title: "Rollback Asset",
                        message: Editor.T("ASSETS.rollback_tip", { url: e }),
                        defaultId: 0,
                        cancelId: 0,
                        noLink: true,
                      });
                    });
                  });
                },
              ],
              function (e) {
                if (e) {
                  Editor.warn(Editor.T("ERROR.assets.rollback"));
                }
              }
            );
          }
        },
      });
    }

    return (f = f.concat([
      { type: "separator" },
      {
        label: Editor.T("ASSETS.find_usages"),
        enabled: "mount" !== l,
        click() {
          let e = d();

          if (e) {
            Editor.Ipc.sendToPanel(n.name, "assets:find-usages", e);
          }
        },
      },
      {
        label: Editor.isDarwin
          ? Editor.T("ASSETS.reveal_mac")
          : Editor.T("ASSETS.reveal_win"),
        enabled: !S,
        click() {
          let s = d();
          if (s) {
            let r = Editor.assetdb.uuidToFspath(s);

            if (t.existsSync(r)) {
              e.shell.showItemInFolder(r);
            } else {
              Editor.failed(
                    "Can not found the asset %s",
                    Editor.assetdb.uuidToUrl(s)
                  );
            }
          }
        },
      },
      { type: "separator" },
      {
        label: Editor.T("ASSETS.open_in_library"),
        click() {
          let e = d();
          if (e) {
            let { path: t } = c(e);

            if (t) {
              Editor.Ipc.sendToMain("assets:open-text-file-by-path", t);
            }
          }
        },
      },
      {
        label: Editor.T("ASSETS.reveal_library"),
        click() {
          let t = d();
          if (t) {
            let { path: s } = c(t);

            if (s) {
              e.shell.showItemInFolder(s);
            }
          }
        },
      },
      {
        label: Editor.T("ASSETS.reveal_hierarchy"),
        visible: "javascript" === l || "typescript" === l,
        click() {
          let e = d();
          if (e) {
            let t = Editor.assetdb.uuidToUrl(e);
            Editor.Ipc.sendToPanel(
              "hierarchy",
              "filter",
              `t:${a.basenameNoExt(t)}`
            );
          }
        },
      },
      {
        label: Editor.T("ASSETS.show_uuid"),
        click() {
          let e = d();
          if (e) {
            let t = Editor.assetdb.uuidToUrl(e);
            let s = Editor.Utils.UuidUtils.compressUuid(e, true);
            Editor.info(`${e} (${s}), ${t}`);
          }
        },
      },
    ]));
  },
  getCreateTemplate: u,
  getSearchTemplate: function () {
    return l();
  },
  getSortTemplate: function () {
    return o();
  },
};
