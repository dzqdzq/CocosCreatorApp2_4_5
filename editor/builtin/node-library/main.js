"use strict";
const e = require("electron").BrowserWindow;
const o = require("./core/menu");
const n = require("path");
const t = require("fs-extra");
const r = (require("util"), require("./panel/utils/prefab"));

module.exports = {
  load() {
    Editor.Ipc.sendToAll("node-library:update-menu", true);
  },
  unload() {
    Editor.Ipc.sendToAll("node-library:update-menu", false);
  },
  lock: false,
  messages: {
    open() {
      Editor.Panel.open("node-library");
    },
    "store:cloud-component-installation-completed"() {
      Editor.Ipc.sendToAll("node-library:update-menu", true);
    },
    "node-library:popup-prefab-menu"(n, t, s, i) {
      let a = r.creator.some((e) => e.prefab.some((e) => e.uuid === i.id));
      i.modify = !a;
      var c = o.getPrefabMenuTemplate(i);
      var u = new Editor.Menu(c, n.sender);
      t = Math.floor(t);
      s = Math.floor(s);
      u.nativeMenu.popup(e.fromWebContents(n.sender), t, s);
      u.dispose();
    },
    async "import-cloud-component"(e, o) {
      e.reply = e.reply || function () {};
      const r = {
        json: n.join(o, "./package.json"),
        envJSON: n.join(Editor.Project.path, "./settings/serverless.json"),
        assets: n.join(o, "assets"),
        cloudFunction: n.join(o, "./cloud-function"),
      };
      if (!t.existsSync(r.json)) {
        return e.reply(new Error("package.json is not found."));
      }
      try {
        const a = t.readJSONSync(r.json);
        let c = "undefinedenv";
        if (t.existsSync(r.envJSON)) {
          const e = t.readJSONSync(r.envJSON);
          c = e.env_id || "undefinedenv";
        }
        const u = {
          cloud: n.join(Editor.Project.path, "assets/cloud-component"),
          assets: n.join(Editor.Project.path, "assets/cloud-component", a.name),
          cloudFunction: n.join(
            Editor.Project.path,
            "serverless/cloud-function",
            c
          ),
        };

        if (!t.existsSync(u.cloud)) {
          t.mkdirSync(u.cloud);

          await new Promise((e, o) => {
            Editor.assetdb.refresh("db://assets", (n) => {
              if (n) {
                return o(n);
              }
              e();
            });
          });
        }

        await t.copy(r.assets, u.assets);

        if (t.existsSync(r.cloudFunction)) {
          (await t.copy(r.cloudFunction, u.cloudFunction));
        }

        var s = n.join(o, "install.js");
        if (t.existsSync(s)) {
          if (this.lock) {
            return;
          }
          this.lock = true;
          try {
            delete require.cache[require.resolve(s)];
            var i = false;
            await new Promise((e, o) => {
              var n = {
                assetsPath: u.assets,
                cloudPath: u.cloudFunction,
                envID: c,
              };

              require(s).main(n, (n) => {
                if (n) {
                  return o(n);
                }
                i = true;
                e();
              });

              if (!i) {
                setTimeout(() => o("Operation Timeout."), 5e3);
              }
            });
          } catch (e) {
            throw (t.removeSync(u.assets), e);
          } finally {
            this.lock = false;
          }
        }
        await new Promise((e, o) => {
          Editor.assetdb.refresh("db://assets/cloud-component", (n) => {
            if (n) {
              return o(n);
            }
            e();
          });
        });
        const d = await new Promise((e, o) => {
          Editor.Ipc.sendToMain(
            "asset-db:query-uuid-by-url",
            `db://assets/cloud-component/${a.name}/${a.name + ".prefab"}`,
            (n, t) => {
              if (n) {
                return o(n);
              }
              e(t);
            },
            -1
          );
        });
        e.reply(null, d);
      } catch (o) {
        Editor.error(o);
        return e.reply(o);
      }
    },
  },
};
