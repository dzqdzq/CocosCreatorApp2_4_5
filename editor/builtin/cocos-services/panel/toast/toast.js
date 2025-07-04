"use strict";module.exports = {init(){
  let t=Editor.require("packages://cocos-services/panel/utils/utils.js");

  if (Editor.require("packages://cocos-services/panel/utils/ccServices.js").devmode) {
    console.log(`toast ${t.t("reg_component")}`);
  }

  Vue.component("toast",{template:'\n            <div style="background: rgba(0,0,0,0.6); position: absolute; width: 100%; height: 100%; z-index: 100;">\n              <div style = "height: 200px; position: absolute; width: 200px; top: 0; left: 0; bottom: 0; right: 0; background-color: rgb(35,59,92); margin: auto; border:3px solid rgba(20,54,125,0.8); border-radius: 6px;" > \n                <img :src="getRealPath()" style="height: 56px; width: 56px; position: absolute; left: 72px; right: 72px; top: 32px;"/> <br>\n                <div style="height: 90px; width: 180px; position: absolute; left: 10px; right: 10px; top: 100px; text-align: center; display: flex; justify-content: center; flex-direction: column;">\n                  {{ message }}\n                </div>\n               </div>\n            </div>\n            ',props:{visible:{type:Boolean,default:false},message:{type:String,default:"tips"},status:{default:2}},methods:{getRealPath:function(){var t=Editor.url("packages://cocos-services/panel/assets/");return 1===this.status?t+"tipSuccess.png":2===this.status?t+"tipWarn.png":3===this.status?t+"tipError.png":t+"tipSuccess.png"}}});
}};