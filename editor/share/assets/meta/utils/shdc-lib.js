"use strict";
const tokenizer = require("glsl-tokenizer/string");
const parser = require("glsl-parser/direct");
const yaml = require("js-yaml");
const mappings = Editor.require("unpack://engine/cocos2d/renderer/build/mappings");
const tabAsSpaces = 2;
const includeRE = /#include +[<"]([^>"]+)[>"]/g;
const plainDefineRE = /#define\s+(\w+)\s+(.*)\n/g;
const hoistRE = /#pragma\s+hoist[^\n]*begin[^\n]*\n(.*)#pragma\s+hoist[^\n]*end[^\n]*\n/gs;
const precisionRE = /precision\s+(low|medium|high)p\s+\w+/;
const whitespaces = /\s+/g;
const ident = /[_a-zA-Z]\w*/g;
const comparators = /^[<=>]+$/;
const ifprocessor = /#(el)?if/;
const labelRE = /(\w+)\((.*?)\)/;
const precision = /(low|medium|high)p/;
const arithmetics = /^[\d\+\-*/%\s]+$/;
const samplerRE = /sampler/;
const inDecl = /^(\s*)in ((?:\w+\s+)?\w+\s+\w+(?:\[[\d\s]+])?);/gm;
const outDecl = /^(\s*)out ((?:\w+\s+)?\w+\s+(\w+)(?:\[[\d\s]+])?);/gm;
const texLookup = /\btexture((?!2D|Cube)\w*)\s*\((\w+)\s*,/g;
const layoutRE = /layout\(.*?\)/g;
const layoutExtract = /layout\((.*?)\)(\s*)$/;
const bindingExtract = /binding\s*=\s*(\d+)/;
const builtinRE = /^cc\w+$/i;
const pragmasToStrip = /^\s*(?:#pragma\s*)(?!STDGL|optimize|debug).*$\n/gm;
const tokenizerOpt = {version:"300 es"};
let effectName = "";
let shaderName = "";
let shaderTokens = [];
const formatMsg = (e,n)=>`${effectName}.effect - ${shaderName}`+(n?` - ${n}: `:": ")+e;
const options = {throwOnError:true,throwOnWarning:true,noSource:false,chunkSearchFn:e=>({}),getAlternativeChunkPaths:e=>[]};
const dumpSource = e=>{let n=0;return e.reduce((e,t)=>t.line>n?e+`\n${n=t.line}\t${t.data.replace(/\n/g,"")}`:e+t.data,"")};

const warnWithSource = (e,n)=>{
  let t=dumpSource(shaderTokens)+"\n";

  if (options.noSource) {
    n = void 0;
    t = "";
  }

  const r=formatMsg("error "+e,n)+t;if (options.throwOnWarning) {
    throw r;
  }console.error(r)
};

const warn = (e,n)=>{const t=formatMsg("error "+e,n);if (options.throwOnWarning) {
  throw t;
}console.error(t)};

const error = (e,n)=>{const t=formatMsg("error "+e,n);if (options.throwOnError) {
  throw t;
}console.error(t)};

const convertType = e=>{let n=mappings.typeMap[e];return void 0===n?e:n};

const stripComments = (()=>{
  const e = /\r\n/g;
  const n = /\/\*.*?\*\//gs;
  const t = /\s*\/\/.*$/gm;
  return r=>{let s=r.replace(n,"");return s=(s=s.replace(t,"")).replace(e,"\n")}
})();

const chunksCache = {};
const addChunk = (e,n)=>(chunksCache[e]=stripComments(n),chunksCache);

const addChunksCache = e=>{
  const n = require("path");
  const t = require("fs");
  for(let r=0;r<e.length;++r){
    let s = n.basename(e[r],".inc");
    let i = t.readFileSync(e[r],{encoding:"utf8"});
    chunksCache[s] = stripComments(i);
  }return chunksCache
};

const invokeSearch = e=>{const{name:n,content:t}=options.chunkSearchFn(e);if (void 0!==t) {
  addChunk(n,t);
  return n;
}};

const unwindIncludes = (e,n,t=new Set)=>{return e.replace(includeRE,(e,r)=>{
  if (r.endsWith(".chunk")) {
    r = r.slice(0,-6);
  }

  if (t.has(r)) {
    return"";
  }let s=void 0;do{
    if (void 0!==(s=n[r])) {
      break;
    }const t=options.getAlternativeChunkPaths(r);if (t.some(e=>{if (void 0!==n[e]) {
      r = e;
      s = n[e];
      return true;
    }})) {
      break;
    }
    r = invokeSearch([].concat(r,t));
    if (void 0!==(s=chunksCache[r])) {
      break;
    }
    error(`EFX2001: can not resolve ${e}`);
    return "";
  }while(0);
  t.add(r);
  return unwindIncludes(s,n,t);
});};

const expandFunctionalMacro = (()=>{
  const e = (e,n)=>{
    if ("("!==e[n]) {
      return n;
    }
    let t = 1;
    let r = n+1;
    for (; r<e.length&&("("===e[r]&&t++,")"===e[r]&&t--,0!==t); r++)
      {}return r
  };

  const n = n=>{
    const t=[];let r=0;for (let s=0; s<n.length; s++) {
      if ("("===n[s]) {
        s = e(n,s)+1;
      }

      if (","===n[s]) {
        if (r!==s) {
          t.push(n.substring(r,s).trim());
        }

        r = s+1;
      }
    }

    if (r!==n.length) {
      t.push(n.substring(r).trim());
    }

    return t;
  };

  const t = /#define\s+(\w+)\(([\w,\s]+)\)\s+(.*?)\n/g;
  const r = /(?<=\w)##(?=\w)/g;
  const s = /\\\n/g;
  const i = /@@/g;
  return a=>{
    a = a.replace(s,"@@");
    let o=t.exec(a);for(;null!=o;){
      const s = o[1];
      const c = n(o[2]);
      const l = o[3];
      const p = o.index;
      const d = o.index+o[0].length;
      const f = new RegExp("^(.*?)"+s+"\\s*\\(","gm");
      if (new RegExp("\\b"+s+"\\b").test(l)) {
        warn(`EFX2002: recursive macro processor '${s}'`);
      } else {
        for(let t=f.exec(a);null!=t;t=f.exec(a)){
          const s=t.index+t[0].length-1;if (s>p&&s<d) {
            continue;
          }
          const o = t[1];
          const u = t.index+o.length;
          const m = e(a,s)+1;
          const g = n(a.slice(t.index+t[0].length,m-1));
          let h=l;for (let e=0; e<c.length; e++) {
            h = h.replace(new RegExp("\\b"+c[e]+"\\b","g"),g[e]);
          }

          if (-1===o.indexOf("#define")) {
            h = (h=h.replace(r,"")).replace(i,"\n");
          }

          a = a.substring(0,u)+h+a.substring(m);
          f.lastIndex -= t[0].length;
        }
      }
      a = a.substring(0,p)+a.substring(d);
      t.lastIndex = 0;
      o = t.exec(a);
    }
    a.replace(i,"\\\n");
    return a;
  };
})();

const expandLiteralMacro = e=>{
  const n={};let t=plainDefineRE.exec(e);for(;null!=t;){
    n[t[1]] = t[2];
    const r = t.index;
    const s = t.index+t[0].length;
    e = e.substring(0,r)+e.substring(s);
    plainDefineRE.lastIndex = r;
    t = plainDefineRE.exec(e);
  }
  const r = Object.keys(n).map(e=>new RegExp(`\\b${e}\\b`,"g"));
  const s = Object.values(n);
  for(let n=0;n<s.length;n++){let t=s[n];for (let e=0; e<n; e++) {
    t = t.replace(r[e],s[e]);
  }e = e.replace(r[n],t);}return e
};

const hoistBlocks = e=>{let n=hoistRE.exec(e);for (; n; ) {
  e = n[1]+e.substring(0,n.index)+e.substring(n.index+n[0].length);
  n = hoistRE.exec(e);
}return e};

const eliminateDeadCode = (()=>{
  const e = /[{}()]/g;
  const n = /(?:\w+p\s+)?\w+\s+(\w+)\s*$/;
  const t = /^\s*$/;
  let r = "";
  let s = 0;
  let i = 0;

  const a = (e,t)=>{
    const a=e.substring(i,t).match(n)||["",""];
    r = a[1];
    s = t-a[0].length;
  };

  const o = (e,n)=>{const t=[];let r=n.exec(e);for (; r; ) {
    t.push(r);
    r = n.exec(e);
  }return t};

  const c = new Set;
  const l = (e,n)=>{if(!c.has(n)){c.add(n);for(const t of e[n].deps)l(e,t)}};
  return (n,p,d)=>{
    let f = 0;
    let u = 0;
    let m = 0;
    i = 0;
    e.lastIndex = 0;
    c.clear();
    for(const c of o(n,e)){
      const e=c[0];

      if (0===f) {
        if ("("===e) {
          u = 1;
          a(n,c.index);
        } else {
          if (")"===e) {
            if (1===u) {
              u = 2;
              m = c.index+1;
            } else {
              u = 0;
            }
          } else {
            if ("{"===e) {
              u = 2===u&&t.test(n.substring(m,c.index))?3:0;
            }
          }
        }
      }

      if ("{"===e) {
        f++;
      }

      if("}"===e&&0==--f){
        if (3!==u) {
          continue;
        }
        i = c.index+1;
        u = 0;
        d.push({name:r,beg:s,end:i,deps:[]});
      }
    }let g=d.findIndex(e=>e.name===p);

    if (g<0) {
      warn(`EFX2403: entry function '${p}' not found.`);
      g = 0;
    }

    for(let e=0;e<d.length;e++){
      const t = d[e];
      const r = o(n,new RegExp("\\b"+t.name+"\\b","g"));
      for(const n of r){
        const t=d.findIndex(e=>n.index>e.beg&&n.index<e.end);

        if (t>=0&&t!==e) {
          d[t].deps.push(e);
        }
      }
    }l(d,g);
    let h = "";
    let b = 0;
    for(let e=0;e<d.length;e++){
      const t=d[e];

      if (!(c.has(e) || "main"===t.name)) {
        h += n.substring(b,t.beg);
        b = t.end;
      }
    }return h+n.substring(b)
  };
})();

const parseCustomLabels = (e,n={})=>{
  let t = e.join(" ");
  let r = labelRE.exec(t);
  for (; r; ) {
    n[r[1]] = yaml.safeLoad(r[2]||"true");
    t = t.substring(r.index+r[0].length);
    r = labelRE.exec(t);
  }return n
};

const extractDefines = (e,n,t)=>{
  let r = [];

  let s = e=>{
    t[e] = r.reduce((e,n)=>e.concat(n),[]);
    t.lines.push(e);
  };

  for(let i=0;i<e.length;i++){
    let a;
    let o;
    let c = e[i];
    let l = c.data;
    if ("preprocessor"!==c.type||l.startsWith("#extension")) {
      continue;
    }if("#endif"===(l=l.split(whitespaces))[0]){
      r.pop();
      s(c.line);
      continue
    }if("#else"===l[0]){
      r[r.length-1].length = 0;
      s(c.line);
      continue
    }if("#pragma"===l[0]){if(l.length<=1){warnWithSource("EFX2100: empty pragma?",c.line);continue}if ("define"===l[1]) {
      if(l.length<=2){warnWithSource("EFX2101: define pragma: missing info",c.line);continue}
      ident.lastIndex = 0;
      if (!ident.test(l[2])) {
        continue;
      }
      let e = r.reduce((e,n)=>e.concat(n),[]);
      let t = n.find(e=>e.name===l[2]);

      if (t) {
        if (e.length<t.defines.length) {
          t.defines = e;
        }
      } else {
        n.push(t={name:l[2],type:"boolean",defines:e});
      }

      const s = parseCustomLabels(l.splice(3));
      const i = Object.keys(s);
      if(i.length>1){warnWithSource("EFX2102: define pragma: multiple labels",c.line);continue}if ("range"===i[0]) {
        t.type = "number";
        t.range = s.range;

        if (!Array.isArray(s.range)) {
          warnWithSource(`EFX2103: invalid range for macro '${t.name}'`);
        }
      } else {
        if("options"!==i[0]){warnWithSource(`EFX2105: define pragma: illegal label '${i[0]}'`,c.line);continue}
        t.type = "string";
        t.options = s.options;

        if (!Array.isArray(s.options)) {
          warnWithSource(`EFX2104: invalid options for macro '${t.name}'`);
        }
      }
    } else {
      t[c.line] = parseCustomLabels(l.splice(1));
    }continue}if (!ifprocessor.test(l[0])) {
      continue;
    }

    if ("#elif"===l[0]) {
      r.pop();
      s(c.line);
    }

    let p = [];
    let d = false;
    let f = false;

    l.splice(1).some(e=>{
      ident.lastIndex = 0;

      if ((a=ident.exec(e))&&"defined"===a[0]) {
        a = ident.exec(e);
        f = true;
      }

      if (a) {
        if (a[0].startsWith("__")||a[0].startsWith("GL_")) {
          return d=true;
        }let e=r.reduce((e,n)=>e.concat(n),p.slice());

        if ((o = n.find(e=>e.name===a[0]))) {
          if (e.length<o.defines.length) {
            o.defines = e;
          }
        } else {
          n.push(o={name:a[0],type:"boolean",defines:e});
        }

        p.push(a[0]);
      } else {
        if (o&&comparators.test(e)) {
          o.type = "number";

          if (!o.range) {
            o.range = [0,3];
          }
        } else {
          if ("||"===e) {
            return p=[]
          }
        }
      }
    });

    r.push(p);
    s(c.line);

    if (!(d || "#ifdef"!==l[0]&&!f)) {
      warnWithSource("EFX2106: #ifdef or #if defined will always return true at runtime. please use #if instead.",c.line);
    }
  }
};

const extractParams = (()=>{
  const getDefs = (e,n)=>{let t=n.lines.findIndex(n=>n>e);return n[n.lines[t-1]]||[]};

  const extractInfo = (tokens,i,cache)=>{
    const param = {};
    const definedPrecision = precision.exec(tokens[i].data);
    let offset=definedPrecision?2:0;
    param.name = tokens[i+offset+2].data;
    param.type = convertType(tokens[i+offset].data);
    param.count = 1;

    if (definedPrecision) {
      param.precision = definedPrecision[0]+" ";
    }

    if("["===tokens[offset=nextWord(tokens,i+offset+2)].data){
      let expr = "";
      let end = offset;
      for (; "]"!==tokens[++end].data; ) {
        expr += tokens[end].data;
      }try{if (arithmetics.test(expr)) {
        param.count = eval(expr);
      } else {if (!builtinRE.test(param.name)) {
        throw expr;
      }param.count = expr;}}catch(e){warnWithSource(`EFX2202: ${param.name}: illegal array length: ${e}`,tokens[offset].line)}
    }return param
  };

  const stripDuplicates = e=>{const n={};return e.filter(e=>!n[e]&&(n[e]=true));};
  const exMap = {whitespace:true};

  const nextWord = (e,n)=>{for (; exMap[e[++n].type]; )
    {}return n};

  const nextSemicolon = (e,n,t=(e=>{}))=>{for (; ";"!==e[n].data; ) {
    t(e[n++]);
  }return n};

  return (e,n,t,r)=>{const s=[];for(let i=0;i<e.length;i++){
    let a;
    let o;
    let c = e[i];
    if ("uniform"!==c.data) {
      continue;
    }
    a = t;
    let l = getDefs(c.line,n);
    let p = {};
    p.tags = n[c.line-1];
    let d=nextWord(e,i+2);if("{"!==e[d].data){
      if (!samplerRE.test(e[i+2].data)) {
        warnWithSource("EFX2201: non-sampler uniforms must be declared in blocks.",c.line);
      }

      a = r;
      o = "sampler";
      Object.assign(p,extractInfo(e,i+2,n));

      if (a.find(e=>e.name===p.name)) {
        p.duplicate = true;
      }

      d = nextSemicolon(e,d);
    }else{
      for(p.name=e[i+2].data,p.members=[],o="block";"}"!==e[d=nextWord(e,d)].data;){
        const t=extractInfo(e,d,n);

        if (convertType(t.type).includes("sampler")) {
          warnWithSource("EFX2208: sampler uniforms must be declared outside blocks.",e[d].line);
        }

        p.members.push(t);
        d = nextSemicolon(e,d);
      }p.members.reduce((e,n)=>{
        let t=mappings.GFXGetTypeSize(n.type);if (n.count>1&&t<16) {
          const e=`uniform ${convertType(n.type)} ${n.name}[${n.count}]`;
          warn("EFX2203: "+e+": array UBO members need to be 16 bytes aligned to avoid implicit padding");
          t = 16;
        } else {
          if(12===t){
            const e=`uniform ${convertType(n.type)} ${n.name}`;
            warn("EFX2204: "+e+": please use 1, 2 or 4-component vectors to avoid implicit padding");
            t = 16;
          }
        }
        const r = Math.ceil(e/t)*t;
        const s = r-e;

        if (s) {
          warn(`EFX2205: UBO '${p.name}' introduces implicit padding: ${s} bytes before '${n.name}', consider re-ordering the members`);
        }

        return r+t*n.count;
      },0);let t=n.lines.find(n=>n>=e[i].line&&n<e[d].line);

      if (t) {
        warnWithSource(`EFX2206: ${p.name}: no preprocessors allowed inside uniform blocks!`,t);
      }

      let r=a.find(e=>e.name===p.name);

      if (r) {
        if (JSON.stringify(r.members)!==JSON.stringify(p.members)) {
          warnWithSource(`EFX2207: different UBO using the same name '${p.name}'`,c.line);
        }

        p.duplicate = true;
      }

      d = nextWord(e,d);

      if (";"!==e[d].data) {
        warnWithSource(`EFX2209: missing semicolon after UBO '${p.name}' declaration`,e[d].line);
      }
    }
    s.push({beg:e[i].position,end:e[d].position,name:p.name,type:o});

    if (!p.duplicate) {
      p.defines = stripDuplicates(l);
      a.push(p);
    }

    i = d;
  }return s};
})();

const miscChecks = (()=>{const e=new RegExp("\\b(?:asm|class|union|enum|typedef|template|this|packed|goto|switch|default|inline|noinline|volatile|public|static|extern|external|interface|flat|long|short|double|half|fixed|unsigned|superp|input|output|hvec2|hvec3|hvec4|dvec2|dvec3|dvec4|fvec2|fvec3|fvec4|sampler1D|sampler3D|sampler1DShadow|sampler2DShadow|sampler2DRect|sampler3DRect|sampler2DRectShadow|sizeof|cast|namespace|using)\\b");return n=>{
  const t=precisionRE.exec(n);

  if (t) {
    if (/#extension/.test(n.slice(t.index))) {
      warn("EFX2400: precision declaration must come after extensions");
    }
  } else {
    warn("EFX2401: precision declaration not found.");
  }

  const r=e.exec(n);

  if (r) {
    warn(`EFX2402: using reserved keyword in glsl1: ${r[0]}`);
  }

  const s=tokenizer(n).filter(e=>"preprocessor"!==e.type);
  shaderTokens = s;
  try{parser(s)}catch(e){warnWithSource(`EFX2404: glsl1 parser failed: ${e}`)}
};})();

const finalTypeCheck = (()=>{
  const e = "undefined"!=typeof document?document.createElement("canvas").getContext("webgl"):null;

  const n = (n,t)=>{
    let r=e.createShader(t);
    e.shaderSource(r,n);
    e.compileShader(r);
    if(!e.getShaderParameter(r,e.COMPILE_STATUS)){
      let t=1;
      const s = n.replace(/^|\n/g,()=>`\n${t++} `);
      const i = e.getShaderInfoLog(r);
      e.deleteShader(r);
      r = null;
      warn(`EFX2406: compilation failed:\n${i}\n${s}`);
    }return r
  };

  return (t,r,s)=>{
    if (!e) {
      return;
    }
    const i = "#version 100\n"+(e=>e.reduce((e,n)=>{let t=1;switch(n.type){case"string":t = n.options[0];break;case"number":t = n.range[0];}return`${e}#define ${n.name} ${t}\n`},""))(s);
    const a = n(i+t,e.VERTEX_SHADER);
    const o = n(i+r,e.FRAGMENT_SHADER);

    const c = ((...n)=>{
      let t=e.createProgram();
      n.forEach(n=>e.attachShader(t,n));
      e.linkProgram(t);
      if(!e.getProgramParameter(t,e.LINK_STATUS)){
        const n=e.getProgramInfoLog(t);
        e.deleteProgram(t);
        t = null;
        warn(`EFX2407: link failed: ${n}`);
      }return t
    })(a,o);

    e.deleteProgram(c);
    e.deleteShader(o);
    e.deleteShader(a);
  };
})();

const stripToSpecificVersion = (()=>{
  const globalSearch = /#(if|elif|else|endif)(.*)?/g;
  const legalExpr = /^[\d<=>!|&^\s]*(__VERSION__)?[\d<=>!|&^\s]*$/;
  return (code,version)=>{
    const instances=[];
    let cap = null;
    let temp = null;
    for (; cap=globalSearch.exec(code),cap; ) {
      if ("if"===cap[1]) {if(temp){temp.level++;continue}if (!legalExpr.test(cap[2])) {
        continue;
      }temp = {start:cap.index,end:cap.index,conds:[cap[2]],content:[cap.index+cap[0].length],level:1};} else {
        if ("elif"===cap[1]) {
          if (!temp||temp.level>1) {
            continue;
          }

          if (!legalExpr.test(cap[2])) {
            warn(`EFX2301: #elif conditions after a constant #if should be constant too; get '${cap[2]}'`);
            cap[2] = "";
          }

          temp.conds.push(cap[2]);
          temp.content.push(cap.index,cap.index+cap[0].length);
        } else {
          if ("else"===cap[1]) {
            if (!temp||temp.level>1) {
              continue;
            }
            temp.conds.push("true");
            temp.content.push(cap.index,cap.index+cap[0].length);
          } else {
            if("endif"===cap[1]){
              if (!temp||--temp.level) {
                continue;
              }
              temp.content.push(cap.index);
              temp.end = cap.index+cap[0].length;
              instances.push(temp);
              temp = null;
            }
          }
        }
      }
    }if (!instances.length) {
      return code;
    }let res=code.substring(0,instances[0].start);for(let j=0;j<instances.length;j++){const ins=instances[j];for (let i=0; i<ins.conds.length; i++) {
      if(eval(ins.conds[i].replace("__VERSION__",version))){const e=code.substring(ins.content[2*i],ins.content[2*i+1]);res += stripToSpecificVersion(e,version);break}
    }const next=instances[j+1]&&instances[j+1].start||code.length;res += code.substring(ins.end,next);}return res
  };
})();

const glsl300to100 = (e,n,t,r,s,i)=>{
  let a = "";
  let o = 0;

  r.forEach(t=>{
    if ("block"===t.type) {
      a += e.slice(o,t.beg);

      n.find(e=>e.name===t.name).members.forEach(n=>{
        const t=e.match(new RegExp(`\\b${n.name}\\b`,"g"));if (!t||t.length<=1) {
          return;
        }
        const r = convertType(n.type);
        const s = n.precision||"";
        a += `uniform ${s}${r} ${n.name}${"string"==typeof n.count||n.count>1?`[${n.count}]`:""};\n`;
      });

      o = t.end+(";"===e[t.end]);
    }
  });

  a = (a=(a+=e.slice(o)).replace(texLookup,(e,n,r,i)=>{const o="texture"+n;if (s.find(e=>e.name===o)) {
    return e;
  }let c=new RegExp("sampler(\\w+)\\s+"+r);const l=s.find(e=>i>e.beg&&i<e.end);let p=l&&c.exec(a.substring(l.beg,l.eng))||c.exec(a);if(!p){const n=t.find(e=>e.name===r);if (n&&n.options) {
    for(const e of n.options)if (p=(c=new RegExp("sampler(\\w+)\\s+"+e)).exec(a)) {
      break;
    }
  }if (!p) {
    warn(`EFX2300: sampler '${r}' does not exist`);
    return e;
  }}return`texture${p[1]}${n}(${r},`})).replace(layoutRE,()=>"");

  if (i) {
    a = (a=a.replace(inDecl,(e,n,t)=>`${n}attribute ${t};`)).replace(outDecl,(e,n,t)=>`${n}varying ${t};`);
  } else {
    const e=[];
    a = (a=a.replace(inDecl,(e,n,t)=>`${n}varying ${t};`)).replace(outDecl,(n,t,r,s)=>(e.push(s),""));
    if(e.length){const n=new RegExp(e.reduce((e,n)=>`${e}|${n}`,"").substring(1),"g");a = a.replace(n,"gl_FragColor");}
  }return a.replace(pragmasToStrip,"")
};

const decorateBindings = (()=>{const e=new Map;return (n,t,r,s)=>{
  s = s.filter(e=>!builtinRE.test(e.name));
  const i={block:t,sampler:r};e.clear();let a=0;s.forEach(t=>{
    const r = n.slice(a,t.beg);
    const s = {};
    const o = layoutExtract.exec(r);
    if(o){s.position = a+o.index+o[0].length-o[2].length-1;const n=bindingExtract.exec(o[1]);if(n){
      s.position = -1;
      const r=parseInt(n[1]);
      s.binding = r;
      e.set(r,true);
      const a = i[t.type].find(e=>e.name===t.name);
      const o = i[t.type].find(e=>e.binding===r);

      if (o) {
        o.binding = a.binding;
        a.binding = r;
      } else {
        if ("block"===t.type) {
          warn(`EFX2600: illegal custom binding for '${t.name}', block bindings should be consecutive and start from 0`);
        } else {
          if ("sampler"===t.type) {
            warn(`EFX2601: illegal custom binding for '${t.name}', sampler bindings should be consecutive`+` and start from ${mappings.UniformBinding.CUSTOM_SAMPLER_BINDING_START_POINT}`);
          }
        }
      }
    }}
    e.set(t.name,s);
    a = t.end;
  });let o="";
  a = 0;

  s.forEach(t=>{
    let{position:r}=e.get(t.name);const s=i[t.type].find(e=>e.name===t.name);

    if (void 0===r) {
      o += n.slice(a,t.beg);
      o += `layout(binding = ${s.binding}) `;
    } else {
      if (r>=0) {
        o += n.slice(a,r);
        o += `, binding = ${s.binding}`;
        o += n.slice(r,t.beg);
      } else {
        o += n.slice(a,t.beg);
      }
    }

    o += n.slice(t.beg,t.end);
    a = t.end;
  });

  return o+=n.slice(a);
};})();

const buildShader = (()=>{
  const e = /\s+$/gm;
  const n = /(^\s*\n){2,}/gm;
  const t = t=>{let r=t.replace(pragmasToStrip,"");return r=(r=r.replace(n,"\n")).replace(e,"")};

  const r = (e,n)=>t=>{
    if (!builtinRE.test(t.name)) {
      delete t.tags;
      return true;
    }const r=t.tags;let s;

    if (r&&r.builtin) {
      s = r.builtin;
      delete t.tags;
    } else {
      warn(`EFX2500: engine scope(global or local) not specified for builtin uniform '${t.name}'`);
      s = "global";
    }

    n[`${s}s`][e].push({name:t.name,defines:t.defines});
  };

  const s = (e,n,t)=>"main"===n?e:e+((e,n)=>e?`\nvoid main() { gl_Position = ${n}(); }\n`:`\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = ${n}(); }\n`)(t,n);
  const i = /([\w-]+)(?::(\w+))?/;

  const a = (e,n,t,r=[],a=[],o=[])=>{
    const c={};
    shaderName = e;
    const l={lines:[]};let{code:p,record:d,functions:f}=((e,n,t,r="main")=>{
      const a = i.exec(e);
      const o = a[2]||r;
      const c = new Set;
      const l = [];
      let p=unwindIncludes(`#include <${a[1]}>`,n,c);
      p = s(p,o,t);
      p = expandLiteralMacro(p);
      p = expandFunctionalMacro(p);
      p = hoistBlocks(p);
      return {code:p=eliminateDeadCode(p,o,l),record:c,functions:l};
    })(e,n,t);const u=shaderTokens=tokenizer(p,tokenizerOpt);extractDefines(u,r,l);const m=extractParams(u,l,a,o);
    c.blockInfo = m;
    c.record = d;
    c.glsl4 = p;
    c.glsl3 = stripToSpecificVersion(p,300);
    c.glsl1 = stripToSpecificVersion(glsl300to100(p,a,r,m,f,t),100);
    miscChecks(c.glsl1);
    return c;
  };

  return (e,n,s)=>{
    let i = [];
    let o = [];
    let c = [];
    const l={};
    l.vert = a(e,s,true,i,o,c);
    l.frag = a(n,s,false,i,o,c);
    finalTypeCheck(l.vert.glsl1,l.frag.glsl1,i);
    o.forEach(e=>e.members.forEach(e=>delete e.precision));
    const p={globals:{blocks:[],samplers:[]},locals:{blocks:[],samplers:[]}};
    o = o.filter(r("blocks",p));
    c = c.filter(r("samplers",p));
    let d=0;
    o.forEach(e=>e.binding=d++);

    if (d>mappings.UniformBinding.CUSTUM_UBO_BINDING_END_POINT) {
      warn(`EFX2501: too many UBOs: ${d}/${mappings.UniformBinding.CUSTUM_UBO_BINDING_END_POINT}`);
    }

    d = mappings.UniformBinding.CUSTOM_SAMPLER_BINDING_START_POINT;
    c.forEach(e=>e.binding=d++);
    const f = {vert:t(l.vert.glsl3),frag:t(l.frag.glsl3)};
    const u = {vert:t(l.vert.glsl1),frag:t(l.frag.glsl1)};
    const m = mappings.murmurhash2_32_gc(u.vert+u.frag,666);
    l.frag.record.forEach(l.vert.record.add,l.vert.record);
    return {hash:m,glsl3:f,glsl1:u,builtins:p,defines:i,blocks:o,samplers:c,record:l.vert.record};
  };
})();

const parseEffect = (()=>{
  const e = /CCEffect\s*%{([^]+?)(?:}%|%})/;
  const n = /CCProgram\s*([\w-]+)\s*%{([^]+?)(?:}%|%})/;
  const t = /#.*$/gm;
  const r = /\n[^\s]/;
  const s = /^[^\S\n]/gm;
  const i = /\t/g;

  const a = (e,n,t="effect")=>{if(Array.isArray(e)){if (!Array.isArray(n)) {
    warn(`EFX1002: ${t} must be an array`);
    return;
  }for (let r=0; r<n.length; r++) {
    a(e[0],n[r],t+`[${r}]`)
  }}else{if (!n||"object"!=typeof n||Array.isArray(n)) {
    warn(`EFX1003: ${t} must be an object`);
    return;
  }for (const e of Object.keys(n)) if (-1!==e.indexOf(":")) {
    warn(`EFX1004: syntax error at '${e}', you might need to insert a space after colon`);
  }if (e.any) {
    for(const r of Object.keys(n))a(e.any,n[r],t+`.${r}`);
  } else {
    for(const r of Object.keys(e)){let s=r;if ("$"===s[0]) {
      s = s.substring(1);
    } else {
      if (!n[s]) {
        continue;
      }
    }a(e[r],n[s],t+`.${s}`)}
  }}};

  return (o,c)=>{
    shaderName = "syntax";
    c = stripComments(c).replace(i," ".repeat(tabAsSpaces));
    let l = {name:o};
    let p = {};
    let d = e.exec((e=>e.replace(t,""))(c));
    if (d) {try{
      const e=yaml.safeLoad(d[1]);

      if (e.name) {
        l.name = e.name;
      }

      l.techniques = JSON.parse(JSON.stringify(e.techniques));
    }catch(e){warn(`EFX1001: CCEffect parser failed: ${e}`)}a(mappings.effectStructure,l)} else {
      error("EFX1000: CCEffect is not defined");
    }let f=n.exec(c);for(;f;){
      let e=f[2];for (; !r.test(e); ) {
        e = e.replace(s,"");
      }
      p[f[1]] = e;
      c = c.substring(f.index+f[0].length);
      f = n.exec(c);
    }return{effect:l,templates:p}
  };
})();

