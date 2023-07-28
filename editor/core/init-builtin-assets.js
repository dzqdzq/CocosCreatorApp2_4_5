(() => {
  "use strict";
  Editor.assetdb.setDefaultMetaType(Editor.metas["native-asset"]);

  [
    [".png", "texture"],
    [".jpg", "texture"],
    [".jpeg", "texture"],
    [".webp", "texture"],
    [".fnt", "bitmap-font"],
    [".ttf", "ttf-font"],
    [".js", "javascript"],
    [".ts", "text"],
    [".ts", "typescript"],
    [".fire", "scene"],
    [".prefab", "prefab"],
    [".mp3", "audio-clip"],
    [".wav", "audio-clip"],
    [".ogg", "audio-clip"],
    [".aac", "audio-clip"],
    [".pcm", "audio-clip"],
    [".m4a", "audio-clip"],
    [".anim", "animation-clip"],
    [".plist", "texture-packer"],
    [".plist", "particle"],
    [".md", "markdown"],
    [".markdown", "markdown"],
    [".pac", "auto-atlas"],
    [".labelatlas", "label-atlas"],
    [".json", "json"],
    [".fbx", "fbx"],
    [".gltf", "gltf"],
    [".bin", "buffer"],
    [".dbbin", "buffer"],
    [".skel", "buffer"],
    [".mtl", "material"],
    [".effect", "effect"],
    [".mesh", "mesh"],
    [".skeleton", "skeleton"],
    [".sac", "skeleton-animation-clip"],
    [".pmtl", "physics-material"],
  ].forEach(([t, e]) => {
    Editor.assetdb.register(t, false, Editor.metas[e]);
  });

  [
    ".txt",
    ".html",
    ".htm",
    ".xml",
    ".css",
    ".less",
    ".scss",
    ".stylus",
    ".yaml",
    ".ini",
    ".csv",
    ".proto",
  ].forEach((t) => {
    Editor.assetdb.register(t, false, Editor.metas.text);
  });

  Editor.assetdb.register(".json", false, Editor.metas.spine);
  Editor.assetdb.register(".skel", false, Editor.metas.spine);
  Editor.assetdb.register(".json", false, Editor.metas.dragonbones);
  Editor.assetdb.register(".dbbin", false, Editor.metas["dragonbones-bin"]);
  Editor.assetdb.register(".json", false, Editor.metas["dragonbones-atlas"]);
  Editor.assetdb.register(".tmx", false, Editor.metas["tiled-map"]);
  Editor.assetdb.register(".tsx", false, Editor.metas.text);
})();
