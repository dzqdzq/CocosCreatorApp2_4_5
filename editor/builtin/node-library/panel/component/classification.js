"use strict";
const e = require("fire-fs");
const r = require("path");
exports.template = e.readFileSync(r.join(__dirname,"../template/classification.html"),"utf-8");
exports.props = ["classify","zoom"];
exports.data = function(){return{}};
exports.components = {prefab:require("./prefab")};
exports.methods = {_t:e=>(e=e.toLowerCase(),Editor.T(`node-library.classify.${e}`))};