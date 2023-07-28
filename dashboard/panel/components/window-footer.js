"use strict";
const e = require("fs");
const t = require("path");
exports.template = e.readFileSync(t.join(__dirname,"../template/window-footer.html"),"utf-8");
exports.props = ["message"];
exports.data = function(){return{}};
exports.ready = function(){};