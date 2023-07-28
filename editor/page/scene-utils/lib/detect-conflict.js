"use strict";
const e = require("../utils/animation");
module.exports = {
  checkConflict_WidgetLayout(e, t) {
    var i;
    return (!!(function () {
      return (
        t.resizeMode === cc.Layout.ResizeMode.CONTAINER &&
        (t.type === cc.Layout.Type.NONE
          ? e.isStretchWidth || e.isStretchHeight
          : ((i =
              t.type === cc.Layout.Type.GRID
                ? t.startAxis === cc.Layout.AxisDirection.HORIZONTAL
                  ? cc.Layout.Type.VERTICAL
                  : cc.Layout.Type.HORIZONTAL
                : t.type) === cc.Layout.Type.HORIZONTAL &&
              e.isStretchWidth) ||
            (i === cc.Layout.Type.VERTICAL && e.isStretchHeight))
      );
      var i;
    })() && ((i = t.type === cc.Layout.Type.GRID
      ? cc.Layout.AxisDirection[t.startAxis].toLowerCase() + " grid"
      : cc.Layout.Type[t.type].toLowerCase()), CC_TEST ||
      cc.warn(
        'The resizeMode type of "%s" has been reset to NONE because it is conflict with its child widget "%s" in %s layout.',
        t.name,
        e.name,
        i
      ), (t.resizeMode = cc.Layout.ResizeMode.NONE), true));
  },
  checkConflict_Layout(e) {
    for (var t = e.node.children, i = 0; i < t.length; ++i) {
      var c = t[i].getComponent(cc.Widget);
      if (c && this.checkConflict_WidgetLayout(c, e)) {
        return true;
      }
    }
    return false;
  },
  checkConflict_Widget(e) {
    var t = e.node._parent;
    if (cc.Node.isNode(t)) {
      var i = t.getComponent(cc.Layout);
      if (i && i.resizeMode === cc.Layout.ResizeMode.CONTAINER) {
        this.checkConflict_WidgetLayout(e, i);
        return true;
      }
    }
    return false;
  },
  afterAddChild(e) {
    var t = e.getComponent(cc.Widget);
    return (
      !(!t || (!t.isStretchWidth && !t.isStretchHeight)) &&
      this.checkConflict_Widget(t)
    );
  },
  beforeAddChild: (t, i) =>
    !(
      !e.STATE.RECORD ||
      t._objFlags & cc.Object.Flags.HideInHierarchy ||
      (function (e) {
        for (; e && !(e instanceof cc.Scene); e = e._parent) {
          if (e._objFlags & cc.Object.Flags.HideInHierarchy) {
            return true;
          }
        }
        return false;
      })(i)
    ) &&
    (Editor.Dialog.messageBox({
      type: "warning",
      buttons: [Editor.T("MESSAGE.ok")],
      title: Editor.T("MESSAGE.warning"),
      message: Editor.T("MESSAGE.animation_editor.can_not_modify_hierarchy"),
      noLink: true,
    }),
    true),
};
