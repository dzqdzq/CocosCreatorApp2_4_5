"use strict";const e=require("./joint-gizmo");module.exports = class extends e{createAnchorGroup(){
  let e=this._root.group();
  e.path().plot("\n                M -8 8 L 8 8 L 8 -8 L -8 -8 Z\n            ").fill("none");
  e.circle(10).stroke("none").center(0,0);
  return e;
}};