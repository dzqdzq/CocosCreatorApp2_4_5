const e = Editor.require("app://editor/share/adapters-build-utils");
const t = require("fire-path");
const i = require("fire-fs");
const r = require("globby");
const n = (require("del"), "project://baidugame-opendata.json");
const a = Editor.require("app://editor/share/3d-physics-build-utils");
const o = {
  "game.js": function (e, i) {
    e.path = t.join(t.dirname(e.path), "index.js");
    let r = e.contents.toString();
    let n = i.debug ? "require('cocos2d-js.js')" : "require('cocos2d-js-min.js')";
    r = r.replace("require('cocos2d-js-path')", n);
    let o = i.debug ? "require('adapter.js')" : "require('adapter-min.js')";
    r = r.replace("require('adapter-js-path')", o);
    r = a.updateMinigameRequire(i, r);
    e.contents = new Buffer(r);
  },
};

module.exports = {
  name: Editor.T("baidugame-opendata.platform_name"),
  platform: "baidugame-subcontext",
  extends: "mini-game",
  buttons: [Editor.Builder.DefaultButtons.Build],
  buildConfig: { pack: false },
  compileFlags: function (e) {
    return { support_jit: false, minigame: true };
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  buildStart: function (e) {
    e.dest = t.join(t.dirname(e.dest), e.projectName);
    let i = e.excludedModules;
    let r = i.indexOf("Canvas Renderer");

    if (-1 !== r) {
      i.splice(r, 1);
    }
  },
  messages: {
    "script-build-finished": async function (t, i) {
      let r = null;
      try {
        (function () {
          if (!Editor.Profile.load(n)) {
            throw new Error("config file not found");
          }
        })();

        i.settings.subContextRoot = i.projectName;
        await e.buildAdapter(i, null);
        await e.copyRes(i, ["./game.json", "./project.swan.json"], o);
      } catch (e) {
        r = e;
      }
      t.reply(r);
    },
    "build-finished": function (e, a) {
      let o = null;
      try {
        (function (e) {
          let n = r.sync(t.join(e.dest, "assets/**"), { nodir: true });
          for (let e = 0; e < n.length; ++e) {
            let r = n[e];
            if (".json" !== t.extname(r)) {
              continue;
            }
            let a = i.readFileSync(r, "utf8");

            (a = `module.exports = ${a};`).replace(
              /"([A-Za-z_$][0-9A-Za-z_$]*)":/gm,
              "$1:"
            );

            i.writeFileSync(r, a, "utf8");
            i.renameSync(r, r.replace(/(\.json)$/, ".js"));
          }
        })(a);

        (function (e) {
          let n = t.join(e.dest, "ccRequire.js");
          let a = i.readFileSync(n, "utf8");
          let o = "";

          e.bundles.forEach((i) => {
            let n = r.sync(t.join(i.dest, "config.*"))[0];
            n = (n = t.relative(e.dest, n)).replace(/\\/g, "/");
            o += `'${n}' () { return require('${n}'); },\n`;
            let a = t.join(e.dest, `assets/${i.name}/import/`);
            let s = r.sync(t.join(a, "**/*.js"));
            s.forEach((i) => {
              i = (i = t.relative(e.dest, i)).replace(/\\/g, "/");
              o += `'${i}' () { return require('${i}'); },\n`;
            });
          });

          o += "// tail\n";
          a = a.replace("// tail", o);
          i.writeFileSync(n, a);
        })(a);

        let e = { orientation: Editor.Profile.load(n).get("orientation") };
        Editor.Ipc.sendToMain("builder:notify-build-result", a, e);
      } catch (e) {
        o = e;
      }
      e.reply(o);
    },
  },
  settings: Editor.url("packages://baidugame-opendata/build-ui.js"),
};
