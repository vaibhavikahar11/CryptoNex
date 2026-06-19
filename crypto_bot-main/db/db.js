const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Use DB_PATH env var on Render (persistent disk), fallback to local file in dev
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../database.sqlite");

console.log(`📦 SQLite DB path: ${DB_PATH}`);

// Connect to SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");

        // Migrate: add coin_id column if it doesn't exist yet
        db.run(`ALTER TABLE crypto_prices ADD COLUMN coin_id TEXT`, (alterErr) => {
            if (alterErr && !alterErr.message.includes("duplicate column")) {
                // Column already exists — that's fine, ignore
            } else if (!alterErr) {
                console.log("✅ Migration: coin_id column added to crypto_prices.");
            }
        });
    }
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON;");

module.exports = db;
