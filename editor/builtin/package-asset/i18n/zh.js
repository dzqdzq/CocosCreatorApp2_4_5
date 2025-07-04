module.exports = {
  IMPORT_ASSET: {
    title: "导入资源",
    folder_path: "zip: ",
    out_path: "目标: ",
    select_path: "打开",
    content_tips: "请选择你要导入的文件夹路径...",
    import: "导入",
    progress_state_start: "开始导入...",
    progress_state_wait: "等待选择导入 zip 的文件...",
    progress_state_ready: "解析完毕，等待导入...",
    progress_state_import: "导入%{name} 成功.",
    progress_state_end: "导入完成...",
    file: "文件",
    folder: "文件夹",
    err_title: "导入资源错误提示",
    err_info_not_exist: "导入失败!! 找不到目标，路径为：%{outPath}",
    err_info_repeat_asset:
      "导入的资源和项目中原有资源 uuid 相同，无法完成导入，请删除旧资源；或导入时确保新资源的路径和原资源相同，新资源将会覆盖旧资源。\n\n 以下是有问题的资源列表：\n\n %{msg}",
    confirmation_box_title: "导入资源二次确认",
    confirmation_box_content:
      "是否确定导入到 %{outPath} 文件夹下？\n（ * 注意不能导入同名脚本）",
    parse_zip_err_title: "导入资源错误提示",
    parse_zip_err_content:
      "解析 ZIP 资源失败! 请你重新选择 Cocos Crateor 所导出的正确 ZIP 格式文件...",
    parse_particle_positionType:
      '从 2.1.1 版本开始，Creator 对粒子系统的 Position Type 进行了完善，现在已支持全局模式（FREE 模式），并优化了 RELATIVE 模式下的粒子效果。\n为了尽量保证你的项目不受影响，当前场景或预制中的粒子 positionType 属性已由 FREE 自动切换为 RELATIVE 模式。资源信息：\n资源："%{url}"\n所在节点："%{nodeName}"',
  },
  EXPORT_ASSET: {
    title: "导出场景或者预制资源",
    asset: "场景或者预制",
    select_path: "选择",
    content_tips: "请选择你要导出场景或者预制...",
    all: "全选",
    refresh: "刷新",
    export: "导出",
    export_tips: "导出 %{outPath} 成功.",
  },
};
