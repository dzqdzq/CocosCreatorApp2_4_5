"use strict";
module.exports = function (e, t) {
  let n;
  if (e) {
    let e = Editor.Selection.contexts("node");

    if (e.length > 0) {
      n = e[0];
    }
  } else {
    n = Editor.Selection.curActivate("node");
  }
  let o = Editor.Menu.getMenu("create-node");

  Editor.Menu.walk(o, (e) => {
    if (e.params) {
      e.params.push(n);
      e.params.push(false);
    }
  });

  if (t) {
    Editor.Menu.walk(o, (e) => {
      e.enabled = false;
    });
  }

  return o;
};
