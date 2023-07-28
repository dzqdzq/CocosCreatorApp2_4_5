"use strict";

if ("browser"===process.type) {
  module.exports = require("./lib/browser");
} else {
  if ("renderer"===process.type) {
    module.exports = require("./lib/renderer");
  }
}