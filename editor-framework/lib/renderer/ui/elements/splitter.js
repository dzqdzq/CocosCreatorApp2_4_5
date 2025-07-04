"use strict";
const e = require("./utils");
const i = require("../behaviors/resizable");
const t = require("../utils/resource-mgr");

module.exports = e.registerElement("ui-splitter", {
  behaviors: [i],
  template: '\n    <div class="content">\n      <slot></slot>\n    </div>\n  ',
  style: t.getResource("theme://elements/splitter.css"),
  ready() {
    this._initResizable();
    this._needEvaluateSize = 0 !== this.children.length;
    for (let e = 0; e < this.children.length; ++e) {
      if ("UI-SPLITTER" !== this.children[e].tagName) {
        this._needEvaluateSize = false;
        break;
      }
    }
    this._initResizers();

    window.requestAnimationFrame(() => {
      if ("UI-SPLITTER" !== this.parentElement.tagName) {
        this._finalizeMinMaxRecursively();
        this._finalizePreferredSizeRecursively();
        this._finalizeStyleRecursively();
        this._reflowRecursively();
      }
    });
  },
  _initResizers() {
    if (this._needEvaluateSize && this.children.length > 1) {
      for (let e = 0; e < this.children.length; ++e) {
        if (e !== this.children.length - 1) {
          let i = this.children[e + 1];
          let t = document.createElement("ui-dock-resizer");
          t.vertical = this.row;
          this.insertBefore(t, i);
          e += 1;
        }
      }
    }
  },
});
