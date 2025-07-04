"use strict";

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.resolution"
)}">\n        <span style="margin-right: 5px">W</span>\n        <ui-num-input v-value="local.previewWidth"></ui-num-input>\n        <span style="margin-right: 5px">H</span>\n        <ui-num-input v-value="local.previewHeight"></ui-num-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.preview"
)}">\n        <div class="flex-1 layout horizontal center">\n            <a \n                class="link flex-4"\n                v-on:click="$parent._openExternal($event, previewURL)"\n            >\n                {{previewURL}}\n            </a>\n        </div>\n    </ui-prop>\n`;

exports.name = "web-desktop";
exports.props = { local: null, project: null };

exports.data = function () {
    return { previewURL: "" };
  };

exports.created = function () {
    this.previewURL = `http://${Editor.remote.Network.ip}:${Editor.remote.PreviewServer.previewPort}/build`;
  };

exports.directives = {};
exports.methods = {};
