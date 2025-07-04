"use strict";
const t = require("node-uuid");
class s {
  constructor(s) {
    if (!s) {
      throw new Error("AssetDB must be given while creating a new meta");
    }
    this._assetdb = s;
    this.ver = this.constructor.version();

    if (!this.uuid) {
      this.uuid = t.v4();
    }

    this.__subMetas__ = {};
  }
  useRawfile() {
    return true;
  }
  dests() {
    return [];
  }
  serialize() {
    var t;
    var s;
    var e;
    var r = {};
    var i = Object.keys(this);
    for (t = 0; t < i.length; ++t) {
      if ("_" !== (s = i[t])[0]) {
        r[s] = this[s];
      }
    }
    if (this.__subMetas__) {
      for (s in ((r.subMetas = {}), this.__subMetas__)) {
        e = this.__subMetas__[s];
        r.subMetas[s] = e.serialize();
      }
    }
    return r;
  }
  deserialize(t) {
    for (var s in t) if (void 0 !== this[s]) {
      this[s] = t[s];
    }
  }
  getSubMetas() {
    return this.__subMetas__ || null;
  }
  copySubMetas() {
    var t;
    var s;
    var e;
    var r = {};
    var i = this.getSubMetas();
    if (i) {
      for (t = Object.keys(i), s = 0; s < t.length; ++s) {
        r[(e = t[s])] = i[e];
      }
    }
    return r;
  }
  updateSubMetas(t) {
    t = t || {};
    this.__subMetas__ = t;
  }
  assetType() {
    return this.constructor.defaultType();
  }
  static defaultType() {
    return "raw-asset";
  }
  static version() {
    return "1.0.0";
  }
}
s.prototype.import = null;
module.exports = s;
