let a = {
    wechat: "wechatgame",
    baidu: "baidugame",
    xiaomigame: "xiaomi",
    alipaygame: "alipay",
    vivo: "qgame",
    vivogame: "qgame",
    oppo: "quickgame",
    oppogame: "quickgame",
    huaweigame: "huawei",
    jkw: "jkw-game",
    jkwgame: "jkw-game",
  };

let e = { cocosplay: "jkw-game" };

module.exports = {
  check(e) {
    if (e in a) {
      throw new Error(
        `Cannot build project to the platform '${e}', please use platfrom '${a[e]}' instead.`
      );
    }
  },
  transform: (a) => e[a] || a,
};
