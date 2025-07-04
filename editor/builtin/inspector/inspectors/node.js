(function () {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/node-header.js",
      "packages://inspector/share/node-section.js",
      "packages://inspector/share/comp-section.js",
      "packages://inspector/share/prop.js",
      "packages://inspector/share/array-prop.js",
      "packages://inspector/share/object-prop.js",
      "packages://inspector/share/event-prop.js",
      "packages://inspector/share/null-prop.js",
      "packages://inspector/share/type-error-prop.js",
      "packages://inspector/share/curve-range.js",
      "packages://inspector/share/gradient-range.js",
      "packages://inspector/share/gradient.js",
      "packages://inspector/share/shape-module.js",
    ],
    template:
      '\n      <cc-node-header :target.sync="target" :multi="multi"></cc-node-header>\n\n      <div class="props flex-1">\n        <cc-node-section :target.sync="target" :multi="multi"></cc-node-section>\n\n        <div\n          style="margin-top: 20px; margin-bottom: 20px"\n          class="layout horizontal center-center"\n        >\n          <ui-button v-el:btn style="width: 240px;"\n            @confirm="popupComponentMenu"\n          >{{T(\'INSPECTOR.add_component\')}}</ui-button>\n        </div>\n      </div>\n    ',
    data: { cssBtn: {} },
    methods: {
      popupComponentMenu() {
        let e = this.$els.btn.getBoundingClientRect();
        Editor.Ipc.sendToMain(
          "inspector:popup-comp-menu",
          e.left + 5,
          e.bottom + 5,
          this.target.uuid
        );
      },
    },
  });
})();
