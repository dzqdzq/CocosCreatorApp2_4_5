"use strict";
Vue.component("cc-markdown-preview", {
  template: "\n    <ui-markdown v-el:view></ui-markdown>\n  ",
  props: { type: String, path: String },
  watch: { path: "_updateText", type: "_updateText" },
  compiled() {
    this._updateText();
  },
  methods: {
    _updateText() {
      if (this.path && "unknown" !== this.type) {
        this._highlightCode();
      }
    },
    _highlightCode() {
      const e = require("highlight.js");
      const t = require("fire-fs");
      require("marked").setOptions({
        highlight: (t) => e.highlightAuto(t).value,
      });
      let i = t.readFileSync(this.path, { encoding: "utf-8" });
      this.$els.view.value = i;
    },
  },
});
