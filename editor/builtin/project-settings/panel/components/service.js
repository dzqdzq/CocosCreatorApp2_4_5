"use strict";
const e = require("fire-fs");
const t = require("electron").shell;
exports.template = e.readFileSync(Editor.url("packages://project-settings/panel/template/service.html"),"utf-8");
exports.props = ["analytics","facebook"];
exports.methods = {T:Editor.T,_onJumpAnalytics(){t.openExternal("https://analytics.cocos.com")},_onJumpFacebook(){t.openExternal("https://developer.facebook.com")}};
exports.created = function(){};