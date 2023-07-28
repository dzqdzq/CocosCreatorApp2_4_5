"use strict";
const e = require("fire-path");
const r = require("fire-fs");
const o = require("lodash");
const n = require("semver");
const { shell: i } = require("electron");
const t = require("node-uuid");
const s = Editor.Profile.load("global://settings.json");
let c = {};
module.exports = c;

c.create = function (o, n, i) {
  let s = Editor.dev
    ? Editor.url("app://")
    : e.join(Editor.url("app://"), "..", "..");
  Editor.log("install path: " + s);
  if (e.contains(s, o)) {
    if (i) {
      i(new Error(Editor.T("DASHBOARD.error_project_in_install")));
    }

    return;
  }
  if (r.existsSync(o)) {
    if (i) {
      i(new Error("The path " + o + " already exists."));
    }

    return;
  }
  function c(n) {
    let i;
    try {
      let n = Editor.url("unpack://utils");
      let t = e.join(o, "jsconfig.json");
      let s = e.join(o, "tsconfig.json");
      let c = e.join(o, ".gitignore");
      r.copySync(e.join(n, "api/creator.d.ts"), e.join(o, "creator.d.ts"));

      if (!r.existsSync(t)) {
        r.copySync(e.join(n, "vscode-extension/jsconfig.json"), t);
      }

      if (!r.existsSync(s)) {
        r.copySync(e.join(n, "vscode-extension/tsconfig.json"), s);
      }

      if (!r.existsSync(c)) {
        r.copySync(Editor.url("unpack://static/git-workflow/gitignore"), c);
      }
    } catch (e) {
      i = e;
    }
    n(i);
  }
  let a = e.join(o, "project.json");
  if (n) {
    process.env.checkedVersion = true;

    r.copy(n, o, (e) => {
      if (e) {
        console.log(e);
      }

      try {
        let e = r.readFileSync(a, "utf8");
        (e = JSON.parse(e)).id = t.v4();
        e.isNew = true;
        r.writeFileSync(a, JSON.stringify(e, null, 2));
      } catch (e) {
        console.error(e);
      }
      c(i);
    });
  } else {
    r.mkdirsSync(o);
    r.mkdirSync(e.join(o, "settings"));
    r.mkdirSync(e.join(o, "local"));
    r.mkdirSync(e.join(o, "packages"));
    r.mkdirSync(e.join(o, "assets"));
    r.mkdirSync(e.join(o, "library"));
    let n = {
      engine: "cocos-creator-js",
      packages: "packages",
      version: Editor.versions.CocosCreator,
      id: t.v4(),
      isNew: true,
    };
    r.writeFileSync(a, JSON.stringify(n, null, 2));
    c(i);
  }
};

c.add = async function (e) {
  await s.reset();
  let r = s.get("recently-opened");
  let o = r.indexOf(e);

  if (-1 !== o) {
    r.splice(o, 1);
  }

  r.unshift(e);
  s.set("recently-opened", r);
  s.save();
};

c.delete = function (e) {
  c.remove(e);
  i.moveItemToTrash(e);
};

c.remove = async function (e) {
  await s.reset();
  let r = s.get("recently-opened");

  o.remove(r, function (r) {
    return r === e;
  });

  s.set("recently-opened", r);
  s.save();
};

c.check = function (o, i) {
    if (false === r.existsSync(o)) {
      if (i) {
        i(new Error("Project not exists!"));
      }

      return;
    }
    let t = Editor.dev
      ? Editor.url("app://")
      : e.join(Editor.url("app://"), "..", "..");
    if (e.contains(t, o)) {
      if (i) {
        i(new Error(Editor.T("DASHBOARD.error_project_in_install_open")));
      }

      return;
    }
    c.getInfo(o, function (t) {
      if (!t) {
        if (i) {
          i(new Error("Can not find project.json"));
        }

        return;
      }
      if (t.error) {
        if (i) {
          i(new Error(t.error));
        }

        return;
      }
      let s = t.project;
      if (
        s &&
        (!process.env.checkedVersion ||
          "false" === process.env.checkedVersion) &&
        !Editor.argv.force
      ) {
        let e = s.version;
        let r = !e;

        let c = r ||
        n.satisfies(e, "<" + Editor.versions.CocosCreator, {
          includePrerelease: true,
        });

        let a = e &&
        n.satisfies(e, ">" + Editor.versions.CocosCreator, {
          includePrerelease: true,
        });

        if (c || a) {
          let n = "MESSAGE.check_project_version.degrade";

          if (c) {
            n = r
                  ? "MESSAGE.check_project_version.upgrade_before_v2_1_2"
                  : "MESSAGE.check_project_version.upgrade";
          }

          if (1 ===
            Editor.Dialog.messageBox({
              type: "question",
              buttons: [Editor.T("MESSAGE.confirm"), Editor.T("SHARED.exit")],
              message: Editor.T(n, {
                projectVer: e,
                editorVer: Editor.versions.CocosCreator,
                projectPath: o,
              }),
              defaultId: 1,
              cancelId: 1,
              noLink: true,
            })) {
            t.abort = true;

            if (i) {
              i(null, t);
            }

            return;
          }
        }
      }
      process.env.checkedVersion = true;
      let c = e.join(o, "settings");

      if (!r.existsSync(c)) {
        r.mkdirSync(c);
      }

      c = e.join(o, "local");

      if (!r.existsSync(c)) {
        r.mkdirSync(c);
      }

      c = e.join(o, "packages");

      if (!r.existsSync(c)) {
        r.mkdirSync(c);
      }

      c = e.join(o, "assets");

      if (!r.existsSync(c)) {
        r.mkdirSync(c);
      }

      c = e.join(o, "library");

      if (!r.existsSync(c)) {
        r.mkdirSync(c);
      }

      if (i) {
        i(null, t);
      }
    });
  };

c.getInfo = function (o, n) {
  let i;
  let t = e.join(o, "project.json");
  if (false === r.existsSync(t)) {
    if (n) {
      n();
    }

    return;
  }
  try {
    i = JSON.parse(r.readFileSync(t, "utf8"));
  } catch (r) {
    if (n) {
      n({
        path: o,
        name: e.basename(o),
        engine: "unknown",
        project: i,
        error: "project.json broken: " + r.message,
        abort: false,
      });
    }

    return;
  }

  if (n) {
    n({
      id: i.id || "",
      path: o,
      name: e.basename(o),
      project: i,
      abort: false,
    });
  }
};
