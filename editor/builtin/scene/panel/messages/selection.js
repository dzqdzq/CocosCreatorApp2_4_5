"use strict";Editor.require("scene://utils/node");module.exports = {selected(e,t,n){
  if ("node"===t) {
    _Scene.select(n);
    this._vm.selection = Editor.Selection.curSelection("node");
  }
},unselected(e,t,n){
  if ("node"===t) {
    _Scene.unselect(n);
    this._vm.selection = Editor.Selection.curSelection("node");
  }
},activated(e,t,n){
  if ("node"===t&&n) {
    _Scene.activate(n);
  }
},deactivated(e,t,n){
  if ("node"===t) {
    _Scene.deactivate(n);
  }
},hoverin(e,t,n){
  if ("node"===t) {
    _Scene.hoverin(n);
  }
},hoverout(e,t,n){
  if ("node"===t) {
    _Scene.hoverout(n);
  }
}};