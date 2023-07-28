"use strict";
const e = require("fire-fs");
const o = require("semver");
const t = require("electron");
var r = 0;

module.exports = {
  load() {},
  unload() {},
  messages: {
    open(e, o) {
      if (o && void 0 !== o.tab) {
        r = o.tab;
      }

      Editor.Panel.open("project-settings");
    },
    close(e) {
      Editor.Panel.close("project-settings");
    },
    "save-simulator-config"(o, t, r) {
      if (!r) {
        return;
      }
      let s = Editor.url(t) + ".json";

      if (e.existsSync(s)) {
        e.writeJsonSync(s, r, "utf8");
      }
    },
    "query-tab"(e) {
      e.reply(null, r);
    },
    "update-tab"(e, o) {
      r = o;
    },
  },
};

t.ipcMain.on("migrate-project", function (t, r) {
  if (!r) {
    r = (function () {
      const t = require("path");
      const r = require("globby");
      let s;
      let n = t.join(Editor.Project.path, "assets");
      try {
        let o = r.sync(`${n}/**/*.@(png|jpg).meta`, {
          nodir: true,
          caseSensitiveMatch: false,
          absolute: true,
        });
        if (!(o.length > 0)) {
          console.warn(
            "can not guess last project version, no texture meta found"
          );

          return;
        }
        s = e.readJsonSync(o[0]);
      } catch (e) {
        console.error(e);
        return;
      }
      return s && s.ver
        ? o.satisfies(s.ver, "< 2.3.0", { includePrerelease: true })
          ? (console.log(
              "last project version must < 2.1.0 since texture meta version < 2.3.0"
            ),
            "2.0.10")
          : (console.log(
              "last project version must >= 2.1.0 since texture meta version >= 2.3.0"
            ),
            void 0)
        : (console.error(
            "can not guess last project version, texture meta version is invalid"
          ),
          void 0);
    })();
  }

  if (
    (r)
  ) {
    console.log("migrating module config from " + r);
    try {
      let t = Editor.Profile.load("project://project.json");
      let s = t.get("excluded-modules");
      let n = e.readJsonSync(Editor.url("unpack://engine/modules.json"));
      let i = false;

      n.forEach((e) => {
        if (!s.includes(e.name) &&
          e.since &&
          o.satisfies(r, "< " + e.since, { includePrerelease: true })) {
          s.push(e.name);

          console.log(
            `exclude module ${e.name} because it was added since ${e.since}`
          );

          i = true;
        }
      });

      if (i) {
        t.set("excluded-modules", s);
        t.save();
      }
    } catch (e) {
      console.error(e);
    }
  }
});
