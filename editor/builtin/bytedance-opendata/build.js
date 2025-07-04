const e = Editor.require("app://editor/share/adapters-build-utils");
const t = require("fire-path");
const i = require("fire-fs");
const n = require("globby");
const r = "project://bytedance-opendata.json";
const o = Editor.require("app://editor/share/3d-physics-build-utils");
const a = {
  "game.js": function (e, i) {
    e.path = t.join(t.dirname(e.path), "index.js");
    let n = e.contents.toString();
    let r = i.debug ? "require('cocos2d-js.js')" : "require('cocos2d-js-min.js')";
    n = n.replace("require('cocos2d-js-path')", r);
    let a = i.debug ? "require('adapter.js')" : "require('adapter-min.js')";
    n = n.replace("require('adapter-js-path')", a);
    n = o.updateMinigameRequire(i, n);
    e.contents = new Buffer(n);
  },
};

module.exports = {
  name: Editor.T("bytedance-opendata.platform_name"),
  platform: "bytedance-subcontext",
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
    let n = i.indexOf("Canvas Renderer");

    if (-1 !== n) {
      i.splice(n, 1);
    }
  },
  messages: {
    "script-build-finished": async function (t, i) {
      let n = null;
      try {
        (function () {
          if (!Editor.Profile.load(r)) {
            throw new Error("config file not found");
          }
        })();

        i.settings.subContextRoot = i.projectName;
        await e.buildAdapter(i, null);

        await e.copyRes(
          i,
          ["./game.json", "./project.config.json", "./cocos/*"],
          a
        );
      } catch (e) {
        n = e;
      }
      t.reply(n);
    },
    "build-finished": function (e, o) {
      let a = null;
      try {
        (function (e) {
          let r = n.sync(t.join(e.dest, "assets/**"), { nodir: true });
          for (let e = 0; e < r.length; ++e) {
            let n = r[e];
            if (".json" !== t.extname(n)) {
              continue;
            }
            let o = i.readFileSync(n, "utf8");

            (o = `module.exports = ${o};`).replace(
              /"([A-Za-z_$][0-9A-Za-z_$]*)":/gm,
              "$1:"
            );

            i.writeFileSync(n, o, "utf8");
            i.renameSync(n, n.replace(/(\.json)$/, ".js"));
          }
        })(o);

        (function (e) {
          let r = t.join(e.dest, "ccRequire.js");
          let o = i.readFileSync(r, "utf8");
          let a = "";

          e.bundles.forEach((i) => {
            let r = n.sync(t.join(i.dest, "config.*"))[0];
            r = (r = t.relative(e.dest, r)).replace(/\\/g, "/");
            a += `'${r}' () { return require('${r}'); },\n`;
            let o = t.join(e.dest, `assets/${i.name}/import/`);
            let s = n.sync(t.join(o, "**/*.js"));
            s.forEach((i) => {
              i = (i = t.relative(e.dest, i)).replace(/\\/g, "/");
              a += `'${i}' () { return require('${i}'); },\n`;
            });
          });

          a += "// tail\n";
          o = o.replace("// tail", a);
          i.writeFileSync(r, o);
        })(o);

        (function (e) {
          let t = { orientation: Editor.Profile.load(r).get("orientation") };
          Editor.Ipc.sendToMain("builder:notify-build-result", e, t);
        })(o);
      } catch (e) {
        a = e;
      }
      e.reply(a);
    },
  },
  settings: Editor.url("packages://bytedance-opendata/build-ui.js"),
};
