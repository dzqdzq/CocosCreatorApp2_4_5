"use strict";var e=require("fs");module.exports = {init(){
  let t=Editor.require("packages://cocos-services/panel/utils/utils.js");

  if (ccServices.devmode) {
    console.log(`confirm ${t.t("reg_component")}`);
  }

  Vue.component("confirm",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/confirm/confirm.html"),"utf-8"),props:{message:{type:String,default:"message"},okbtnstring:{type:String,default:"OK"},cancelbtnstring:{type:String,default:"Cancel"}},methods:{okBtnClick:function(){this.$emit("confirm-result",true)},cancelBtnClick:function(){this.$emit("confirm-result",false)}}});
}};