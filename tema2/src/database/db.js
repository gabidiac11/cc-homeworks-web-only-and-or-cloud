const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.join(__dirname, "./database.db");
const tableQueries = require("./tableQueries");

class ChacheBasedSingleton {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the database.");

      this.init();
    });
  }

  sql = (query, params = []) => {
    console.log(`Executed query stmt... "${query}"`);

    return new Promise((resolve) => {
      this.db.run(query, params, function (err) {
        if (err) {
          console.error(err);
          throw err;
        }

        resolve(this);
      });
    });
  };

  select = (query, params = []) => {
    console.log(`Executed query stmt... "${query}"`);

    return new Promise((resolve) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          throw err;
        }
        resolve(rows);
      });
    });
  };

  /**
   * runs a group of sqlite commands within BEGIN, COMMIT
   * rolls back in case things fail
   * should be aware of this: https://github.com/mapbox/node-sqlite3/issues/304
   * @param {(any[])[]} statements
   * @returns
   */
  runBatchTransaction = async (statements) => {
    const results = [];
    const batch = [["BEGIN"], ...statements, ["COMMIT"]];

    try {
      for (let i = 0; i < batch.length; i++) {
        const command = batch[i];
        results.push(
          await this.sql(command[0], command.slice(1, command.length))
        );
      }
    } catch (err) {
      // NOTE: this stuff rolls back things run from outside concurently, that may not be intended to be rolled back!
      await this.sql("ROLLBACK");
      throw err + " in statement #" + results.length;
    }

    return results;
  };

  init = async () => {
    for (const query of tableQueries) {
      await this.sql(query);
    }

    if ((await this.select("SELECT COUNT(*) FROM books"))[0]["COUNT(*)"] > 0) {
      console.log("\nSEED not required.\n");
      return;
    }

    const seedStmts = require("./seed/index")();
    console.log({ seedStmts });
    await this.runBatchTransaction(seedStmts);
  };
}

module.exports = new ChacheBasedSingleton();
