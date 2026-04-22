# SQLite to SQL Server Migration Guide

## ⚠️ Important: Table Naming Convention

All tables use the `discussion_forum_` prefix to organize forum-related data:
- `discussion_forum_Questions` (not Questions)
- `discussion_forum_Users` (not Users)
- `discussion_forum_Answers` (not Answers)
- etc.

See [TABLE_NAMING_REFERENCE.md](TABLE_NAMING_REFERENCE.md) for the complete table list.

---

## Step 1: Export Data from SQLite

### Option A: Using SQLite Command Line Tool
```bash
# Export each table to CSV
sqlite3 forum.db ".mode csv" ".headers on" ".output users.csv" "SELECT * FROM Users;"
sqlite3 forum.db ".mode csv" ".headers on" ".output tags.csv" "SELECT * FROM Tags;"
sqlite3 forum.db ".mode csv" ".headers on" ".output questions.csv" "SELECT * FROM Questions;"
# ... repeat for all tables
```

### Option B: Using Node.js Script (Recommended)
Create a new file `export-to-json.js` in your project root:

```javascript
import Database from "better-sqlite3";
import fs from "fs";
import { join } from "path";

const db = new Database(join(process.cwd(), "forum.db"));

const tables = [
  "Users", "Tags", "Questions", "QuestionTags", "Answers", "Comments",
  "Votes", "Media", "Bookmarks", "Notifications", "LinkedQuestions",
  "UserTags", "SearchSuggestions", "QuestionViews"
];

const exportData = {};

for (const table of tables) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all();
  exportData[table] = rows;
  console.log(`✓ Exported ${table}: ${rows.length} rows`);
}

fs.writeFileSync("forum-export.json", JSON.stringify(exportData, null, 2));
console.log("\n✓ All data exported to forum-export.json");
db.close();
```

Run it:
```bash
node export-to-json.js
```

## Step 2: Create SQL Server Database

1. **Create the database:**
   ```sql
   CREATE DATABASE ForumDB;
   ```

2. **Run the migration script:**
   - Open SQL Server Management Studio (SSMS)
   - Open `sqlserver-migration.sql`
   - Replace `YourForumDatabase` with your actual database name
   - Execute the script

## Step 3: Import Data into SQL Server

### Using SSMS Import/Export Wizard:

1. In SSMS, right-click your database → Tasks → Import Data
2. Select your CSV files or JSON data
3. Map columns appropriately (watch for data type conversions)

### Using SQL Bulk Insert (if using CSV):

```sql
BULK INSERT Users
FROM 'C:\path\to\users.csv'
WITH (
  FIELDTERMINATOR = ',',
  ROWTERMINATOR = '\n',
  FIRSTROW = 2  -- Skip header row
);
```

### Using Node.js Script (Recommended):

Create `import-from-json.js`:

