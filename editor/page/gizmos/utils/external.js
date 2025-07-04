"use strict";
let e = require("../gizmo-config");
exports.GeometryUtils = {};

if (e.isCreator2x) {
  exports.NodeUtils = Editor.require("scene://utils/node");
  exports.EditorMath = Editor.Math;

  exports.EditorCamera = Editor.require(
        "packages://scene/panel/tools/camera"
      );

  exports.GeometryUtils.aabb = Editor.require(
        "unpack://engine-dev/cocos2d/core/geom-utils/aabb"
      );
} else {
  exports.NodeUtils = require("../../../utils/node");
  exports.EditorMath = require("../../../utils/math");
  exports.EditorCamera = require("../../../3d/manager/camera");
  exports.GeometryUtils.aabb = require("../../../utils/aabb");
}
