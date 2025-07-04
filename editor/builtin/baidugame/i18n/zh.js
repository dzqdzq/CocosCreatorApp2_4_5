module.exports = {
  platform_name: "百度小游戏",
  remote_server_address: "资源服务器地址",
  remote_server_address_tips:
    "用于下载远程资源的服务器地址，由于百度小游戏限制原生包为 4MB，如果超过的话可以把构建后的 remote 目录存放到服务器进行下载",
  sub_context: "开放数据域代码目录",
  sub_context_tips:
    "该目录需要包含自身的文件名，构建后会自动配置到 game.json 中。",
};
