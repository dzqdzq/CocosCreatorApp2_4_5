"use strict";
let oldglobby = require("globby");
const e = require("fire-fs");
const t = require("fire-path");
const i = require("async");
const r = require("minimatch");
const n = require("del");
const o = require("lodash");
const { v4: s } = require("node-uuid");
const { shell: u } = require("electron");
const l = require("./meta");
let d = {};
let myPath = {};
let globby = oldglobby;

if(Editor.argv.MYAPP){
  let filter = null;
  globby = function(path, cb) {
    if(path.endsWith("/assets/**/*")){
      if(myPath[path]){
        cb(null, myPath[path]);
      }else{
        if(!filter){
          filter = Editor.argv.MYAPP.split(",").map((item)=>{
            return `${path.replace("/**/*", "")}/${item.trim()}/**/*`;
          });
        }
        oldglobby(filter, (err, paths)=>{
          const resourcesPath = path.replace("/**/*", "/resources");
          // 判断是否存在
          if(e.existsSync(resourcesPath)){
            paths.push(resourcesPath);
            paths.push(`${resourcesPath}.meta`);
          }
          
          for(let i=0; i<filter.length; i++){
            paths.push(filter[i].replace("/**/*", ""));
            paths.push(filter[i].replace("/**/*", ".meta"));
          }
          myPath[path] = paths;
          cb(null, myPath[path]);
        });
      }
    }else{
      oldglobby(path, cb);
    }
  };
}

Editor.argv.resetGlobby = function(){
    globby = oldglobby;
    myPath = undefined;
};

