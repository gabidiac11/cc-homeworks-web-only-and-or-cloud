import { baseUrl } from "../constants.js";
import { prettyStrigifyNode } from "../utls.js";
import Loader from "../common/loader.js";

const page = () => {
  const mainNode = document.querySelector("main");
  const laoder = new Loader();
  
  const fetchData = async () => {
    laoder.show();
    try {
      const data = await (await fetch(`${baseUrl}/data`)).json();
      mainNode.appendChild(prettyStrigifyNode(data));
    } catch (err) {
      mainNode.appendChild(prettyStrigifyNode(err));
    } finally {
      laoder.hide();
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
