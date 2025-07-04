"use strict";
const e = require("./editor");
const r = require("./scene");
const t = require("./asset");
const i = require("./animation");
const c = require("./selection");
const s = require("./timeline");
let o={};
Object.keys(e).forEach(r=>{o[`editor:${r}`] = e[r];});
Object.keys(r).forEach(e=>{o[`scene:${e}`] = r[e];});
Object.keys(t).forEach(e=>{o[`asset-db:${e}`] = t[e];});
Object.keys(i).forEach(e=>{o[`animation:${e}`] = i[e];});
Object.keys(c).forEach(e=>{o[`selection:${e}`] = c[e];});
Object.keys(s).forEach(e=>{o[`timeline:${e}`] = s[e];});
module.exports = o;