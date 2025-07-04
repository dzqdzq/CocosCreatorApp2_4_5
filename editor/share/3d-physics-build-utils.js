const e = require("browserify");
const i = require("babelify");
const s = require("vinyl-source-stream");
const r = require("vinyl-buffer");
const n = require("path");
const t = require("gulp");
const u = require("./build-platforms");

const l = {
  "3D Physics/Builtin": "physics_builtin",
  "3D Physics/cannon.js": "physics_cannon",
};

const o = {};

const c = [
  [require("@babel/preset-env"), { loose: true }],
  {
    plugins: [
      [require("@babel/plugin-proposal-decorators"), { legacy: true }],
      [require("@babel/plugin-proposal-class-properties"), { loose: true }],
    ],
  },
  [require("@babel/preset-typescript"), { allowDeclareFields: true }],
];

const p = [
  [require("babel-plugin-const-enum"), { transform: "constObject" }],
  [require("babel-plugin-add-module-exports")],
];

o.getPhysicsModule = function (e, i) {
  let s = Object.keys(l);
  return 0 === (s = s.filter((i) => !e.includes(i))).length
    ? null
    : s.length > 1
    ? (i && i(), "3D Physics/cannon.js")
    : s[0];
};

o.getPhysicsEntries = function (e) {
  let i = Editor.require("unpack://engine/modules.json");
  let s = Editor.url("unpack://engine");
  let r = i.find((e) => "3D Physics Framework" === e.name);
  if (!r) {
    throw new Error("can't find physics framework module");
  }
  let t = r.entries;
  let u = i.find((i) => i.name === e);
  if (!u) {
    throw new Error(`can't find physics moduel '${e}'`);
  }
  return (t = (t = t.concat(u.entries)).map((e) => n.join(s, e)));
};

o.getPhysicsBuildFlags = function (e) {
  let i = {};

  Object.keys(l).forEach((e) => {
    i[l[e]] = false;
  });

  if (e) {
    i[l[e]] = true;
  }

  return i;
};

o.build = function ({ dest: l, excludedModules: o, debug: a, platform: d }) {
    return new Promise((h, g) => {
      let y = this.getPhysicsModule(o, () => {
        Editor.warn(Editor.T("BUILDER.physics_module_undefined"));
      });
      if (!y) {
        return h();
      }
      Editor.log("Building 3D physics modules...");
      let b = this.getPhysicsEntries(y);
      let m = this.getPhysicsBuildFlags(y);
      let f = u[d].isNative;
      let q = "runtime" === d;
      let j = { jsb: f && !q, runtime: q, minigame: "mini-game" === d, debug: a };

      if (m) {
        Object.assign(j, m);
      }

      let E = new e({ extensions: [".js", ".ts"], entries: b });
      const P = Editor.require("unpack://engine/gulp/util/utils");
      const w = Editor.require("unpack://engine/gulp/util/handleErrors.js");
      let k = E.transform(i, {
        extensions: [".js", ".ts"],
        presets: c,
        plugins: p,
      })
        .bundle()
        .on("error", w.handler)
        .pipe(w())
        .pipe(s(f ? "physics.js" : a ? "physics.js" : "physics-min.js"))
        .pipe(r())
        .pipe(P.uglify("build", j))
        .pipe(t.dest(f ? n.join(l, "src") : l));
      k.once("error", g);
      k.on("end", h);
    });
  };

o.updateMinigameRequire = function ({ debug: e, excludedModules: i }, s, r) {
    if (this.getPhysicsModule(i)) {
      let i =
        r || (e ? "require('physics.js');" : "require('physics-min.js');");
      s = s.replace("require('physics-js-path');", i);
    } else {
      s = s.replace("require('physics-js-path');", "");
    }
    return s;
  };

module.exports = o;
