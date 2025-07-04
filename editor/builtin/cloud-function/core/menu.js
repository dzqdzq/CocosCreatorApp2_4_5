"use strict";
const e = require("electron");
const s = require("fire-fs");
const n = (require("fire-path"), require("path"));
const t = require("../selection");

let o = function () {
  const e = `${Editor.Project.path}/settings/serverless.json`;
  var n = s.existsSync(e) ? s.readFileSync(e) : "{}";
  var t = null;
  try {
    t = JSON.parse(n);
  } catch (e) {}
  return t && t.env_id ? t.env_id : "undefinedenv";
};

let i = function (e, ...s) {
  return Editor.T(`cloud-function.${e}`, ...s);
};

let l = function (e) {
  var n = a();
  if ("" === n) {
    return false;
  }
  n += Editor.isWin32 ? "\\" : "/";
  if (e.split(n).length <= 1) {
    return false;
  }
  var t = e.split(n)[1];
  var o = e.replace(t, t.split(/[\/|\\]+/)[0]);
  return s.existsSync(o + "/index.js") || s.existsSync(o + "/index.php");
};

function a() {
  const e = /serverless[\/|\\]+cloud-function[\/|\\]+/;
  const s = /[\/|\\]+/;
  let n = t.contexts("cloud-function")[0];
  if (n.match(e)) {
    var o = n.split(e);
    if (o.length >= 2) {
      return o[1].split(s)[0];
    }
  }
  return "";
}

module.exports = {
  getContextTemplate: function (c, u, r, d) {
    var f = [];
    if (r) {
      if (r.indexOf("mgobe-server") > -1) {
        f = f.concat([
          {
            label: i("create-custom-server"),
            message: "cloud-function:custom-server-new",
            visible: false,
            params: [
              { assetType: c, allowAssign: u, assetUuid: r, copyEnable: d },
            ],
          },
          {
            label: i("publish-reboot"),
            message: "cloud-function:custom-server-release-stop",
            visible: "mount" !== c,
            params: [
              { assetType: c, allowAssign: u, assetUuid: r, copyEnable: d },
            ],
          },
          {
            label: i("publish-noreboot"),
            message: "cloud-function:custom-server-release-not-stop",
            visible: "mount" !== c,
            params: [
              { assetType: c, allowAssign: u, assetUuid: r, copyEnable: d },
            ],
          },
        ]);
      } else {
        if (
          r.indexOf("cloud-function") > -1 &&
          "cloud-function" !== n.basename(r)
        ) {
          let e = a();

          let s = (function (e) {
            let s = t.contexts("cloud-function")[0];
            return n.basename(s) === e;
          })(e);

          f = f.concat([
            {
              label: i("create-cloud-func"),
              message: "cloud-function:cloud-function-new",
              visible: s,
              params: [
                {
                  assetType: c,
                  allowAssign: u,
                  assetUuid: r,
                  env_id: e,
                  copyEnable: d,
                },
              ],
            },
            {
              label: i("sync-cloud-func"),
              message: "cloud-function:cloud-function-list",
              visible: s,
              params: [
                {
                  assetType: c,
                  allowAssign: u,
                  assetUuid: r,
                  env_id: e,
                  copyEnable: d,
                },
              ],
            },
            {
              label: i("upload-cloud-func"),
              message: "cloud-function:cloud-function-upload",
              visible: "mount" !== c && !s,
              enabled: l(r),
              params: [
                {
                  assetType: c,
                  allowAssign: u,
                  assetUuid: r,
                  env_id: e,
                  copyEnable: d,
                },
              ],
            },
            {
              label: i("download-cloud-func"),
              message: "cloud-function:cloud-function-download",
              visible: "mount" !== c && !s,
              params: [
                {
                  assetType: c,
                  allowAssign: u,
                  assetUuid: r,
                  env_id: e,
                  copyEnable: d,
                },
              ],
            },
            {
              label: i("delete-cloud-func"),
              message: "cloud-function:cloud-function-delete",
              visible: "mount" !== c && !s,
              params: [
                {
                  assetType: c,
                  allowAssign: u,
                  assetUuid: r,
                  env_id: e,
                  copyEnable: d,
                },
              ],
            },
          ]);
        }
      }
    }
    return (f = f.concat([
      { type: "separator" },
      {
        label: Editor.isDarwin
          ? Editor.T("ASSETS.reveal_mac")
          : Editor.T("ASSETS.reveal_win"),
        click() {
          if (!(r && s.existsSync(r))) {
            r = `${Editor.Project.path}/serverless/cloud-function/${o()}`;
          }

          if (r && s.existsSync(r)) {
            e.shell.showItemInFolder(r);
          } else {
            Editor.failed("Can not found the asset %s", r);
          }
        },
      },
    ]));
  },
  getCreateTemplate: function (e, s, n) {
    return [
      {
        label: i("create-cloud-func"),
        message: "cloud-function:cloud-function-new",
        params: [
          {
            assetType: s,
            env_id: o(),
            visible: "undefinedenv" !== o,
            assetUuid: n,
          },
        ],
      },
      {
        label: i("create-custom-server"),
        message: "cloud-function:custom-server-new",
        visible: false,
        params: [{ assetType: s, assetUuid: n }],
      },
    ];
  },
};
