const e=require("fire-fs");require("fire-path");let t=Editor.Profile.load("global://settings.json").get("rendering-settings");
t = t||{};
let s=function(e){return new window.Vue({el:e,data:{showSettings:false,mesh:{showWireFrame:false,showNormal:false}},watch:{showSettings(){}},methods:{_meshSettingsChanged(){
  cc.macro.SHOW_MESH_WIREFRAME = this.mesh.showWireFrame;
  cc.macro.SHOW_MESH_NORMAL = this.mesh.showNormal;
  cc.engine.repaintInEditMode();
}}});};

window.customElements.define("rendering-settings",class extends window.HTMLElement{constructor(){
  super();
  this.attachShadow({mode:"open"});
  let t=e.readFileSync(__dirname+"/rendering-settings.html","utf8");
  this.shadowRoot.innerHTML = t;
  this._vm = s(this.shadowRoot);
}});

module.exports = {};