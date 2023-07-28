"use strict";
const e = require("fire-fs");
const t = require("fire-path");
const s = require("electron").dialog;
function r(e, t) {
  if (!t) {
    t = Editor.assetdb.uuidToUrl(Editor.currentSceneUuid);
  }

  if (!t) {
    t = "Untitled";
  }

  let s = e ? "*" : "";
  Editor.Window.main.nativeWin.setTitle(
    `${Editor.T("SHARED.product_name")} - ${Editor.Project.name} - ${t}${s}`
  );
}
function i(e) {
  Editor.stashedScene = null;
  Editor.currentSceneUuid = e;
  Editor._projectLocalProfile.set("last-edit", Editor.currentSceneUuid);
  Editor._projectLocalProfile.save();
}

module.exports = {
  load() {},
  unload() {},
  messages: {
    open() {
      Editor.Panel.open("scene");
    },
    "open-by-uuid"(e, t) {
      Editor.Panel.open("scene", { uuid: t });
    },
    ready() {
      r(false);
    },
    "save-scene"(r, a, d) {
      let o = Editor.assetdb.uuidToUrl(d || Editor.currentSceneUuid);
      if (!o &&
      !(o = (function e() {
        let r = Editor.assetdb._fspath("db://assets/");

        let i = s.showSaveDialogSync(Editor.Window.main.nativeWin, {
          title: "Save Scene",
          defaultPath: r,
          filters: [{ name: "Scenes", extensions: ["fire"] }],
        });

        if (i) {
          return t.contains(r, i)
            ? "db://assets/" + t.relative(r, i)
            : (Editor.Dialog.messageBox(Editor.Window.main.nativeWin, {
                type: "warning",
                buttons: ["OK"],
                title: Editor.T("MESSAGE.warning"),
                message: Editor.T("MESSAGE.scene.save_inside_assets_message"),
                detail: Editor.T("MESSAGE.scene.save_inside_assets_detail"),
                noLink: true,
              }),
              e());
        }
      })())) {
        return r.reply(null, true);
      }
      let n = Editor.assetdb._fspath(o);

      if (e.existsSync(n)) {
        Editor.assetdb.saveExists(o, a, (e, t) => {
          if (e) {
            Editor.assetdb.error("Failed to save scene %s", o, e.stack);
            return r.reply(e);
          }
          i(t.meta.uuid);
          Editor.Ipc.sendToAll("scene:saved");
          r.reply();
        });
      } else {
        Editor.assetdb.create(o, a, (e, t) => {
          if (e) {
            Editor.assetdb.error(
              "Failed to create asset %s, messages: %s",
              o,
              e.stack
            );

            return r.reply(e);
          }
          i(t[0].uuid);
          Editor.Ipc.sendToAll("scene:saved");
          r.reply();
        });
      }
    },
    "create-prefab"(e, t, s) {
      Editor.assetdb.create(t, s, (s, r) => {
        if (s) {
          Editor.assetdb.error(
            "Failed to create prefab %s, messages: %s",
            t,
            s.stack
          );

          e.reply(s);
          return;
        }
        e.reply(null, r[0].uuid);
      });
    },
    "apply-prefab"(e, t, s) {
      let r = Editor.assetdb.uuidToUrl(t);
      Editor.assetdb.saveExists(r, s, (e, t) => {
        if (e) {
          Editor.assetdb.error(
            "Failed to apply prefab %s, messages: %s",
            r,
            e.stack
          );

          return;
        }
      });
    },
    "query-asset-info-by-uuid"(e, t) {
      let s = Editor.assetdb.uuidToFspath(t);
      if (!s) {
        return e.reply();
      }
      let r = Editor.require("app://asset-db/lib/meta").get(Editor.assetdb, t);

      if (r &&
        !r.useRawfile()) {
        s = Editor.assetdb._uuidToImportPathNoExt(t);
        s += ".json";
      }

      let i = s.replace(/\\/g, "/");
      e.reply(null, { url: i, type: r.assetType() });
    },
    "update-title"(e, t, s) {
      r(t, s);
    },
    "export-plist"(t, s, r) {
      let i = Editor.assetdb._url(s);

      if (e.existsSync(s)) {
        Editor.assetdb.saveExists(i, r, (e, s) => {
              if (e) {
                Editor.assetdb.error(
                  "Failed to save plist %s, messages: %s",
                  i,
                  e.stack
                );

                t.reply(e);
                return;
              }
              let r = s.meta;
              t.reply(null, r.uuid);
            });
      } else {
        Editor.assetdb.create(i, r, (e, s) => {
              if (e) {
                Editor.assetdb.error(
                  "Failed to create plist %s, messages: %s",
                  i,
                  e.stack
                );

                t.reply(e);
                return;
              }
              t.reply(null, s[0].uuid);
            });
      }
    },
    "set-current-scene"(e, t) {
      i(t);

      if (e.reply) {
        e.reply();
      }
    },
    "copy-editor-camera-data-to-nodes"() {
      Editor.Ipc.sendToPanel("scene", "scene:copy-editor-camera-data-to-nodes");
    },
  },
};
