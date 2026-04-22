import Database from "better-sqlite3";
import fs from "fs";
import { join } from "path";

/**
 * Exports all SQLite data to JSON format
 * Run with: node export-to-json.js
 */

const db = new Database(join(process.cwd(), "forum.db"));

const tables = [
  "Users",
  "Tags",
  "Questions",
  "QuestionTags",
  "Answers",
  "Comments",
  "Votes",
  "Media",
  "Bookmarks",
  "Notifications",
  "LinkedQuestions",
  "UserTags",
  "SearchSuggestions",
  "QuestionViews"
];

const exportData = {};

console.log("📊 Exporting SQLite data to JSON...\n");

for (const table of tables) {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    exportData[table] = rows;
    console.log(`✓ ${table.padEnd(20)} : ${rows.length} rows exported`);
  } catch (err) {
    console.error(`✗ ${table}: ${err.message}`);
  }
}

fs.writeFileSync("forum-export.json", JSON.stringify(exportData, null, 2));
console.log("\n✓ All data exported to forum-export.json");
console.log(`  File size: ${(fs.statSync("forum-export.json").size / 1024).toFixed(2)} KB`);

db.close();
console.log("\n✓ SQLite connection closed");
