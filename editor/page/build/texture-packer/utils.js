const e = require("fire-path");
const t = require("fire-fs");
const a = require("lodash");
const r = require("globby");
const i = require("del");
const s = require("./packer");
const n = Editor.require("app://editor/page/build/texture-compress");
async function o(r, i, s, n) {
  let o = e.join(r, "info.json");
  let u = {};

  if (t.existsSync(o)) {
    if (!(!(u = t.readJSONSync(o)) || (u.projectPath === Editor.remote.Project.path && u.actualPlatform === n))) {
      u = {};
    }
  }

  let m = {
      projectPath: Editor.remote.Project.path,
      actualPlatform: n,
      mtimes: {},
    };

  let l = [i.meta.uuid];

  s.forEach((e) => {
    l.push(e._uuid);
    l.push(e.getTexture()._uuid);
  });

  l = a.uniq(l);

  await Promise.all(
    l.map(async (e) => {
      let t = await new Promise((t, a) => {
        Editor.assetdb.queryMetaInfoByUuid(e, (e, r) => {
          if (e) {
            return a(e);
          }
          t({ assetMtime: r.assetMtime, metaMtime: r.metaMtime });
        });
      });
      m.mtimes[e] = t;
    })
  );

  return { storedPacInfoPath: o, newStoredPacInfo: m, storedPacInfo: u };
}

exports.queryAtlases = async function (i) {
  let s = { textureUuids: [], spriteFrames: [], pacInfos: [], texture2pac: {} };
  i = Array.isArray(i) ? i : [i];

  await Promise.all(
    i.map(async (i) => {
      let n = await new (class {
        async init(i) {
          let s;
          let n = i.path;
          let o = n + ".meta";
          let u = t.readJSONSync(o);
          let m = e.dirname(i.url) + "/**/*";

          let l = await new Promise((e, t) => {
            Editor.assetdb.queryAssets(m, ["sprite-frame"], (a, r) => {
              if (a) {
                return t(a);
              }
              e(r);
            });
          });

          let c = e.dirname(n);
          let p = [e.join(c, "**/*.pac"), "!" + e.join(c, "*.pac")];

          let d = await new Promise((t, a) => {
            r(p, (r, i) => {
              if (r) {
                return a(r);
              }
              t(i.map((t) => e.dirname(t)));
            });
          });

          if (0 ===
          (l = l.filter((t) => {
            for (let a = 0; a < d.length; a++) {
              if (e.contains(d[a], t.path)) {
                return false;
              }
            }
            return true;
          })).length) {
            s = [];

            Editor.warn(
              `No SpriteFrame find in folder [${e.dirname(
                i.url
              )}]. Please check the AutoAtlas [${n}].`
            );
          } else {
            s = await Promise.all(
                  l.map(
                    async (e) =>
                      new Promise((t, a) => {
                        cc.assetManager.loadAny(e.uuid, (e, r) => {
                          if (e) {
                            return a(e);
                          }
                          r.pacInfo = this;
                          t(r);
                        });
                      })
                  )
                );

            s = a.sortBy(s, "_uuid");
          }

          this.meta = u;
          this.info = i;
          this.spriteFrames = s;
          this.relativePath = i.url.replace("db://", "");
          return this;
        }
      })().init(i);

      n.spriteFrames.forEach((e) => {
        let t = e.getTexture()._uuid;
        s.textureUuids.push(t);
        s.texture2pac[t] = n;
      });

      s.spriteFrames = s.spriteFrames.concat(n.spriteFrames);
      s.pacInfos.push(n);
    })
  );

  s.textureUuids = a.uniq(s.textureUuids);
  s.spriteFrames = a.uniq(s.spriteFrames);
  return s;
};

exports.pack = async function (r) {
  let {
      pacInfos: u,
      buildAssets: m,
      dest: l,
      needCompress: c,
      platform: p,
      actualPlatform: d,
    } = r;

  let f = [];
  for (let r = 0; r < u.length; r++) {
    let m;
    let h = u[r];
    let P = h.meta;

    let y = cc.js.mixin(
      {
        name: e.basenameNoExt(h.info.path),
        width: P.maxWidth,
        height: P.maxHeight,
      },
      P
    );

    let w = e.join(l, h.relativePath);
    let g = h.spriteFrames;

    let {
      storedPacInfoPath: x,
      newStoredPacInfo: q,
      storedPacInfo: E,
    } = await o(w, h, g, d);

    if (!a.isEqual(q.mtimes, E.mtimes)) {
      i.sync(w.replace(/\\/g, "/"), { force: true });

      m = await new Promise((e, t) => {
            s(g, y, (a, r) => {
              if (a) {
                return t(a);
              }
              e(r);
            });
          });

      await Promise.all(
        m.atlases.map(async (a) => {
          let r = e.join(w, a.name + ".png");
          t.ensureDirSync(e.dirname(r));
          a.imagePath = r;
          return new Promise((e, t) => {
            a.sharp.toFile(r, (a) => {
              if (a) {
                return t(a);
              }
              e();
            });
          });
        })
      );

      if (global.gc) {
        global.gc();
      }

      if (c) {
        (await Promise.all(
            m.atlases.map(async (a) => {
              let r = e.join(w, "compressed", a.name + ".png");
              t.ensureDirSync(e.dirname(r));
              let i = await new Promise((e, t) => {
                n(
                  {
                    src: a.imagePath,
                    dst: r,
                    platform: p,
                    actualPlatform: d,
                    compressOption: h.meta.platformSettings,
                  },
                  (a, r) => {
                    if (a) {
                      return t(a);
                    }
                    e(r);
                  }
                );
              });

              if (0 === i.length) {
                i = [".png"];
              }

              a.compressd = {
                  suffix: i,
                  imagePathNoExt: e.join(e.dirname(r), e.basenameNoExt(r)),
                };
            })
          ));
      }

      q.result = m;
      t.ensureDirSync(w);
      t.writeFileSync(x, JSON.stringify(q, null, 2));
    } else {
      (m = E.result).atlases.forEach((e) => {
            e.files.forEach((e) => {
              e.spriteFrame = g.find((t) => t._uuid === e.uuid);
            });
          });
    }

    m.pacInfo = h;
    f.push(m);
  }
  return f;
};
