const constants = require("./../constants");
const db = require("./../database/db");
const contentTypes = constants.contentTypes;

const metrics = async () => {
  try {
    const rows = await db.select(`SELECT * FROM logs ORDER BY log_id DESC LIMIT 100`);
    return {
      headers: { "Content-Type": contentTypes.json },
      code: 200,
      data: {
        rows,
      },
    };
  } catch (err) {
    console.log("error for metrics interogation", err);

    return {
      headers: { "Content-Type": contentTypes.json },
      code: 500,
      data: {
        message: "Something went wrong.",
      },
    };
  }
};

module.exports = [
  {
    path: "/api/metrics",
    method: "GET",
    handler: metrics,
  },
];
