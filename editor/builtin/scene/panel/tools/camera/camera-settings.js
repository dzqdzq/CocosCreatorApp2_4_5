const e = require("fire-fs");
const t = (require("fire-path"), Editor.Profile.load("global://settings.json"));
let s;
let a = t.get("camera-settings");
(a=a||{})._3d = Object.assign({speed:1,farClip:4096,nearClip:.1},a._3d);
a._2d = Object.assign({speed:1,farClip:2046,nearClip:1},a._2d);
let n=function(e){return new window.Vue({el:e,data:{showSettings:false,camera3D:a._3d,camera2D:a._2d},watch:{showSettings(){}},methods:{_SettingsChanged(){
  t.set("camera-settings",a);
  t.save();
  s.updateCameraSettings();
}}});};

window.customElements.define("camera-settings",class extends window.HTMLElement{constructor(){
  super();
  this.attachShadow({mode:"open"});
  let t=e.readFileSync(__dirname+"/camera-settings.html","utf8");
  this.shadowRoot.innerHTML = t;
  this._vm = n(this.shadowRoot);
}});

module.exports = {onCameraInited(e){
  (s=e)._operating3D.settings = a._3d;
  s._operating2D.settings = a._2d;
}};