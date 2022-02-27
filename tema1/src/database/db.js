const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "./database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

const createTableSql = `
    CREATE TABLE IF NOT EXISTS logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        status INTEGER,
        method text,
        url text,
        latency INTEGER DEFAULT -1,
        data text,
        headers text,
        req_params text,
        date DEFAULT CURRENT_TIMESTAMP
    );
`;

db.serialize(() => {
  db.run(createTableSql, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Executed initial db scripts...");
  });
});

const sql = (sql) => {
  console.log(`Executed sql stmt... "${sql}"`);

  return new Promise((resolve) => {
    db.run(sql, (err) => {
      if (err) {
        console.error(err.message);
        throw err;
      }

      resolve(arguments);
    });
  });
};

const select = (sql) => {
  console.log(`Executed sql stmt... "${sql}"`);

  return new Promise((resolve) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      resolve(rows);
    });
  });
};

module.exports = {
  sql,
  select,
};
