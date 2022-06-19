const sqlite3 = require("sqlite3").verbose();

const dbFile = "db.sqlite";

// Se connecter a la base de données
let db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connexion a la base sqlite3...");
    const sql = `CREATE TABLE contact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text,
      phone text,
      email text
    )`;
    db.run(sql, (err) => {
      if (err) {
        console.log("Table deja cree");
      }
    });
  }
});

module.exports = db;
