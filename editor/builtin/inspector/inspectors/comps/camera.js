"use strict";Vue.component("cc-camera",{template:'\n    <style>\n      #checkboxes div ui-checkbox {\n        margin-top: 1px;\n      }\n      #checkboxes div:first-child ui-checkbox {\n        margin-top: 0;\n      }\n    </style>\n\n    <ui-prop\n      v-prop="target.backgroundColor"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-prop="target.depth"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      name="cullingMask"\n      :multi-values="multi"\n      auto-height\n      tooltip="{{T(\'COMPONENT.camera.cullingMask\')}}"\n    >\n      <div id="checkboxes" class="layout vertical">\n        <ui-checkbox :value="_everythingMask(index)" @change="_everythingMaskChanged($event, index)">\n          Everything\n        </ui-checkbox>\n        <div v-for="(index, group) in groupList">\n          <ui-checkbox :value="_cullingMask(index)" @change="_cullingMaskChanged($event, index)">\n            {{group}}\n          </ui-checkbox>\n        </div>\n      </div>\n    </ui-prop>\n\n    <ui-prop\n      name="clearFlags"\n      :multi-values="multi"\n      auto-height\n      tooltip="{{T(\'COMPONENT.camera.clearFlags\')}}"\n    >\n      <div id="checkboxes" class="layout vertical">\n        <div v-for="(index, name) in clearFlags">\n          <ui-checkbox :value="_clearFlags(index)" @change="clearFlagsChanged($event, index)">\n            {{name}}\n          </ui-checkbox>\n        </div>\n      </div>\n    </ui-prop>\n\n    <ui-prop\n      v-prop="target.rect"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-prop="target.zoomRatio"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-if = "is3DCamera()"\n      name="renderStages"\n      :multi-values="multi"\n      auto-height\n      tooltip="{{T(\'COMPONENT.camera.renderStages\')}}"\n    >\n      <div id="checkboxes" class="layout vertical">\n        <div v-for="(index, name) in renderStages">\n          <ui-checkbox :value="_renderStages(index)" @change="renderStagesChanged($event, index)">\n            {{name}}\n          </ui-checkbox>\n        </div>\n      </div>\n    </ui-prop>\n \n    <ui-prop\n      v-if = "is3DCamera()"\n      v-prop="target.nearClip"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-if = "is3DCamera()"\n      v-prop="target.farClip"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-prop="target.alignWithScreen"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-if = "is3DCamera()"\n      v-prop="target.ortho"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-if="!isOrtho(target) && is3DCamera() && !alignWithScreen()"\n      v-prop="target.fov"\n      :multi-values="multi"\n    ></ui-prop>\n\n    <ui-prop\n      v-if="isOrtho(target) && !alignWithScreen()"\n      v-prop="target.orthoSize"\n      :multi-values="multi"\n    ></ui-prop>\n  ',props:{target:{twoWay:true,type:Object},multi:{type:Boolean}},data:()=>({groupList:[],clearFlags:["Color","Depth","Stencil"],renderStages:["Opaque","Transparent"]}),methods:{T:Editor.T,is3DCamera(){return this.target._is3D.value},alignWithScreen(){return this.target.alignWithScreen.value},isOrtho:e=>e.ortho.value,_setProperty(e,t){
  var n={id:this.target.uuid.value,path:t,type:"Number",isSubProp:false,value:e};
  Editor.Ipc.sendToPanel("scene","scene:set-property",n);
  Editor.Ipc.sendToPanel("scene","scene:undo-commit");
},_onProfileChanged(){this.groupList = this.profile.get("group-list");},_cullingMask(e){return!!(this.target.cullingMask.value&1<<e)},_cullingMaskChanged(e,t){
  let n = this.target.cullingMask.value;
  let r = 0;
  for (let i=0,a=32; i<a; i++) {
    r += i!==t?n&1<<i:e.currentTarget.value?1<<t:0;
  }
  this.target.cullingMask.value = r;
  this._setProperty(r,"cullingMask");
},_everythingMask(){let e=this.target.cullingMask.value;for (let t=0,n=this.groupList.length; t<n; t++) {
  if (!(e&1<<t)) {
    return false;
  }
}return true;},_everythingMaskChanged(e){
  let t=0;

  if (e.currentTarget.value) {
    t = 4294967295;
  }

  this.target.cullingMask.value = t;
  this._setProperty(t,"cullingMask");
},_clearFlags(e){return!!(this.target.clearFlags.value&1<<e)},clearFlagsChanged(e,t){
  let n = this.target.clearFlags.value;
  let r = 0;
  for (let i=0,a=this.clearFlags.length; i<a; i++) {
    r += i!==t?n&1<<i:e.currentTarget.value?1<<t:0;
  }
  this.target.clearFlags.value = r;
  this._setProperty(r,"clearFlags");
},_renderStages(e){return!!(this.target.renderStages.value&1<<e)},renderStagesChanged(e,t){
  let n = this.target.renderStages.value;
  let r = 0;
  for (let i=0,a=this.renderStages.length; i<a; i++) {
    r += i!==t?n&1<<i:e.currentTarget.value?1<<t:0;
  }
  this.target.renderStages.value = r;
  this._setProperty(r,"renderStages");
}},compiled(){
  let e=Editor.Profile.load("project://project.json");
  this.profile = e;
  this.groupList = e.get("group-list");
  e.on("changed",this._onProfileChanged);
},destroyed(){
  if (this.profile) {
    this.profile.removeListener("changed",this._onProfileChanged);
  }
}});