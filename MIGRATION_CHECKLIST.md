# SQLite → SQL Server Migration Checklist

**Tables now use `discussion_forum_` prefix** - All table names start with this prefix  
Example: `discussion_forum_Questions`, `discussion_forum_Users`, `discussion_forum_Comments`

See [TABLE_NAMING_REFERENCE.md](TABLE_NAMING_REFERENCE.md) for the complete mapping.

---

## Pre-Migration (Preparation)

- [ ] **Backup SQLite database**
  ```bash
  cp forum.db forum.db.backup
  cp forum.db-shm forum.db-shm.backup
  cp forum.db-wal forum.db-wal.backup
  ```

- [ ] **Document current setup**
  - [ ] List all API endpoints
  - [ ] Document any custom database queries
  - [ ] Note any performance-critical queries

- [ ] **Ensure SQL Server is available**
  - [ ] SQL Server 2019+ installed
  - [ ] SQL Server Management Studio (SSMS) available
  - [ ] Network access configured

## Phase 1: Database Export & Schema Creation

- [ ] **Export SQLite data to JSON**
  ```bash
  npm install better-sqlite3  # if not already installed
  node export-to-json.js
  ```
  - [ ] Verify `forum-export.json` is created
  - [ ] Check file size and record counts

- [ ] **Create SQL Server database**
  ```sql
  CREATE DATABASE ForumDB;
  ```

- [ ] **Run schema migration script**
  - [ ] Open `sqlserver-migration.sql`
  - [ ] Edit: Replace `YourForumDatabase` with `ForumDB`
  - [ ] Execute in SSMS or via PowerShell:
    ```powershell
    sqlcmd -S YOUR_SERVER -U sa -P PASSWORD -d ForumDB -i sqlserver-migration.sql
    ```

- [ ] **Verify schema was created**
  - [ ] Check all 14 tables exist
  - [ ] Verify indexes are created
  - [ ] Check constraints are in place

## Phase 2: Data Migration

- [ ] **Set up environment file (.env)**
  ```
  DB_SERVER=localhost
  DB_NAME=ForumDB
  DB_USER=sa
  DB_PASSWORD=YourPassword
  DB_PORT=1433
  DB_ENCRYPT=false
  ```

- [ ] **Install mssql package**
  ```bash
  npm install mssql dotenv
  ```

- [ ] **Import data to SQL Server**
  ```bash
  node import-from-json.js
  ```
  - [ ] Verify all tables have correct row counts
  - [ ] Check for any import errors
  - [ ] Verify data integrity (spot check some records)

- [ ] **Validate data migration**
  ```sql
  -- Sample validation queries
  SELECT COUNT(*) as UserCount FROM Users;
  SELECT COUNT(*) as QuestionCount FROM Questions;
  SELECT COUNT(*) as AnswerCount FROM Answers;
  -- Run in SSMS to verify counts match
  ```

## Phase 3: Code Migration

- [ ] **Replace database module**
  ```bash
  cp db.js db-sqlite.backup.js
  cp db-sqlserver.js db.js
  ```

- [ ] **Remove SQLite dependency**
  ```bash
  npm remove better-sqlite3
  ```

- [ ] **Convert Models** (one at a time)
  
  For each model file in `src/models/`:
  
  - [ ] **UsersModel.js**
    - [ ] Change `getDb()` to `await getDb()`
    - [ ] Convert to async methods
    - [ ] Update parameter syntax: `?` → `@paramName`
    - [ ] Replace `GROUP_CONCAT` → `STRING_AGG`
    - [ ] Update datetime functions: `datetime('now')` → `GETUTCDATE()`
    - [ ] Test all CRUD operations
  
  - [ ] **QuestionModel.js**
    - [ ] Make all methods async
    - [ ] Update all queries with SQL Server syntax
    - [ ] See `EXAMPLE_MODEL_CONVERSION.js` for reference
    - [ ] Test filtering, sorting, pagination
  
  - [ ] **AnswerModel.js**
    - [ ] Convert to async
    - [ ] Update query syntax
    - [ ] Test create, read, update, delete
  
  - [ ] **CommentModel.js**
    - [ ] Convert to async
    - [ ] Ensure question/answer comment routing works
  
  - [ ] **Other models**
    - [ ] (TagModel, VoteModel, MediaModel, etc.)

- [ ] **Convert Controllers**
  
  For each controller file in `src/controllers/`:
  
  - [ ] **QuestionController.js**
    - [ ] Add `async` to all route handlers
    - [ ] Wrap model calls in try/catch
    - [ ] Update error responses
    - [ ] Test all endpoints
  
  - [ ] **AnswerController.js**
    - [ ] Make all handlers async
    - [ ] Add proper error handling
  
  - [ ] **CommentController.js**
    - [ ] Convert to async
  
  - [ ] **Other controllers**

