"use strict";
const o = require("electron");
const e = {en:{home:"https://docs.cocos.com/creator/{version}/manual/en/","quick-start":"https://docs.cocos.com/creator/{version}/manual/en/getting-started/quick-start.html","getting-started":"https://docs.cocos.com/creator/{version}/manual/en/getting-started/"},zh:{home:"https://docs.cocos.com/creator/{version}/manual/zh/","quick-start":"https://docs.cocos.com/creator/{version}/manual/zh/getting-started/quick-start.html","getting-started":"https://docs.cocos.com/creator/{version}/manual/zh/getting-started/"}};
const t = {en:{home:"https://docs.cocos.com/creator/{version}/api/en/",services:"https://docs.cocos.com/creator/{version}/manual/en/sdk/cocos-services.html"},zh:{home:"https://docs.cocos.com/creator/{version}/api/zh/",services:"https://docs.cocos.com/creator/{version}/manual/zh/sdk/cocos-services.html"}};
function s(){let o;return o=(o="browser"===process.type?Editor.versions.CocosCreator:Editor.remote.versions.CocosCreator).replace(/\.\d+(?:-.+)?$/,"")}

exports.openManual = function(t){
  t = t||"home";
  let c=e[Editor.lang];

  if (!c) {
    c = e.en;
  }

  let r=c[t];
  r = r.replace("{version}",s());
  o.shell.openExternal(r);
};

exports.openAPI = function(e){
  e = e||"home";
  let c=t[Editor.lang];

  if (!c) {
    c = t.en;
  }

  let r=c[e];
  r = r.replace("{version}",s());
  o.shell.openExternal(r);
};