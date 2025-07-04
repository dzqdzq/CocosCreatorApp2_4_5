"use strict";
let e = require(Editor.url("packages://vivo-runtime/lib/vivo"));
Editor.Panel.extend({
  _vm: null,
  style:
    "\n    body {\n            margin: 10px;\n            background-color: transparent\n        }\n\n        h1 {\n            color: #f90\n        }\n\n        .qrCode {\n             width:220px;\n             height:220px;\n             margin:0px auto;\n             padding: 10px;\n        }\n",
  template:
    '\n    <section>\n        <h1>{{msg}}</h1>\n    <div style="background-color:white ;height:100%;">\n        <div id="qrCode" class="qrCode"></div>\n    </div>\n    </section>\n',
  ops: null,
  $: { qrCode: "#qrCode" },
  messages: {},
  run(n) {
    e.options = n;
    e.setOptions(n);
    this.ops = n;
  },
  ready() {
    window.abc = this._vm = new window.Vue({
      el: this.shadowRoot,
      data: { msg: "正在生成二维码，请稍等" },
      watch: {},
      methods: {},
    });
    let n = this;
    process.nextTick(() => {
      if (!e.options) {
        Editor.Panel.close("vivo-runtime.qrcode");
        return;
      }
      n._vm.$root._data.msg = Editor.T("vivo-runtime.qr_code_generating");
      e.npmRunServer(
        function (e) {
          n._vm.$root._data.msg = Editor.T("vivo-runtime.debug_scan_qr_code");

          new (require(Editor.url("packages://vivo-runtime/lib/qrcode")))(
            n.$qrCode,
            { text: e, width: 200, height: 200 }
          );
        },
        function (e, n) {
          Editor.error("npm run server errror:", e);
        }
      );
    });
  },
  close() {
    e.closePort();
  },
});
