"use strict";
const e = require("fs");
const t = Editor.require("packages://google-instant-games/panel/component/manual");
Editor.Panel.extend({
  listeners: {
    "panel-resize"() {
      this.vm.width = this.clientWidth;
    },
  },
  style: e.readFileSync(
    Editor.url("packages://google-instant-games/panel/style/index.css"),
    "utf8"
  ),
  template: t.template,
  messages: {},
  ready() {
    this.vm = new Vue({
      el: this.shadowRoot,
      data: t.data(),
      components: t.components,
      created: t.created,
      methods: t.methods,
    });

    this.vm.width = this.clientWidth;
  },
});
