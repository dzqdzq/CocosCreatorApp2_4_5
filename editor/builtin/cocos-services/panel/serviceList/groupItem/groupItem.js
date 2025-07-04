"use strict";module.exports = {init(){
  var e = require("fs");
  var i = Editor.require("packages://cocos-services/panel/utils/utils.js");

  if (Editor.require("packages://cocos-services/panel/utils/ccServices.js").devmode) {
    console.log(`group-item ${i.t("reg_component")}`);
  }

  Vue.component("group-item",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/serviceList/groupItem/groupItem.html"),"utf-8"),props:{group:{type:Object}},data(){return {title:this.group.name,isActive:false,group_icon:this.group.services[0].service_icon,hasUpdate:false,isHover:true,hideTips:"",imgStyle:{height:"24px",width:"24px","margin-top":"1px","-webkit-filter":this.group.services.filter(e=>e.enable).length>0?"grayscale(0%)":"grayscale(100%)"}};},created(){this.hideTips = this.utils_t("service_item_fold").replace("${name}",this.group.services[0].service_name).replace("${count}",this.group.services.length);},methods:{utils_t:function(e,...t){return i.t(e,...t)},handleServiceItemClick:function(e){for (let i of this.group.services) if (e===i.service_id) {
    this.$emit("service-item-click",i);
  }}}});
}};