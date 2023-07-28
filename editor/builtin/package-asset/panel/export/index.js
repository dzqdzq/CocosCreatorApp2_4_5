const e = require("electron");
const t = require("fire-fs");
const s = Editor.require("packages://package-asset/utils.js");
const r = Editor.require("packages://package-asset/parse/export.js");
const a = Editor.require("packages://package-asset/lib/jszip.min.js");
const i = Editor.require("packages://package-asset/panel/common/asset-item.js");
Vue.component("package-asset-item",i);

Editor.Panel.extend({style:t.readFileSync(Editor.url("packages://package-asset/panel/style.css"))+"",template:t.readFileSync(Editor.url("packages://package-asset/panel/export/panel.html"))+"",ready(){
  s.init(this.profiles);

  this._vm = new window.Vue({el:this.shadowRoot,data:{assetUuid:"",assetTree:{name:"",url:"",children:[],type:"mount",folded:true,selected:true,parent:null}},watch:{assetUuid:{handler(e){if (!e) {
    this.assetTree = null;
    return;
  }this._queryDependAsset(e)}}},methods:{T:s.T,_showLoadBar(){return this.assetUuid&&!this.assetTree},_showContent(){return this.assetUuid&&this.assetTree},_isDisabled(){return""===this.assetUuid||this.assetTree&&0===this.assetTree.children.length},_isExportDisabled(){return this._isDisabled()||this.assetTree&&this.assetTree.children.every(e=>!e.selected)},onChooseScene(){s.showExportResDialog((e,t)=>{
    if (e) {
      Editor.error(e);
      return;
    }
    this.assetUuid = t.uuid;
    s.save("current-scene-uuid",this.assetUuid);
  })},onRefresh(){this._queryDependAsset(this.assetUuid)},_queryDependAsset(e){
    this.assetTree = null;

    Editor.Scene.callSceneScript("package-asset","query-depend-asset",e,(e,t)=>{
      if (e) {
        Editor.error(e);
        return;
      }
      this.assetTree = new r.FileRoot("assets","","mount");
      r.queryAssetTreeByUuidList(this.assetTree,t);
    },-1);
  },onAssetChanged(e){this.assetUuid = e.detail.value;},onExport(){let r=new a;function i(e,s,a,n){if (!e.selected) {
    return n();
  }if ("folder"===e.type||"mount"===e.type) {
    let l;

    if ("assets"!==e.name) {
      l = function(e,s){
        let a;

        if (s) {
          (a=s.folder(e.name)).file(e.name+".meta",t.readFileSync(e.url+".meta"));
        } else {
          a = r.folder(e.name);
          r.file(e.name+".meta",t.readFileSync(e.url+".meta"));
        }

        return a;
      }(e,s);
    }

    if (e.children.length<1) {
      return n();
    }let o=0;for(let t=0,s=e.children.length;t<s;++t){i(e.children[t],l,a,()=>{
      if (++o>=s) {
        n();
      }
    })}
  } else {
    (function(e,s){
      if (s) {
        s.file(e.name,t.readFileSync(e.url));
        s.file(e.name+".meta",t.readFileSync(e.url+".meta"));
      } else {
        r.file(e.name,t.readFileSync(e.url));
        r.file(e.name+".meta",t.readFileSync(e.url+".meta"));
      }
    })(e,s);

    a[e.name] = e.type;
    n();
  }}s.showExportOutPathDialog((s,a)=>{if (s) {
    Editor.error(s);
    return;
  }let n={};i(this.assetTree,null,n,()=>{
    r.file("&asset&type&.json",JSON.stringify(n));
    r.generateNodeStream({type:"nodebuffer"}).pipe(t.createWriteStream(a)).on("finish",()=>{let e=this.T("EXPORT_ASSET.export_tips",{outPath:a});Editor.log(e)});
    e.shell.showItemInFolder(a);
  })})}}});
},messages:{"asset-db:asset-changed"(e,t){this._vm.onRefresh(t)}}});