async function h(e, r, o) {
  let s = e._uuidToImportPathNoExt(r);
  try {
    s = s.replace(/\\/g, "/");
    await n([s, s + ".*"], { force: true });
  } catch (e) {
    return o(e);
  }
  i.series(
    [
      (e) => {
        let i = t.dirname(s);
        let r = t.join(i, "**/*");
        globby(r, (a, r) => {
          if (0 === (r = r.map((e) => t.normalize(e))).length) {
            n(i.replace(/\\/g, "/"), { force: true }).then((t) => {
                  e();
                }, e);
          } else {
            e();
          }
        });
      },
      (t) => {
        let a = e.subAssetInfosByUuid(r);
        i.each(
          a,
          (t, i) => {
            let a = t.uuid;
            h(e, a, i);
          },
          (i) => {
            if (i) {
              e.failed(
                `Fail to delete imported files for sub assets of ${r}: ${i.stack}`
              );
            }

            t();
          }
        );
      },
    ],
    (e) => {
      if (o) {
        o(e);
      }
    }
  );
}
function f(t, i) {
  let a = t._metaToAssetPath(i);
  return (!e.existsSync(a) && (t.info(`remove unused meta: ${t._url(i)}`), e.unlinkSync(i), true));
}
function m(i, a, r) {
  if (!i.metaBackupPath) {
    return null;
  }

  if ("boolean" != typeof r) {
    r = false;
  }

  if (
    (r || !e.existsSync(i._metaToAssetPath(a)))
  ) {
    let r = i.getRelativePath(a);
    let n = t.normalize(t.join(i.metaBackupPath, r));
    let o = t.dirname(n);
    e.ensureDirSync(o);
    e.copySync(a, n);
    e.unlinkSync(a);
    i.warn(`Backup unused meta file: ${i._url(a)}`);
    return r;
  }
  return null;
}
function p(r, n) {
  let o = /\S{8}-\S{4}-\S{4}-\S{4}-\S{12}/;
  oldglobby(t.join(r._importPath, "**/*"), (a, s) => {
    i.each(
      s,
      (i, a) => {
        i = t.normalize(i);
        if (e.isDirSync(i)) {
          a();
          return;
        }
        let n = o.exec(i);
        return n
          ? ((n = n[0]),
            void 0 !== r._uuid2path[n]
              ? (a(), void 0)
              : (r.log(`remove unused import file ${n}`),
                h(r, n, (e) => {
                  if (e) {
                    r.failed(
                      `Failed to remove import file ${n}, message: ${e.stack}`
                    );
                  }

                  a();
                }),
                void 0))
          : (a(), void 0);
      },
      (e) => {
        if (n) {
          n(e);
        }
      }
    );
  });
}
function c(t, a) {
  let r = Object.keys(t._uuid2mtime);
  i.each(
    r,
    (i, a) => {
      let r = t.uuidToFspath(i);

      if (!e.existsSync(r)) {
        delete t._uuid2mtime[i];
        t.log(`remove unused mtime info: ${i}`);
      }

      a();
    },
    (e) => {
      if (a) {
        a(e);
      }
    }
  );
}
function y(i, r, n, o) {
  if ("function" == typeof n) {
    o = n;
    n = null;
  }

  if ("boolean" != typeof (n = n || {})["remove-unused-meta"]) {
    n["remove-unused-meta"] = true;
  }

  if ("boolean" != typeof n["filter-meta"]) {
    n["filter-meta"] = true;
  }

  let s = r;

  if (e.isDirSync(r)) {
    s = t.join(r, "**/*");
  }

  let u = [];
  let l = [];
  globby(s, (e, a) => {
    if (e) {
      if (o) {
        o(e);
      }

      return;
    }

    if (!(a = a.map((e) => t.normalize(e))).includes(r)) {
      a.unshift(r);
    }

    a.forEach((e) => {
      if (i._isMountPath(e)) {
        return;
      }
      if (".meta" !== t.extname(e) || !n["filter-meta"]) {
        u.push(e);
        return;
      }
      if (n["remove-unused-meta"]) {
        f(i, e);
      } else {
        let t = m(i, e);

        if (t) {
          l.push(t);
        }
      }
    });

    if (o) {
      i._handleMetaBackupResults(l);
      o(null, u);
    }
  });
}
function v(t, i, a) {
  if (t._isMountPath(i)) {
    if (a) {
      a(null, false);
    }

    return;
  }
  let r = t.fspathToUuid(i);
  let n = i + ".meta";
  if (!e.existsSync(n)) {
    if (a) {
      a(null, true);
    }

    return;
  }
  if (!r) {
    if (a) {
      a(null, true);
    }

    return;
  }
  let o = l.load(t, n);
  if (o.ver !== o.constructor.version()) {
    a(null, true);
    return;
  }
  let s = o.getSubMetas();
  for (let e in s) {
    let t = s[e];
    if (t.ver !== t.constructor.version()) {
      a(null, true);
      return;
    }
  }
  let u = o.dests();
  for (let t = 0; t < u.length; ++t) {
    if (!e.existsSync(u[t])) {
      if (a) {
        a(null, true);
      }

      return;
    }
  }
  let d = t._uuid2mtime[r];
  if (d) {
    let r = e.statSync(i);
    if (d.asset !== r.mtime.getTime()) {
      if (a) {
        a(null, true);
      }

      return;
    }
    let n = e.statSync(i + ".meta");
    if (d.meta !== n.mtime.getTime()) {
      if (a) {
        a(null, true);
      }

      return;
    }
    let o = t.getRelativePath(i);
    return d.relativePath !== o
      ? (a && a(null, true), void 0)
      : (a && a(null, false), void 0);
  }

  if (a) {
    a(null, true);
  }
}
function g(i, r, n, o, u) {
  let d = r;

  if (e.isDirSync(r)) {
    d = t.join(r, "**/*");

    if (!i._isMountPath(r)) {
      d = [r, d];
    }
  }

  let h = [];
  globby(d, (a, r) => {
    if (a) {
      if (u) {
        u(a);
      }

      return;
    }

    r.forEach((a) => {
      let r;
      a = t.normalize(a);
      if (".meta" === t.extname(a)) {
        if (o) {
          f(i, a);
        }

        return;
      }
      let u;
      let d = a + ".meta";
      d = a + ".meta";
      if ((e.existsSync(d))) {
        if (!(r = l.load(i, d)).uuid || i._uuid2path[r.uuid]) {
          const e = s();

          i.warn(
            `uuid collision, the uuid(${r.uuid}) for ${a} is already used. A new uuid(${e}) will be assigned.`
          );

          r.uuid = e;
          l.save(i, d, r);
        }
        i._dbAdd(a, r.uuid);
        if ((r)) {
          h.push({ assetpath: a, meta: r });
          let e = r.getSubMetas();
          if (e) {
            for (let n in e) {
              let o = e[n];
              let u = t.join(a, n);
              if (i._uuid2path[o.uuid]) {
                const e = s();

                i.warn(
                  `uuid collision, the uuid(${o.uuid}) for ${u} is already used. A new uuid(${e}) will be assigned.`
                );

                o.uuid = e;
                l.save(i, d, r);
              }
              i._dbAdd(u, o.uuid);
              h.push({ assetpath: u, meta: o });
            }
          }
          return;
        }
      }

      if (n) {
        u = n[a];
      }

      r = l.create(i, d, u);
      i._dbAdd(a, r.uuid);
      l.save(i, d, r);
      h.push({ assetpath: a, meta: r });
    });

    if (u) {
      u(null, h);
    }
  });
}
function $(e, a, r) {
  let n = false;
  let o = a + ".meta";
  let s = l.load(e, o);
  if (!s && ((s = l.create(e, o)), (n = true), !s)) {
    if (r) {
      r(new Error(`Can not create or load meta from ${a}`));
    }

    return;
  }
  if (e.isSubAssetByPath(a)) {
    if (r) {
      r(null, s);
    }

    return;
  }
  let u = s.constructor.version();

  if (s.ver !== u) {
    s.ver = u;
    n = true;
  }

  let d = s.copySubMetas();
  let h = {};
  i.series(
    [
      (t) => {
        if (s.import) {
          try {
            e.log(`import asset ${a}...`);

            s.import(a, (e) => {
              h = s.getSubMetas() || {};
              n = true;
              t(e);
            });
          } catch (e) {
            t(e);
          }
        } else {
          t();
        }
      },
      (t) => {
        let i = Object.keys(d);
        for (let t = 0; t < i.length; ++t) {
          let a = i[t];
          let r = d[a];
          let n = e.uuidToFspath(r.uuid);
          e._dbDelete(n);
        }
        i = Object.keys(h);
        for (let e = 0; e < i.length; ++e) {
          let t = i[e];
          let a = h[t];

          if (d[t]) {
            a.uuid = d[t].uuid;
          }
        }
        t();
      },
      (r) => {
        let o = Object.keys(h);
        i.eachLimit(
          o,
          2,
          (i, r) => {
            let o = t.join(a, i);
            let s = h[i];
            let u = s.constructor.version();

            if (s.ver !== u) {
              s.ver = u;
            }

            if (s.import) {
              s.import(o, function (t) {
                if (t) {
                  r(t);
                  return;
                }
                n = true;
                e._dbAdd(o, s.uuid);
                r();
              });
            } else {
              e._dbAdd(o, s.uuid);
              r();
            }
          },
          (e) => {
            r(e);
          }
        );
      },
    ],
    (t) => {
      if (t) {
        if (r) {
          r(t);
        }

        return;
      }

      if (n) {
        l.save(e, o, s);
      }

      if (r) {
        r(null, s);
      }
    }
  );
}
function b(e, a, r) {
  if (!a.path) {
    r(new Error("Incomplete asset info: no path included"));
  }

  let n = false;
  let o = a.path;
  let s = o + ".meta";
  let u = a.meta || l.get(e, e.fspathToUuid(o));
  let d = a.isSubAsset || e.isSubAssetByPath(o);
  if (!u || d) {
    if (r) {
      r(null, u);
    }

    return;
  }
  i.series(
    [
      (t) => {
        if (u.postImport) {
          try {
            e.log("post-import asset " + o + "...");

            u.postImport(o, (e) => {
              n = true;
              t(e);
            });
          } catch (e) {
            t(e);
          }
        } else {
          t();
        }
      },
      (e) => {
        let a = u.getSubMetas();
        let r = Object.keys(a);
        i.eachLimit(
          r,
          2,
          i.ensureAsync((e, i) => {
            let r = t.join(o, e);
            let s = a[e];

            if (s.postImport) {
              s.postImport(r, function () {
                n = true;
                i();
              });
            } else {
              i();
            }
          }),
          (t) => {
            e(t);
          }
        );
      },
    ],
    (t) => {
      if (t) {
        if (r) {
          r(t);
        }

        return;
      }

      if (n) {
        l.save(e, s, u);
      }

      if (r) {
        r(null, u);
      }
    }
  );
}
function _(e, i, a, r) {
  let n = t.dirname(i);
  let o = e.fspathToUuid(n);
  let s = e.mountInfoByPath(i);
  r.push({
    uuid: a.uuid,
    parentUuid: o,
    url: e._url(i),
    path: i,
    type: a.assetType(),
    hidden: !!s.hidden,
    readonly: !!s.readonly,
  });
  let u = a.getSubMetas();
  if (u) {
    for (let n in u) {
      let o = u[n];
      let l = t.join(i, n);
      r.push({
        uuid: o.uuid,
        parentUuid: a.uuid,
        url: e._url(l),
        path: l,
        type: o.assetType(),
        isSubAsset: true,
        hidden: !!s.hidden,
        readonly: !!s.readonly,
      });
    }
  }
}
function S(e, t, a, r) {
  if (!Array.isArray(t)) {
    t = [t];
  }

  let n = [];
  for (var o = 0, s = t.length; o < s; o++) {
    if (!e.isSubAssetByPath(t[o])) {
      n.push(t[o]);
    }
  }
  i.waterfall(
    [
      (t) => {
        let a = [];
        i.eachSeries(
          n,
          (t, i) => {
            e.log(`scan ${t}...`);

            y(e, t, { "remove-unused-meta": false }, (e, t) => {
              if (e) {
                i();
                return;
              }

              t.forEach((e) => {
                if (!a.includes(e)) {
                  a.push(e);
                }
              });

              i();
            });
          },
          () => {
            t(null, a);
          }
        );
      },
      (t, r) => {
        if (a) {
          r(null, t);
          return;
        }
        e.log("check if reimport...");
        let n = [];
        i.each(
          t,
          i.ensureAsync((t, i) => {
            v(e, t, (a, r) => {
              if (a) {
                e.failed(
                  `Failed to check if reimport for ${t}, message: ${a.stack}`
                );

                i();
                return;
              }

              if (r) {
                n.push(t);
              }

              i();
            });
          }),
          (e) => {
            r(e, n);
          }
        );
      },
      (t, a) => {
        e.log("reimport assets...");
        let r = [];
        i.eachLimit(
          t,
          2,
          i.ensureAsync((t, i) => {
            $(e, t, (a, n) => {
              if (a) {
                e.failed(`Failed to import asset ${t}, message: ${a.stack}`);

                r.push({
                  path: t,
                  url: e._url(t),
                  uuid: e.fspathToUuid(t),
                  error: a,
                });

                i();
                return;
              }
              _(e, t, n, r);
              i();
            });
          }),
          (e) => {
            a(e, r);
          }
        );
      },
      (t, a) => {
        e.log("post import assets...");

        i.eachLimit(
          t,
          2,
          i.ensureAsync((t, i) => {
            if (t.isSubAsset) {
              i();
              return;
            }
            b(e, t, (a, r) => {
              if (a) {
                e.failed(
                  `Failed to post import asset ${t.path}, message: ${a.stack}`
                );

                i();
                return;
              }
              e.updateMtime(r.uuid);
              i();
            });
          }),
          (e) => {
            a(e, t);
          }
        );
      },
    ],
    (e, t) => {
      if (r) {
        r(e, t);
      }
    }
  );
}
function w(e, i, a) {
  let r = i.getSubMetas() || {};
  let n = e.uuidToFspath(i.uuid);
  let o = [];
  let s = [];
  let u = [];
  let l = Object.keys(a);
  for (let e = 0; e < l.length; ++e) {
    let i = l[e];
    let s = a[i];

    if (!r[i]) {
      o.push({ uuid: s.uuid, path: t.join(n, i), type: s.assetType() });
    }
  }
  l = Object.keys(r);
  for (let o = 0; o < l.length; ++o) {
    let d = l[o];
    let h = r[d];
    let f = t.join(n, d);
    if (a[d]) {
      u.push({
        uuid: h.uuid,
        parentUuid: i.uuid,
        path: f,
        url: e.uuidToUrl(h.uuid),
        type: h.assetType(),
        isSubAsset: true,
      });
    } else {
      let t = e.mountInfoByUuid(h.uuid);
      s.push({
        uuid: h.uuid,
        parentUuid: i.uuid,
        path: f,
        url: e.uuidToUrl(h.uuid),
        type: h.assetType(),
        isSubAsset: true,
        hidden: !!t.hidden,
        readonly: !!t.readonly,
      });
    }
  }
  return { deleted: o, added: s, remained: u };
}
module.exports = d;

