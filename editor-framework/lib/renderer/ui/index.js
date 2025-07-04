"use strict";
let e = {};
module.exports = e;
e.Settings = require("./settings");
e._DomUtils = require("./utils/dom-utils");
e._FocusMgr = require("./utils/focus-mgr");
e._ResMgr = require("./utils/resource-mgr");
e.DockUtils = require("./utils/dock-utils");
e.DragDrop = require("./utils/drag-drop");
e.Resizable = require("./behaviors/resizable");
e.Droppable = require("./behaviors/droppable");
e.Dockable = require("./behaviors/dockable");
e.Focusable = require("./behaviors/focusable");
e.Disable = require("./behaviors/disable");
e.Readonly = require("./behaviors/readonly");
e.ButtonState = require("./behaviors/button-state");
e.InputState = require("./behaviors/input-state");
e.DockResizer = require("./dock/resizer");
e.Dock = require("./dock/dock");
e.MainDock = require("./dock/main-dock");
e.Tab = require("./panel/tab");
e.Tabs = require("./panel/tabs");
e.Panel = require("./panel/panel");
e.PanelFrame = require("./panel/frame");
const r = require("../../share/js-utils");
r.assign(e, e._DomUtils);
r.assign(e, e._ResMgr);
e.focus = e._FocusMgr._setFocusElement;
e.focusParent = e._FocusMgr._focusParent;
e.focusNext = e._FocusMgr._focusNext;
e.focusPrev = e._FocusMgr._focusPrev;
r.copyprop("lastFocusedPanelFrame", e._FocusMgr, e);
r.copyprop("focusedPanelFrame", e._FocusMgr, e);
r.copyprop("lastFocusedElement", e._FocusMgr, e);
r.copyprop("focusedElement", e._FocusMgr, e);
r.assign(e, require("./elements/utils"));

e
  .importStylesheets([
    "theme://elements/resizer.css",
    "theme://elements/tab.css",
    "theme://elements/tabs.css",
    "theme://elements/dock.css",
    "theme://elements/panel.css",
    "theme://elements/panel-frame.css",
    "theme://elements/box-container.css",
    "theme://elements/button.css",
    "theme://elements/checkbox.css",
    "theme://elements/color-picker.css",
    "theme://elements/color.css",
    "theme://elements/hint.css",
    "theme://elements/input.css",
    "theme://elements/loader.css",
    "theme://elements/markdown.css",
    "theme://elements/num-input.css",
    "theme://elements/progress.css",
    "theme://elements/prop-table.css",
    "theme://elements/prop.css",
    "theme://elements/section.css",
    "theme://elements/select.css",
    "theme://elements/slider.css",
    "theme://elements/splitter.css",
    "theme://elements/text-area.css",
  ])
  .then(() => {
  [
    e.DockResizer,
    e.Dock,
    e.MainDock,
    e.Tab,
    e.Tabs,
    e.Panel,
    e.PanelFrame,
  ].forEach((e) => {
    window.customElements.define(e.tagName, e);
  });

  e.BoxContainer = require("./elements/box-container");
  e.Button = require("./elements/button");
  e.Checkbox = require("./elements/checkbox");
  e.Color = require("./elements/color");
  e.ColorPicker = require("./elements/color-picker");
  e.DropArea = require("./elements/drop-area");
  e.Hint = require("./elements/hint");
  e.Input = require("./elements/input");
  e.Loader = require("./elements/loader");
  e.Markdown = require("./elements/markdown");
  e.NumInput = require("./elements/num-input");
  e.Progress = require("./elements/progress");
  e.Prop = require("./elements/prop");
  e.PropTable = require("./elements/prop-table");
  e.Section = require("./elements/section");
  e.Select = require("./elements/select");
  e.Slider = require("./elements/slider");
  e.Splitter = require("./elements/splitter");
  e.TextArea = require("./elements/text-area");
  e.VirtualList = require("./elements/vlist");
  const r = require("./elements/props");

  [
    "string",
    "number",
    "boolean",
    "array",
    "object",
    "enum",
    "color",
    "vec2",
    "vec3",
  ].forEach((s) => {
    e.registerProperty(s, r[s]);
  });

  e.Shadow = require("./elements/shadow");
  e.WebView = require("./elements/webview");
});

e.VueUtils = require("./utils/vue-utils");
