"use strict";
const e = Editor.Profile.load("global://features.json").get("cloud-function");
const t = require("fire-fs");
const a = Editor.require("packages://node-library/panel/component/home");
const o = Editor.require("packages://node-library/panel/utils/data");
let r = {
  style: t.readFileSync(
    Editor.url("packages://node-library/panel/style/home.css"),
    "utf-8"
  ),
  template: a.template,
  ready() {
    let e = {
      data: {},
      save() {
        Editor.warn("The console settings are problematic");
      },
    };

    o.set({
      global: this.profiles.global || e,
      local: this.profiles.local || e,
    });

    this._vm = new Vue({
        el: this.shadowRoot,
        data: a.data(a),
        components: a.components,
        watch: a.watch,
        methods: a.methods,
        created: a.created,
        destroyed: a.destroyed,
      });
  },
  messages: {
    "store:cloud-component-installation-completed"() {
      if (e) {
        this._vm.changeTab(1);
      }
    },
    "node-library:delete-prefab"(e, t) {
      o.deleteUserPrefab(t.id);
      o.deleteIcon(t.id);
    },
    "node-library:rename-prefab"(e, t) {
      o.event.emit("start-rename", t.id);
    },
    "node-library:set-prefab-icon"(e, t) {
      let a = Editor.Dialog.openFile({
        properties: ["openFile"],
        filters: [{ name: "Icon png", extensions: ["png"] }],
        title: "Select a PNG to exchange prefab icon",
      });
      o.setIcon(t.id, a[0]);
    },
  },
};
Editor.Panel.extend(r);
