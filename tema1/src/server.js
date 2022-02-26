"use strict";

const http = require("http");
const fs = require("fs");
const router = require("./router");
const port = require("./constants").port;

const server = http.createServer((req, res) => {
  console.log(`\nNew ${req.method} request at '${req.url}'...`);

  if (req.method !== "GET") {
    return router.handleRequest(req, res);
  }

  const fileName = router.getPublicResourceFromUrl(req.url);
  if(!fs.existsSync(fileName)) {
    return router.handleRequest(req, res);
  }

  router.handlePublicResourceReq(req, res, fileName);
});

server.listen(port, () =>
  console.log(
    `\nThe server is running! At port ${port}! And it's also watching for changes!`
  )
);
