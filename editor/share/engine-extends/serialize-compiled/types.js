"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.CustomClassNode = exports.ClassNode =
exports.DictNode =
exports.ArrayNode =
exports.BaseNode =
exports.TraceableDict =
exports.TraceableItem =
  void 0;

const {
  DICT_JSON_LAYOUT: e,
  CLASS_TYPE: t,
  CLASS_KEYS: s,
  CLASS_PROP_TYPE_OFFSET: i,
  CUSTOM_OBJ_DATA_CONTENT: r,
  MASK_CLASS: a,
} = cc._deserializeCompiled.macros;
let n = (() => {
  class e {
    constructor() {
      this.result = e.NO_RESULT;
      this.tracers = [];
      this.keys = [];
    }
    static compareByRefCount(e, t) {
      return t.tracers.length - e.tracers.length;
    }
    traceBy(e, t) {
      this.tracers.push(e);
      this.keys.push(t);
    }
    movedTo(e) {
      for (let t = 0; t < this.tracers.length; t++) {
        this.tracers[t][this.keys[t]] = e;
      }
    }
  }
  e.NO_RESULT = Object.create(null);
  return e;
})();
exports.TraceableItem = n;
let l = (() => {
  class e {
    constructor() {
      this.values = new Map();
    }
    trace(e, t, s) {
      let i = this.values.get(e);

      if (!i) {
        i = new n();
        this.values.set(e, i);
      }

      i.traceBy(t, s);
      return i;
    }
    traceString(e, t, s) {
      this.trace(e, t, s).result = e;
    }
    get(e) {
      return this.values.get(e);
    }
    getSortedItems() {
      let e = Array.from(this.values.values());
      e.sort(n.compareByRefCount);
      return e;
    }
    dump(e = 0) {
      let t = this.getSortedItems();
      for (let s = 0; s < t.length; s++) {
        t[s].movedTo(e + s);
      }
      return t.map((e) => e.result);
    }
  }
  e.PLACEHOLDER = 0;
  return e;
})();
exports.TraceableDict = l;
let d = (() => {
  class e {
    constructor(e) {
      this.refCount = 0;
      this.indexed = false;
      this.shouldBeIndexed = false;
      this._index = -1;
      this.selfType = e;
    }
    get instanceIndex() {
      return this._index;
    }
    set instanceIndex(e) {
      if (this.indexed) {
        throw new Error("Should not change instanceIndex on indexed object");
      }
      this._index = e;
    }
    get refType() {
      return this.indexed ? 1 : this.selfType;
    }
    static compareByRefCount(e, t) {
      return t.refCount - e.refCount;
    }
    setStatic(e, t, s) {}
    setDynamic(e, t) {
      ++e.refCount;
    }
    setAssetRefPlaceholderOnIndexed(e) {}
    dumpRecursively(e) {}
  }
  e.AssetPlaceholderType = 0;
  e.AssetPlaceholderValue = null;
  return e;
})();
exports.BaseNode = d;
let h = (() => {
  class e extends d {
    constructor(e) {
      super(12);
      this.types = new Array(e);
      this.datas = new Array(e);
    }
    setStatic(e, t, s) {
      this.types[e] = t;
      this.datas[e] = s;
    }
    setDynamic(e, t) {
      super.setDynamic(e);
      this.types[t] = void 0;
      this.datas[t] = e;
    }
    setAssetRefPlaceholderOnIndexed(e) {
      this.types[e] = d.AssetPlaceholderType;
      this.datas[e] = d.AssetPlaceholderValue;
    }
    dumpRecursively(t) {
      for (let e = 0; e < this.datas.length; ++e) {
        let s = this.datas[e];
        if (s instanceof d) {
          if (s.indexed) {
            let i = t.addRef(this, e, s);

            if (isFinite(i)) {
              this.types[e] = 1;
              this.datas[e] = i;
            } else {
              this.types[e] = 0;
              this.datas[e] = null;
            }
          } else {
            s.instanceIndex = this.instanceIndex;
            let i = s.dumpRecursively(t);
            this.types[e] = s.refType;
            this.datas[e] = i;
          }
        }
      }
      for (let t = 0; t < e.DeriveTypes.length; ++t) {
        let [s, i] = e.DeriveTypes[t];
        if (this.types.every((e) => e === s)) {
          this.selfType = i;
          return this.datas;
        }
      }
      this.selfType = 12;
      return [this.datas, ...this.types];
    }
  }

  e.DeriveTypes = [
    [0, 0],
    [4, 9],
    [6, 3],
    [1, 2],
  ];

  return e;
})();
exports.ArrayNode = h;

