"use strict";
const e = require("fire-path");
const r = require("fire-fs");
const i = require("globby");
const l = require("chalk");

module.exports = function (o, t, s) {
  let a = require("../share/tap");
  a.init(t.reporter);

  a.on("end", () => {
    s(a._fail);
  });

  global.tap = a;
  global.helper = require("../share/helper");
  global.suite = a.suite;
  let n = [];

  (n = r.isDirSync(o)
    ? i.sync([
        e.join(o, "**/*.js"),
        "!" + e.join(o, "**/*.skip.js"),
        "!**/fixtures/**",
      ])
    : [o]).forEach((r) => {
    let i = e.resolve(r);
    try {
      require(i);
    } catch (e) {
      (function (e) {
        console.log(l.red(e));
      })(`Failed to load spec: ${r}`);
    }
  });

  a.end();
};
