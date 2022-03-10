const db = require("../database/db");
const utils = require("./../utils");

const bookUpdableProperties = [
  "author",
  "title",
  "publishedDate",
  "description",
  "thumbnail",
];

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
    for (let el of rows) {
      el.categories = await this.getCategoriesOfBook(el.bookId);
    }
    const count = (await db.select(countQuery, params))[0].count;
    return {
      rows,
      count,
    };
  };

  getCategoriesOfBook = (bookId) =>
    db.select(
      `SELECT bc.*
        FROM bookCategoryMap MAP
        INNER JOIN bookCategories bc ON bc.categoryId = map.categoryId
        WHERE map.bookId = ${bookId}`
    );

  getById = async (id) => {
    const rows = await db.select(`SELECT * FROM books where bookId = ?`, [id]);
    for (let el of rows) {
      el.categories = await this.getCategoriesOfBook(el.bookId);
    }
    return rows;
  };

  create = async (item, categoryIds) => {
    const bookId = (
      await db.sql(
        `INSERT INTO
          books(
            author,
            title,
            publishedDate,
            description,
            thumbnail
            ) VALUES (?, ?, ?, ?, ?)`,
        [
          item.author,
          item.title,
          item.publishedDate,
          item.description,
          item.thumbnail,
        ]
      )
    ).lastID;

    await this.addCategories(bookId, categoryIds);

    return await this.getById(bookId);
  };

  updateBookEntity = async (item, bookId) => {
    await db.sql(
      `UPDATE 
          books SET
                author =?,
                title =?,
                publishedDate =?,
                description =?,
                thumbnail =?
         WHERE bookId=?`,
      [
        item.author,
        item.title,
        item.publishedDate,
        item.description,
        item.thumbnail,
        bookId,
      ]
    );
  };

  patchBookEntity = async (item, bookId) => {
    const commands = [
      { q: "author =?", value: item.author },
      { q: "title =?", value: item.title },
      { q: "publishedDate =?", value: item.publishedDate },
      { q: "description =?", value: item.description },
      { q: "thumbnail =?", value: item.thumbnail },
      // filter out values that indicate no update
    ].filter((i) => i.value !== null && i.value !== undefined);

    if (commands.length === 0) {
      return Promise.resolve();
    }

    await db.sql(
      `UPDATE 
          books SET
                ${commands.reduce((prev, curr, index) => {
                  const value = !prev ? curr.q : prev + curr.q;
                  if (index < commands.length - 1) {
                    return value + ",";
                  }
                  return value;
                }, "")}
          WHERE bookId=?`,
      [...commands.map((i) => i.value), bookId]
    );
  };

  removeAllBookCategories = (bookId) =>
    db.sql(`DELETE FROM bookCategoryMap WHERE bookId = ?`, [bookId]);

  removeBookCategoriesIfAny = (bookId, categoryIds) => {
    if (!categoryIds.length) {
      return Promise.resolve();
    }
    return db.sql(
      `DELETE FROM bookCategoryMap WHERE bookId = ? AND categoryId IN(${categoryIds.join(
        ","
      )})`,
      [bookId]
    );
  };

  addCategories = async (bookId, categoryIds) => {
    for (let categoryId of categoryIds) {
      await db.sql(
        `INSERT INTO
              bookCategoryMap(
                bookId,
                categoryId
                ) VALUES (?, ?)`,
        [bookId, categoryId]
      );
    }
  };

  extractAndDecorateCatIdsInput = async (categoryIds) => {
    // it's fine for a book not be assign any category
    if (categoryIds === undefined) {
      return [];
    }

    // check for elements that are not an integer-string
    const badElem = categoryIds.findIndex(
      (el) =>
        (typeof el !== "string" && typeof el !== "number") ||
        !Number.isInteger(Number(el))
    );
    if (badElem > -1) {
      throw {
        myHTTPResponse: utils.badRequest(
          `Category id: ${categoryIds[badElem]} is invalid`
        ),
      };
    }

    // check for non-existent elements in the database
    for (let el of categoryIds) {
      const items = await db.select(
        "SELECT * from bookCategories where categoryId=?",
        [el]
      );
      if (!items.length) {
        throw {
          myHTTPResponse: utils.badRequest(
            `Category id ${el} doesn't point to any category.`
          ),
        };
      }
    }

    return categoryIds;
  };

  /**
   *
   * @param {object} item
   * @param {boolean} forPatching - if true -> undefined values are left as they are so to have an indication of which columns to not update
   *                                else -> undefined values will be mean the column is intended to be empty string
   * @returns
   */
  validateAndDecorateBookInput = (item, forPatching) => {
    const output = {};

    for (let name of bookUpdableProperties) {
      if (item[name] === undefined && forPatching) {
        continue;
      }

      if (item[name] === undefined) {
        output[name] = "";
        continue;
      }

      const value = item[name];
      if (typeof value !== "string") {
        throw {
          myHTTPResponse: utils.badRequest(`${name} is not valid`),
        };
      }

      if (name === "publishedDate" && !/\d\d\d\d\-\d\d\-\d\d/.test(value)) {
        throw {
          myHTTPResponse: utils.badRequest(
            `publishedDate: '${value}', is not valid. Please use YYYY-MM-DD format`
          ),
        };
      }

      output[name] = value;
    }

    return output;
  };

  deleteBook = async (bookId) => {
    await db.sql(`DELETE FROM books WHERE bookId = ?`, [bookId]);
    await db.sql(`DELETE FROM bookCategoryMap WHERE bookId = ?`, [bookId]);
  }
    
  deleteAllBooks = async () => {
    await db.sql(`DELETE FROM books WHERE 1`);
    await db.sql(`DELETE FROM bookCategoryMap WHERE 1`);
  }

  deleteAllBooksExeptIds = async (ids) => {
    if(ids.length === 0) {
      return Promise.resolve();
    }
    await db.sql(`DELETE FROM books WHERE bookId NOT IN(${ids.join(",")})`);
  } 
}

module.exports = new BookModel();
