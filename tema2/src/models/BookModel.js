const db = require("../database/db");

class BookModel {
  get = async ({ page, length, searchQuery, sortBy, direction }) => {
    const params = [];
    let whereSql = "";
    if (searchQuery) {
      whereSql += ` AND UPPER(title) like ? || '%'`;
      params.push(searchQuery);
    }

    const sql = "SELECT * FROM books where 1";
    const orderBySql = sortBy ? ` ORDER BY ${sortBy} ${direction}` : "";
    const rowsQuery = `${sql} ${whereSql} ${orderBySql} LIMIT ${length} OFFSET ${
      (page - 1) * length
    }`;
    const countQuery = `SELECT COUNT(*) as count FROM books where 1 ${whereSql}`;
    
    const rows = await db.select(rowsQuery, params);
    const count = (await db.select(countQuery, params))[0].count;
    return {
      rows,
      count,
    };
  };

  getById = async (id) =>
    await db.select(`SELECT * FROM books where bookId = ?`, [id]);
}

module.exports = new BookModel();