d.mount = function (i, a, r, n, s) {
  if ("string" != typeof a) {
    if (s) {
      s(new Error("expect 1st param to be a string"));
    }

    return;
  }
  if (!e.isDirSync(a)) {
    if (s) {
      s(
        new Error(
          `Failed to mount ${a}, path not found or it is not a directory!`
        )
      );
    }

    return;
  }
  if ("string" != typeof r) {
    if (s) {
      s(new Error("Expect 2nd param to be a string"));
    }

    return;
  }
  (function (e, i, a) {
    if (/[\\/.]/.test(a)) {
      e.throw(
        "normal",
        `Invalid character in ${a}, you can not contains '/', '\\' or '.'`
      );
    }

    if (e._mounts[a]) {
      e.throw("normal", `Failed to mount ${i} to ${a}, already exists!`);
    }

    for (let r in e._mounts) {
      let n = e._mounts[r];

      if (t.contains(n.path, i)) {
        e.throw(
          "normal",
          `Failed to mount ${i} to ${a}, the path or its parent ${n.path} already mounted to ${r}`
        );
      }

      if (t.contains(i, n.path)) {
        e.throw(
          "normal",
          `Failed to mount ${i} to ${a}, its child path ${n.path} already mounted to ${r}`
        );
      }
    }
  })(i, (a = t.resolve(a)), r);
  let u = { path: a, mountPath: r, attached: false };
  o.assign(u, n);
  i._mounts[r] = u;
  i._dbAdd(a, i._mountIDByMountPath(r));

  if (s) {
    s();
  }
};

