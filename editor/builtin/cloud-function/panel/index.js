const e = require("fire-fs");
const t = require("fs");
const n = require("fire-path");
const i = Editor.require("packages://cloud-function/panel/utils/event");
const o = Editor.require("packages://cloud-function/panel/utils/cache");
const r = Editor.require("packages://cloud-function/panel/utils/operation");
const l = Editor.require("packages://cloud-function/panel/utils/utils");
const s = Editor.require("packages://cloud-function/selection");
const c = Editor.require("packages://cloud-function/panel/utils/tcb_utils");

let a = function (e) {
    return e.length <= 1 ? e[0] : e[e.length - 1];
  };

let d = function (e) {
  let t = o.queryShowNodes();
  let n = s.curSelection("cloud-function");
  let i = a(n);
  let r = n.indexOf(i);
  let l = t.findIndex((e) => e.id === i);
  let c = t[l];
  let d = t[l + ("down" === e ? 1 : -1)];

  if (d) {
    if (d.selected) {
      c.selected = !c.selected;
      n.splice(r, 1);
    } else {
      d.selected = !d.selected;

      if (d.selected) {
        n.push(d.id);
      } else {
        n.forEach((e, t) => {
          if (e === d.id) {
            n.splice(t, 1);
          }
        });
      }
    }

    s.select("cloud-function", n, true, true);
  }
};

let u = async function (e) {
  var t = c.switchEnv(e);

  if (!t) {
    l.printToConsole("warn", l.tr("env-not-exist"));
  }

  return t;
};

let f = function (e) {
  var t = l.getCurrentEnvId();

  var n = Editor.isWin32
    ? `serverless\\cloud-function\\${t}\\`
    : `serverless/cloud-function/${t}/`;

  var i = e.split(n);
  return { envPath: i[0] + n, func_name: i[1].split(/\/|\\+/)[0] };
};

let p = function (e) {
  var t = e.split(/serverless[\/|\\]+mgobe-server[\/|\\]*/);
  return t[1] && t[1].split(/\/|\\+/)[0];
};

let h = function (e) {
  console.warn("tcbUtils", e);

  if (e.code.indexOf("AuthFailure") > -1) {
    g();
  }
};

let g = function () {
  Editor.Ipc.sendToMain("cocos-services:tcb-get-temp-key", (e, t) => {
    if (e) {
      g();
    } else {
      c.init(t);
    }
  });
};

let v = function () {
  l.printToConsole("warn", l.tr("not-env-tips"));
};

