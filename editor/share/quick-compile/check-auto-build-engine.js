module.exports = function () {
  let e = Editor.Profile.load("local://settings.json");

  if (!(e && false === e.get("use-global-engine-setting"))) {
    e = Editor.Profile.load("global://settings.json");
  }

  let t = e.get("use-default-js-engine");
  return Editor.dev || !t;
};
