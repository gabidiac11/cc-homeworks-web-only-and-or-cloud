const path = require("path");
require("dotenv").config({ path: path.join(__dirname, `.env`) });

const port = process.env.PORT || 5000;

const contentTypes = {
  json: "application/json",
  html: "text/html",
  plain: "text/plain",
};

module.exports.port = port;
module.exports.contentTypes = contentTypes;
