const e = require("fire-fs");
const t = require("async");
const i = require("fire-path");
const r = require("del");
const o = require(Editor.url("app://editor/share/sharp"));
const n = require("./algorithm");
const a = require("./bleeding").applyBleed;
const h = i.join(Editor.remote.Project.path, "temp", "trimImages");
class d {
  constructor(e, t, i) {
    this.files = e;
    this.width = t;
    this.height = i;
    this.sharp = void 0;
  }
  toJSON() {
    let e = Object.assign({}, this);
    e.sharp = void 0;
    return e;
  }
}
class l {
  constructor(e, t) {
    if (!e || !t) {
      return;
    }
    let i = e.getTexture();
    let r = i.nativeUrl;
    let o = e.getRect();
    o.rotatedWidth = e.isRotated() ? o.height : o.width;
    o.rotatedHeight = e.isRotated() ? o.width : o.height;
    this.name = e.name;
    this.spriteFrame = e;
    this.uuid = e._uuid;
    this.textureUuid = i._uuid;
    this.path = r;
    this.trim = o;
    this.rawWidth = e.getOriginalSize().width;
    this.rawHeight = e.getOriginalSize().height;
    this.width = o.width + 2 * (t.padding + t.bleed);
    this.height = o.height + 2 * (t.padding + t.bleed);
  }
  toJSON() {
    let e = Object.assign({}, this);
    e.spriteFrame = void 0;
    return e;
  }
  clone() {
    let e = new l();
    Object.assign(e, this);
    return e;
  }
}
function s(e, t, i) {
  let r = e.concat();
  let o = n[t.algorithm];

  if (!o) {
    Editor.warn(
        `determineAtlasSize failed: Can not find algorithm ${t.algorithm}, use MaxRects`
      );

    o = n.MaxRects;
  }

  let a = t.width;
  let h = t.height;
  let l = t.allowRotation;
  for (; r.length > 0; ) {
    let e = o(r, a, h, l);
    if (0 === e.length) {
      t.unpackedTextures = r;
      break;
    }
    e.forEach((e) => {
      r.splice(r.indexOf(e), 1);
    });
    let i = 0;
    let n = 0;
    for (let t = 0; t < e.length; t++) {
      let r = e[t];
      r.rotatedWidth = r.rotated ? r.height : r.width;
      r.rotatedHeight = r.rotated ? r.width : r.height;
      r.trim.rotatedWidth = r.rotated ? r.trim.height : r.trim.width;
      r.trim.rotatedHeight = r.rotated ? r.trim.width : r.trim.height;
      let o = r.x + r.rotatedWidth;
      let a = r.y + r.rotatedHeight;

      if (o > i) {
        i = o;
      }

      if (a > n) {
        n = a;
      }
    }
    t.atlases.push(new d(e, i, n));
  }

  t.atlases.forEach(function (e) {
    (function (e, t, i) {
      if (t) {
        e.width = e.height = Math.max(e.width, e.height);
      }

      if (i) {
        e.width = c(e.width);
        e.height = c(e.height);
      }
    })(e, t.forceSquared, t.powerOfTwo);

    e.files.forEach((e) => {
      e.trim.x = e.x + t.padding + t.bleed;
      e.trim.y = e.y + t.padding + t.bleed;
    });
  });

  i(null, t);
}
function c(e) {
  if ("number" != typeof e) {
    return;
  }
  let t = 2;
  for (; e > t; ) {
    t *= 2;
  }
  return t;
}

