"use strict";
const t = require("./utils");
module.exports = t.registerElement("ui-shadow", {
  style: "\n    :host {\n      display: block;\n    }\n  ",
  template: "",
  factoryImpl(t) {
    this.shadowRoot.innerHTML = t;
  },
  ready() {
    for (; this.childNodes.length; ) {
      let t = this.childNodes[0];
      this.shadowRoot.appendChild(t);
    }
  },
});
