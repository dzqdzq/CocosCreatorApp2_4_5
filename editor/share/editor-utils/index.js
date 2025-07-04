"use strict";
module.exports = require("./utils");
module.exports.Intersection = require("./intersection");
module.exports.Polygon = require("./polygon");
module.exports.UuidUtils = require("./uuid-utils");

Object.defineProperties(Editor, {
  Intersection: {
    get: () => (
      Editor.warn(
        '"Editor.Intersection" is deprecated, use "Editor.Utils.Intersection" instead please.'
      ),
      Editor.Utils.Intersection
    ),
  },
  Polygon: {
    get: () => (
      Editor.warn(
        '"Editor.Polygon" is deprecated, use "Editor.Utils.Polygon" instead please.'
      ),
      Editor.Utils.Polygon
    ),
  },
  UuidUtils: {
    get: () => (
      Editor.warn(
        '"Editor.UuidUtils" is deprecated, use "Editor.Utils.UuidUtils" instead please.'
      ),
      Editor.Utils.UuidUtils
    ),
  },
  UuidCache: {
    get: () => (
      Editor.warn(
        '"Editor.UuidCache" is deprecated, use "Editor.Utils.UuidCache" instead please.'
      ),
      Editor.Utils.UuidCache
    ),
  },
});
