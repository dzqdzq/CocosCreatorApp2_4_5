(function(){
  const e=require("./ccServices.js");
  window.ccServicesAnalytics = {};

  ccServicesAnalytics.init = function(e,c,i){
    ccServicesAnalytics.user_id = e;
    ccServicesAnalytics.game = c;
    ccServicesAnalytics.service = i;
  };

  ccServicesAnalytics.openServicePanel = function(){ccServicesAnalytics.generateParamAndSubmit("打开服务面板-new")};
  ccServicesAnalytics.enterService = function(){ccServicesAnalytics.generateParamAndSubmit("进入服务主页")};
  ccServicesAnalytics.downloadService = function(e){ccServicesAnalytics.generateParamAndSubmit("下载安装服务",{plugin_version:e})};
  ccServicesAnalytics.gotoServiceCenter = function(){ccServicesAnalytics.generateParamAndSubmit("点击Cocos服务中心")};
  ccServicesAnalytics.gotoAccountCenter = function(){ccServicesAnalytics.generateParamAndSubmit("点击Cocos账户中心")};
  ccServicesAnalytics.gotoDashboardUrl = function(e=""){ccServicesAnalytics.generateParamAndSubmit("点击服务控制台",{target_url:e})};
  ccServicesAnalytics.gotoSampleUrl = function(e=""){ccServicesAnalytics.generateParamAndSubmit("点击服务Sample工程",{target_url:e})};
  ccServicesAnalytics.gotoGuideUrl = function(e=""){ccServicesAnalytics.generateParamAndSubmit("点击服务使用指南",{target_url:e})};
  ccServicesAnalytics.saveParameter = function(){ccServicesAnalytics.generateParamAndSubmit("点击服务保存参数")};
  ccServicesAnalytics.enableService = function(){ccServicesAnalytics.generateParamAndSubmit("开启服务")};
  ccServicesAnalytics.disableService = function(){ccServicesAnalytics.generateParamAndSubmit("关闭服务")};
  ccServicesAnalytics.showSettingsMenu = function(){ccServicesAnalytics.generateParamAndSubmit("点击App设置菜单")};
  ccServicesAnalytics.enterBindCocosAppID = function(){ccServicesAnalytics.generateParamAndSubmit("进入AppID绑定页面")};
  ccServicesAnalytics.associateAppID = function(){ccServicesAnalytics.generateParamAndSubmit("关联AppID")};
  ccServicesAnalytics.unassociateAppID = function(){ccServicesAnalytics.generateParamAndSubmit("取消关联AppID")};
  ccServicesAnalytics.ctrateGame = function(){ccServicesAnalytics.generateParamAndSubmit("点击创建游戏")};
  ccServicesAnalytics.serviceIntegrationSuccess = function(){ccServicesAnalytics.generateParamAndSubmit("服务集成成功")};
  ccServicesAnalytics.serviceIntegrationFailed = function(){ccServicesAnalytics.generateParamAndSubmit("服务集成失败")};
  ccServicesAnalytics.openService = function(){ccServicesAnalytics.generateParamAndSubmit("开通服务")};
  ccServicesAnalytics.openServiceSuccess = function(){ccServicesAnalytics.generateParamAndSubmit("开通服务成功")};
  ccServicesAnalytics.openServiceFailed = function(e){ccServicesAnalytics.generateParamAndSubmit("开通服务失败",{cause:JSON.stringify(e)})};

  ccServicesAnalytics.generateParamAndSubmit = function(c,i){
    var n = ["app_id","app_name","service_id","service_name","version","cc_version"];
    var t = [this.game&&this.game.appid?this.game.appid:"",this.game&&this.game.name?this.game.name:"",this.service&&this.service.service_id?this.service.service_id:"",this.service&&this.service.service_name?this.service.service_name:"",e.getServiceVersion(),e.getCreatorVersion()];
    if (i) {
      for (var s=Object.keys(i),a=0; a<s.length; a++) {
        n.push(s[a]);
        t.push(i[s[a]]);
      }
    }var r={uid:this.user_id?this.user_id:"",client_id:"CreatorServices",event:c,key_list:JSON.stringify(n),value_list:JSON.stringify(t)};e.submitLog(r)
  };
})();