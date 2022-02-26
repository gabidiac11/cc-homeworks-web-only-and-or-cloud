const contentTypes = require("./constants").contentTypes;

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
];

module.exports.routes = routes;
