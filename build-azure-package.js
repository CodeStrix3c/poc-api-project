import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, ".output", "azure");

const filesToCopy = [
  "package.json",
  "package-lock.json",
  "server-refactored.js",
  "db.js",
  "db-sqlserver.js",
  "sqlserver-connection.js",
  "swagger.js",
  "swagger.json",
  "swagger-ui-index.html",
  "ecosystem.config.js",
];

const directoriesToCopy = ["src"];

function ensureCleanDir(targetDir) {
  fs.rmSync(targetDir, { force: true, recursive: true });
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyFile(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const destinationPath = path.join(outputDir, relativePath);

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

function copyDirectory(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const destinationPath = path.join(outputDir, relativePath);

  fs.cpSync(sourcePath, destinationPath, { recursive: true });
}

function main() {
  ensureCleanDir(outputDir);

  for (const file of filesToCopy) {
    copyFile(file);
  }

  for (const directory of directoriesToCopy) {
    copyDirectory(directory);
  }

  console.log(`Azure production package created at: ${outputDir}`);
  console.log("This output excludes local-only files like .env, forum.db, and migration artifacts.");
}

main();
