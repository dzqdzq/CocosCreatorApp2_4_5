"use strict";
const e = require("./custom-asset");
const t = require("fire-fs");
const r = require("fire-path");

module.exports = class extends e {
  static defaultType() {
    return "animation-clip";
  }
  static version() {
    return "2.1.0";
  }
  deserialize(e) {
    super.deserialize(e);
    this._oldVer = e.ver;
  }
  import(e, i) {
    t.readFile(e, "utf8", (s, a) => {
      if (a) {
        var o;
        try {
          o = JSON.parse(a);
        } catch (e) {
          if (i) {
            i(e);
          }

          return;
        }
        function n(e) {
          if (!e || !e.rotation) {
            return;
          }
          let t = e.rotation;
          for (let e = 0; e < t.length; e++) {
            t[e].value *= -1;
          }
          e.angle = e.rotation;
          delete e.rotation;
        }
        if ("1.0.0" === this._oldVer) {
          let r = o.curveData;
          if (r) {
            n(r.props);
            for (let e in r.paths) n(r.paths[e].props);
            t.writeFileSync(e, JSON.stringify(o, null, 2));
          }
        }
        Editor.serialize.setName(o, r.basenameNoExt(e));
        this._assetdb.saveAssetToLibrary(this.uuid, o);
      }

      if (i) {
        i(s);
      }
    });
  }
};