exports.DictNode = class extends d {
  constructor() {
    super(11);
    this.data = [null];
    this.json = Object.create(null);
    this.dynamics = Object.create(null);
    this.data[e] = this.json;
  }
  setStatic(e, t, s) {
    if (0 === t) {
      this.json[e] = s;
    } else {
      this.data.push(e, t, s);
    }
  }
  setDynamic(e, t) {
    super.setDynamic(e);
    this.dynamics[t] = e;
  }
  dumpRecursively(e) {
    for (let t in this.dynamics) {
      let s = this.dynamics[t];
      if (s.indexed) {
        let i = e.addRef(this, t, s);

        if (isFinite(i)) {
          this.data.push(t, 1, i);
        }
      } else {
        s.instanceIndex = this.instanceIndex;
        let i = s.dumpRecursively(e);

        if (0 === s.refType) {
          this.json[t] = i;
        } else {
          this.data.push(t, s.refType, i);
        }
      }
    }
    return 1 === this.data.length
      ? ((this.selfType = 0), this.json)
      : this.data;
  }
};

class c extends d {
  constructor(e) {
    super(4);
    this.simpleKeys = new Array();
    this.simpleValues = [];
    this.advanceds = new Array();
    this.ctor = e;
  }
  static fromData(e, r, n) {
    let l = e[t];
    let d = new c(l);
    d.dumped = n;
    d.simpleValues = null;
    let h = e[s];
    let o = e[i];
    let u = r[r.length - 1];
    let p = a + 1;
    for (; p < u; ++p) {
      let e = h[r[p]];
      d.simpleKeys.push(e);
    }
    for (let t = u; t < n.length; ++t) {
      let s = h[r[t]];
      let i = e[r[t] + o];
      d.advanceds.push(s, i);
    }
    return d;
  }
  setStatic(e, t, s) {
    if (0 === t) {
      this.simpleKeys.push(e);
      this.simpleValues.push(s);
    } else {
      this.advanceds.push(e, t, s);
    }
  }
  setDynamic(e, t) {
    super.setDynamic(e);
    this.advanceds.push(t, void 0, e);
  }
  dumpRecursively(e) {
    const t = this.advanceds;
    for (let s = t.length - 3; s >= 0; s -= 3) {
      let i = t[s + 2];
      if (i instanceof d) {
        if (i.indexed) {
          let r = e.addRef(this, t[s], i);

          if (isFinite(r)) {
            t[s + 1] = 1;
            t[s + 2] = r;
          } else {
            t.splice(s, 3);
          }
        } else {
          i.instanceIndex = this.instanceIndex;
          let r = i.dumpRecursively(e);

          if (0 === i.refType) {
            this.simpleKeys.push(t[s]);
            this.simpleValues.push(r);
            t.splice(s, 3);
          } else {
            t[s + 1] = i.refType;
            t[s + 2] = r;
          }
        }
      }
    }
    const s = l.PLACEHOLDER;
    this.dumped = [s].concat(this.simpleValues);
    for (let e = 0; e < t.length; e += 3) {
      this.dumped.push(t[e + 2]);
    }
    this.simpleValues = null;
    this.advanceds = this.advanceds.filter((e, t) => t % 3 != 2);
    return this.dumped;
  }
}
exports.ClassNode = c;
class o extends d {
  constructor(e, t) {
    super(10);
    this.ctor = e;
    this.content = t;
  }
  static fromData(e, t) {
    let s = t[r];
    let i = new o(e, s);
    i.dumped = t;
    return i;
  }
  setStatic(e, t, s) {
    throw new Error("Should not set property of CustomClass");
  }
  setDynamic(e, t) {
    throw new Error("Should not set property of CustomClass");
  }
  dumpRecursively(e) {
    const t = l.PLACEHOLDER;
    this.dumped = [t, this.content];
    return this.dumped;
  }
}
exports.CustomClassNode = o;
