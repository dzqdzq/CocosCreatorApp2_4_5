"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const e = require("lodash");
const uuid_utils = require("../../editor-utils/uuid-utils");
const r = require("./builder");
const i = require("./builder");
const s = require("./pack-jsons");
const a = cc.Object;
const n = cc.Asset;
const l = cc._BaseNode;
const o = cc.Node;
const u = cc.Component;
const d = cc.ValueType;
const { PersistentMask: c, DontSave: f, DontDestroy: p, EditorOnly: h } = a.Flags;

const _ = (
  CC_TEST
    ? cc._Test.IntantiateJit
    : Editor.require(
        "unpack://engine-dev/cocos2d/core/platform/instantiate-jit"
      )
).equalsToDefault;

const b = CC_TEST
  ? cc.Class.getDefault
  : Editor.require("unpack://engine-dev/cocos2d/core/platform/CCClass")
      .getDefault;

const y = ["_objFlags", "_parent", "_prefab"].concat(
  "_name",
  "_active",
  "_eulerAngles",
  "_localZOrder"
);

const v = cc.Class.Attr;
const g = v.DELIMETER + "editorOnly";
const O = v.DELIMETER + "default";
const C = v.DELIMETER + "formerlySerializedAs";

let E = {
    _depends: new Array(),
    dependsOn: function (e, t) {
      this._depends.push(e, t);
    },
  };

