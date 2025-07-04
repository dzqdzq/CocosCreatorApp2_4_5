module.exports = {
  IMPORT_ASSET: {
    title: "Import Asset",
    folder_path: "From ",
    out_path: "To",
    select_path: "Find",
    content_tips: "Select the path to the folder you want to import...",
    import: "Import",
    progress_state_start: "Start import...",
    progress_state_wait: "Wait for the file to import zip...",
    progress_state_ready: "Resolved, waiting for import...",
    progress_state_import: "Import %{name} successfully...",
    progress_state_end: "Import complete...",
    file: "file",
    folder: "folder",
    err_title: "Import asset error",
    err_info_not_exist:
      "Import failed! Could not find folder for path: %{outPath}",
    err_info_repeat_asset:
      "The imported asset is the same as the asset uuid in the project. You can not complete the import, delete the old asset, or import to ensure that the path of the new asset is the same as the original asset。\n\n The following is a list of problematic asset：\n\n %{msg}",
    confirmation_box_title: "Import asset",
    confirmation_box_content:
      "Are you sure you want to import it into the %{outPath} folder? \n ( * Note that you cannot import a script with the same name)",
    parse_zip_err_title: "Import asset error",
    parse_zip_err_content:
      "Parsing ZIP resource failed! Please re select the correct ZIP format file exported by Cocos Crateor...",
    parse_particle_positionType:
      'Since 2.1.1, Creator has improved the Position Type of the Particle System, to support the FREE mode and optimizes the particle effect under the RELATIVE mode. To try to ensure that your project is not affected, the particle positionType attribute in the current scene or prefab has been automatically switched from FREE to RELATIVE mode. Details:\nAsset: "%{url}"\nNode: "%{nodeName}"',
  },
  EXPORT_ASSET: {
    title: "Export Asset",
    asset: "Scene or Prefab",
    select_path: "Select",
    content_tips: "Select the scene you want to export...",
    all: "All",
    refresh: "Refresh",
    export: "Export",
    export_tips: "Export %{outPath} success.",
  },
};
