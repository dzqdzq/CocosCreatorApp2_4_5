"use strict";
const e = require("fire-fs");
const t = require("fire-path");
const r = require("electron");
const a = require("node-uuid");
const i = Editor.require("app://editor/share/build-platforms");
const o = require(Editor.url("packages://builder/utils/event"));
const s = require(Editor.url("packages://builder/utils/module-events"));
const l = require(Editor.url("app://editor/share/build-utils"));
const n = require(Editor.url("packages://builder/utils/network"));
const d = require(Editor.url("packages://builder/panel/platform/android"));
const u = require(Editor.url("packages://builder/panel/platform/web-desktop"));
const c = require(Editor.url("packages://builder/panel/platform/web-mobile"));
const p = require(Editor.url("packages://builder/panel/platform/fb-instant-games"));
const m = require(Editor.url("packages://builder/panel/platform/android-instant"));
const h = require(Editor.url("packages://builder/panel/platform/windows"));
const f = require(Editor.url("packages://builder/panel/platform/ios"));
const g = require(Editor.url("packages://builder/panel/platform/mac"));
const E = require("electron").remote.dialog;
const { promisify: b } = require("util");
const v = Editor.remote.Profile.load("global://settings.json");
const P = Editor.remote.Profile.load("global://features.json");
const _ = Editor.require("app://editor/share/bundle-utils");
const k = { local: null, project: null, anysdk: null };
let T = P.get("xiaomi-runtime") || false;
let y = P.get("alipay-minigame") || false;
let j = P.get("qtt-runtime") || false;
let B = P.get("huawei-agc") || false;
let D = P.get("link-sure") || false;
let S = P.get("bytedance-minigame") || false;

let w = [
  "web-mobile",
  "web-desktop",
  "fb-instant-games",
  "android",
  B ? "huawei-agc" : "HIDDEN",
  "android-instant",
  "ios",
  y ? "alipay" : "HIDDEN",
  j ? "qtt-game" : "HIDDEN",
  S ? "bytedance" : "HIDDEN",
  S ? "bytedance-subcontext" : "HIDDEN",
  "jkw-game",
  "huawei",
  "quickgame",
  "qgame",
  T ? "xiaomi" : "HIDDEN",
  D ? "link-sure" : "HIDDEN",
  "baidugame",
  "baidugame-subcontext",
  "wechatgame",
  "wechatgame-subcontext",
  "cocos-runtime",
  "qqplay",
  "mac",
  "win32",
];

