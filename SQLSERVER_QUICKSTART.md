# SQL Server Migration - Quick Start

**Tables use the `discussion_forum_` prefix** - e.g., `discussion_forum_Questions`, `discussion_forum_Users`  
See [TABLE_NAMING_REFERENCE.md](TABLE_NAMING_REFERENCE.md) for complete mapping.

## Step 1: Export Your SQLite Data

```bash
node export-to-json.js
```

This creates `forum-export.json` with all your data.

## Step 2: Set Up SQL Server

### Create Database:
```sql
CREATE DATABASE ForumDB;
```

### Run Schema Script:
```bash
# In SQL Server Management Studio (SSMS):
# 1. Open and edit sqlserver-migration.sql
# 2. Replace "YourForumDatabase" with "ForumDB"
# 3. Execute the script
```

Or via PowerShell:
```powershell
sqlcmd -S YOUR_SERVER -U sa -P YOUR_PASSWORD -d ForumDB -i sqlserver-migration.sql
```

## Step 3: Create .env File

**Recommended: Windows Authentication (Local Development)**
```
DB_SERVER=.
DB_NAME=ForumDB
DB_INTEGRATED_SECURITY=true
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true
```

**Alternative: SQL Server Authentication**
```
DB_SERVER=localhost
DB_NAME=ForumDB
DB_INTEGRATED_SECURITY=false
DB_USER=sa
DB_PASSWORD=YourSQLServerPassword
DB_PORT=1433
DB_ENCRYPT=false
```

For detailed guidance: **[WINDOWS_AUTH_SETUP.md](WINDOWS_AUTH_SETUP.md)**

## Step 4: Install SQL Server Client

```bash
npm install mssql
npm remove better-sqlite3
```

## Step 5: Import Data

Use the pre-configured import script:

```bash
npm install mssql dotenv
node import-from-json.js
```

This will automatically:
- Connect using your `.env` configuration
- Import all data into prefixed tables (`discussion_forum_*`)
- Show progress for each table
- Handle all data type conversions

## Step 6: Replace db.js

```bash
mv db.js db-sqlite.backup.js
cp db-sqlserver.js db.js
```

## Step 7: Test the Connection

```bash
npm start
```

The server will now use SQL Server instead of SQLite.

---

**Files Created:**
- `sqlserver-migration.sql` - Database schema for SQL Server
- `db-sqlserver.js` - New database module for SQL Server
- `export-to-json.js` - Tool to export SQLite data
- `MIGRATION_GUIDE.md` - Complete migration documentation
- `SQLSERVER_QUICKSTART.md` - This file

See `MIGRATION_GUIDE.md` for detailed information on updating model files and controllers.
