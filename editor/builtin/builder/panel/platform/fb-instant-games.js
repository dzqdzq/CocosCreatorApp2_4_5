"use strict";

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="project.webOrientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n            <option value="auto">Auto</option>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.3rd.webDebugger"
)}" tooltip="${Editor.T(
  "BUILDER.3rd.webDebugger_tooltip"
)}">\n        <ui-checkbox v-value="local.embedWebDebugger"></ui-checkbox>\n    </ui-prop>\n\n`;

exports.name = "fb-instant-games";
exports.props = { local: null, project: null, anysdk: null };

exports.data = function () {
    return {
      previewURL: "",
      orientation: [
        { value: "landscape", text: "Landscape" },
        { value: "portrait", text: "Portrait" },
        { value: "auto", text: "Auto" },
      ],
    };
  };

exports.created = function () {
    this.previewURL = `http://${Editor.remote.Network.ip}:${Editor.remote.PreviewServer.previewPort}/build`;
  };

exports.directives = {};
exports.methods = {};