- [ ] **Update Routes** (if needed)
  - [ ] Verify all route handlers are now async
  - [ ] Check for any middleware updates needed

- [ ] **Update Main Server File**
  - [ ] Update server.js/server-refactored.js
  - [ ] Add graceful shutdown for database connection:
    ```javascript
    process.on('SIGINT', async () => {
      await closeDb();
      process.exit(0);
    });
    ```

## Phase 4: Testing

### Unit Tests
- [ ] **Test each model independently**
  ```bash
  npm test  # if you have test suite
  ```

### Integration Tests
- [ ] **Test all API endpoints**
  
  **GET endpoints:**
  - [ ] GET /questions
  - [ ] GET /questions/:id
  - [ ] GET /questions/:id/answers
  - [ ] GET /answers/:id
  - [ ] GET /comments/:id
  - [ ] GET /users/:id
  - [ ] GET /tags
  
  **POST endpoints:**
  - [ ] POST /questions (create)
  - [ ] POST /questions/:id/answers
  - [ ] POST /answers/:id/comments
  - [ ] POST /votes
  - [ ] POST /bookmarks
  
  **PUT endpoints:**
  - [ ] PUT /questions/:id
  - [ ] PUT /answers/:id
  - [ ] PUT /users/:id
  
  **DELETE endpoints:**
  - [ ] DELETE /questions/:id
  - [ ] DELETE /answers/:id
  - [ ] DELETE /comments/:id

### Performance Testing
- [ ] **Test query performance**
  - [ ] Check slow queries
  - [ ] Monitor SQL Server query execution times
  - [ ] Compare with SQLite baseline
  - [ ] Add indexes if needed

### Data Integrity Testing
- [ ] **Verify no data loss**
  ```bash
  # Compare row counts
  # Check for orphaned records
  # Verify foreign key constraints
  ```

## Phase 5: Deployment & Cleanup

- [ ] **Backup before going live**
  ```bash
  # SQL Server backup
  # Backup .env file in secure location
  ```

- [ ] **Deploy to production**
  - [ ] Update production .env with SQL Server credentials
  - [ ] Deploy code changes
  - [ ] Run final integration tests
  - [ ] Monitor application logs

- [ ] **Post-deployment**
  - [ ] Verify all endpoints working
  - [ ] Check error logs
  - [ ] Monitor database performance
  - [ ] Set up SQL Server maintenance jobs

- [ ] **Cleanup**
  - [ ] Archive old SQLite files (forum.db, forum.db-shm, forum.db-wal)
  - [ ] Remove export/import scripts if not needed
  - [ ] Update documentation
  - [ ] Archive backup files

## Common Issues & Solutions

### Issue: "Connection timeout"
**Solution:**
- Verify SQL Server is running
- Check firewall rules
- Verify connection string in .env
- Check DB_SERVER is reachable

### Issue: "Foreign key constraint failed"
**Solution:**
- Ensure tables imported in correct order
- Check for referential integrity
- Verify identity values are correct

### Issue: "Date/time mismatch"
**Solution:**
- Verify DATETIME2 is used in schema
- Check date conversion in code
- Use GETUTCDATE() for current date

### Issue: "Encoding/Unicode issues"
**Solution:**
- Ensure NVARCHAR is used for text fields
- Verify .NET encoding is UTF-8
- Check JSON encoding in export/import

### Issue: "GROUP_CONCAT not working"
**Solution:**
- Replace with STRING_AGG in SQL Server
- Ensure all grouped columns are in SELECT
- Test individually in SSMS first

## Rollback Plan

If migration fails:
1. Keep SQLite files intact (backup)
2. Revert db.js: `cp db-sqlite.backup.js db.js`
3. Reinstall better-sqlite3: `npm install better-sqlite3`
4. Restore from backup
5. Investigate issue
6. Try again

## Sign-Off

- [ ] **Development** - Testing complete
- [ ] **Staging** - All tests passing
- [ ] **Production** - Deployed and verified

---

## Resources

- [sqlserver-migration.sql](sqlserver-migration.sql) - Database schema
- [db-sqlserver.js](db-sqlserver.js) - Database module
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Detailed guide
- [EXAMPLE_MODEL_CONVERSION.js](EXAMPLE_MODEL_CONVERSION.js) - Code examples
- [export-to-json.js](export-to-json.js) - Data export tool
- [import-from-json.js](import-from-json.js) - Data import tool

## Questions?

- Check MIGRATION_GUIDE.md for detailed explanations
- Review EXAMPLE_MODEL_CONVERSION.js for code patterns
- Check SQL Server documentation for syntax questions
- Test queries in SSMS before running in code
