(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/animation-clip.png"\n      ></cc-meta-header>\n\n      <div class="props flex-1" v-if="isSkeletonAnimationClip">\n        <ui-prop readonly :name="T(\'INSPECTOR.animation_clip.maxFrameCount\')" type="number" \n          v-value="target.maxFrameCount"\n          v-values="target.multiValues.maxFrameCount"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop readonly :name="T(\'INSPECTOR.animation_clip.totalFrameCount\')" type="number" \n          v-value="target.totalFrameCount"\n          v-values="target.multiValues.totalFrameCount"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop readonly :name="T(\'INSPECTOR.animation_clip.duration\')" type="number" \n          v-value="target.duration"\n          v-values="target.multiValues.duration"\n          :multi-values="multi"\n        ></ui-prop>\n      </div>\n    ',
    computed: {
      isSkeletonAnimationClip() {
        return "skeleton-animation-clip" === this.target.__assetType__;
      },
    },
  });
})();
