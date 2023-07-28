"use strict";
const e = require("iconv-lite");
const t = require("fire-path");
const r = require("fire-fs");
const i = require("del");
const o = require("child_process").spawn;
const n = require("tree-kill");
const a = require("async");
const s = require("electron");
const l = require("globby");
const c = require("xxtea-node");
const d = require("zlib");
const p = require("lodash");
const { promisify: u } = require("util");
const f = Editor.require("app://share/engine-utils");
const g = require("../share/bundle-utils");
const m = Editor.Profile.load("global://settings.json");
const E = Editor.Profile.load("global://features.json");
let j = t.join(Editor.App.home, "logs/native.log");
let S = m.get("show-console-log");
let h;
let y;
let w;
let _;
let v;
let O;
let C;
let x;
let b;
let P;
let $;
let I;
let A;
let k;
let R;
let F;
let D;
let N;
let T = -1;
let M = -1;
let L = "";
let K = Editor.url("unpack://utils/Python27/python");
function W() {
  let e = Editor.Profile.load("local://settings.json");

  if (false !== e.get("use-global-engine-setting")) {
    e = Editor.Profile.load("global://settings.json");
  }

  return e.get("use-default-cpp-engine")
    ? Editor.builtinCocosRoot
    : e.get("cpp-engine-path");
}
function B(e, r) {
  var i;
  let n = H();
  if (n) {
    return [n, i];
  }
  e = [_].concat(e);
  try {
    if ("darwin" === process.platform) {
      i = o("sh", e, r);
    } else {
      let n = e.indexOf("--env");
      let a = "COCOS_PYTHON_HOME=" + t.dirname(K);

      if (n >= 0) {
        if (n === e.length - 1) {
          e.push(a);
        } else {
          e[n + 1] += ";" + a;
        }
      } else {
        e.push("--env");
        e.push(a);
      }

      i = o(K, e, r);
    }
  } catch (e) {
    n = e;
  }
  return { error: n, child: i };
}
function H() {
  w = W();
  console.log("Cocos2dx root: " + w);
  return -1 !== w.indexOf(" ")
    ? new Error(`Cocos2dx root [${w}] can't include space.`)
    : ((y = t.join(w, "tools/cocos2d-console/bin")),
      (_ =
        "darwin" === process.platform
          ? t.join(y, "cocos")
          : t.join(y, "cocos.py")),
      null);
}
function U(e, i) {
  C = e.platform;
  if (!(A = e.template)) {
    if (i) {
      i(new Error("Template is empty, please select a template."));
    }

    return;
  }
  x = e.buildPath;
  b = e.dest;
  P = e.projectName || e.title || t.basename(e.project);
  $ = e[C].packageName || "com.fireball." + P;
  I = e.debug;
  k = e.useDebugKeystore;

  R = k
      ? Editor.url("unpack://static/build-templates/native/debug.keystore")
      : e.keystorePath;

  if ("win32" === process.platform) {
    R = R.replace(/\\/g, "/");
  }

  F = k ? 123456 : e.keystorePassword;
  D = k ? "debug_keystore" : e.keystoreAlias;
  N = k ? 123456 : e.keystoreAliasPassword;
  let n = (function (e) {
    e = e || {};
    S = m.get("show-console-log");
    let i = H();
    if (i) {
      return i;
    }
    let o = e.ndkRoot || m.get("ndk-root");
    let n = e.androidSDKRoot || m.get("android-sdk-root");

    v = {
      COCOS_FRAMEWORKS: t.join(w, "../"),
      COCOS_X_ROOT: w,
      COCOS_CONSOLE_ROOT: y,
      NDK_ROOT: o,
      ANDROID_SDK_ROOT: n,
    };

    O = "";
    for (let e in v) {
      if ("" !== O) {
        O += ";";
      }

      O += `${e}=${v[e]}`;
    }
    function a(e, t) {
      return t
        ? r.existsSync(t)
          ? null
          : new Error(`Can't find [${e}] path: ${t}`)
        : new Error(`[${e}] is empty, please set [${e}] in Preferences.`);
    }
    console.log(`native environment string : ${O}`);
    if ((i = a("Cocos Console Root", y))) {
      return i;
    }
    if (!r.existsSync(_)) {
      return new Error(`Can't find Cocos Console Bin: ${_}`);
    }
    if ("android" === C || "android-instant" === C) {
      if ((i = a("NDK Root", o))) {
        return i;
      }
      if ((i = a("Android SDK Root", n))) {
        return i;
      }
      if (!(
        "win32" !== process.platform ||
        (process.env.JAVA_HOME && r.existsSync(process.env.JAVA_HOME))
      )) {
        return new Error(
          "Please make sure java is installed and JAVA_HOME is in your environment"
        );
      }
    }
    return null;
  })(e);
  return n
    ? (i && i(n), void 0)
    : (n = (function () {
        if (-1 === C.indexOf("android") || k) {
          return null;
        }
        if (!R) {
          return new Error("Keystore Path is empty, please set Keystore path");
        }
        if (!r.existsSync(R)) {
          return new Error(
            `Keystore Path [${R}] is not exists, please check Keystore path`
          );
        }
        if (!F) {
          return new Error(
            "Keystore Password is empty, please set Keystore Password"
          );
        }
        if (!D) {
          return new Error(
            "Keystore Alias is empty, please set Keystore Alias"
          );
        }
        if (!N) {
          return new Error(
            "Keystore Alias Password is empty, please set Keystore Alias Password"
          );
        }
        return null;
      })())
    ? (i && i(n), void 0)
    : (a.series(
        [
          (e) => {
            if ("win32" === process.platform) {
              e();
              return;
            }
            try {
              let t;
              let r = o("python", ["-V"]);

              r.stderr.on("data", function (e) {
                let t = e.toString();

                if ("3" === (t = t.replace("Python ", "").replace("\n", ""))[0]) {
                  Editor.warn(
                        `Checked Python Version [${t}], please use python 2.x.x version. Recommend [2.7.5] version`
                      );
                } else {
                  Editor.log(`Checked Python Version [${t}]`);
                }
              });

              r.on("error", function () {
                t = new Error(
                  "Can't find python, please install python or check your environment"
                );
              });

              r.on("close", function () {
                e(t);
              });
            } catch (t) {
              e(
                new Error(
                  "Can't find python, please install python or check your environment"
                )
              );
            }
          },
          (e) => {
            let t = B(["-v"]);
            if (t.error) {
              return e(t.error);
            }
            let r = t.child;

            r.stdout.on("data", function (e) {
              h = e.toString();
            });

            r.stderr.on("data", function (e) {
              Editor.failed(e.toString());
            });

            r.on("close", function () {
              e();
            });

            r.on("error", function (t) {
              e(t);
            });
          },
          (e) => {
            let i = t.join(y, "../../../");
            let o = t.join(i, "version");
            let n = t.join(i, "cocos/cocos2d.cpp");

            let a = t.join(
              i,
              "frameworks/js-bindings/bindings/manual/ScriptingCore.h"
            );

            if (r.existsSync(o)) {
              L = r.readFileSync(o, "utf8");
            } else {
              let e = null;
              let t = null;

              if (r.existsSync(n)) {
                e = n;
                t = '.*return[ \t]+"(.*)";';
              } else {
                if (r.existsSync(a)) {
                  e = a;
                  t = '.*#define[ \t]+ENGINE_VERSION[ \t]+"(.*)"';
                }
              }

              if (
                (e)
              ) {
                let i = r.readFileSync(e, "utf8").match(t);

                if (i) {
                  L = i[1];
                }
              }
            }
            if (L) {
              let e = L.match("([0-9]+)[.]([0-9]+)");

              if (e) {
                T = parseInt(e[1]);
                M = parseInt(e[2]);
              }
            }
            e();
          },
        ],
        (e) => {
          if (i) {
            i(e);
          }
        }
      ),
      void 0);
}
function V(e, i) {
  let o = require("ini");
  let n = t.join(e, "cocos2d.ini");
  if (!r.existsSync(n)) {
    Editor.failed(`Can't find ${n}`);
    return null;
  }
  let a = o.parse(r.readFileSync(n, "utf-8"));

  if (!a.paths.templates) {
    a.paths.templates = "../../../templates";
  }

  a.engineMode = a.global.cocos2d_x_mode;
  a.templatesPath = t.join(e, a.paths.templates);
  let s = t.join(a.templatesPath, "js-template-*");
  a.templates = [];

  l(s, (e, r) => {
    r.forEach((e) => {
      e = t.normalize(e);
      let r = t.basename(e);
      r = r.replace("js-template-", "");
      a.templates.push(r);
    });

    if (i) {
      i(a);
    }
  });
}
const J = 26;
const q = 26;
function z(e) {
  let t = "utf-8";
  let i = r.readFileSync(Editor.url("unpack://utils/locale-encoding.py"));
  try {
    let r;
    try {
      r = "darwin" === process.platform
        ? o("python", ["-c", i])
        : o(K, ["-c", i]);
    } catch (t) {
      if (e) {
        e(t);
      }

      return;
    }

    r.stdout.on("data", function (e) {
      let r = e.toString();

      if (r) {
        t = r;
      }
    });

    r.stderr.on("data", function (e) {
      Editor.failed(e.toString());
    });

    r.on("close", function () {
      if (e) {
        e(null, t);
      }
    });

    r.on("error", function (t) {
      if (e) {
        e(t);
      }
    });
  } catch (r) {
    Editor.log("Get locale encoding failed, use utf-8 encoding");

    if (e) {
      e(null, t);
    }
  }
}
function G(t, i, o) {
  let n = "utf-8";

  let a = {
    logFilePath: j,
    disableEditorLog: !S,
    useSystemEncoding: true,
    prefix: "",
  };

  function s() {
    let a;

    if (i.logFilePath) {
      r.ensureFileSync(i.logFilePath);
      a = r.createWriteStream(i.logFilePath, { defaultEncoding: n });
    }

    t.stdout.on("data", (t) => {
      if (a) {
        a.write(t);
      }

      if (i.disableEditorLog) {
        return;
      }
      let r;

      if ((r = "win32" === process.platform ? e.decode(t, n) : t.toString())
        .length > 1) {
        r = r.replace(/\n*$/g, "");
      }

      r.split("\n").forEach((e) => {
        if (i.prefix) {
          e = i.prefix + " : " + e;
        }

        Editor.log(e);
      });
    });

    t.stderr.on("data", (t) => {
      if (a) {
        a.write(t);
      }

      if (i.disableEditorLog) {
        return;
      }
      let r;
      r = "win32" === process.platform ? e.decode(t, n) : t.toString();

      if (i.prefix) {
        r = i.prefix + " : " + r;
      }

      if (-1 !== r.toLowerCase().indexOf("warning")) {
        Editor.warn(r);
      } else {
        Editor.failed(r);
      }
    });

    t.on("close", (e, r) => {
      if (a) {
        a.close();
      }

      o.call(t, null, e, r);
    });

    t.on("error", function (e) {
      o.call(t, e);
    });
  }

  if ("function" == typeof i) {
    o = i;
    i = a;
  } else {
    i = Object.assign(a, i);
  }

  if (i.useSystemEncoding) {
    z((e, t) => {
      n = t;
      s();
    });

    return;
  }
  s();
}
function Z() {
  if ("binary" !== A) {
    return null;
  }
  let e = t.join(w, "prebuilt", C);
  return r.existsSync(e)
    ? null
    : new Error(
        `Can't find prebuilt libs for platform [${C}]. Please compile prebuilt libs first`
      );
}
function Y(e) {
  if (-1 === C.indexOf("android")) {
    return;
  }

  if (k) {
    R = Editor.url("unpack://static/build-templates/native/debug.keystore");
  }

  if ("win32" === process.platform) {
    R = R.replace(/\\/g, "/");
  }

  let i = t.join(
    b,
    "frameworks/runtime-src/proj.android-studio/gradle.properties"
  );
  if (r.existsSync(i)) {
    let o = r.readFileSync(i, "utf-8");

    o = (o = (o = (o = (o = (o = o.replace(
      /RELEASE_STORE_FILE=.*/,
      `RELEASE_STORE_FILE=${R}`
    )).replace(
      /RELEASE_STORE_PASSWORD=.*/,
      `RELEASE_STORE_PASSWORD=${F}`
    )).replace(/RELEASE_KEY_ALIAS=.*/, `RELEASE_KEY_ALIAS=${D}`)).replace(
      /RELEASE_KEY_PASSWORD=.*/,
      `RELEASE_KEY_PASSWORD=${N}`
    )).replace(
      /PROP_TARGET_SDK_VERSION=.*/,
      `PROP_TARGET_SDK_VERSION=${ee(e.apiLevel)}`
    )).replace(
      /PROP_COMPILE_SDK_VERSION=.*/,
      `PROP_COMPILE_SDK_VERSION=${ee(e.apiLevel)}`
    );

    let n =
      e.appABIs && e.appABIs.length > 0 ? e.appABIs.join(":") : "armeabi-v7a";
    o = o.replace(/PROP_APP_ABI=.*/g, `PROP_APP_ABI=${n}`);
    r.writeFileSync(i, o);
    o = "";
    o += `ndk.dir=${v.NDK_ROOT}\n`;
    o += `sdk.dir=${v.ANDROID_SDK_ROOT}`;

    if ("win32" === process.platform) {
      o = (o = o.replace(/\\/g, "\\\\")).replace(/:/g, "\\:");
    }

    r.writeFileSync(t.join(t.dirname(i), "local.properties"), o);
  }
}
function X() {
  let e = t.join(b, ".cocos-project.json");
  if (!r.existsSync(e)) {
    Editor.error(`Can't find project json [${e}]`);
    return;
  }
  let i = JSON.parse(r.readFileSync(e, "utf8"));
  let o = i.projectName;
  let n = i.packageName;
  let a = o !== P;
  let s = n !== $;
  if (!a && !s) {
    return;
  }
  let l = t.join(b, "cocos-project-template.json");
  if (!r.existsSync(l)) {
    Editor.error(`Can't find template json [${l}]`);
    return;
  }
  let c;
  let d = JSON.parse(r.readFileSync(l, "utf8")).do_add_native_support;

  if (s) {
    (c = (c = (c = d.project_replace_package_name.files).concat(
      d.project_replace_mac_bundleid.files
    )).concat(d.project_replace_ios_bundleid.files)).forEach(function (e) {
      let i = t.join(b, e);
      if (!r.existsSync(i)) {
        Editor.error(
          `Can't not find file [${e}], replace package name failed`
        );

        return;
      }
      let o = r.readFileSync(i, "utf8");
      o = o.replace(new RegExp(n, "gm"), $);
      r.writeFileSync(i, o);
    });
  }

  if (a) {
    (c = d.project_replace_project_name.files).forEach((e) => {
      let i = t.join(b, e.replace("PROJECT_NAME", o));
      if (!r.existsSync(i)) {
        Editor.error(
          `Can't not find file [${i}], replace project name failed`
        );

        return;
      }
      let n = r.readFileSync(i, "utf8");
      n = n.replace(new RegExp(o, "gm"), P);
      r.writeFileSync(i, n);
    });

    (c = d.project_rename.files).forEach((e) => {
      let i = t.join(b, e.replace("PROJECT_NAME", o));
      if (!r.existsSync(i)) {
        Editor.error(
          `Can't not find file [${i}], replace project name failed`
        );

        return;
      }
      let n = t.join(b, e.replace("PROJECT_NAME", P));
      r.renameSync(i, n);
    });
  }

  i.projectName = P;
  i.packageName = $;
  r.writeFileSync(e, JSON.stringify(i, null, 2));
}
function Q(e, i) {
  const o = require("plist");
  let n = t.join(b, "frameworks/runtime-src/proj.ios_mac/ios/Info.plist");
  if (r.existsSync(n)) {
    let t = r.readFileSync(n, "utf8");
    let i = o.parse(t);
    let a = [];

    if (e.landscapeRight) {
      a.push("UIInterfaceOrientationLandscapeRight");
    }

    if (e.landscapeLeft) {
      a.push("UIInterfaceOrientationLandscapeLeft");
    }

    if (e.portrait) {
      a.push("UIInterfaceOrientationPortrait");
    }

    if (e.upsideDown) {
      a.push("UIInterfaceOrientationPortraitUpsideDown");
    }

    i.UISupportedInterfaceOrientations = a;
    t = o.build(i);
    r.writeFileSync(n, t);
  }
  let a = [
    t.join(
      b,
      "frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml"
    ),
    t.join(
      b,
      "frameworks/runtime-src/proj.android-studio/game/AndroidManifest.xml"
    ),
  ].filter((e) => r.existsSync(e));
  for (let t = 0, o = a.length; t < o; t++) {
    let o = a[t];
    let n = o.indexOf("proj.android-studio") >= 0;
    let s = /android:screenOrientation=\"[^"]*\"/;
    let l = 'android:screenOrientation="unspecified"';
    if (e.landscapeRight && e.landscapeLeft && e.portrait && e.upsideDown) {
      l = 'android:screenOrientation="fullSensor"';
    } else {
      if (e.landscapeRight && !e.landscapeLeft) {
        l = 'android:screenOrientation="landscape"';
      } else {
        if (!e.landscapeRight && e.landscapeLeft) {
          l = 'android:screenOrientation="reverseLandscape"';
        } else {
          if (e.landscapeRight && e.landscapeLeft) {
            l = 'android:screenOrientation="sensorLandscape"';
          } else {
            if (e.portrait && !e.upsideDown) {
              l = 'android:screenOrientation="portrait"';
            } else {
              if (!e.portrait && e.upsideDown) {
                let e = "reversePortrait";

                if (i < 16 && !n) {
                  e = "reversePortait";
                }

                l = `android:screenOrientation="${e}"`;
              } else {
                if (e.portrait && e.upsideDown) {
                  let e = "sensorPortrait";

                  if (i < 16 && !n) {
                    e = "sensorPortait";
                  }

                  l = `android:screenOrientation="${e}"`;
                }
              }
            }
          }
        }
      }
    }
    let c = r.readFileSync(o, "utf8");
    c = c.replace(s, l);
    r.writeFileSync(o, c);
  }
}
function ee(e) {
  let t = e.match("android-([0-9]+)$");
  let r = -1;

  if (t) {
    r = parseInt(t[1]);
  }

  return r;
}
var te = [
  ["USE_VIDEO", "VideoPlayer"],
  ["USE_WEB_VIEW", "WebView"],
  ["USE_EDIT_BOX", "EditBox"],
  ["USE_AUDIO", "Audio"],
  ["USE_SPINE", "Spine Skeleton"],
  ["USE_DRAGONBONES", "DragonBones"],
  ["USE_SOCKET", "Native Socket"],
];
const re = "CC_IOS_FORCE_DISABLE_JIT";
function ie(e) {
  let i = e.platform.toLowerCase();
  if ("mac" === i) {
    oe(
      "link" === e.template
        ? t.join(W(), "cocos/platform/mac/CCModuleConfigMac.debug.xcconfig")
        : t.join(
            b,
            "frameworks/cocos2d-x/cocos/platform/mac/CCModuleConfigMac.debug.xcconfig"
          ),
      e
    );

    oe(
      "link" === e.template
        ? t.join(W(), "cocos/platform/mac/CCModuleConfigMac.release.xcconfig")
        : t.join(
            b,
            "frameworks/cocos2d-x/cocos/platform/mac/CCModuleConfigMac.release.xcconfig"
          ),
      e
    );
  } else {
    if ("ios" === i) {
      oe(
        "link" === e.template
          ? t.join(W(), "cocos/platform/ios/CCModuleConfigIOS.debug.xcconfig")
          : t.join(
              b,
              "frameworks/cocos2d-x/cocos/platform/ios/CCModuleConfigIOS.debug.xcconfig"
            ),
        e
      );

      oe(
        "link" === e.template
          ? t.join(W(), "cocos/platform/ios/CCModuleConfigIOS.release.xcconfig")
          : t.join(
              b,
              "frameworks/cocos2d-x/cocos/platform/ios/CCModuleConfigIOS.release.xcconfig"
            ),
        e
      );
    } else {
      if ("android" === i || "android-instant" === i) {
        (function (e) {
          let i = t.join(
            b,
            "frameworks/runtime-src/proj.android-studio/jni/CocosApplication.mk"
          );
          if (!r.existsSync(i)) {
            Editor.failed(`Can not find file ${i}`);
            return;
          }
          let o = r.readFileSync(i, "utf8");
          let n = o;

          te.forEach((t) => {
            (function (t) {
              let r = -1 !== e.excludedModules.indexOf(t[1]);

              if (-1 === o.indexOf(t[0])) {
                o += `${t[0]} := ${r ? 0 : 1}\n`;
              } else {
                o = o.replace(
                      new RegExp(`${t[0]}\\s*:=\\s*(0|1)`, "g"),
                      `${t[0]} := ${r ? 0 : 1}`
                    );
              }
            })(t);
          });

          if (n !== o) {
            r.writeFileSync(i, o);
          }
        })(e);
      } else {
        if ("win32" === i) {
          (function (e) {})();
        }
      }
    }
  }
}
function oe(e, t) {
  if (!r.existsSync(e)) {
    Editor.failed(`Can not find file ${e}`);
    return;
  }
  let i = r.readFileSync(e, "utf8");
  te.forEach((e) => {
    (function (e) {
      let r = -1 !== t.excludedModules.indexOf(e[1]);
      i = -1 === i.indexOf(e[0])
        ? i.replace(/\$\(inherited\)/, (t) => t + ` ${e[0]}=${r ? 0 : 1}`)
        : i.replace(new RegExp(`${e[0]}=(0|1)`), `${e[0]}=${r ? 0 : 1}`);
    })(e);
  });
  let o = 1;

  if (E && !E.get("iOSForceDisableJit")) {
    o = t.ios.ios_enable_jit ? 0 : 1;
  }

  i = -1 === i.indexOf(re)
    ? i.replace(/\$\(inherited\)/, (e) => e + ` ${re}=${o}`)
    : i.replace(new RegExp(`${re}=(0|1)`), `${re}=${o}`);

  r.writeFileSync(e, i);
}
function ne(e) {
  if ("mac" === C || "win32" === C) {
    let i = t.join(e.dest, "frameworks/runtime-src/Classes/NativeConfig.h");
    if (!r.existsSync(i)) {
      Editor.error("can not find NativeConfig.h at path", i);
      return;
    }
    let o = r.readFileSync(i, "utf8");

    if ("mac" === C) {
      o = (o = o.replace(
            /MACOS_WIN_SIZE_WIDTH \s*[0-9]+/,
            "MACOS_WIN_SIZE_WIDTH " + e.mac.width
          )).replace(
            /MACOS_WIN_SIZE_HEIGHT \s*[0-9]+/,
            "MACOS_WIN_SIZE_HEIGHT " + e.mac.height
          );
    } else {
      if ("win32" === C) {
        o = (o = o.replace(
              /WINDOWS_WIN_SIZE_WIDTH \s*[0-9]+/,
              "WINDOWS_WIN_SIZE_WIDTH " + e.win32.width
            )).replace(
              /WINDOWS_WIN_SIZE_HEIGHT \s*[0-9]+/,
              "WINDOWS_WIN_SIZE_HEIGHT " + e.win32.height
            );
      }
    }

    r.writeFileSync(i, o, "utf8");
  }
}
let ae;
let se;
let le;
let ce;
let de;
function pe() {
  if (ae) {
    se = true;

    n(ae.pid, "SIGTERM", () => {
      se = false;
    });

    ae = null;
  }
}
function ue(e) {
  let i = false;
  if ("ios" === C) {
    i = r
      .readdirSync(t.join(e.dest, "frameworks/runtime-src/proj.ios_mac/"))
      .some((e) => e.endsWith(".xcworkspace"));
  }
  return i;
}
function fe(e) {
  Editor.log("Begin generate Android App Bundle...");
  let i = "android-instant" === C;
  let n = i ? ":game:bundle" : "bundle";
  let a = t.join(b, "frameworks/runtime-src/proj.android-studio");
  let s = "win32" === process.platform ? ".\\gradlew.bat" : "./gradlew";
  let l = o(s, [`${n}${I ? "Debug" : "Release"}`], { cwd: a });

  l.on("close", (o) => {
    if (0 === o) {
      let e = t.join(
        a,
        `app/build/outputs/bundle/${I ? "debug" : "release"}/${P}.aab`
      );

      if (i) {
        e = t.join(
            a,
            `game/build/outputs/bundle/${
              I ? "debugFeature" : "releaseFeature"
            }/game.aab`
          );
      }

      r.copySync(
        e,
        t.join(
          b,
          I ? "simulator" : "publish",
          "android",
          `${P}-${I ? "debug" : "release"}.aab`
        )
      );
    } else {
      Editor.warn("generate Android App Bundle fail");
    }

    if (e) {
      e();
    }
  });

  l.stdout.on("data", (e) => {
    Editor.log(`stdout: ${e}`);
  });

  l.stderr.on("data", (e) => {
    Editor.error(`stderr: ${e}`);
  });
}
function ge() {
  if (le) {
    n(le.pid);
    le = null;
  }
}
function me() {
  if (ce) {
    n(ce.pid);
    ce = null;
    Editor.Panel.close("simulator-debugger");
  }
}
let Ee;

