"use strict";module.exports = {init(){
  var e = require("fs");
  var t = Editor.require("packages://cocos-services/panel/utils/utils.js");
  let i=Editor.require("packages://cocos-services/panel/utils/ccServices.js");

  if (i.devmode) {
    console.log(`service-item ${t.t("reg_component")}`);
  }

  Vue.component("service-item",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/serviceList/serviceItem/serviceItem.html"),"utf-8"),props:{service:{type:Object}},data(){return {title:this.service.service_title,hasGroup:""!==this.service.service_group,hasUpdate:false,hintStyle:{display:"none",position:"absolute",top:"300px",left:"40px","box-shadow":"0px 8px 16px 0px rgba(0,0,0,2)",padding:"12px, 16px"},headerStyle:{display:"flex","justify-content":"space-between",padding:"8px"},contentStyle:{padding:"0px 5px 8px 10px","font-size":"12px",color:"#7F7F7F"},imgStyle:{height:"24px",width:"24px","margin-top":"1px","-webkit-filter":this.service.enable?"none":"grayscale(100%)",filter:this.service.enable?"none":"grayscale(100%)"},titleStyle:{color:"#BDBDBD",width:"calc(100% - 40px)","font-size":"18px","margin-left":"4px","margin-top":"2px","text-overflow":"ellipsis",overflow:"hidden","white-space":"nowrap"}};},created(){
    this.clactureVersion();

    if (this.hasGroup) {
      this.headerStyle.padding = "8px 2px";
      this.contentStyle.padding = "0px 5px 8px 5px";
    }
  },methods:{getRealPath:function(e){return Editor.url("packages://cocos-services/panel/assets/")+e},clactureVersion:function(){
    var e = i.readServiceVersionByURL(this.service.package_download_url);
    var t = i.readServicePackageInfo(this.service.service_component_name).version;
    this.hasUpdate = i.compareVersion(e,t);
  },utils_t:function(e,...i){return t.t(e,...i)},setItemHover:function(e){this.titleStyle.color = this.service.hovered&&e?"white":"#BDBDBD";},enter:function(e){
    this.hintStyle.top = e.target.getBoundingClientRect().top-(window._Scene?100:60);
    this.hintStyle.display = "block";
  },leave:function(e){this.hintStyle.display = "none";}}});
}};