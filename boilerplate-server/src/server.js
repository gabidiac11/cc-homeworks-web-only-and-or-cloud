"use strict";

const http = require("http");
const fs = require("fs");
const router = require("./router");
const port = require("./constants").port;
const db = require("./database/db");

const server = http.createServer((req, res) => {
  console.log(`\nNew ${req.method} request at '${req.url}'...`);

  if (req.method !== "GET") {
    return router.handleRequest(req, res);
  }

  let fileName = router.getPublicResourceFromUrl(req.url);
  if (!fs.existsSync(fileName)) {
    // handle case where url is referencing a html page without specifying extension
    fileName = router.getHtmlFileNameIfExists(fileName);
    if (!fileName) {
      // handle as api request if no public resource is requested
      return router.handleRequest(req, res);
    }
  }

  router.handlePublicResourceReq(req, res, fileName);
});

server.listen(port, () =>
  console.log(
    `\nThe server is running! At port ${port}! And it's also watching for changes!`
  )
);
