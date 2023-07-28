"use strict";
const r = require("fire-path");
const e = require("fire-fs");
const i = require("xml2js");
const t = require("./base");

module.exports = class extends t {
  addDependence(i, t) {
    let n = true;

    let s = r.join(
      this.options.dest,
      "frameworks/runtime-src/proj.android-studio/app/build.gradle"
    );

    if (e.existsSync(s)) {
      let r = e.readFileSync(s, "utf-8");

      r = r.replace(/dependencies\s*\{[^\}]+}/, (r) => {
        if (-1 != r.indexOf(i)) {
          return r;
        }
        let e = r.substr(0, r.length - 1);
        return (e += `    implementation '${i}:${t}'\n}`);
      });

      e.writeFileSync(s, r);
    } else {
      n = false;
      Editor.error("cant find build.gradle at ", s);
    }
    return n;
  }
  removeDependence(i, t) {
    let n = r.join(
      this.options.dest,
      "frameworks/runtime-src/proj.android-studio/app/build.gradle"
    );
    if (!e.existsSync(n)) {
      Editor.error("Can not find build.gradle file at ", n);
      return;
    }
    try {
      let r = e.readFileSync(n, "utf8");

      r = r.replace(
        new RegExp("\\s+implementation\\s+" + `'${i}:${t}'`, "g"),
        ""
      );

      e.writeFileSync(n, r, "utf8");
    } catch (r) {
      Editor.error(r);
    }
  }
  addLib(e) {
    this.ensureFile(
      e,
      r.join(
        this.options.dest,
        "frameworks/runtime-src/proj.android-studio/app/libs",
        r.basename(e)
      )
    );
  }
  async addManifestApplicationConfig(t, n) {
    let s = r.join(
        this.options.dest,
        "frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml"
      );

    let d = await this.readXML(s);
    let o = d.manifest.application[t];
    if (o) {
      if (-1 != JSON.stringify(o).indexOf(n.$["android:name"])) {
        return Promise.resolve();
      }

      if (Array.isArray(o)) {
        o.push(n);
      } else {
        d.manifest.application[t] = [o, n];
      }
    } else {
      d.manifest.application[t] = n;
    }
    let a = new i.Builder();
    e.writeFileSync(
      r.join(
        this.options.dest,
        "frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml"
      ),
      a.buildObject(d)
    );
  }
  async addStringToStringXML(e) {
    return await this.addStringToXML(
      e,
      r.join(
        this.options.dest,
        "frameworks/runtime-src/proj.android-studio/res/values/strings.xml"
      )
    );
  }
  async addStringToXML(r, t) {
    let n = await this.readXML(t);
    do {
      let e = n.resources;
      if (!e) {
        break;
      }
      let i = e.string;
      if (!i) {
        break;
      }

      if (!Array.isArray(i)) {
        i = [i];
        n.resources.string = i;
      }

      let t = i.find((e) => e.$.name === r.$.name);

      if (!t) {
        i.push(r);
      }

      if (t && t._ !== r._) {
        t._ = r._;
      }
    } while (0);
    e.writeFileSync(t, new i.Builder().buildObject(n));
  }
  async addUserPermission(t) {
    let n = r.join(
      this.options.dest,
      "frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml"
    );
    if (!e.existsSync(n)) {
      Editor.error("AndroidManifest.xml not found");
      return;
    }
    let s = await this.readXML(n);
    let d = s.manifest["uses-permission"];

    if (!d.find((r) => r.$["android:name"] === t)) {
      d.push({ $: { "android:name": t } });
      e.writeFileSync(n, new i.Builder().buildObject(s));
    }
  }
  async removeUserPermission(t) {
    let n = r.join(
      this.options.dest,
      "frameworks/runtime-src/proj.android-studio/app/AndroidManifest.xml"
    );
    if (!e.existsSync(n)) {
      Editor.error("AndroidManifest.xml not found at path", n);
      return;
    }
    let s = await this.readXML(n);
    let d = s.manifest["uses-permission"];
    if (!d.find((r) => r.$["android:name"] === t)) {
      return;
    }
    let o = d.findIndex((r) => r.$["android:name"] === t);

    if (-1 !== o) {
      d.splice(o, 1);
      e.writeFileSync(n, new i.Builder().buildObject(s));
    }
  }
  addProguard(i, t) {
    t = t ? (t.startsWith("#") ? t : "#" + t) : "#";
    let n = r.join(
      this.options.dest,
      "frameworks/runtime-src/proj.android-studio/app/proguard-rules.pro"
    );
    i = Array.isArray(i) ? i : [i];
    if (!e.existsSync(n)) {
      Editor.error("Can not find build.gradle proguard-rules.pro ", n);
      return;
    }
    let s = e.readFileSync(n, "utf8");
    let d = false;
    s += `\n${t}\n`;

    i.forEach((r) => {
      if (!s.includes(r)) {
        d = true;
        s += r + "\n";
      }
    });

    if (d) {
      e.writeFileSync(n, s, "utf8");
    }
  }
  removeProguard(i, t) {
    t = t ? (t.startsWith("#") ? t : "#" + t) : "#";
    let n = r.join(
      this.options.dest,
      "frameworks/runtime-src/proj.android-studio/app/proguard-rules.pro"
    );
    i = Array.isArray(i) ? i : [i];
    if (!e.existsSync(n)) {
      Editor.error("cannot fin build.gradle proguard-rules.pro ", n);
      return;
    }
    let s = e.readFileSync(n, "utf8");
    let d = 0;

    if (s.includes(t)) {
      s = s.replace(`\n${t}\n`, "");
    }

    i.forEach((r) => {
      if (s.includes(r)) {
        d++;
        s = s.replace(`${r}\n`, "");
      }
    });

    if (d > 0) {
      e.writeFileSync(n, s, "utf8");
    }
  }
  readXML(r) {
    return new Promise((t, n) => {
      let s = e.readFileSync(r, "utf-8");
      if (!s) {
        n("File not found at path ", r);
        return;
      }
      let d = new i.Parser();
      d.options.explicitArray = false;

      d.parseString(s, (r, e) => {
        t(e);
      });
    });
  }
};
