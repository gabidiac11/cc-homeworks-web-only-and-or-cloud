const db = require("../database/db");

class BookModel {
  get = async ({ page, length, searchQuery, sortBy, direction }) => {
    const sql = "SELECT * FROM books where 1";
    const whereSql = searchQuery
      ? ` AND UPPER(title) like '${searchQuery.toUpperCase()}%'`
      : "";
    const orderBySql = sortBy ? ` ORDER BY ${sortBy} ${direction}` : "";

    const rows = await db.select(
      `${sql} ${whereSql} ${orderBySql} LIMIT ${length} OFFSET ${
        (page - 1) * length
      }`
    );
    const count = (
      await db.select(`SELECT COUNT(*) as count FROM books where 1 ${whereSql}`)
    )[0].count;

    return {
      rows,
      count,
    };
  };
}

module.exports = new BookModel();
