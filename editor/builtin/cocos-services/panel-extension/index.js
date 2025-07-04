let e = require("fs");
let t = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
Editor.Panel.extend({
  style: "",
  template: e.readFileSync(
    Editor.url("packages://cocos-services/panel-extension/index.html"),
    "utf-8"
  ),
  ready() {
    const e = document.createElement("style");
    e.innerHTML = "ui-dock-tabs#tabs {display: none;}";
    document.querySelector("ui-dock-panel").shadowRoot.appendChild(e);
  },
  run(e) {
    this._vm = (function (e, n) {
      return new window.Vue({
        el: e.shadowRoot,
        data: { componentName: n.service_component_name },
        created() {
          t.registerServiceComponent(this.componentName);
        },
        methods: {
          utils_t: function (e, ...t) {
            return utils.t(e, ...t);
          },
        },
      });
    })(this, e);

    var n = t.readServicePackageInfo(e.service_component_name);
    document.title = n.panel.title;

    Editor.Ipc.sendToMain(
      "cocos-services:change-float-window-size",
      n.panel.width,
      n.panel.height
    );
  },
  messages: {
    "vue-test:hello"(e) {
      this.$label.innerText = "Hello!";
    },
  },
});
