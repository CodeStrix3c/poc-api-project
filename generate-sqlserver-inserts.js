import fs from "fs";
import path from "path";

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

const IDENTITY_TABLES = new Set([
  "Users",
  "Tags",
  "Questions",
  "Answers",
  "Comments",
  "Votes",
  "Media",
  "Bookmarks",
  "Notifications",
  "SearchSuggestions",
  "QuestionViews",
]);

function parseArgs(argv) {
  const options = {
    input: "forum-export.json",
    output: "sqlserver-data-insert.sql",
    database: process.env.DB_NAME || "discussion_forum",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--input" && argv[index + 1]) {
      options.input = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--output" && argv[index + 1]) {
      options.output = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--database" && argv[index + 1]) {
      options.database = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

function quoteIdentifier(name) {
  return `[${String(name).replace(/]/g, "]]")}]`;
}

function escapeSqlString(value) {
  return String(value).replace(/'/g, "''");
}

function toSqlLiteral(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  if (typeof value === "string") {
    return `N'${escapeSqlString(value)}'`;
  }

  return `N'${escapeSqlString(JSON.stringify(value))}'`;
}

function buildTableInsert(tableName, records) {
  const prefixedTable = `discussion_forum_${tableName}`;
  const lines = [];

  lines.push(`PRINT 'Loading ${prefixedTable}';`);
  lines.push("GO");

  if (!records || records.length === 0) {
    lines.push(`-- No rows for ${prefixedTable}`);
    lines.push("GO");
    lines.push("");
    return lines.join("\n");
  }

  const columns = Object.keys(records[0]);
  const columnList = columns.map(quoteIdentifier).join(", ");

  if (IDENTITY_TABLES.has(tableName)) {
    lines.push(`SET IDENTITY_INSERT ${quoteIdentifier(prefixedTable)} ON;`);
    lines.push("GO");
  }

  for (const record of records) {
    const values = columns.map((column) => toSqlLiteral(record[column])).join(", ");
    lines.push(
      `INSERT INTO ${quoteIdentifier(prefixedTable)} (${columnList}) VALUES (${values});`
    );
  }

  if (IDENTITY_TABLES.has(tableName)) {
    lines.push("GO");
    lines.push(`SET IDENTITY_INSERT ${quoteIdentifier(prefixedTable)} OFF;`);
  }

  lines.push("GO");
  lines.push("");

  return lines.join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), options.input);
  const outputPath = path.resolve(process.cwd(), options.output);

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const scriptParts = [];

  scriptParts.push("-- ================================================================");
  scriptParts.push("-- SQL Server Data Insert Script");
  scriptParts.push("-- Generated from forum-export.json");
  scriptParts.push("-- ================================================================");
  scriptParts.push("");
  scriptParts.push(`USE ${quoteIdentifier(options.database)};`);
  scriptParts.push("GO");
  scriptParts.push("SET NOCOUNT ON;");
  scriptParts.push("SET XACT_ABORT ON;");
  scriptParts.push("GO");
  scriptParts.push("BEGIN TRANSACTION;");
  scriptParts.push("GO");
  scriptParts.push("");

  for (const tableName of IMPORT_ORDER) {
    scriptParts.push(buildTableInsert(tableName, data[tableName] || []));
  }

  scriptParts.push("COMMIT TRANSACTION;");
  scriptParts.push("GO");
  scriptParts.push("PRINT 'Data load completed successfully.';");
  scriptParts.push("GO");
  scriptParts.push("");

  fs.writeFileSync(outputPath, scriptParts.join("\n"), "utf-8");

  console.log(`Generated SQL Server insert script: ${outputPath}`);
  console.log(`Database target: ${options.database}`);
  console.log(`Tables processed: ${IMPORT_ORDER.length}`);
}

main();
