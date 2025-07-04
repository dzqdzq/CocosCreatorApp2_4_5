"use strict";Vue.component("cc-widget",{dependencies:["packages://inspector/share/alignment-preview.js"],template:'\n    <style>\n      #widget-outer {\n        width: 200px;\n        margin: 0 auto;\n      }\n      #upper {\n        margin: 0 auto 6px auto;\n      }\n      #lower {\n        margin-left: 6px;\n      }\n      #widget-outer .h-control-group {\n        height: 26px;\n        position: relative;\n        margin-left: 72px;\n      }\n      #widget-outer .v-control-group {\n        width: 47px;\n        height: 39px;\n      }\n      #widget-outer .top-input {\n        position: relative;\n        margin-left: 18px\n      }\n      #widget-outer .bottom-input {\n        margin-top: 4px;\n      }\n      #widget-outer .right-input {\n        position: relative;\n      }\n      /*.bottom-input::shadow input {*/\n        /*vertical-align: text-bottom;*/\n        /*padding: 0.2em 0.4em;*/\n      /*}*/\n      /*.right-input::shadow input {*/\n        /*vertical-align: text-bottom;*/\n        /*padding: 0.2em 0.4em;*/\n      /*}*/\n      #widget-outer .v-checkbox {\n        margin: 0px;\n      }\n      #widget-outer .centered-prop {\n        height: 25px;\n      }\n      #widget-outer ui-input {\n        width: 5.4em;\n        margin: 0px;\n      }\n      #widget-outer hr {\n        margin-top: 5px;\n        margin-bottom: 5px;\n      }\n    </style>\n\n    <div id="widget-outer">\n      <div id="upper">\n        <div class="h-control-group layout horizontal center">\n          <ui-checkbox\n            v-value="target.isAlignTop.value"\n            v-values="target.isAlignTop.values"\n            :multi-values="_checkWidgetMulti(target.isAlignTop)"\n            @change="_onTopBottomChecked"\n            :title="T(\'COMPONENT.widget.align_top\')"\n          >Top</ui-checkbox>\n          <ui-input class="top-input small"\n            v-value="topValue"\n\n            @confirm="_onTopChanged"\n            :title="T(\'COMPONENT.widget.top\')"\n            v-show="_checkWidgetInput(target.isAlignTop, multi)"\n          ></ui-input>\n        </div>\n\n        <div class="layout horizontal center">\n          <div class="v-control-group layout vertical end">\n            <ui-checkbox class="v-checkbox"\n              v-value="target.isAlignLeft.value"\n              v-values="target.isAlignLeft.values"\n              :multi-values="_checkWidgetMulti(target.isAlignLeft)"\n              @change="_onLeftRightChecked"\n              :title="T(\'COMPONENT.widget.align_left\')"\n            >Left</ui-checkbox>\n            <ui-input class="bottom-input small"\n              :value="leftValue"\n              @confirm="_onLeftChanged"\n              :title="T(\'COMPONENT.widget.left\')"\n              v-show="_checkWidgetInput(target.isAlignLeft, multi)"\n            ></ui-input>\n          </div>\n\n          <cc-alignment-preview :target.sync="target"></cc-alignment-preview>\n\n          <div class="v-control-group layout vertical">\n            <ui-checkbox class="v-checkbox"\n              v-value="target.isAlignRight.value"\n              v-values="target.isAlignRight.values"\n              :multi-values="_checkWidgetMulti(target.isAlignRight)"\n              @change="_onLeftRightChecked"\n              :title="T(\'COMPONENT.widget.align_right\')"\n            >Right</ui-checkbox>\n            <ui-input class="bottom-input small"\n              :value="rightValue"\n              @confirm="_onRightChanged"\n              :title="T(\'COMPONENT.widget.right\')"\n              v-show="_checkWidgetInput(target.isAlignRight, multi)"\n            ></ui-input>\n          </div>\n        </div>\n\n        <div class="h-control-group layout horizontal center">\n          <ui-checkbox class="h-checkbox"\n            v-value="target.isAlignBottom.value"\n            v-values="target.isAlignBottom.values"\n            :multi-values="_checkWidgetMulti(target.isAlignBottom)"\n            @change="_onTopBottomChecked"\n            :title="T(\'COMPONENT.widget.align_bottom\')"\n          >Bottom</ui-checkbox>\n          <ui-input class="right-input small"\n            :value="bottomValue"\n            @confirm="_onBottomChanged"\n            :title="T(\'COMPONENT.widget.bottom\')"\n            v-show="_checkWidgetInput(target.isAlignBottom, multi)"\n          ></ui-input>\n        </div>\n      </div>\n\n      <div id="lower" class="layout vertical">\n        <div class="centered-prop layout horizontal center">\n          <ui-checkbox\n            v-value="target.isAlignHorizontalCenter.value"\n            v-values="target.isAlignHorizontalCenter.values"\n            :multi-values="_checkWidgetMulti(target.isAlignHorizontalCenter)"\n            @change="_onHorizontalCenterChecked"\n            :title="T(\'COMPONENT.widget.align_h_center\')"\n          >Horizontal Center</ui-checkbox>\n          <span class="flex-1"></span>\n          <ui-input\n            :value="horizontalCenterValue"\n            v-values="horizontalCenterValues"\n            :multi-values="_checkWidgetMulti(target.isAlignHorizontalCenter) && _checkWidgetMulti(horizontalCenterValues)"\n            @confirm="_onHorizontalCenterChanged"\n            :title="T(\'COMPONENT.widget.horizontal_center\')"\n            v-show="target.isAlignHorizontalCenter.value === true"\n          ></ui-input>\n        </div>\n        <div class="centered-prop layout horizontal center">\n          <ui-checkbox class="v-checkbox"\n            v-value="target.isAlignVerticalCenter.value"\n            v-values="target.isAlignVerticalCenter.values"\n            :multi-values="_checkWidgetMulti(target.isAlignVerticalCenter)"\n            @change="_onVerticalCenterChecked"\n            :title="T(\'COMPONENT.widget.align_v_center\')"\n          >Vertical Center</ui-checkbox>\n          <span class="flex-1"></span>\n          <ui-input\n            :value="verticalCenterValue"\n            v-values="horizontalCenterValues"\n            :multi-values="_checkWidgetMulti(target.isAlignVerticalCenter) && _checkWidgetMulti(verticalCenterValue)"\n            @confirm="_onVerticalCenterChanged"\n            :title="T(\'COMPONENT.widget.vertical_center\')"\n            v-show="target.isAlignVerticalCenter.value === true"\n          ></ui-input>\n        </div>\n      </div>\n\n      <hr/>\n    </div>\n\n    <ui-prop\n      v-prop="target.target"\n      :multi-values="multi"\n    ></ui-prop>\n    <ui-prop\n      v-prop="target.alignMode"\n      :multi-values="multi"\n    ></ui-prop>\n  ',props:{target:{twoWay:true,type:Object},multi:{type:Boolean}},computed:{horizontalCenterValue(){return this._compose(this.target.horizontalCenter,this.target.isAbsoluteHorizontalCenter.value)},horizontalCenterValues(){return this.target.isAbsoluteHorizontalCenter.values.map(t=>this._compose(this.target.horizontalCenter,t))},verticalCenterValue(){return this._compose(this.target.verticalCenter,this.target.isAbsoluteVerticalCenter.value)},topValue(){return this._compose(this.target.top,this.target.isAbsoluteTop.value)},leftValue(){return this._compose(this.target.left,this.target.isAbsoluteLeft.value)},rightValue(){return this._compose(this.target.right,this.target.isAbsoluteRight.value)},bottomValue(){return this._compose(this.target.bottom,this.target.isAbsoluteBottom.value)}},methods:{T:Editor.T,_compose(t,e){
  var i = t.value;
  var n = t.values;
  if (this.multi&&n.some(t=>n[0]!==t)) {
    return"-";
  }
  i = i||0;

  if (!e) {
    i *= 100;
  }

  let a=e?"px":"%";

  if (0===i) {
    i = 0;
  }

  return ""+i.toFixed(2)+a;
},_decompose(t){
  let e;

  if (t.endsWith("%")||t.endsWith("％")) {
    t = t.slice(0,-1);
    e = false;
  } else {
    if (t.endsWith("px")) {
      t = t.slice(0,-2);
    }

    e = true;
  }

  t = ""===t?0:parseFloat(t);

  if (!e) {
    t /= 100;
  }

  return {value:t,isAbsolute:e};
},_changeMargin(t,e,i){if(this.target){
  let n=this._decompose(t);if (isNaN(n.value)) {
    Editor.warn('Invalid input: "%s"',t);
    return false;
  }

  if (n.value!==this.target[e].value) {
    this.target[e].value = n.value;
  }

  if (n.isAbsolute!==this.target[i].value) {
    this.target[i].value = n.isAbsolute;
  }
}return true;},_changePropValue(t,e){
  Editor.UI.fire(this.$el,"target-change",{bubbles:true,detail:{type:t.type,path:t.path,value:t.value}});
  Editor.UI.fire(this.$el,"target-change",{bubbles:true,detail:{type:e.type,path:e.path,value:e.value}});
  Editor.UI.fire(this.$el,"target-confirm",{bubbles:true,detail:{type:t.type,path:t.path,value:t.value}});
},_onHorizontalCenterChanged(t){
  this._changeMargin(t.detail.value,"horizontalCenter","isAbsoluteHorizontalCenter");
  this._changePropValue(this.target.horizontalCenter,this.target.isAbsoluteHorizontalCenter);
},_onVerticalCenterChanged(t){
  this._changeMargin(t.detail.value,"verticalCenter","isAbsoluteVerticalCenter");
  this._changePropValue(this.target.verticalCenter,this.target.isAbsoluteVerticalCenter);
},_onTopChanged(t){
  this._changeMargin(t.detail.value,"top","isAbsoluteTop");
  this._changePropValue(this.target.top,this.target.isAbsoluteTop);
},_onLeftChanged(t){
  this._changeMargin(t.detail.value,"left","isAbsoluteLeft");
  this._changePropValue(this.target.left,this.target.isAbsoluteLeft);
},_onRightChanged(t){
  this._changeMargin(t.detail.value,"right","isAbsoluteRight");
  this._changePropValue(this.target.right,this.target.isAbsoluteRight);
},_onBottomChanged(t){
  this._changeMargin(t.detail.value,"bottom","isAbsoluteBottom");
  this._changePropValue(this.target.bottom,this.target.isAbsoluteBottom);
},_onLeftRightChecked(t){
  if (t.detail.value&&this.target&&this.target.isAlignHorizontalCenter.value) {
    this.target.isAlignHorizontalCenter.value = false;
  }
},_onTopBottomChecked(t){
  if (t.detail.value&&this.target&&this.target.isAlignVerticalCenter.value) {
    this.target.isAlignVerticalCenter.value = false;
  }
},_onHorizontalCenterChecked(t){
  if (t.detail.value&&this.target&&(this.target.isAlignLeft.value||this.target.isAlignRight.value)) {
    this.target.isAlignLeft.value = false;
    this.target.isAlignRight.value = false;
  }
},_onVerticalCenterChecked(t){
  if (t.detail.value&&this.target&&(this.target.isAlignTop.value||this.target.isAlignBottom.value)) {
    this.target.isAlignTop.value = false;
    this.target.isAlignBottom.value = false;
  }
},_checkWidgetMulti(t){
  var e = t.values?t.values:t;
  var i = e[0];
  return!e.every(t=>t===i)
},_checkWidgetInput:(t,e)=>e?t.values.every(t=>true===t):true===t.value}});