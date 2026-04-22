# SQLite → SQL Server Migration - Complete Package

**Important:** All tables now use the `discussion_forum_` prefix (e.g., `discussion_forum_Questions`, `discussion_forum_Users`)

See [TABLE_NAMING_REFERENCE.md](TABLE_NAMING_REFERENCE.md) for the complete table mapping.

## 📦 Files Created for Migration

### 1. **Database Schema** 
- **[sqlserver-migration.sql](sqlserver-migration.sql)**
  - SQL Server schema script with all 14 tables
  - Run this in SQL Server Management Studio (SSMS)
  - Creates indexes and constraints matching SQLite schema
  - Change `YourForumDatabase` to your actual database name

### 2. **Data Export/Import Tools**

- **[export-to-json.js](export-to-json.js)**
  - Exports all SQLite data to JSON format
  - Run: `node export-to-json.js`
  - Creates: `forum-export.json`
  - Must run before import

- **[import-from-json.js](import-from-json.js)**
  - Imports JSON data into SQL Server
  - Run: `node import-from-json.js`
  - Respects foreign key dependencies
  - Handles type conversions automatically

### 3. **Database Modules**

- **[db-sqlserver.js](db-sqlserver.js)**
  - New async database module for SQL Server
  - Replaces `db.js` after migration
  - Uses `mssql` package
  - Helper functions:
    - `getDb()` - Get connection pool
    - `executeQuery()` - Raw queries
    - `executeQueryRows()` - Get multiple rows
    - `executeQuerySingle()` - Get single row
    - `executeNonQuery()` - INSERT/UPDATE/DELETE
    - `beginTransaction()` - Transaction support

### 4. **Documentation & Guides**

- **[SQLSERVER_QUICKSTART.md](SQLSERVER_QUICKSTART.md)** ⭐ **Start here!**
  - 6-step quick migration guide
  - Command-by-command instructions
  - ~5 minutes to complete

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)**
  - Comprehensive 7-step guide
  - Detailed explanations
  - SQL vs SQLite comparisons
  - Troubleshooting section

- **[MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md)**
  - Phase-by-phase checklist
  - Test cases for all endpoints
  - Rollback procedures
  - Sign-off checkpoints

- **[EXAMPLE_MODEL_CONVERSION.js](EXAMPLE_MODEL_CONVERSION.js)**
  - Before/after code examples
  - QuestionModel fully converted
  - Comments explaining each change
  - Key differences summary

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Export SQLite Data
```bash
node export-to-json.js
```
This creates `forum-export.json` with all your forum data.

### Step 2: Create SQL Server Database
```sql
-- In SQL Server Management Studio
CREATE DATABASE ForumDB;
```

### Step 3: Create Tables
```bash
# Edit sqlserver-migration.sql first (change database name)
# Then run it in SSMS or PowerShell:
sqlcmd -S localhost -U sa -P YOUR_PASSWORD -d ForumDB -i sqlserver-migration.sql
```

### Step 4: Set Up Environment
Create `.env` file:
```
DB_SERVER=localhost
DB_NAME=ForumDB
DB_USER=sa
DB_PASSWORD=YourPassword
DB_PORT=1433
DB_ENCRYPT=false
```

### Step 5: Import Data
```bash
npm install mssql dotenv
node import-from-json.js
```

### Step 6: Update Node.js Code
```bash
cp db.js db-sqlite.backup.js
cp db-sqlserver.js db.js
npm remove better-sqlite3
npm start
```

---

## 🔄 Migration Path Summary

```
SQLite (db.js)
    ↓
    ├─→ export-to-json.js
    │       ↓
    │   forum-export.json
    │       ↓
    │   import-from-json.js
    │       ↓
SQL Server (sqlserver-migration.sql)
    
Code Migration:
db.js → db-sqlserver.js
+ Convert Models to async
+ Convert Controllers to async
+ Update all database calls
```

---

## 📋 File Mapping

| What | SQLite | SQL Server |
|------|--------|-----------|
| **DB Module** | db.js | db-sqlserver.js |
| **Connection** | File-based | Network-based |
| **Query Style** | Sync `db.prepare()` | Async `executeQuery()` |
| **Parameters** | `?` placeholders | `@paramName` |
| **Dates** | `TEXT` + `datetime('now')` | `DATETIME2` + `GETUTCDATE()` |
| **Boolean** | `INTEGER` (0/1) | `BIT` (1/0) |
| **String Concat** | `GROUP_CONCAT()` | `STRING_AGG()` |
| **Pagination** | `LIMIT x OFFSET y` | `OFFSET y ROWS FETCH NEXT x ROWS ONLY` |

---

## 📝 Model Update Template

