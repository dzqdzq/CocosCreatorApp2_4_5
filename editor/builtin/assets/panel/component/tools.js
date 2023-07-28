"use strict";
const e = require("fs");
const t = require("path");
const r = (require("../utils/cache"), require("../utils/operation"), require("../utils/event"));
const i = require("../utils/utils");
const s = require("../utils/communication");

exports.template = e.readFileSync(
  t.join(__dirname, "../template/tools.html"),
  "utf-8"
);

exports.props = ["filter"];

exports.data = function () {
    return { input: false };
  };

exports.created = function () {
    r.on("nodes_focus", (e) => {
      this.input = !e;
    });
  };

exports.methods = {
    t: (e) => Editor.T(e),
    refresh() {
      r.emit("refresh-asset-tree");
    },
    createPopup(e) {
      s.popup("create", { x: e.x - 20, y: e.y + 20 });
    },
    showSortMenu(e) {
      s.popup("sort", { x: e.x - 20, y: e.y + 20 });
    },
    searchPopup(e) {
      s.popup("search", { x: e.x - 100, y: e.y + 25 });
    },
    onFilterAssets(e) {
      r.emit("filter-changed", e.target.value);
    },
    emptyFilter() {
      i.emptyFilter();
    },
    oInputnFocus() {
      this.input = true;
    },
    onInputBlur() {
      this.input = false;
    },
  };
