"use strict";
const e = require("fire-fs");
const t = require("fire-path");
const s = require("plist");
class i extends Editor.metas.asset {
  static version() {
    return "2.0.1";
  }
  static defaultType() {
    return "particle";
  }
  static validate(t) {
    return void 0 !== s.parse(e.readFileSync(t, "utf8")).maxParticles;
  }
  dests() {
    let e = this._assetdb.uuidToFspath(this.uuid);
    let s = this._assetdb._uuidToImportPathNoExt(this.uuid);
    return [s + ".json", s + t.extname(e)];
  }
  postImport(i, r) {
    let a = t.extname(i);
    let u = new cc.ParticleAsset();
    u.name = t.basenameNoExt(i);
    u._setRawAsset(a);

    e.readFile(i, "utf8", (d, l) => {
      if (d) {
        return r(d);
      }
      let o = s.parse(l);
      if (o.textureImageData) {
        delete o.textureFileName;
        delete o.spriteFrameUuid;
      } else {
        if (o.spriteFrameUuid) {
          u.spriteFrame = Editor.serialize.asAsset(o.spriteFrameUuid);
          delete o.textureFileName;
          delete o.textureImageData;
        } else {
          if (o.textureFileName) {
            let e = t.parse(o.textureFileName);
            let s = t.resolve(i, "..", e.name);

            if (!t.extname(s)) {
              s += ".png";
            }

            let r = t.join(s, e.name);
            let a = this._assetdb.fspathToUuid(r);

            if (a) {
              u.spriteFrame = Editor.serialize.asAsset(a);
              o.spriteFrameUuid = a;
              delete o.textureFileName;
              delete o.textureImageData;
            } else {
              Editor.error(
                    'Import Particle error: Can not find texture "%s" specified in "%s"',
                    s,
                    i
                  );
            }
          }
        }
      }
      l = s.build(o);
      this._assetdb.saveAssetToLibrary(this.uuid, u);
      let m = this._assetdb._uuidToImportPathNoExt(this.uuid) + a;
      e.writeFile(m, l, "utf8", r);
    });
  }
}
i.prototype.import = null;
module.exports = i;