const x = `https://creator-api.cocos.com/api/account/get_agreements?lang=${Editor.lang}`;
Editor.Panel.extend({
  style: e.readFileSync(Editor.url("packages://builder/panel/builder.css")),
  template: e.readFileSync(Editor.url("packages://builder/panel/builder.html")),
  messages: {
    "builder:state-changed": function (e, t, r) {
      if (this._vm) {
        this._vm.setSystemBarProgress(
            "error" === t || "finish" === t ? -1 : r
          );

        r *= 100;
        if ("error" === t) {
          this._vm.buildProgress = r;
          this._vm.buildState = "failed";
          this._vm.task = "";
          return;
        }
        if ("finish" === t) {
          this._vm.buildProgress = 100;
          this._vm.buildState = "completed";
          this._vm.task = "";
          return;
        }
        this._vm.buildProgress = r;
        this._vm.buildState = t;
      }
    },
    "builder:events": function (e, t, ...r) {
      o.emit(t, ...r);
    },
    "keystore:created": function (e, t) {
      this._vm.local.keystorePath = t.path;
      this._vm.local.keystorePassword = t.password;
      this._vm.local.keystoreAlias = t.alias;
      this._vm.local.keystoreAliasPassword = t.aliasPassword;
    },
    "asset-db:assets-deleted": async function (e, t) {
      if (!!t.find((e) => "scene" === e.type)) {
        (await this.updateSceneData());
      }
    },
    "asset-db:assets-moved": async function (e, t) {
      if (!!t.find((e) => "scene" === e.type)) {
        (await this.updateSceneData());
      }
    },
    "asset-db:assets-created": async function (e, t) {
      if (!!t.find((e) => "scene" === e.type)) {
        (await this.updateSceneData());
      }
    },
    "inspector:bundle-updated": async function (e, t) {
      await this.updateSceneData();
    },
  },
  async ready() {
    let o = this.profiles.local;
    let b = this.profiles.project;

    if (!o.get("actualPlatform")) {
      o.set("actualPlatform", o.get("platform"));
    }

    (function (e) {
      let t = e.get("platform");
      let r = Object.keys(i);
      let a = r.includes(t);
      if (a) {
        return;
      }
      let o = Editor.remote.Builder.simpleBuildTargets[t];
      t = (o && o.extends) || t;

      if (!(a = r.includes(t))) {
        t = "web-mobile";
        e.set("actualPlatform", "web-mobile");
      }

      e.set("platform", t);
    })(o);

    (function (e) {
      let t = e.get("packageName");
      if (!t) {
        return;
      }
      const r = ["android", "android-instant", "ios", "mac"];
      for (let a of r) {
        let r = e.get(a);

        if (r && !r.packageName) {
          r.packageName = t;
          e.set(a, r);
        }
      }
    })(b);

    let P = {};
    let _ = [c, d, m, u, p, h, f, g];
    let T = Editor.remote.Builder.simpleBuildTargets;
    for (let e in T) {
      let t = T[e];
      if (t.settings) {
        let e = require(t.settings);

        if (!e.name) {
          e.name = t.platform;
        }

        _.push(e);
      } else {
        Editor.warn("Can not load package", t.name);
      }
    }
    _.forEach((e) => {
      if (!e.props) {
        e.props = {};
      }

      for (let t in k) if (!e.props[t]) {
        e.props[t] = k[t];
      }
      P[e.name] = e;
    });
    let y = {
      platforms: (function (e) {
        let t = [];

        t.push({
          value: "web-mobile",
          text: Editor.T("BUILDER.platforms.web-mobile"),
        });

        t.push({
          value: "web-desktop",
          text: Editor.T("BUILDER.platforms.web-desktop"),
        });

        t.push({
          value: "fb-instant-games",
          text: Editor.T("BUILDER.platforms.fb-instant-games"),
        });

        t.push({
          value: "android",
          text: Editor.T("BUILDER.platforms.android"),
        });

        t.push({
          value: "android-instant",
          text: Editor.T("BUILDER.platforms.android-instant"),
        });

        if ("darwin" === process.platform) {
          t.push({ value: "ios", text: Editor.T("BUILDER.platforms.ios") });
          t.push({ value: "mac", text: Editor.T("BUILDER.platforms.mac") });
        }

        if ("win32" === process.platform) {
          t.push({
            value: "win32",
            text: Editor.T("BUILDER.platforms.win32"),
          });
        }

        let r = Editor.remote.Builder.simpleBuildTargets;
        let a = [];
        for (let e in r) {
          let t = r[e];

          if (t.settings) {
            a.push({ value: t.platform, text: t.name });
          }
        }
        t = t.concat(a);
        return w
          .map((e) => {
            if ("string" == typeof e) {
              return t.find((t) => t.value === e);
            }
            {
              let r = e[Editor.lang];
              return t.find(
                (e) =>
                  e.text.replace(/\s/g, "").toLowerCase() ===
                  r.replace(/\s/g, "").toLowerCase()
              );
            }
          })
          .filter(Boolean);
      })(),
      scenes: [],
      all: false,
      task: "",
      record: "",
      buildState: "idle",
      buildProgress: 0,
      anysdk: "zh" === Editor.lang,
      local: o.getSelfData(),
      project: b.getSelfData(),
      agreements: [],
      compressionTypes: [
        {
          value: "none",
          text: Editor.T("INSPECTOR.folder.none"),
          title: Editor.T("INSPECTOR.folder.none_tooltip"),
        },
        {
          value: "default",
          text: Editor.T("INSPECTOR.folder.default"),
          title: Editor.T("INSPECTOR.folder.default_tooltip"),
        },
        {
          value: "merge_all_json",
          text: Editor.T("INSPECTOR.folder.merge_all_json"),
          title: Editor.T("INSPECTOR.folder.merge_all_json_tooltip"),
        },
        {
          value: "subpackage",
          text: Editor.T("INSPECTOR.folder.subpackage"),
          title: Editor.T("INSPECTOR.folder.subpackage_tooltip"),
        },
        {
          value: "zip",
          text: Editor.T("INSPECTOR.folder.zip"),
          title: Editor.T("INSPECTOR.folder.zip_tooltip"),
        },
      ],
    };
    var j = (this._vm = new window.Vue({
      el: this.shadowRoot,
      data: y,
      computed: {
        scenesInList() {
          return this.scenes.filter((e) => !e.hidden);
        },
        actualPlatform: {
          get() {
            return this.local.actualPlatform;
          },
          set(e) {
            this.local.platform = this._actualPlatform2Platform(e);
            this.local.actualPlatform = e;

            if (!this.isCompressionTypeVisible(this.project.mainCompressionType)) {
              this.project.mainCompressionType = "default";
            }
          },
        },
        isNative() {
          return i[this.local.platform].isNative;
        },
        isRuntime() {
          return "runtime" === this.local.platform;
        },
        supportSubpackage() {
          return l.supportSubpackage(this.actualPlatform);
        },
        supportZip() {
          return l.supportZip(this.actualPlatform);
        },
        supportRemoteMain() {
          return (
            i[this.local.platform].supportRemoteMain &&
            l.supportRemote(this.actualPlatform)
          );
        },
        isRemoteBundleReadonly() {
          return (
            "zip" === this.project.mainCompressionType ||
            "subpackage" === this.project.mainCompressionType
          );
        },
        needPlayBtn() {
          var e = Editor.remote.Builder;
          var t = e.simpleBuildTargets[this.local.actualPlatform];
          return (
            !(!t || !t.buttons || "object" != typeof t.buttons[1]) ||
            !t ||
            !t.buttons ||
            t.buttons.includes(e.DefaultButtons.Play)
          );
        },
        needCompile() {
          var e = Editor.remote.Builder;
          var t = e.simpleBuildTargets[this.local.actualPlatform];
          return t && t.buttons
            ? t.buttons.includes(e.DefaultButtons.Compile)
            : i[this.local.platform].isNative;
        },
        needUpload() {
          var e = Editor.remote.Builder;
          var t = e.simpleBuildTargets[this.local.actualPlatform];
          return (
            !(!t || !t.buttons) && t.buttons.includes(e.DefaultButtons.Upload)
          );
        },
        supportCocosAnalytics: () =>
          "windows" !== o.platform && "mac" !== o.platform,
        argumentsLoaded() {
          return this.agreements.length > 0;
        },
        licenseAgreement: {
          get: function () {
            return (
              this.agreements.length > 0 &&
              !this.agreements.find(
                (e) =>
                  !this.project.agreements ||
                  !this.project.agreements[e.version]
              )
            );
          },
          set: function (e) {
            this.agreements.forEach((t) => {
              this.project.agreements[t.version] = e;
            });
          },
        },
      },
      watch: {
        local: {
          handler(e) {
            this.saveLocalData();
          },
          deep: true,
        },
        project: {
          handler(e) {
            this.saveProjectData();
          },
          deep: true,
        },
        licenseAgreement: {
          handler(e) {
            Editor.Ipc.sendToMain(
              "cocos-services:open-service",
              "analytics",
              e,
              (e, t) => {},
              -1
            );
          },
        },
        scenes: {
          handler(e) {
            var t = this.project.startScene;
            var r = false;
            for (let i = 0; i < e.length; i++) {
              let o = e[i];
              if (o.text.startsWith("db://assets/resources/") || t === o.value) {
                r = true;
              } else {
                var a = this.project.excludeScenes.indexOf(o.value);

                if (o.checked || -1 !== a) {
                  if (o.checked &&
                      -1 !== a) {
                    this.project.excludeScenes.splice(a, 1);
                  }
                } else {
                  this.project.excludeScenes.push(o.value);
                }
              }
            }

            if (e.length > 0 && !r) {
              this.project.startScene = e[0].value;
            }

            this.all = this.scenes.every(function (e) {
                return e.checked;
              });
          },
          deep: true,
        },
      },
      async created() {
        this.fetchAgreements();
      },
      components: P,
      methods: {
        async fetchAgreements() {
          try {
            let e = await n.getAsync(x);

            if (0 === (e = JSON.parse(e)).status) {
              j.$set("agreements", e.data);
            }
          } catch (e) {}
        },
        jumpClick(e) {
          r.shell.openExternal(e);
        },
        _mainCompressionTypeChanged() {
          if (this.supportRemoteMain) {
            if (this.isRemoteBundleReadonly) {
              if ("subpackage" === this.project.mainCompressionType) {
                this.project.mainIsRemote = false;
              } else {
                if ("zip" === this.project.mainCompressionType) {
                  this.project.mainIsRemote = true;
                }
              }
            }
          } else {
            this.project.mainIsRemote = false;
          }
        },
        isCompressionTypeVisible(e) {
          return "subpackage" === e
            ? this.supportSubpackage
            : "zip" !== e || this.supportZip;
        },
        setSystemBarProgress(e) {
          Editor.Ipc.sendToMain("builder:update-system-progress", e);
        },
        saveLocalData() {
          Object.keys(this.local).forEach((e) => {
            o.set(e, this.local[e]);
          });

          o.save();
        },
        saveProjectData() {
          Object.keys(this.project).forEach((e) => {
            b.set(e, this.project[e]);
          });

          b.save();
        },
        t: (e) => Editor.T(e),
        _actualPlatform2Platform(e) {
          let t = Editor.remote.Builder.simpleBuildTargets[e];
          return (t && t.extends) || e;
        },
        _onOpenCompileLogFile(e) {
          e.stopPropagation();
          Editor.Ipc.sendToMain("app:open-cocos-console-log");
        },
        _onChooseDistPathClick(e) {
          e.stopPropagation();
          let r = Editor.Dialog.openFile({
            defaultPath: l.getAbsoluteBuildPath(this.local.buildPath),
            properties: ["openDirectory"],
          });

          if (r &&
            r[0]) {
            if (t.contains(Editor.Project.path, r[0])) {
              this.local.buildPath = t
                      .relative(Editor.Project.path, r[0])
                      .replace(/\\/g, "/");

              if ("" === this.local.buildPath) {
                this.local.buildPath = "./";
              }
            } else {
              this.local.buildPath = r[0];
            }
          }
        },
        _onShowInFinderClick(t) {
          t.stopPropagation();
          let a = l.getAbsoluteBuildPath(this.local.buildPath);
          if (!e.existsSync(a)) {
            Editor.warn("%s not exists!", a);
            return;
          }
          r.shell.showItemInFolder(a);
          r.shell.beep();
        },
        _onSelectAllCheckedChanged(e) {
          if (!this.scenes) {
            return;
          }
          let t = this.project.startScene;
          for (let a = 0; a < this.scenes.length; a++) {
            let i = this.scenes[a];
            if (!i.text.startsWith("db://assets/resources/") && t !== i.value) {
              i.checked = e.detail.value;
              var r = this.project.excludeScenes.indexOf(i.value);

              if (i.checked || -1 !== r) {
                if (i.checked &&
                    -1 !== r) {
                  this.project.excludeScenes.splice(r, 1);
                }
              } else {
                this.project.excludeScenes.push(i.value);
              }
            }
          }
        },
        startTask(e, t) {
          this.task = e;
          let r = Editor.Profile.load("project://project.json");
          t.excludedModules = r.get("excluded-modules");
          Editor.Ipc.sendToMain("builder:start-task", e, t);
        },
        _onBuildClick(e) {
          e.stopPropagation();

          Editor.Ipc.sendToPanel(
            "scene",
            "scene:query-dirty-state",
            (e, t) => {
              if (t.dirty) {
                Editor.error(
                  t.name + " " + Editor.T("BUILDER.error.dirty_info")
                );

                return;
              }
              this._build();
            }
          );
        },
        async _build() {
          this.saveLocalData();
          var r = l.getAbsoluteBuildPath(this.local.buildPath);
          var a = t.win32.dirname(r);
          var n = this.local.platform;
          let d = i[n].isNative;
          if (!e.existsSync(a)) {
            E.showErrorBox(
              Editor.T("BUILDER.error.build_error"),
              Editor.T("BUILDER.error.build_dir_not_exists", { buildDir: a })
            );

            return;
          }
          if (-1 !== r.indexOf(" ")) {
            E.showErrorBox(
              Editor.T("BUILDER.error.build_error"),
              Editor.T("BUILDER.error.build_path_contains_space")
            );

            return;
          }
          if (/.*[\u4e00-\u9fa5]+.*$/.test(r)) {
            E.showErrorBox(
              Editor.T("BUILDER.error.build_error"),
              Editor.T("BUILDER.error.build_path_contains_chinese")
            );

            return;
          }
          if (!/^[a-zA-Z0-9_-]*$/.test(this.project.title)) {
            E.showErrorBox(
              Editor.T("BUILDER.error.build_error"),
              Editor.T("BUILDER.error.project_name_not_legal")
            );

            return;
          }
          let u = l.getOptions(b, o);
          u.separateEngineMode = false;
          let c = this.$children[0];
          if (!c || !c.checkParams || (await c.checkParams(u))) {
            Editor.Ipc.sendToAll("builder:state-changed", "ready", 0);
            var p = this.scenes
              .filter(function (e) {
                return e.checked;
              })
              .map(function (e) {
                return e.value;
              });
            if (p.length > 0) {
              u.actualPlatform = this.local.actualPlatform;
              u.scenes = p;
              let e = u.platform;

              if (e) {
                if (d &&
                    "android-instant" !== e) {
                  u.inlineSpriteFrames = u.inlineSpriteFrames_native;
                }

                u.embedWebDebugger = ("web-mobile" === e || "fb-instant-games" === e) &&
                u.embedWebDebugger;
              }

              this.startTask("build", u);

              Editor.Ipc.sendToMain("metrics:track-event", {
                category: "Project",
                action: "Build",
                label: u.actualPlatform || e,
              });

              s.trackModuleEvent();
            } else {
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.select_scenes_to_build")
              );
            }
          }
        },
        _onCompileClick(e) {
          e.stopPropagation();
          this.startTask("compile", l.getOptions(b, o));
        },
        _onStopCompileClick: function (e) {
          e.stopPropagation();
          Editor.Ipc.sendToMain("app:stop-compile");
        },
        _onPreviewClick(r) {
          r.stopPropagation();
          if ("android-instant" === this.local.platform &&
            !e.existsSync(
              t.join(
                v.get("android-sdk-root"),
                "extras/google/instantapps/ia"
              )
            )) {
            E.showErrorBox(
              Editor.T("BUILDER.error.build_error"),
              Editor.T("BUILDER.error.instant_utils_not_found")
            );

            return;
          }
          var a = l.getOptions(b, o);
          var i = Editor.remote.Builder;
          var s = i.simpleBuildTargets[this.local.actualPlatform];
          if (s && s.buttons) {
            let e = "object" == typeof s.buttons[1];
            if (e || s.buttons.includes(i.DefaultButtons.Play)) {
              if (e) {
                let e = s.buttons[1].message;
                Editor.Ipc.sendToMain(`${s.package}:${e}`, a);
              } else {
                Editor.Ipc.sendToMain(`${s.package}:play`, a);
              }
            }
          } else {
            Editor.Ipc.sendToMain("app:run-project", a);
          }
        },
        _onUploadClick(e) {
          e.stopPropagation();
          let t = Editor.remote.Builder;
          let r = t.simpleBuildTargets[this.local.actualPlatform];

          if (r &&
            r.buttons &&
            r.buttons.includes(t.DefaultButtons.Upload)) {
            Editor.Ipc.sendToMain(`${r.package}:upload`, l.getOptions(b, o));
          }
        },
        _openExternal(e, t) {
          e.stopPropagation();
          r.shell.openExternal(`${t}?_t=${Date.now()}`);
        },
        _onRecordClick(e) {
          let r = (function (e) {
              return [
                "FullYear",
                "Month",
                "Date",
                "Hours",
                "Minutes",
                "Seconds",
              ]
                .map((t) => {
                let r = e[`get${t}`]();

                if ("Month" === t) {
                  r++;
                }

                if (r < 10) {
                  r = "0" + r;
                }

                return r;
              })
                .join("");
            })(new Date());

          let a = t.join(
            Editor.Project.path,
            `/temp/android-instant-games/profiles/${r}`
          );

          Editor.Ipc.sendToMain("app:play-on-device", {
            platform: "simulator",
            recordPath: a,
          });
        },
        _onRefactorClick(e) {
          Editor.Panel.open("google-instant-games");
        },
      },
    }));

    if (!j.project.title) {
      j.project.title = Editor.Project.name;
    }

    if (!j.project.xxteaKey) {
      j.project.xxteaKey = a.v4().substr(0, 16);
    }

    if (!j.local.buildPath) {
      j.local.buildPath = "./build";
    }

    Editor.Ipc.sendToMain("builder:query-current-state", (e, t) => {
      if (e) {
        return Editor.warn(e);
      }
      j.task = t.task;
      Editor.Ipc.sendToAll("builder:state-changed", t.state, t.progress);
    });

    await this.updateSceneData();
  },
  async updateSceneData() {
    let e = await _.queryBundlesWithScenes();
    let t = this._udpateExcludeScenes(e);
    this._updateSceneList(e);
    this._updateStartSceneList();

    if (t) {
      this._vm.project.save();
    }
  },
  _udpateExcludeScenes(e) {
    let t = this._vm.project.excludeScenes;
    let r = [];
    for (let t in e) r.push(...e[t]);
    let a = false;
    for (let e = 0; e < t.length; e++) {
      let i = t[e];

      if (!r.some((e) => e.uuid === i)) {
        a = true;
        t.splice(e--, 1);
      }
    }
    return a;
  },
  _updateSceneList(e) {
    let t = this._vm.project.excludeScenes;
    let r = this._vm.scenes;
    r.length = 0;
    let a = [];
    for (let t in e) a.push(...e[t]);
    let i = [];

    ["main", "resources"].forEach((t) => {
      let r = e[t];

      if (r) {
        i.push(...r);
      }
    });

    i = i.map((e) => e.uuid);

    a.forEach((e) => {
      let o = i.includes(e.uuid);
      r.push({
        value: e.uuid,
        text: e.url,
        checked: !o || 1 === a.length || !t.includes(e.uuid),
        hidden: !o,
      });
    });
  },
  _updateStartSceneList() {
    let e = this._vm.project;
    let t = this._vm.scenes;
    let r = e.startScene;

    let a = !!t.find(function (e) {
      return e.value === r && !e.hidden;
    });

    if (!(r && a)) {
      if ((t = t.filter((e) => !e.hidden)).length > 0) {
        e.startScene = t[0].value;
      } else {
        e.startScene = "";
      }
    }
  },
});