Editor.Panel.extend({
  listeners: {
    "panel-resize"() {
      this._vm.length = (this.clientHeight - 56) / o.lineHeight + 3;
    },
    "panel-show"() {
      r.loadAssets();
    },
    focus() {
      r.loadAssets(false);
    },
  },
  style: e.readFileSync(
    Editor.url("packages://cloud-function/panel/style/index.css")
  ),
  template: e.readFileSync(
    Editor.url("packages://cloud-function/panel/template/index.html")
  ),
  async ready() {
    this._vm = (function (e, t) {
      return new Vue({
        el: e,
        data: {
          length: 0,
          filter: "",
          currentPath: "serverless",
          loading: true,
          loadingTips: "loading...",
        },
        watch: {},
        methods: {},
        components: {
          tools: Editor.require(
            "packages://cloud-function/panel/component/tools"
          ),
          nodes: Editor.require(
            "packages://cloud-function/panel/component/nodes"
          ),
        },
        created() {
          r.loadAssets();

          i.on("filter-changed", (e) => {
            this.filter = e;
          });

          i.on("start-loading", (e = "loading...") => {
            this.loadingTips = e;
            this.loading = true;
          });

          i.on("finish-loading", () => {
            this.loading = false;

            s.curSelection("cloud-function").forEach((e) => {
              r.select(e, true);
            });
          });

          i.on("empty-filter", () => {
            let e = s.curSelection("cloud-function");

            if (e.length > 0) {
              this.$refs.nodes.scrollToItem(e[0]);
            }
          });

          i.emit("env_changed", l.getCurrentEnvId());
        },
      });
    })(this.shadowRoot);

    this._vm.length = (this.clientHeight - 56) / o.lineHeight + 3;
    Editor.Ipc.sendToMain("cloud-function:panel-changed", true);
    c.onTCBError = h;
    g();
    this._timer = setInterval(() => g(), 18e5);

    i.on("create-cloud-function", async (e, t) => {
      if (!e.match(/^[A-Za-z]([A-Za-z0-9-_]*)[A-Za-z0-9]$/) || e.length > 45) {
        l.printToConsole("warn", l.tr("func-name-not-standard"));
        l.printToConsole("warn", l.tr("cloud-func-name-rule"));
        r.loadAssets();
        return;
      }
      i.emit("start-loading", l.tr("creating-cloud-func"));
      var { res: o, isCreate: s } = await c.createFunction(
        {
          name: e,
          timeout: 20,
          envVariables: {},
          runtime: "Nodejs10.15",
          installDependency: true,
          isWaitInstall: true,
          triggers: [],
          ignore: [],
        },
        n.dirname(t) + "/",
        true,
        ""
      );
      r.loadAssets(false);
      i.emit("finish-loading");

      setTimeout(() => {
        r.hint(`${n.dirname(t)}/${e}`);
      }, 1e3);

      if (s) {
        l.printToConsole("info", l.tr("cloud-func-created"));
      } else {
        l.printToConsole("info", l.tr("cloud-func-exist-info"));
      }
    });
  },
  close() {
    Editor.Ipc.sendToMain("cloud-function:panel-changed", false);
    clearInterval(this._timer);
  },
  messages: {
    "cloud-function:selected"(e, t, n) {
      if ("cloud-function" !== t || !n) {
        return;
      }
      let i = a(n);
      let o = r.getRealUrl(i);

      if (null !== o) {
        this._vm.currentPath = o;
      }

      n.forEach((e) => {
        r.select(e, true);
      });
    },
    "cloud-function:unselected"(e, t, n) {
      if ("cloud-function" === t) {
        n.forEach((e) => {
          r.select(e, false);
        });
      }
    },
    "change-filter"(e, t) {
      this._vm.filter = t;
    },
    "cloud-function:refresh"() {
      r.loadAssets();
    },
    "cloud-function:end-refresh"(e) {
      this.hideLoader();
    },
    "cloud-function:start-refresh"(e) {
      this.showLoaderAfter(100);
    },
    "cloud-function:sort"(e) {
      r.autoSort();
    },
    "cloud-function:hint"(e, t) {
      this._vm.$refs.nodes.scrollToItem(t);
    },
    "cloud-function:search"(e, t) {
      this._vm.filter = t;
    },
    "cloud-function:clearSearch"(e) {
      this._vm.filter = "";
    },
    "cloud-function:custom-server-new"(e, t, n) {
      console.log(t);
      const i =
        s.contexts("cloud-function")[0] || s.curActivate("cloud-function");
      console.log(i);
      console.log(s.contexts("cloud-function")[0]);
    },
    "cloud-function:custom-server-release-stop"(e, t, n) {
      Editor.Ipc.sendToMain(
        "cocos-services:plugin-messages",
        "mgobe:release-custom-server",
        { server_name: p(t.assetUuid), release_type: 1 }
      );
    },
    "cloud-function:custom-server-release-not-stop"(e, t, n) {
      Editor.Ipc.sendToMain(
        "cocos-services:plugin-messages",
        "mgobe:release-custom-server",
        { server_name: p(t.assetUuid), release_type: 0 }
      );
    },
    async "cloud-function:cloud-function-new"(e, t, i) {
      if (!l.checkedCurrentEnvId() || !(await l.checkedEnableTCB())) {
        return v();
      }
      var o = t.assetUuid;

      if (!(void 0 !== o && "" != o)) {
        o = n.join(
              Editor.Project.path,
              "./serverless/cloud-function",
              t.env_id
            );
      }

      if (
        (u(t.env_id))
      ) {
        var s = r.add(`${o}/function`, true);
        r.rename(s.id);
      }
    },
    async "cloud-function:cloud-function-list"(e, n, o) {
      if (!l.checkedCurrentEnvId() || !(await l.checkedEnableTCB())) {
        return v();
      }
      if (u(n.env_id)) {
        i.emit("start-loading", l.tr("syncing-cloud-func-list"));
        var a = await c.listFunctions();
        for (var d of a) {
          var f = s.contexts("cloud-function")[0] + "/" + d.FunctionName;

          if (!t.existsSync(f)) {
            t.mkdirSync(f);
          }
        }
        r.loadAssets();
        i.emit("finish-loading");
        l.printToConsole("info", l.tr("cloud-func-synced"));
      }
    },
    async "cloud-function:cloud-function-upload"(e, n, o) {
      if (!l.checkedCurrentEnvId() || !(await l.checkedEnableTCB())) {
        return v();
      }
      if (u(n.env_id)) {
        var { envPath: r, func_name: s } = f(n.assetUuid);
        if (!t.existsSync(r + s + "/index.js") &&
        !t.existsSync(r + s + "/index.php")) {
          l.printToConsole("warn", l.tr("cloud-func-format-error"));
          return;
        }
        i.emit("start-loading", l.tr("uploading-cloud-func"));
        await c.updateFunctionCode(
          {
            name: s,
            runtime: t.existsSync(r + s + "/index.js") ? "Nodejs8.9" : "Php7",
            installDependency: true,
          },
          r,
          ""
        );
        i.emit("finish-loading");
        l.printToConsole("info", l.tr("cloud-func-uploaded"));
      }
    },
    async "cloud-function:cloud-function-download"(e, t, n) {
      if (!l.checkedCurrentEnvId() || !(await l.checkedEnableTCB())) {
        return v();
      }
      if (u(t.env_id)) {
        i.emit("start-loading", l.tr("donwloading-cloud-func"));
        var { envPath: o, func_name: s } = f(t.assetUuid);

        if (0 ===
        (await c.listFunctions()).filter((e) => e.FunctionName === s).length) {
          l.printToConsole("warn", l.tr("cloud-func-not-exist"));
        } else {
          await c.downloadFunction(s, o);
          l.printToConsole("info", l.tr("cloud-func-downloaded"));
        }

        r.loadAssets();
        i.emit("finish-loading");
      }
    },
    async "cloud-function:cloud-function-delete"(e, t, o) {
      if (!l.checkedCurrentEnvId() || !(await l.checkedEnableTCB())) {
        return v();
      }
      if (!u(t.env_id)) {
        return;
      }
      let s = Editor.Dialog.messageBox({
        type: "warning",
        buttons: [
          Editor.T("MESSAGE.cancel"),
          l.tr("delete-local-func"),
          l.tr("delete-local-server-func"),
        ],
        title: Editor.T("MESSAGE.warning"),
        message: Editor.T("MESSAGE.warning"),
        detail: l.tr("delete-cloud-func-warn"),
        defaultId: 0,
        cancelId: 0,
      });
      if (0 != s) {
        i.emit("start-loading", l.tr("deleting-cloud-func"));
        var { envPath: a, func_name: d } = f(t.assetUuid);

        if (2 === s) {
          (await c.deleteFunction(d));
        }

        if (0 !== s) {
          l.removeDir(n.join(a, d));
        }

        r.loadAssets();
        i.emit("finish-loading");
        l.printToConsole("info", l.tr("cloud-func-deleted"));
      }
    },
    "cloud-function:find-usages"(e, t) {
      this._vm.filter = "used:" + t;
    },
    "cloud-function:rename"(e, t) {
      r.rename(t);
    },
    "cloud-function:delete"(e, t) {
      this._delete(t);
    },
    "cloud-function:hint"(e, t) {
      r.hint(t);
    },
    "cloud-function:env-changed"(e, t) {
      i.emit("env_changed", t);
      r.loadAssets();

      if ("undefinedenv" !== t) {
        if (!c.inited) {
          g();
        }

        c.switchEnv(t);

        if (e.reply) {
          e.reply(null, true);
        }
      }
    },
    async "cloud-function:query-tcb-safety-source"(e, t, n) {
      if (void 0 === t || null === t || "" === t) {
        return e.reply && e.reply(new Error("envID is Empty"), null);
      }
      if (void 0 === n || null === n || "" === n) {
        return e.reply && e.reply(new Error("appName is Empty"), null);
      }
      try {
        if ("undefinedenv" === t) {
          return e.reply && e.reply("envID is undefinedenv", null);
        }
        var i = (await c.describeSafetySource(t)).Data.filter(
          (e) => e.AppName === n
        )[0];

        if (void 0 === i) {
          i = await c.createSafetySource(n, t);
        }

        var o = await c.describeSafetySourceSecretKey(i.Id, t);

        var r = {
          env: t,
          appSign: n,
          appAccessKeyId: i.AppSecretVersion,
          appAccessKey: o.AppSecretKey,
        };

        if (e.reply) {
          e.reply(null, r);
        }
      } catch (t) {
        console.log(t);

        if (e.reply) {
          e.reply(t, null);
        }
      }
    },
    async "cloud-function:query-tcb-safety-source-available"(e, t) {
      if (void 0 === t || null === t || "" === t) {
        return e.reply && e.reply(new Error("envID is Empty"), null);
      }
      if ("undefinedenv" === t) {
        return e.reply && e.reply(new Error("envID is undefinedenv"), null);
      }
      g();
      var n = await c.describeSafetySource(t);

      if (e.reply) {
        e.reply(null, n.Data ? n.Data : []);
      }
    },
  },
  selectAll(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = o.queryShowNodes().map((e) => e.id);
    s.select("cloud-function", t, true, true);
  },
  showLoaderAfter(e) {
    if (!(this._vm.loading || this._loaderID)) {
      this._loaderID = setTimeout(() => {
        this._vm.loading = true;
        this._loaderID = null;
      }, e);
    }
  },
  hideLoader() {
    this._vm.loading = false;
    clearTimeout(this._loaderID);
  },
  find(e) {},
  delete(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = s.curSelection("cloud-function");
    this._delete(t);
  },
  f2(e) {},
  left(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = s.curSelection("cloud-function");
    let n = a(t);
    r.fold(n, true);
  },
  right(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = s.curSelection("cloud-function");
    let n = a(t);
    r.fold(n, false);
  },
  async copyFile(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this._copyUuids = null;
    let t = [];
    let n = s.curSelection("cloud-function");
    for (let e = 0; e < n.length; e++) {
      if (!(await l.isReadOnly(n[e]))) {
        t.push(n[e]);
      }
    }
    this._copyUuids = t.length > 0 ? t : null;
  },
  async pasteFile(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = s.curActivate("cloud-function");
    let i = "";

    if ("mount-assets" === t) {
      i = Editor.url("db://assets");
    } else {
      if (Editor.Utils.UuidUtils.isUuid(t)) {
        i = await l.uuid2path(t);
      }
    }

    if (!(await l.isDir(i)) && ((i = n.dirname(i)), !(await l.isDir(i)))) {
      return Editor.warn("The selected location is not a folder.");
    }
    if (this._copyUuids && (await l.exists(i))) {
      for (let e = 0; e < this._copyUuids.length; e++) {
        let t = this._copyUuids[e];
        if (await l.isReadOnly(t)) {
          return;
        }
        let o = await l.uuid2path(t);
        if (!o) {
          return Editor.warn(`File is missing - ${t}`);
        }
        let r = n.basename(o);
        let s = n.join(i, r);
        if (l.isSubDir(n.dirname(s), n.dirname(o))) {
          return Editor.warn(`Cannot place directory into itself - ${t}`);
        }
        if (!(s = await l.copy(o, s))) {
          return;
        }
        let c = n.relative(Editor.url("db://assets"), s);
        Editor.assetdb.refresh(`db://assets/${c}`);
      }
    }
  },
  shiftUp(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    d("up");
  },
  shiftDown(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    d("down");
  },
  up(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  down(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  _delete(e) {
    let t = e.map((e) => r.getRealUrl(e));
    let n = t;

    if (n.length > 3) {
      (n = n.slice(0, 3)).push("...");
    }

    n = n.join("\n");

    if (0 ===
      Editor.Dialog.messageBox({
        type: "warning",
        buttons: [Editor.T("MESSAGE.delete"), Editor.T("MESSAGE.cancel")],
        title: Editor.T("MESSAGE.assets.delete_title"),
        message: Editor.T("MESSAGE.assets.delete_message") + "\n" + n,
        detail: Editor.T("MESSAGE.assets.delete_detail"),
        defaultId: 0,
        cancelId: 1,
        noLink: true,
      })) {
      Editor.assetdb.delete(t);
    }
  },
});
