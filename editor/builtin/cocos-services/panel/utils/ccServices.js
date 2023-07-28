let e = require("./utils.js");
let r = require("./network.js");
let t = require("./serviceConfig.js");
let i = require("fs");
var s="https://creator-api.cocos.com/api/";"use strict";let a=new(require("events").EventEmitter);
var n;
var o;
var c;
var d;
var v;
var l;
var p;
var u;
var _ = false;
var g = false;

Array.prototype.equals = function(e){if (!e) {
  return false;
}if (this.length!=e.length) {
  return false;
}for (var r=0,t=this.length; r<t; r++) {
  if (this[r]instanceof Array&&e[r]instanceof Array) {if (!this[r].equals(e[r])) {
    return false;
  }} else {
    if (this[r]!=e[r]) {
      return false;
    }
  }
}return true;};

Object.defineProperty(Array.prototype,"equals",{enumerable:false});

module.exports = {CocosServicesUpdate:false,async init(r=false){if(!this.inited||r){
  this.readServiceConfig();

  if (this.devmode) {
    console.log("ccServices init");
  }

  if(!g){
    var i=`Cocos Service Version ${this.getServiceVersion()}`;
    console.log(i);

    if (_&&!Editor.isMainProcess) {
      e.printToCreatorConsole("info",i);
    }

    g = true;
  }if ((u=await Editor.User.isLoggedIn())||_) {
    n = _?await this.userLogin():await this.getSessionID();
    var s=await this.getSessionToken();
    n.session_token = s.data.session_token;
    var a=await this.getUserInfo();for(var o in a.data)n[o] = a.data[o];
    l = {data:t.readBindGame()};
    c = await this.getGameList();
    v = await this.getTargetUrl();
    d = await this.getServiceList();
    t.writeServiceList(d.data);
  } else {
    n = {corporation_id:"0"};
    l = {data:t.readBindGame()};

    if (null==(d={data:t.readServiceList()}).data) {
      d = await this.getServiceList();
      t.writeServiceList(d.data);
    }
  }
  this.inited = true;

  if (!p) {
    p = t.readEnableService();
  }
}},readServiceConfig(){
  var e=t.readServiceConfig();
  this.debug = t.readDebugMode();
  this.devmode = false;
  if(this.readDevMode()){
    if (void 0===e.username||void 0===e.password) {
      return;
    }
    _ = true;
    this.devmode = true;
    s = "https://test-creator-api.cocos.com/api/";
    o = {username:e.username,password:e.password};
  }
},readDevMode:()=>t.readDevMode(),writeDevMode(e){
  t.writeDevMode(e);

  if (!e) {
    this.init();
  }
},registerServiceComponent(r){var t=e.getCreatorHomePath()+"/services";try{if(r){
  var s = r.split("-")[1];
  var a = t+"/"+s+"/pages/index.js";

  if (i.existsSync(a)) {
    delete require.cache[require.resolve(a)];
    this.registerI18n(r);
    require(a);
  }
}else{if (!i.existsSync(t)) {
  return;
}i.readdirSync(t).forEach(e=>{
  var r = t+"/"+e;
  var s = i.statSync(r);

  if (s&&s.isDirectory()&&i.existsSync(r+"/pages/index.js")) {
    delete require.cache[require.resolve(r+"/pages/index.js")];
    this.registerI18n(`service-${e}`);
    require(r+"/pages/index.js");
  }
})}}catch(e){console.log(e)}},registerI18n(r){
  var t = e.getCreatorHomePath()+"/services";
  var s = r.split("-")[1];
  var a = t+"/"+s+`/pages/i18n/${e.getLang()}.js`;
  if (i.existsSync(a)) {
    try{
      delete require.cache[require.resolve(a)];
      Editor.i18n.extend({[`cocos-services.${s}`]:require(a)});
    }catch(e){}
  }
},readServicePackageInfo(r){
  if (!r||-1===r.indexOf("-")) {
    return{version:e.t("not_installed")};
  }var t=e.getCreatorHomePath()+"/services"+"/"+r.split("-")[1]+"/package.json";if (!i.existsSync(t)) {
    return{version:e.t("not_installed")};
  }var s=e.readJson(t);

  if ("zh"!==e.getLang()&&void 0!==s.upgrade_en) {
    s.upgrade = s.upgrade_en;
    delete s.upgrade_en;
  }

  return s;
},readServiceVersionByURL(e){if(e){var r=e.split("/");return r[r.length-1].replace(".zip","")}return""},async execInstallNativePlatformScript(r,s){
  this.readServiceConfig();
  var a = e.getCreatorHomePath()+"/services";
  var n = t.readEnableService();
  var o = t.readServiceList();
  if (void 0===o) {
    e.printToCreatorConsole("warn","services not exists");
    s(true);
    return;
  }if (!t.needExecNative()) {
    s(true);
    return;
  }for(var c of(p||(p=n),this.backiOSPbxFile(r,!p.equals(n)),o)){
    var d = c.service_component_name.split("-")[1];
    var v = a+"/"+d+"/install.js";
    if(i.existsSync(v)){var l=t.readServiceParam(c.service_id);try{
      delete require.cache[require.resolve(v)];var u=require(v);

      if (n.indexOf(c.service_id)>=0) {
        if (u.onBuildedProjectEnable) {
          await u.onBuildedProjectEnable(r,l);

          if (/^service-(agc|hms|sdkhub)/.test(c.service_component_name)) {
            console.error(c.service_component_name);
            this.processHuaweiChannel(c,r,l);
          } else {
            this.serviceIntegrationSubmit(c,"服务集成成功","Building Time");
          }
        } else {
          if (_) {
            e.printToCreatorConsole("warn",`${e.t("must_dev_info_1")} ${c.service_name} SDK ${e.t("must_dev_info_install1")} -- ( onBuildedProjectEnable(options, params) {} )`);
          }
        }
      } else {
        if (u.onBuildedProjectDisable) {
          await u.onBuildedProjectDisable(r,l);
        } else {
          if (_) {
            e.printToCreatorConsole("warn",`${e.t("must_dev_info_1")} ${c.service_name} SDK ${e.t("must_dev_info_uninstall1")} -- ( onBuildedProjectDisable(options, params) {} )`);
          }
        }
      }
    }catch(r){
      this.serviceIntegrationSubmit(c,"服务集成失败","Building Time",r.valueOf());

      if (_) {
        e.printToCreatorConsole("warn",`${d}\n\t${r.valueOf()}`);
      }
    }}
  }
  p = n;
  s(true);
},async processHuaweiChannel(r,t,s){
  let a = {baidugame:await Editor.Profile.load("project://baidugame.json").get("appid"),android:t.android.packageName,"huawei-agc":t.android.packageName,"android-instant":t["android-instant"].packageName,ios:t.ios.packageName,mac:t.mac.packageName,quickgame:await Editor.Profile.load("project://oppo-runtime.json").get("package"),qgame:await Editor.Profile.load("project://vivo-runtime.json").get("package"),wechatgame:await Editor.Profile.load("project://wechatgame.json").get("appid"),bytedance:await Editor.Profile.load("project://bytedance.json").get("appid")};
  let n = t.actualPlatform;
  let o = a[n];
  let c = "";
  let d = `${e.getProjectPath()}/settings/agconnect-services.json`;
  if(i.existsSync(d)){c = e.readJson(d).client.app_id;}if ("service-sdkhub"===r.service_component_name) {
    console.error(r.service_component_name);
    let e = "";
    let t = s.config;
    for(let r of t.plugins)e += `,${r.packageName}:${r.pUseType}`;this.huaweiIntegrationSubmitSuccess(r,c,o,n,`sdkhub$$${e.substr(1)}`)
  } else {
    this.huaweiIntegrationSubmitSuccess(r,c,o,n)
  }
},execInstallH5PlatformScript(r,t,s){
  this.readServiceConfig();
  var a = e.getCreatorHomePath()+"/services";
  var n = r.service_component_name.split("-")[1];
  var o = a+"/"+n+"/install.js";
  if (i.existsSync(o)) {
    try{
      delete require.cache[require.resolve(o)];var c=require(o);

      if (s) {
        if (c.onServiceEnable) {
          c.onServiceEnable(e.getProjectPath(),t);
          this.serviceIntegrationSubmit(r,"服务集成成功","Editing Time");
        } else {
          if (_) {
            e.printToCreatorConsole("warn",`${e.t("must_dev_info_1")} ${r.service_name} JSSDK ${e.t("must_dev_info_install1")} -- ( onServiceEnable(projectPath, params) {} )`);
          }
        }
      } else {
        if (c.onServiceDisable) {
          c.onServiceDisable(e.getProjectPath(),t);
        } else {
          if (_) {
            e.printToCreatorConsole("warn",`${e.t("must_dev_info_1")} ${r.service_name} JSSDK ${e.t("must_dev_info_uninstall1")} -- ( onServiceDisable(projectPath, params) {} )`);
          }
        }
      }
    }catch(t){
      this.serviceIntegrationSubmit(r,"服务集成失败","Editing Time",t.valueOf());

      if (_) {
        e.printToCreatorConsole("warn",`${n}\n\t${t.valueOf()}`);
      }
    }
  }
},huaweiIntegrationSubmitSuccess(e,r,i,s,a){var o={uid:n&&n.cocos_uid?n.cocos_uid:"",client_id:"CreatorServices",event:"服务集成成功",key_list:JSON.stringify(["app_id","app_name","service_id","service_name","version","cc_version","time","huawei_app_id","platform$$package_name",a?"sdkhub$$[plugin_name:use_type]":""]),value_list:JSON.stringify([t.readBindGame().appid,t.readBindGame().name,e.service_id?e.service_id:"",e.service_name?e.service_name:"",this.getServiceVersion(),this.getCreatorVersion(),"Building Time",r,`${s}$$${i}`,a||""])};this.submitLog(o)},serviceIntegrationSubmit(e,r,i,s){var a={uid:n&&n.cocos_uid?n.cocos_uid:"",client_id:"CreatorServices",event:r,key_list:JSON.stringify(["app_id","app_name","service_id","service_name","version","cc_version","time",s?"error":""]),value_list:JSON.stringify([t.readBindGame().appid,t.readBindGame().name,e.service_id?e.service_id:"",e.service_name?e.service_name:"",this.getServiceVersion(),this.getCreatorVersion(),i,s?JSON.stringify(s):""])};this.submitLog(a)},serviceExists(r){var t=e.getCreatorHomePath()+"/services"+"/"+r.split("-")[1];return i.existsSync(t)},backiOSPbxFile(r,t){var s=r.dest+"/frameworks/runtime-src/proj.ios_mac/";if(i.existsSync(s)){
  var a = Date.parse(new Date);
  var n = `${s}_backup/${r.projectName}.xcodeproj`;
  var o = `${s}${r.projectName}.xcodeproj`;

  if (i.existsSync(n)) {
    if (t) {
      i.renameSync(o,`${s}_backup/${r.projectName}-${a}.xcodeproj`);
      e.copyDir(n,o);
    }
  } else {
    e.copyDir(o,n);
  }
}},installServicePackage(t,i,s){
  const a=require("fs");
  var n = e.getCreatorHomePath()+"/services/";
  var o = e.getCreatorHomePath()+"/download/";

  if (!a.existsSync(n)) {
    e.mkdirs(n);
  }

  if (!a.existsSync(o)) {
    e.mkdirs(o);
  }

  var c;
  var d = o+i+".zip";
  let v=(e,r)=>{
    if (s) {
      s({text:e,complete:r});
    }
  };if (!t.match(".zip")) {
    v("failed",true);
    return;
  }r.download(t,d,(r,i)=>{
    if (r) {
      v("failed",true);
      return;
    }var s=e.t("downloading")+i.progress+"%";

    if (c!=i.progress) {
      c = i.progress;
      v(s,false);
    }

    if("complete"===i.status){if (100!==i.progress) {
      v("failed",true);
      return;
    }e.unzip(d,n,r=>{
      if (r) {
        v("failed",true);
      } else {
        v(e.t("installed"),true);

        if (a.existsSync(t)) {
          a.unlinkSync(t);
        }
      }
    })}
  })
},uninstallServicePackage(r){var t=e.getCreatorHomePath()+"/services/"+r.split("-")[1];e.removeDir(t)},getServicePackageDownloadUrl:(e,r)=>e.replace(/[0-9]+.[0-9]+.[0-9]+_[\x00-\xff]+.zip/,r+".zip"),async userLogin(){var t=s+"account/signin";return(await r.postAsync(t,{username:o.username,password:o.password,lang:e.getLang()})).data},async getSessionCode(){
  var e = s+"session/code";
  var t = {session_id:n.session_id};
  return await r.postAsync(e,this.paramPrase(t))
},async openService(e,t,i){
  var a = s+"service/open";
  var o = {app_id:e,service_id:t,session_token:n.session_token};
  try{
    var c=await r.postAsync(a,this.paramPrase(o));

    if (i) {
      if (0===c.status) {
        i(true);
      } else {
        i(false);
      }
    }
  }catch(e){
    if (i) {
      i(false,e);
    }
  }
},async getSessionToken(){
  var e = s+"session/token";
  var t = {session_code:(await this.getSessionCode()).data.session_code,ip:"127.0.0.1"};
  return await r.postAsync(e,this.paramPrase(t))
},async getServiceList(){var t=s+"service/lists";return await r.postAsync(t,{lang:e.getLang(),cs_version:this.getServiceVersion(),cc_version:this.getCreatorVersion()})},async getGameList(){
  var e = s+"game/lists";
  var t = {session_token:n.session_token,ip:"127.0.0.1"};
  var i = await r.postAsync(e,this.paramPrase(t));
  c = i;
  return i;
},async getServiceVersionDesc(e,t){
  var i = s+"service/get_version_desc";
  var a = {ip:"127.0.0.1",service_id:e,version:t};
  return await r.postAsync(i,this.paramPrase(a))
},async getTCBTempKey(e,t){
  var i = s+"service/tcb_tmp_role";
  var a = {session_token:n.session_token,service_id:e,app_id:t};
  return new Promise((e,t)=>{r.postAsync(i,this.paramPrase(a)).then(r=>{
    r.data.secretId = r.data.secret_id;
    r.data.secretKey = r.data.secret_key;
    delete r.data.secret_id;
    delete r.data.secret_key;
    e(r.data);
  }).catch(r=>e(null))});
},async createTCBEnv(e,t,i,a){
  var o = s+"service/tcb_create_env";
  var c = {session_token:n.session_token,service_id:e,env_id:i,alias:a,app_id:t};
  return await r.postAsync(o,this.paramPrase(c))
},async getTCBEnvs(e,t){
  var i = s+"service/get_tcb_envs";
  var a = {session_token:n.session_token,service_id:e,app_id:t};
  return new Promise((e,t)=>{r.postAsync(i,this.paramPrase(a)).then(r=>e(r)).catch(r=>e({status:-1}))})
},async getTCBQuotaData(e,t,i){
  var a = s+"service/get_tcb_quota_data";
  var n = {session_token:this.getUserData().session_token,service_id:e,app_id:t,env_id:i};
  return await r.postAsync(a,this.paramPrase(n))
},async submitLog(e){
  var t = s+"log/add";
  var i = this.paramPrase(e);
  await r.postAsync(t,i);

  if (_&&this.debug) {
    e.submit_time = (new Date).toLocaleString();
    console.log(e);
  }
},async getGameDetail(e){
  var t = s+"game/detail";
  var i = {session_token:n.session_token,ip:"127.0.0.1",app_id:e||l.data.app_id};
  var a = await r.postAsync(t,this.paramPrase(i));
  l = a;
  return a;
},async getUserInfo(){
  var e = s+"user/info";
  var t = {session_token:n.session_token,ip:"127.0.0.1"};
  return await r.postAsync(e,this.paramPrase(t))
},async getTargetUrl(){
  var e = s+"service/urls";
  var t = {session_token:n.session_token,ip:"127.0.0.1"};
  return await r.postAsync(e,this.paramPrase(t))
},async associateProjectID(e,t,i){
  var a = s+"game/associate_project_id";
  var o = {session_token:n.session_token,ip:"127.0.0.1",app_id:e,project_id:t,action:i};
  return await r.postAsync(a,this.paramPrase(o))
},async createGame(e){
  var t = s+"game/create";
  var i = {session_token:n.session_token,game_name:e};
  return await r.postAsync(t,this.paramPrase(i))
},async getIMSettings(){
  var e = s+"service/get_im_setting";
  var t = {session_token:n.session_token};
  return await r.postAsync(e,this.paramPrase(t))
},getUserIsLogin:()=>u,getUserData(){
  if (!n) {
    this.init();
  }

  return n;
},async getUserDataAsync(){var e=await this.getUserInfo();for(var r in e.data)n[r] = e.data[r];return n},getGameLists(){
  if (!c) {
    this.init();
  }

  return c;
},getServiceLists(){
  if (!d) {
    this.init();
  }

  return d;
},getGame:()=>l||null,getUrl(r,t){
  if (!v) {
    e.printToCreatorConsole("warn",e.t("no_url_info"));
    return "null data";
  }
  var i;
  var s = `${v.data.client_signin_url}session_id=${n.session_id}&redirect_url=`;

  if ("dashboard"===r) {
    i = s+v.data.cocos_dashboard_url;
  } else {
    if ("create"===r) {
      i = s+v.data.cocos_game_create_url;
    } else {
      if ("service"===r) {
        i = s+v.data.cocos_service_url;
      } else {
        if ("enable_service"===r) {
          i = s+encodeURIComponent(v.data.cocos_service_open_url+"?"+this.urlEncode(t).substring(1));
        } else {
          if ("person_verify"===r) {
            i = s+v.data.cocos_personal_verify_url;
          } else {
            if ("company_verify"===r) {
              i = s+v.data.cocos_company_verify_url+"?"+this.urlEncode(t).substring(1);
            } else {
              if ("person_bind_phone"===r) {
                i = s+v.data.cocos_mobile_bind_personal_url;
              } else {
                if ("company_bind_phone"===r) {
                  i = s+v.data.cocos_mobile_bind_company_url;
                } else {
                  if ("create_t_p_sub"===r) {
                    i = s+v.data.cocos_create_t_p_sub_url;
                  } else {
                    if ("create_t_c_sub"===r) {
                      i = s+v.data.cocos_create_t_c_sub_url;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return i;
},async getSessionID(){if(Editor.User.getUserData&&"function"==typeof Editor.User.getUserData){var r=await Editor.User.getUserData();if (r.session_id) {
  return r
}}return e.readJson(`${e.getCreatorHomePath()}/profiles/user_token.json`)},getServiceVersion:()=>e.readJson(Editor.url("packages://cocos-services/package.json")).version,compareVersion(e,r){for(var t=e.substring(0,e.indexOf("_")).split(".").map(Number),i=r.substring(0,r.indexOf("_")).split(".").map(Number),s=Math.min(t.length,i.length),a=0;a<s;a++){if (t[a]>i[a]) {
  return true;
}if (t[a]<i[a]) {
  return false;
}}return t.length>i.length},getNumberVersion(){var e=this.getServiceVersion();return`${parseInt(e.replace(/\./g,""))/100}`},getCreatorVersion:()=>Editor.isMainProcess?Editor.versions.CocosCreator:Editor.remote.versions.CocosCreator,paramPrase(r){
  var t = require("md5");
  var i = r;
  i.plugin_id = "1025";
  i.lang = e.getLang();
  i.cs_version = this.getServiceVersion();
  i.cc_version = this.getCreatorVersion();
  i = this.objKeySort(i);
  var s=this.urlEncode(i)+"&32104adac01fdec28ac19df0b2f42d532b06311d";
  i.sign = t(s.substr(1));
  return i;
},urlEncode(e,r,t){
  if (null==e) {
    return"";
  }
  var i = "";
  var s = typeof e;
  if ("string"==s||"number"==s||"boolean"==s) {
    i += "&"+r+"="+(t?encodeURIComponent(e):e);
  } else {
    for(var a in e){var n=null==r?a:r+(e instanceof Array?"["+a+"]":"."+a);i += this.urlEncode(e[a],n,t);}
  }return i
},objKeySort(e){for (var r=Object.keys(e).sort(),t={},i=0; i<r.length; i++) {
  t[r[i]] = e[r[i]];
}return t},on(...r){
  if (this.checkEvent(arguments[0])) {
    e.printToCreatorConsole("warn",`${arguments[0]} Event Multiple Registration !!!`);
  } else {
    a.on(...r);
  }
},emit(...e){
  if (this.checkEvent(arguments[0])) {
    a.emit(...e);
  } else {
    arguments[2](`${arguments[0]} Event Not Registration !!!`,null);
  }
},removeAll(e){a.removeAllListeners(e)},checkEvent:e=>a.eventNames().indexOf(e)>-1};