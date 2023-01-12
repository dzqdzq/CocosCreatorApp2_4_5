"use strict";
const e = require("electron").BrowserWindow,
  o = require("./core/menu");
require("./core/external-app");
module.exports = {
  panel_is_open: !1,
  has_cf: !1,
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
      return !1;
    }
  },
  async load() {
    (this.has_cf = await this.checkCF()),
      this.has_cf || Editor.Panel.close("cloud-function");
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
          e && (Editor.Panel.close("cloud-function"), Editor.Package.unload(e));
        }
      } catch (e) {}
    },
    "print-to-console"(e, o, n) {
      "object" == typeof n && (n = JSON.stringify(n, null, "\t")),
        "log" === o
          ? Editor.log(n)
          : "error" === o
          ? Editor.error(n)
          : "info" === o
          ? Editor.info(n)
          : "warn" === o
          ? Editor.warn(n)
          : "success" === o
          ? Editor.success(n)
          : "failed" === o && Editor.failed(n);
    },
    "panel-changed"(e, o) {
      this.panel_is_open = o;
    },
    "env-changed"(e, o) {
      this.panel_is_open &&
        Editor.Ipc.sendToPanel(
          "cloud-function",
          "cloud-function:env-changed",
          o,
          (o, n) => {
            e.reply && e.reply(null, n);
          }
        );
    },
    refresh(e) {
      this.panel_is_open &&
        Editor.Ipc.sendToPanel("cloud-function", "cloud-function:refresh");
    },
    hint(e, o) {
      this.panel_is_open &&
        Editor.Ipc.sendToPanel("cloud-function", "cloud-function:hint", o);
    },
    "query-tcb-safety-source"(e, o, n) {
      this.panel_is_open &&
        Editor.Ipc.sendToPanel(
          "cloud-function",
          "cloud-function:query-tcb-safety-source",
          o,
          n,
          (o, n) => {
            e.reply && e.reply(null, n);
          }
        );
    },
    "query-tcb-safety-source-available"(e, o, n) {
      this.panel_is_open &&
        Editor.Ipc.sendToPanel(
          "cloud-function",
          "cloud-function:query-tcb-safety-source-available",
          o,
          n,
          (o, n) => {
            e.reply && e.reply(null, n);
          }
        );
    },
    "popup-create-menu"(n, t, r) {
      let c = o.getCreateTemplate(),
        i = new Editor.Menu(c, n.sender);
      (t = Math.floor(t)),
        (r = Math.floor(r)),
        i.nativeMenu.popup(e.fromWebContents(n.sender), t, r),
        i.dispose();
    },
    "popup-context-menu"(n, t, r, c, i, a, s) {
      let l = o.getContextTemplate(c, i, a, s),
        u = new Editor.Menu(l, n.sender);
      (t = Math.floor(t)),
        (r = Math.floor(r)),
        u.nativeMenu.popup(e.fromWebContents(n.sender), t, r),
        u.dispose();
    },
  },
};
