module.exports = [
  `
   CREATE TABLE IF NOT EXISTS bookCategories (
     categoryId INTEGER PRIMARY KEY AUTOINCREMENT,
     name text,
     dateAdded DEFAULT CURRENT_TIMESTAMP
   )
 `,
  `
   CREATE TABLE IF NOT EXISTS books (
     bookId INTEGER PRIMARY KEY AUTOINCREMENT,
     author text,
     title text,
     publishedDate text,
     description text,
     thumbnail text,
     dateAdded DEFAULT CURRENT_TIMESTAMP
   )
 `,
  `
   CREATE TABLE IF NOT EXISTS bookCategoryMap (
     categoryId INTEGER,
     bookId INTEGER,
   
     CONSTRAINT fk_cat
       FOREIGN KEY (categoryId)
       REFERENCES bookCategories(categoryId)
       ON DELETE CASCADE,
   
     CONSTRAINT fk_book
       FOREIGN KEY (bookId)
       REFERENCES books(bookId)
       ON DELETE CASCADE
   )
 `,
];
