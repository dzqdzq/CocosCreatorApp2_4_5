"use strict";

if (require("../gizmo-config").isCreator2x) {
  module.exports = require("./2d");
} else {
  module.exports = require("./3d");
}
