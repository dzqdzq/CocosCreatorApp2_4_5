(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n        <cc-meta-header id="header"\n          :target="target"\n          icon="unpack://static/icon/assets/physics-material.png"\n        ></cc-meta-header>\n  \n        <div class="props flex-1">\n          <ui-prop name="Friction" type="number" v-value="target.friction"></ui-prop>\n          <ui-prop name="Restitution" type="number" v-value="target.restitution"></ui-prop>\n        </div>\n      ',
  });
})();
