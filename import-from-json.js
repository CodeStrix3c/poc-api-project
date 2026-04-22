/**
 * Import SQLite data to SQL Server
 *
 * Prerequisites:
 * 1. Export data: node export-to-json.js
 * 2. Create SQL Server database and run: sqlserver-migration.sql
 * 3. Set up .env file with DB credentials
 * 4. Run this script: node import-from-json.js
 */

import fs from "fs";
import {
  buildSqlServerConfig,
  formatSqlServerTarget,
  loadSqlDriver,
} from "./sqlserver-connection.js";

const sql = await loadSqlDriver();
const config = buildSqlServerConfig();

const IMPORT_ORDER = [
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
  "QuestionViews",
];

async function importData() {
  const dataFile = "forum-export.json";

  if (!fs.existsSync(dataFile)) {
    console.error(`Error: ${dataFile} not found. Run "node export-to-json.js" first.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  const pool = new sql.ConnectionPool(config);

  try {
    console.log("Starting SQL Server import...");
    console.log(`Connecting to ${formatSqlServerTarget()}\n`);

    await pool.connect();
    console.log("Connected to SQL Server\n");

    await pool
      .request()
      .query("SET IDENTITY_INSERT [discussion_forum_Users] ON;");

    for (const table of IMPORT_ORDER) {
      const records = data[table];

      if (!records || records.length === 0) {
        console.log(`- ${table.padEnd(20)} no data`);
        continue;
      }

      try {
        const columns = Object.keys(records[0]);
        const prefixedTable = `discussion_forum_${table}`;
        let query = `INSERT INTO [${prefixedTable}] (\n  [${columns.join(
          "], ["
        )}]\n) VALUES\n`;

        const request = pool.request();
        const valueClauses = [];

        for (let index = 0; index < records.length; index += 1) {
          const record = records[index];
          const params = [];

          for (const column of columns) {
            const paramName = `p${index}_${column}`;
            const value = record[column];

            if (value === null || value === undefined) {
              params.push("NULL");
              continue;
            }

            request.input(paramName, value);
            params.push(`@${paramName}`);
          }

          valueClauses.push(`  (${params.join(", ")})`);
        }

        query += `${valueClauses.join(",\n")};`;

        await request.query(query);
        console.log(`+ ${table.padEnd(20)} ${records.length} rows imported`);
      } catch (err) {
        console.error(`x ${table.padEnd(20)} ${err.message}`);
        if (process.env.DEBUG === "true") {
          console.error(err);
        }
      }
    }

    await pool
      .request()
      .query("SET IDENTITY_INSERT [discussion_forum_Users] OFF;");

    await pool.close();
    console.log("\nMigration completed successfully.");
  } catch (err) {
    console.error(`\nImport failed: ${err.message}`);
    if (process.env.DEBUG === "true") {
      console.error(err);
    }
    process.exit(1);
  }
}

importData();
