const t=require("../const");let e=require("request");const o={ciphers:"ALL",secureProtocol:"TLSv1_method"};
let s = Editor.isMainProcess?Editor.versions?Editor.versions.CocosCreator:Editor.App.version:Editor.remote.versions?Editor.remote.versions.CocosCreator:Editor.remote.App.version;

let r = async function(e){
  e.version = s;
  return await Editor.User.signParam(e,t.PLUGIN_ID,t.PLUGIN_SECRET);
};

module.exports = {sessionToken:null,post:(t,s)=>new Promise((r,i)=>{e.post({url:t,json:true,form:s,agentOptions:o},(t,e,o)=>{
  if (t||200!==e.statusCode) {
    i({status:e.statusCode,msg:t});
  } else {
    r(o);
  }
})}),async fetchOAuthUrl(){let t={session_token:await this.getSessionToken(),lang:Editor.lang||"en"};return await this.post("https://creator-api.cocos.com/api/hms/get_oauth_url",await r(t))},async fetchOAuthToken(){let t={session_token:await this.getSessionToken()};return await this.post("https://creator-api.cocos.com/api/hms/get_tp_info",await r(t))},async getSessionToken(){if (this.sessionToken) {
  return this.sessionToken;
}let e=await Editor.User.getSessionToken(t.PLUGIN_ID,t.PLUGIN_SECRET);return e&&e.data.session_token?(this.sessionToken=e.data.session_token,this.sessionToken):(Editor.error("get plugin session token error"),void 0)},async getOAuthToken(){let t=await this.fetchOAuthToken();return t&&t.data.tp_access_token?t.data.tp_access_token:(Editor.error("get plugin tp access token url error"),void 0)},async getOAuthUrl(){let t=await this.fetchOAuthUrl();return t&&t.data.oauth_url?{url:t.data.oauth_url,redirect:t.data.redirect_url}:(Editor.error("get plugin login url error"),void 0)},async needLogin(){
  let t = false;
  let e = await this.fetchOAuthToken();
  return e?(720!==e.status&&721!==e.status||(t=true),t):(Editor.error("get plugin login url error"),true);
},async logout(){let t={session_token:await this.getSessionToken()};return await this.post("https://creator-api.cocos.com/api/hms/unbind_oauth",await r(t))}};