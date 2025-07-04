"use strict";
const e = require("highlight.js");
const t = require("remarkable");
const r = require("./utils");
const i = require("../utils/resource-mgr");
const u = require("../../console");

module.exports = r.registerElement("ui-markdown", {
  get value() {
    return this._value;
  },
  set value(e) {
    if (!e) {
      e = "";
    }

    if (this._value !== e) {
      this._value = e;
      this._render();
    }
  },
  get values() {
    return this._values;
  },
  set values(e) {
    return (this._values = e);
  },
  get multiValues() {
    return this._multiValues;
  },
  set multiValues(e) {
    if ((e = !(null == e || false === e)) !== this._multiValues) {
      this._multiValues = e;

      if (e) {
        this.setAttribute("multi-values", "");
      } else {
        this.removeAttribute("multi-values");
      }

      return e;
    }
  },
  get observedAttributes() {
    return ["multi-values"];
  },
  attributeChangedCallback(e, t, r) {
    if (t !== r && "multi-values" == e) {
      this[
        e.replace(/\-(\w)/g, function (e, t) {
          return t.toUpperCase();
        })
      ] = r;
    }
  },
  template: '\n    <div class="container"></div>\n  ',
  style: i.getResource("theme://elements/markdown.css"),
  $: { container: ".container" },
  factoryImpl(e) {
    if (e) {
      this.value = e;
    }
  },
  ready() {
    this.value = this._unindent(this.textContent);
    this.multiValues = this.getAttribute("multi-values");
  },
  _render() {
    let r = new t({
      html: true,
      highlight(t, r) {
        if (r && e.getLanguage(r)) {
          try {
            return e.highlight(r, t).value;
          } catch (e) {
            u.error(`Syntax highlight failed: ${e.message}`);
          }
        }
        try {
          return e.highlightAuto(t).value;
        } catch (e) {
          u.error(`Syntax highlight failed: ${e.message}`);
        }
        return "";
      },
    }).render(this.value);
    this.$container.innerHTML = r;
  },
  _unindent(e) {
    if (!e) {
      return e;
    }
    let t = e.replace(/\t/g, "  ").split("\n");

    let r = t.reduce((e, t) => {
      if (/^\s*$/.test(t)) {
        return e;
      }
      let r = t.match(/^(\s*)/)[0].length;
      return null === e ? r : r < e ? r : e;
    }, null);

    return t.map((e) => e.substr(r)).join("\n");
  },
});
