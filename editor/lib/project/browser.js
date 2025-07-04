"use strict";
const t = require("fire-fs");
const i = require("fire-path");
const { tmpdir: r } = require("os");
const { join: e, resolve: o } = require("path");
const { promisify: a } = require("util");
const s = require("../../../share/project");

module.exports = new (class {
  constructor() {
    this.path = "";
    this.name = "";
    this.id = "";

    if (Editor.argv._command) {
      this.path = e(r(), "fireball-tmp-project");
    } else {
      if (Editor.argv._.length > 0) {
        this.path = o(Editor.argv._[0]);
      } else {
        if (Editor.argv.path) {
          this.path = o(Editor.argv.path);
        }
      }
    }
  }
  async check() {
    if (!t.existsSync(this.path)) {
      Editor.log("Create project %s", this.path);
      await a(s.create(this.path, null));
    }

    Editor.log("Check project %s", this.path);
    let i = await a(s.check)(this.path);
    this.name = i.name;
    this.id = i.id;
    return i;
  }
  async init() {
    Editor.log("Initializing project %s", this.path);
    t.ensureDirSync(i.join(this.path, "settings"));
    Editor.Profile.register("project", i.join(this.path, "settings"));
    Editor.Profile.inherit("project", "global");
    t.ensureDirSync(i.join(this.path, "local"));
    Editor.Profile.register("local", i.join(this.path, "local"));
    Editor.Profile.inherit("local", "project");

    Editor.Package.addPath([
      i.join(Editor.App.home, "packages"),
      i.join(Editor.App.path, "editor", "builtin"),
      i.join(Editor.App.path, Editor.dev ? "" : "..", "builtin"),
      i.join(this.path, "packages"),
    ]);

    const r = require("../../../share/default-profiles/default-locals");
    Editor.Profile.load("default://local.json", r);

    Editor._projectLocalProfile = Editor.Profile.load(
        "local://local.json",
        r
      );

    const e = require("../../../share/default-profiles/default-projects");
    Editor.Profile.load("default://project.json", e);

    Editor._projectProfile = Editor.Profile.load(
        "project://project.json",
        e
      );
  }
})();
