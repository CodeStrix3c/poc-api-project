# Connection Verification Checklist

## ✅ Pre-Migration Verification

### Environment Setup
- [ ] `.env` file exists in project root
- [ ] `.env` contains Windows Auth settings:
  ```env
  DB_SERVER=.
  DB_INTEGRATED_SECURITY=true
  ```
- [ ] No username/password in `.env` (Windows Auth doesn't need it)

### SQL Server Verification

**In PowerShell:**
```powershell
# Check SQL Server is running
Get-Service MSSQLSERVER | Format-List Status

# Check local instance
sqlcmd -L | findstr MSSQLSERVER

# Test Windows Auth connection
sqlcmd -S . -d master
> SELECT @@SERVERNAME
> GO
```

Expected output: Your server name

### Database Verification

**In SQL Server Management Studio:**
```sql
-- Check ForumDB exists
SELECT name FROM sys.databases WHERE name = 'ForumDB'

-- Count forum tables (should be 14)
SELECT COUNT(*) as TableCount
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE 'discussion_forum_%'
```

### Node.js Verification

**Run connection test:**
```bash
# Create temp test file
cat > test-conn.js << 'EOF'
import { getDb } from "./db-sqlserver.js";

async function test() {
  try {
    const db = await getDb();
    const result = await db.request().query("SELECT @@SERVERNAME as Server, SUSER_SNAME() as User");
    console.log("✓ Connection successful!");
    console.log("Server:", result.recordset[0].Server);
    console.log("User:", result.recordset[0].User);
    await db.close();
  } catch (err) {
    console.error("✗ Connection failed:", err.message);
  }
}

test();
EOF

# Run test
node test-conn.js

# Clean up
rm test-conn.js
```

Expected output:
```
✓ Connection successful!
Server: [YOUR_SERVER_NAME]
User: [YOUR_DOMAIN\USERNAME]
```

---

## 🔧 Configuration Quick Check

### .env File Contents
```bash
# Display current .env (don't show passwords)
grep -v PASSWORD .env
```

Expected output:
```
DB_SERVER=.
DB_NAME=ForumDB
DB_INTEGRATED_SECURITY=true
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true
DB_POOLING=true
DB_MARS=false
```

### db-sqlserver.js Configuration
```bash
# Check config function exists
grep -A 5 "const buildConfig" db-sqlserver.js
```

Expected: Should show Windows Auth configuration

---

## 📊 Data Migration Verification

### After Running import-from-json.js

**In SQL Server:**
```sql
-- Verify all tables exist
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo'
AND TABLE_NAME LIKE 'discussion_forum_%'
ORDER BY TABLE_NAME;
-- Should return exactly 14 tables

-- Check data counts
SELECT 'discussion_forum_Users' as TableName, COUNT(*) as Count FROM [discussion_forum_Users]
UNION ALL
SELECT 'discussion_forum_Questions', COUNT(*) FROM [discussion_forum_Questions]
UNION ALL
SELECT 'discussion_forum_Answers', COUNT(*) FROM [discussion_forum_Answers]
UNION ALL
SELECT 'discussion_forum_Comments', COUNT(*) FROM [discussion_forum_Comments]
-- ... repeat for other tables
```

---

## 🚀 Pre-Launch Verification

### Code Update Verification

```bash
# Check all db imports use new module
grep -r "from.*db\\.js" src/ --include="*.js"

# Should find no matches (all should use db-sqlserver.js now)

# Check models are async
grep -r "export.*function" src/models/ --include="*.js" | head -5

# Should show 'async function' or 'async' keyword
```

### Dependency Check
```bash
# Should have mssql
npm list mssql

# Should NOT have better-sqlite3
npm list better-sqlite3
# Should show "npm ERR! not ok"
```

### API Endpoint Verification

After starting server:
```bash
# Test GET request
curl http://localhost:3000/questions -s | head -20

# Test POST request (replace with your endpoint)
curl -X POST http://localhost:3000/questions \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Test question"}'

# Check response (should have data, not SQLite error)
```

---

## 🎯 Quick Troubleshooting

### If Connection Test Fails

**Error: "Failed to connect to SQL Server"**
1. Check SQL Server is running: `sqlcmd -L`
2. Check database exists: `CREATE DATABASE ForumDB;`
3. Enable Windows Auth: SQL Server Properties → Security

**Error: "Login failed"**
1. Check Windows authentication is enabled in SQL Server
2. Check your Windows account has permission
3. Try connecting via SSMS first

**Error: "Connection timeout"**
1. Check .env DB_SERVER value is correct (should be ".")
2. Check firewall isn't blocking SQL Server
3. Check SQL Server Named Pipes is enabled

### If Import Fails

**Check forum-export.json exists:**
```bash
ls -l forum-export.json
# Should show file with data
```

**Check data format:**
```bash
# View first few records
head -50 forum-export.json
```

**Check table names:**
```bash
# Verify script uses prefixed names
grep "discussion_forum_Users" import-from-json.js
# Should show lines with prefixed table names
```

---

## ✅ Final Checklist

Before declaring migration complete:

- [ ] SQL Server running
- [ ] ForumDB database created
- [ ] Schema imported (14 tables visible)
- [ ] .env configured for Windows Auth
- [ ] `npm install mssql` done
- [ ] `npm remove better-sqlite3` done
- [ ] `db.js` replaced with `db-sqlserver.js`
- [ ] All models updated to async
- [ ] All controllers updated to async
- [ ] Connection test passes: `node test-conn.js`
- [ ] Data imported: `node import-from-json.js`
- [ ] Server starts: `npm start`
- [ ] API endpoints respond
- [ ] No SQLite errors in logs
- [ ] No connection errors in logs

---

## 📞 Support

- **Connection Issue?** → [WINDOWS_AUTH_SETUP.md](WINDOWS_AUTH_SETUP.md)
- **Setup Question?** → [CONNECTION_CONFIG_SUMMARY.md](CONNECTION_CONFIG_SUMMARY.md)
- **Full Migration?** → [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Quick Start?** → [SQLSERVER_QUICKSTART.md](SQLSERVER_QUICKSTART.md)

You're all set! 🎉
