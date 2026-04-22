# Quick Reference Card - Table Names & Common Queries

## 🎯 The Prefix
All tables start with `discussion_forum_` - Example: `[discussion_forum_Questions]`

---

## 📋 All 14 Tables

```
✓ discussion_forum_Users           - User accounts
✓ discussion_forum_Tags            - Question tags
✓ discussion_forum_Questions       - Forum questions
✓ discussion_forum_QuestionTags    - Q↔Tag linking
✓ discussion_forum_Answers         - Question answers
✓ discussion_forum_Comments        - Q/A comments
✓ discussion_forum_Votes           - Up/down votes
✓ discussion_forum_Media           - Images, videos
✓ discussion_forum_Bookmarks       - Saved questions
✓ discussion_forum_Notifications   - User alerts
✓ discussion_forum_LinkedQuestions - Related Q's
✓ discussion_forum_UserTags        - User preferences
✓ discussion_forum_SearchSuggestions - Search hints
✓ discussion_forum_QuestionViews   - View tracking
```

---

## 🔧 Common Query Patterns

### SELECT Single Row
```javascript
const question = await executeQuerySingle(
  `SELECT * FROM [discussion_forum_Questions] WHERE Id = @id`,
  { id }
);
```

### SELECT Multiple Rows
```javascript
const questions = await executeQueryRows(
  `SELECT * FROM [discussion_forum_Questions] 
   ORDER BY CreatedAt DESC
   OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
  { offset, limit }
);
```

### SELECT with JOIN
```javascript
const q = await executeQuerySingle(
  `SELECT q.*, u.Username, u.Avatar
   FROM [discussion_forum_Questions] q
   JOIN [discussion_forum_Users] u ON q.UserId = u.Id
   WHERE q.Id = @id`,
  { id }
);
```

### SELECT with GROUP_CONCAT (STRING_AGG)
```javascript
const q = await executeQueryRows(
  `SELECT q.*, STRING_AGG(t.Name, ',') as Tags
   FROM [discussion_forum_Questions] q
   LEFT JOIN [discussion_forum_QuestionTags] qt ON q.Id = qt.QuestionId
   LEFT JOIN [discussion_forum_Tags] t ON qt.TagId = t.Id
   WHERE q.UserId = @userId
   GROUP BY q.Id, q.Title, q.Body, ...
   ORDER BY q.CreatedAt DESC`,
  { userId }
);
```

### INSERT with OUTPUT
```javascript
const result = await executeQuery(
  `INSERT INTO [discussion_forum_Questions] (Title, Body, UserId)
   OUTPUT INSERTED.Id
   VALUES (@title, @body, @userId)`,
  { title, body, userId }
);
const questionId = result.recordset[0].Id;
```

### UPDATE
```javascript
await executeNonQuery(
  `UPDATE [discussion_forum_Questions]
   SET Title = @title, UpdatedAt = GETUTCDATE()
   WHERE Id = @id`,
  { id, title }
);
```

### DELETE
```javascript
await executeNonQuery(
  `DELETE FROM [discussion_forum_Questions]
   WHERE Id = @id`,
  { id }
);
```

---

## 🚀 Common Tasks

### Get User with Stats
```javascript
SELECT u.*, 
       COUNT(DISTINCT q.Id) as QuestionCount,
       COUNT(DISTINCT a.Id) as AnswerCount,
       COUNT(DISTINCT c.Id) as CommentCount
FROM [discussion_forum_Users] u
LEFT JOIN [discussion_forum_Questions] q ON u.Id = q.UserId
LEFT JOIN [discussion_forum_Answers] a ON u.Id = a.UserId
LEFT JOIN [discussion_forum_Comments] c ON u.Id = c.UserId
WHERE u.Id = @userId
GROUP BY u.Id, u.Username, u.DisplayName, ... (all user columns)
```

### Get Question with Answers
```javascript
SELECT q.*, u.Username, u.Avatar,
       STRING_AGG(t.Name, ',') as Tags
FROM [discussion_forum_Questions] q
JOIN [discussion_forum_Users] u ON q.UserId = u.Id
LEFT JOIN [discussion_forum_QuestionTags] qt ON q.Id = qt.QuestionId
LEFT JOIN [discussion_forum_Tags] t ON qt.TagId = t.Id
WHERE q.Id = @id
GROUP BY q.Id, q.Title, ... (all question columns), u.Username, u.Avatar
```

### Get All Answers for Question
```javascript
SELECT a.*, u.Username, u.Avatar,
       COUNT(c.Id) as CommentCount
FROM [discussion_forum_Answers] a
JOIN [discussion_forum_Users] u ON a.UserId = u.Id
LEFT JOIN [discussion_forum_Comments] c ON a.Id = c.Id
WHERE a.QuestionId = @questionId
GROUP BY a.Id, a.Body, a.Votes, ... (all answer columns), u.Username, u.Avatar
ORDER BY a.IsAccepted DESC, a.Votes DESC
```

### Search Questions
```javascript
SELECT q.*, u.Username, STRING_AGG(t.Name, ',') as Tags
FROM [discussion_forum_Questions] q
JOIN [discussion_forum_Users] u ON q.UserId = u.Id
LEFT JOIN [discussion_forum_QuestionTags] qt ON q.Id = qt.QuestionId
LEFT JOIN [discussion_forum_Tags] t ON qt.TagId = t.Id
WHERE (q.Title LIKE @search OR q.Body LIKE @search)
  AND q.[Status] = 'open'
GROUP BY q.Id, q.Title, q.Body, ... (all columns), u.Username
ORDER BY q.CreatedAt DESC
OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
```

### Get Notifications
```javascript
SELECT n.*, q.Title, a.Body
FROM [discussion_forum_Notifications] n
LEFT JOIN [discussion_forum_Questions] q ON n.QuestionId = q.Id
LEFT JOIN [discussion_forum_Answers] a ON n.AnswerId = a.Id
WHERE n.UserId = @userId AND n.IsRead = 0
ORDER BY n.CreatedAt DESC
```

---

## 📍 Important Reminders

✅ **Always use brackets:** `[discussion_forum_TableName]`  
✅ **Use parameter names:** `@paramName` not `?`  
✅ **Full prefix required:** Use `discussion_forum_` not just table name  
✅ **GROUP BY must include all non-aggregated columns** in SQL Server  
✅ **Use GETUTCDATE()** for current timestamp (not `datetime('now')`)  
✅ **Use OFFSET...FETCH** for pagination (not `LIMIT...OFFSET`)  
✅ **Boolean = BIT:** Store as 0 or 1  

---

## 🔍 Verify Setup
```sql
-- Check all forum tables exist
SELECT COUNT(*) as ForumTableCount
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE 'discussion_forum_%'
-- Should return: 14

-- List all forum tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE 'discussion_forum_%'
ORDER BY TABLE_NAME
```

---

For full documentation: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)  
For table mapping: [TABLE_NAMING_REFERENCE.md](TABLE_NAMING_REFERENCE.md)  
For schema diagram: [SCHEMA_DIAGRAM.md](SCHEMA_DIAGRAM.md)
