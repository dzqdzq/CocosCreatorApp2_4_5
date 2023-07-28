require("./utils");const e=require("../camera");module.exports = {onMouseUp(c){if(1===c.which){
  let t = c.offsetX;
  let n = cc.game.canvas.height-c.offsetY;
  let o = cc.engine.getInstanceById(cc.engine.editingRootNode);

  if (!o) {
    o = cc.director.getScene();
  }

  let i = e._camera.getRay(cc.v3(t,n,1));
  let r = cc.geomUtils.intersect.raycast(cc.director.getScene(),i,function(e,c,t){let n=c.getComponent(cc.MeshRenderer);return n&&n.mesh?cc.geomUtils.intersect.rayMesh(e,n.mesh):t},function(e){return!(e.getComponent(cc.Canvas)||e._objFlags&(cc.Object.Flags.LockedInEditor|cc.Object.Flags.HideInHierarchy))});
  let d = false;
  let s = Editor.Selection.curSelection("node");

  if ((c.metaKey || c.ctrlKey)) {
    d = true;
  }

  if (r.length>0) {
    let e=r[0].node;

    if (e) {
      if (d) {
        if (-1===s.indexOf(e.uuid)) {
          Editor.Selection.select("node",e.uuid,false,true);
        } else {
          Editor.Selection.unselect("node",e.uuid,true);
        }
      } else {
        Editor.Selection.select("node",e.uuid,true,true);
      }
    }
  } else {
    Editor.Selection.clear("node")
  }
}}};