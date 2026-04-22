# Discussion Forum Table Names with Prefix

## Table Naming Convention
All tables use the prefix `discussion_forum_` to organize and identify forum-related data.

## Complete Table List

| SQLite Name | SQL Server Name | Purpose |
|------------|-----------------|---------|
| Users | discussion_forum_Users | User accounts and profiles |
| Tags | discussion_forum_Tags | Question tags |
| Questions | discussion_forum_Questions | Forum questions/discussions |
| QuestionTags | discussion_forum_QuestionTags | Many-to-many: Questions ↔ Tags |
| Answers | discussion_forum_Answers | Answers to questions |
| Comments | discussion_forum_Comments | Comments on questions/answers |
| Votes | discussion_forum_Votes | Voting records (up/down) |
| Media | discussion_forum_Media | Images, videos, attachments |
| Bookmarks | discussion_forum_Bookmarks | Bookmarked questions |
| Notifications | discussion_forum_Notifications | User notifications |
| LinkedQuestions | discussion_forum_LinkedQuestions | Related question links |
| UserTags | discussion_forum_UserTags | User tag preferences |
| SearchSuggestions | discussion_forum_SearchSuggestions | Auto-complete suggestions |
| QuestionViews | discussion_forum_QuestionViews | View tracking |

## Index Names

All indexes follow the pattern: `IX_discussion_forum_{TableName}_{Column}`

Examples:
- `IX_discussion_forum_Users_Username`
- `IX_discussion_forum_Questions_UserId`
- `IX_discussion_forum_Tags_Name`

## Updating Your Code

When updating models, use the full table names with prefix:

### Before (SQLite):
```javascript
const query = `SELECT * FROM Questions WHERE Id = ?`;
```

### After (SQL Server):
```javascript
const query = `SELECT * FROM [discussion_forum_Questions] WHERE Id = @id`;
```

### Query Templates

**SELECT from prefixed tables:**
```sql
SELECT * FROM [discussion_forum_Questions]
WHERE Id = @id
```

**JOIN with prefixed tables:**
```sql
SELECT q.*, u.Username
FROM [discussion_forum_Questions] q
JOIN [discussion_forum_Users] u ON q.UserId = u.Id
```

**INSERT into prefixed tables:**
```sql
INSERT INTO [discussion_forum_Questions] (Title, Body, UserId)
OUTPUT INSERTED.Id
VALUES (@title, @body, @userId)
```

## Key Points

- Always wrap table names in brackets: `[discussion_forum_TableName]`
- Use the full prefix in all queries
- Index names automatically include the prefix
- Foreign key references use the prefixed table names
- All scripts (import-from-json.js, etc.) are updated to use prefixes

## Benefits of the Prefix

✅ **Organization** - Clear that these tables belong to the forum module  
✅ **Namespace** - Allows multiple applications/modules in same database  
✅ **Clarity** - Easy to identify forum-related tables  
✅ **Scalability** - Room for other features/modules to coexist  

## Example Usage in Code

```javascript
import { executeQueryRows, executeNonQuery } from "../../db.js";

// Get all questions
export async function getAllQuestions(limit = 20, offset = 0) {
  return executeQueryRows(
    `SELECT * FROM [discussion_forum_Questions] ORDER BY CreatedAt DESC
     OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
    { offset, limit }
  );
}

// Create new question
export async function createQuestion(title, body, userId) {
  const result = await executeQuery(
    `INSERT INTO [discussion_forum_Questions] (Title, Body, UserId, CreatedAt, UpdatedAt)
     OUTPUT INSERTED.Id
     VALUES (@title, @body, @userId, GETUTCDATE(), GETUTCDATE())`,
    { title, body, userId }
  );
  return result.recordset[0].Id;
}

// Join with users
export async function getQuestionWithAuthor(questionId) {
  return executeQuerySingle(
    `SELECT q.*, u.Username, u.Avatar
     FROM [discussion_forum_Questions] q
     JOIN [discussion_forum_Users] u ON q.UserId = u.Id
     WHERE q.Id = @id`,
    { id: questionId }
  );
}
```

---

For complete migration instructions, see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
