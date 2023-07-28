const o = require("chroma-js");
const e = require("../tools");
const t = Editor.require("scene://utils/node");
let r={anchor:0,connectedAnchor:1};class c extends Editor.Gizmo{visible(){return true;}rectHitTest(o,e){
  let r = this._root.tbox();
  let c = t.getWorldPosition(this.node);
  return!!e&&o.containsRect(cc.rect(c.x-r.width/2,c.y-r.height/2,r.width,r.height))
}onCreateMoveCallbacks(){
  let o;
  let e;
  return {start:(t,r)=>{
    o = t;
    e = r;
  },update:(t,c,n,s)=>{
    let i = o+t;
    let h = e+c;
    if (s===r.anchor) {
      let o=this.screenToNodeLocalPos(cc.v2(i,h),this.node);
      this.adjustValue(o);
      this.target.anchor = o;
    } else {
      if(s===r.connectedAnchor){
        let o=this.screenToNodeLocalPos(cc.v2(i,h),this.target.connectedBody.node);
        this.adjustValue(o);
        this.target.connectedAnchor = o;
      }
    }
  }};
}onCreateRoot(){
  let t = this._root;

  let n = n=>{
    let s;

    if (n===c.ToolType.anchor) {
      s = "#4793e2";
    } else {
      if (n===c.ToolType.connectedAnchor) {
        s = "#cccc00";
      }
    }

    let i = t.line(0,0,1,1).stroke({width:2,color:s});
    let h = this.createAnchorGroup();
    h.style("pointer-events","bounding-box").style("cursor","move").stroke({width:2,color:s}).fill({color:s});

    h.on("mouseover",function(){
      var e=o(s).brighter().hex();
      h.stroke({color:e});
      i.stroke({color:e});
    });

    h.on("mouseout",function(){
      h.stroke({color:s});
      i.stroke({color:s});
    });

    let d=h.plot;

    h.plot = (o => {
      let t;
      let c;
      let s;
      let l;

      if (d) {
        d.apply(h,arguments);
      }

      if (n===r.anchor) {
        t = o.pos.x;
        c = o.pos.y;
        s = o.anchor.x;
        l = o.anchor.y;
      } else {
        if (!o.connectedPos) {
          return;
        }
        t = o.connectedPos.x;
        c = o.connectedPos.y;
        s = o.connectedAnchor.x;
        l = o.connectedAnchor.y;
      }
      h.move(s,l);

      if (this.editing||this.hovering) {
        i.plot(t,c,s,l);
        i.style("stroke-dasharray",e.dashLength());
        i.show();
      } else {
        i.hide();
      }
    });

    this.registerMoveSvg(h,n);
    return h;
  };

  t.anchorGroup = n(r.anchor);
  t.connectedAnchorGroup = n(r.connectedAnchor);

  if (this.createToolGroup) {
    t.toolGroup = this.createToolGroup();
  }
}createArgs(){
  let o = {};
  let e = this.node;
  let t = e.convertToWorldSpaceAR(this.target.anchor);
  o.anchor = this.worldToPixel(t);
  o.pos = this.worldToPixel(e.convertToWorldSpaceAR(cc.Vec2.ZERO));
  if(this.target.connectedBody){
    let e = this.target.connectedBody.node;
    let t = e.convertToWorldSpaceAR(this.target.connectedAnchor);
    o.connectedAnchor = this.worldToPixel(t);
    o.connectedPos = this.worldToPixel(e.convertToWorldSpaceAR(cc.Vec2.ZERO));
  }return o
}dirty(){
  let o=this._viewDirty()||this._nodeDirty()||this._dirty;

  if (this.target.connectedBody) {
    o = o||this._nodeDirty(this.target.connectedBody.node);
  }

  return o;
}onUpdate(){
  let o = this._root;
  let e = this.createArgs();

  if (this.target.connectedBody) {
    o.connectedAnchorGroup.show();
  } else {
    o.connectedAnchorGroup.hide();
  }

  o.anchorGroup.plot(e);
  o.connectedAnchorGroup.plot(e);

  if (o.toolGroup) {
    o.toolGroup.plot(e);
  }
}}
c.ToolType = r;
module.exports = c;