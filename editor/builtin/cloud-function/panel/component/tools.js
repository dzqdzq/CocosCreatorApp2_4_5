"use strict";
const e = require("fs");
const t = require("path");
const n = (require("../utils/cache"), require("../utils/operation"), require("../utils/event"));
const r = require("../utils/utils");
const i = require("../utils/communication");

exports.template = e.readFileSync(
  t.join(__dirname, "../template/tools.html"),
  "utf-8"
);

exports.props = ["filter"];

exports.data = function () {
    return { input: false, current_env_id: "" };
  };

exports.created = function () {
  n.on("nodes_focus", (e) => {
    this.input = !e;
  });

  n.on("env_changed", (e) => {
    this.current_env_id = "" === e || "undefinedenv" === e
      ? this.t("cloud-function.not-env")
      : e;
  });

  var e = r.getCurrentEnvId();
  this.current_env_id = "" === e || "undefinedenv" === e ? this.t("cloud-function.not-env") : e;
};

exports.methods = {
    t: (e) => Editor.T(e),
    refresh() {
      n.emit("refresh-node-tree");
    },
    createPopup(e) {
      if (r.checkedCurrentEnvId()) {
        i.popup("create", { x: e.x - 20, y: e.y + 20 });
      }
    },
    onFilterAssets() {
      n.emit("filter-changed", event.target.value);
    },
    emptyFilter() {
      r.emptyFilter();
    },
    oInputnFocus() {
      this.input = true;
    },
    onInputBlur() {
      this.input = false;
    },
  };
