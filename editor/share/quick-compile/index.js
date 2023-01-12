const e = require("fire-fs"),
  t = require("fire-path"),
  i = require("module-deps"),
  s = require("JSONStream"),
  r = require("concat-stream"),
  o = require("browser-resolve"),
  a = require("del"),
  c = require("browserify/lib/builtins.js"),
  n = require("lodash"),
  { promisify: l } = require("util"),
  { formatPath: h, isNodeModulePath: p } = require("./utils"),
  u = "undefined" == typeof Editor;
let d = null;
function m() {
  (this._scriptsCache = {}),
    (this._scriptsToCompile = []),
    (this._missingScripts = []),
    (this._watchedScripts = []),
    (this._fileStats = {}),
    (this._mtimes = []),
    (this.plugins = []),
    (this.excludes = []);
}
(d = u
  ? function (e) {
      console.error(e);
    }
  : function (e) {
      Editor.error(e);
    }),
  Object.assign(m.prototype, {
    async watch(e, t) {
      await this.build(e), this._createWatcher(e);
    },
    _createWatcher(e) {
      console.log("watching...");
      const i = require("chokidar");
      this.watching = !0;
      let s = (e.exts || [".js"]).map((e) => t.join(this.root, "**/*" + e)),
        r = i.watch(s, { ignored: t.join(this.out, "**"), ignoreInitial: !0 });
      r.on("all", (t, i) => {
        if (((i = h(i)), "add" === t))
          return (
            (i = [i].concat(this._missingScripts)),
            this.compileScripts(i),
            void 0
          );
        this._scriptsCache[i] &&
          ("change" === t
            ? e.onlyRecordChanged
              ? (this._watchedScripts = n.union(this._watchedScripts, [i]))
              : this.compileScripts(i)
            : "unlink" === t && this.removeScripts(i));
      }),
        this.watcher && this.watcher.close(),
        (this.watcher = r);
    },
    async build(e) {
      if (!e.entries) throw new Error("Please specify the entries");
      Array.isArray(e.entries) || (e.entries = [e.entries]),
        (this.entries = e.entries.map(h)),
        (this.getRelativePath = e.getRelativePath || this.getRelativePath);
      let t = e.root;
      if (!t) throw new Error("Please specify the root directory");
      this.root = t;
      let i = e.out;
      if ((i || (i = "./quick-compile-temp"), (this.out = i), e.clear))
        try {
          a.sync(i.replace(/\\/g, "/"), { force: !0 });
        } catch (e) {
          d(e);
        }
      e.plugins &&
        Array.isArray(e.plugins) &&
        (this.plugins = e.plugins.concat(this.plugins)),
        e.excludes &&
          Array.isArray(e.excludes) &&
          (this.excludes = e.excludes.concat(this.excludes)),
        await this.rebuild();
    },
    clearCache() {
      this._scriptsCache = {};
    },
    async _readFileStats() {
      this._fileStats = {};
      let i = t.join(this.out, "__file_stats__.json");
      if (!e.existsSync(i)) return;
      let s = await l(e.readJson)(i);
      "1.0.8" === s.version
        ? (this._fileStats = s.stats)
        : a.sync(this.out.replace(/\\/g, "/"), { force: !0 });
    },
    async _writeFileStats() {
      let i = t.join(this.out, "__file_stats__.json");
      await l(e.writeJson)(i, { version: "1.0.8", stats: this._fileStats });
    },
    async rebuild() {
      if ((await this._readFileStats(), this.watching)) {
        if (
          (console.time("QuickCompiler watching rebuild finished"),
          0 === this._watchedScripts.length)
        )
          return (
            console.timeEnd("QuickCompiler watching rebuild finished"), void 0
          );
        await Promise.all(this.entries.map(async (e) => this._transform(e))),
          await Promise.all(
            this._watchedScripts.map(async (e) => this._parseEntry(e, !1))
          ),
          (this._watchedScripts.length = 0);
      } else
        console.time("QuickCompiler rebuild finished"),
          await Promise.all(this.entries.map(async (e) => this._transform(e))),
          await Promise.all(
            this.entries.map(async (e) => this._parseEntry(e, !0))
          ),
          await this._compileFinished(),
          console.timeEnd("QuickCompiler rebuild finished");
      await this._writeFileStats();
    },
    getRelativePath(e) {
      return h(t.relative(this.root, e));
    },
    getDstPath(e) {
      if (p(e)) return this.getNodeModuleDstPath(e);
      let i = this.getRelativePath(e);
      return h(t.join(this.out, t.stripExt(i) + ".js"));
    },
    getNodeModuleDstPath(e) {
      let i = t.join(
        "__node_modules",
        e.slice(e.indexOf("/node_modules/") + "/node_modules/".length)
      );
      return (i = t.stripExt(i) + ".js"), t.join(this.out, i);
    },
    async compileScripts(e) {
      Array.isArray(e) || (e = [e]),
        (this._scriptsToCompile = n.union(this._scriptsToCompile, e)),
        await this._compileScripts();
    },
    async _compileScripts() {
      console.time("compileScript"),
        await Promise.all(
          this._scriptsToCompile.map(async (e) => this._parseEntry(e, !1))
        ),
        (this._scriptsToCompile.length = 0),
        await this._compileFinished(),
        console.timeEnd("compileScript");
    },
    async removeScripts(t) {
      Array.isArray(t) || (t = [t]);
      let i = t.map((t) => {
        let i = this.getDstPath(t);
        e.existsSync(i) && a.sync(i.replace(/\\/g, "/"), { force: !0 });
        let s = i + ".info.json";
        return (
          e.existsSync(s) && a.sync(s.replace(/\\/g, "/"), { force: !0 }), i
        );
      });
      this._scriptsToCompile = n.pullAll(this._scriptsToCompile, t);
      for (let e = 0; e < i.length; e++) delete this._scriptsCache[i[e]];
      await this._compileFinished();
    },
    removeCachedScripts(e) {
      Array.isArray(e) || (e = [e]),
        e.forEach((e) => {
          (e = h(e)), delete this._scriptsCache[e];
        });
    },
    async _transform(i) {
      if (
        (this.watching && console.time("_transform: " + i),
        (i = h(i)),
        this.excludes.find((e) => i.match(e)))
      )
        return null;
      let s = { src: i, dst: this.getDstPath(i) },
        r = await l(e.stat)(i);
      if (this._fileStats[i] === r.mtime.toJSON() && e.existsSync(s.dst))
        return this._scriptsCache[i]
          ? this._scriptsCache[i]
          : ((s.source = await l(e.readFile)(s.dst, "utf8")), s);
      s.source = await l(e.readFile)(i, "utf8");
      for (let e = 0; e < this.plugins.length; e++) {
        let t = this.plugins[e];
        if ((!p(i) || t.nodeModule) && t.transform)
          try {
            await t.transform(s, this);
          } catch (e) {
            d(e);
          }
      }
      return (
        await l(e.ensureDir)(t.dirname(s.dst)),
        await l(e.writeFile)(s.dst, s.source),
        this.watching && console.timeEnd("_transform: " + i),
        (r = await l(e.stat)(i)),
        (this._fileStats[i] = r.mtime.toJSON()),
        (this._scriptsCache[i] = s),
        s
      );
    },
    _isFileInCache(e) {
      return this._scriptsCache[e];
    },
    _refineScript(e) {
      (e.src = h(e.file)), (e.dst = this.getDstPath(e.src)), delete e.file;
      for (let t in e.deps) e.deps[t] = h(e.deps[t]);
    },
    _parseModules(e, t, a) {
      (e = h(e)), console.time(`Parse [${e}]`);
      let l = 0,
        u = r((i) => {
          console.log(`Parse [${e}]: walk ${l}  files.`),
            console.timeEnd(`Parse [${e}]`);
          let s = i.toString();
          s = `{"scripts": ${s}}`;
          let r = [];
          try {
            r = JSON.parse(s).scripts;
          } catch (e) {
            d(e);
          }
          let o = this._scriptsCache;
          r.forEach((i) => {
            this._refineScript(i),
              (t || i.src === e || p(i.src)) && (o[i.src] = i);
          }),
            a();
        }),
        m = { extensions: [".js", ".json", ".ts"], ignoreMissing: !0 };
      (m.modules = Object.assign(Object.create(null), c)),
        (m.cache = {}),
        (m.resolve = (e, t, i) => {
          let s = "";
          if (
            (this.plugins.forEach((i) => {
              i.resolve && (s = i.resolve(e, t));
            }),
            s)
          )
            return i(null, s);
          (t.paths = require.main.paths.concat(t.paths)),
            o(e, t, (s, r) => {
              if (s) return i(s);
              this.plugins.forEach((i) => {
                i.onResolve && i.onResolve(e, r, t && t.filename);
              }),
                i(s, r);
            });
        }),
        (m.persistentCache = (i, s, r, o, a) => {
          process.nextTick(() => {
            t || h(i) === e || p(i)
              ? (l++,
                this._transform(i)
                  .then((e) => {
                    e
                      ? ((m.cache[i] = e.source), o(e.source, a))
                      : o("module.exports = {};", a);
                  })
                  .catch((e) => {
                    a(e);
                  }))
              : o("module.exports = {};", a);
          });
        });
      var _ = new i(m);
      _.pipe(s.stringify()).pipe(u),
        _.write({ file: e }),
        _.end(),
        _.on("missing", (e, t) => {
          console.log(
            `Cannot resolve module [${e}] when parse [${t.filename}]`
          ),
            (this._missingScripts = n.union(this._missingScripts, [
              h(t.filename),
            ]));
        }),
        _.on("error", (e) => {
          a(e instanceof Error ? e : new Error(e));
        });
    },
    async _parseEntry(e, t, i) {
      try {
        await l(this._parseModules.bind(this))(e, t);
      } catch (e) {
        Editor.error(e);
      }
    },
    getSortedScripts() {
      let e = [],
        t = this._scriptsCache;
      for (let i in t) e.push(t[i]);
      return (e = n.sortBy(e, "file"));
    },
    async _compileFinished() {
      console.time("QuickCompiler compileFinished"),
        await Promise.all(
          this.plugins.map(async (e) => {
            if (e.compileFinished) return e.compileFinished(this);
          })
        ),
        this.onCompileFinished && this.onCompileFinished(),
        console.timeEnd("QuickCompiler compileFinished");
    },
  }),
  (m.prototype._compileScripts = n.debounce(m.prototype._compileScripts, 100)),
  (module.exports = m);
