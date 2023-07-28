"use strict";
const e = require("http");
const t = require("https");
const r = require("querystring");

module.exports = {sendRequest:function(o,n){
  let s = o.host;
  let i = o.path;
  let a = "https"===o.protocol?t:e;
  let d = r.stringify(o.data||{});
  let h = o.port||443;
  let l = o.method||"GET";
  let u = o.headers||{};

  if (!u["User-Agent"]) {
    u["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) CocosCreator/1.0.0 Chrome/45.0.2454.85 Electron/0.33.8 Safari/537.36";
  }

  if ("GET"===l) {
    i += "?"+d;
  } else {
    d += "\n";
  }

  let p = "";

  let c = a.request({method:l,host:s,port:h,path:i,headers:u},e=>{if (200!==e.statusCode) {
    n(new Error("Connect Failed"),p);
    return;
  }e.on("data",e=>{p += e;}).on("end",()=>{n(null,p)})}).on("error",e=>{n(e,p)});

  c.write(d);
  c.end();
}};