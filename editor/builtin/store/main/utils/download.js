"use stirct";
const e = require("fs-extra");
const r = require("path");
const o = require("crypto");
const t = require("request");
const n = require("request-progress");
const i = Editor.remote?Editor.remote.App.home:Editor.App.home;
const u = r.join(i,"download");
e.ensureDirSync(u);

exports.downloadZip = function(r,o,i){return new Promise((u,s)=>{
  r = encodeURI(r);
  n(t(r),{delay:300}).on("progress",function(e){i(e.percent)}).on("error",function(e){s(e)}).on("end",function(){u()}).pipe(e.createWriteStream(o));
});};

exports.md5 = function(e){
  var r=o.createHash("md5");
  r.update(e||"");
  return r.digest("hex");
};