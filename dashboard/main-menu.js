"use strict";const e=require("electron").BrowserWindow;module.exports = function(){return [{label:Editor.T("SHARED.product_name"),submenu:Editor.isDarwin?[{type:"separator"},{label:Editor.T("MAIN_MENU.window.hide",{product:Editor.T("SHARED.product_name")}),accelerator:"CmdOrCtrl+H",role:"hide"},{label:Editor.T("MAIN_MENU.window.hide_others"),accelerator:"CmdOrCtrl+Shift+H",role:"hideothers"},{label:Editor.T("MAIN_MENU.window.show_all"),role:"unhide"},{label:Editor.T("MAIN_MENU.window.minimize"),accelerator:"CmdOrCtrl+M",role:"minimize"},{label:Editor.T("MAIN_MENU.window.bring_all_front"),role:"front"},{type:"separator"},{label:Editor.T("MAIN_MENU.window.close"),accelerator:"CmdOrCtrl+W",role:"close"},{label:Editor.T("MAIN_MENU.window.quit"),accelerator:"CmdOrCtrl+Q",role:"quit"}]:[{label:Editor.T("MAIN_MENU.account.logout"),click(){Editor.Ipc.sendToMain("app:sign-out")},enabled:Editor.requireLogin},{type:"separator"},{label:"Close",accelerator:"CmdOrCtrl+W",role:"close"},{label:Editor.T("MAIN_MENU.window.quit"),accelerator:"CmdOrCtrl+Q",role:"quit"}]},{label:Editor.T("MAIN_MENU.edit.title"),submenu:[{label:Editor.T("MAIN_MENU.edit.undo"),accelerator:"CmdOrCtrl+Z",role:"undo"},{label:Editor.T("MAIN_MENU.edit.redo"),accelerator:"Shift+CmdOrCtrl+Z",role:"redo"},{type:"separator"},{label:Editor.T("MAIN_MENU.edit.cut"),accelerator:"CmdOrCtrl+X",role:"cut"},{label:Editor.T("MAIN_MENU.edit.copy"),accelerator:"CmdOrCtrl+C",role:"copy"},{label:Editor.T("MAIN_MENU.edit.paste"),accelerator:"CmdOrCtrl+V",role:"paste"},{label:Editor.T("MAIN_MENU.edit.selectall"),accelerator:"CmdOrCtrl+A",role:"selectall"}]},{label:Editor.T("MAIN_MENU.developer.title"),id:"developer",submenu:[{label:Editor.T("MAIN_MENU.developer.command_palette"),accelerator:"CmdOrCtrl+:",click(){
  Editor.Window.main.focus();
  Editor.Ipc.sendToMainWin("cmdp:show");
}},{type:"separator"},{label:Editor.T("MAIN_MENU.developer.reload"),accelerator:"CmdOrCtrl+R",click(){e.getFocusedWindow().reload()}},{label:Editor.T("MAIN_MENU.developer.reload_no_cache"),accelerator:"CmdOrCtrl+Shift+R",click(){e.getFocusedWindow().reloadIgnoringCache()}},{type:"separator"},{label:Editor.T("MAIN_MENU.developer.inspect"),accelerator:"CmdOrCtrl+Shift+C",click(){
  let r = e.getFocusedWindow();
  let l = Editor.Window.find(r);

  if (l) {
    l.send("editor:window-inspect");
  }
}},{label:Editor.T("MAIN_MENU.developer.devtools"),accelerator:"CmdOrCtrl+Alt+I",click(){
  let r=e.getFocusedWindow();

  if (r) {
    r.openDevTools();
  }
}}]}];};