"use strict";module.exports = {undo(){
  _Scene.Undo.commit();
  _Scene.Undo.undo();
},redo(){_Scene.Undo.redo()},"undo-record"(e,o,n){_Scene.Undo.recordObject(o,n)},"undo-commit"(){_Scene.Undo.commit()},"undo-cancel"(){_Scene.Undo.cancel()}};