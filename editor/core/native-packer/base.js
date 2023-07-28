"use strict";
const e = require("fire-path");
const i = require("fire-fs");

module.exports = class {
  constructor(e) {
    this.options = e;
  }
  ensureFile(e, s) {
    if (!i.existsSync(s)) {
      i.copySync(e, s);
    }
  }
  addRequireToMainJs(s) {
    let r = e.join(this.options.dest, "main.js");
    let n = i.readFileSync(r, "utf-8");
    let t = e.basename(s);

    if (-1 == n.indexOf(t)) {
      n = n.replace(
          "require('jsb-adapter/jsb-engine.js');",
          (e) => e + `\n        require('${s}')`
        );

      i.writeFileSync(r, n);
    }
  }
};
