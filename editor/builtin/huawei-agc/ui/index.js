"use strict";
const e = require("fire-fs");
const t = require("fire-path");
const i = Editor.require("packages://huawei-agc/const.js");
const r = require("electron").remote.dialog;
const s = require(Editor.url("packages://builder/panel/platform/android.js"));
let n = Editor.Profile.load(i.PROFILE_PATH);
const o = require("electron").ipcRenderer;
const a = { id: "0", name: Editor.T("huawei-agc.empty_plugin_name"), plugins: [] };
const c = "3";
let l = s.template;
exports.name = "huawei-agc";
exports.mixins = [s];

exports.data = function () {
    let i = t.join(Editor.Project.path, "settings", "agconnect-services.json");
    return {
      selected: null,
      config: [],
      defaultServiceConfigPath: i,
      serviceConfigPath: e.existsSync(i) ? i : "",
    };
  };

exports.computed = {
    currentSelect() {
      if (this.selected) {
        for (let e in this.config)
          if (this.config[e].id === this.selected) {
            return this.config[e];
          }
      }
      return null;
    },
  };

exports.methods = {
    t: (e) => Editor.T(`huawei-agc.${e}`),
    jumpClick() {
      Editor.Panel.open("cocos-services", { service_name: "sdkhub" });
    },
    parseConfig(e) {
      return this.paramValid(e)
        ? this.t("plugin_config")
        : this.t("plugin_not_config");
    },
    paramValid: (e) => e.hasParam,
    checkParams() {
      if (!this.currentSelect) {
        return false;
      }
      if ("0" === this.currentSelect.id) {
        return true;
      }
      if (this.currentSelect.plugins.find((e) => e.requireParam && !e.hasParam)) {
        r.showErrorBox(
          this.t("param_empty_title"),
          this.t("param_empty_desc")
        );

        return false;
      }
      if (!e.existsSync(this.defaultServiceConfigPath)) {
        r.showErrorBox(
          this.t("param_empty_title"),
          this.t("service_config_empty")
        );

        return false;
      }
      return true;
    },
    queryDisplayName(e) {
      Editor.Ipc.sendToMain(
        "cocos-services:plugin-messages",
        "sdkhub:plugins-type",
        e.id,
        (t, i) => {
          if (!t && i) {
            for (let t in i) {
              let r = i[t];
              let s = e.plugins.find((e) => e.pId === t);

              if (s) {
                s.pName += r;
              }
            }
          }
        }
      );
    },
    loadConfig() {
      if (e.existsSync(i.CONFIG_PATH)) {
        let t = e.readJsonSync(i.CONFIG_PATH, "utf8").configSet;

        (t = t.filter((e) => e.platform === c)).forEach((e) => {
          this.queryDisplayName(e);
        });

        this.config = t;
      }
      this.config.unshift(a);

      this.selected = this.checkConfigExists()
          ? n.get("configSelected")
          : this.config.length > 0
          ? this.config[0].id
          : null;
    },
    checkConfigExists() {
      let e = n.get("configSelected");
      return !!this.config.find((t) => t.id === e);
    },
    onChooseDistPathClick(i) {
      i.stopPropagation();
      let r = t.join(Editor.Project.path);

      let s = Editor.Dialog.openFile({
        defaultPath: r,
        filters: [{ name: this.t("config_file_path"), extensions: ["json"] }],
      });

      try {
        if (s && s[0]) {
          let t = s[0];
          if (t === this.defaultServiceConfigPath) {
            return;
          }
          e.copySync(t, this.defaultServiceConfigPath, { overwrite: true });
          this.serviceConfigPath = this.defaultServiceConfigPath;
        }
      } catch (e) {
        Editor.error(e);
      }
    },
    onShowInFinderClick() {},
  };

exports.created = function () {
  o.on("huawei-agc:update-sdkhub-config", (e, ...t) => {
    this.loadConfig();
  });

  this.loadConfig();
};

exports.watch = {
    selected(e) {
      n.set("configSelected", e);
      n.save();
    },
  };

exports.template = l +
e.readFileSync(Editor.url("packages://huawei-agc/ui/index.html"), "utf8");
