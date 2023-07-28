"use strict";module.exports = {init(){
  var e = require("fs");
  var i = Editor.require("packages://cocos-services/panel/utils/utils.js");
  var t = Editor.require("packages://cocos-services/panel/utils/serviceConfig.js");
  let s=Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  Editor.require("packages://cocos-services/panel/confirm/confirm.js").init();

  if (s.devmode) {
    console.log(`service-detail ${i.t("reg_component")}`);
  }

  Vue.component("service-detail",{template:e.readFileSync(Editor.url("packages://cocos-services/panel/serviceDetail/serviceDetail.html"),"utf-8"),data(){return {refresh:true,componentName:"",isDownloadServicePackage:false,downloadTip:i.t("installing"),isOpenService:false,openServiceTip:i.t("opening_service"),confirmProtocol:false,params:{},enable:this.service.enable,serviceVersion:"",upgrade:"",service_price:this.service.service_price,hasUpdate:false,showUpdate:false,jumpUpdate:false,enableButton:false,defaultSelected:this.utils_t("select_version_please"),enableHistory:false,sty:{display:"block",position:"absolute",top:"20px",bottom:"0px",left:"0px",right:"0px",padding:"10px","padding-top":"20px",background:"rgb(73,73,73)","z-index":"100"},styHint:{display:"none",position:"absolute",top:"300px",left:"10px","box-shadow":"0px 8px 16px 0px rgba(0,0,0,2)",padding:"12px, 16px"}};},methods:{utils_t:function(e,...t){return i.t(e,...t)},getRealPath:function(e){return Editor.url("packages://cocos-services/panel/assets/")+e},backHome:function(){
    if (this.showUpdate) {
      this.showUpdate = false;
      this.serviceVersion = s.readServicePackageInfo(this.componentName).version;
    } else {
      this.$emit("back-home");
    }
  },handleSaveParamLogic:function(e,i=true){
    this.params = e;
    this.params.plugin_version = this.serviceVersion;
    t.writeServiceParam(this.service.service_id,e);

    if (i&&window.ccServicesAnalytics) {
      window.ccServicesAnalytics.saveParameter();
    }
  },handleEnabelServiceLogic:async function(e){
    e.target.checked = false;

    if (this.enable) {
      this.disableService();
    } else {
      if (this.checkedServiceOnServer()) {
        this.enableService();
      } else {
        this.confirmProtocol = true;
      }
    }

    e.target.checked = this.enable;
  },sendToMain:function(e){Editor.Ipc.sendToMain("cocos-services:execH5Script",{service:this.service,params:this.params,enable:e},()=>{},-1)},selectChange:async function(e){
    var i=e.detail.value;

    if (i===this.utils_t("select_version_please")) {
      this.enableButton = false;
    } else {
      if (i===this.serviceVersion) {
        this.enableButton = false;
      } else {
        this.enableButton = true;
      }
    }

    this.upgrade = (await s.getServiceVersionDesc(this.service.service_id,i)).data.package_version_desc;
  },clactureVersion:function(){
    var e=s.readServiceVersionByURL(this.service.package_download_url);
    this.hasUpdate = s.compareVersion(e,this.serviceVersion)&&this.checkedServicePackageExixts();

    if (this.hasUpdate) {
      this.hasUpdate = false;
      this.$nextTick(()=>this.hasUpdate=true);
    } else {
      this.hasUpdate = true;
      this.$nextTick(()=>this.hasUpdate=false);
    }

    this.upgrade = this.service.package_version_desc;

    if (this.params.plugin_version&&this.params.plugin_version!==this.serviceVersion) {
      i.printToCreatorConsole("warn",this.service.service_name+" - "+this.utils_t("service_version_warnning"));
    }
  },switchVersion:function(e){
    if (this.defaultSelected!==this.utils_t("select_version_please")&&this.defaultSelected!==this.serviceVersion) {
      this.downloadSpecifyVersion(false);
    }
  },confrimUpdate:function(){this.downloadSpecifyVersion(true)},handleProtocol:function(e){
    this.confirmProtocol = false;

    if (e) {
      this.isOpenService = true;

      s.getUserDataAsync().then(e=>{this.openService(e,e=>{
        if (e) {
          s.getGameDetail(s.getGame().data.app_id);
          this.enableService();
        }
      })});
    }
  },downloadSpecifyVersion:function(e){
    if (0===Editor.Dialog.messageBox({title:this.utils_t("dialog_title"),message:this.utils_t(e?"update_version_tips":"switch_version_tips"),buttons:[this.utils_t("btn_ok"),this.utils_t("btn_cancel")],defaultId:0,cancelId:1,noLink:true})) {
      this.enableHistory = this.enable;
      this.disableService();
      s.CocosServicesUpdate = true;
      s.uninstallServicePackage(this.service.service_component_name);
      this.showUpdate = false;

      this.downloadServicePackage(e=>{
        if (!e) {
          i.printToCreatorConsole("warn",this.utils_t("download_url_empty"));
          return;
        }
        this.hasUpdate = false;
        this.styHint.display = "none";

        if (this.enableHistory) {
          setTimeout(()=>this.enableService(),1e3);
          s.CocosServicesUpdate = false;
        }

        this.clactureVersion();
      },e?null:s.getServicePackageDownloadUrl(this.service.package_download_url,this.defaultSelected));
    }
  },cancelUpdate:function(){
    this.showUpdate = false;
    this.serviceVersion = s.readServicePackageInfo(this.componentName).version;
  },versionClick:function(){
    this.showUpdate = true;
    this.jumpUpdate = false;
    this.upgrade = this.service.package_version_desc;
    this.serviceVersion = s.readServicePackageInfo(this.componentName).version;
  },updateClick:function(){
    this.showUpdate = true;
    this.jumpUpdate = true;
    this.upgrade = this.service.package_version_desc;
    this.serviceVersion = s.readServiceVersionByURL(this.service.package_download_url);
  },handleGotoLinkLogic:function(e){var t;switch(e){case "guide":
    t = this.service.service_guide_url;

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.gotoGuideUrl(t);
    }

    break;case "dev":
    t = this.service.service_dev_url;

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.gotoDashboardUrl(t);
    }

    break;case "sample":
    t = this.service.service_sample_url;

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.gotoSampleUrl(t);
    }}i.openUrlWithDefaultExplorer(t)},checkedServicePackageExixts:function(){var t=i.getCreatorHomePath()+"/services/"+this.service.service_component_name.split("-")[1]+"/pages/index.js";return e.existsSync(t)},checkedServiceOnServer:function(){var e=s.getGame();return"0"===this.service.service_type||e.data.service.indexOf(this.service.service_id)>=0},openService:function(e,t){
    var r="0"!==s.getGame().data.corporation_id;if(0!==this.service.require_verify){
      var c = 1==(1&e.verification_status);
      var a = 2==(2&e.verification_status);
      var n = 4==(4&e.verification_status);
      var o = "";
      var l = "";
      var v = "";
      var d = false;

      if (r) {
        if (1!==this.service.require_verify||e.is_mobile_company) {
          if (2!==this.service.require_verify||a) {
            if (!(3!==this.service.require_verify || n)) {
              o = s.getUrl("company_verify",{corporation_id:e.corporation_id,verifyLevel:1});
              l = this.utils_t("high_verify_tips");
              v = this.utils_t("certificate");
              d = true;
            }
          } else {
            o = s.getUrl("company_verify",{corporation_id:e.corporation_id});
            l = this.utils_t("verify_tips");
            v = this.utils_t("certificate");
            d = true;
          }
        } else {
          o = s.getUrl("company_bind_phone");
          l = this.utils_t("realname_company_tips");
          v = this.utils_t("realname");
          d = true;
        }
      } else {
        if (1!==this.service.require_verify||e.is_mobile) {
          if (!(2!==this.service.require_verify&&3!==this.service.require_verify || c)) {
            o = s.getUrl("person_verify");
            l = this.utils_t("verify_person_tips");
            v = this.utils_t("certificate");
            d = true;
          }
        } else {
          o = s.getUrl("person_bind_phone");
          l = this.utils_t("realname_person_tips");
          v = this.utils_t("realname");
          d = true;
        }
      }

      if (d) {
        if (0===Editor.Dialog.messageBox({title:this.utils_t("dialog_title"),message:l,buttons:[v,this.utils_t("btn_cancel")],defaultId:0,cancelId:1,noLink:true})) {
          i.openUrlWithDefaultExplorer(o);
        }

        if (t) {
          t(false);
        }

        this.isOpenService = false;
        return;
      }
      this.isOpenService = false;
    }

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.openService();
    }

    s.openService(s.getGame().data.app_id,this.service.service_id,(e,s)=>{
      if (e) {
        if (window.ccServicesAnalytics) {
          window.ccServicesAnalytics.openServiceSuccess();
        }
      } else {
        if (702===s.status||703===s.status) {
          this.createTentcentSubAccount(702===s.status);
          this.isOpenService = false;
          return;
        }

        if (window.ccServicesAnalytics) {
          window.ccServicesAnalytics.openServiceFailed(s);
        }

        var r=`${this.utils_t("open_service_failed")}\n\t${this.utils_t("open_service_failed_code")} : ${s.status?s.status:""}\n\t${this.utils_t("open_service_failed_msg")} : ${s.msg?s.msg:""}`;i.printToCreatorConsole("warn",this.service.service_name+" - "+r)
      }
      this.isOpenService = false;

      if (t) {
        t(e);
      }
    });
  },createTentcentSubAccount:function(e){if(0===Editor.Dialog.messageBox({title:this.utils_t("dialog_title"),message:e?this.utils_t("create_t_p_sub_tip"):this.utils_t("create_t_c_sub_tip"),buttons:[this.utils_t("btn_ok"),this.utils_t("btn_cancel")],defaultId:0,cancelId:1,noLink:true})){var i={title:this.utils_t("open_tencent_sub_account"),url:e?s.getUrl("create_t_p_sub"):s.getUrl("create_t_c_sub")};Editor.Ipc.sendToMain("cocos-services:openBrowser",i)}},enableService:function(){
    if (this.checkedServicePackageExixts()) {
      this.enable = true;
      this.$emit("enable-service",this.service.service_id,true);
      this.sendToMain(true);
    } else {
      this.downloadServicePackage(e=>{
        if (!e) {
          this.enable = false;
          i.printToCreatorConsole("warn",this.utils_t("download_url_empty"));
          return;
        }
        this.enable = true;
        this.$emit("enable-service",this.service.service_id,true);
        this.sendToMain(true);
      });
    }

    this.isOpenService = false;

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.enableService();
    }
  },disableService:function(){
    this.enable = false;
    this.$emit("enable-service",this.service.service_id,false);
    this.sendToMain(false);

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.disableService();
    }
  },downloadServicePackage:function(e,t){
    this.isDownloadServicePackage = true;
    this.downloadTip = this.utils_t("installing");

    if (!t) {
      t = this.service.package_download_url;
    }

    if (""===t) {
      this.isDownloadServicePackage = false;
      e(false);
      return;
    }

    if (window.ccServicesAnalytics) {
      window.ccServicesAnalytics.downloadService(s.readServiceVersionByURL(t));
    }

    s.installServicePackage(t,this.componentName,t=>{
      this.downloadTip = t.text;
      if(t.complete){if ("failed"===t.text) {
        this.isDownloadServicePackage = true;
        this.$nextTick(()=>this.isDownloadServicePackage=false);
        i.printToCreatorConsole("warn",this.utils_t("download_failed"));
        return;
      }setTimeout(()=>{
        s.registerServiceComponent(this.componentName);
        this.serviceVersion = s.readServicePackageInfo(this.componentName).version;
        this.isDownloadServicePackage = false;
        this.refreshPanel();
        e(true);
      },1e3)}
    });
  },refreshPanel(){
    this.refresh = false;
    this.$nextTick(()=>this.refresh=true);
  },enter:function(e){
    this.styHint.top = e.target.getBoundingClientRect().top-window._Scene?50:10;
    this.styHint.display = "block";
  },leave:function(e){this.styHint.display = "none";},replaceTagACocosUrlAppendUserInfo(e){var i=`https://creator-api.cocos.com/api/account/client_signin?session_id=${s.getUserData().session_id}&redirect_url=`;let t=document.createElement("div");t.innerHTML = e;let r=t.getElementsByTagName("a");for(let e=0;e<r.length;e++){
    if (r[e].href&&/cocos.(com|org|net)/.test(r[e].href)) {
      r[e].href = i+encodeURIComponent(r[e].href);
    }

    let t=r[e].getAttribute("value");

    if (t&&/cocos.(com|org|net)/.test(t)) {
      r[e].setAttribute("value",i+encodeURIComponent(t));
    }
  }return t.innerHTML}},created(){
    this.params = t.readServiceParam(this.service.service_id);
    s.registerServiceComponent();
    this.componentName = this.service.service_component_name;
    this.serviceVersion = s.readServicePackageInfo(this.componentName).version;
    this.enable = this.service.enable&&s.serviceExists(this.service.service_component_name);
    this.$emit("enable-service",this.service.service_id,this.enable);
    this.clactureVersion();
    var e=this.service.service_dev_url;

    if (e.match(/UNKNOW/)&&"UNKNOW"!==s.getGame().data.app_id) {
      e = e.replace("UNKNOW",s.getGame().data.app_id);
    } else {
      if (e.match(/app_id=\d+/)) {
        e = e.replace(/app_id=\d+/,`app_id=${s.getGame().data.app_id}`);
      }
    }

    this.service.service_dev_url = e;
    this.service_price = this.replaceTagACocosUrlAppendUserInfo(this.service.service_price);
  },props:{service:{type:Object}}});
}};