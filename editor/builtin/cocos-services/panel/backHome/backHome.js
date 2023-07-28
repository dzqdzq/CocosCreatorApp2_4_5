"use strict";module.exports = {init(){
  var e=require("fs");
  let o = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  let t = Editor.require("packages://cocos-services/panel/utils/utils.js");

  if (o.devmode) {
    console.log(`back-home ${t.t("reg_component")}`);
  }

  Vue.component("back-home",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/backHome/backHome.html"),"utf-8"),props:{showToLink:{type:Boolean,default:false}},methods:{utils_t:function(e,...o){return t.t(e,...o)},handleBackHomeLogic:function(){this.$emit("back-home")},handleGotoLinkLogic:function(){
    var e = o.getGame().data;
    var c = o.getUrl("enable_service",{app_id:e.app_id,target:e.corporation_id});
    t.openUrlWithDefaultExplorer(c);

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.gotoServiceCenter();
    }
  }}});
}};