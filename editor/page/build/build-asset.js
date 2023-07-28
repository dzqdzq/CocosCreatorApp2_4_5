"use strict";
var e = cc.Font;
const i = false;
const t = require("path");
const s = require("fire-fs");
const r = require("../../share/build-platforms");
const a = require("../scene-utils/missing-class-reporter").MissingClass;
const l = Editor.require("app://editor/page/build/texture-compress");
class o {
  constructor(e, i, t, s, a) {
    this.writer = e;
    this.library = i;
    this.assetdb = t;
    this.sharedUuids = a || {};
    this.platform = Editor.remote.Builder.actualPlatform2Platform(s);
    var l = r[this.platform];
    this.actualPlatform = s;
    this.isJSB = l.isNative;
    this.exportSimpleFormat = !l.stripDefaultValues || l.exportSimpleProject;
    this.shouldExportScript = !l.exportSimpleProject;
    this.deserializeDetails = new cc.deserialize.Details();
    this.existsCache = {};
    this._bindedGetAssetRef = this._getAssetRef.bind(this);
    this.uuid2meta = Editor.remote.assetdb._uuid2meta;
  }
  build(e, i) {
    if (this.sharedUuids[e]) {
      return i(null, { redirect: this.sharedUuids[e] });
    }
    this.assetdb.queryInfoByUuid(e, (t, s) => {
      if (!s) {
        this.existsCache[e] = false;
        return i(new Error(o.AssetMissing));
      }
      this.existsCache[e] = true;
      var r = s.type;
      return r
        ? "folder" === r
          ? (console.warn("Should not build folder"), i())
          : (this._buildAsset(e, i), void 0)
        : i(new Error("Asset type not specified " + s.url));
    });
  }
  _exportNativeAsset(e, i) {
    let r = e.nativeUrl;
    let a = t.relative(this.library, r);
    let o = t.join(this.writer.dest, "..", "native", a);
    if (e instanceof cc.Texture2D) {
      let s = this.uuid2meta[e._uuid];
      l(
        {
          uuid: e._uuid,
          src: r,
          dst: o,
          platform: this.platform,
          actualPlatform: this.actualPlatform,
          compressOption: s.platformSettings,
        },
        (s, r, a) => {
          if (s) {
            Editor.error(s);
          }

          if (r && r.length > 0) {
            e._exportedExts = r;
          } else {
            e._exportedExts = [t.extname(o)];
          }

          i(null, a);
        }
      );
    } else {
      try {
        s.copySync(r, o);
      } catch (e) {
        Editor.error("Failed to copy native asset file %s to %s,", r, o, e);
        return i(null, "");
      }
      i(null, [o]);
    }
  }
  _getAssetRef(e) {
    var i = this.existsCache[e];

    if (void 0 === i) {
      i = this.existsCache[e] = !!Editor.assetdb.remote.uuidToFspath(e);
    }

    return i ? Editor.serialize.asAsset(e) : null;
  }
  _buildAsset(r, l) {
    var o = t.join(this.library, r.slice(0, 2), r + ".json");
    var d = s.readFileSync(o);

    if (i) {
      console.log("building " + o);
    }

    this.deserializeDetails.reset();
    var u = cc.deserialize(d, this.deserializeDetails, {
      ignoreEditorOnly: true,
      classFinder: a.classFinder,
    });
    d = null;
    u._uuid = r;

    if (this.shouldExportScript) {
      a.reportMissingClass(u);
    }

    a.reset();
    this.deserializeDetails.assignAssetsBy(this._bindedGetAssetRef);
    var n;
    var h = this.deserializeDetails.uuidList.slice();

    if (h.length > 0) {
      n = this.deserializeDetails.uuidObjList.slice();
    }

    if (u._native &&
    (this.isJSB ||
      !u.constructor.preventPreloadNativeObject ||
      u instanceof e)) {
      this._exportNativeAsset(u, (e, i) => {
            this._doBuildJson(u, h, n, i, l);
          });
    } else {
      this._doBuildJson(u, h, n, void 0, l);
    }
  }
  _doBuildJson(e, i, t, s, r) {
    var a = Editor.serializeCompiled(e, {
      nicify: !this.exportSimpleFormat,
      stringify: false,
      dontStripDefault: this.exportSimpleFormat,
      noNativeDep: !s,
    });
    this.writer.writeJsonByUuid(e._uuid, a, (e) =>
      e
        ? r(e)
        : r(null, { dependUuids: i, ownersForDependUuids: t, nativePaths: s })
    );
  }
}
o.AssetMissing = "asset missing";
module.exports = o;
