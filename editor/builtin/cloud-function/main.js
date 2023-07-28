"use strict";
const e = require("electron").BrowserWindow;
const o = require("./core/menu");
require("./core/external-app");

module.exports = {
  panel_is_open: false,
  has_cf: false,
  async checkCF() {
    try {
      const e = require("./core/net");
      return (
        void 0 !==
        (
          await e.post(
            "https://creator-api.cocos.com/api/service/lists",
            `lang=${Editor.lang}&cs_require=1x`
          )
        ).data.find((e) => "service-tcb" === e.service_component_name)
      );
    } catch (e) {
      return false;
    }
  },
  async load() {
    this.has_cf = await this.checkCF();

    if (!this.has_cf) {
      Editor.Panel.close("cloud-function");
    }
  },
  unload() {},
  messages: {
    open() {
      Editor.Panel.open("cloud-function");
    },
    async "editor:ready"() {
      try {
        if (!this.has_cf) {
          let e = Editor.Package.packagePath("cloud-function");

          if (e) {
            Editor.Panel.close("cloud-function");
            Editor.Package.unload(e);
          }
        }
      } catch (e) {}
    },
    "print-to-console"(e, o, n) {
      if ("object" == typeof n) {
        n = JSON.stringify(n, null, "\t");
      }

      if ("log" === o) {
        Editor.log(n);
      } else {
        if ("error" === o) {
          Editor.error(n);
        } else {
          if ("info" === o) {
            Editor.info(n);
          } else {
            if ("warn" === o) {
              Editor.warn(n);
            } else {
              if ("success" === o) {
                Editor.success(n);
              } else {
                if ("failed" === o) {
                  Editor.failed(n);
                }
              }
            }
          }
        }
      }
    },
    "panel-changed"(e, o) {
      this.panel_is_open = o;
    },
    "env-changed"(e, o) {
      if (this.panel_is_open) {
        Editor.Ipc.sendToPanel(
          "cloud-function",
          "cloud-function:env-changed",
          o,
          (o, n) => {
            if (e.reply) {
              e.reply(null, n);
            }
          }
        );
      }
    },
    refresh(e) {
      if (this.panel_is_open) {
        Editor.Ipc.sendToPanel("cloud-function", "cloud-function:refresh");
      }
    },
    hint(e, o) {
      if (this.panel_is_open) {
        Editor.Ipc.sendToPanel("cloud-function", "cloud-function:hint", o);
      }
    },
    "query-tcb-safety-source"(e, o, n) {
      if (this.panel_is_open) {
        Editor.Ipc.sendToPanel(
          "cloud-function",
          "cloud-function:query-tcb-safety-source",
          o,
          n,
          (o, n) => {
            if (e.reply) {
              e.reply(null, n);
            }
          }
        );
      }
    },
    "query-tcb-safety-source-available"(e, o, n) {
      if (this.panel_is_open) {
        Editor.Ipc.sendToPanel(
          "cloud-function",
          "cloud-function:query-tcb-safety-source-available",
          o,
          n,
          (o, n) => {
            if (e.reply) {
              e.reply(null, n);
            }
          }
        );
      }
    },
    "popup-create-menu"(n, t, r) {
      let c = o.getCreateTemplate();
      let i = new Editor.Menu(c, n.sender);
      t = Math.floor(t);
      r = Math.floor(r);
      i.nativeMenu.popup(e.fromWebContents(n.sender), t, r);
      i.dispose();
    },
    "popup-context-menu"(n, t, r, c, i, a, s) {
      let l = o.getContextTemplate(c, i, a, s);
      let u = new Editor.Menu(l, n.sender);
      t = Math.floor(t);
      r = Math.floor(r);
      u.nativeMenu.popup(e.fromWebContents(n.sender), t, r);
      u.dispose();
    },
  },
};
