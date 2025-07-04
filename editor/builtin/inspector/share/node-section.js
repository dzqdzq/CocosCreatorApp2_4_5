"use strict";
Vue.component("cc-node-section", {
  template:
    '\n    <ui-section>\n      <div slot="header" class="header flex-1 layout horizontal center-center" >\n        <span @dragstart="dragstart" @dragend="dragend" draggable="true">Node</span>\n        <span class="flex-1"></span>\n        <ui-button v-el:dropdown class="tiny transparent"\n          title=""\n          @click="menuClick">\n          <i class="fa fa-cog"></i>\n        </ui-button>\n      </div>\n\n      <ui-prop name="Position" :type="is3D() ? \'cc.Vec3\' : \'cc.Vec2\'" step="1"\n        :multi-values="multi"\n        v-value="target.position.value"\n        v-values="target.position.values"\n        v-readonly="target.position.readonly"\n        tooltip="{{T(\'INSPECTOR.node.position\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Rotation" type="number" step="1" v-if="!is3D()"\n        :multi-values="multi"\n        v-value="target.angle.value"\n        v-values="target.angle.values"\n        v-readonly="target.angle.readonly"\n        tooltip="{{T(\'INSPECTOR.node.rotation\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Rotation" type="cc.Vec3" v-if="is3D()"\n        :multi-values="multi"\n        v-value="target.eulerAngles.value"\n        v-values="target.eulerAngles.values"\n        v-readonly="target.eulerAngles.readonly"\n        tooltip="{{T(\'INSPECTOR.node.rotation\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Scale" :type="is3D() ? \'cc.Vec3\' : \'cc.Vec2\'" step="0.1"\n        :multi-values="multi"\n        v-value="target.scale.value"\n        v-values="target.scale.values"\n        v-readonly="target.scale.readonly"\n        tooltip="{{T(\'INSPECTOR.node.scale\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Anchor" type="cc.Vec2" step="0.1"\n        :multi-values="multi"\n        v-value="target.anchor.value"\n        v-values="target.anchor.values"\n        v-readonly="target.anchor.readonly"\n        tooltip="{{T(\'INSPECTOR.node.anchor\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Size" type="cc.Size" step="1"\n        :multi-values="multi"\n        v-value="target.size.value"\n        v-values="target.size.values"\n        v-readonly="target.size.readonly"\n        tooltip="{{T(\'INSPECTOR.node.size\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Color" type="cc.Color"\n        :multi-values="multi"\n        v-value="target.color.value"\n        v-values="target.color.values"\n        v-readonly="target.color.readonly"\n        tooltip="{{T(\'INSPECTOR.node.color\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Opacity" type="number" min="0" max="255" step="1"\n        :multi-values="multi"\n        v-value="target.opacity.value"\n        v-values="target.opacity.values"\n        v-readonly="target.opacity.readonly"\n        tooltip="{{T(\'INSPECTOR.node.opacity\')}}"\n      ></ui-prop>\n\n      <ui-prop name="Skew" type="cc.Vec2" step="1"\n        :multi-values="multi"\n        v-value="target.skew.value"\n        v-values="target.skew.values"\n        v-readonly="target.skew.readonly"\n      ></ui-prop>\n\n      <ui-prop name="Group" tooltip="{{T(\'INSPECTOR.node.group\')}}">\n        <ui-select class="flex-1"\n          :multi-values="_updateGroupMultiValues(target.group)"\n          v-value="target.group.value"\n          v-values="target.group.values"\n          v-readonly="target.group.readonly"\n          v-on:change="_groupChanged(target.group.value)"\n        >\n          <option v-for="g in groupList" value="{{g}}">{{g}}</option>\n        </ui-select>\n        <ui-button class="tiny blue" @confirm="openGroupSettings">\n          {{T(\'COMPONENT.sprite.edit_button\')}}\n        </ui-button>\n      </ui-prop>\n    </ui-section>\n\n    <cc-comp-section\n      v-for="comp in target.__comps__"\n      :name.sync="comp.__displayName__"\n      :editor.sync="comp.__editor__"\n      :target.sync="comp.value"\n      :multi="multi"\n      :index="$index"\n      :count="target.__comps__.length"\n    >\n    </cc-comp-section>\n  ',
  props: {
    target: { twoWay: true, type: Object },
    multi: { twoWay: false, type: Boolean },
  },
  data: () => ({ groupList: [] }),
  methods: {
    T: Editor.T,
    _groupChanged(e) {
      Editor.Ipc.sendToPanel(
        "scene",
        "scene:set-group-sync",
        this.target.uuid,
        e
      );
    },
    openGroupSettings() {
      Editor.Ipc.sendToMain("project-settings:open", { tab: 0 });
    },
    menuClick(e) {
      e.stopPropagation();

      if (this._requestID) {
        Editor.Ipc.cancelRequest(this._requestID);
        this._requestID = null;
      }

      this._requestID = Editor.Ipc.sendToPanel(
          "scene",
          "scene:has-copied-component",
          (e, t) => {
            let n = this.$els.dropdown.getBoundingClientRect();
            Editor.Ipc.sendToPackage("inspector", "popup-node-inspector-menu", {
              uuids: this.target.uuids,
              hasCopyComp: t,
              x: n.left,
              y: n.bottom + 5,
            });
          },
          -1
        );
    },
    dragstart(e) {
      e.stopPropagation();

      Editor.UI.DragDrop.start(e.dataTransfer, {
        buildImage: true,
        effect: "copyMove",
        type: "node",
        items: [{ id: this.target.uuid, name: this.target.name.value }],
      });
    },
    dragend() {
      Editor.UI.DragDrop.end();
    },
    _updateGroupMultiValues(e) {
      if (!e || e.values.length <= 1) {
        return false;
      }
      var t = e.values[0];
      return !e.values.every((e) => e == t);
    },
    _onProfileChanged() {
      this.groupList = this.profile.get("group-list");
    },
    is3D() {
      return "cc.Vec3" === this.target.position.type;
    },
  },
  compiled() {
    let e = Editor.Profile.load("project://project.json");
    this.profile = e;
    this.groupList = e.get("group-list");
    e.on("changed", this._onProfileChanged);
  },
  destroyed() {
    if (this.profile) {
      this.profile.removeListener("changed", this._onProfileChanged);
    }
  },
});
