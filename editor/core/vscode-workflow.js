const o = require("path");
const e = require("fire-fs");

module.exports = {
  updateAPIData() {
    e.copySync(
      Editor.url("unpack://utils/api/creator.d.ts"),
      o.join(Editor.Project.path, "creator.d.ts")
    );

    e.copySync(
      Editor.url("unpack://utils/vscode-extension/jsconfig.json"),
      o.join(Editor.Project.path, "jsconfig.json")
    );

    Editor.success(
      "API data generated and copied to " +
        o.join(Editor.Project.path, "creator.d.ts")
    );
  },
  updateTypeScriptConf() {
    e.copySync(
      Editor.url("unpack://utils/vscode-extension/tsconfig.json"),
      o.join(Editor.Project.path, "tsconfig.json")
    );

    Editor.success(
      "TypeScript Configuration file has been copied to " +
        o.join(Editor.Project.path, "tsconfig.json")
    );
  },
  updateDebugger() {
    let t = Editor.url("unpack://utils/vscode-extension/cocos-creator");
    let s = Editor.url("unpack://utils/vscode-extension/cocos-debug");
    let n = o.join(Editor.App.home, "..", ".vscode", "extensions");
    e.ensureDirSync(n);
    e.emptyDirSync(o.join(n, "cocos-creator"));
    e.copySync(t, o.join(n, "cocos-creator"));
    e.copySync(s, o.join(n, "cocos-debug"));
    Editor.success("VS Code extension installed to " + n);
  },
  updateDebugSetting() {
    let t = Editor.url("unpack://utils/vscode-extension/debugger/launch.json");
    let s = o.join(Editor.Project.path, ".vscode");
    e.ensureDirSync(s);
    e.copySync(t, o.join(s, "launch.json"));

    Editor.success(
      "Chrome debug setting has been updated to .vscode/launch.json, please install Debugger for Chrome VS Code extension to debug your project."
    );
  },
  updateCompileTask() {
    let t = Editor.url("unpack://utils/vscode-extension/debugger/tasks.json");
    let s = o.join(Editor.Project.path, ".vscode");
    e.ensureDirSync(s);
    e.copySync(t, o.join(s, "tasks.json"));

    Editor.success(
      'Compiling task has been added to .vscode/tasks.json, please run "compile" task in VS Code to trigger compile in Cocos Creator.'
    );
  },
};