**Before (SQLite):**
```javascript
export function getQuestion(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM Questions WHERE Id = ?').get(id);
}
```

**After (SQL Server):**
```javascript
export async function getQuestion(id) {
  return executeQuerySingle(
    'SELECT * FROM Questions WHERE Id = @id',
    { id }
  );
}
```

**Key Changes:**
- ✅ Add `async` keyword
- ✅ Change `db.prepare()` → `executeQuerySingle()`
- ✅ Change `?` → `@paramName`
- ✅ Add `await` when calling the function

---

## 📚 All Models to Convert

In `src/models/`:
1. ✅ QuestionModel.js (see EXAMPLE_MODEL_CONVERSION.js)
2. ✅ AnswerModel.js
3. ✅ CommentModel.js
4. ✅ UserModel.js (if exists)
5. ✅ TagModel.js (if exists)
6. ✅ Any others you have

In `src/controllers/`:
- Make all route handlers `async`
- Update calls to async model methods
- Add `try/catch` for error handling

---

## 🧪 Testing Checklist

After migration, test:

```bash
# All GET endpoints
curl http://localhost:3000/questions
curl http://localhost:3000/questions/1
curl http://localhost:3000/questions/1/answers

# All POST endpoints
curl -X POST http://localhost:3000/questions

# All PUT endpoints
curl -X PUT http://localhost:3000/questions/1

# All DELETE endpoints
curl -X DELETE http://localhost:3000/questions/1

# Check logs for errors
# Monitor SQL Server performance
```

---

## ⚠️ Important Notes

### Data Type Mapping
| SQLite | SQL Server | Notes |
|--------|-----------|-------|
| INTEGER | INT | Use BIGINT if > 2.1B |
| TEXT | NVARCHAR(MAX) | Unicode text |
| REAL | FLOAT | Decimal numbers |
| BLOB | VARBINARY(MAX) | Binary data |
| NULL | NULL | Same behavior |

### Date/Time Handling
```sql
-- SQLite: TEXT with ISO format
datetime('now')  →  '2024-04-22T12:34:56'

-- SQL Server: DATETIME2
GETUTCDATE()  →  2024-04-22 12:34:56.123456
```

### Boolean Handling
```sql
-- SQLite: INTEGER (0 = false, 1 = true)
-- SQL Server: BIT (0 = false, 1 = true)
-- In JavaScript: still use true/false, converted to 0/1
```

---

## 🆘 Troubleshooting

### Connection Issues?
```bash
# 1. Check SQL Server is running
# 2. Verify .env credentials
# 3. Test in SSMS first
# 4. Check firewall rules
# 5. Verify TCP/IP protocol enabled
```

### Data Import Issues?
```bash
# Run with DEBUG=true to see detailed errors
DEBUG=true node import-from-json.js
```

### Query Not Working?
```bash
# 1. Test query in SSMS first
# 2. Check column names (case-sensitive in SQL Server)
# 3. Verify parameters are passed correctly
# 4. Check date/time format
# 5. Check string encoding (NVARCHAR)
```

---

## 📞 Getting Help

If you encounter issues:

1. **Check MIGRATION_GUIDE.md** - Detailed explanations
2. **Review EXAMPLE_MODEL_CONVERSION.js** - See working examples
3. **Consult MIGRATION_CHECKLIST.md** - Verify all steps
4. **Test in SSMS** - Validate queries first
5. **Check SQL Server logs** - Look for error details

---

## ✅ Success Criteria

Your migration is complete when:
- ✅ All 14 tables exist in SQL Server
- ✅ All data imported correctly (verify row counts)
- ✅ All models converted to async
- ✅ All controllers updated
- ✅ All GET/POST/PUT/DELETE endpoints work
- ✅ No SQLite references in code
- ✅ Error handling in place
- ✅ Performance acceptable

---

## 🎯 Next Steps After Migration

1. **Set up monitoring** - Track SQL Server performance
2. **Implement backup strategy** - Regular SQL Server backups
3. **Review indexes** - Add custom indexes for slow queries
4. **Configure security** - User permissions, encryption, etc.
5. **Document** - Update team with new connection strings
6. **Archive** - Keep SQLite files as backup

---

## 📞 Support Files

- `sqlserver-migration.sql` - Copy & run in SSMS
- `db-sqlserver.js` - Copy & replace db.js
- `export-to-json.js` - Run: `node export-to-json.js`
- `import-from-json.js` - Run: `node import-from-json.js`
- `.env` - Create with your SQL Server credentials
- `EXAMPLE_MODEL_CONVERSION.js` - Reference for updates

---

**Version:** 1.0  
**Date:** 2024-04-22  
**Status:** Ready for Migration  

Good luck with your migration! 🚀
