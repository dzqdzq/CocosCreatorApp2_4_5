"use strict";
require("./vue-utils").init();

Editor.UI.importStylesheets([
  "theme://elements/asset.css",
  "theme://elements/node.css",
  "theme://elements/gradient-picker.css",
  "theme://elements/gradient.css",
]).then(() => {
  Editor.UI.Asset = require("./elements/asset");
  Editor.UI.Node = require("./elements/node");
  Editor.UI.GradientPicker = require("./elements/gradient-picker");
  Editor.UI.Gradient = require("./elements/gradient");
});

require("./register-ui-properties");
