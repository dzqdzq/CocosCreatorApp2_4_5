"use strict";

if (require("./gizmo-config").isCreator2x) {
  module.exports = require("./2d/gizmo-manager");
} else {
  module.exports = require("./3d/gizmo-manager");
}
