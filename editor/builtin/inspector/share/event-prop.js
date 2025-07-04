"use strict";
Vue.component("cc-event-prop", {
  template:
    '\n    <ui-prop\n      :name="target.name"\n      :indent="indent"\n      :tooltip="target.attrs.tooltip"\n      style="padding-top: 8px;"\n      auto-height\n    >\n      <div class="layout vertical flex-1">\n        <div class="layout horizontal">\n          <ui-node class="flex-1" v-value="target.value.target.value.uuid"></ui-node>\n          <ui-select class="flex-1" v-value="target.value._componentName.value">\n            <option v-for="item in components" :value="item">\n              {{item}}\n            </option>\n          </ui-select>\n          <ui-select class="flex-1" v-value="target.value.handler.value">\n            <option v-for="item in handlers" :value="item">\n              {{item}}\n            </option>\n          </ui-select>\n        </div>\n        <div class="layout horizontal" style="padding-top: 8px;">\n          <div class="label" style="white-space:nowrap;padding-right:10px;padding-top:2px;">\n          CustomEventData\n          </div>\n          <ui-input class="flex-1" v-value="target.value.customEventData.value"></ui-input>\n        </div>\n    </div>\n    </ui-prop>\n  ',
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
  data: () => ({ components: [], handlers: [] }),
  watch: {
    "target.value.target.value.uuid": "_updateDump",
    "target.value._componentName.value": "_updateHandlers",
  },
  compiled() {
    this._updateDump();
  },
  methods: {
    _updateDump() {
      if (this._requestID) {
        Editor.Ipc.cancelRequest(this._requestID);
        this._requestID = null;
      }

      this._dump = null;
      let e = this.target.value.target.value.uuid;

      this._requestID = Editor.Ipc.sendToPanel(
        "scene",
        "scene:query-node-functions",
        e,
        (e, t) => {
          this._dump = t;
          this._requestID = null;
          this._updateComponents();
          this._updateHandlers();
        },
        -1
      );
    },
    _updateComponents() {
      if (!this._dump) {
        this.components = [];
        return;
      }
      this.components = Object.keys(this._dump);
    },
    _updateHandlers() {
      if (!this._dump) {
        this.handlers = [];
        return;
      }
      let e = this._dump[this.target.value._componentName.value];

      if (e) {
        e.sort(function (e, t) {
          return e.localeCompare(t);
        });
      }

      this.handlers = e || [];
    },
  },
});