const mapPassParam = (()=>{
  const e = (e,n)=>{
    let t = 0;
    let r = n=>n.name===e&&(t=n.type,true);

    if (!n.blocks.some(e=>e.members.some(r))) {
      n.samplers.some(r);
    }

    return t;
  };

  const n = (e,n,t)=>{if (n<=0) {
    return"no matching uniform";
  }if (void 0!==e) {
    if("string"===t){if (!samplerRE.test(convertType(n))) {
      return"string for non-samplers"
    }}else{if (!Array.isArray(e)) {
      return"non-array for buffer members";
    }if (e.length!==mappings.GFXGetTypeSize(n)/4) {
      return"wrong array length"
    }}
  }};

  const t = /^(\w+)(?:\.([xyzw]+|[rgba]+))?$/;
  const r = {x:0,y:1,z:2,w:3,r:0,g:1,b:2,a:3};

  const s = (n,s)=>{
    const i = [n,0,0];
    const a = t.exec(n);
    if (!a) {
      warn(`EFX3303: illegal property target '${n}'`);
      return i;
    }
    const o = a[2]&&a[2].toLowerCase()||"";
    const c = r[o[0]]||0;

    if (o.split("").map((e,n)=>r[e]-c-n).some(e=>e)) {
      warn(`EFX3304: '${n}': random component swizzle is not supported`);
    }

    i[0] = a[1];
    i[1] = c;
    i[2] = e(a[1],s);

    if (o.length) {
      i[2] -= Math.max(0,mappings.GFXGetTypeSize(i[2])/4-o.length);
    }

    if (i[2]<=0) {
      warn(`EFX3305: no matching uniform target '${n}'`);
    }

    return i;
  };

  const i = (e,n)=>{for(const t of Object.keys(n)){
    const r=n[t];

    if ("object"==typeof r&&"object"==typeof e[t]) {
      i(e[t],r);
    } else {
      if (void 0===e[t]) {
        e[t] = r;
      }
    }
  }};

  const a = e=>{for(let n in e){let t=e[n];if ("string"==typeof t) {
    let r=parseInt(t);

    if (isNaN(r)) {
      r = mappings.passParams[t.toUpperCase()];
    }

    if (void 0!==r) {
      e[n] = r;
    }
  } else {
    if (Array.isArray(t)) {if (!t.length) {
      continue;
    }switch(typeof t[0]){case"object":t.forEach(a);break;case"string":a(t);break;case"number":e[n] = (255*t[0]<<24|255*t[1]<<16|255*t[2]<<8|255*(t[3]||255))>>>0;}} else {
      if ("object"==typeof t) {
        a(t);
      }
    }
  }}return e};

  const o = e=>{const n=[];for(const t of Object.keys(e)){
    const r = e[t];
    const s = mappings.SamplerInfoIndex[t];

    if (!(void 0!==r && void 0!==s)) {
      warn(`EFX3301: illegal sampler info '${t}'`);
    }

    if ("borderColor"===t) {
      n[s] = r.r;
      n[s+1] = r.g;
      n[s+2] = r.b;
      n[s+3] = r.a;
    } else {
      n[s] = r;
    }
  }return mappings.genSamplerHash(n)};

  const c = /^(\w+)\s*([+-])\s*([\dxabcdef]+)$/i;
  const l = mappings.RenderPriority.DEFAULT;
  const p = mappings.RenderPriority.MIN;
  const d = mappings.RenderPriority.MAX;
  return (t,r)=>{
    shaderName = "type error";
    const f={};

    if (t.priority) {
      f.priority = (e=>{
        let n=-1;const t=c.exec(e);
        n = t?mappings.RenderPriority[t[1].toUpperCase()]+parseInt(t[3])*("+"===t[2]?1:-1):parseInt(e);
        return isNaN(n)||n<p||n>d?(warn(`EFX3000: illegal pass priority: ${e}`),l):n;
      })(t.priority);

      delete t.priority;
    }

    if (t.depthStencilState) {
      f.depthStencilState = (e=>{
        for (const n of Object.keys(e)) if (n.startsWith("stencil")) {
          if (!(n.endsWith("Front") || n.endsWith("Back"))) {
            e[n+"Front"] = e[n+"Back"]=e[n];
            delete e[n];
          }
        }

        if (e.stencilWriteMaskFront!==e.stencilWriteMaskBack) {
          warn("EFX3100: WebGL(2) doesn't support inconsistent front/back stencil write mask");
        }

        if (e.stencilReadMaskFront!==e.stencilReadMaskBack) {
          warn("EFX3101: WebGL(2) doesn't support inconsistent front/back stencil read mask");
        }

        if (e.stencilRefFront!==e.stencilRefBack) {
          warn("EFX3102: WebGL(2) doesn't support inconsistent front/back stencil ref");
        }

        return a(e);
      })(t.depthStencilState);

      delete t.depthStencilState;
    }

    if (t.switch) {
      f.switch = ((e,n)=>(n.defines.find(n=>n.name===e)&&warn("EFX3200: don't use existing shader macros as pass switch"),e))(t.switch,r);
      delete t.switch;
    }

    if (t.properties) {
      f.properties = ((t,r)=>{let c={};for(const i of Object.keys(t)){
        if("__metadata__"===i){
          c = t[i];
          delete t[i];
          continue
        }
        const l = t[i];
        const p = e(i,r);

        if (void 0!==l.type) {
          warn(`EFX3300: property '${i}': you don't have to specify type in here`);
        }

        l.type = p;
        if(l.target){
          l.handleInfo = s(l.target,r);
          delete l.target;
          l.type = l.handleInfo[2];
          const n = l.editor&&l.editor.visible;
          const i = l.handleInfo[0];
          const a = e(l.handleInfo[0],r);

          if (!t[i]) {
            t[i] = {type:a,editor:{visible:false}};
          }

          if ((void 0===n || n)) {
            if (t[i].editor) {
              if (void 0===t[i].editor.deprecated) {
                t[i].editor.deprecated = true;
              }
            } else {
              t[i].editor = {deprecated:true};
            }
          }

          if (mappings.isSampler(a)) {
            if (l.value) {
              t[i].value = l.value;
            }
          } else {
            if (!t[i].value) {
              t[i].value = Array(mappings.GFXGetTypeSize(a)/4).fill(0);
            }

            if (Array.isArray(l.value)) {
              t[i].value.splice(l.handleInfo[1],l.value.length,...l.value);
            } else {
              if (void 0!==l.value) {
                t[i].value.splice(l.handleInfo[1],1,l.value);
              }
            }
          }
        }

        if (l.sampler) {
          l.samplerHash = o(a(l.sampler));
          delete l.sampler;
        }

        const d=typeof l.value;

        if (!("number"!==d && "boolean"!==d)) {
          l.value = [l.value];
        }

        const f=n(l.value,l.type,d);

        if (f) {
          warn(`EFX3302: illegal property declaration for '${i}': ${f}`);
        }
      }for(const e of Object.keys(t))i(t[e],c);return t})(t.properties,r);

      delete t.properties;
    }

    if (t.migrations) {
      f.migrations = t.migrations;
      delete t.migrations;
    }

    if (t.program) {
      f.program = t.program;
      delete t.program;
    }

    a(t);
    Object.assign(t,f);
  };
})();

const reduceHeaderRecord = e=>{const n=new Set;for(const t of e)t.record.forEach(n.add,n);return[...n.values()]};

const buildEffect = (e,n)=>{
  effectName = e;
  let{effect:t,templates:r}=parseEffect(e,n);if (!t||!Array.isArray(t.techniques)) {
    return null;
  }
  r = Object.assign({},chunksCache,r);
  const s=t.shaders=[];for(const e of t.techniques)for(const n of e.passes){
    let e = n.vert;
    let t = n.frag;
    delete n.vert;
    delete n.frag;
    let i = n.program=`${effectName}|${e}|${t}`;
    let a = s.find(e=>e.name===i);

    if (!a) {
      (a=buildShader(e,t,r)).name = i;
      s.push(a);
    }

    mapPassParam(n,a);
  }
  t.dependencies = reduceHeaderRecord(s);
  return t;
};

module.exports = {options:options,addChunksCache:addChunksCache,addChunk:addChunk,buildEffect:buildEffect};