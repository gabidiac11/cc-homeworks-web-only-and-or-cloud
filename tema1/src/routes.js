const indexRoutes = require("./controllers/index");
const metricsRoutes = require("./controllers/metrics");

const routes = [
  ...indexRoutes,
  ...metricsRoutes
];

module.exports.routes = routes;
