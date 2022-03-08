const constants = require("./../constants");
const db = require("./../database/db");

const contentTypes = constants.contentTypes;

const index = async () => {
  const rows = await db.select("SELECT * FROM books");
  return {
    headers: { "Content-Type": contentTypes.json },
    code: 200,
    data: {
      rows
    },
  };
};

module.exports = [
  {
    path: "/api",
    method: "GET",
    handler: index,
  },
];
