const path = require("path");
require("dotenv").config({ path: path.join(__dirname, `.env`) });

const port = process.env.PORT || 5000;
const googleAPIKey = process.env.GOOGLE_API_KEY;
const useMock = process.env.USE_MOCK === "true";
const wikiApiToken = process.env.WIKI_API_TOKEN;
const wikiUserAgent = process.env.WIKI_USER_AGENT;
console.log({ useMock });

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
  googleAPIKey,
  useMock,
  wikiApiToken,
  wikiUserAgent
};
