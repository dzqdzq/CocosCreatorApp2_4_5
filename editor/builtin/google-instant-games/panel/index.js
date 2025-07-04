"use strict";
const e = Editor.require("packages://google-instant-games/panel/grid");
window.customElements.define("google-instant-games-grid", e);
const t = require("fs");
const a = Editor.require("packages://google-instant-games/panel/component/home");
const s = Editor.require("packages://google-instant-games/panel/lib/record");
const o = Editor.require("packages://google-instant-games/panel/lib/advice");
Editor.Panel.extend({
  listeners: {
    "panel-resize"() {
      this.vm.width = this.clientWidth;
    },
  },
  style: t.readFileSync(
    Editor.url("packages://google-instant-games/panel/style/index.css")
  ),
  template: a.template,
  messages: {
    "google-instant-games:update-list"(e, t) {
      o.emit("manual-add-resource", t);
      e.reply();
    },
    "google-instant-games:query-last-resources"(e) {
      e.reply(null, s.queryLastResource());
    },
  },
  run(e) {
    this.recordPath = null;

    if (e && e.recordPath) {
      this.recordPath = e.recordPath;
    }
  },
  ready() {
    o.on("query-record-path", () => {
      o.emit("query-record-path-ret", this.recordPath);
    });

    process.nextTick(() => {
      this.vm = new Vue({
        el: this.shadowRoot,
        data: a.data(),
        components: a.components,
        created: a.created,
        methods: a.methods,
      });

      this.vm.width = this.clientWidth;
    });
  },
  close() {
    if (!this.vm.canClose()) {
      return (0 === Editor.Dialog.messageBox({
        type: "warning",
        title: Editor.T("MESSAGE.warning"),
        message: Editor.T("MESSAGE.refactor.close_confirm"),
        buttons: [Editor.T("MESSAGE.yes"), Editor.T("MESSAGE.no")],
        defaultId: 0,
        cancelId: 1,
        noLink: true,
      }));
    }
    Editor.Panel.close("google-instant-games.manual");
  },
  save(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    o.emit("record-save");
  },
});
