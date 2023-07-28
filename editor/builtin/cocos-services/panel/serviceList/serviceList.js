"use strict";module.exports = {init(){
  var e=require("fs");
  let i = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  let s = Editor.require("packages://cocos-services/panel/utils/utils.js");
  let t = Editor.require("packages://cocos-services/panel/serviceList/serviceItem/serviceItem.js");
  let o = Editor.require("packages://cocos-services/panel/serviceList/groupItem/groupItem.js");
  t.init();
  o.init();

  if (i.devmode) {
    console.log(`service-list ${s.t("reg_component")}`);
  }

  Vue.component("service-list",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/serviceList/serviceList.html"),"utf-8"),props:{game:{type:Object,default:()=>({name:s.t("unknow_game"),appid:"UNKNOW"})},services:{type:Array},iscompanygame:{type:Boolean}},data:()=>({devmode:false,menuStyle:{display:"none",position:"absolute",background:"#f9f9f9","min-width":"140px","min-height":"40px",top:"20px",left:"0px","box-shadow":"0px 8px 16px 0px rgba(0,0,0,2)",padding:"12px, 16px","border-radius":"2px"}}),computed:{groups(){var e=[];for(let s of this.services){
    var i;

    if (void 0===s.service_group) {
      s.service_group = "";
    }

    if (""!==s.service_group) {
      (i=this.getGroupByName(e,s.service_group)).services.push(s);

      if (1===i.services.length) {
        e.push(i);
      }
    } else {
      (i={name:"",services:[]}).services.push(s);
      e.push(i);
    }
  }return e},hasBindGame(){return!(null===this.game||"UNKNOW"===this.game.appid)}},created(){this.devmode = i.readDevMode();},methods:{utils_t:function(e,...i){return s.t(e,...i)},getGroupByName:function(e,i){for(var s of e)if (i===s.name) {
    return s;
  }return{name:i,services:[]}},handlePopMenuClick:function(){
    this.menuStyle.display = "none"===this.menuStyle.display?"block":"none";
    setTimeout(()=>this.menuStyle.display="none",5e3);

    if ("block"===this.menuStyle.display&&window.ccServicesAnalytics) {
      window.ccServicesAnalytics.showSettingsMenu();
    }
  },handleEmptyAreaClick:function(){this.menuStyle.display = "none";},handleServiceItemClick:function(e){this.$emit("service-item-click",e)},handleBindGameLogic:function(){this.$emit("bind-game")},handleUnbindGameLogic:function(){this.$emit("unbind-game")},handleSwitchGameLogic:function(){this.$emit("bind-game")},handleGotoAccountCenterLogic:function(){
    var e=i.getUrl("dashboard");
    s.openUrlWithDefaultExplorer(e);

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.gotoAccountCenter();
    }
  },exitDevMode:function(){
    i.writeDevMode(false);
    s.printToCreatorConsole("warn",this.utils_t("exit_devmode_tips"));

    if ("function"==typeof window.CocosServices.showTips&&window.CocosServices.showTips) {
      window.CocosServices.showTips(2,this.utils_t("exit_devmode_tips"),-1);
    }
  }}});
}};