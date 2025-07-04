"use strict";
const e = require("fire-fs");
const t = (require("fire-path"), require("electron").remote.dialog);
const i = Editor.require("packages://project-settings/panel/utils");
Editor.Panel.extend({
  style: e.readFileSync(
    Editor.url("packages://project-settings/panel/style/home.css")
  ),
  template: e.readFileSync(
    Editor.url("packages://project-settings/panel/template/home.html")
  ),
  ready() {
    i.init();

    Editor.Ipc.sendToMain("project-settings:query-tab", (e, r) => {
      (function (e, r) {
        return new Vue({
          el: e,
          data: {
            loaded: true,
            tab: r,
            loading: false,
            group: {
              list: i.queryGroupList(),
              collision: i.queryCollision(),
            },
            module: { excluded: i.queryExcluded() },
            preview: {
              project: i.queryPreview(),
              simulator: i.querySimulator(),
            },
            engine: i.queryEngine(),
            service: { facebook: i.queryFacebook() },
          },
          methods: {
            T: Editor.T,
            _selectTab(e) {
              this.tab = e;
              Editor.Ipc.sendToMain("project-settings:update-tab", e);
            },
            _save() {
              return this.engine.useGlobalSetting ||
                this.engine.useDefaultCppEngine ||
                this.engine.cppEnginePath
                ? this.engine.useGlobalSetting ||
                  this.engine.useDefaultJsEngine ||
                  this.engine.jsEnginePath
                  ? ((this.loading = true),
                    i.setGroupList(this.group.list),
                    i.setCollision(this.group.collision),
                    i.setExcluded(this.module.excluded),
                    i.setPreview(this.preview.project),
                    i.setSimulator(this.preview.simulator),
                    i.setEngine(this.engine),
                    i.setFacebook(this.service.facebook),
                    i.save(),
                    setTimeout(() => {
                      this.loading = false;
                    }, 500),
                    void 0)
                  : (t.showErrorBox(
                      Editor.T("PROJECT_SETTINGS.error.setting_error"),
                      Editor.T(
                        "PROJECT_SETTINGS.error.custom_engine_empty_tips",
                        { name: "JavaScript" }
                      )
                    ),
                    void 0)
                : (t.showErrorBox(
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
            group: Editor.require(
              "packages://project-settings/panel/components/group"
            ),
            module: Editor.require(
              "packages://project-settings/panel/components/module"
            ),
            preview: Editor.require(
              "packages://project-settings/panel/components/preview"
            ),
            engine: Editor.require(
              "packages://project-settings/panel/components/engine"
            ),
            service: Editor.require(
              "packages://project-settings/panel/components/service"
            ),
          },
        });
      })(this.shadowRoot.getElementById("settings"), e ? 0 : r);
    });
  },
});
