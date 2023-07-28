const t = require(Editor.url("app://editor/share/sharp"));
const e = require("child_process").spawn;
const r = require("child_process").spawnSync;
const fireFs = require("fire-fs");
const firePath = require("fire-path");
const async = require("async");
const a = require("./texture-compress-cache");
const c = Editor.remote.Project.path;
const s = firePath.join(c, "temp/TexturePacker/build");
function l(t, e) {
  return firePath.join(firePath.dirname(t), firePath.basenameNoExt(t) + e);
}
function u(t) {
  let e = cc.Texture2D.PixelFormat;
  if (t.name.startsWith("pvrtc_")) {
    let r = e.RGBA_PVRTC_4BPPV1;

    if ("pvrtc_2bits" === t.name) {
      r = e.RGBA_PVRTC_2BPPV1;
    } else {
      if ("pvrtc_4bits_rgb" === t.name) {
        r = e.RGB_PVRTC_4BPPV1;
      } else {
        if ("pvrtc_2bits_rgb" === t.name) {
          r = e.RGB_PVRTC_2BPPV1;
        } else {
          if ("pvrtc_4bits_rgb_a" === t.name) {
            r = e.RGB_A_PVRTC_4BPPV1;
          } else {
            if ("pvrtc_2bits_rgb_a" === t.name) {
              r = e.RGB_A_PVRTC_2BPPV1;
            }
          }
        }
      }
    }

    return `.pvr@${r}`;
  }
  if (t.name.startsWith("etc")) {
    let r = e.RGB_ETC1;

    if ("etc1" === t.name) {
      r = e.RGBA_ETC1;
    } else {
      if ("etc2" === t.name) {
        r = e.RGBA_ETC2;
      } else {
        if ("etc2_rgb" === t.name) {
          r = e.RGB_ETC2;
        }
      }
    }

    return `.pkm@${r}`;
  }
  return "." + t.name;
}
function p(e, r, n, o) {
  let i = t(e);
  let a = ".png";
  if ("webp" === n.name) {
    i = i.webp({ quality: n.quality });
    a = ".webp";
  } else {
    if ("jpg" === n.name) {
      i = i.jpeg({ quality: n.quality });
      a = ".jpg";
    } else {
      if ("png" === n.name) {
        let t = (n.quality / 10) | 0;
        i = i.png({ compressionLevel: t });
      }
    }
  }
  r = l(r, a);

  i.toFile(r, (t) => {
    o(t);
  });
}
function m(t) {
  if ("number" != typeof t) {
    return;
  }
  let e = 2;
  for (; t > e; ) {
    e *= 2;
  }
  return e;
}
function _(e, r, i) {
  let a = new t(e);
  a.metadata().then((e) => {
    const c = e.width;
    const s = e.height;
    let l = m(c);
    let u = m(s);

    if (u < l / 2) {
      u = l / 2;
    }

    let p = e.channels;
    let _ = 4 === p;
    a.raw().toBuffer((e, a) => {
      if (e) {
        return i(e);
      }
      const l = 2 * c * u * 3;
      let m;
      let f;
      let d = Buffer.alloc(l, 0);
      for (let t = 0; t < s; t++) {
        for (let e = 0; e < c; e++) {
          let r = t * c + e;
          let n = r * p;
          d[(m = 3 * r)] = a[n];
          d[m + 1] = a[n + 1];
          d[m + 2] = a[n + 2];
          f = 3 * ((t + u) * c + e);
          let o = a[n + 3];

          if (!_) {
            o = 255;
          }

          d[f] = o;
          d[f + 1] = o;
          d[f + 2] = o;
        }
      }
      const b = { raw: { width: c, height: 2 * u, channels: 3 } };
      fireFs.ensureDirSync(firePath.dirname(r));

      t(d, b).toFile(r, (t) => {
        i(t);
      });
    });
  });
}
function f(t, r, n, i) {
  let a = Editor.url(
    "unpack://static/tools/texture-compress/PVRTexTool/OSX_x86/PVRTexToolCLI"
  );

  if ("win32" === process.platform) {
    a = Editor.url(
        "unpack://static/tools/texture-compress/PVRTexTool/Windows_x86_64/PVRTexToolCLI.exe"
      );
  }

  let u = false;
  let p = "PVRTC1_4";
  function m() {
    r = l(r, ".pvr");
    let o = "pvrtc" + n.quality;

    let c = [
      "-i",
      t,
      "-o",
      r,
      "-squarecanvas",
      "+",
      "-potcanvas",
      "+",
      "-q",
      o,
      "-f",
      `${p},UBN,lRGB`,
    ];

    console.log(`pvrtc compress command :  ${a} ${c.join(" ")}`);

    (function (t, r, n, o) {
      let i = e(t, r, n);

      i.stdout.on("data", function (t) {
        t.toString()
          .split("\n")
          .forEach((t) => {
            Editor.log(t);
          });
      });

      i.stderr.on("data", function (t) {
        t.toString()
          .split("\n")
          .forEach((t) => {
            Editor.info(t);
          });
      });

      i.on("close", function () {
        if (o) {
          o(null);
        }
      });

      i.on("error", function (t) {
        if (o) {
          o(t);
        }
      });
    })(a, c, {}, i);
  }

  if ("pvrtc_4bits" === n.name) {
    p = "PVRTC1_4";
  } else {
    if ("pvrtc_4bits_rgb" === n.name) {
      p = "PVRTC1_4_RGB";
    } else {
      if ("pvrtc_2bits" === n.name) {
        p = "PVRTC1_2";
      } else {
        if ("pvrtc_2bits_rgb" === n.name) {
          p = "PVRTC1_2_RGB";
        } else {
          if ("pvrtc_4bits_rgb_a" === n.name) {
            p = "PVRTC1_4_RGB";
            u = true;
          } else {
            if ("pvrtc_2bits_rgb_a" === n.name) {
              p = "PVRTC1_2_RGB";
              u = true;
            }
          }
        }
      }
    }
  }

  if (
    (u)
  ) {
    let e = firePath.relative(c, t);
    let r = firePath.join(s, "pvr_alpha", e);

    _(t, r, (e) => {
      if (e) {
        return i(e);
      }
      t = r;

      setTimeout(() => {
        m();
      }, 10);
    });

    return;
  }
  m();
}
function d(t, e, n, i) {
  let a = Editor.url(
    "unpack://static/tools/texture-compress/mali/OSX_x86/etcpack"
  );

  if ("win32" === process.platform) {
    a = Editor.url(
        "unpack://static/tools/texture-compress/mali/Windows_64/etcpack.exe"
      );
  }

  let l = firePath.dirname(a);
  a = "." + firePath.sep + firePath.basename(a);
  let u = "etc1";
  let p = "RGB";

  if ("etc1" === n.name) {
    u = "etc1";
    p = "RGBA";
  } else {
    if ("etc1_rgb" === n.name) {
      u = "etc1";
    } else {
      if ("etc2" === n.name) {
        u = "etc2";
        p = "RGBA";
      } else {
        if ("etc2_rgb" === n.name) {
          u = "etc2";
        }
      }
    }
  }

  let m = false;
  function f() {
    let c = [firePath.normalize(t), firePath.dirname(e), "-c", u, "-s", n.quality];
    let s = l;
    let m = Object.assign({}, process.env);
    m.PATH = l + ":" + m.PATH;
    let _ = { cwd: s, env: m };

    if ("etc2" === u) {
      c.push("-f", p);
    }

    console.log(`etc compress command :  ${a} ${c.join(" ")}`);

    (function (t, e, n, o) {
      let i = r(t, e, n);

      if (i.stdout.length > 0) {
        i.stdout
          .toString()
          .split("\n")
          .forEach((t) => {
            Editor.log(t);
          });
      }

      if (i.stderr.length > 0) {
        i.stderr
          .toString()
          .split("\n")
          .forEach((t) => {
            Editor.error(t);
          });
      }

      o(i.error);
    })(a, c, _, i);
  }

  if ("etc1" === u && "RGBA" === p) {
    m = true;
  }

  if ((m)) {
    let e = firePath.relative(c, t);
    let r = firePath.join(s, "etc_alpha", e);

    _(t, r, (e) => {
      if (e) {
        return i(e);
      }
      t = r;

      setTimeout(() => {
        f();
      }, 10);
    });

    return;
  }
  f();
}

