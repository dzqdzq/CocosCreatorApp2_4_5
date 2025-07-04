"use strict";
const e = Editor.require("packages://inspector/utils/utils").syncObjectProperty;
Vue.component("cc-gradient-range", {
  template:
    '\n    <div>\n        <style type="text/css">\n            @import url(\'packages://curve-editor/style/iconfont.css\');\n        </style>\n\n        <div class="ui-gradient-range">\n            <template\n                v-if="target"\n            >\n                <ui-prop\n                    :tooltip="target.attrs.tooltip"\n                    :name="target.name"\n                    :indent="indent"\n                    v-readonly="target.attrs.readonly"\n                >\n                    <ui-select class="flex-1"\n                        :value = "mode"\n                        :multi-values = "multi"\n                        @confirm="_onChangeMode"\n                    >\n                        <option value=\'0\'>Color</option>\n                        <option value=\'1\'>Gradient</option>\n                        <option value=\'2\'>TwoColors</option>\n                        <option value=\'3\'>TwoGradients</option>\n                        <option value=\'4\'>RandomColor</option>\n                    </ui-select>\n                </ui-prop>\n\n                <div class="prop-content">\n                        <template\n                            v-if="target.value && target.value.mode !== undefined"\n                        >\n                            <div class="content">\n                                <template\n                                    v-if="isOneColor()"\n                                >\n                                    <component auto="true"\n                                        :is="target.value.color.compType"\n                                        :target.sync="target.value.color"\n                                        :indent="indent+1"\n                                        :multi-values="multi"\n                                    ></component>\n                                </template>\n\n                                <template\n                                    v-if="isTwoColor()"\n                                >\n                                    <component auto="true"\n                                        :is="target.value.colorMin.compType"\n                                        :target.sync="target.value.colorMin"\n                                        :indent="indent+1"\n                                        :multi-values="multi"\n                                    ></component>\n                                    <component auto="true"\n                                        :is="target.value.colorMax.compType"\n                                        :target.sync="target.value.colorMax"\n                                        :indent="indent+1"\n                                        :multi-values="multi"\n                                    ></component>\n                                </template>\n\n                                <template   \n                                    v-if="isTwoGradient()"\n                                >\n                                    <component auto="true"\n                                        :is="target.value.gradientMin.compType"\n                                        :target.sync="target.value.gradientMin"\n                                        :indent="indent+1"\n                                        :multi-values="multi"\n                                    ></component>\n                                    <component auto="true"\n                                        :is="target.value.gradientMax.compType"\n                                        :target.sync="target.value.gradientMax"\n                                        :indent="indent+1"\n                                        :multi-values="multi"\n                                    ></component>\n                                </template>\n\n                                <template\n                                    v-if="isOneGradient()"\n                                >\n                                    <component\n                                        v-if="target.value.gradient.attrs.visible !== false"\n                                        :is="target.value.gradient.compType"\n                                        :target.sync="target.value.gradient"\n                                        :indent="indent+1"\n                                    ></component>\n                                </template>\n                            </div>\n                        </template>\n                        \n                </div>\n            </template>\n        </div>\n    </div>',
  props: {
    title: { type: String },
    target: { type: Object },
    indent: { type: Number, default: 0 },
    multi: { type: Boolean },
  },
  methods: {
    isOneColor() {
      return this.target.value.mode.value === cc.GradientRange.Mode.Color;
    },
    isOneGradient() {
      return (
        this.target.value.mode.value === cc.GradientRange.Mode.Gradient ||
        this.target.value.mode.value === cc.GradientRange.Mode.RandomColor
      );
    },
    isTwoColor() {
      return this.target.value.mode.value === cc.GradientRange.Mode.TwoColors;
    },
    isTwoGradient() {
      return (
        this.target.value.mode.value === cc.GradientRange.Mode.TwoGradients
      );
    },
    _onChangeMode(t) {
      this.mode = parseInt(t.detail.value);
      e(this.$root, this.target.value.mode.path, "Enum", this.mode);
    },
  },
  data: () => ({
    style: { background: "linear-gradient(to right, #fff 0%,#fff 100%)" },
    mode: 0,
  }),
  created() {
    this.mode = this.target.value.mode.value;
  },
  compiled() {},
});
