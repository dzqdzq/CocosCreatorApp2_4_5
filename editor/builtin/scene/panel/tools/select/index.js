const e = require("../camera");
const o = require("./2d");
const n = require("./3d");
let u={};
["onMouseDown","onMouseWheel","onMouseMove","onMouseLeave","onMouseUp","onKeyDown","onKeyUp"].forEach(function(r){u[r] = function(u){return e.is2D?o[r]&&o[r](u):n[r]&&n[r](u)};});
module.exports = u;