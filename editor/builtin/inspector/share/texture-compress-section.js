"use strict";

Vue.component("texture-format", {
  template:
    '\n    <style>\n        .wrapper {\n            display: flex;\n            flex-direction: column;\n            padding: 5px 15px;\n            border-top: rgba(0, 0, 0, 0.58) dashed 1px;\n        }\n    </style>\n    <div style="min-height: 40px;">\n        <div \n            style="margin-top: 10px; margin-bottom: 10px"\n            class="layout horizontal center-center"\n        >\n            <ui-select\n                style="width: 240px;"\n                @confirm="onSelectFormat"\n                v-value="selectValue"\n            >\n                <option value="none">Select A Format To Add</option>\n                <option\n                    v-for="(name, description) in platformSupportedFormats" \n                    :value="name"\n                >\n                    {{description}}\n                </option>\n            </ui-select>\n        </div>\n        <div>\n            <div \n                v-for="(index, format) in formats"\n                class="wrapper"\n            >\n                <div style="display:flex;">\n                    <span style="flex:1;">{{supportFormats[format.name]}}</span>\n                    <ui-button class="mini" @confirm="deleteFormat($event, format)">\n                        x\n                    </ui-button>\n                </div>\n\n                \x3c!-- pvr format quality --\x3e\n                <ui-prop \n                    type="enum"\n                    name="Quality"\n                    v-value="format.quality"\n                    :path="getPath(index, \'quality\')"\n                    v-if="isPVRFormat(format.name)"\n                >\n                    <option value="fastest">Fastest</option>\n                    <option value="fast">Fast</option>\n                    <option value="normal">Normal</option>\n                    <option value="high">High</option>\n                    <option value="best">Best</option>\n                </ui-prop>\n\n                \x3c!-- etc format quality --\x3e\n                <ui-prop \n                    type="enum"\n                    name="Quality"\n                    v-value="format.quality"\n                    :path="getPath(index, \'quality\')"\n                    v-if="isETCFormat(format.name)"\n                >\n                    <option value="slow">Slow</option>\n                    <option value="fast">Fast</option>\n                </ui-prop>\n                \n                \x3c!-- normal format quality --\x3e\n                <ui-prop \n                    type="number"\n                    name="Quality"\n                    v-value="format.quality"\n                    :path="getPath(index, \'quality\')"\n                    min="1" max="99"\n                    v-if="!isPVRFormat(format.name) && !isETCFormat(format.name)"\n                >\n                </ui-prop>\n\n                <div v-if="isETC2Format(format.name) && platform === \'android\'" style="margin-top:10px;color:yellow;">\n                    <i class="fa fa-exclamation-triangle fa-1" aria-hidden="true" style="margin-right:10px;"></i>\n                    {{T(\'INSPECTOR.texture_compress.etc2_warning\')}}  \n                </div>\n            </div>\n        </div>\n    </div>\n    ',
  props: {
    target: { twoWay: true, type: Object },
    settings: { twoWay: true, type: Object },
    platform: { type: String },
  },
  data: function () {
    return {
      selectValue: "none",
      formats: [],
      supportFormats: {
        png: "PNG",
        jpg: "JPG",
        webp: "Webp",
        pvrtc_4bits: "PVRTC 4bits RGBA",
        pvrtc_4bits_rgb: "PVRTC 4bits RGB",
        pvrtc_4bits_rgb_a: "PVRTC 4bits RGB Separate A",
        pvrtc_2bits: "PVRTC 2bits RGBA",
        pvrtc_2bits_rgb: "PVRTC 2bits RGB",
        pvrtc_2bits_rgb_a: "PVRTC 2bits RGB Separate A",
        etc1: "Etc1 RGB Separate A",
        etc1_rgb: "Etc1 RGB",
        etc2: "Etc2 RGBA",
        etc2_rgb: "Etc2 RGB",
      },
    };
  },
  watch: {
    settings() {
      this.formats = this.settings[this.platform]
        ? this.settings[this.platform].formats
        : [];
    },
  },
  compiled() {
    this.formats = this.settings[this.platform]
      ? this.settings[this.platform].formats
      : [];
  },
  computed: {
    platformSupportedFormats() {
      let t = {};
      for (let n in this.supportFormats) if (this.supportFormat(n)) {
        t[n] = this.supportFormats[n];
      }
      return t;
    },
  },
  methods: {
    getPath(t, n) {
      return `target.platformSettings.${this.platform}.formats.${t}.${n}`;
    },
    onSelectFormat(t) {
      if ("none" === this.selectValue) {
        return;
      }
      let n = this.settings[this.platform];

      if (!n) {
        n = this.settings[this.platform] = { formats: [] };
        this.formats = n.formats;
      }

      let a = n.formats.find((t) =>
        this.selectValue.startsWith("etc")
          ? t.name.startsWith("etc")
          : this.selectValue.startsWith("pvr")
          ? t.name.startsWith("pvr")
          : t.name === this.selectValue
      );
      if (a) {
        Editor.warn("Already adds a same format.");
        return;
      }

      a = {
        name: this.selectValue,
        quality: this.defaultQuality(this.selectValue),
      };

      this.formats.push(a);

      Editor.UI._DomUtils.fire(t.currentTarget, "change", {
        bubbles: true,
        detail: { path: "target.platformSettings", value: this.settings },
      });

      setTimeout(() => {
        this.selectValue = "none";
      }, 0);
    },
    _openExternal(t, n) {
      t.stopPropagation();
      require("electron").shell.openExternal(n);
    },
    T: (t) => Editor.T(t),
    isPVRFormat: (t) => t.startsWith("pvrtc_"),
    isETC2Format: (t) => t.startsWith("etc2"),
    isETCFormat: (t) => t.startsWith("etc1") || t.startsWith("etc2"),
    defaultQuality(t) {
      return this.isPVRFormat(t) ? "normal" : this.isETCFormat(t) ? "fast" : 80;
    },
    deleteFormat(t, n) {
      let a = this.settings[this.platform].formats.findIndex(
        (t) => t.name === n.name
      );

      if (-1 !== a) {
        this.formats.splice(a, 1);

        Editor.UI._DomUtils.fire(t.currentTarget, "change", {
          bubbles: true,
          detail: { path: "target.platformSettings", value: this.settings },
        });
      }
    },
    supportFormat(t) {
      return (
        ("pvrtc" !== (t = t.split("_")[0]) ||
          ("android" !== this.platform && "default" !== this.platform)) &&
        ("etc1" !== t ||
          ("ios" !== this.platform && "default" !== this.platform)) &&
        ("etc2" !== t || "android" === this.platform || "ios" === this.platform)
      );
    },
  },
});

