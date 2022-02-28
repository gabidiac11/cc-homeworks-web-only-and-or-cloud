import { baseUrl } from "../constants.js";
import { prettyStrigifyNode } from "../utls.js";
import Loader from "../common/loader.js";
import Button from "../common/button.js";
import Book from "../common/book.js";
import Wiki from "../common/wiki.js";

const page = () => {
  const parentNode = document.querySelector("main");
  const loader = new Loader();
  const buttonTest = new Button(document.getElementById("createExecution"));

  const fetchData = async () => {
    loader.show();
    try {
      const data = await (await fetch(`${baseUrl}/data`)).json();
      
      new Book({
        ...data.book.volumeInfo,
        flag: data.flag,
        countryName: data.countryName,
        parentNode,
      });
      data.wikiData.pages.forEach((item) => {
        new Wiki({ ...item, parentNode });
      });
    } catch (err) {
      console.log(err);
      parentNode.appendChild(prettyStrigifyNode(err));
    } finally {
      loader.hide();
    }
  };

  const testExecutions = async () => {
    const total = 500;
    const batch = 50;

    buttonTest.setIsLoading(true);
    for (let i = 0; i < total / batch; i++) {
      buttonTest.node.innerHTML = `Loading... (${i + 1})`;

      const promises = Array.from(Array(batch).keys()).map(() =>
        fetch(`${baseUrl}/data`).then((r) => r.json())
      );

      await Promise.allSettled(promises).catch(() => {});
    }
    buttonTest.setIsLoading(false);
  };
  buttonTest.onClick = () => testExecutions();

  fetchData();
};

(() => {
  if (document.readyState !== "loading") {
    page();
  } else {
    document.addEventListener("DOMContentLoaded", page);
  }
})();
