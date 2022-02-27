"use strict";

const fs = require("fs");
const path = require("path");
const contentTypes = require("./constants").contentTypes;
const pubDirName = path.join(__dirname, "../public");

const routes = require("./routes").routes;

const notFoundHandler = () =>
  new Promise((resolve) =>
    resolve({
      headers: { "Content-Type": contentTypes.json },
      code: 404,
      data: { message: "NOT FOUND (unfortunately)" },
    })
  );

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

async function getResponse(url, method) {
  const response = await getResponseHandler(url, method)();

  if (typeof response.data !== "string") {
    // handle circular stuff
    try {
      response.data = JSON.stringify(response.data);
    } catch (err) {
      response.data = "";
      console.log("could not stringify", err);
    }
  }
  return response;
}

async function handleRequest(req, res) {
  console.log(`Handle request by router...`);
  const response = await getResponse(req.url, req.method);
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

function getHtmlFileNameIfExists(fileName) {
  if (fileName.indexOf(".") > -1) return null;

  const fileNameHtml = `${fileName}.html`;
  if (fs.existsSync(fileNameHtml)) return fileNameHtml;

  return null;
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

module.exports = {
  handleRequest,
  getPath,
  getResponse,
  notFoundHandler,
  getPublicResourceFromUrl,
  handlePublicResourceReq,
  getHtmlFileNameIfExists,
};
