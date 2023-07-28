"use strict";module.exports = {init(){
  var e=require("fs");
  let t = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  let i = Editor.require("packages://cocos-services/panel/utils/utils.js");

  if (t.devmode) {
    console.log(`select-game ${i.t("reg_component")}`);
  }

  Vue.component("select-game",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/bindGame/selectGame/selectGame.html"),"utf-8"),props:{games:{type:Object}},data:()=>({game:{name:i.t("unknow_game"),appid:"UNKNOW"},index:-1,isRefreshData:false,defaultSelected:""}),created(){this.defaultSelected = this.utils_t("select_game_please");},methods:{utils_t:function(e,...t){return i.t(e,...t)},handleGotoLinkLogic:function(){
    var e=t.getUrl("create");
    i.openUrlWithDefaultExplorer(e);

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.ctrateGame();
    }
  },handleBindGameLogic:async function(){
    if (this.index>0) {
      this.$emit("bind-game",this.game);
      await t.getGameDetail(this.game.appid);
    } else {
      if (0===Editor.Dialog.messageBox({title:this.utils_t("dialog_title"),message:this.utils_t("create_game_tips"),buttons:[this.utils_t("btn_create"),this.utils_t("btn_know")],defaultId:0,cancelId:1,noLink:true})) {
        this.handleGotoLinkLogic();
      }
    }
  },handleRefreshGameLogic:async function(){
    this.isRefreshData = true;
    await t.getGameList();

    setTimeout(()=>{
      this.isRefreshData = false;
      this.$emit("refresh-game");
    },1e3);
  },selectChange:function(e){
    var t=e.detail.value.split("-");
    this.game.appid = t[0];
    this.game.cid = t[1];
    this.game.name = e.detail.text;
    this.index = e.detail.index;
  }}});
}};