d.unmount = function (e, t, i) {
    return "string" != typeof t
      ? (i && i(new Error("expect 1st param to be a string")), void 0)
      : e._mounts[t]
      ? (e._dbDelete(e._mounts[t].path), delete e._mounts[t], i && i(), void 0)
      : (i && i(new Error("can not find the mount " + t)), void 0);
  };

d.init = function (e, t) {
  let a = Object.keys(e._mounts);
  let r = [];
  i.series(
    [
      (t) => {
        i.eachSeries(
          a,
          (t, i) => {
            d.attachMountPath(e, t, (e, t) => {
              r = r.concat(t);
              i();
            });
          },
          t
        );
      },
      (t) => {
        p(e, (i) => {
          if (i) {
            e.failed(
              `Failed to remove unused import files, message: ${i.stack}`
            );
          }

          t();
        });
      },
      (t) => {
        c(e, (i) => {
          if (i) {
            e.failed(
              `Failed to remove unused mtime info, message: ${i.stack}`
            );
          }

          e.updateMtime();
          t();
        });
      },
    ],
    (e) => {
      if (t) {
        t(e, r);
      }
    }
  );
};

d.attachMountPath = function (e, t, a) {
  var r = [];
  var n = e._mounts[t];
  return n
    ? n.attached
      ? (e.log(`db://${t} already attached!`), a(null, r), void 0)
      : (r.push({
          name: t,
          path: n.path,
          url: e._url(n.path),
          uuid: e._mountIDByMountPath(t),
          hidden: !!n.hidden,
          readonly: !!n.readonly,
          type: "mount",
        }),
        i.series(
          [
            (i) => {
              let a = e._mounts[t].path;
              e.log(`init meta files at db://${t}`);

              g(e, a, null, false, (e, t) => {
                i();
              });
            },
            (i) => {
              let a = e._mounts[t].path;
              e.log(`refresh at db://${t}`);

              S(e, a, false, (a, n) => {
                if (a) {
                  e.failed(`Failed to refresh db://${t}`);
                  i();
                  return;
                }
                e._handleErrorResults(n);
                r = r.concat(n);
                i();
              });
            },
          ],
          (i) => {
            r.forEach((e) => {
              e.command = "create";
            });

            e._mounts[t].attached = true;

            if (a) {
              a(i, r);
            }
          }
        ),
        void 0)
    : (e.failed(`db://${t} is not a mount path.`),
      a(new Error(`${t} is not a valid mount path. Please mount it first.`)),
      void 0);
};

d.unattachMountPath = function (e, a, r) {
  var n = [];
  var o = e._mounts[a];
  if (!o) {
    e.failed(`db://${a} is not a mount path.`);
    r(new Error(`${a} is not a valid mount path.`));
    return;
  }
  if (!o.attached) {
    e.log(`db://${a} has not been attached!`);
    r(null, n);
    return;
  }
  var s = e._allPaths();
  var u = t.resolve(o.path);
  i.waterfall(
    [
      (t) => {
        i.eachLimit(
          s,
          3,
          (t, i) => {
            if (0 === t.indexOf(u)) {
              n.push({
                  path: t,
                  url: e._url(t),
                  uuid: e.fspathToUuid(t),
                  command: "delete",
                });

              e._dbDelete(t);
            }

            i();
          },
          t
        );
      },
      (t) => {
        p(e, (i) => {
          if (i) {
            e.failed(
              `Failed to remove unused import files, message: ${i.stack}`
            );
          }

          t();
        });
      },
      (t) => {
        c(e, (i) => {
          if (i) {
            e.failed(
              `Failed to remove unused mtime info, message: ${i.stack}`
            );
          }

          e.updateMtime();
          t();
        });
      },
    ],
    (t) => {
      e._mounts[a].attached = false;

      if (r) {
        r(t, n);
      }
    }
  );
};

d.refresh = function (a, r, n) {
  let o = [];
  let s = {};
  for (let e in a._path2uuid) s[e] = a._path2uuid[e];

  if (!Array.isArray(r)) {
    r = [r];
  }

  r = (r = r.map((e, i) => {
    if (a._isAssetPath(e)) {
      return e;
    }

    if (a.isSubAssetByPath(e)) {
      e = t.dirname(e);
    }

    let r = e;
    let n = t.dirname(e);
    for (; n && !a._path2uuid[n]; ) {
      if ((r = n) === (n = t.dirname(n))) {
        r = n = void 0;
        a.failed(`Failed to refresh path: ${e}`);
      }
    }
    return r;
  })).filter(Boolean);

  i.waterfall(
    [
      (e) => {
        let t = [];
        i.eachSeries(
          r,
          (e, i) => {
            if (!a.fspathToUuid(e)) {
              i();
              return;
            }
            d.clearImports(a, e, s, (e, a) => {
              if (e) {
                i();
                return;
              }
              t = t.concat(a);
              i();
            });
          },
          () => {
            e(null, t);
          }
        );
      },
      (t, i) => {
        t.forEach((t) => {
          let i = t.path + ".meta";

          if (!e.existsSync(t.path)) {
            t.command = "delete";
            o.push(t);

            if (e.existsSync(i)) {
              e.unlinkSync(i);
            }
          }
        });

        i();
      },
      (e) => {
        let t = [];
        i.eachSeries(
          r,
          (e, i) => {
            if (t.includes(e)) {
              i();
              return;
            }
            g(a, e, s, false, (e, r) => {
              r.forEach((e) => {
                t.push(e.assetpath);
                let i = a._path2uuid[e.assetpath];
                let r = a._uuid2path[e.meta.uuid];

                if (!(!i || i !== e.meta.uuid || !r)) {
                  r !== e.assetpath;
                }
              });

              i();
            });
          },
          e
        );
      },
      (e) => {
        S(a, r, true, e);
      },
    ],
    (e, t) => {
      if (e) {
        if (n) {
          n(e);
        }

        return;
      }

      t.forEach((e) => {
        let t = s[e.path];
        let i = a.fspathToUuid(e.path);
        for (let e = 0; e < o.length; ++e) {
          if (i === o[e].uuid) {
            o.splice(e, 1);
            break;
          }
        }
        if (t) {
          if (t !== i) {
            e.command = "uuid-change";
            e.oldUuid = t;
          } else {
            e.command = "change";
          }
        } else {
          e.command = "create";
          let t = a.mountInfoByUuid(i);
          e.hidden = !!t.hidden;
          e.readonly = !!t.readonly;
        }
      });

      o = o.concat(t);

      if (n) {
        n(null, o);
      }
    }
  );
};