let m = (() => {
  class r {
    constructor(e, t) {
      this.parsedObjs = new Set();
      t = t || {};
      this.exporting = !!t.exporting;
      this.discardInvalid = !("discardInvalid" in t) || !!t.discardInvalid;

      this.dontStripDefault = !(
          this.exporting &&
          "dontStripDefault" in t &&
          !t.dontStripDefault
        );

      this.missingClassReporter = t.missingClassReporter;
      this.missingObjectReporter = t.missingObjectReporter;
      this.reserveContentsForAllSyncablePrefab = !!t.reserveContentsForSyncablePrefab;
      this.builder = e;
      this.assetExists = this.missingObjectReporter && Object.create(null);
    }
    parse(e) {
      if (e instanceof cc.Prefab) {
        this.prefabRoot = e.data;
      }

      this.parseObjField(null, "", e);
      this.builder.setRoot(e);
    }
    checkMissingAsset(e, t) {
      if (this.missingObjectReporter) {
        var r = this.assetExists[t];

        if (void 0 === r) {
          r = this.assetExists[t] = !!Editor.assetdb.remote.uuidToFspath(t);
        }

        if (!r) {
          this.missingObjectReporter(e);
        }
      }
    }
    verifyValue(e, t, i) {
      var s = typeof i;
      if ("object" === s) {
        if (!i) {
          return null;
        }
        if (this.parsedObjs.has(i)) {
          return i;
        }
        if (i instanceof a) {
          if (i instanceof n) {
            var l = i._uuid;
            return l ? (this.checkMissingAsset(i, l), i) : null;
          }
          var u = i._objFlags;
          if (this.exporting && u & h) {
            return r.REMOVED_OBJ;
          }
          if (this.discardInvalid) {
            if (u & f) {
              return r.REMOVED_OBJ;
            }
            if (!i.isValid) {
              if (this.missingObjectReporter) {
                this.missingObjectReporter(i);
              }

              return null;
            }
          } else {
            if (u & f && u & p) {
              return r.REMOVED_OBJ;
            }
            if (!i.isRealValid) {
              return null;
            }
          }
          if (o && o.isNode(i)) {
            if (this.canDiscardByPrefabRoot(i) && i !== i._prefab.root) {
              return null;
            }
          }
        }
        return i;
      }
      return "function" !== s
        ? e instanceof a && "_objFlags" === t && i > 0
          ? i & c
          : i
        : null;
    }
    canDiscardByPrefabRoot(e) {
      return !(
        this.reserveContentsForAllSyncablePrefab ||
        !(function (e) {
          var t;
          var r;

          r = null ===
            (t = null === e || void 0 === e ? void 0 : e._prefab) ||
          void 0 === t
            ? void 0
            : t.root;

          if (!r) {
            return;
          }
          if(!r._prefab){
            Editor.log('dzq prefab r:',r);
          }
          return r._prefab.sync;
        })(e) ||
        this.prefabRoot === e
      );
    }
    enumerateClass(e, t, i, s) {
      for (
        var a = v.getClassAttrs(t), n = i || t.__values__, o = 0;
        o < n.length;
        o++
      ) {
        var d = n[o];
        var c = e[d];
        if ((c = this.verifyValue(e, d, c)) === r.REMOVED_OBJ) {
          continue;
        }
        let t = b(a[d + O]);
        if (this.exporting) {
          if (a[d + g]) {
            continue;
          }
          if (!this.dontStripDefault && _(t, c)) {
            continue;
          }
        }
        var f = a[d + C];
        this.parseField(e, d, c, {
          formerlySerializedAs: f,
          defaultValue: t,
        });
      }
      if ((l && e instanceof l) || (u && e instanceof u)) {
        if (this.exporting) {
          if (!(e instanceof l && e._parent instanceof cc.Scene)) {
            return;
          }
          if (!this.dontStripDefault && !e._id) {
            return;
          }
        }
        this.builder.setProperty_Raw(e, "_id", e._id);
      }
    }
    setTrsOfSyncablePrefabRoot(e) {
      let t = e._trs.slice();
      t[7] = t[8] = t[9] = 1;

      if (!r.isDefaultTrs(t)) {
        this.builder.setProperty_TypedArray(e, "_trs", t);
      }
    }
    static isDefaultTrs(e) {
      return (
        0 === e[0] &&
        0 === e[1] &&
        0 === e[2] &&
        0 === e[3] &&
        0 === e[4] &&
        0 === e[5] &&
        1 === e[6] &&
        1 === e[7] &&
        1 === e[8] &&
        1 === e[9]
      );
    }
    enumerateNode(e, t) {
      if (this.canDiscardByPrefabRoot(e)) {
        var r = e._prefab.root === e;

        if (r) {
          this.enumerateClass(e, t, y, r);
          this.setTrsOfSyncablePrefabRoot(e);
        }
      } else {
        this.enumerateClass(e, t);
      }
    }
    parseField(e, r, i, s) {
      var a = typeof i;
      if ("object" === a) {
        if (!i) {
          this.builder.setProperty_Raw(e, r, null, s);
          return;
        }
        if (this.parsedObjs.has(i)) {
          this.builder.setProperty_ParsedObject(e, r, i, s);
          return;
        }
        if (i instanceof n && e) {
          var l = i._uuid;

          if (this.exporting) {
            l = uuid_utils.compressUuid(l, true);
          }

          this.builder.setProperty_AssetUuid(e, r, l, s);
          return;
        }
        this.parseObjField(e, r, i, s);
      } else {
        if ("function" !== a) {
          this.builder.setProperty_Raw(e, r, i, s);
        } else {
          this.builder.setProperty_Raw(e, r, null, s);
        }
      }
    }
    parseObjField(t, i, s, a) {
      this.parsedObjs.add(s);
      var n = s.constructor;
      if ((function (e, t) {
        return (!!t && (!!cc.Class._isCCClass(t) || (t.__values__ && cc.js._getClassId(e, false))));
      })(s, n)) {
        if (s instanceof d && this.builder.setProperty_ValueType(t, i, s, a)) {
          return;
        }
        if (o && o.isNode(s)) {
          this.builder.setProperty_Class(t, i, s, a);
          this.enumerateNode(s, n);
          return;
        }
        if (s._serialize) {
          let e = a || {};
          e.content = s._serialize(this.exporting, E);
          this.builder.setProperty_CustomizedClass(t, i, s, e);
          let r = E._depends;
          for (let e = 0; e < r.length; e += 2) {
            this.builder.setProperty_AssetUuid(s, r[e], r[e + 1]);
          }
          r.length = 0;
        } else {
          var l = n.__values__;

          if (s._onBeforeSerialize) {
            l = s._onBeforeSerialize(l);
          }

          if (l.length > 0) {
            if ("_$erialized" !== l[l.length - 1]) {
              this.builder.setProperty_Class(t, i, s, a);
              this.enumerateClass(s, n, l);
            } else {
              if (s._$erialized) {
                let e = s._$erialized;
                let r = e.__type__;
                let n = a || {};
                n.expectedType = r;
                n.formerlySerializedData = e;
                this.builder.setProperty_SerializedData(t, i, s, n);
                this.enumerateDict(e);

                if (this.missingClassReporter) {
                  this.missingClassReporter(s, r);
                }
              }
            }
          } else {
            this.builder.setProperty_Class(t, i, s, a);
          }
        }
      } else {
        if (ArrayBuffer.isView(s)) {
          if (o && o.isNode(t) && "_trs" === i && r.isDefaultTrs(s)) {
            return;
          }
          this.builder.setProperty_TypedArray(t, i, s, a);
        } else {
          if (n && n !== Object && !Array.isArray(s)) {
            if (!t) {
              throw new Error(`Unknown object to serialize: ${s}`);
            }
            return;
          }
          if (Array.isArray(s)) {
            let n = e(s)
                .map((e, t) => this.verifyValue(s, t, e))
                .filter((e) => e !== r.REMOVED_OBJ)
                .value();

            let l = a || {};
            l.arrayLength = n.length;
            this.builder.setProperty_Array(t, i, s, l);
            for (let e = 0; e < n.length; ++e) {
              this.parseField(s, e, n[e]);
            }
          } else {
            this.builder.setProperty_Dict(t, i, s, a);
            this.enumerateDict(s);
          }
        }
      }
    }
    enumerateDict(e) {
      for (var t in e) {
        if ((e.hasOwnProperty && !e.hasOwnProperty(t)) ||
        (95 === t.charCodeAt(0) && 95 === t.charCodeAt(1))) {
          continue;
        }
        let i = e[t];

        if ((i = this.verifyValue(e, t, i)) === r.REMOVED_OBJ) {
          i = null;
        }

        this.parseField(e, t, i);
      }
    }
  }
  r.REMOVED_OBJ = Symbol();
  return r;
})();

function D(e, t) {
  let i;
  return (t = t || {}).exporting
    ? ((i = new r.default(t)), new m(i, t).parse(e), (e = null), i.dump())
    : Editor.serialize(e, t);
}
exports.Parser = m;
exports.default = D;

Editor.serializeCompiled = function (e, t) {
    return D(
      e,
      (t = Object.assign({ exporting: true, dontStripDefault: false }, t))
    );
  };

Editor.serializeCompiled.getRootData = i.getRootData;
Editor.serializeCompiled.packJSONs = s.default;
