"use strict";
const e = require("fs");
const t = require("path");
const i = (require("fire-url"), require("../utils/cache"));
const s = require("../utils/operation");
const o = require("../utils/event");
const l = (require("../utils/display"), require("../utils/communication"));
const r = (require("../utils/utils"), require("../../selection"));

exports.template = e.readFileSync(
  t.join(__dirname, "../template/nodes.html"),
  "utf-8"
);

exports.props = ["length"];

exports.components = {
    node: require("./node"),
    highlight: require("./highlight"),
  };

exports.created = function () {
    o.on("nodes_focus", (e) => {
      this.focused = e;

      if (e && this.$el) {
        this.$el.parentElement.focus();
      }
    });
  };

exports.data = function () {
    return {
      focused: false,
      start: 0,
      nodes: i.queryShowNodes(),
      list: [],
      allNodes: i.queryNodes(),
      uh: { height: 0 },
      y: -999,
      highlight: { node: null, state: 0 },
    };
  };

exports.watch = {
    start() {
      this.reset();
    },
    length() {
      this.reset();
    },
    nodes() {
      this.reset();
    },
  };

exports.methods = {
    reset() {
      if (!this._updateLock) {
        this._updateLock = true;

        requestAnimationFrame(() => {
          this._updateLock = false;
          this.updateShowList();
        });
      }
    },
    updateShowList() {
      let e = i.queryShowNodes();
      this.uh.height = 0;
      this.list.splice(0);
      let t = this.start + Math.ceil(this.length);
      t = t > e.length ? e.length : t;
      for (let i = this.start; i < t; i++) {
        this.list.push(e[i]);
      }
      this.uh.height = e.length * i.lineHeight + 4;
    },
    onMouseDown(e) {
      if (2 === e.button) {
        r.setContext("cloud-function", null);
        l.popup("context", { x: e.clientX, y: e.clientY });
        return;
      }
      r.select("cloud-function");
    },
    onScroll(e) {
      let t = e.target.scrollTop;
      this.start = (t / i.lineHeight) | 0;
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    scrollIfNeeded(e) {
      let t = i.queryNode(e);
      if (!t) {
        return;
      }
      let s = i.queryShowNodes().indexOf(t);
      if (-1 === s) {
        return;
      }
      let o = s * i.lineHeight;
      let l = this.$el.scrollTop + this.$el.clientHeight - i.lineHeight - 2;

      if (o < this.$el.scrollTop - 2) {
        this.$el.scrollTop -= this.$el.scrollTop - 2 - o;
      } else {
        if (o >= l) {
          this.$el.scrollTop += o - l;
        }
      }
    },
    scrollToItem(e) {
      let t = i.queryNode(e);
      if (!t) {
        return;
      }
      s.recParentNodes(e, false);
      let o = i.queryShowNodes();
      setTimeout(() => {
        let l = o.indexOf(t);

        if (l > -1) {
          this.$el.scrollTop = i.lineHeight * l - (i.lineHeight * this.length) / 2;
          s.hint(e);
        }
      }, 50);
    },
  };

exports.directives = {
    init(e, t) {
      requestAnimationFrame(() => {
        this.vm.reset();
      });
    },
  };
