"use strict";
const e = require("highlight.js");

const { lineNumbersBlock: n } = Editor.require(
  "packages://inspector/utils/highlightjs-line-numbers"
);

Vue.component("cc-code-preview", {
  template:
    '\n    <div class="code-preview">\n      <style type="text/css">\n        @import url(\'packages://inspector/share/code-preview.tomorrow-night-eighties.css\');\n        \n        .code-preview {\n            display: flex;\n            overflow: hidden;\n        }\n        \n        pre.code {\n          position: relative;\n          overflow: auto;\n\n          border: 1px solid #212121;\n          background: #333;\n\n          margin: 0px;\n          padding: 10px;\n          font-size: 12px;\n          font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;\n\n          -webkit-user-select: text;\n          cursor: auto;\n        }\n\n        pre.code::selection {\n          background: #007acc;\n        }\n\n        pre.code * {\n          -webkit-user-select: text;\n        }\n\n        pre.code *::selection {\n          background: #007acc;\n        }\n\n        /* highlightjs-line-numbers */\n        .hljs-ln td.hljs-ln-numbers {\n            user-select: none;\n\n            text-align: center;\n            color: rgba(232, 206, 206, 0.3);\n            border-right: 2px solid rgba(232, 206, 206, 0.3);\n            vertical-align: top;\n            padding-right: 5px;\n        }\n        .hljs-ln td.hljs-ln-code {\n            padding-left: 10px;\n        }\n        .hljs-ln{\n          border-collapse:collapse\n        } \n        .hljs-ln td{\n          padding:0\n        } \n        .hljs-ln-n:before{\n          content:attr(data-line-number)\n        }\n      </style>\n      <pre v-el:code class="code flex-1"></pre>\n    </div>\n  ',
  props: { type: String, path: String, code: String },
  watch: { path: "_updateText", type: "_updateText", code: "_showCode" },
  compiled() {
    this._updateText();
  },
  methods: {
    _updateText() {
      if ((this.path || this.code) &&
        "unknown" !== this.type) {
        if (this.code && !this.path) {
          this._showCode();
        } else {
          this._highlightCode();
        }
      }
    },
    _highlightCode() {
      const e = require("fire-fs");
      const n = require("event-stream");
      let t = e.createReadStream(this.path, { encoding: "utf-8" });
      let i = 400;
      let o = "";

      let s = t
        .pipe(n.split())
        .pipe(
          n.mapSync((e) => {
            o += e + "\n";

            if (--i <= 0) {
              o += "...\n";
              t.close();
              s.push(null);
              s.end();
            }
          })
        )
        .on(
          "close",
          function (e) {
            if (e) {
              throw e;
            }
            this.code = o;
          }.bind(this)
        );
    },
    _showCode() {
      let t = this.$els.code;
      if (!t) {
        return;
      }
      let i = this.code;
      if ("text" !== this.type) {
        let o = e.highlight(this.type, i);
        t.innerHTML = o.value;
        n(t);
      } else {
        t.innerHTML = i;
      }
    },
  },
});