d.deepQuery = function (e, i) {
  let a = [];
  let r = Object.keys(e._path2uuid);
  r.sort((e, t) => e.length - t.length);
  for (let i = 0; i < r.length; ++i) {
    let n;
    let o;
    let s;
    let u = r[i];
    let d = e._path2uuid[u];
    let h = e._path2uuid[t.dirname(u)];
    let f = e.isSubAssetByPath(u);
    o = t.extname(u);
    let m = e.mountInfoByPath(u);
    if (e.isMountByPath(u)) {
      n = t.basenameNoExt(m.mountPath);
      s = "mount";
    } else {
      if ("folder" === (s = l.get(e, e.fspathToUuid(u)).assetType())) {
        n = t.basename(u);
        o = "";
      } else {
        n = t.basenameNoExt(u);
      }
    }
    let p = {
      uuid: d,
      parentUuid: h,
      name: n,
      extname: o,
      type: s,
      isSubAsset: f,
      hidden: !!m.hidden,
      readonly: !!m.readonly,
    };
    a.push(p);
  }

  if (i) {
    i(null, a);
  }
};

d.queryAssets = function (e, t, i, a) {
  let n = [];
  let o = Object.keys(e._path2uuid);
  let s = o;

  if (t) {
    s = r.match(o, t);
  }

  if ("string" == typeof (i = i || [])) {
    i = [i];
  }

  for (let t = 0; t < s.length; ++t) {
    let a = s[t];
    let r = e._path2uuid[a];
    let o = e.isSubAssetByPath(a);
    let u = l.get(e, r);
    if (!u) {
      continue;
    }
    let d = u.assetType();
    if (i.length && -1 === i.indexOf(d)) {
      continue;
    }
    let h = e.mountInfoByPath(a);

    let f = {
      url: e._url(a),
      path: a,
      uuid: r,
      type: d,
      readonly: !!h.readonly,
      hidden: !!h.hidden,
      isSubAsset: o,
      destPath: e._getDestPathByMeta(u),
    };

    n.push(f);
  }
  n.sort((e, t) => e.path.localeCompare(t.path));

  if (a) {
    a(null, n);
  }
};

d.queryMetas = function (e, t, i, a) {
  let n = [];
  let o = Object.keys(e._path2uuid);

  if (t) {
    o = r.match(o, t);
  }

  for (let t = 0; t < o.length; ++t) {
    let a = o[t];
    let r = l.get(e, e.fspathToUuid(a));
    if (!r) {
      if (!e._isMountPath(a)) {
        console.warn(`Meta ${a} is not exists`);
      }

      continue;
    }
    let s = r.assetType();

    if (!(i && s !== i)) {
      n.push(r);
    }
  }

  if (a) {
    a(null, n);
  }
};

d.import = function (a, r, n, o) {
  if (a.mountInfoByPath(n).readonly) {
    let e = a.fspathToUrl(n);

    if (o) {
      o(
        new Error(
          `${e} is readonly, CAN NOT import assets into it in Editor.`
        )
      );
    }

    return;
  }
  var s = null;
  var u = [];
  i.waterfall(
    [
      (i) => {
        (function (i, a, r, n) {
          if (!e.isDirSync(r)) {
            if (n) {
              n(
                new Error(
                  "Invalid dest path, make sure it exists and it is a directory"
                )
              );
            }

            return;
          }
          function o(a) {
            if (i._isAssetPath(a)) {
              i.failed(`Can not import file ${a}, already in the database`);
              return -1;
            }
            let n = t.join(r, t.basename(a));
            return e.existsSync(n) ? 0 : 1;
          }
          a.map((e) => t.basename(e));

          a = i.arrayCmpFilter(a, (e, i) =>
              t.contains(e, i) ? 1 : t.contains(i, e) ? -1 : 0
            );

          for (var s = [], u = [], l = 0; l < a.length; l++) {
            let e = a[l];
            var d = o(e);

            if (d > 0) {
              s.push(e);
            } else {
              if (0 === d) {
                u.push(e);
              }
            }
          }

          if (n) {
            n(null, { importFiles: s, mergeFiles: u });
          }
        })(a, r, n, (e, t) => {
          s = t;
          i(e);
        });
      },
      (r) => {
        let o = { importFiles: [], mergeFiles: [] };
        let u = s.importFiles.concat(s.mergeFiles);
        i.each(
          u,
          (i, r) => {
            a.log(`copy file ${t.basename(i)}...`);
            let u = t.join(n, t.basename(i));
            let l = s.mergeFiles.indexOf(i) >= 0;
            e.copy(i, u, (e) => {
              if (e) {
                a.failed(`Failed to copy file ${i}. ${e}`);
                r();
                return;
              }

              if (l) {
                if (o.mergeFiles.indexOf(u) < 0) {
                  o.mergeFiles.push(u);
                }
              } else {
                if (o.importFiles.indexOf(u) < 0) {
                  o.importFiles.push(u);
                }
              }

              r();
            });
          },
          (e) => {
            r(e, o);
          }
        );
      },
      (e, t) => {
        if (0 === e.mergeFiles.length) {
          t(null, e.importFiles);
          return;
        }
        d.refresh(a, e.mergeFiles, (i, r) => {
          if (i) {
            a.failed(
              `Failed to refresh assets ${e.mergeFiles}, message: ${i.stack}`
            );

            t(null, e.importFiles);
            return;
          }
          u = u.concat(r);
          t(null, e.importFiles);
        });
      },
      (e, t) => {
        let r = [];
        a.log("init metas...");

        i.each(
          e,
          (e, t) => {
            g(a, e, null, true, (e, i) => {
              i.forEach((e) => {
                if (!a.isSubAssetByPath(e.assetpath)) {
                  r.push(e.assetpath);
                }
              });

              t();
            });
          },
          (e) => {
            t(e, r);
          }
        );
      },
      (e, t) => {
        a.log("import assets...");
        let r = [];
        i.eachLimit(
          e,
          2,
          (e, t) => {
            $(a, e, (i, n) => {
              if (i) {
                a.failed(
                  `Failed to import asset ${e}, message: ${i.stack}`
                );

                t();
                return;
              }
              _(a, e, n, r);
              t();
            });
          },
          (e) => {
            t(e, r);
          }
        );
      },
      (e, t) => {
        a.log("post import assets...");

        i.eachLimit(
          e,
          2,
          (e, t) => {
            if (e.isSubAsset) {
              t();
              return;
            }
            b(a, e, (i, r) => {
              if (i) {
                a.failed(
                  `Failed to post import asset ${e.path}, message: ${i.stack}`
                );

                t();
                return;
              }
              t();
            });
          },
          (i) => {
            t(i, e);
          }
        );
      },
      (e, t) => {
        e.forEach((e) => {
          a.updateMtime(e.uuid);
        });

        e.sort((e, t) => e.path.localeCompare(t.path));
        t(null, e);
      },
    ],
    (e, t) => {
      u = u.concat(t);

      if (o) {
        o(e, u);
      }
    }
  );
};

