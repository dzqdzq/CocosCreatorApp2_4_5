"use strict";
const t = require("./text");
module.exports = class extends t {
  static version() {
    return "2.0.0";
  }
  static defaultType() {
    return "markdown";
  }
};
