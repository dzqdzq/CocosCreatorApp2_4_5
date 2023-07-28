const e = require("fire-fs");
const t = require("fire-path");
const s = require("async");
const r = require("../utils");
const i = require("../lib/jszip.min");
const n = require("../lib/jszip-utils.min");
const a = require("node-uuid");

let o = function (e, s) {
  let r = t.parse(e);
  this.name = r.name + r.ext;
  this.path = e;
  this.type = "";
  this.icon = "";
  this.selected = true;
  this.parent = s;
};

let h = function (e, s, r) {
  let i = t.parse(e);
  this.name = i.name;
  this.path = e;
  this.children = [];
  this.type = r || "folder";
  this.folded = true;
  this.selected = true;
  this.parent = s;
  this.icon = `unpack://static/icon/assets/${this.type}.png`;
};

let l = r.T("IMPORT_ASSET.parse_zip_err_title");
let _ = r.T("IMPORT_ASSET.parse_zip_err_content");
r.T("IMPORT_ASSET.err_title");

module.exports = {
  tempPath: t.join(Editor.Project.path, "temp", "packageAsset", "/"),
  _onInit(e) {
    this._folderArr = [];
    this._assetTypeArr = [];
    this._imgArr = [];
    this._treeRoot = new h("assets", null, "mount");
    this._basePath = e;
    this._outPath = "";
    this._conflictAssets = [];
  },
  _getFolderInfo(e) {
    return this._folderArr[e];
  },
  _getParent(e) {
    let s = t.parse(e);
    if (!s.dir) {
      return null;
    }
    let r = this._getFolderInfo(s.dir);
    return r || this._getParent(s.dir);
  },
  _getTypeByName(e) {
    return this._assetTypeArr[e];
  },
  _getIcon(e, t) {
    return "texture" === t || "sprite-frame" === t
      ? this._imgArr[e]
      : "dragonbones" === t || "dragonbones-bin" === t
      ? "unpack://static/icon/assets/spine.png"
      : "effect" === t
      ? "unpack://static/icon/assets/shader.png"
      : "fbx" === t || "gltf" === t
      ? "unpack://static/icon/assets/prefab.png"
      : "unpack://static/icon/assets/" + t + ".png";
  },
  _addAsset(e, s) {
    let r = t.parse(e);
    if (!r.dir && s) {
      if (r.ext) {
        let t = new o(e, s);

        if (-1 === s.children.indexOf(t)) {
          t.type = this._getTypeByName(t.name);
          t.icon = this._getIcon(t.name, t.type);
          s.children.push(t);
        }
      } else {
        let t = new h(e, s);

        if (-1 === s.children.indexOf(t)) {
          s.children.push(t);
          this._folderArr[r.name] = t;
        }
      }
    } else {
      let t = this._getFolderInfo(r.dir);

      if (!t) {
        t = new h(r.dir, this._getParent(r.dir));
        this._folderArr[r.dir] = r;
      }

      if (
        (r.ext)
      ) {
        let s = new o(e, t);

        if (-1 === t.children.indexOf(s)) {
          s.type = this._getTypeByName(s.name);
          s.icon = this._getIcon(s.name, s.type);
          t.children.push(s);
        }
      } else {
        let s = new h(e, t);
        if (-1 === t.children.indexOf(s)) {
          t.children.push(s);
          let e = r.dir + "/" + r.name;
          this._folderArr[e] = s;
        }
      }
    }
  },
  _addImageAsset(e, s) {
    let r = t.parse(e.name);
    e.async("arraybuffer").then((t) => {
      let i = (function (e) {
        let t = "";
        let s = new Uint8Array(e);
        let r = s.byteLength;
        for (let e = 0; e < r; e++) {
          t += String.fromCharCode(s[e]);
        }
        return window.btoa(t);
      })(t);

      let n = e.name.indexOf(".");
      let a = e.name.substr(n + 1);
      this._imgArr[r.name + r.ext] = "data:image/" + a + ";base64," + i;
      this._addAsset(e.name, s);
    });
  },
  _analyticalContent(e, s) {
    let i = t.parse(e.name);

    if (!(i.base === r.ASSET_TYPE || ".meta" === i.ext)) {
      if (".png" === i.ext || ".jpg" === i.ext) {
        this._addImageAsset(e, this._treeRoot);
      } else {
        this._addAsset(e.name, this._treeRoot);
      }
    }

    s();
  },
  _analyticalZip(e, t) {
    n.getBinaryContent(e, (e, n) => {
      if (e) {
        if (t) {
          t(e);
        }

        return;
      }
      i.loadAsync(n).then(
        (e) => {
          try {
            e.file(r.ASSET_TYPE)
              .async("string")
              .then((r) => {
              this._assetTypeArr = JSON.parse(r);

              s.each(
                e.files,
                (e, t) => {
                  this._analyticalContent(e, t);
                },
                t
              );
            });
          } catch (e) {
            r.showErrorMessageBox(l, _);

            if (t) {
              t(_);
            }
          }
        },
        (e) => {
          r.showErrorMessageBox(l, _);

          if (t) {
            t(_);
          }
        }
      );
    });
  },
  analyticalZip(e, t) {
    this._onInit(e);

    this._analyticalZip(e, (e) => {
      if (e) {
        return t(e, null);
      }
      t(null, this._treeRoot);
    });
  },
  _addNeedImport(e, t, r) {
    if (e.selected) {
      t[e.name] = e;
      t[e.name + ".meta"] = e;
    }

    s.each(
      e.children,
      (s, r) => {
        if (s.selected) {
          t[s.name] = s;
          t[s.name + ".meta"] = e;
        }

        if ("folder" !== s.type) {
          return r();
        }
        this._addNeedImport(s, t, r);
      },
      r
    );
  },
  _queryNeedImportAsset(e, t) {
    let r = [];
    s.each(
      e.children,
      (e, t) => {
        this._addNeedImport(e, r, t);
      },
      () => {
        t(null, r);
      }
    );
  },
  _importContent(s, r, i) {
    let n = t.parse(s.name);
    let a = t.join(this._outPath, s.name);
    if (".meta" === n.ext) {
      let t = Object.keys(r);
      s.async("string").then((s) => {
        e.writeFileSync(a, s);

        t.forEach((t) => {
          if (e.existsSync(a)) {
            s = e.readFileSync(a, "utf8");
          }

          if (
            (-1 !== s.indexOf(t))
          ) {
            let i = new RegExp(t, "g");
            s = s.replace(i, r[t]);
            e.writeFileSync(a, s);
          }
        });

        i();
      });
    } else {
      if (".prefab" === n.ext || ".fire" === n.ext || ".anim" === n.ext) {
        let t = Object.keys(r);
        s.async("string").then((s) => {
          e.writeFileSync(a, s);

          t.forEach((t) => {
            if (e.existsSync(a)) {
              s = e.readFileSync(a, "utf8");
            }

            if (
              (-1 !== s.indexOf(t))
            ) {
              let i = new RegExp(t, "g");
              s = s.replace(i, r[t]);
              e.writeFileSync(a, s);
            }
          });

          i();
        });
      }
    }
  },
  _checkMeta(e, r, i) {
    let n = [];
    s.each(
      e,
      (e, s) => {
        let i = t.parse(e.name);
        let o = r[i.name + i.ext];

        if (".meta" === i.ext && o) {
          e.async("string").then((e) => {
            let r = JSON.parse(e);
            let o = Editor.remote.assetdb.uuidToFspath(r.uuid);
            if (o) {
              if (o !== t.join(this._outPath, i.dir, i.name)) {
                n[r.uuid] = a.v4();

                Object.keys(r.subMetas).forEach((e) => {
                  let t = r.subMetas[e];
                  n[t.uuid] = a.v4();
                });
              }
            }
            s();
          });
        } else {
          s();
        }
      },
      () => {
        i(null, n);
      }
    );
  },
  _importAssets(a, o) {
    if (!e.existsSync(this._basePath)) {
      let e = r.T("IMPORT_ASSET.err_title");
      let t = r.T("IMPORT_ASSET.err_info_not_exist", { outPath: this._basePath });
      r.showErrorMessageBox(e, t);
      return;
    }
    n.getBinaryContent(this._basePath, (n, h) => {
      if (!n) {
        i.loadAsync(h).then((i) => {
          try {
            let n = i.files;
            let h = Object.keys(n);
            if (0 === h.length) {
              return;
            }
            this._progressInfo.total = h.length;

            this._checkMeta(n, a, (i, h) => {
              let l = r.T("IMPORT_ASSET.confirmation_box_title");

              let _ = r.T("IMPORT_ASSET.confirmation_box_content", {
                outPath: this._outPath,
              });

              r.showImportMessageBox(l, _, (i, l) => {
                if (!i &&
                  l) {
                  s.each(
                    n,
                    (s, i) => {
                      let n = t.parse(s.name);
                      if (a[n.name + n.ext]) {
                        let a = t.join(this._outPath, s.name);

                        if (s.dir) {
                          r.createFolder(t.join(t.dirname(a), n.name));
                          this._updatePorgress(s);
                          i();
                        } else {
                          if (".meta" !== n.ext &&
                              ".prefab" !== n.ext &&
                              ".fire" !== n.ext &&
                              ".anim" !== n.ext) {
                            s
                                  .nodeStream()
                                  .pipe(e.createWriteStream(a))
                                  .on("finish", () => {
                              this._updatePorgress(s);
                              i();
                            });
                          } else {
                            this._importContent(s, h, () => {
                              this._updatePorgress(s);
                              i();
                            });
                          }
                        }
                      } else {
                        i();
                      }
                    },
                    o
                  );
                }
              });
            });
          } catch (e) {
            r.showErrorMessageBox(l, _);

            if (o) {
              o(_);
            }
          }
        });
      }
    });
  },
  importZip(t, s, i) {
    this._outPath = t;
    this._initPorgress(i);
    if ((!e.existsSync(t))) {
      let e = r.T("IMPORT_ASSET.err_title");
      let s = r.T("IMPORT_ASSET.err_info_not_exist", { outPath: t });
      r.showErrorMessageBox(e, s);
      return;
    }
    this._queryNeedImportAsset(s, (e, t) => {
      this._importAssets(t, () => {
        this._completePorgress();
        Editor.assetdb.refresh("db://assets/");
      });
    });
  },
  _initPorgress(e) {
    this._progressInfo = { curProgress: 0, total: 0, outStrLog: "" };
    this._progressCallback = e;
  },
  _updatePorgress(e) {
    let t =
      (e.dir ? r.T("IMPORT_ASSET.folder") : r.T("IMPORT_ASSET.file")) +
      " " +
      e.name;

    this._progressInfo.outStrLog = r.T("IMPORT_ASSET.progress_state_import", {
      name: t,
    });

    this._progressInfo.curProgress++;
    this._sendPorgressCallback();
  },
  _sendPorgressCallback() {
    this._progressCallback(this._progressInfo);
  },
  _completePorgress() {
    this._progressInfo.curProgress = this._progressInfo.total;
    this._progressInfo.outStrLog = r.T("IMPORT_ASSET.progress_state_end");
    this._sendPorgressCallback();
  },
};
