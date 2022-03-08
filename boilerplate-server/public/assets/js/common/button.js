export default class Button {
  constructor(node) {
    this.node = node;
    this.text = node.innerText;

    this.setIsLoading = (value) => {
      this.isLoading = value;
      node.innerText = this.isLoading ? "Loading..." : this.text;
      node.disabled = !!this.isLoading;

      if (!this.isLoading) {
        return node.removeAttribute("loading");
      }
      node.setAttribute("loading", "");
    };
    this.setIsLoading();

    this.onClick = () => {};

    node.addEventListener("click", () => {
      this.onClick();
    });
  }
}