let je = p.throttle(
  function (n) {
    me();

    (function () {
      try {
        let e = Editor.Profile.load("local://settings.json");

        if (e.get("use-global-engine-setting")) {
          e = Editor.Profile.load("global://settings.json");
        }

        let i = e.get("use-default-cpp-engine")
            ? void 0
            : e.get("cpp-engine-path");

        let o = f.getSimulatorConfigAt(i);
        let n = o.init_cfg;
        const a = Editor.Profile.load("project://project.json");
        if (a.get("use-project-simulator-setting")) {
          let e = a.get("simulator-resolution");
          n.width = e.width;
          n.height = e.height;
          n.isLandscape = a.get("simulator-orientation");
          de = a.get("clear-simulator-cache");
        } else {
          let t = e.get("simulator-resolution");

          let r = o.simulator_screen_size[t] ||
          e.get("simulator-customsize-resolution");

          n.width = r.width;
          n.height = r.height;
          n.isLandscape = e.get("simulator-orientation");
          de = e.get("clear-simulator-cache");
        }
        de = "boolean" != typeof de || de;
        let s = f.getSimulatorConfigPath(i);

        if (r.existsSync(t.dirname(s))) {
          r.writeJsonSync(s, o, "utf-8");
        }
      } catch (e) {
        Editor.error(e);
      }
    })();

    let s;
    let l;
    let c;
    let d = Editor.Profile.load("global://settings.json");

    if (d &&
      d.get("simulator-debugger")) {
      Editor.Panel.open("simulator-debugger");
    }

    let p = Editor.url("unpack://static/simulator/");
    let u = "utf-8";

    if ("darwin" === process.platform) {
      c = Editor.url("unpack://simulator/mac/Simulator.app");
      s = t.join(c, "Contents/MacOS/Simulator");
      l = t.join(c, "Contents/Resources");
    } else {
      if ("win32" === process.platform) {
        c = Editor.url("unpack://simulator/win32");
        s = t.join(c, "Simulator.exe");
        l = c;
      }
    }

    let m = Editor.url("unpack://engine/bin");

    [
      {
        src: t.join(m, "cocos2d-jsb-for-preview.js"),
        dst: t.join(l, "src/cocos2d-jsb.js"),
      },
      {
        src: t.join(p, "asset-record-pipe.js"),
        dst: t.join(l, "src/asset-record-pipe.js"),
      },
      {
        src: t.join(p, "simulator-config.js"),
        dst: t.join(l, "src/simulator-config.js"),
      },
      {
        src: Editor.url("packages://jsb-adapter/bin"),
        dst: t.join(l, "jsb-adapter"),
      },
    ].forEach((e) => {
      r.copySync(e.src, e.dst);
    });

    i.sync(t.join(l, "assets").replace(/\\/g, "/"), { force: true });

    if (de) {
      i.sync(t.join(l, "gamecaches").replace(/\\/g, "/"), { force: true });
    }

    a.series(
      [
        (e) => {
          if (n) {
            r.ensureDirSync(n.recordPath);
            r.emptyDirSync(n.recordPath);

            if ("win32" === process.platform) {
              n.recordPath = n.recordPath.replace(/\\/g, "/");
            }

            let e = r.readFileSync(
              t.join(p, "simulator-config.js"),
              "utf-8"
            );

            e = (e = e.replace(
              /CC_SIMULATOR_RECORD_MODE\s=\sfalse/g,
              "CC_SIMULATOR_RECORD_MODE = true"
            )).replace(
              /CC_SIMULATOR_RECORD_PATH\s=\s""/g,
              `CC_SIMULATOR_RECORD_PATH = "${n.recordPath}"`
            );

            r.writeFileSync(t.join(l, "src/simulator-config.js"), e);
          }
          e();
        },
        (e) => {
          let i = r.readFileSync(t.join(p, "main.js"), "utf-8");
          let o = t.join(Editor.Project.path, "library/imports");
          let n = Editor.Project.path;
          let a = Editor.ProjectCompiler.DEST_PATH;

          if ("win32" === process.platform) {
            o = o.replace(/\\/g, "/");
            n = n.replace(/\\/g, "/");
            a = a.replace(/\\/g, "/");
          }

          i = (i = (i = (i = i.replace(
              /{importPath}/g,
              `'${o}/'`
            )).replace(/{nativePath}/g, `'${o}/'`)).replace(
              /{scriptPath}/g,
              `'${n}/'`
            )).replace(/{tempScriptsPath}/g, `'${a}/'`);

          let s = f.getSimulatorConfigAt();

          if (s && s.init_cfg.waitForConnect) {
            i = "debugger\n" + i;
          }

          r.writeFileSync(t.join(l, "main.js"), i);
          e();
        },
        (e) => {
          var i = Editor.isWin32 ? "win32" : "mac";
          Editor.PreviewServer.query("settings.js", i, (i, o) => {
            if (i) {
              e(i);
              return;
            }
            r.writeFileSync(t.join(l, "src/settings.js"), o);
            e();
          });
        },
        (e) => {
          (async () => {
            let i = await g.queryBundleFolders();
            i.push({ name: "main" });

            a.eachSeries(
              i,
              (e, i) => {
                r.outputFileSync(
                  t.join(l, `assets/${e.name}/index.js`),
                  " "
                );

                Editor.PreviewServer.query(
                  `${e.name}/config.json`,
                  Editor.isWin32 ? "win32" : "mac",
                  (o, n) => {
                    if (o) {
                      i(o);
                      return;
                    }

                    r.outputFileSync(
                      t.join(l, `assets/${e.name}/config.json`),
                      n
                    );

                    i();
                  }
                );
              },
              (t) => {
                e(t);
              }
            );
          })();
        },
        (e) => {
          let i = t.join(l, "preview-scene.json");
          Editor.PreviewServer.getPreviewScene(
            function (t) {
              e(t);
            },
            function (t) {
              r.writeFile(i, t, e);
            },
            function (t) {
              r.copy(t, i, e);
            }
          );
        },
        (e) => {
          z((t, r) => {
            u = r;
            e(t);
          });
        },
      ],
      (t) => {
        if (t) {
          Editor.failed(t);
          return;
        }
        let r = [
          "-workdir",
          l,
          "-writable-path",
          l,
          "-console",
          "false",
          "--env",
          O,
        ];
        try {
          ce = o(s, r);
        } catch (t) {
          Editor.error(t);
          return;
        } finally {
          je.cancel();
        }
        let i = (e, t) => {
          if (e) {
            Editor.error(e);
            return;
          }

          if (0 === t) {
            ce = null;
          }
        };

        ce.stderr.on("data", (t) => {
          let r;

          if ((r = "win32" === process.platform ? e.decode(t, u) : t.toString())
            .length > 1) {
            r = r.replace(/\n*$/g, "");
          }

          let i = "error";

          if (-1 !== r.toLowerCase().indexOf("warning")) {
            i = "warn";
          }

          Editor.Ipc.sendToPanel(
            "scene",
            "scene:print-simulator-log",
            r,
            i
          );
        });

        ce.stdout.on("data", (t) => {
          let r;

          if ((r =
            "win32" === process.platform ? e.decode(t, u) : t.toString())
            .length > 1) {
            r = r.replace(/\n*$/g, "");
          }

          let i = r.split("\n");
          i.forEach((e) => {
            Editor.Ipc.sendToPanel(
              "scene",
              "scene:print-simulator-log",
              e
            );
          });
        });

        ce.on("close", (e, t) => {
          i.call(ce, null, e, t);
          Editor.Panel.close("simulator-debugger");
        });

        ce.on("error", function (e) {
          i.call(ce, e);
          Editor.Panel.close("simulator-debugger");
        });
      }
    );
  },
  2e3,
  { trailing: false }
);

