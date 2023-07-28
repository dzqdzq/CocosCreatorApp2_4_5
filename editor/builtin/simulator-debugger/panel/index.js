"use strict";
const e = require("fire-fs");
require("fire-path");
require("fire-url");
Editor.require("packages://simulator-debugger/panel/utils/event");
Editor.Panel.extend({
  style: e.readFileSync(
    Editor.url("packages://simulator-debugger/panel/index.css")
  ),
  template: e.readFileSync(
    Editor.url("packages://simulator-debugger/panel/index.html")
  ),
  $: { webview: "#webview" },
  ready() {
    this._vm = (function (e, t) {
      return new Vue({
        el: e,
        data: { loaded: false },
        watch: {},
        methods: {},
        components: {},
        created() {},
      });
    })(this.shadowRoot);

    this._register_event();
    this.inited = false;
  },
  _register_event() {
    this.$webview.addEventListener("dom-ready", () => {
      if (!this.inited) {
        this.$webview.loadURL(
            "devtools://devtools/bundled/inspector.html?v8only=true&ws=127.0.0.1:5086/00010002-0003-4004-8005-000600070008"
          );

        this.inited = true;
      }
    });

    this.$webview.addEventListener("did-finish-load", () => {
      this._vm.loaded = true;
    });

    this.$webview.addEventListener("did-start-loading", () => {
      this._vm.loaded = false;
    });
  },
});
