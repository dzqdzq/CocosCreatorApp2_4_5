"use strict";
const t = require("./custom-asset");
const e = require("fire-fs");
require("fire-path");

module.exports = class extends t {
  constructor(t) {
    super(t);
    this.dataAsSubAsset = null;
  }
  static version() {
    return "1.0.3";
  }
  static defaultType() {
    return "material";
  }
  import(t, e) {
    if (this._assetdb.isSubAssetByPath(t)) {
      if (this.dataAsSubAsset) {
        this.importJSON(t, this.dataAsSubAsset);
      }

      return e();
    }
    super.import(t, e);
  }
  async postImport(t, s) {
    let r;
    let i = this._assetdb.isSubAssetByPath(t);

    if (i) {
      if (this.dataAsSubAsset) {
        r = "string" == typeof this.dataAsSubAsset
          ? JSON.parse(this.dataAsSubAsset)
          : this.dataAsSubAsset;
      }
    } else {
      r = e.readJsonSync(t, "utf8");
    }

    if (!r) {
      return s();
    }
    let a = false;
    try {
      a = (function (t, s) {
        if (!t._props && !t._defines) {
          return false;
        }

        if (!t._techniqueData) {
          t._techniqueData = {};
        }

        let r = t._techniqueData;
        if (!t._effectAsset) {
          return false;
        }
        let i;
        let a;
        let n;
        let o = t._effectAsset.__uuid__;
        let u = s._uuidToImportPathNoExt(o) + ".json";
        try {
          i = e.readJsonSync(u);
        } catch (t) {
          Editor.error(t);
          return false;
        }
        try {
          a = i.techniques[0].passes;
          n = i.shaders;
        } catch (t) {
          Editor.error(t);
          return false;
        }
        for (let e = 0; e < a.length; e++) {
          let s = a[e];
          if (s.properties && t._props) {
            for (let i in t._props) if (void 0 !== s.properties[i]) {
              if (!r[e]) {
                r[e] = {};
              }

              if (!r[e].props) {
                r[e].props = {};
              }

              r[e].props[i] = t._props[i];
            }
          }
          if (t._defines) {
            let i = n.find((t) => t.name === s.program);
            if (i.defines) {
              for (let s in t._defines) if (i.defines.find((t) => t.name === s)) {
                if (!r[e]) {
                  r[e] = {};
                }

                if (!r[e].defines) {
                  r[e].defines = {};
                }

                r[e].defines[s] = t._defines[s];
              }
            }
          }
        }
        t._props = void 0;
        t._defines = void 0;
        return true;
      })(r, this._assetdb);
    } catch (t) {
      Editor.error(t);
    }
    if (a) {
      this.importJSON(t, r);
      if (i) {
        let t = JSON.stringify({ uuid: this.uuid, dataAsSubAsset: r });
        Editor.assetdb.saveMeta(this.uuid, t, (t) => {
          if (t) {
            Editor.error(t);
          }
        });
      } else {
        e.writeFileSync(t, JSON.stringify(r, null, 2));
      }
    }
    s();
  }
};
