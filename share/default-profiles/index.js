"use strict";
Editor.Profile.load("default://settings.json",require("./default-settings"));
Editor.Profile.load("default://updates.json",require("./default-updates"));
Editor.Profile.load("default://features.json",require("./default-features"));
Editor.log("Load ~/.CocosCreator/settings.json");
Editor.App._profile = Editor.Profile.load("global://settings.json");