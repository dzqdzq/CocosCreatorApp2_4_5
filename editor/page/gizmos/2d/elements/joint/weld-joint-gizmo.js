"use strict";const e=require("./joint-gizmo");module.exports = class extends e{createAnchorGroup(){
  let e=this._root.group();
  e.path().plot("\n                M 0 -8 L 6 0 L 0 8 L -6 0\n                Z\n            ").fill("none");
  e.circle(5).stroke("none").center(0,0);
  return e;
}};