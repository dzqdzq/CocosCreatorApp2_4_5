"use strict";
const e = require("./native-asset");
module.exports = class extends e {
  constructor(e) {
    super(e);
  }
  static version() {
    return "1.0.0";
  }
  static defaultType() {
    return "dragonbones-bin";
  }
  createAsset() {
    return new dragonBones.DragonBonesAsset();
  }
};
