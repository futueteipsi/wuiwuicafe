const sqlite3 = require('sqlite3').verbose();

// create db files
const db = new sqlite3.Database('./catcafe.db', (err) => {
    if (err) {
        console.error('ERROR connection to DB', err.message);
    } else {
        console.log('SUCCESS connection to SQLite.');
    }
});

// create tables
db.serialize(() => {
    // user table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // records table (for future upd)
    db.run(`CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        gameName TEXT,
        points INTEGER,
        date TEXT
    )`);
});

module.exports = db;