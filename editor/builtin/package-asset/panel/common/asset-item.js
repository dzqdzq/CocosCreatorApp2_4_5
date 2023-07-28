"use strict";require("../../utils");function e(t,n,o){
  let i=t&&t.parent;if (!i) {
    if (o) {
      o();
    }

    return;
  }
  let c = i.children;
  let s = c&&c.every(e=>!e[n]);

  if (s) {
    i[n] = false;
    e(i,n,o);
  } else {
    if ((s = c&&c.some(e=>e[n]))) {
      i[n] = true;
      e(i,n,o);
    }
  }
}function t(e,n,o,i){
  let c=e.children;

  if (c) {
    c.forEach(e=>{
      if (void 0!==e[n]) {
        e[n] = o;
      }

      t(e,n,o,i);
    });
  } else {
    i();
  }
}
exports.template = '\n\n<div>\n    <div class="wrapper content">\n        <i class="fa fa-caret-down"\n            id="foldIcon"\n            :style="tree.folded ? \'transform: rotate(0deg);\' : \'transform: rotate(-90deg);\'"\n            @dblclick="onStopDefault"\n            @click="onFoldChange"\n        ></i>\n        <ui-checkbox class="item-checkbox" \n            v-value="tree.selected" \n            v-on:confirm="onSelectChange"\n        ></ui-checkbox>\n        <img class="icon" :src="tree.icon">\n        <span class="foldName"> {{tree.name}} </span>\n    </div>\n\n    <div class="item-content" v-show="tree.folded" v-for="item in tree.children">\n        <div class="item layout horizontal content" \n            v-if="item.type !== \'folder\'" \n        >\n            <ui-checkbox class="item-checkbox" \n                v-value="item.selected" \n                v-on:confirm="onItemSelectChange(item)"\n            >\n            </ui-checkbox>\n            <img class="item-img" :src=\'item.icon\'>\n            <p class="item-name"> {{item.name}} </p>\n        </div>\n        \n        <package-asset-item \n            v-if="item.type === \'folder\'" \n            v-bind:tree="item"\n        >\n        </package-asset-item>\n    </div>\n</div>\n\n';
exports.props = ["tree"];
exports.created = function(){};

exports.methods = {onItemSelectChange(n){
  event.stopPropagation();
  t(n,"selected",n.selected,()=>{e(n,"selected")});
},onSelectChange:function(n){
  n.stopPropagation();
  t(this.tree,"selected",this.tree.selected,()=>{e(this.tree,"selected")});
},onStopDefault(e){
  e.stopPropagation();
  e.preventDefault();
},onFoldChange(e){
  e.stopPropagation();
  e.preventDefault();
  this.tree.folded = !this.tree.folded;
}};