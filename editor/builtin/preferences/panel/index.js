"use strict";
const e = require("fire-fs");
const t = (require("fire-path"), Editor.require("packages://preferences/panel/utils"));
const r = require("electron").remote.dialog;
Editor.Panel.extend({
  style: e.readFileSync(
    Editor.url("packages://preferences/panel/style/home.css")
  ),
  template: e.readFileSync(
    Editor.url("packages://preferences/panel/template/home.html")
  ),
  ready() {
    t.init();

    Editor.Ipc.sendToMain("preferences:query-tab", (e, i) => {
      this._vm = (function (e, i) {
        return new Vue({
          el: e,
          data: {
            loaded: true,
            changed: false,
            tab: i || 0,
            loading: false,
            general: t.queryGeneral(),
            editor: t.queryEditor(),
            native: t.queryNative(),
            preview: t.queryPreview(),
          },
          watch: {
            tab(e) {
              Editor.Ipc.sendToMain("preferences:update-tab", e);
            },
            general: {
              deep: true,
              handler() {
                this.changed = true;
              },
            },
            editor: {
              deep: true,
              handler() {
                this.changed = true;
              },
            },
            native: {
              deep: true,
              handler() {
                this.changed = true;
              },
            },
            preview: {
              deep: true,
              handler() {
                this.changed = true;
              },
            },
            "native.useDefaultCppEngine"(e) {
              let r = e ? null : this.native.cppEnginePath;
              t.resetSimulatorConfig(r);
              this.preview = t.queryPreview();
            },
            "native.cppEnginePath"(e) {
              e = this.native.useDefaultCppEngine ? null : e;
              t.resetSimulatorConfig(e);
              this.preview = t.queryPreview();
            },
          },
          methods: {
            T: Editor.T,
            _selectTab(e) {
              this.tab = e;
              Editor.Ipc.sendToMain("preferences:update-tab", e);
            },
            _save() {
              return this.native.useDefaultCppEngine ||
                this.native.cppEnginePath
                ? this.native.useDefaultJsEngine || this.native.jsEnginePath
                  ? ((this.loading = true),
                    (this.changed = false),
                    t.setGeneral(this.general),
                    t.setEditor(this.editor),
                    t.setNative(this.native),
                    t.setPreview(this.preview),
                    t.save(),
                    setTimeout(() => {
                      this.loading = false;
                    }, 300),
                    void 0)
                  : (r.showErrorBox(
                      Editor.T("PROJECT_SETTINGS.error.setting_error"),
                      Editor.T(
                        "PROJECT_SETTINGS.error.custom_engine_empty_tips",
                        { name: "JavaScript" }
                      )
                    ),
                    void 0)
                : (r.showErrorBox(
                    Editor.T("PROJECT_SETTINGS.error.setting_error"),
                    Editor.T(
                      "PROJECT_SETTINGS.error.custom_engine_empty_tips",
                      { name: "Cocos2d-x" }
                    )
                  ),
                  void 0);
            },
          },
          components: {
            general: Editor.require(
              "packages://preferences/panel/components/general"
            ),
            editor: Editor.require(
              "packages://preferences/panel/components/editor"
            ),
            native: Editor.require(
              "packages://preferences/panel/components/native"
            ),
            preview: Editor.require(
              "packages://preferences/panel/components/preview"
            ),
          },
        });
      })(this.shadowRoot.getElementById("settings"), i);
    });
  },
  canClose() {
    let e = this._vm;
    if (e && e.changed) {
      switch (
        Editor.Dialog.messageBox({
          type: "info",
          buttons: [
            Editor.T("MESSAGE.save"),
            Editor.T("MESSAGE.dont_save"),
            Editor.T("MESSAGE.cancel"),
          ],
          title: Editor.T("MESSAGE.warning"),
          message: Editor.T("MESSAGE.warning"),
          detail: Editor.T("MESSAGE.preferences.modified"),
          defaultId: 0,
          cancelId: 0,
          noLink: true,
        })
      ) {
        case 0:
          e._save();
        case 1:
          e.changed = false;
          Editor.Ipc.sendToMain("preferences:close", this._vm.tab);
          return true;
        default:
          return false;
      }
    }
    return true;
  },
});
