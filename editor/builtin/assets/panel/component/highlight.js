"use strict";
const t = require("fs");
const e = require("path");
const i = require("../utils/cache");
const s = require("../utils/display");

exports.template = t.readFileSync(
  e.join(__dirname, "../template/highlight.html"),
  "utf-8"
);

exports.props = ["y"];

exports.data = function () {
    return {
      show: false,
      node: null,
      name: "",
      slength: 0,
      state: 0,
      iconUrl: null,
      invalid: false,
      style: { top: 0, left: 0, width: 0, height: 0 },
      cstyle: { top: 0, height: 0 },
    };
  };

exports.watch = {
    y(t) {
      this.show = -999 !== t;
      let e = s.point(t);
      if (!e || !e.node) {
        this.node = null;
        return false;
      }

      if ("folder" === e.node.assetType || "mount" === e.node.assetType) {
        this.state = 2;
      } else {
        this.state = 3;
      }

      this.node = e.node;
    },
    node(t) {
      if (!t) {
        return;
      }
      let e = i.queryNode(t.parent);

      if (this.canAddChild(t)) {
        e = t;
      }

      let l = s.info(t.id);
      this.invalid = "sprite-frame" === l.node.assetType;
      this.name = e.name;
      this.iconUrl = e.iconUrl;
      let n = s.info(e.id);
      this.style.top = n.offset * i.lineHeight;
      this.style.left = 15 * e.level;
      this.style.width = this.$el.parentNode.scrollWidth - this.style.left - 5;
      this.style.height = n.count * i.lineHeight;
      this.cstyle.top = (l.count - 1) * i.lineHeight;
      let h = (l.offset - n.offset) * i.lineHeight - 2;
      this.cstyle.height = h >= 0 ? h : 0;
    },
  };

exports.methods = {
    updateLineStyle: (t) => `transform: translateY(${t * i.lineHeight}px);`,
    canAddChild: (t) => "folder" === t.assetType || "mount" === t.assetType,
  };
