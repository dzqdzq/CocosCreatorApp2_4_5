"use strict";
const e = require("fire-fs");
const i = require("./raw-asset");
const s = require("semver");

module.exports = class extends i{constructor(e){
  super(e);
  this.isBundle = false;
  this.bundleName = "";
  this.priority = 1;
  this.compressionType = {};
  this.optimizeHotUpdate = {};
  this.inlineSpriteFrames = {};
  this.isRemoteBundle = {};
}import(i,t){try{
  let t=Editor.assetdb.fspathToUrl(i);

  if ("db://assets/resources"===t) {
    this.isBundle = true;
    this.bundleName = "resources";
    this.priority = 8;
  } else {
    if ("db://internal/resources"===t) {
      this.isBundle = true;
      this.bundleName = "internal";
      this.priority = 11;
    }
  }

  var r=e.readJsonSync(i+".meta");if (s.satisfies(r.ver,"< 1.1.0")) {
    if (r.isSubpackage) {
      this.isBundle = r.isSubpackage;
      this.bundleName = r.subpackageName||"";
      this.priority = 5;
      this.compressionType.wechatgame = "subpackage";
      this.compressionType.baidugame = "subpackage";
      this.compressionType.xiaomi = "subpackage";
      this.compressionType.quickgame = "subpackage";
      this.compressionType.qgame = "subpackage";
      this.compressionType.huawei = "subpackage";
      this.compressionType["cocos-runtime"] = "subpackage";
    }

    r.isSubpackage = void 0;
    r.subpackageName = void 0;
  } else {
    if(s.satisfies(r.ver,"= 1.1.1")){
      this.optimizeHotUpdate = {};
      this.inlineSpriteFrames = {};
      for (let e in r.compressionType) {
        this.optimizeHotUpdate[e] = r.optimizeHotUpdate;
        this.inlineSpriteFrames[e] = r.inlineSpriteFrames;
      }
      r.optimizeHotUpdate = this.optimizeHotUpdate;
      r.inlineSpriteFrames = this.inlineSpriteFrames;
    }
  }
}catch(e){}t()}export(i,s,t){
  e.mkdirSync(i);

  if (t) {
    t();
  }
}static defaultType(){return"folder"}static version(){return"1.1.2"}};