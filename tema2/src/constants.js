const path = require("path");
require("dotenv").config({ path: path.join(__dirname, `.env`) });

const port = process.env.PORT || 5000;

const contentTypes = {
  json: "application/json",
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
};

module.exports = {
  port,
  contentTypes,
};
