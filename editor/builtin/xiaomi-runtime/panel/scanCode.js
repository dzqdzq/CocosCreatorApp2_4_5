"use strict";
const t = require("child_process").spawn;
const i = require(Editor.url("app://editor/page/qrcode"));
const e = (require(Editor.url("packages://xiaomi-runtime/lib/utils")), require(Editor.url("packages://xiaomi-runtime/lib/killPort")));
const r = (require("path"), require("fire-fs"));
const { promisify: o } = require("util");
var n = `\n    <section style="text-align:center;">\n        <h1>{{msg}}</h1>\n        <div id="qrCode" class="qrCode"></div>\n        <ui-button v-on:confirm="openDevtools">${Editor.T(
  "xiaomi-runtime.debug_btn"
)}</ui-button>\n    </section>\n`;
Editor.Panel.extend({
  _vm: null,
  style:
    "\n    body {\n            margin: 10px;\n            background-color: transparent;\n        }\n\n        h1 {\n            color: #f90\n        }\n\n        .qrCode {\n             width:150px;\n             height:150px;\n             margin:0px auto;\n             padding: 10px;\n        }\n",
  template: n,
  ops: null,
  $: { qrCode: "#qrCode" },
  messages: {},
  async run(i) {
    if (this.pid) {
      return;
    }
    this.ops = i;
    this.pid = null;
    let e = this;

    this._vm = new window.Vue({
      el: this.shadowRoot,
      data: { msg: Editor.T("xiaomi-runtime.starting_server"), did: 0 },
      watch: {},
      destroyed: function () {
        if (this.did) {
          process.kill(this.did);
        }

        this.did = 0;
      },
      methods: {
        openDevtools: function () {
          if (this.did) {
            process.kill(this.did);
          }

          const i = t(
            "win32" === process.platform ? "npm.cmd" : "npm",
            ["run", "debug"],
            { cwd: e.ops.dest }
          );

          i.on("close", (t) => {
            this.did = null;
          });

          i.stdout.on("data", (t) => {
            this.did = i.pid;
            Editor.log(t.toString());
          });

          i.stderr.on("data", (t) => {
            Editor.error(t.toString());
          });
        },
      },
    });

    this.startDebugServer((t) => {
      if (t) {
        this._vm.msg = Editor.T("xiaomi-runtime.start_server_error");
        return;
      }
      this.genQRCode();
      this._vm.msg = "";
    });
  },
  startDebugServer(i) {
    let e = false;
    if (!r.existsSync(this.ops.dest)) {
      if (i) {
        i(true);
      }

      return;
    }
    const o = t(
      "win32" === process.platform ? "npm.cmd" : "npm",
      ["run", "server", "--", "--port", 4e3],
      { cwd: this.ops.dest }
    );

    o.on("close", (t) => {
      if (!e && i) {
        i(t);
      }

      this.pid = null;
      e = true;
    });

    o.stdout.on("data", (t) => {
      if (-1 !== t.toString().indexOf("生成HTTP服务器的二维码")) {
        if (!e && i) {
          i(false);
        }

        e = true;
      }
    });

    o.stderr.on("data", (t) => {
      if (!e && i) {
        i(true);
      }

      Editor.error(t.toString());
      e = true;
    });

    this.pid = o.pid;
  },
  genQRCode() {
    this.$qrCode.innerHTML = "";
    this.qrcode = new i(this.$qrCode, { width: 150, height: 150 });
    this.qrcode.makeCode(`http://${Editor.remote.Network.ip}:4000`);
  },
  close() {
    if (this.pid) {
      e(this.pid, 4e3);
    }

    this.pid = null;
  },
});
