const t = require("fire-path"),
  e = require("fire-fs"),
  r = require("globby"),
  i = require("lodash"),
  s = require("del"),
  o = require("convert-source-map"),
  a = require("./index.js"),
  { formatPath: c, isNodeModulePath: n } = require("./utils"),
  l = require("./plugins/module"),
  p = require("./plugins/insert-globals"),
  h = t.join(Editor.Project.path, "temp/quick-scripts"),
  d = t.join(h, "src"),
  u = t.join(h, "dst"),
  m = t.join(Editor.Project.path, "library/imports"),
  w = t.join(d, "__qc_index__.js");
let y = !0;
if (!("undefined" == typeof Editor)) {
  const t = Editor.Profile.load("global://features.json");
  y = void 0 === (y = t.get("bundle-quick-compiler-project")) || y;
}
function f() {
  Editor.Ipc.sendToWins("scene:soft-reload", !0);
}
f = i.debounce(f, 300);
let b = {
  name2PathMap: {},
  dst2ImportMap: {},
  errorScripts: {},
  DEST_PATH: u,
  INDEX_FILE_PATH: w,
  async init() {
    console.time("Init project script"),
      (function () {
        try {
          s.sync(h.replace(/\\/g, "/"), { force: !0 });
        } catch (t) {
          Editor.error(t);
        }
      })(),
      this.copyAllImportsToSrc(),
      this.rebuildIndex(),
      await this.createCompiler(),
      console.timeEnd("Init project script");
  },
  async removeScripts(t) {
    t.forEach((t) => {
      let e = t.path,
        r = t.uuid;
      if (!this.isPlugin(r)) {
        let t = this.raw2src(e);
        s.sync(t.replace(/\\/g, "/"), { force: !0 });
        let r = this.raw2dest(e);
        s.sync(r.replace(/\\/g, "/"), { force: !0 }),
          this.compiler.removeCachedScripts(t);
      }
      this.singleScriptCompileSuccess(r);
    }),
      await this.rebuild();
  },
  async moveScripts(t, r) {
    let i = [];
    for (let o = 0; o < r.length; o++) {
      let a = r[o],
        c = Editor.assetdb.fspathToUuid(a);
      if (!this.isPlugin(c)) {
        let r = t[o],
          c = this.raw2src(r);
        s.sync(c.replace(/\\/g, "/"), { force: !0 });
        let n = this.raw2dest(r);
        s.sync(n.replace(/\\/g, "/"), { force: !0 }),
          this.compiler.removeCachedScripts(c),
          (c = this.raw2src(a));
        let l = this.raw2import(a);
        e.copySync(l, c), i.push(c);
      }
    }
    await this.rebuild(i);
  },
  async compileScripts(t) {
    let r = [];
    t.forEach((t) => {
      let i = Editor.assetdb.fspathToUuid(t);
      if ((this.singleScriptCompileSuccess(i), !this.isPlugin(i))) {
        let i = this.raw2src(t),
          s = this.raw2import(t);
        e.copySync(s, i), r.push(i);
      }
    }),
      await this.rebuild(r);
  },
  singleScriptCompileFailed(t) {
    let e = this.errorScripts[t.uuid];
    e || (e = this.errorScripts[t.uuid] = []), e.push(t.error.toString());
  },
  singleScriptCompileSuccess(t) {
    let e = this.errorScripts[t];
    e &&
      (e.forEach((t) => {
        Editor.clearLog(t);
      }),
      delete this.errorScripts[t]);
  },
  async createCompiler() {
    this.compiler = new a();
    let r = this,
      i = {
        root: d,
        entries: w,
        out: u,
        plugins: [
          {
            transform(t, i) {
              let s = r.dest2import(t.dst) + ".map";
              if (e.existsSync(s)) {
                let r = e.readJsonSync(s),
                  i = o.fromObject(r).toComment();
                t.source = t.source + "\n" + i;
              }
            },
            resolve(t, e) {
              if (!/^[\w- .]*$/.test(t)) return;
              let i = t.replace(/\.(?:js|ts|json)$/i, ""),
                s = r.name2PathMap[i.toLowerCase()];
              return !n(e.filename) && s ? s : void 0;
            },
            onResolve(e, i, s) {
              let o = c(i),
                a = c(r.src2dst(o));
              r.dst2ImportMap[a] ||
                n(a) ||
                (function (t) {
                  return c(t) === c(w);
                })(o) ||
                Editor.warn(
                  `Path case maybe wrong : '${e}' in '${t.relative(d, s)}'`
                );
            },
            async compileFinished() {
              f();
            },
          },
          p(),
          l({
            bundle: y,
            modularName: "project",
            requireInNodeEnv: "cc.require",
            prefix: "preview-scripts",
          }),
        ],
        clear: !1,
        onlyRecordChanged: !0,
      };
    await this.compiler.build(i);
  },
  getAssetDb: () =>
    Editor.isMainProcess ? Editor.assetdb : Editor.remote.assetdb,
  async compileAndReload() {
    this.copyAllImportsToSrc(), await this.rebuild();
  },
  async rebuild(t) {
    this.rebuildIndex(),
      t
        ? await this.compiler.compileScripts(t.concat(w))
        : await this.compiler.rebuild();
  },
  rebuildIndex() {
    let s = "\n";
    (this.name2PathMap = {}), (this.dst2ImportMap = {});
    let o = r.sync(t.join(m, "/**/*.js"));
    (o = i.sortBy(o, this.import2raw.bind(this))).forEach((e) => {
      let r = this.import2raw(e),
        i = this.raw2Relative(r);
      s += `require('./${c(t.stripExt(i))}');\n`;
      let o = c(this.raw2dest(r)),
        a = c(this.raw2src(r)),
        n = t.basenameNoExt(o).toLowerCase();
      (this.name2PathMap[n] = a), (this.dst2ImportMap[o] = e);
    }),
      e.ensureFileSync(w),
      e.writeFileSync(w, s);
  },
  copyAllImportsToSrc() {
    r.sync(t.join(m, "/**/*.js")).forEach((t) => {
      let r = this.import2src(t);
      e.copySync(t, r), e.copySync(t + ".map", r + ".map");
    });
  },
  import2raw(e) {
    let r = t.basenameNoExt(e);
    if (!this.isPlugin(r)) return this.getAssetDb().uuidToFspath(r);
  },
  import2dest(t) {
    let e = this.import2raw(t);
    return this.raw2dest(e);
  },
  import2src(t) {
    let e = this.import2raw(t);
    return this.raw2src(e);
  },
  import2relative(t) {
    let e = this.import2raw(t);
    return this.raw2Relative(e);
  },
  raw2import: (t) => Editor.assetdb._fspathToImportPathNoExt(t) + ".js",
  raw2dest(e) {
    let r = this.raw2Relative(e),
      i = t.join(u, r);
    return (i = t.stripExt(i) + ".js");
  },
  raw2src(e) {
    let r = this.raw2Relative(e),
      i = t.join(d, r);
    return (i = t.stripExt(i) + ".js");
  },
  src2dst: (e) => t.join(u, t.relative(d, e)),
  dest2import(t) {
    return this.dst2ImportMap[t];
  },
  raw2Relative(e) {
    let r = this.getAssetDb().mountInfoByPath(e);
    if (!r) throw `Can not get mount info by path: ${e}`;
    return t.join(r.mountPath, t.relative(r.path, e));
  },
  isScript: (t) => "javascript" === t || "typescript" === t,
  isPlugin(t) {
    var e =
      this.getAssetDb()._uuid2meta[t] || this.getAssetDb().loadMetaByUuid(t);
    return e && e.isPlugin;
  },
  needCompile(t, e) {
    return "javascript" === t ? !this.isPlugin(e) : "typescript" === t;
  },
};
module.exports = b;
