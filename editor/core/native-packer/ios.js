"use strict";
const e = require("fire-path");
const t = require("fire-fs");
const r = require("xcode");
const { spawn: o, spawnSync: i } = require("child_process");
const s = require("./base");

module.exports = class extends s {
  constructor(o) {
    super(o);

    if (-1 === process.env.PATH.indexOf("/usr/local/bin")) {
      process.env.PATH += ":/usr/local/bin";
    }

    process.env.LANG = "en_US.UTF-8";
    let http_proxy = Editor.Profile.load("global://settings.json").get("http-proxy");

    if (Editor.isDarwin &&
        http_proxy) {
      process.env = Object.assign(process.env, {
            http_proxy: http_proxy,
            https_proxy: http_proxy,
          });
    }

    this.projectPath = e.join(
        o.dest,
        `frameworks/runtime-src/proj.ios_mac/${o.projectName}.xcodeproj/project.pbxproj`
      );

    if (!t.existsSync(this.projectPath)) {
      Editor.error("Can't find xcodeproj file at path: ", this.projectPath);
      return;
    }
    this.project = r.project(this.projectPath);
    this.project.parseSync();
  }
  addFramework(e, t) {
    let r = true;

    if (this._searchTarget(t)) {
      this.project.addFramework(e, {
            customFramework: true,
            target: this._searchTarget(t),
            embed: true,
          });

      this._save();
    } else {
      r = false;
    }

    return r;
  }
  addFileToCompileSource(e, t, r) {
    let o = true;
    let i = this._searchTarget(t);
    let s = this._searchPBXGroup(r);

    if (i && s) {
      this.project.addSourceFile(e, { target: i }, s);
      this._save();
    } else {
      o = false;
    }

    return o;
  }
  addFileToProject(e, t) {
    let r = true;
    let o = this._searchPBXGroup(t);

    if (o) {
      this.project.addFile(e, o);
    } else {
      r = false;
    }

    this._save();
    return r;
  }
  checkPodEnvironment() {
    return (!i("pod").error || (Editor.error(
      "Can't find pod command , please install CocoaPods (https://cocoapods.org/)"
    ), false));
  }
  addPodDependenceForTarget(r, o, i) {
    this._createPodFileIfNotExist();

    let s = e.join(
        this.options.dest,
        "frameworks/runtime-src/proj.ios_mac/Podfile"
      );

    let n = t.readFileSync(s, "utf-8");

    if (-1 === n.indexOf(o)) {
      n += `target '${o}' do\nend`;
    }

    if (this.isDependenceExist(r, o, i)) {
      Editor.log("CocoaPods:", r, "is already exist,ignore update Podfile");
    } else {
      let e = new RegExp(`target\\s*'${o}'\\s*do`);
      n = n.replace(e, (e) => {
        let t = `  pod '${r}'`;

        if (i) {
          t += `,${i}`;
        }

        return (e += "\n" + t);
      });
    }
    t.writeFileSync(s, n);
  }
  isDependenceExist(r, o, i) {
    let s = false;
    do {
      let i = e.join(
        this.options.dest,
        "frameworks/runtime-src/proj.ios_mac/Podfile"
      );
      if (!t.existsSync(i)) {
        break;
      }
      let n = t
        .readFileSync(i, "utf-8")
        .match(
          new RegExp(`target\\s*'${o}'\\s*do(\\S|\\s|\\n|\\r|\\r\\n)+?(end)`)
        );
      if (!n) {
        break;
      }

      if (-1 !== (n = n[0]).indexOf(r)) {
        s = true;
      }
    } while (0);
    return s;
  }
  executePodFile() {
    return new Promise((t, r) => {
      let i = o("pod", ["install"], {
        cwd: e.join(this.options.dest, "frameworks/runtime-src/proj.ios_mac/"),
      });

      i.stdout.on("data", (e) => {
        Editor.log("CocoaPods:" + e.toString());
      });

      i.stderr.on("data", (e) => {
        Editor.log("CocoaPods:" + e.toString());
      });

      i.on("error", (e) => {
        r(e.toString() || "exec pod install fail");
      });

      i.on("close", (e) => {
        if (0 !== e) {
          r("exec pod install fail with exit code", e);
          return;
        }
        t();
      });
    });
  }
  _createPodFileIfNotExist() {
    let r = e.join(
      this.options.dest,
      "frameworks/runtime-src/proj.ios_mac/Podfile"
    );

    if (!t.existsSync(r)) {
      this.ensureFile(
        Editor.url(
          "unpack://editor/core/native-packer/libs/ios/cocoapods/Podfile"
        ),
        r
      );
    }
  }
  _searchPBXGroup(e) {
    if (!this.project) {
      return;
    }
    let t = this.project.getPBXObject("PBXGroup");
    let r = null;
    for (let o in t) {
      let i = t[o];
      if ("string" == typeof i && i === e) {
        r = o.split("_")[0];
        break;
      }
    }
    return r;
  }
  _searchTarget(e) {
    let t = this.project.pbxNativeTargetSection();
    let r = null;
    for (let o in t) {
      let i = t[o];
      if ("string" == typeof i && i === e) {
        r = o.split("_")[0];
        break;
      }
    }
    return r;
  }
  _save() {
    t.writeFileSync(this.projectPath, this.project.writeSync());
  }
};
