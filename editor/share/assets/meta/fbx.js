const e = require("fire-path");
const r = require("fire-fs");
const t = Editor.require("unpack://node_modules/fbx2gltf");
const i = require("md5");
const s = require("del");
const { promisify: o } = require("util");
const n = require("./gltf");
const u = require("./buffer");
const f = require("node-uuid");
const a = e.join(require("os").tmpdir(), "fbx2gltf_temp");
r.ensureDirSync(a);

module.exports = class extends n {
  constructor(e) {
    super(e);
    this._convertDestPath = "";
  }
  static defaultType() {
    return "fbx";
  }
  async importModel(o) {
    let n = e.join(Editor.Project.path, "temp", "gltf");
    let u = "";

    n = e.contains(Editor.Project.path, o)
      ? e.join(n, e.relative(Editor.Project.path, o))
      : e.join(n, i(o));

    n = e.join(e.dirname(n), e.basenameNoExt(n) + ".gltf");
    r.ensureDirSync(e.dirname(n));

    if (/[\u0080-\uffff]/g.test(o)) {
      u = e.join(a, f.v4() + ".fbx");
      r.copySync(o, u);
      o = u;
    }

    return new Promise((e, i) => {
      t(o, n)
        .then(
          (t) => {
            console.log(`Successed converting ${o} to ${n}`);
            let s = { meshes: [] };
            try {
              let e = r.readFileSync(t, "utf8");
              s = JSON.parse(e);
            } catch (e) {
              Editor.error(e);
              return i(e);
            }
            this._convertDestPath = t;
            this._gltf = s;
            e();
          },
          (e) => {
            Editor.error(`Failed to convert ${o}, message:${e.message}`);
            i(e);
          }
        )
        .finally(() => {
        if (u) {
          s.sync(u.replace(/\\/g, "/"), { force: true });
        }
      });
    });
  }
  async _createBufferMeta(t, i, s) {
    this._bufferUuids = [];
    this._buffers = [];
    for (let n = 0; n < t.buffers.length; n++) {
      let f;
      let a = t.buffers[n].uri;
      f = i[a] ? i[a] : new u(this._assetdb);
      let c = e.join(e.dirname(this._convertDestPath), a);
      f.import(c, () => {});
      let l = await o(r.readFile)(c);
      this._buffers[n] = new Uint8Array(l.buffer);
      this._bufferUuids.push(f.uuid);
      s[a] = f;
    }
  }
};