```javascript
import fs from "fs";
import sql from "mssql";

const config = {
  server: "YOUR_SERVER",
  database: "ForumDB",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "your_password"
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const data = JSON.parse(fs.readFileSync("forum-export.json", "utf-8"));
const pool = new sql.ConnectionPool(config);

async function importData() {
  try {
    await pool.connect();
    console.log("Connected to SQL Server");

    // Import Users first (no dependencies)
    for (const user of data.Users) {
      await pool.request()
        .input("Username", sql.NVarChar, user.Username)
        .input("DisplayName", sql.NVarChar, user.DisplayName)
        .input("Email", sql.NVarChar, user.Email)
        .input("Avatar", sql.NVarChar(sql.MAX), user.Avatar)
        .input("Bio", sql.NVarChar(sql.MAX), user.Bio)
        .input("Reputation", sql.Int, user.Reputation)
        .input("GoldBadges", sql.Int, user.GoldBadges)
        .input("SilverBadges", sql.Int, user.SilverBadges)
        .input("BronzeBadges", sql.Int, user.BronzeBadges)
        .input("Location", sql.NVarChar, user.Location)
        .input("Website", sql.NVarChar(sql.MAX), user.Website)
        .input("IsOnline", sql.Bit, user.IsOnline)
        .input("JoinedAt", sql.DateTime2, user.JoinedAt)
        .input("LastSeen", sql.DateTime2, user.LastSeen)
        .query(`
          INSERT INTO Users (Username, DisplayName, Email, Avatar, Bio, Reputation,
                            GoldBadges, SilverBadges, BronzeBadges, Location, Website,
                            IsOnline, JoinedAt, LastSeen)
          VALUES (@Username, @DisplayName, @Email, @Avatar, @Bio, @Reputation,
                  @GoldBadges, @SilverBadges, @BronzeBadges, @Location, @Website,
                  @IsOnline, @JoinedAt, @LastSeen)
        `);
    }
    console.log(`✓ Imported ${data.Users.length} users`);

    // Import Tags
    for (const tag of data.Tags) {
      await pool.request()
        .input("Name", sql.NVarChar, tag.Name)
        .input("Description", sql.NVarChar(sql.MAX), tag.Description)
        .input("Color", sql.NVarChar, tag.Color)
        .input("QuestionsCount", sql.Int, tag.QuestionsCount)
        .query(`
          INSERT INTO Tags (Name, Description, Color, QuestionsCount)
          VALUES (@Name, @Description, @Color, @QuestionsCount)
        `);
    }
    console.log(`✓ Imported ${data.Tags.length} tags`);

    // Import Questions (depends on Users)
    for (const q of data.Questions) {
      await pool.request()
        .input("Title", sql.NVarChar(sql.MAX), q.Title)
        .input("Body", sql.NVarChar(sql.MAX), q.Body)
        .input("UserId", sql.Int, q.UserId)
        .input("Votes", sql.Int, q.Votes)
        .input("Views", sql.Int, q.Views)
        .input("AnswersCount", sql.Int, q.AnswersCount)
        .input("AcceptedAnswerId", sql.Int, q.AcceptedAnswerId)
        .input("Status", sql.NVarChar, q.Status)
        .input("IsBounty", sql.Bit, q.IsBounty)
        .input("BountyAmount", sql.Int, q.BountyAmount)
        .input("IsClosed", sql.Bit, q.IsClosed)
        .input("IsProtected", sql.Bit, q.IsProtected)
        .input("Favorites", sql.Int, q.Favorites)
        .input("CreatedAt", sql.DateTime2, q.CreatedAt)
        .input("UpdatedAt", sql.DateTime2, q.UpdatedAt)
        .input("LastActivityAt", sql.DateTime2, q.LastActivityAt)
        .query(`
          INSERT INTO Questions (Title, Body, UserId, Votes, Views, AnswersCount,
                                AcceptedAnswerId, Status, IsBounty, BountyAmount,
                                IsClosed, IsProtected, Favorites, CreatedAt, UpdatedAt,
                                LastActivityAt)
          VALUES (@Title, @Body, @UserId, @Votes, @Views, @AnswersCount,
                  @AcceptedAnswerId, @Status, @IsBounty, @BountyAmount,
                  @IsClosed, @IsProtected, @Favorites, @CreatedAt, @UpdatedAt,
                  @LastActivityAt)
        `);
    }
    console.log(`✓ Imported ${data.Questions.length} questions`);

    // Continue for other tables...
    // (Following the same pattern for remaining tables)

    await pool.close();
    console.log("\n✓ All data imported successfully!");

  } catch (err) {
    console.error("Import error:", err);
  }
}

importData();
```

## Step 4: Update Node.js Code for SQL Server

### Option A: Using `mssql` package (Recommended)

1. **Install mssql:**
   ```bash
   npm install mssql
   npm remove better-sqlite3
   ```

2. **Create new `db.js` for SQL Server:**

```javascript
import sql from "mssql";

let pool = null;

const config = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "ForumDB",
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USER || "sa",
      password: process.env.DB_PASSWORD || ""
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 15000,
    requestTimeout: 15000
  }
};

export async function getDb() {
  if (pool && pool.connected) {
    return pool;
  }

  pool = new sql.ConnectionPool(config);
  await pool.connect();
  console.log("✓ Connected to SQL Server");

  // Handle connection errors
  pool.on("error", (err) => {
    console.error("Connection pool error:", err);
  });

  return pool;
}

export async function closeDb() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

// Helper function to execute queries
export async function executeQuery(query, params = {}) {
  const db = await getDb();
  const request = db.request();

  // Add parameters
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }

  return request.query(query);
}
```

### Option B: Using Sequelize ORM (for easier code migration)

