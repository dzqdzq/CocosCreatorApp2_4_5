"use strict";
const e = require("fs");
const t = Editor.require("packages://console/panel/utils/cache");
const s = Editor.require("packages://console/panel/utils/event");
const o = Editor.require("packages://console/panel/component/console");
Editor.Panel.extend({
  style: e.readFileSync(Editor.url("packages://console/panel/style/index.css")),
  template: o.template,
  listeners: {
    "panel-resize"() {
      this._vm.length = (this.clientHeight - 56) / 20 + 3;
    },
    "panel-show"() {
      this._vm.length = (this.clientHeight - 56) / 20 + 3;
    },
  },
  messages: {
    "editor:console-log"(e, s) {
      t.add({ type: "log", message: s });
    },
    "editor:console-success"(e, s) {
      t.add({ type: "success", message: s });
    },
    "editor:console-failed"(e, s) {
      t.add({ type: "failed", message: s });
    },
    "editor:console-info"(e, s) {
      t.add({ type: "info", message: s });
    },
    "editor:console-warn"(e, s) {
      t.add({ type: "warn", message: s });
    },
    "editor:console-error"(e, s) {
      t.add({ type: "error", message: s });
    },
    "editor:console-clear"(e, s, o) {
      t.clear(s, o);
    },
    "console:query-last-error-log"(e) {
      if (!e.reply) {
        return;
      }
      let s = t.query({ collapse: this._vm.collapse, type: "error" });
      let o = null;
      if (s.length) {
        let e = s[0];
        o = { type: e.type, message: `${e.message}\n${e.info.join("\n")}` };
      }
      e.reply(null, o);
    },
    "editor:console-on-device-play"() {
      if (this._vm.aclear) {
        Editor.Ipc.sendToMain("console:clear", "^(?!.*?SyntaxError)", true);
      }
    },
  },
  ready() {
    let e = this.profiles.local;

    this._vm = new Vue({
      el: this.shadowRoot.querySelector(".console"),
      data: o.data(),
      components: o.components,
      methods: o.methods,
      created: o.created,
    });

    Editor.Ipc.sendToMain("editor:console-query", (e, s) => {
      s.forEach(t.add);
    });

    this._vm.fsize = e.get("fontsize");
    this._vm.collapse = e.get("collapse");
    this._vm.aclear = e.get("aclear");
    t.changeHeight(2 * e.get("fontsize"));
    let l = () => {
      let e = this.clientHeight;
      if (e < 20) {
        return requestAnimationFrame(l);
      }
      this._vm.length = (e - 56) / 20 + 3;
    };
    requestAnimationFrame(l);
    let a = null;

    let n = function () {
      clearTimeout(a);

      a = setTimeout(() => {
          e.save();
        }, 300);
    };

    s.on("font-size-changed", (s) => {
      e.set("fontsize", s);
      t.changeHeight(2 * s);
      n();
    });

    s.on("collapse-changed", (t) => {
      e.set("collapse", t);
      n();
    });

    s.on("auto-clear-changed", (t) => {
      e.set("aclear", t);
      n();
    });
  },
  selectAll() {},
  clear() {},
});
