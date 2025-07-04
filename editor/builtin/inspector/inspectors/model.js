(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    data: {
      tabs: { model: { active: true }, animation: { active: false } },
      currentTab: null,
    },
    template:
      '\n        <cc-meta-header\n          :target="target"\n          icon="unpack://static/icon/assets/prefab.png"\n        ></cc-meta-header>\n\n        <style>\n          .model-tab {\n              display: flex;\n              flex: 1;\n              flex-direction: row;\n              align-items: center;\n              border-bottom: rgba(43, 40, 40, 0.52) solid 2px;\n              height: 30px;\n              background-color: rgba(105, 105, 105, 0.45);\n              margin: 4px 10px;\n          }\n\n          .model-tab span {\n              flex: 1;\n              text-align: center;\n              padding: 10px 0px;\n          }\n\n          .model-tab span.active {\n              background-color: black;\n          }\n        </style>\n\n        <div class="props flex-1">\n\n          <div class="model-tab">\n            <span \n              v-for="(key, tab) in tabs" \n              @click="changeSection(tab)"\n              :class="activeTab(tab)"\n            >\n              <span>{{T(\'INSPECTOR.model.\' + key)}}</span>\n            </span>\n          </div>\n\n          <div v-if="isActive(\'model\')">\n            <ui-prop type="number"\n              :name="T(\'INSPECTOR.model.scaleFactor\')" \n              v-value="target.scaleFactor"\n              v-values="target.multiValues.scaleFactor"\n              :multi-values="multi"\n              :tooltip="T(\'INSPECTOR.model.scaleFactor_tooltip\')"\n            >\n            </ui-prop>\n            <ui-prop type="number"\n              readonly\n              :name="T(\'INSPECTOR.model.boneCount\')" \n              v-value="target.boneCount"\n              v-values="target.multiValues.boneCount"\n              :multi-values="multi"  \n              :tooltip="T(\'INSPECTOR.model.boneCount_tooltip\')"\n            >\n            </ui-prop>\n          </div>\n          \n          <div v-if="isActive(\'animation\')">\n            <ui-prop type="boolean" \n              :name="T(\'INSPECTOR.model.precomputeJointMatrix\')" \n              v-value="target.precomputeJointMatrix"\n              v-values="target.multiValues.precomputeJointMatrix"\n              :multi-values="multi"\n              :tooltip="T(\'INSPECTOR.model.precomputeJointMatrix_tooltip\')"\n            >\n            </ui-prop>\n            <ui-prop type="number"\n              :name="T(\'INSPECTOR.model.animationFrameRate\')"\n              v-value="target.animationFrameRate"\n              v-values="target.multiValues.animationFrameRate"\n              :multi-values="multi" \n              v-if="target.precomputeJointMatrix"\n              :tooltip="T(\'INSPECTOR.model.animationFrameRate_tooltip\')"\n            >\n            </ui-prop>\n          </div>\n        </div>\n      ',
    ready() {
      this.currentTab = this.tabs.model;
    },
    methods: {
      changeSection(t) {
        if (this.currentTab) {
          this.currentTab.active = false;
        }

        this.currentTab = t;
        this.currentTab.active = true;
      },
      activeTab: (t) => (t.active ? "active" : ""),
      isActive(t) {
        return this.tabs[t].active;
      },
    },
  });
})();
