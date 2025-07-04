"use strict";
module.exports = {
  "asset-changed"(e, s) {
    _Scene.assetChanged(s);
  },
  "assets-moved"(e, s) {
    _Scene.assetsMoved(s);
  },
  "assets-created"(e, s) {
    _Scene.assetsCreated(s);
  },
  "assets-deleted"(e, s) {
    _Scene.assetsDeleted(s);
  },
};
