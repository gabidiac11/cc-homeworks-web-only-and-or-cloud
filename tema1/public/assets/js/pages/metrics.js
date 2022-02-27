import { baseUrl } from "../constants.js";
import { prettyStrigifyNode } from "../utls.js";
import Loader from "../common/loader.js";

const page = () => {
  const mainNode = document.querySelector("main");
  const loader = new Loader();

  const fetchData = async () => {
    const formatRow = (row) => {
      ["data", "headers"].forEach((property) => {
        if (row[property] && typeof row[property] === "string") {
          try {
            row[property] = JSON.parse(row[property]);
          } catch (err) {}
        }
      });
      return row;
    };

    loader.show();
    try {
      const data = await (await fetch(`${baseUrl}/metrics`)).json();
      mainNode.appendChild(prettyStrigifyNode(data.rows.map(formatRow)));
    } catch (err) {
      mainNode.appendChild(prettyStrigifyNode(err));
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
