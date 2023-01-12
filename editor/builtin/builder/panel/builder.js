"use strict";
const e = require("fire-fs"),
  t = require("fire-path"),
  r = require("electron"),
  a = require("node-uuid"),
  i = Editor.require("app://editor/share/build-platforms"),
  o = require(Editor.url("packages://builder/utils/event")),
  s = require(Editor.url("packages://builder/utils/module-events")),
  l = require(Editor.url("app://editor/share/build-utils")),
  n = require(Editor.url("packages://builder/utils/network")),
  d = require(Editor.url("packages://builder/panel/platform/android")),
  u = require(Editor.url("packages://builder/panel/platform/web-desktop")),
  c = require(Editor.url("packages://builder/panel/platform/web-mobile")),
  p = require(Editor.url("packages://builder/panel/platform/fb-instant-games")),
  m = require(Editor.url("packages://builder/panel/platform/android-instant")),
  h = require(Editor.url("packages://builder/panel/platform/windows")),
  f = require(Editor.url("packages://builder/panel/platform/ios")),
  g = require(Editor.url("packages://builder/panel/platform/mac")),
  E = require("electron").remote.dialog,
  { promisify: b } = require("util"),
  v = Editor.remote.Profile.load("global://settings.json"),
  P = Editor.remote.Profile.load("global://features.json"),
  _ = Editor.require("app://editor/share/bundle-utils"),
  k = { local: null, project: null, anysdk: null };
