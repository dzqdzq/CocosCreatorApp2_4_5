// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>Package-Template</h2>
    <hr />
    <div>State: <span id="label">--</span></div>
    <hr />
    <ui-button id="btn">Send To Main</ui-button>
  `,

  // element and variable binding
  $: {
    btn: "#btn",
    label: "#label",
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {
    this.$btn.addEventListener("confirm", () => {
      Editor.Ipc.sendToMain("package-template:clicked");
    });
  },

  // register your ipc messages here
  messages: {
    "package-template:hello"(event) {
      this.$label.innerText = "Hello!";
    },
  },
});
