"use strict";
const e = require("fs");
const i = require("path");
exports.template = e.readFileSync(i.join(__dirname,"../template/window-header.html"),"utf-8");
exports.props = ["version"];
exports.data = function(){return{mac:"darwin"===process.platform}};
exports.methods = {minimize(e){Editor.Ipc.sendToMain("app:window-minimize")},maximize(e){Editor.Ipc.sendToMain("app:window-maximize")},close(e){Editor.Ipc.sendToMain("app:window-close")}};
exports.ready = function(){let e=require("electron").remote.app.getVersion();this.version = `Cocos Creator v${e}`;};