"use strict";
module.exports = {
  tips: {
    data_error: "Data exception, please try again later...",
    package_exists: "Package in already exists...",
    package_no_exists: "Package in does not exist...",
    package_incorrect: "Incorrect Package structure...",
  },
  dialog: {
    install: "Install",
    install_message: "Where do you want the Package installed?",
    unknown_type: "Unrecognized type, unable to install properly",
    download_error: "Download failed",
    zip_error: "Decompression failed",
    install_error: "Installation failed",
    select_files: "Select Files",
  },
  cloudComponent: {
    install: "Install cloud components",
    success: "installation is complete",
    exists: "The cloud component already exists. Do you want to reinstall it?",
    do_not_install:
      "The cloud component folder structure is illegal and cannot be installed correctly",
  },
  package: {
    install: "Install",
    exists: "Package already exists, overwrite or not",
    uninstall_error:
      "Failed to delete Package. Please delete it manually and try again",
    pkg_invalid: "Invalid directory structure of the plugin",
    exists_error: "The plugin's installation package doesn't exist",
    type_error: "The plugin's installation package is not a ZIP file",
    unzip_error: "Fail to decompress the plugin's installation package",
  },
  button: {
    cover: "Cover",
    cancel: "Cancel",
    confirm: "Confirm",
    global: "Global",
    project: "Project",
  },
  silder: { download_manager: "Donwload Manager", clear: "Clear" },
};