d.postImport = function (e, t, a) {
    i.waterfall(
      [
        (i) => {
          b(e, { path: t }, (a, r) => {
            if (a) {
              e.failed(
                    `Failed to post import asset ${t}, message: ${a.stack}`
                  );

              i(a);
            } else {
              i(null, r);
            }
          });
        },
        (t, i) => {
          if (t) {
            e.updateMtime(t.uuid);
          }

          i(null, t);
        },
      ],
      (e, t) => {
        if (a) {
          a(e, t);
        }
      }
    );
  };

d.assetMove = function (a, r, n, o) {
  let s;
  let u;
  let d;
  let f;
  let m = e.isDirSync(r);
  let p = t.basename(r) !== t.basename(n);
  let c = [];
  i.series(
    [
      (e) => {
        (function (e, i, a, r) {
          y(e, i, null, (e, n) => {
            let o = n.map((e) => {
              let r = t.relative(i, e);
              return t.join(a, r);
            });

            if (r) {
              r(null, n, o);
            }
          });
        })(a, r, n, (t, i, r) => {
          if (t) {
            e(t);
            return;
          }
          u = r;
          d = (s = i).map((e) => a.fspathToUuid(e));

          f = s.map((e) => {
              return l.get(a, a.fspathToUuid(e)).copySubMetas();
            });

          e();
        });
      },
      (e) => {
        if (m || !p) {
          e();
          return;
        }
        (function (e, t, a) {
          i.eachSeries(
            t,
            (t, i) => {
              h(e, t, i);
            },
            (e) => {
              if (a) {
                a(e);
              }
            }
          );
        })(a, d, e);
      },
      (t) => {
        (function (t, a, r, n) {
          i.series(
            [
              (t) => {
                e.rename(a, r, t);
              },
              (i) => {
                let n = a + ".meta";
                let o = r + ".meta";
                if (!e.existsSync(n)) {
                  i();
                  return;
                }
                e.rename(n, o, (n) => {
                  if (n) {
                    e.rename(r, a, (e) => {
                      t.error(e);
                    });
                  }

                  i(n);
                });
              },
            ],
            n
          );
        })(a, r, n, t);
      },
      (e) => {
        for (let e = 0; e < s.length; e++) {
          if (m || !p) {
            let t = a.subAssetInfosByPath(s[e]);
            let i = s[e];
            let r = u[e];
            for (let e = 0; e < t.length; ++e) {
              let n = t[e].path;
              let o = n.replace(i, r);
              a._dbMove(n, o);
            }
          }
          a._dbMove(s[e], u[e]);
        }
        e();
      },
      (e) => {
        if (m || !p) {
          e();
          return;
        }
        i.eachLimit(
          u,
          2,
          (e, t) => {
            $(a, n, (e, i) => {
              if (e) {
                a.failed(`Failed to import asset ${n}, message: ${e.stack}`);
              }

              c.push(i);
              t();
            });
          },
          () => {
            e();
          }
        );
      },
      (e) => {
        if (m || !p) {
          e();
          return;
        }
        i.eachLimit(
          u,
          2,
          (e, t) => {
            b(a, { path: n }, (e, i) => {
              if (e) {
                a.failed(
                  `Failed to post import asset ${n}, message: ${e.stack}`
                );
              }

              t();
            });
          },
          () => {
            e();
          }
        );
      },
      (e) => {
        d.forEach((e) => {
          a.updateMtime(e);
        });

        e();
      },
    ],
    (e) => {
      if (!o) {
        return;
      }
      if (e) {
        o(e);
        return;
      }
      let i = [];
      for (let e = 0; e < u.length; ++e) {
        let r = t.dirname(u[e]);
        let n = null;

        if (c[e]) {
          n = w(a, c[e], f[e]);
        }

        let o = a.mountInfoByUuid(d[e]);
        let h = l.get(a, d[e]);
        i.push({
          uuid: d[e],
          type: h.assetType(),
          url: a.uuidToUrl(d[e]),
          parentUuid: a.fspathToUuid(r),
          srcPath: s[e],
          destPath: u[e],
          subMetas: n,
          hidden: !!o.hidden,
          readonly: !!o.readonly,
        });
      }
      o(null, i);
    }
  );
};

