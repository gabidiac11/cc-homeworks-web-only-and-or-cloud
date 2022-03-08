import { baseUrl } from "../constants.js";
import { prettyStrigifyNode } from "../utls.js";
import Loader from "../common/loader.js";

const page = () => {
  const parentNode = document.querySelector("main");
  const loader = new Loader();

  const fetchData = async () => {
    loader.show();
    try {
      const data = await (await fetch(`${baseUrl}`)).json();
      parentNode.appendChild(prettyStrigifyNode(data));
    } catch (err) {
      console.log(err);
      parentNode.appendChild(prettyStrigifyNode(err));
    } finally {
      loader.hide();
    }
  };

  fetchData();
};

(() => {
  if (document.readyState !== "loading") {
    page();
  } else {
    document.addEventListener("DOMContentLoaded", page);
  }
})();