let T = P.get("xiaomi-runtime") || !1,
  y = P.get("alipay-minigame") || !1,
  j = P.get("qtt-runtime") || !1,
  B = P.get("huawei-agc") || !1,
  D = P.get("link-sure") || !1,
  S = P.get("bytedance-minigame") || !1,
  w = [
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
        if (
          (this._vm.setSystemBarProgress(
            "error" === t || "finish" === t ? -1 : r
          ),
          (r *= 100),
          "error" === t)
        )
          return (
            (this._vm.buildProgress = r),
            (this._vm.buildState = "failed"),
            (this._vm.task = ""),
            void 0
          );
        if ("finish" === t)
          return (
            (this._vm.buildProgress = 100),
            (this._vm.buildState = "completed"),
            (this._vm.task = ""),
            void 0
          );
        (this._vm.buildProgress = r), (this._vm.buildState = t);
      }
    },
    "builder:events": function (e, t, ...r) {
      o.emit(t, ...r);
    },
    "keystore:created": function (e, t) {
      (this._vm.local.keystorePath = t.path),
        (this._vm.local.keystorePassword = t.password),
        (this._vm.local.keystoreAlias = t.alias),
        (this._vm.local.keystoreAliasPassword = t.aliasPassword);
    },
    "asset-db:assets-deleted": async function (e, t) {
      !!t.find((e) => "scene" === e.type) && (await this.updateSceneData());
    },
    "asset-db:assets-moved": async function (e, t) {
      !!t.find((e) => "scene" === e.type) && (await this.updateSceneData());
    },
    "asset-db:assets-created": async function (e, t) {
      !!t.find((e) => "scene" === e.type) && (await this.updateSceneData());
    },
    "inspector:bundle-updated": async function (e, t) {
      await this.updateSceneData();
    },
  },
  async ready() {
    let o = this.profiles.local,
      b = this.profiles.project;
    o.get("actualPlatform") || o.set("actualPlatform", o.get("platform")),
      (function (e) {
        let t = e.get("platform"),
          r = Object.keys(i),
          a = r.includes(t);
        if (a) return;
        let o = Editor.remote.Builder.simpleBuildTargets[t];
        (t = (o && o.extends) || t),
          (a = r.includes(t)) ||
            ((t = "web-mobile"), e.set("actualPlatform", "web-mobile")),
          e.set("platform", t);
      })(o),
      (function (e) {
        let t = e.get("packageName");
        if (!t) return;
        const r = ["android", "android-instant", "ios", "mac"];
        for (let a of r) {
          let r = e.get(a);
          r && !r.packageName && ((r.packageName = t), e.set(a, r));
        }
      })(b);
    let P = {},
      _ = [c, d, m, u, p, h, f, g],
      T = Editor.remote.Builder.simpleBuildTargets;
    for (let e in T) {
      let t = T[e];
      if (t.settings) {
        let e = require(t.settings);
        !e.name && (e.name = t.platform), _.push(e);
      } else Editor.warn("Can not load package", t.name);
    }
    _.forEach((e) => {
      e.props || (e.props = {});
      for (let t in k) !e.props[t] && (e.props[t] = k[t]);
      P[e.name] = e;
    });
    let y = {
      platforms: (function (e) {
        let t = [];
        t.push({
          value: "web-mobile",
          text: Editor.T("BUILDER.platforms.web-mobile"),
        }),
          t.push({
            value: "web-desktop",
            text: Editor.T("BUILDER.platforms.web-desktop"),
          }),
          t.push({
            value: "fb-instant-games",
            text: Editor.T("BUILDER.platforms.fb-instant-games"),
          }),
          t.push({
            value: "android",
            text: Editor.T("BUILDER.platforms.android"),
          }),
          t.push({
            value: "android-instant",
            text: Editor.T("BUILDER.platforms.android-instant"),
          }),
          "darwin" === process.platform &&
            (t.push({ value: "ios", text: Editor.T("BUILDER.platforms.ios") }),
            t.push({ value: "mac", text: Editor.T("BUILDER.platforms.mac") })),
          "win32" === process.platform &&
            t.push({
              value: "win32",
              text: Editor.T("BUILDER.platforms.win32"),
            });
        let r = Editor.remote.Builder.simpleBuildTargets,
          a = [];
        for (let e in r) {
          let t = r[e];
          t.settings && a.push({ value: t.platform, text: t.name });
        }
        return (
          (t = t.concat(a)),
          w
            .map((e) => {
              if ("string" == typeof e) return t.find((t) => t.value === e);
              {
                let r = e[Editor.lang];
                return t.find(
                  (e) =>
                    e.text.replace(/\s/g, "").toLowerCase() ===
                    r.replace(/\s/g, "").toLowerCase()
                );
              }
            })
            .filter(Boolean)
        );
      })(),
      scenes: [],
      all: !1,
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
            (this.local.platform = this._actualPlatform2Platform(e)),
              (this.local.actualPlatform = e),
              this.isCompressionTypeVisible(this.project.mainCompressionType) ||
                (this.project.mainCompressionType = "default");
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
          var e = Editor.remote.Builder,
            t = e.simpleBuildTargets[this.local.actualPlatform];
          return (
            !(!t || !t.buttons || "object" != typeof t.buttons[1]) ||
            !t ||
            !t.buttons ||
            t.buttons.includes(e.DefaultButtons.Play)
          );
        },
        needCompile() {
          var e = Editor.remote.Builder,
            t = e.simpleBuildTargets[this.local.actualPlatform];
          return t && t.buttons
            ? t.buttons.includes(e.DefaultButtons.Compile)
            : i[this.local.platform].isNative;
        },
        needUpload() {
          var e = Editor.remote.Builder,
            t = e.simpleBuildTargets[this.local.actualPlatform];
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
          deep: !0,
        },
        project: {
          handler(e) {
            this.saveProjectData();
          },
          deep: !0,
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
            var t = this.project.startScene,
              r = !1;
            for (let i = 0; i < e.length; i++) {
              let o = e[i];
              if (o.text.startsWith("db://assets/resources/") || t === o.value)
                r = !0;
              else {
                var a = this.project.excludeScenes.indexOf(o.value);
                o.checked || -1 !== a
                  ? o.checked &&
                    -1 !== a &&
                    this.project.excludeScenes.splice(a, 1)
                  : this.project.excludeScenes.push(o.value);
              }
            }
            e.length > 0 && !r && (this.project.startScene = e[0].value),
              (this.all = this.scenes.every(function (e) {
                return e.checked;
              }));
          },
          deep: !0,
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
            0 === (e = JSON.parse(e)).status && j.$set("agreements", e.data);
          } catch (e) {}
        },
        jumpClick(e) {
          r.shell.openExternal(e);
        },
        _mainCompressionTypeChanged() {
          this.supportRemoteMain
            ? this.isRemoteBundleReadonly &&
              ("subpackage" === this.project.mainCompressionType
                ? (this.project.mainIsRemote = !1)
                : "zip" === this.project.mainCompressionType &&
                  (this.project.mainIsRemote = !0))
            : (this.project.mainIsRemote = !1);
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
          }),
            o.save();
        },
        saveProjectData() {
          Object.keys(this.project).forEach((e) => {
            b.set(e, this.project[e]);
          }),
            b.save();
        },
        t: (e) => Editor.T(e),
        _actualPlatform2Platform(e) {
          let t = Editor.remote.Builder.simpleBuildTargets[e];
          return (t && t.extends) || e;
        },
        _onOpenCompileLogFile(e) {
          e.stopPropagation(),
            Editor.Ipc.sendToMain("app:open-cocos-console-log");
        },
        _onChooseDistPathClick(e) {
          e.stopPropagation();
          let r = Editor.Dialog.openFile({
            defaultPath: l.getAbsoluteBuildPath(this.local.buildPath),
            properties: ["openDirectory"],
          });
          r &&
            r[0] &&
            (t.contains(Editor.Project.path, r[0])
              ? ((this.local.buildPath = t
                  .relative(Editor.Project.path, r[0])
                  .replace(/\\/g, "/")),
                "" === this.local.buildPath && (this.local.buildPath = "./"))
              : (this.local.buildPath = r[0]));
        },
        _onShowInFinderClick(t) {
          t.stopPropagation();
          let a = l.getAbsoluteBuildPath(this.local.buildPath);
          if (!e.existsSync(a)) return Editor.warn("%s not exists!", a), void 0;
          r.shell.showItemInFolder(a), r.shell.beep();
        },
        _onSelectAllCheckedChanged(e) {
          if (!this.scenes) return;
          let t = this.project.startScene;
          for (let a = 0; a < this.scenes.length; a++) {
            let i = this.scenes[a];
            if (!i.text.startsWith("db://assets/resources/") && t !== i.value) {
              i.checked = e.detail.value;
              var r = this.project.excludeScenes.indexOf(i.value);
              i.checked || -1 !== r
                ? i.checked &&
                  -1 !== r &&
                  this.project.excludeScenes.splice(r, 1)
                : this.project.excludeScenes.push(i.value);
            }
          }
        },
        startTask(e, t) {
          this.task = e;
          let r = Editor.Profile.load("project://project.json");
          (t.excludedModules = r.get("excluded-modules")),
            Editor.Ipc.sendToMain("builder:start-task", e, t);
        },
        _onBuildClick(e) {
          e.stopPropagation(),
            Editor.Ipc.sendToPanel(
              "scene",
              "scene:query-dirty-state",
              (e, t) => {
                if (t.dirty)
                  return (
                    Editor.error(
                      t.name + " " + Editor.T("BUILDER.error.dirty_info")
                    ),
                    void 0
                  );
                this._build();
              }
            );
        },
        async _build() {
          this.saveLocalData();
          var r = l.getAbsoluteBuildPath(this.local.buildPath),
            a = t.win32.dirname(r),
            n = this.local.platform;
          let d = i[n].isNative;
          if (!e.existsSync(a))
            return (
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.build_dir_not_exists", { buildDir: a })
              ),
              void 0
            );
          if (-1 !== r.indexOf(" "))
            return (
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.build_path_contains_space")
              ),
              void 0
            );
          if (/.*[\u4e00-\u9fa5]+.*$/.test(r))
            return (
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.build_path_contains_chinese")
              ),
              void 0
            );
          if (!/^[a-zA-Z0-9_-]*$/.test(this.project.title))
            return (
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.project_name_not_legal")
              ),
              void 0
            );
          let u = l.getOptions(b, o);
          u.separateEngineMode = !1;
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
              (u.actualPlatform = this.local.actualPlatform), (u.scenes = p);
              let e = u.platform;
              e &&
                (d &&
                  "android-instant" !== e &&
                  (u.inlineSpriteFrames = u.inlineSpriteFrames_native),
                (u.embedWebDebugger =
                  ("web-mobile" === e || "fb-instant-games" === e) &&
                  u.embedWebDebugger)),
                this.startTask("build", u),
                Editor.Ipc.sendToMain("metrics:track-event", {
                  category: "Project",
                  action: "Build",
                  label: u.actualPlatform || e,
                }),
                s.trackModuleEvent();
            } else
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.select_scenes_to_build")
              );
          }
        },
        _onCompileClick(e) {
          e.stopPropagation(), this.startTask("compile", l.getOptions(b, o));
        },
        _onStopCompileClick: function (e) {
          e.stopPropagation(), Editor.Ipc.sendToMain("app:stop-compile");
        },
        _onPreviewClick(r) {
          if (
            (r.stopPropagation(),
            "android-instant" === this.local.platform &&
              !e.existsSync(
                t.join(
                  v.get("android-sdk-root"),
                  "extras/google/instantapps/ia"
                )
              ))
          )
            return (
              E.showErrorBox(
                Editor.T("BUILDER.error.build_error"),
                Editor.T("BUILDER.error.instant_utils_not_found")
              ),
              void 0
            );
          var a = l.getOptions(b, o),
            i = Editor.remote.Builder,
            s = i.simpleBuildTargets[this.local.actualPlatform];
          if (s && s.buttons) {
            let e = "object" == typeof s.buttons[1];
            if (e || s.buttons.includes(i.DefaultButtons.Play))
              if (e) {
                let e = s.buttons[1].message;
                Editor.Ipc.sendToMain(`${s.package}:${e}`, a);
              } else Editor.Ipc.sendToMain(`${s.package}:play`, a);
          } else Editor.Ipc.sendToMain("app:run-project", a);
        },
        _onUploadClick(e) {
          e.stopPropagation();
          let t = Editor.remote.Builder,
            r = t.simpleBuildTargets[this.local.actualPlatform];
          r &&
            r.buttons &&
            r.buttons.includes(t.DefaultButtons.Upload) &&
            Editor.Ipc.sendToMain(`${r.package}:upload`, l.getOptions(b, o));
        },
        _openExternal(e, t) {
          e.stopPropagation(), r.shell.openExternal(`${t}?_t=${Date.now()}`);
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
                  return "Month" === t && r++, r < 10 && (r = "0" + r), r;
                })
                .join("");
            })(new Date()),
            a = t.join(
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
    j.project.title || (j.project.title = Editor.Project.name),
      j.project.xxteaKey || (j.project.xxteaKey = a.v4().substr(0, 16)),
      j.local.buildPath || (j.local.buildPath = "./build"),
      Editor.Ipc.sendToMain("builder:query-current-state", (e, t) => {
        if (e) return Editor.warn(e);
        (j.task = t.task),
          Editor.Ipc.sendToAll("builder:state-changed", t.state, t.progress);
      }),
      await this.updateSceneData();
  },
  async updateSceneData() {
    let e = await _.queryBundlesWithScenes(),
      t = this._udpateExcludeScenes(e);
    this._updateSceneList(e),
      this._updateStartSceneList(),
      t && this._vm.project.save();
  },
  _udpateExcludeScenes(e) {
    let t = this._vm.project.excludeScenes,
      r = [];
    for (let t in e) r.push(...e[t]);
    let a = !1;
    for (let e = 0; e < t.length; e++) {
      let i = t[e];
      r.some((e) => e.uuid === i) || ((a = !0), t.splice(e--, 1));
    }
    return a;
  },
  _updateSceneList(e) {
    let t = this._vm.project.excludeScenes,
      r = this._vm.scenes;
    r.length = 0;
    let a = [];
    for (let t in e) a.push(...e[t]);
    let i = [];
    ["main", "resources"].forEach((t) => {
      let r = e[t];
      r && i.push(...r);
    }),
      (i = i.map((e) => e.uuid)),
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
    let e = this._vm.project,
      t = this._vm.scenes,
      r = e.startScene,
      a = !!t.find(function (e) {
        return e.value === r && !e.hidden;
      });
    (r && a) ||
      ((t = t.filter((e) => !e.hidden)).length > 0
        ? (e.startScene = t[0].value)
        : (e.startScene = ""));
  },
});
