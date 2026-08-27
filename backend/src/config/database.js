const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(__dirname, '..', '..', 'data', 'supply_chain.db');

// Ensure the data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
    db = new Database(dbPath);
} catch (err) {
    console.error(`⚠️ Failed to open DB at ${dbPath}, falling back to /tmp/supply_chain.db`, err);
    const fallbackPath = '/tmp/supply_chain.db';
    db = new Database(fallbackPath);
    console.log(`✅ SQLite database opened (fallback) at ${fallbackPath}`);
}

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log(`✅ SQLite database opened at ${dbPath}`);

module.exports = db;
