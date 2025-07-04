require("electron").ipcRenderer.on("app:load-audio-duration", (e, r) => {
  let n = new Audio();
  function t(r) {
    n.removeEventListener("error", t);
    console.error(n.src);
    e.reply(r);
  }

  n.addEventListener("loadedmetadata", () => {
    n.removeEventListener("error", t);
    e.reply(null, n.duration);
  });

  n.addEventListener("error", t);
  n.src = r;
});
