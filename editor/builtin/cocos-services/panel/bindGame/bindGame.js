"use strict";module.exports = {init(){
  var e=require("fs");
  let s = Editor.require("packages://cocos-services/panel/bindGame/selectGame/selectGame.js");
  let i = Editor.require("packages://cocos-services/panel/backHome/backHome.js");
  let t = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  let o = Editor.require("packages://cocos-services/panel/utils/utils.js");
  s.init();
  i.init();

  if (t.devmode) {
    console.log(`bind-game ${o.t("reg_component")}`);
  }

  Vue.component("bind-game",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/bindGame/bindGame.html"),"utf-8"),created(){
    this.islogin = t.getUserIsLogin();

    if (this.islogin) {
      this.computeGame();
    }
  },data(){return{games:{personGame:{type:o.t("person_game"),lists:[]},companyGame:{type:o.t("company_game"),lists:[]}},isLogin:this.islogin}},props:{islogin:{type:Boolean}},methods:{utils_t:function(e,...s){return o.t(e,...s)},backHome:function(){this.$emit("back-home")},bindGameLogic:function(e){this.$emit("bind-game",e)},refreshGame:function(){
    this.computeGame();
    this.isLogin = false;
    this.$nextTick(()=>this.isLogin=true);
  },computeGame:function(){var e=t.getGameLists();for (var s of (this.games.personGame.lists=[], this.games.companyGame.lists=[], e.data)) if (0===s.corporation_id) {
    this.games.personGame.lists.push(s);
  } else {
    this.games.companyGame.lists.push(s);
  }}}});
}};