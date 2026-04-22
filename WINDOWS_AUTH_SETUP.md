# Windows Authentication Setup Guide

## Your Connection String Configuration

You're using **Windows Authentication (Integrated Security)** with a **local SQL Server instance**.

### Connection String Analysis

```
Data Source=.;
Integrated Security=True;
Persist Security Info=False;
Pooling=False;
MultipleActiveResultSets=False;
Encrypt=False;
TrustServerCertificate=True;
Application Name="SQL Server Management Studio";
Command Timeout=0
```

### Key Settings

| Setting | Value | Meaning |
|---------|-------|---------|
| `Data Source` | `.` | Local SQL Server instance on current machine |
| `Integrated Security` | `True` | Uses Windows authentication (no username/password) |
| `Encrypt` | `False` | No connection encryption |
| `TrustServerCertificate` | `True` | Trust server certificate without validation |
| `Pooling` | `False` | Connection pooling disabled |
| `MultipleActiveResultSets` | `False` | MARS disabled |

---

## Environment Configuration

### `.env` File (Pre-Configured)

```env
# Windows Authentication (already configured in your .env)
DB_SERVER=.
DB_NAME=ForumDB
DB_INTEGRATED_SECURITY=true

DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERTIFICATE=true
DB_POOLING=true
DB_MARS=false
```

### What This Means

- **DB_SERVER=.** → Connects to local SQL Server (same as `Data Source=.`)
- **DB_INTEGRATED_SECURITY=true** → Uses Windows authentication
- **DB_ENCRYPT=false** → No encryption (matches your connection string)
- **DB_TRUST_CERTIFICATE=true** → Trust server certificate

---

## How It Works

### Windows Authentication

With Windows Authentication:
1. Your code runs under your Windows user account
2. SQL Server authenticates using your Windows credentials
3. No username/password needed in code
4. More secure and convenient for development

### Connection Flow

```
Your Node.js Application
         ↓
db-sqlserver.js (Windows Auth enabled)
         ↓
mssql package (uses Windows credentials)
         ↓
SQL Server Instance (.)
         ↓
Authenticates with your Windows user
         ↓
Connected to ForumDB
```

---

## Verifying Connection

### Test Connection in PowerShell

```powershell
# List SQL Server instances
sqlcmd -L

# Connect to your local instance
sqlcmd -S . -d ForumDB
> SELECT @@SERVERNAME
> GO
```

### Test Connection in Node.js

Create a simple test file:

```javascript
import { getDb } from "./db-sqlserver.js";

async function testConnection() {
  try {
    const db = await getDb();
    const result = await db.request().query("SELECT @@SERVERNAME as ServerName");
    console.log("✓ Connected successfully!");
    console.log("Server:", result.recordset[0].ServerName);
    
    await db.close();
  } catch (err) {
    console.error("✗ Connection failed:", err.message);
  }
}

testConnection();
```

Run with:
```bash
node test-connection.js
```

---

## Switching Authentication Methods

### To Use SQL Server Authentication (username/password)

Edit `.env`:
```env
DB_SERVER=localhost
DB_NAME=ForumDB
DB_INTEGRATED_SECURITY=false
DB_USER=sa
DB_PASSWORD=YourPassword
DB_PORT=1433
```

### To Use Windows Auth with Remote Server

Edit `.env`:
```env
DB_SERVER=your-server-name
DB_NAME=ForumDB
DB_INTEGRATED_SECURITY=true
DB_PORT=1433
```

---

## Troubleshooting

### Error: "Login failed for user 'NT AUTHORITY\ANONYMOUS LOGON'"

**Cause:** Windows authentication not enabled on SQL Server  
**Solution:** Check SQL Server authentication modes

### Error: "Connection refused"

**Cause:** SQL Server not running  
**Solution:**
```bash
# Check if SQL Server is running
Get-Service MSSQLSERVER | Format-List
```

### Error: "Cannot open database 'ForumDB'"

**Cause:** Database doesn't exist  
**Solution:** Create the database first:
```bash
node import-from-json.js
```

---

## Performance Settings in Your Connection String

### Pooling = False
Your string has `Pooling=False` - but we enable it by default in Node.js for better performance.

To match your connection string exactly:
```env
DB_POOLING=false
```

### MultipleActiveResultSets = False
Disabled in your string. We have it disabled by default.

To enable (if needed):
```env
DB_MARS=true
```

### Command Timeout = 0
No timeout in your string. In Node.js:
```javascript
// In db-sqlserver.js, adjust if needed:
requestTimeout: 0 // No timeout
```

---

## Next Steps

1. ✅ Your `.env` file is already configured
2. ✅ Your `db-sqlserver.js` supports Windows Authentication
3. Run migration:
   ```bash
   node export-to-json.js
   node import-from-json.js
   ```
4. Test connection:
   ```bash
   npm start
   ```

---

## Key Points

✅ **Windows Authentication** - Uses your Windows login automatically  
✅ **Local Instance (.)** - No network connection needed  
✅ **No Username/Password** - More secure, automatic  
✅ **Development-Friendly** - No credentials in code  

Your setup is perfect for development! 🚀
