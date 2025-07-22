const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db', (err) => {
    if (err) console.error('DB open error:', err.message);
    else console.log('Connected to SQLite');
});

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS containers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      container_id TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);
});

module.exports = db;