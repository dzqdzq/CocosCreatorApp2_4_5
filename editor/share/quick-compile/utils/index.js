exports.formatPath = function (e) {
  return e.replace(/\\/g, "/");
};

exports.isNodeModulePath = function (e) {
    return -1 !== exports.formatPath(e).indexOf("/node_modules/");
  };