module.exports = {
  build: function (e, o) {
    U(e, (n) => {
      if ((n = n || Z())) {
        if (o) {
          o(n);
        }

        return;
      }
      let a = ee(e.apiLevel);
      a = a > 0 ? a : J;
      if ((!r.existsSync(b))) {
        Editor.log("Creating native cocos project to ", b);
        let s = "tempCocosProject";
        let l = t.join(x, s);
        if (r.existsSync(l)) {
          try {
            i.sync(l.replace(/\\/g, "/"), { force: true });
          } catch (n) {
            if (o) {
              o(n);
            }

            return;
          }
        }
        Editor.Ipc.sendToMain(
          "builder:state-changed",
          "creating native project",
          0.05
        );
        let c = B(["new", s, "-l", "js", "-d", x, "-t", A, "--env", O]);
        return c.error
          ? (o && o(c.error), void 0)
          : (G(c.child, (n, c) =>
              n
                ? (o && o(n), void 0)
                : 0 !== c
                ? (o &&
                    o(
                      new Error("Failed to create project with exitCode : " + c)
                    ),
                  void 0)
                : (r.rename(l, b, (n) => {
                    if (n) {
                      if (o) {
                        o(n);
                      }

                      return;
                    }
                    V(y, (n) => {
                      let l = t.join(n.templatesPath, "js-template-" + A);
                      let c = t.join(l, "cocos-project-template.json");
                      let d = t.join(b, "cocos-project-template.json");
                      r.copySync(c, d);
                      try {
                        (function (e, i) {
                          let o = t.join(b, ".cocos-project.json");
                          let n = JSON.parse(r.readFileSync(o, "utf8"));
                          n.projectName = e;
                          n.packageName = i;
                          r.writeFileSync(o, JSON.stringify(n, null, 2));
                        })(s, "org.cocos2dx." + s);

                        void (
                          "win32" !== process.platform &&
                          [
                            t.join(
                              b,
                              "frameworks/runtime-src/proj.android-studio/app/jni/Application.mk"
                            ),
                          ].forEach((e) => {
                            let t = r.readFileSync(e, "utf8").split("\n");
                            for (let e = 0; e < t.length; e++) {
                              let r = t[e];

                              if (r.match(/\bAPP_SHORT_COMMANDS\b.*:=.*true/)) {
                                t[e] = "#" + r;
                              }
                            }
                            r.writeFileSync(e, t.join("\n"));
                          })
                        );

                        X();

                        (function () {
                          if ("android-instant" !== A) {
                            let e = t.join(
                              b,
                              `frameworks/runtime-src/proj.ios_mac/${P}.xcodeproj/project.pbxproj`
                            );
                            if (r.existsSync(e)) {
                              let i = r.readFileSync(e, "utf8");

                              i = i.replace(
                                /\/Applications\/CocosCreator.app\/Contents\/Resources\/cocos2d-x/g,
                                t.resolve(w)
                              );

                              r.writeFileSync(e, i);
                            } else {
                              Editor.warn(
                                `Can't find path [${e}]. Replacing project file failed`
                              );
                            }
                          }
                          let e = [
                            t.join(
                              b,
                              "frameworks/runtime-src/proj.android-studio/build-cfg.json"
                            ),
                            t.join(
                              b,
                              "frameworks/runtime-src/proj.android-studio/settings.gradle"
                            ),
                            t.join(
                              b,
                              "frameworks/runtime-src/proj.android-studio/app/build.gradle"
                            ),
                            t.join(
                              b,
                              "frameworks/runtime-src/proj.android-studio/game/build.gradle"
                            ),
                          ];

                          if ("android-instant" !== A) {
                            e.push(
                                t.join(
                                  b,
                                  "frameworks/runtime-src/proj.win32/build-cfg.json"
                                )
                              );

                            e.push(
                              t.join(
                                b,
                                `frameworks/runtime-src/proj.win32/${P}.vcxproj`
                              )
                            );

                            e.push(
                              t.join(
                                b,
                                `frameworks/runtime-src/proj.win32/${P}.sln`
                              )
                            );
                          }

                          if ("link" === A) {
                            e.push(
                                t.join(
                                  b,
                                  "frameworks/runtime-src/proj.ios_mac/ios/UserConfigIOS.debug.xcconfig"
                                )
                              );

                            e.push(
                              t.join(
                                b,
                                "frameworks/runtime-src/proj.ios_mac/ios/UserConfigIOS.release.xcconfig"
                              )
                            );

                            e.push(
                              t.join(
                                b,
                                "frameworks/runtime-src/proj.ios_mac/mac/UserConfigMac.debug.xcconfig"
                              )
                            );

                            e.push(
                              t.join(
                                b,
                                "frameworks/runtime-src/proj.ios_mac/mac/UserConfigMac.release.xcconfig"
                              )
                            );
                          }

                          e.forEach((e) => {
                            if (!r.existsSync(e)) {
                              Editor.warn(
                                `Replace file [${e}] not find.`
                              );

                              return;
                            }
                            let i = r.readFileSync(e, "utf8");
                            let o = t.resolve(w);
                            let n = t.basename(e);

                            if (!("build-cfg.json" !== n &&
                              "settings.gradle" !== n && "build.gradle" !== n)) {
                              o = o.replace(/\\/g, "/");
                            }

                            i = (i = i.replace(
                                /\$\{COCOS_X_ROOT\}/g,
                                o
                              )).replace(/\$\(COCOS_X_ROOT\)/g, o);

                            r.writeFileSync(e, i);
                          });
                        })();

                        (function () {
                          try {
                            i.sync(t.join(b, "asset").replace(/\\/g, "/"), {
                              force: true,
                            });

                            i.sync(t.join(b, "src").replace(/\\/g, "/"), {
                              force: true,
                            });
                          } catch (e) {
                            Editor.error(e);
                          }
                        })();

                        Y(e);
                        Q(e.orientation, a);
                        ie(e);
                        ne(e);
                      } catch (e) {
                        if (o) {
                          o(e);
                        }

                        return;
                      }

                      if (o) {
                        o();
                      }
                    });
                  }),
                  void 0)
            ),
            void 0);
      }
      try {
        X();
        Y(e);
        Q(e.orientation, a);

        (function () {
          let e = t.join(b, ".cocos-project.json");
          if (!r.existsSync(e)) {
            Editor.failed(`Can't find project json [${e}]`);
            return;
          }
          let i = JSON.parse(r.readFileSync(e, "utf8")).engine_version;

          if (i !== L) {
            Editor.failed(
              `Project version [${i}] not match cocos2d-x-lite version [${L}]. Please delete your build path, then rebuild project.`
            );
          }
        })();

        ie(e);
        ne(e);
      } catch (n) {
        if (o) {
          o(n);
        }

        return;
      }

      if (o) {
        o();
      }
    });
  },
  compile: function (e, t) {
    Editor.Ipc.sendToMain("builder:state-changed", "init settings", 0);

    U(e, (i) => {
      if ((i = i || Z())) {
        if (t) {
          t(i);
        }

        return;
      }
      if (!r.existsSync(b)) {
        if (t) {
          t(new Error(`Can't find ${b}, please first build project`));
        }

        return;
      }
      Editor.Ipc.sendToMain("builder:state-changed", "compile native", 0.1);
      Editor.log("Start to compile native project. Please wait...");
      Editor.log(`The log file path [ ${j} ]`);

      let o = [
          "compile",
          "-p",
          "android-instant" === C ? "android" : C,
          "-m",
          I ? "debug" : "release",
          "--compile-script",
          0,
          "--env",
          O,
        ];

      let n = { cwd: b };

      if ("android-instant" === C) {
        o.push("--instant-game");
      }

      if (ue(e)) {
        o.push("--xcworkspace");
      }

      let a = J;
      if ("android" === C || "android-instant" === C) {
        o.push("--android-studio");
        if ((e.apiLevel)) {
          let t = ee(e.apiLevel);

          if (t > 0) {
            o.push("--ap");
            o.push(e.apiLevel);
            a = t;
          }
        }

        if (e.appABIs &&
          e.appABIs.length > 0) {
          o.push("--app-abi");
          o.push(e.appABIs.join(":"));
        }
      }
      if ("win32" === C) {
        let t = "";
        t = "auto" === e.vsVersion ? "2015" : e.vsVersion;
        o.push("--vs");
        o.push(t);
      }
      Q(e.orientation, a);
      let s = B(o, n);
      if (s.error) {
        if (t) {
          t(s.error);
        }

        return;
      }
      let l = 0.1;
      function c() {
        if ((l += 5e-4) > 0.9) {
          l = 0.9;
        }

        Editor.Ipc.sendToMain("builder:state-changed", "compile native", l);
      }

      (ae = s.child).stdout.on("data", () => {
        c();
      });

      ae.stderr.on("data", () => {
        c();
      });

      G(ae, async (r, i, o) => {
        if (r) {
          if (t) {
            t(r);
          }

          return;
        }
        ae = null;
        if (0 === i) {
          if (!(!e.appBundle || ("android-instant" !== C && "android" !== C))) {
            (await u(fe)());
          }

          Editor.Ipc.sendToMain("builder:state-changed", "finish", 1);
          Editor.log("Compile native project successfully.");
        } else {
          if (!se && "SIGTERM" !== o) {
            if (t) {
              t(new Error(`Compile failed. The log file path [ ${j} ]`));
            }

            return;
          }
          Editor.log("Compile native project exited normal");
        }

        if (t) {
          t();
        }
      });
    });
  },
  encryptJsFiles: function (e, o, n) {
    U(e, (a) => {
      if (a) {
        if (n) {
          n(a);
        }

        return;
      }
      if (!r.existsSync(b)) {
        if (n) {
          n(new Error(`Can't find ${b}, please first build project`));
        }

        return;
      }
      if (!e.xxteaKey) {
        if (n) {
          n(new Error("xxtea key is empty."));
        }

        return;
      }
      (function (e) {
        let i = t.join(b, "frameworks/runtime-src/Classes/AppDelegate.cpp");
        if (!r.existsSync(i)) {
          Editor.warn(`Can't find path [${i}]`);
          return;
        }
        let o = r.readFileSync(i, "utf8").split("\n");
        for (let t = 0; t < o.length; t++) {
          if (-1 !== o[t].indexOf("jsb_set_xxtea_key")) {
            o[t] = `    jsb_set_xxtea_key("${e.xxteaKey}");`;
          }
        }
        r.writeFileSync(i, o.join("\n"));
      })(e);
      let s = [t.join(b, "src", "**/*.js")].concat(
        o.map((e) => t.join(e, "**/*.js"))
      );
      l(s, (o, a) => {
        if (o) {
          if (n) {
            n(o);
          }

          return;
        }

        a.forEach((o) => {
          o = t.normalize(o);
          try {
            let n = r.readFileSync(o, "utf8");

            if (e.zipCompressJs) {
              n = d.gzipSync(n);
              n = c.encrypt(n, c.toBytes(e.xxteaKey));
            } else {
              n = c.encrypt(c.toBytes(n), c.toBytes(e.xxteaKey));
            }

            r.writeFileSync(
              t.join(t.dirname(o), t.basenameNoExt(o)) + ".jsc",
              n
            );

            i.sync(o.replace(/\\/g, "/"), { force: true });
          } catch (e) {
            Editor.warn(e);
          }
        });

        if (n) {
          n();
        }
      });
    });
  },
  run: function (e, i) {
    ge();
    Editor.log("Start to run project");

    U(e, (n) => {
      if (n) {
        if (i) {
          i(n);
        }

        return;
      }
      if (!r.existsSync(b)) {
        if (i) {
          i(new Error(`Can't find ${b}, please first build project`));
        }

        return;
      }
      Editor.log("Start to run project. Please wait...");
      Editor.log(`The log file path [ ${j} ]`);

      let a = [
          "run",
          "-p",
          "android-instant" === C ? "android" : C,
          "-m",
          I ? "debug" : "release",
          "--env",
          O,
          "--compile-script",
          0,
        ];

      let s = { cwd: b };
      if ("android-instant" === C) {
        let t = e["android-instant"];
        a.push("--instant-game");

        if (t.scheme &&
          t.host &&
          t.pathPattern) {
          a.push("--launch-url");
          a.push(`${t.scheme}://${t.host}${t.pathPattern}`);
        }
      }

      if (ue(e)) {
        a.push("--xcworkspace");
      }

      let l = J;
      if ("android" === C || "android-instant" === C) {
        a.push("--android-studio");
        if ((e.apiLevel)) {
          let t = ee(e.apiLevel);

          if (t > 0) {
            a.push("--ap");
            a.push(e.apiLevel);
            l = t;
          }
        }

        if (e.appABIs &&
          e.appABIs.length > 0) {
          a.push("--app-abi");
          a.push(e.appABIs.join(":"));
        }
      }

      if ("win32" === C &&
          "auto" !== e.vsVersion) {
        a.push("--vs");
        a.push(e.vsVersion);
      }

      Q(e.orientation, l);
      if (
        ("win32" === process.platform && "win32" === C)
      ) {
        let e;
        e = I
          ? t.join(b, "simulator/win32", P + ".exe")
          : t.join(b, "publish/win32", P + ".exe");
        try {
          le = o(e, {}, s);
        } catch (n) {
          if (i) {
            i(n);
          }

          return;
        }
      } else {
        let e = B(a, s);
        if (e.error) {
          if (i) {
            i(e.error);
          }

          return;
        }
        le = e.child;
      }
      G(le, (e, t) =>
        e
          ? (i && i(e), void 0)
          : 0 !== t
          ? (i &&
              i(
                new Error(`Failed to run project. The log file path [ ${j} ]`)
              ),
            void 0)
          : (i && i(), void 0)
      );
    });
  },
  runSimulator: je,
  saveKeystore: function (e, n) {
    let a = "keytool";
    if ("win32" === process.platform) {
      if (!process.env.JAVA_HOME || !r.existsSync(process.env.JAVA_HOME)) {
        if (n) {
          n(
            new Error(
              "Please make sure java is installed and JAVA_HOME is in your environment"
            )
          );
        }

        return;
      }
      a = t.join(process.env.JAVA_HOME, "bin/keytool.exe");
      if (!r.existsSync(a)) {
        if (n) {
          n(
            new Error(
              `Can't find path [${a}]. Please make sure JAVA_HOME is in your environment and exists`
            )
          );
        }

        return;
      }
    }
    let s = e.dest;

    if (r.existsSync(s)) {
      i.sync(s.replace(/\\/g, "/"), { force: true });
    }

    let l = [];

    if (e.commonName) {
      l.push(`CN=${e.commonName}`);
    }

    if (e.organizationalUnit) {
      l.push(`OU=${e.organizationalUnit}`);
    }

    if (e.organization) {
      l.push(`O=${e.organization}`);
    }

    if (e.locality) {
      l.push(`L=${e.locality}`);
    }

    if (e.state) {
      l.push(`S=${e.state}`);
    }

    if (e.country) {
      l.push(`C=${e.country}`);
    }

    l = l.join(",");
    let c = [
      "-genkey",
      "-keyalg",
      "RSA",
      "-keysize",
      "1024",
      "-validity",
      e.validity,
      "-keystore",
      t.basename(s),
      "-storepass",
      e.password,
      "-alias",
      e.alias,
      "-keypass",
      e.aliasPassword,
      "-dname",
      l,
    ];
    Editor.log("Creating keystore : ", c.join(" "));
    let d;
    let p = { cwd: t.dirname(s) };
    try {
      d = o(a, c, p);
    } catch (e) {
      if (n) {
        n(e);
      }

      return;
    }
    G(d, (e, t) =>
      e
        ? (n && n(e), void 0)
        : 0 !== t
        ? (n &&
            n(
              new Error(
                "Failed to create keystore, please check the log information"
              )
            ),
          void 0)
        : (n(), void 0)
    );
  },
  openNativeLogFile: function () {
    r.ensureFileSync(j);
    s.shell.openPath(j);
  },
  stopCompile: pe,
  getCocosTemplates: function (e) {
    let r = Editor.Profile.load("local://settings.json");

    if (false !== r.get("use-global-engine-setting")) {
      r = Editor.Profile.load("global://settings.json");
    }

    if (r.get("use-default-cpp-engine")) {
      w = Editor.builtinCocosRoot;

      if (Editor.dev &&
        !w) {
        Editor.error(
          "Can not find builtin cocos2d-x, please run 'gulp update-externs'."
        );
      }
    } else {
      if (!(w = r.get("cpp-engine-path"))) {
        Editor.error("Can not find cocos engine.");
      }
    }

    V(t.join(w, "tools", "cocos2d-console", "bin"), (t) => {
      if (e) {
        e(null, t.templates);
      }
    });
  },
  getAndroidAPILevels: function (e) {
    let i = m.get("android-sdk-root");
    if (!r.isDirSync(i)) {
      e(null, []);
      return;
    }
    let o = t.join(i, "platforms", "android-*");
    l(o, (i, o) => {
      let n = [];

      o.forEach((e) => {
        e = t.normalize(e);
        let i = t.basename(e);

        if (ee(i) >= J && r.isDirSync(e)) {
          n.push(i);
        }
      });

      if (e) {
        e(null, n);
      }
    });
  },
  getAndroidInstantAPILevels: function (e) {
    let i = m.get("android-sdk-root");
    if (!r.isDirSync(i)) {
      e(null, []);
      return;
    }
    let o = t.join(i, "platforms", "android-*");
    l(o, (i, o) => {
      let n = [];

      o.forEach((e) => {
        e = t.normalize(e);
        let i = t.basename(e);

        if (ee(i) >= q && r.isDirSync(e)) {
          n.push(i);
        }
      });

      if (e) {
        e(null, n);
      }
    });
  },
  stop: function () {
    pe();
    ge();
    me();

    if (Ee) {
      n(Ee.pid);
      Ee = null;
    }
  },
  showLogInConsole: S,
  getCocosSpawnProcess: B,
  getCocosRoot: W,
};
