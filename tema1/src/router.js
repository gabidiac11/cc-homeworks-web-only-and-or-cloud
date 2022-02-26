"use strict";

const fs = require("fs");
const path = require("path");
const contentTypes = require("./constants").contentTypes;
const pubDirName = path.join(__dirname, "../public");

const routes = require("./routes").routes;

const notFoundHandler = () => ({
  headers: { "Content-Type": contentTypes.json },
  code: 404,
  data: { message: "NOT FOUND (unfortunately)" },
});


function getPath(url) {
  return new URL(`https://orice.com${url}`).pathname;
}

/**
 * mathes a request response handler based on method and url used
 * @param {string|undefined} url - is a pathname that can contained query search
 * @param {string} method
 * @returns function
 */
function getResponseHandler(url, method) {
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
  const response = getResponseHandler(url, method)();

  if (typeof response.data !== "string") {
    response.data = JSON.stringify(response.data);
  }
  return response;
}

function handleRequest(req, res) {
  console.log(`Handle request by router...`);
  const response = getResponse(req.url, req.method);
  console.log(`Response:`);
  console.log(response);

  res.writeHead(response.code, response.headers);
  res.end(response.data);
}

function getPublicResourceFromUrl(url) {
  const reqPathname = getPath(url);
  const fileName = path.join(
    pubDirName,
    reqPathname.replace(/\/$/, "/index.html")
  );
  return fileName;
}

function handlePublicResourceReq(req, res, fileName) {
  const type =
    contentTypes[path.extname(fileName).slice(1)] || contentTypes.txt;

  const stream = fs.createReadStream(fileName);
  stream.on("open", function () {
    res.setHeader("Content-Type", type);
    stream.pipe(res);
  });

  stream.on("error", function () {
    handleRequest(req, res);
  });
}

module.exports.handleRequest = handleRequest;
module.exports.getPath = getPath;
module.exports.getResponse = getResponse;
module.exports.notFoundHandler = notFoundHandler;
module.exports.getPublicResourceFromUrl = getPublicResourceFromUrl;
module.exports.handlePublicResourceReq = handlePublicResourceReq;
