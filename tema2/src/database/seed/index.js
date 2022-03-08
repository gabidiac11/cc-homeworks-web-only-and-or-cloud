module.exports = () => {
  const statements = [];
  const { books, bookCategoryMap, bookCategories } = require("./data");

  bookCategories.forEach((item) =>
    statements.push([
      `INSERT INTO
        bookCategories(categoryId,name)
        VALUES (?, ?)`,
      item.categoryId,
      item.name,
    ])
  );

  books.forEach((item) =>
    statements.push([
      `INSERT INTO
            books(
              bookId,
              author,
              title,
              publishedDate,
              description,
              thumbnail
              ) VALUES (?, ?, ?, ?, ?, ?)`,
      item.bookId,
      item.author,
      item.title,
      item.publishedDate,
      item.description,
      item.thumbnail,
    ])
  );

  bookCategoryMap.forEach((item) =>
    statements.push([
      `INSERT INTO
          bookCategoryMap(
              categoryId,
              bookId
              ) VALUES (?, ?)`,
      item.categoryId,
      item.bookId,
    ])
  );

  return statements;
};