module.exports = function (t, e) {
  let r = t.uuid;
  let c = t.src;
  let s = t.dst;
  let m = t.platform;
  let _ = t.actualPlatform;
  let compressOption = t.compressOption;
  let g = !!r;
  let R = "wechatgame-subcontext" !== _ && "baidugame-subcontext" !== _;

  if ("web-mobile" === _ || "web-desktop" === _) {
    _ = "web";
  } else {
    if ("mac" === _ || "win32" === _) {
      _ = "native";
    } else {
      if (!("mini-game" !== m && "runtime" !== m)) {
        _ = "minigame";
      }
    }
  }

  let P = [];
  let h = compressOption[_];
  function T() {
    return P.map(u);
  }

  if (h && h.formats.length > 0 && R) {
    P = h.formats;
  } else {
    if (compressOption.default) {
      P = compressOption.default.formats;
    }
  }

  fireFs.ensureDirSync(firePath.dirname(s));
  if (0 === P.length) {
    fireFs.copy(c, s, (t) => {
      if (t) {
        Editor.error("Failed to copy native asset file %s to %s", c, s);
      }

      e(t, T(), [s]);
    });

    return;
  }
  async.each(
    P,
    (t, e) => {
      let n = p;

      if (t.name.startsWith("pvrtc_")) {
        n = f;
      } else {
        if (t.name.startsWith("etc")) {
          n = d;
        }
      }

      let o = u(t);
      o = o.replace(/@.*/, "");
      let i = l(s, o);
      if (g && a.exportTo(r, t, o, i)) {
        e();
        return;
      }
      n(c, s, t, (n) => {
        if (g && !n) {
          a.add(r, t, o, i);
        }

        e(n);
      });
    },
    (t) => {
      let r = T();
      let n = r.map((t) => l(s, t.replace(/@.*/, "")));
      e(t, r, n);
    }
  );
};