module.exports = function (n, d, c) {
  if (!n) {
    return c(new Error("SpriteFrames is null"));
  }
  (d = d || {}).name = d.name || "spritesheet";
  d.forceSquared = "boolean" == typeof d.forceSquared && d.forceSquared;
  d.powerOfTwo = "boolean" == typeof d.powerOfTwo && d.powerOfTwo;
  d.padding = "number" == typeof d.padding ? d.padding : 0;
  d.algorithm = "string" == typeof d.algorithm ? d.algorithm : "MaxRects";
  d.contourBleed = "boolean" == typeof d.contourBleed && d.contourBleed;
  d.paddingBleed = "boolean" == typeof d.paddingBleed && d.paddingBleed;
  d.bleed = d.paddingBleed ? 1 : 0;
  let g = n.map((e) => new l(e, d));
  d.atlases = [];
  d.unpackedTextures = [];
  o.cache(false);
  console.time("TexturePacker: packer");

  t.waterfall(
    [
      function (e) {
        g = g.filter(
          (e) =>
            (e.trim.width > 0 && e.trim.height > 0) ||
            ((e.width = e.rawWidth),
            (e.height = e.rawHeight),
            d.unpackedTextures.push(e),
            false)
        );

        e();
      },
      function (r) {
        console.time("TexturePacker: trim images");

        (function (r, n, a) {
          e.ensureDirSync(h);
          let d = 0;
          t.forEach(
            r,
            function (e, t) {
              e.originalPath = e.path;

              e.path = i.join(
                  h,
                  "spritesheet_js_" +
                    new Date().getTime() +
                    "_image_" +
                    d++ +
                    ".png"
                );

              let r = e.trim;

              let n = o(e.originalPath).extract({
                left: r.x,
                top: r.y,
                width: r.rotatedWidth,
                height: r.rotatedHeight,
              });

              if (e.spriteFrame.isRotated()) {
                n = n.rotate(270);
              }

              n.toFile(e.path, function (i) {
                if (i) {
                  Editor.error(
                    `trimImages [${e.name}] from [${e.originalPath}]  failed`
                  );
                }

                t(i);
              });
            },
            a
          );
        })(g, 0, r);
      },
      function (e) {
        console.timeEnd("TexturePacker: trim images");

        process.nextTick(function () {
          e(void 0, g);
        });
      },
      function (e, t) {
        console.time("TexturePacker: determine canvas size");
        s(e, d, t);
      },
      function (e, i) {
        console.timeEnd("TexturePacker: determine canvas size");
        console.time("TexturePacker: generate images");
        let r = 0;
        let n = e.width;
        let h = e.height;
        let d = e.name;

        t.eachSeries(
          e.atlases,
          function (t, i) {
            if (global.gc) {
              global.gc();
            }

            e.name = t.name = d + "-" + ++r;
            e.width = t.width;
            e.height = t.height;

            (function (e, t, i) {
              let r = e.files;
              const n = t.width;
              const h = t.height;
              const d = { raw: { width: n, height: h, channels: 4 } };
              let l = Buffer.alloc(n * h * 4, 0);
              let s = o(l, d).toBuffer();
              for (let e = 0; e < r.length; e++) {
                let t = r[e];
                let i = t.trim.x;
                let n = t.trim.y;

                s = s
                  .then((e) =>
                    t.rotated
                      ? o(t.path)
                          .rotate(90)
                          .toBuffer()
                          .then((t) =>
                            o(e, d)
                              .composite([{ input: t, left: i, top: n }])
                              .toBuffer()
                              .then(
                                (e) =>
                                  new Promise(function (t, i) {
                                    process.nextTick(() => {
                                      t(e);
                                    });
                                  })
                              )
                          )
                      : o(e, d)
                          .composite([{ input: t.path, left: i, top: n }])
                          .toBuffer()
                          .then(
                            (e) =>
                              new Promise(function (t, i) {
                                process.nextTick(() => {
                                  t(e);
                                });
                              })
                          )
                  )
                  .catch((e) => {
                    Editor.error(
                      `Handle image [${t.path} error]. \n Origin path is [${
                        t.originalPath
                      }:${t.name}]. \n Error : ${e.toString()}`
                    );
                  });
              }

              if ((t.contourBleed || t.paddingBleed)) {
                s = s.then(
                    (i) =>
                      new Promise(function (r, o) {
                        process.nextTick(() => {
                          let o = i;
                          a(t, e, i, o);
                          r(o);
                        });
                      })
                  );
              }

              s
                .then((e) => o(e, d).png())
                .then((e) => {
                  i(null, e);
                })
                .catch((e) => {
                  i(e);
                });
            })(t, e, (e, r) => {
              if (e) {
                return i(e);
              }
              t.sharp = r;
              i();
            });
          },
          function (t) {
            console.timeEnd("TexturePacker: generate images");
            i(t, e);
          }
        );

        e.name = d;
        e.width = n;
        e.height = h;
      },
      function (e, t) {
        r(h.replace(/\\/g, "/"), { force: true })
          .then((i) => {
            t(null, e);
          })
          .catch((i) => {
            t(i, e);
          });
      },
    ],
    (e, t) => {
      if (global.gc) {
        global.gc();
      }

      console.timeEnd("TexturePacker: packer");
      c(e, t);
    }
  );
};
