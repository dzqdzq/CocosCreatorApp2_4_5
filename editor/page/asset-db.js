"use strict";
let e = {
  remote: Editor.remote.assetdb,
  library: Editor.remote.assetdb.library,
  explore(e) {
    Editor.Ipc.sendToMain("asset-db:explore", e, -1);
  },
  exploreLib(e) {
    Editor.Ipc.sendToMain("asset-db:explore-lib", e, -1);
  },
  queryPathByUrl: (e, s) =>
    Editor.Ipc.sendToMain("asset-db:query-path-by-url", e, s, -1),
  queryUuidByUrl: (e, s) =>
    Editor.Ipc.sendToMain("asset-db:query-uuid-by-url", e, s, -1),
  queryPathByUuid: (e, s) =>
    Editor.Ipc.sendToMain("asset-db:query-path-by-uuid", e, s, -1),
  queryUrlByUuid: (e, s) =>
    Editor.Ipc.sendToMain("asset-db:query-url-by-uuid", e, s, -1),
  queryInfoByUuid: (e, s) =>
    Editor.Ipc.sendToMain("asset-db:query-info-by-uuid", e, s, -1),
  queryMetaInfoByUuid: (e, s) =>
    Editor.Ipc.sendToMain("asset-db:query-meta-info-by-uuid", e, s, -1),
  deepQuery: (e) => Editor.Ipc.sendToMain("asset-db:deep-query", e, -1),
  queryAssets: (e, s, t) =>
    Editor.Ipc.sendToMain("asset-db:query-assets", e, s, t, -1),
  import(e, s, t, d) {
    Editor.Ipc.sendToMain("asset-db:import-assets", e, s, t, d, -1);
  },
  create(e, s, t) {
    Editor.Ipc.sendToMain("asset-db:create-asset", e, s, t, -1);
  },
  move(e, s, t, d) {
    Editor.Ipc.sendToMain("asset-db:move-asset", e, s, t, d, -1);
  },
  delete(e, s) {
    Editor.Ipc.sendToMain("asset-db:delete-assets", e, s, -1);
  },
  saveExists(e, s, t) {
    Editor.Ipc.sendToMain("asset-db:save-exists", e, s, t, -1);
  },
  createOrSave(e, s, t) {
    Editor.Ipc.sendToMain("asset-db:create-or-save", e, s, t, -1);
  },
  saveMeta(e, s, t) {
    Editor.Ipc.sendToMain("asset-db:save-meta", e, s, t, -1);
  },
  refresh(e, s) {
    Editor.Ipc.sendToMain("asset-db:refresh", e, s, -1);
  },
};
const s = Editor.require("app://asset-db/lib/meta");

if (!Editor.metas) {
  Editor.metas = {};
}

Editor.metas["raw-asset"] = s.RawAssetMeta;
Editor.metas.asset = s.AssetMeta;
Editor.metas.folder = s.FolderMeta;
Editor.assetdb = e;
