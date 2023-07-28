"use strict";
const t = require("./tasks");
const s = require("./meta");
const e = require("fire-path");
const a = require("fire-fs");

module.exports = {
  urlToUuid(t) {
    let s = this._fspath(t);
    return this.fspathToUuid(s);
  },
  fspathToUuid(t) {
    return this._path2uuid[t];
  },
  uuidToFspath(t) {
    return this._uuid2path[t];
  },
  uuidToUrl(t) {
    let s = this.uuidToFspath(t);
    return this._url(s);
  },
  fspathToUrl(t) {
    return this._url(t);
  },
  urlToFspath(t) {
    return this._fspath(t);
  },
  exists(t) {
    let s = this.urlToUuid(t);
    return this.existsByUuid(s);
  },
  existsByUuid(t) {
    return !!this._uuid2path[t];
  },
  existsByPath(t) {
    return !!this._path2uuid[t];
  },
  isSubAsset(t) {
    let s = this._fspath(t);
    return !!s && this.isSubAssetByPath(s);
  },
  isSubAssetByUuid(t) {
    let s = this.uuidToFspath(t);
    return !!s && this.isSubAssetByPath(s);
  },
  isSubAssetByPath: (t) => false === a.isDirSync(e.dirname(t)),
  containsSubAssets(t) {
    let s = this._fspath(t);
    return !!s && this.containsSubAssetsByPath(s);
  },
  containsSubAssetsByUuid(t) {
    let s = this.uuidToFspath(t);
    return !!s && this.containsSubAssetsByPath(s);
  },
  containsSubAssetsByPath(t) {
    if ("" === e.extname(t)) {
      return false;
    }
    let s = this._allPaths();
    let a = s.indexOf(t);
    if (a >= 0) {
      let i = s[++a];
      if (i && e.contains(t, i)) {
        return true;
      }
    }
    return false;
  },
  assetInfo(t) {
    let s = this._fspath(t);
    return s ? this.assetInfoByPath(s) : null;
  },
  assetInfoByUuid(t) {
    let s = this.uuidToFspath(t);
    return s ? this.assetInfoByPath(s, t) : null;
  },
  assetInfoByPath(t, e) {
    let a = this._url(t);
    e = e || this.fspathToUuid(t);
    let i;
    let u = s.get(this, e);
    if (u) {
      i = u.assetType();
    } else {
      i = s.findCtor(this, t).defaultType();
    }
    return {
      uuid: e,
      path: t,
      url: a,
      type: i,
      isSubAsset: this.isSubAssetByPath(t),
    };
  },
  subAssetInfos(t) {
    let s = this._fspath(t);
    return this.subAssetInfosByPath(s);
  },
  subAssetInfosByUuid(t) {
    let s = this.uuidToFspath(t);
    return this.subAssetInfosByPath(s);
  },
  subAssetInfosByPath(t) {
    let s = [];
    if ("string" == typeof t && "" !== e.extname(t)) {
      let a = this._allPaths();
      let i = a.indexOf(t);
      if (i >= 0) {
        let u;
        let h = a[++i];
        for (; h && e.contains(t, h); ) {
          u = this.assetInfoByPath(h);
          s.push(u);
          h = a[++i];
        }
      }
    }
    return s;
  },
  loadMeta(t) {
    let s = this._fspath(t);
    return this.loadMetaByPath(s);
  },
  loadMetaByUuid(t) {
    let s = this.uuidToFspath(t);
    return this.loadMetaByPath(s);
  },
  loadMetaByPath(t) {
    return s.load(this, t + ".meta");
  },
  isMount(t) {
    let s = this.urlToUuid(t);
    return this.isMountByUuid(s);
  },
  isMountByPath(t) {
    let s = this.fspathToUuid(t);
    return this.isMountByUuid(s);
  },
  isMountByUuid(t) {
    return t.startsWith(this._MOUNT_PREFIX);
  },
  mountInfo(t) {
    let s = this._fspath(t);
    return this.mountInfoByPath(s);
  },
  mountInfoByUuid(t) {
    let s = this.uuidToFspath(t);
    return this.mountInfoByPath(s);
  },
  mountInfoByPath(t) {
    if (!t) {
      return null;
    }
    for (let s in this._mounts) {
      let a = this._mounts[s];
      if (e.contains(a.path, t)) {
        return a;
      }
    }
    return null;
  },
  mount(s, e, a, i) {
    if ("function" == typeof a) {
      i = a;
      a = {};
    }

    this._tasks.push({ name: "mount", run: t.mount, params: [s, e, a] }, i);
  },
  attachMountPath(s, e) {
    this._tasks.push(
      { name: "attachMountPath", run: t.attachMountPath, params: [s] },
      (t, s) => {
        if (t) {
          if (e) {
            e(t);
          }

          return;
        }
        this._handleRefreshResults(s);

        if (e) {
          e(null, s);
        }
      }
    );
  },
  unattachMountPath(s, e) {
    this._tasks.push(
      { name: "unattachMountPath", run: t.unattachMountPath, params: [s] },
      (t, s) => {
        if (t) {
          if (e) {
            e(t);
          }

          return;
        }
        this._handleRefreshResults(s);

        if (e) {
          e(null, s);
        }
      }
    );
  },
  unmount(s, e) {
    this._tasks.push({ name: "unmount", run: t.unmount, params: [s] }, e);
  },
  init(s) {
    this._tasks.push({ name: "init", run: t.init, params: [] }, s);
  },
  refresh(s, e) {
    let a = this._fspath(s);
    this._tasks.push(
      { name: "refresh", run: t.refresh, params: [a] },
      (t, s) => {
        if (t) {
          if (e) {
            e(t);
          }

          return;
        }
        this._handleRefreshResults(s);

        if (e) {
          e(null, s);
        }
      }
    );
  },
  deepQuery(s) {
    this._tasks.push(
      { name: "deep-query", run: t.deepQuery, params: [], silent: true },
      s
    );
  },
  queryAssets(s, e, a) {
    let i = this._fspath(s);
    this._tasks.push(
      { name: "query-assets", run: t.queryAssets, params: [i, e], silent: true },
      a
    );
  },
  queryMetas(s, e, a) {
    let i;
    if (s.startsWith("db://*")) {
      if ("db://**" !== s && "db://**/*" !== s) {
        return a(new Error(`Unsupported pattern "${s}"`));
      }
      i = null;
    } else {
      i = this._fspath(s);
    }
    this._tasks.push(
      { name: "query-metas", run: t.queryMetas, params: [i, e], silent: true },
      a
    );
  },
  move(s, e, a) {
    let i = this._fspath(s);
    let u = this._fspath(e);
    this._tasks.push({ name: "move", run: t.move, params: [i, u] }, (t, s) => {
      if (t) {
        if (a) {
          a(t);
        }

        return;
      }
      let e = [];
      let i = [];
      for (let t = 0; t < s.length; ++t) {
        let a = s[t].subMetas;

        if (a) {
          e = e.concat(a.deleted);
          i = i.concat(a.added);
          delete s[t].diff;
        }
      }
      for (let t = e.length - 1; t >= 0; --t) {
        let a = e[t];
        for (let u = i.length - 1; u >= 0; --u) {
          let h = i[u];

          if (a.uuid === h.uuid) {
            s.push({
              uuid: h.uuid,
              type: h.type,
              url: Editor.assetdb.uuidToUrl(h.uuid),
              parentUuid: h.parentUuid,
              srcPath: a.path,
              destPath: h.path,
              isSubAsset: h.isSubAsset,
            });
          }

          i.splice(u, 1);
          e.splice(t, 1);
          break;
        }
      }
      this._dispatchEvent("asset-db:assets-moved", s);

      if (e.length > 0) {
        this._dispatchEvent("asset-db:assets-deleted", e);
      }

      if (i.length > 0) {
        this._dispatchEvent("asset-db:assets-created", i);
      }

      if (a) {
        a(null, s);
      }
    });
  },
  delete(s, e) {
    this._tasks.push({ name: "delete", run: t.delete, params: [s] }, (t, s) => {
      if (s && s.length > 0) {
        this._dispatchEvent("asset-db:assets-deleted", s);
      }

      if (e) {
        e(t, s);
      }
    });
  },
  create(s, e, a) {
    let i = this._fspath(s);
    this._tasks.push(
      { name: "create", run: t.create, params: [i, e] },
      (t, e) => {
        if (t) {
          this.error("Failed to create asset %s, messages: %s", s, t.stack);

          if (a) {
            a(t);
          }

          return;
        }
        this._dispatchEvent("asset-db:assets-created", e);

        if (a) {
          a(null, e);
        }
      }
    );
  },
  saveExists(s, e, a) {
    let i = this._fspath(s);
    this._tasks.push(
      { name: "update", run: t.saveExists, params: [i, e] },
      (t, e) => {
        if (t) {
          this.error(`Failed to update asset ${s}, messages: ${t.stack}`);

          if (e) {
            this._handleRefreshResults([e]);
          }

          if (a) {
            a(t);
          }

          return;
        }
        let i = e.meta;
        let u = e.subMetas;

        this._dispatchEvent("asset-db:asset-changed", {
          uuid: i.uuid,
          type: i.assetType(),
        });

        if (u.deleted.length > 0) {
          this._dispatchEvent("asset-db:assets-deleted", u.deleted);
        }

        if (u.added.length > 0) {
          this._dispatchEvent("asset-db:assets-created", u.added);
        }

        if (e.meta._assetdb) {
          e.meta = Object.assign({}, i);
          delete e.meta._assetdb;
        }

        if (a) {
          a(null, e);
        }
      }
    );
  },
  import(s, e, a) {
    let i = this._fspath(e);
    this._tasks.push(
      { name: "import", run: t.import, params: [s, i] },
      (t, s) => {
        if (t) {
          this.error(
            "Failed to import assets to %s, messages: %s",
            e,
            t.stack
          );

          if (a) {
            a(t);
          }

          return;
        }
        let i = [];
        let u = [];
        for (var h = 0; h < s.length; h++) {
          if (s[h].command) {
            u.push(s[h]);
          } else {
            i.push(s[h]);
          }
        }

        if (i && i.length > 0) {
          this._dispatchEvent("asset-db:assets-created", i);
        }

        if (u && u.length > 0) {
          this._handleRefreshResults(u);
        }

        if (a) {
          a(null, s);
        }
      }
    );
  },
  saveMeta(s, e, a) {
    this._tasks.push(
      { name: "save-meta", run: t.saveMeta, params: [s, e] },
      (t, e) => {
        if (t) {
          this.error(`Failed to save meta ${t.stack}`);

          if (a) {
            a(t);
          }

          return;
        }
        let i = e.meta;
        let u = e.subMetas;

        this._dispatchEvent("asset-db:asset-changed", {
          uuid: s,
          type: i.assetType(),
        });

        if (u.remained.length > 0) {
          u.remained.forEach((t) => {
            this._dispatchEvent("asset-db:asset-changed", {
              uuid: t.uuid,
              type: t.type,
            });
          });
        }

        if (u.deleted.length > 0) {
          this._dispatchEvent("asset-db:assets-deleted", u.deleted);
        }

        if (u.added.length > 0) {
          this._dispatchEvent("asset-db:assets-created", u.added);
        }

        if (a) {
          a(null, e);
        }
      }
    );
  },
  exchangeUuid(s, e, a) {
    let i = this._fspath(s);
    let u = this._fspath(e);
    this._tasks.push(
      { name: "exchange-uuid", run: t.exchangeUuid, params: [i, u] },
      a
    );
  },
  clearImports(s, e) {
    let a = this._fspath(s);
    this._tasks.push(
      { name: "clear-imports", run: t.clearImports, params: [a, null] },
      e
    );
  },
  register(t, e, a) {
    s.register(this, t, e, a);
  },
  unregister(t) {
    s.unregister(this, t);
  },
  setDefaultMetaType(t) {
    s.defaultMetaType = t;
  },
  getRelativePath(t) {
    let s = null;
    for (let a in this._mounts) {
      let i = this._mounts[a].path;
      if (e.contains(i, t)) {
        s = e.relative(i, t);
        break;
      }
    }
    return s;
  },
  getAssetBackupPath(t) {
    if (!this.assetBackupPath) {
      return null;
    }
    let s = this.mountInfoByPath(t);
    if (!s) {
      return null;
    }
    let a = e.relative(s.path, t);
    return e.join(this.assetBackupPath, s.mountPath, a);
  },
  setEventCallback(t) {
    this._eventCallback = t;
  },
  getCachePath(t) {
    return e.join(this.cache, t.substring(0, 2), t);
  },
};