```bash
npm install sequelize mssql sequelize-cli
```

Create models and use ORM instead of raw queries (cleaner approach).

## Step 5: Update All Model Files

### Example: QuestionModel.js conversion

**Before (SQLite):**
```javascript
import { getDb } from "../db.js";

export function getAllQuestions(limit = 20, offset = 0) {
  const db = getDb();
  return db.prepare(`
    SELECT q.*, u.Username, u.Avatar, COUNT(DISTINCT qt.TagId) as TagCount
    FROM Questions q
    JOIN Users u ON q.UserId = u.Id
    LEFT JOIN QuestionTags qt ON q.Id = qt.QuestionId
    GROUP BY q.Id
    LIMIT ? OFFSET ?
  `).all(limit, offset);
}
```

**After (SQL Server):**
```javascript
import { executeQuery } from "../db.js";

export async function getAllQuestions(limit = 20, offset = 0) {
  const result = await executeQuery(`
    SELECT TOP (@limit) q.*, u.Username, u.Avatar, COUNT(DISTINCT qt.TagId) as TagCount
    FROM Questions q
    JOIN Users u ON q.UserId = u.Id
    LEFT JOIN QuestionTags qt ON q.Id = qt.QuestionId
    GROUP BY q.Id, q.Title, q.Body, q.UserId, q.Votes, q.Views, q.AnswersCount,
             q.AcceptedAnswerId, q.Status, q.IsBounty, q.BountyAmount, q.IsClosed,
             q.IsProtected, q.Favorites, q.CreatedAt, q.UpdatedAt, q.LastActivityAt,
             u.Username, u.Avatar
    ORDER BY q.CreatedAt DESC
    OFFSET @offset ROWS
  `, { limit, offset });
  return result.recordset;
}
```

## Step 6: Update Controllers

Controllers using models need minor updates to handle async/await:

**Before:**
```javascript
export function getQuestions(req, res) {
  const questions = QuestionModel.getAllQuestions();
  res.json(questions);
}
```

**After:**
```javascript
export async function getQuestions(req, res) {
  try {
    const questions = await QuestionModel.getAllQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Step 7: Update Routes & Server

Make sure all route handlers are async:

```javascript
// routes/questions.js
import express from "express";
import * as QuestionController from "../controllers/QuestionController.js";

const router = express.Router();

router.get("/", QuestionController.getQuestions);  // Now async
router.post("/", QuestionController.createQuestion);  // Now async
// ... etc

export default router;
```

## Key Differences: SQLite → SQL Server

| Feature | SQLite | SQL Server |
|---------|--------|-----------|
| **Connection** | Synchronous file-based | Async network-based |
| **Transactions** | db.transaction() | TRANSACTION / BEGIN |
| **AUTOINCREMENT** | INTEGER PRIMARY KEY AUTOINCREMENT | INT PRIMARY KEY IDENTITY(1,1) |
| **DateTime** | TEXT (ISO format) | DATETIME2 |
| **Boolean** | INTEGER (0/1) | BIT |
| **Strings** | TEXT | NVARCHAR(MAX) or NVARCHAR(size) |
| **LIMIT/OFFSET** | LIMIT ? OFFSET ? | TOP (@n) ... OFFSET @offset ROWS |
| **Null Defaults** | CAST as type | Use exact type |
| **PRAGMA** | db.pragma() | N/A (database settings) |

## Environment Variables

Create `.env` file:
```
DB_SERVER=localhost
DB_NAME=ForumDB
DB_USER=sa
DB_PASSWORD=your_password
```

## Testing the Migration

```bash
npm install # Update dependencies
npm start   # Start server with new SQL Server connection
```

## Troubleshooting

### Connection Issues:
- Ensure SQL Server is running
- Check firewall settings
- Verify credentials in `.env`

### Data Type Mismatches:
- SQLite stores dates as TEXT, SQL Server as DATETIME2
- Use SQL Server conversion functions: `CONVERT(DATETIME2, [column])`

### Identity Issues:
- If you have identity values > 2,147,483,647, use `BIGINT` instead of `INT`

---

**Next Steps After Migration:**
1. Run full test suite
2. Monitor performance (add indexes if needed)
3. Set up automated backups for SQL Server
4. Consider implementing connection pooling strategies
