"use strict";
Editor.log("checking language setting...");
const e = Editor.Profile.load("global://settings.json");
let a = e.get("language");
if (-1 === ["en", "zh"].indexOf(a)) {
  a = "en";
  if (("linux" !== process.platform)) {
    a = 0 ===
    Editor.Dialog.messageBox({
      type: "question",
      buttons: ["中文", "English"],
      title: "Choose Language",
      message: "Please choose your language / 请选择语言",
      detail: "",
      defaultId: 0,
      cancelId: 0,
      noLink: true,
    })
      ? "zh"
      : "en";
  }
  e.set("language", a);
  e.save();
}
Editor.lang = a;
Editor.Package.lang = a;
Editor.log("Language: " + Editor.lang);
