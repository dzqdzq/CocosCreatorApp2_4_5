"use strict";
require("fs-extra");
const e = require("util");

Vue.component("material-property", {
  template:
    '\n    <ui-prop\n        v-show="target.visible"\n        :name="target.displayName || target.name"\n        :assetType="target.assetType || false"\n        :type="target.valueType"\n        :tooltip="target.tooltip"\n        :min="target.range[0]"\n        :max="target.range[1]"\n        :step="target.range[2]"\n        :value="target.value"\n        @confirm="_onDataChanged"\n    ></ui-prop>\n    ',
  props: { target: { twoWay: true, type: Object } },
  watch: {
    "target.value"() {
      this._onDataChanged();
    },
  },
  methods: {
    _onDataChanged(e) {
      if (e && this.$el === e.target) {
        this.target.value = e.target.value;
      }

      Editor.UI.fire(this.$el, "material-item-changed", {
        detail: this.target,
        bubbles: true,
      });
    },
  },
});

Vue.component("material-properties", {
  template:
    '\n        <style>\n            .sub-properties-wrapper {\n                border: 1px dashed rgba(255,255,255,0.2); \n                margin: 5px;\n                padding: 5px;\n            }\n            .define-title {\n                font-weight: bold;\n            }\n        </style>\n        <div>\n            <material-property class="define-title" :target.sync="target.value" v-if="hasDefine"></material-property>\n            <div v-if="visible">\n                <div class="properties-wrapper" v-for="item in target.props" :style="{\'padding-left\': padding+\'px\'}">\n                    <material-property :target.sync="item"></material-property>\n                </div>\n                <div class="sub-properties-wrapper" v-for="item in children">\n                    <material-properties v-if="item" :target.sync="item"></material-properties>\n                </div>\n            </div>\n        </div>\n    ',
  props: { target: { twoWay: true, type: Object } },
  computed: {
    hasDefine() {
      return !!this.target.value;
    },
    padding() {
      return this.target.level > 0 ? 13 : 0;
    },
    visible() {
      return !this.hasDefine || this.target.value.value;
    },
    children() {
      let e = Object.assign({}, this.target);
      delete e.props;
      delete e.value;
      delete e.level;
      return e;
    },
  },
});