Vue.component("texture-compress", {
  template:
    '\n    <style>\n        .compress-option {\n            margin-top: 15px;\n            margin-bottom: 10px;\n            margin-left: 10px;\n            background-color: rgba(105, 105, 105, 0.45);\n        }\n\n        .compress-option ui-prop {\n            margin-right: 10px;\n        }\n\n        .compress-tab {\n            display: flex;\n            flex: 1;\n            flex-direction: row;\n            border-bottom: rgba(43, 40, 40, 0.52) solid 2px;\n        }\n\n        .compress-tab span {\n            flex: 1;\n            text-align: center;\n            padding: 10px 0px;\n        }\n\n        .compress-tab span.icon {\n            font-size: 15px;\n        }\n\n        .compress-tab span.active {\n            background-color: black;\n        }\n    </style>\n\n    <div class="compress-option">\n        <div class="compress-tab flex layout row flex-1">\n            <span \n                @click="changePlatform(\'default\')"    \n                :class="activeClass(\'default\')"                         \n            >\n                Default\n            </span>\n            <span \n                @click="changePlatform(\'android\')"    \n                :class="activeClass(\'android\')"\n                title="Android"\n            >\n                Android\n            </span>\n            <span \n                @click="changePlatform(\'ios\')"        \n                :class="activeClass(\'ios\')"     \n                title="iOS"\n            >\n                iOS\n            </span>\n            <span \n                @click="changePlatform(\'web\')"        \n                :class="activeClass(\'web\')"\n                title="Web"\n            >\n                Web\n            </span>\n            <span \n                @click="changePlatform(\'minigame\')"\n                :class="activeClass(\'minigame\')"\n                title="Mini Game"\n            >\n                Mini Game\n            </span>\n        </div>\n        <div v-for="platform in platforms" :class="\'compress-\' + platform">\n            <texture-format :target.sync="target" :platform="platform" :settings.sync="target.platformSettings" v-if="currentPlatform === platform"/>\n        </div>\n    </div>\n    ',
  props: { target: { twoWay: true, type: Object } },
  data: function () {
    return {
      currentPlatform:
        this.$parent.$options.profiles.project.get("current-platform"),
      platforms: ["default", "android", "ios", "minigame", "web"],
    };
  },
  methods: {
    changePlatform(t) {
      this.currentPlatform = t;
      this.$parent.$options.profiles.project.set("current-platform", t);
    },
    activeClass(t) {
      return this.currentPlatform === t ? "active" : "";
    },
    isPVRTC: (t) => -1 !== t.indexOf("pvrtc_"),
  },
});
