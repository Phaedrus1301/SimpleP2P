import sqlite3  from "sqlite3"

const db = new sqlite3.Database("simplep2p.db");

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, mobile NUMERIC)');
});

export default db;