module.exports = {
    template: `\n         <style>\n            .pixelated {\n                image-rendering: pixelated;\n            }\n            .effect-content {\n                overflow: auto;\n                padding-right: 10px;\n            }\n        </style>\n        \n        <div :style="cssHost">\n            <img :style="cssIcon" :class="{ pixelated: pixelated }" \n                :src="icon"\n            />\n            <div :style="cssTitle">{{ target.__name__ }}</div>\n             <span class="flex-1"></span>\n             <ui-button class="red"\n                v-disabled="!dirty"\n                @confirm="_onCancel($event)"\n            >\n                ${Editor.T(
      "MESSAGE.revert"
    )}\n            </ui-button>\n            <ui-button :style="btnMargin" class="green"\n                v-disabled="!dirty"\n                @confirm="_onApply($event)"\n            >\n                ${Editor.T(
      "MESSAGE.apply"
    )}\n            </ui-button>\n        </div>\n         <div class="effect-content">\n            <ui-prop name="Effect" style="margin-bottom:10px;">\n                <ui-select\n                    :value="effectName"\n                    @confirm="_onEffectChanged($event)"\n                >\n                    <option\n                        v-for="type in effectTypes"\n                        :value="type"\n                    >{{type}}</option>\n                    <option \n                        value="__missing__" \n                        v-if="effectName === '__missing__'"\n                    >\n                        Missing Effect\n                    </option>\n                </ui-select>\n            </ui-prop>\n            \n            <ui-prop name="Technique" style="margin-bottom:20px;">\n                <ui-select\n                    :value="techniqueName"\n                    @confirm="_onTechniqueChanged($event)"\n                >\n                    <option\n                        v-for="name in techniqueNames"\n                        :value="name"\n                    >{{name}}</option>\n                </ui-select>\n            </ui-prop>\n\n            \n            <div style="border: 1px dashed rgba(255,255,255,0.4); margin: 5px; padding: 5px;" \n                v-for="pass in technique.passes"\n            >\n                <div style="margin: 5px;">Pass - <span style="color: chartreuse;">{{pass.name}}</span></div>\n                <material-properties\n                    :target.sync="pass.displayTree" \n                    @data-changed="_onDataChanged"\n                >\n                </material-properties>\n            </div>\n        </div>\n    `,
    async ready() {
      this.refresh();
    },
    compiled() {
      this.$el.addEventListener("material-item-changed", (e) => {
        e.stopPropagation();
        this._onDataChanged(e.detail);
      });
    },
    data: {
      cssHost: {
        display: "flex",
        flex: "none",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: "2px",
        margin: "5px 10px",
        marginBottom: "10px",
        borderBottom: "1px solid #666",
        height: "35px",
        overflow: "hidden",
      },
      cssIcon: { marginRight: "5px" },
      cssTitle: {
        fontWeight: "bold",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
      btnMargin: { marginLeft: "10px" },
      pixelated: this.icon && this.icon.startsWith("unpack://"),
      effectTypes: [],
      effectName: "",
      displayTree: {},
      technique: {},
      techniqueNames: [],
      techniqueName: "",
      techniqueIndex: -1,
      dirty: false,
    },
    watch: {
      target() {
        this.refresh();
      },
      effectName() {
        if (this.effectName &&
          !this.isEffectMissing()) {
          this.recreateTechniqueData();
          this.refreshTechnique();
        }
      },
      techniqueIndex() {
        if (!(-1 === this.techniqueIndex || this.isEffectMissing())) {
          this.recreateTechniqueData();
          this.refreshTechnique();
        }
      },
    },
    methods: {
      isEffectMissing() {
        return "__missing__" === this.effectName;
      },
      createDisplayList(e, t) {
        const i = /^(_|CC_)/;
        let n = { level: 0 };
        const s = {};
        const a = {};
        for (let e in t) {
          let i = t[e];
          a[i.name] = i;
        }
        for (let t of e) {
          let e = n;

          t.defines.forEach((t) => {
            if (!i.test(t)) {
              if (!e[t]) {
                e[t] = { level: e.level + 1, value: a[t] };
              }

              e = e[t];
              s[t] = true;
            }
          });

          if (!e.props) {
            e.props = [];
          }

          e.props.push(t);
        }
        for (let e of t) if (!(s[e.name] || i.test(e.name))) {
          e.defines
            .concat(e.name)
            .reduce(
              (t, i) => (
                t[i] || (t[i] = { level: t.level + 1, value: a[e.name] }),
                t[i]
              ),
              n
            );
        }
        return n;
      },
      recreateTechniqueData() {
        _Scene.MaterialUtils.switchEffectOrTechnique(
          this.asset,
          this.resetAsset,
          this.effectName,
          this.techniqueIndex
        );
      },
      refreshTechnique() {
        let e = (e, t, i) => {
          let n = (t) => {
            let n;
            let s = t.type;
            let a = t.name;
            try {
              n = this.asset._techniqueData[i][s][a];
            } catch (e) {}
            if (void 0 === n) {
              if (!e[a]) {
                return "";
              }
              n = e[a].value;
            }
            return t.assetType ? { uuid: n ? n.uuid || n._uuid : "" } : n;
          };
          return Object.keys(e).map((s) => {
            let a = e[s];

            let r = {
              type: t,
              name: s,
              passIdx: i,
              displayName: a.displayName,
              tooltip: a.tooltip,
              defines: a.defines,
              valueType: a.typeName,
              assetType: a.assetType,
              valueCtor: a.valueCtor,
              visible: void 0 === a.visible || a.visible,
              range: a.range || [-1 / 0, 1 / 0, 0.1],
            };

            r.value = n(r);
            return r;
          });
        };
        const t = cc.assetManager.builtins.getBuiltin(
          "effect",
          this.effectName
        );
        if (!t) {
          return;
        }
        let i = t ? cc.Effect.parseForInspector(t) : {};
        this.techniqueNames = i.map((e) => e.name);
        let n = i[this.techniqueIndex];

        n.passes.forEach((t, i) => {
          t.props = e(t.props, "props", i);
          t.defines = e(t.defines, "defines", i);
          t.displayTree = this.createDisplayList(t.props, t.defines);
        });

        this.technique = n;
        this.techniqueName = this.techniqueNames[this.techniqueIndex];
      },
      async refresh() {
        this.effectName = "";
        this.techniqueIndex = -1;
        this.dirty = false;
        if (!this.target) {
          return;
        }
        let { asset: e, resetAsset: t } =
          await _Scene.MaterialUtils.getInspectorAsset(this.target.uuid);
        this.asset = e;
        this.resetAsset = t;
        this.effectName = e.effectName || "__missing__";
        this.techniqueIndex = e.techniqueIndex || 0;

        this.effectTypes = Object.keys(
            cc.assetManager.builtins.getBuiltin("effect")._map
          )
            .filter((e) => !e.startsWith("__"))
            .sort();
      },
      _onEffectChanged(e) {
        this.effectName = e.target.value;
        this.dirty = true;
      },
      _onTechniqueChanged(e) {
        this.techniqueIndex = this.techniqueNames.indexOf(e.target.value);
        this.dirty = true;
      },
      _onDataChanged(e) {
        _Scene.MaterialUtils.updateInspectorMaterialValue(e, this.asset);
        this.dirty = true;
      },
      _onCancel() {
        _Scene.MaterialUtils.resetInspectorAsset(this.resetAsset);
        this.refresh();
      },
      async _onApply() {
        let t = Editor.serialize(this.asset);
        if (Editor.remote.assetdb.isSubAssetByUuid(this.target.uuid)) {
          let e = JSON.stringify({ uuid: this.target.uuid, dataAsSubAsset: t });
          Editor.assetdb.saveMeta(this.target.uuid, e, (e) => {
            if (e) {
              return Editor.error(e);
            }
            this.dirty = false;
            Editor.Ipc.sendToWins("scene:soft-reload", true);
          });
        } else {
          const i = await e.promisify(Editor.assetdb.queryInfoByUuid)(
            this.target.uuid
          );
          Editor.assetdb.saveExists(i.url, t, (e) => {
            if (e) {
              return Editor.error(e);
            }
            this.dirty = false;
            Editor.Ipc.sendToWins("scene:soft-reload", true);
          });
        }
      },
    },
  };
