"use strict";
const t = require("fire-fs");
const e = require("path");
const {promisify:r} = require("util");
exports.template = t.readFileSync(e.join(__dirname,"../template/texture-preview.html"),"utf-8");
exports.props = ["key"];
exports.watch = {key(){try{this.updateTexture()}catch(t){Editor.error(t)}}};
exports.data = function(){return{url:""}};

exports.methods = {t:Editor.T,async updateTexture(){if (!this.key||!this.key.source||!this.$el) {
  return;
}let t=await r(Editor.assetdb.queryMetaInfoByUuid)(this.key.source._uuid);var e=JSON.parse(t.json);this.url = function(t){
  let e;
  let r;
  let i = `thumbnail://${t.rawTextureUuid}?32`;
  let u = t.trimX;
  let s = t.trimY;
  let o = 0;

  if (t.rotated) {
    e = t.height;
    r = t.width;
    o = 270;
  } else {
    e = t.width;
    r = t.height;
  }

  let a=`&x=${u}&y=${s}&w=${e}&h=${r}`;

  if (0!==o) {
    a += `&rotate=${o}`;
  }

  return i+=a;
}(e);}};

exports.created = function(){this.updateTexture()};
exports.compiled = function(){this.updateTexture()};