d.delete = function (a, r, n) {
  if (!Array.isArray(r)) {
    r = [r];
  }

  let o = a
      .arrayCmpFilter(r, (e, i) =>
        t.contains(e, i) ? 1 : t.contains(i, e) ? -1 : 0
      )
      .map((e) => a._fspath(e));

  let s = [];
  i.each(
    o,
    (t, i) => {
      (async function (t, i, a) {
        if (!e.existsSync(i)) {
          if (a) {
            a(new Error(`Asset ${i} is not exists`));
          }

          return;
        }
        if (t.mountInfoByPath(i).readonly) {
          if (a) {
            let e = t.fspathToUrl(i);
            a(new Error(`${e} is readonly, CAN NOT delete it in Editor.`));
          }
        } else {
          try {
            u.moveItemToTrash(i, true);
            u.moveItemToTrash(i + ".meta", true);
          } catch (e) {
            if (a) {
              a(e);
            }

            return;
          }
          d.clearImports(t, i, null, (e, t) => {
            if (e) {
              if (a) {
                a(e);
              }

              return;
            }

            if (a) {
              a(null, t);
            }
          });
        }
      })(a, t, (e, r) => {
        if (e) {
          let r = a.fspathToUuid(t);
          a.error(`Failed to delete asset ${r}, messages: ${e.stack}`);
          i(e);
          return;
        }
        s = s.concat(r);
        i();
      });
    },
    (e) => {
      n(e, s);
    }
  );
};

d.create = function (a, r, n, o) {
  if (!r) {
    if (o) {
      o(new Error(`Invalid path: ${r}`));
    }

    return;
  }
  if (a.mountInfoByPath(r).readonly) {
    if (o) {
      let e = a.fspathToUrl(t.dirname(r));
      o(new Error(`${e} is readonly, CAN NOT create it in Editor.`));
    }
    return;
  }
  let s = r;
  let u = 0;
  for (; e.existsSync(s); ) {
    u += 1;

    s = t.join(
        t.dirname(r),
        t.basenameNoExt(r) + " - " + a.padLeft(u, 3, "0") + t.extname(r)
      );
  }
  r = s;
  let l = t.dirname(r);
  if (!e.existsSync(l)) {
    if (o) {
      o(new Error(`Parent path ${l} is not exists`));
    }

    return;
  }
  let d = a._ensureDirSync(t.dirname(r));
  i.waterfall(
    [
      (i) => {
        a.log(`write ${r}...`);
        let o = t.extname(r);
        let s = e.existsSync(r);
        if (!o && false === s) {
          e.mkdir(r, i);
          return;
        }
        e.writeFile(r, n, i);
      },
      (e) => {
        $(a, r, e);
      },
      (e, t) => {
        b(a, { path: r, meta: e }, t);
      },
      (e, t) => {
        a._dbAdd(r, e.uuid);
        a.updateMtime(e.uuid);
        t(null, e);
      },
    ],
    (e, i) => {
      if (e) {
        if (o) {
          o(e);
        }

        return;
      }
      let n = [];

      d.forEach((e) => {
        let i = a.uuidToFspath(e.uuid);
        let r = t.dirname(i);
        let o = a.fspathToUuid(r);
        let s = a.mountInfoByPath(i);
        n.push({
          uuid: e.uuid,
          parentUuid: o,
          url: a._url(i),
          path: i,
          type: e.assetType(),
          hidden: !!s.hidden,
          readonly: !!s.readonly,
        });
      });

      _(a, r, i, n);

      if (o) {
        o(e, n);
      }
    }
  );
};

d.saveExists = function (a, r, n, o) {
  if (!a.existsByPath(r)) {
    if (o) {
      o(new Error(r + " is not exists"));
    }

    return;
  }
  if (a.mountInfoByPath(r).readonly) {
    if (o) {
      let e = a.fspathToUrl(r);
      o(new Error(`${e} is readonly, CAN NOT save the changes in Editor.`));
    }
    return;
  }
  let s = a.loadMetaByPath(r).copySubMetas();
  let u = a.fspathToUuid(r);
  i.waterfall(
    [
      (i) => {
        (function (i, a) {
          if (!i.assetBackupPath || !e.existsSync(a)) {
            return;
          }
          let r = i.getAssetBackupPath(a);
          if (!r) {
            return;
          }
          let n = t.dirname(r);
          e.ensureDirSync(n);
          e.copySync(a, r);
        })(a, r);

        i();
      },
      (t) => {
        e.writeFile(r, n, t);
      },
      (e) => {
        h(a, u, (t) => {
          if (t) {
            a.failed(
              `Failed to delete imported assets of ${u} during save, message: ${t.stack}`
            );
          }

          e();
        });
      },
      (e) => {
        $(a, r, e);
      },
      (e, t) => {
        b(a, { path: r, meta: e }, t);
      },
      (e, t) => {
        a.updateMtime(u);
        t(null, e);
      },
    ],
    (e, t) => {
      if (e) {
        if (o) {
          let t = { path: r, url: a._url(r), uuid: u, error: e };
          o(e, t);
        }
      } else {
        if (o) {
          let i = w(a, t, s);
          o(e, { meta: t, subMetas: i });
        }
      }
    }
  );
};

d.saveMeta = function (e, a, r, n) {
  let o;
  let s = e.uuidToFspath(a);
  if (e.mountInfoByPath(s).readonly) {
    if (n) {
      let t = e.fspathToUrl(s);
      n(new Error(`${t} is readonly, CAN NOT save the changes in Editor.`));
    }
    return;
  }
  try {
    o = JSON.parse(r);
  } catch (e) {
    if (n) {
      n(new Error(`Failed to pase json string, message : ${e.message}`));
    }

    return;
  }
  if (a !== o.uuid) {
    if (n) {
      n(new Error("Uuid is not equal to json uuid"));
    }

    return;
  }
  let u = s + ".meta";
  let d = e.loadMetaByPath(s);
  if (!d) {
    if (n) {
      n(new Error(`Can't load meta for : ${a}`));
    }

    return;
  }
  let f = d.copySubMetas();
  d.deserialize(o);
  if ((e.isSubAssetByPath(s))) {
    let i = t.basename(s);
    u = (s = t.dirname(s)) + ".meta";
    let r = e.loadMetaByPath(s);
    a = r.uuid;
    f = r.copySubMetas();
    r.getSubMetas()[i] = d;
    d = r;
  }
  l.save(e, u, d);

  i.waterfall(
    [
      (t) => {
        h(e, a, (i) => {
          if (i) {
            e.failed(
              `Failed to delete imported assets of ${a} during saveMeta, message: ${i.stack}`
            );
          }

          t();
        });
      },
      (t) => {
        $(e, s, t);
      },
      (t, i) => {
        b(e, { path: s, meta: t }, i);
      },
      (t, i) => {
        let r = w(e, t, f);
        for (let t = 0; t < r.added.length; ++t) {
          let i = r.added[t];

          if (!e.existsByUuid(i.uuid)) {
            e._dbAdd(i.path, i.uuid);
            e.updateMtime(i.uuid);
          }
        }
        for (let t = 0; t < r.deleted.length; ++t) {
          let i = r.deleted[t];

          if (e.existsByUuid(i.uuid)) {
            e._dbDelete(i.path);
          }
        }
        e.updateMtime(a);
        i(null, { meta: t, subMetas: r });
      },
    ],
    (e, t) => {
      if (e) {
        if (n) {
          n(e);
        }

        return;
      }

      if (n) {
        n(null, t);
      }
    }
  );
};

