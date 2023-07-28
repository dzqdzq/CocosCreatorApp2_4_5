"use strict";const e=require("fire-fs");
exports.template = e.readFileSync(Editor.url("packages://project-settings/panel/template/module.html"),"utf-8");
exports.props = ["excluded"];
exports.data = function(){return {module:null,all:false};};

exports.methods = {T:Editor.T,_onSelectModule(e,t){t.options.forEach((e,d)=>{
  let s = `${t.name}/${e}`;
  let n = this.excluded.indexOf(s);
  let l = n>-1;

  if (d===parseInt(t.currentIndex)&&l) {
    this.excluded.splice(n,1);
  } else {
    if (!l) {
      this.excluded.push(s);
    }
  }
})},_updateAllChekced(){this.all = this.module.every(e=>e.checked);},_updateExcluded(){
  clearTimeout(this._timer);

  this._timer = setTimeout(()=>{
    this.excluded.length = 0;

    this.module.forEach(e=>{
      if (e.checked) {
        e.options.forEach((t,d)=>{
          if (d!==parseInt(e.currentIndex)) {
            this.excluded.push(`${e.name}/${t}`);
          }
        });
      } else {
        if (e.options.length>0) {
          e.options.forEach(t=>{this.excluded.push(`${e.name}/${t}`)});
        } else {
          this.excluded.push(e.name);
        }
      }
    });
  },400);
},_selectAll(e){
  this.all = e;

  this.module.forEach(t=>{
    if (!t.locked) {
      t.checked = e;
    }
  });

  this._updateExcluded();
},_selectModule(e,t){
  e.checked = t;
  let d=e.name;if (t) {
    if (e.options.length>0) {
      d = `${e.name}/${e.options[e.currentIndex]}`;
    }

    let t=this.excluded.indexOf(d);
    this.excluded.splice(t,1);

    if (e.dependencies) {
      e.dependencies.forEach(e=>{this.module.some(t=>{if (t.name!==e) {
        return false;
      }this._selectModule(t,true)})});
    }
  } else {
    if (e.options.length>0) {
      e.options.forEach(t=>{this.excluded.push(`${e.name}/${t}`)});
    } else {
      this.excluded.push(d);
    }

    this.module.forEach(e=>{
      if (e.dependencies&&-1!==e.dependencies.indexOf(d)) {
        this._selectModule(e,false);
      }
    });
  }
  this._updateAllChekced();
  this._updateExcluded();
}};

exports.created = function(){
  this.all = true;

  this.module = function(){
    const t=Editor.url("unpack://engine/modules.json");let d=[];

    e.readJsonSync(t).forEach(e=>{
      let t;
      let s = e.name.split("/").filter(Boolean);
      let n = s.length>1;

      if (n) {
        t = d.find(e=>e.name===s[0]);
      }

      if (!t) {
        t = {name:s[0],checked:true,hide:e.hide,locked:e.locked,since:e.since,dependencies:e.dependencies,options:[],currentIndex:0};
        d.push(t);
      }

      if (n) {
        t.options.push(s[1]);
      }
    });

    return d;
  }();

  if (this.excluded) {
    this.module.forEach(e=>{
      if (e.options.length>0) {
        e.checked = e.options.some((t,d)=>!this.excluded.includes(`${e.name}/${t}`)&&(e.currentIndex=d,true));
      } else {
        e.checked = !this.excluded.includes(e.name);
      }

      if (!e.checked) {
        this.all = false;
      }
    });
  }
};