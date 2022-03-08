export default class Loader {
  constructor() {
    const node = document.getElementById("loader");
    this.show = () => {
      node.style.display = "flex";
    };

    this.hide = () => {
      node.style.display = "none";
    };
  }
}