d.clearImports = function (a, r, n, o) {
    if (!a.fspathToUuid(r)) {
      if (o) {
        o(new Error(`path-2-uuid does not contian: ${r}`));
      }

      return;
    }
    a.log(`clear imports ${r}`);
    let s = [];
    for (let e in a._path2uuid) if (t.contains(r, e)) {
      if (!a._isMountPath(e)) {
        s.push(e);
      }
    }
    let u = [];
    i.eachSeries(
      s,
      (t, r) => {
        let o = a.assetInfoByPath(t);
        let s = o.uuid;
        u.push(o);

        i.series(
          [
            (i) => {
              let r;
              let o = t + ".meta";
              let u = e.existsSync(o);
              if (u) {
                r = l.load(a, o);
              } else {
                r = new (l.findCtor(a, t))(a);
              }
              if (r && r.delete) {
                if (!u) {
                  a.warn(
                    `Try to delete imported files from an un-exists path : ${o}.\n              This is not 100% work, please check them manually.`
                  );
                }

                r.uuid = (n && n[t]) || s;
                a.log(`do meta.delete ${o}...`);
                r.delete(t, i);
                return;
              }
              i();
            },
            (e) => {
              h(a, s, (t) => {
                if (t) {
                  a.failed(
                    `Failed to delete imported assets of ${s} during clearImports, message: ${t.stack}`
                  );
                }

                e();
              });
            },
            (e) => {
              a._dbDelete(t);
              a.updateMtime(s);
              e();
            },
          ],
          r
        );
      },
      (e) => {
        if (o) {
          o(e, u);
        }
      }
    );
  };

d.copy = function (r, o, s, u, l) {
    i.series(
      [
        (t) => {
          e.copy(o, s, t);
        },
        (t) => {
          if (!u) {
            t();
            return;
          }
          let i = o + ".meta";
          let a = s + ".meta";

          if (e.existsSync(i)) {
            e.copy(i, a, t);
          }
        },
        (i) => {
          if (!e.isDirSync(s) || u) {
            i();
            return;
          }
          let r = [t.join(s, "**/*.meta")];
          oldglobby(r, (e, a) => {
            Promise.all(
              a.map(
                (e) => (
                  (e = t.resolve(e)), n(e.replace(/\\/g, "/"), { force: true })
                )
              )
            ).then((e) => {
              i();
            }, i);
          });
        },
      ],
      (e) => {
        if (l) {
          l(e);
        }
      }
    );
  };

d.move = function (e, t, a, r) {
    if (e.mountInfoByPath(t).readonly) {
      let i = e.fspathToUrl(t);

      if (r) {
        r(new Error(`${i} is readonly, CAN NOT move it in Editor.`));
      }

      return;
    }
    if (e.mountInfoByPath(a).readonly) {
      let t = e.fspathToUrl(a);

      if (r) {
        r(
          new Error(`${t} is readonly, CAN NOT move asset into it in Editor.`)
        );
      }

      return;
    }
    i.waterfall(
      [
        (i) => {
          d._checkMoveInput(e, t, a, i);
        },
        (i) => {
          d.assetMove(e, t, a, i);
        },
      ],
      (e, t) => {
        if (e) {
          if (r) {
            r(e);
          }

          return;
        }

        if (r) {
          r(null, t);
        }
      }
    );
  };

d.exchangeUuid = function (e, t, a, r) {
  let n = e.loadMetaByPath(t);
  if (!n) {
    if (r) {
      r(new Error(`Can't load meta for : ${t}`));
    }

    return;
  }
  let o = e.loadMetaByPath(a);
  if (!o) {
    if (r) {
      r(new Error(`Can't load meta for : ${a}`));
    }

    return;
  }
  let s = n.uuid;
  n.uuid = o.uuid;
  o.uuid = s;
  e._uuid2meta[n.uuid] = n;
  e._path2uuid[t] = n.uuid;
  e._uuid2path[n.uuid] = t;
  e._uuid2meta[o.uuid] = o;
  e._path2uuid[a] = o.uuid;
  e._uuid2path[o.uuid] = a;

  i.series(
    [
      (t) => {
        d.saveMeta(e, n.uuid, JSON.stringify(n.serialize(), null, 2), t);
      },
      (t) => {
        d.saveMeta(e, o.uuid, JSON.stringify(o.serialize(), null, 2), t);
      },
    ],
    r
  );
};

d._backupUnusedMeta = m;
d._scan = y;
d._checkIfReimport = v;
d._initMetas = g;
d._refresh = S;
d._importAsset = $;

d._checkMoveInput = function (i, a, r, n) {
  let o = t.dirname(r);
  let s = e.existsSync(a);
  let u = e.existsSync(r);
  let l = e.isDirSync(a);
  let d = e.isDirSync(r);
  let h = t.basename(a);
  return s
    ? e.existsSync(o)
      ? u && a.toLowerCase() !== r.toLowerCase()
        ? (n && n(new Error(`Dest asset ${r} already exists`)), void 0)
        : d && l && e.existsSync(t.join(r, h))
        ? (n && n(new Error(`Dest normal asset ${r} already exists`)), void 0)
        : (n && n(), void 0)
      : (n && n(new Error(`Dest parent path ${o} is not exists`)), void 0)
    : (n && n(new Error(`Src asset ${a} is not exists`)), void 0);
};
