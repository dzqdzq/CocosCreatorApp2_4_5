(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/mount.png"\n      ></cc-meta-header>\n\n      <div class="props">\n        <div class="layout horizontal center">\n          <span class="flex-1">{{ url }}</span>\n          <ui-button class="blue tiny" @confirm="explore">\n            <i class="fa fa-folder-open"></i>\n          </ui-button>\n        </div>\n      </div>\n    ',
    ready() {
      if (this.target) {
        Editor.assetdb.queryUrlByUuid(this.target.uuid, (e, t) => {
          this.url = t;
        });
      }
    },
    data: { url: "" },
    methods: {
      explore() {
        Editor.assetdb.explore(this.url);
      },
    },
  });
})();
