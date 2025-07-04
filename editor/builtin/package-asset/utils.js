const e = require("fire-fs");
const t = require("fire-path");
const o = require("async");
const r = require("electron").remote.dialog;
exports.ASSET_TYPE = "&asset&type&.json";

exports.init = function (e) {
    this.localProfiles = e.local;
  };

exports.getDataByKey = function (e) {
    return this.localProfiles.get(e) || "";
  };

exports.save = function (e, t) {
  this.localProfiles.set(e, t);
  this.localProfiles.save();
};

exports.showErrorMessageBox = function (e, t) {
    r.showErrorBox(e, t);
  };

exports.showImportConflictMessageBox = function (e, t, o) {
  const s = r.showMessageBoxSync({
    type: "info",
    title: e,
    message: t,
    buttons: [Editor.T("MESSAGE.yes"), Editor.T("MESSAGE.no")],
  });

  if (o) {
    o(null, 0 === s);
  }
};

exports.showImportMessageBox = function (e, t, o) {
  const s = r.showMessageBoxSync({
    type: "info",
    title: e,
    message: t,
    buttons: [Editor.T("MESSAGE.yes"), Editor.T("MESSAGE.no")],
    defaultId: 0,
    cancelId: 1,
  });

  if (o) {
    o(null, 0 === s);
  }
};

exports.showImportZipDialog = function (e) {
  const t = r.showOpenDialogSync({
    defaultPath:
      this.localProfiles.get("import-folder-path") || Editor.Project.path,
    properties: ["openFile"],
    filters: [{ name: "zip", extensions: ["zip".toLowerCase()] }],
  });
  if (!e || !t) {
    return;
  }
  let o = t[0];
  e(null, o);
  this.save("import-folder-path", o);
};

exports.showImportOutPathDialog = function (e) {
  const o = r.showOpenDialogSync({
    defaultPath:
      this.localProfiles.get("out-path") ||
      t.join(Editor.Project.path, "assets"),
    properties: ["openDirectory"],
  });
  if (!e || !o) {
    return;
  }
  let s = t.join(o[0], "/");
  e(null, s);
  this.save("out-path", s);
};

exports.showExportResDialog = function (e) {
  const t = r.showOpenDialogSync({
    defaultPath:
      this.localProfiles.get("current-resource") || Editor.Project.path,
    properties: ["openFile"],
    filters: [{ name: "resource", extensions: ["fire", "prefab"] }],
  });
  if (!e || !t) {
    return;
  }
  let o = t[0];
  e(null, { path: o, uuid: Editor.assetdb.remote.loadMetaByPath(o).uuid });
  this.save("current-resource", o);
};

exports.showExportOutPathDialog = function (e) {
  let t = this.localProfiles.get("export-resource-path") || Editor.Project.path;

  let o = r.showSaveDialogSync({
    title: this.T("EXPORT_ASSET.title"),
    defaultPath: t,
    filters: [{ name: "Package", extensions: ["zip"] }],
  });

  if (o) {
    e(null, o);
    this.save("export-resource-path", o);
  }
};

exports.isDirectory = function (t) {
    return e.existsSync(t);
  };

exports.createFolder = function (t) {
  if (!e.existsSync(t)) {
    e.mkdirSync(t);
  }
};

exports.copyFile = function (t, o) {
  let r = e.createReadStream(t);
  let s = e.createWriteStream(o);
  e.statSync(t);

  r.on("data", function (e) {
    if (false === s.write(e)) {
      r.pause();
    }
  });

  r.on("end", function () {
    s.end();
  });

  s.on("drain", function () {
    r.resume();
  });
};

exports.copy = function (r, s, i, n) {
    let a = e.readdirSync(r);
    if (0 === a.length) {
      n();
      return;
    }
    o.each(
      a,
      (o, n) => {
        if (!i[o]) {
          n();
          return;
        }
        let a = t.join(r, o);
        let c = t.join(s, o);

        if (e.statSync(a).isDirectory()) {
          this.createFolder(c);
          this.copy(a, c, i, n);
        } else {
          this.copyFile(a, c);
          n();
        }
      },
      n
    );
  };

exports.getIcon = function (e) {
  let t = Editor.assetdb.remote.loadMetaByUuid(e);
  let o = t.assetType();
  if ("texture" === o) {
    return `thumbnail://${e}?32`;
  }
  if ("sprite-frame" === o) {
    return `thumbnail://${t.rawTextureUuid}?32`;
  }
  if ("dragonbones" === o || "dragonbones-bin" === o) {
    o = "spine";
  } else {
    if ("effect" === o) {
      return "unpack://static/icon/assets/shader.png";
    }
    if ("fbx" === o || "gltf" === o) {
      return "unpack://static/icon/assets/prefab.png";
    }
  }
  return "unpack://static/icon/assets/" + o + ".png";
};

exports.changedAssetTreeSelectState = function (e, t) {
  e.selected = t;

  if (e.children) {
    e.children.forEach((e) => {
      e.selected = t;
      this.changedAssetTreeSelectState(e, t);
    });
  }
};

exports.T = function (e, ...t) {
    return Editor.T(`package-asset.${e}`, ...t);
  };
