"use strct";
const e = require("./cache");
const t = require("./event");
let o=false;

exports.updateShowIndex = function(){
  if (!o) {
    o = true;

    process.nextTick(()=>{
      o = false;
      let r=0;

      e.queryNodes().forEach(e=>{
        if (e.show) {
          e.showIndex = r++;
        } else {
          e.showIndex = -1;
        }
      });

      t.emit("update-show-index");
    });
  }
};

exports.show = function(t,o){let r=e.queryNode(t);return !!r&&(r.show=o,exports.updateShowIndex(),true);};

exports.recFoldNodes = function(t,o){let r=e.queryNode(t);return !!r&&(r.children&&r.children.forEach(e=>{
  this.fold(e,o);
  this.recFoldNodes(e,o);
}),true);};

exports.fold = function(t,o){
  let r=e.queryNode(t);if (!r) {
    return false;
  }
  r.fold = o;

  r.children.forEach(t=>{(function t(n){
    let d=e.queryNode(n);

    if (r.show) {
      exports.show(n,!o);
    } else {
      exports.show(n,false);
    }

    if (o) {
      d.children.forEach(e=>{t(e)});
    } else {
      if (o===d.fold) {
        d.children.forEach(e=>{t(e)});
      }
    }
  })(t)});

  exports.updateShowIndex();
  e.saveNodeFoldState(r.id,o);
  return true;
};

exports.foldAllParentNodeState = function(t,o){let r=t.parent;if(r){
  this.fold(r,o);let t=e.queryNode(r);

  if (t) {
    this.foldAllParentNodeState(t,o);
  }
}};

exports.ignore = function(t,o){
  e.queryNodes().forEach(e=>{e.ignore = o;});
  if(o){(function t(o){
    let r=e.queryNode(o);
    r.ignore = false;

    if (r.children) {
      r.children.forEach(e=>{t(e)});
    }
  })(t)}
};

exports.rename = function(t){
  e.queryNodes().forEach(e=>{e.rename = e.id===t;});
  return true;
};

exports.select = function(t,o){let r=e.queryNode(t);return !!r&&(r.selected=o,true);};

exports.print = function(t){let o=e.queryNode(t);if (!o) {
  return;
}let r=o.name;for (; o.parent; ) {
  r = `${(o=e.queryNode(o.parent)).name}/${r}`;
}Editor.info(`Path: ${r}, UUID: ${t}`)};

exports.move = function(t,o,r){
  t = t.filter(e=>e!==o);
  let n;
  let d;
  let i = e.queryCache();
  o = i[o];

  if (1===r) {
    n = i[o.id].parent;
    d = o.id;
  } else {
    if (2===r) {
      n = o.id;
      d = null;
      exports.fold(n,false);
    } else {
      n = i[o.id].parent;
      d = i[o.id].next;
    }
  }

  Editor.Ipc.sendToPanel("scene","scene:move-nodes",t,n,d);
};

exports.prefab = function(t,o,r,n){
  let d = null;
  let i = null;
  if(o){
    let t=e.queryCache();
    o = t[o];

    if (1===r) {
      d = t[o.id].parent;
      i = o.id;
    } else {
      if (2===r) {
        d = o.id;
        i = null;
        exports.fold(d,false);
      } else {
        d = t[o.id].parent;
        i = t[o.id].next;
      }
    }
  }Editor.Ipc.sendToPanel("scene","scene:create-nodes-by-uuids",t,d,n,i)
};

exports.hint = function(t){
  let o=e.queryNode(t);if (!o||o.hint) {
    return false;
  }
  o.hint = true;
  setTimeout(()=>{o.hint = false;},800);
};

let r=[];

exports.staging = function(t){
  let o=e.queryNodes();
  r.length = 0;

  o.forEach(e=>{
    if (e.selected) {
      r.push(e.id);
    }

    e.selected = -1!==t.indexOf(e.id);
  });
};

exports.restore = function(){
  let t=[];

  e.queryNodes().forEach(e=>{
    if (e.selected) {
      t.push(e.id);
    }

    e.selected = -1!==r.indexOf(e.id);
  });

  r = [];
  return t;
};