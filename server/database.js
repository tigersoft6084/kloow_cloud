const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/db/data.db', (err) => {
  if (err) console.error('DB open error:', err.message);
  else console.log('Connected to SQLite');
});

db.serialize(() => {
  db.run(
    `
      CREATE TABLE IF NOT EXISTS containers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          auth_server TEXT NOT NULL,
          project_id TEXT NOT NULL,
          container_id TEXT NOT NULL,
          port INTEGER NOT NULL DEFAULT 0
      )
    `,
    (err) => {
      if (err) {
        console.error('Error creating containers table:', err.message);
      } else {
        console.log('Containers table initialized');
      }
    }
  );
});

module.exports = db;
