"use strict";

const fs = require("fs");
const path = require("path");
const contentTypes = require("./constants").contentTypes;

function getView(name) {
  const data = fs
    .readFileSync(path.join(__dirname, `views/${name}.html`))
    .toString();
    
  return {
    headers: { "Content-Type": contentTypes.html },
    code: 200,
    data,
  };
}

const notFoundHandler = () => ({
  headers: { "Content-Type": contentTypes.json },
  code: 404,
  data: { message: "NOT FOUND (unfortunately)" },
});

const routes = [
  {
    path: "/api",
    method: "GET",
    handler: () => ({
      headers: { "Content-Type": contentTypes.json },
      code: 200,
      data: {
        message:
          "You reach our api endpoint that is totaly working but not implemented yet",
      },
    }),
  },
  {
    regex: /(^\/$)|(^$)/,
    method: "GET",
    handler: () => getView("index"),
  },
];

function getPath(url) {
  return new URL(`https://orice.com${url}`).pathname;
}

/**
 * mathes a request response handler based on method and url used
 * @param {string|undefined} url - is a pathname that can contained query search
 * @param {string} method
 * @returns function
 */
function getHandler(url, method) {
  const pathname = getPath(url);
  return (
    routes.find(
      (item) =>
        item.method === method &&
        (item.path === pathname || (item.regex && item.regex.test(pathname)))
    )?.handler || notFoundHandler
  );
}

function getResponse(url, method) {
  console.log("m");
  const response = getHandler(url, method)();

  if (typeof response.data !== "string") {
    response.data = JSON.stringify(response.data);
  }
  return response;
}

module.exports.getResponse = getResponse;
