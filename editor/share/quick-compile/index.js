const e = require("fire-fs");
const firePath = require("fire-path");
const moduleDeps = require("module-deps");
const s = require("JSONStream");
const concatStream = require("concat-stream");
const BrowserResolve = require("browser-resolve");
const a = require("del");
const c = require("browserify/lib/builtins.js");
const n = require("lodash");
const { promisify: l } = require("util");
const { formatPath: h, isNodeModulePath: p } = require("./utils");
const u = "undefined" == typeof Editor;
let d = null;
function m() {
  this._scriptsCache = {};
  this._scriptsToCompile = [];
  this._missingScripts = [];
  this._watchedScripts = [];
  this._fileStats = {};
  this._mtimes = [];
  this.plugins = [];
  this.excludes = [];
}

d = u
  ? function (e) {
      console.error(e);
    }
  : function (e) {
      Editor.error(e);
    };

Object.assign(m.prototype, {
  async watch(e, t) {
    await this.build(e);
    this._createWatcher(e);
  },
  _createWatcher(e) {
    console.log("watching...");
    const i = require("chokidar");
    this.watching = true;
    let s = (e.exts || [".js"]).map((e) => firePath.join(this.root, "**/*" + e));
    let r = i.watch(s, { ignored: firePath.join(this.out, "**"), ignoreInitial: true });

    r.on("all", (t, i) => {
      i = h(i);
      if ("add" === t) {
        i = [i].concat(this._missingScripts);
        this.compileScripts(i);
        return;
      }

      if (this._scriptsCache[i]) {
        if ("change" === t) {
          if (e.onlyRecordChanged) {
            this._watchedScripts = n.union(this._watchedScripts, [i]);
          } else {
            this.compileScripts(i);
          }
        } else {
          if ("unlink" === t) {
            this.removeScripts(i);
          }
        }
      }
    });

    if (this.watcher) {
      this.watcher.close();
    }

    this.watcher = r;
  },
  async build(e) {
    if (!e.entries) {
      throw new Error("Please specify the entries");
    }

    if (!Array.isArray(e.entries)) {
      e.entries = [e.entries];
    }

    this.entries = e.entries.map(h);
    this.getRelativePath = e.getRelativePath || this.getRelativePath;
    let t = e.root;
    if (!t) {
      throw new Error("Please specify the root directory");
    }
    this.root = t;
    let i = e.out;

    if (!i) {
      i = "./quick-compile-temp";
    }

    this.out = i;
    if (e.clear) {
      try {
        a.sync(i.replace(/\\/g, "/"), { force: true });
      } catch (e) {
        d(e);
      }
    }

    if (e.plugins &&
      Array.isArray(e.plugins)) {
      this.plugins = e.plugins.concat(this.plugins);
    }

    if (e.excludes &&
      Array.isArray(e.excludes)) {
      this.excludes = e.excludes.concat(this.excludes);
    }

    await this.rebuild();
  },
  clearCache() {
    this._scriptsCache = {};
  },
  async _readFileStats() {
    this._fileStats = {};
    let i = firePath.join(this.out, "__file_stats__.json");
    if (!e.existsSync(i)) {
      return;
    }
    let s = await l(e.readJson)(i);

    if ("1.0.8" === s.version) {
      this._fileStats = s.stats;
    } else {
      a.sync(this.out.replace(/\\/g, "/"), { force: true });
    }
  },
  async _writeFileStats() {
    let i = firePath.join(this.out, "__file_stats__.json");
    await l(e.writeJson)(i, { version: "1.0.8", stats: this._fileStats });
  },
  async rebuild() {
    await this._readFileStats();
    if (this.watching) {
      console.time("QuickCompiler watching rebuild finished");
      if (0 === this._watchedScripts.length) {
        console.timeEnd("QuickCompiler watching rebuild finished");
        return;
      }
      await Promise.all(this.entries.map(async (e) => this._transform(e)));

      await Promise.all(
        this._watchedScripts.map(async (e) => this._parseEntry(e, false))
      );

      this._watchedScripts.length = 0;
    } else {
      console.time("QuickCompiler rebuild finished");
      await Promise.all(this.entries.map(async (e) => this._transform(e)));

      await Promise.all(
        this.entries.map(async (e) => this._parseEntry(e, true))
      );

      await this._compileFinished();
      console.timeEnd("QuickCompiler rebuild finished");
    }
    await this._writeFileStats();
  },
  getRelativePath(e) {
    return h(firePath.relative(this.root, e));
  },
  getDstPath(e) {
    if (p(e)) {
      return this.getNodeModuleDstPath(e);
    }
    let i = this.getRelativePath(e);
    return h(firePath.join(this.out, firePath.stripExt(i) + ".js"));
  },
  getNodeModuleDstPath(e) {
    let i = firePath.join(
      "__node_modules",
      e.slice(e.indexOf("/node_modules/") + "/node_modules/".length)
    );
    i = firePath.stripExt(i) + ".js";
    return firePath.join(this.out, i);
  },
  async compileScripts(e) {
    if (!Array.isArray(e)) {
      e = [e];
    }

    this._scriptsToCompile = n.union(this._scriptsToCompile, e);
    await this._compileScripts();
  },
  async _compileScripts() {
    console.time("compileScript");

    await Promise.all(
      this._scriptsToCompile.map(async (e) => this._parseEntry(e, false))
    );

    this._scriptsToCompile.length = 0;
    await this._compileFinished();
    console.timeEnd("compileScript");
  },
  async removeScripts(t) {
    if (!Array.isArray(t)) {
      t = [t];
    }

    let i = t.map((t) => {
      let i = this.getDstPath(t);

      if (e.existsSync(i)) {
        a.sync(i.replace(/\\/g, "/"), { force: true });
      }

      let s = i + ".info.json";

      if (e.existsSync(s)) {
        a.sync(s.replace(/\\/g, "/"), { force: true });
      }

      return i;
    });
    this._scriptsToCompile = n.pullAll(this._scriptsToCompile, t);
    for (let e = 0; e < i.length; e++) {
      delete this._scriptsCache[i[e]];
    }
    await this._compileFinished();
  },
  removeCachedScripts(e) {
    if (!Array.isArray(e)) {
      e = [e];
    }

    e.forEach((e) => {
      e = h(e);
      delete this._scriptsCache[e];
    });
  },
  async _transform(i) {
    if (this.watching) {
      console.time("_transform: " + i);
    }

    i = h(i);
    if (this.excludes.find((e) => i.match(e))) {
      return null;
    }
    let s = { src: i, dst: this.getDstPath(i) };
    let r = await l(e.stat)(i);
    if (this._fileStats[i] === r.mtime.toJSON() && e.existsSync(s.dst)) {
      return this._scriptsCache[i]
        ? this._scriptsCache[i]
        : ((s.source = await l(e.readFile)(s.dst, "utf8")), s);
    }
    s.source = await l(e.readFile)(i, "utf8");
    for (let e = 0; e < this.plugins.length; e++) {
      let t = this.plugins[e];
      if ((!p(i) || t.nodeModule) && t.transform) {
        try {
          await t.transform(s, this);
        } catch (e) {
          d(e);
        }
      }
    }
    await l(e.ensureDir)(firePath.dirname(s.dst));
    await l(e.writeFile)(s.dst, s.source);

    if (this.watching) {
      console.timeEnd("_transform: " + i);
    }

    r = await l(e.stat)(i);
    this._fileStats[i] = r.mtime.toJSON();
    this._scriptsCache[i] = s;
    return s;
  },
  _isFileInCache(e) {
    return this._scriptsCache[e];
  },
  _refineScript(e) {
    e.src = h(e.file);
    e.dst = this.getDstPath(e.src);
    delete e.file;
    for (let t in e.deps) 
      e.deps[t] = h(e.deps[t]);
  },
  _parseModules(e, t, a) {
    e = h(e);
    console.time(`Parse [${e}]`);
    let l = 0;

    let concatStreamObj = concatStream((i) => {
      console.log(`Parse [${e}]: walk ${l}  files.`);
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
        this._refineScript(i);

        if ((t || i.src === e || p(i.src))) {
          o[i.src] = i;
        }
      });

      a();
    });

    let m = { extensions: [".js", ".json", ".ts"], ignoreMissing: true };
    m.modules = Object.assign(Object.create(null), c);
    m.cache = {};

    m.resolve = (e, t, resolveCb) => {
      let s = "";
      this.plugins.forEach((i) => {
        if(i.resolve){
          s = i.resolve(e, t);
        }
      });
      if (s){
        return resolveCb(null, s);
      }
      t.paths = require.main.paths.concat(t.paths);
      BrowserResolve(e, t, (err, r) => {
        if (err) {
          return resolveCb(err);
        }

        this.plugins.forEach((i) => {
          if(i.onResolve){
            i.onResolve(e, r, t && t.filename);
          }
        });

        resolveCb(err, r);
      });
    };

    m.persistentCache = (i, s, r, o, a) => {
      process.nextTick(() => {
        if (t || h(i) === e || p(i)) {
          l++;

          this._transform(i)
            .then((e) => {
            if (e) {
              m.cache[i] = e.source;
              o(e.source, a);
            } else {
              o("module.exports = {};", a);
            }
          })
            .catch((e) => {
              a(e);
            });
        } else {
          o("module.exports = {};", a);
        }
      });
    };

    var _ = new moduleDeps(m);
    _.pipe(s.stringify()).pipe(concatStreamObj);
    _.write({ file: e });
    _.end();

    _.on("missing", (e, t) => {
      // console.log(
      //   `Cannot resolve module [${e}] when parse [${t.filename}]`
      // );

      this._missingScripts = n.union(this._missingScripts, [
          h(t.filename),
        ]);
    });

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
    let e = [];
    let t = this._scriptsCache;
    for (let i in t) e.push(t[i]);
    return (e = n.sortBy(e, "file"));
  },
  async _compileFinished() {
    console.time("QuickCompiler compileFinished");

    await Promise.all(
      this.plugins.map(async (e) => {
        if (e.compileFinished) {
          return e.compileFinished(this);
        }
      })
    );

    if (this.onCompileFinished) {
      this.onCompileFinished();
    }

    console.timeEnd("QuickCompiler compileFinished");
  },
});

m.prototype._compileScripts = n.debounce(m.prototype._compileScripts, 100);
module.exports = m;
