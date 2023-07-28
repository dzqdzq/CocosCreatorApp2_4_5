"use strict";
const e = require("../../../utils/network");
const t = require("../const");
const s = require("fire-fs");
const r = 4294967296;
const {AuditInfo:a,AppInfo:i,ErrorCode:o,AccessTokenRet:c,AppInfoRet:n,UploadUrlRet:l,UploadRet:p,UpdateAPKRet:u} = require("./entity");
class d{constructor(e,s,r){
  this.loginType = e;
  this.accessToken = s;

  if (e===t.LOGIN_TYPE.client) {
    this.clientID = r;
  }
}get oAuthLogin(){return this.loginType===t.LOGIN_TYPE.oauth}genHeader(){
  let e={};

  if (this.oAuthLogin) {
    e.oauth2Token = this.accessToken;
  } else {
    e.Authorization = `Bearer ${this.accessToken}`;
    e.client_id = this.clientID;
  }

  return e;
}static async getAccessToken(t,s){
  let r = new c;
  let a = d.HOST+"/api/oauth2/v1/token";
  let i = {grant_type:"client_credentials",client_id:t,client_secret:s};
  try{
    let t=await e.postAsync(a,JSON.stringify(i));

    if ((t=JSON.parse(t)).access_token) {
      r.code = o.success;
      r.accessToken = t.access_token;
    }
  }catch(e){r.errorMessage = e;}return r
}async queryAppInfo(t){
  let s = new n;
  let r = d.HOST+"/api/publish/v2/app-info";
  let c = {appId:t};
  try{
    let t=await e.getAsync(r,c,this.genHeader());

    if (0===(t=JSON.parse(t)).ret.code) {
      s.code = o.success;
      t.appInfo = new i(t.appInfo);
      t.auditInfo = new a(t.auditInfo);
    }
  }catch(e){s.errorMessage = e;}return s
}async getUploadUrl(t,s){
  let r = new l;
  let a = d.HOST+"/api/publish/v2/upload-url";
  let i = {appId:t,suffix:s||"apk"};
  try{
    let t=await e.getAsync(a,i,this.genHeader());

    if ((t=JSON.parse(t)).uploadUrl) {
      r.code = o.success;
      r.uploadUrl = t.uploadUrl;

      if (t.chunkUploadUrl) {
        r.chunkUploadUrl = t.chunkUploadUrl;
      }

      r.authCode = t.authCode;
    }
  }catch(e){r.errorMessage = e;}return r
}async uploadFile(t,a,i){let c=new p;if (!s.existsSync(a)) {
  c.code = o.fileNotExists;
  return c;
}if (s.statSync(a).size>r) {
  c.code = o.fileTooLarge;
  return c;
}try{
  let s=await e.uploadFile(t,a,i);

  if ((s=(s=JSON.parse(s)).result).UploadFileRsp&&s.UploadFileRsp.ifSuccess) {
    c.code = o.success;
    c.files = s.UploadFileRsp.fileInfoList.map(e=>({fileDestUrl:e.fileDestUlr,size:e.size}));
  }
}catch(e){c.errorMessage = e;}return c}async updateApkInfo(t,s,r,a=1){
  let i = new u;
  let c = d.HOST+"/api/publish/v2/app-file-info";
  try{
    let n = {appId:t,releaseType:a};
    let l = {fileType:5,files:[{fileName:s,fileDestUrl:r}]};
    let p = await e.putAsync(c,n,this.genHeader(),JSON.stringify(l));

    if (0===(p=(p=JSON.parse(p)).ret).code) {
      i.code = o.success;
    } else {
      i.errorMessage = p.msg;
    }
  }catch(e){i.errorMessage = e;}return i
}}
d.HOST = "https://connect-api.cloud.huawei.com";
exports.Api = d;
exports.ErrorCode = o;