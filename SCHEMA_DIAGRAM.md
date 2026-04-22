# Discussion Forum Database Schema with Prefixed Table Names

## Visual Schema Overview

```
discussion_forum_Users
├─ Id (PK)
├─ Username (UNIQUE)
├─ DisplayName
├─ Email (UNIQUE)
├─ Avatar, Bio
├─ Reputation, GoldBadges, SilverBadges, BronzeBadges
├─ Location, Website
├─ IsOnline
└─ JoinedAt, LastSeen

    ├─→ discussion_forum_Questions (FK: UserId)
    │   ├─ Id (PK)
    │   ├─ Title, Body
    │   ├─ UserId (FK → Users)
    │   ├─ Votes, Views, AnswersCount
    │   ├─ AcceptedAnswerId
    │   ├─ Status (open|answered|closed|discussion)
    │   ├─ IsBounty, BountyAmount
    │   ├─ IsClosed, IsProtected, Favorites
    │   ├─ CreatedAt, UpdatedAt, LastActivityAt
    │   │
    │   ├─→ discussion_forum_QuestionTags (FK: QuestionId, TagId)
    │   │   ├─ QuestionId (FK → Questions)
    │   │   └─ TagId (FK → Tags)
    │   │
    │   ├─→ discussion_forum_Answers (FK: QuestionId, UserId)
    │   │   ├─ Id (PK)
    │   │   ├─ QuestionId (FK → Questions)
    │   │   ├─ UserId (FK → Users)
    │   │   ├─ Body
    │   │   ├─ Votes
    │   │   ├─ IsAccepted
    │   │   ├─ CreatedAt, UpdatedAt
    │   │   │
    │   │   ├─→ discussion_forum_Comments (FK: AnswerId, UserId)
    │   │   │   ├─ Id (PK)\n    │   │   │   ├─ AnswerId (FK → Answers)\n    │   │   │   ├─ UserId (FK → Users)\n    │   │   │   ├─ Body\n    │   │   │   ├─ Votes\n    │   │   │   └─ CreatedAt\n    │   │   │\n    │   │   └─→ discussion_forum_Media (FK: AnswerId)\n    │   │       ├─ Id (PK)\n    │   │       ├─ AnswerId (FK → Answers)\n    │   │       ├─ Type (image|video|attachment)\n    │   │       ├─ Url, Thumbnail, AltText\n    │   │       ├─ Width, Height, Duration\n    │   │       ├─ Platform, FileSize, MimeType\n    │   │       └─ CreatedAt\n    │   │\n    │   ├─→ discussion_forum_Comments (FK: QuestionId, UserId)\n    │   │   └─ (same as above, but linked to questions)\n    │   │\n    │   ├─→ discussion_forum_Media (FK: QuestionId)\n    │   │   └─ (images, videos for questions)\n    │   │\n    │   ├─→ discussion_forum_Bookmarks (FK: QuestionId, UserId)\n    │   │   ├─ Id (PK)\n    │   │   ├─ QuestionId (FK → Questions)\n    │   │   ├─ UserId (FK → Users)\n    │   │   └─ CreatedAt\n    │   │\n    │   ├─→ discussion_forum_QuestionViews (FK: QuestionId, UserId)\n    │   │   ├─ Id (PK)\n    │   │   ├─ QuestionId (FK → Questions)\n    │   │   ├─ UserId (FK → Users)\n    │   │   └─ ViewedAt\n    │   │\n    │   └─→ discussion_forum_LinkedQuestions (FK: QuestionId → LinkedQuestionId)\n    │       ├─ QuestionId (FK → Questions)\n    │       └─ LinkedQuestionId (FK → Questions)\n    │\n    ├─→ discussion_forum_Votes (FK: UserId)\n    │   ├─ Id (PK)\n    │   ├─ UserId (FK → Users)\n    │   ├─ TargetType (question|answer|comment)\n    │   ├─ TargetId\n    │   ├─ Value (-1|1)\n    │   └─ CreatedAt\n    │\n    ├─→ discussion_forum_Notifications (FK: UserId)\n    │   ├─ Id (PK)\n    │   ├─ UserId (FK → Users)\n    │   ├─ Type (answer|comment|vote|badge|bounty|mention|accepted)\n    │   ├─ Message\n    │   ├─ QuestionId, AnswerId\n    │   ├─ IsRead\n    │   └─ CreatedAt\n    │\n    └─→ discussion_forum_UserTags (FK: UserId, TagId)\n        ├─ UserId (FK → Users)\n        └─ TagId (FK → Tags)\n\ndiscussion_forum_Tags\n├─ Id (PK)\n├─ Name (UNIQUE)\n├─ Description\n├─ Color\n├─ QuestionsCount\n│\n├─→ discussion_forum_QuestionTags (FK: TagId)\n│   └─ (links to Questions)\n│\n└─→ discussion_forum_UserTags (FK: TagId)\n    └─ (user tag preferences)\n\ndiscussion_forum_SearchSuggestions\n├─ Id (PK)\n├─ Term (UNIQUE)\n└─ Weight\n```

---

## Table Relationships Summary

### One-to-Many (1:N)

- Users → Questions (1 user has many questions)
- Users → Answers (1 user has many answers)
- Users → Comments (1 user has many comments)
- Users → Votes (1 user has many votes)
- Users → Bookmarks (1 user has many bookmarks)
- Users → Notifications (1 user has many notifications)
- Users → QuestionViews (1 user has many question views)

- Questions → Answers (1 question has many answers)
- Questions → Comments (1 question has many comments)
- Questions → Media (1 question has many media)
- Questions → Bookmarks (1 question has many bookmarks)
- Questions → QuestionViews (1 question has many views)

- Answers → Comments (1 answer has many comments)
- Answers → Media (1 answer has many media)

- Tags → UserTags (1 tag is preferred by many users)

### Many-to-Many (N:M)

- Questions ↔ Tags (via QuestionTags)
- Users ↔ Tags (via UserTags)
- Questions ↔ Questions (via LinkedQuestions - for related questions)

---

## Column Type Reference

```
INTEGER fields:
  Id (PK, auto-increment)
  UserId, TagId, QuestionId, AnswerId (FK)
  Votes, Views, AnswersCount, Reputation
  GoldBadges, SilverBadges, BronzeBadges
  BountyAmount, Value (-1 or 1)
  Width, Height, FileSize
  Weight

NVARCHAR(255) fields:
  Username, DisplayName, Email, Name
  Location, Website, Platform, MimeType
  TargetType (question|answer|comment)
  Status (open|answered|closed|discussion)
  Type (image|video|attachment)

NVARCHAR(MAX) fields:
  Title, Body, Description, Bio, Avatar, Message
  Thumbnail, AltText, Duration, Url, Term

BIT (Boolean) fields:
  IsOnline, IsBounty, IsClosed, IsProtected
  IsAccepted, IsRead (0 = false, 1 = true)

DATETIME2 fields:
  CreatedAt, UpdatedAt, LastActivityAt
  JoinedAt, LastSeen, ViewedAt
```

---

## Quick SQL Queries

### Find all forum tables:
```sql
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME LIKE 'discussion_forum_%'
ORDER BY TABLE_NAME;
```

### Count records in each table:
```sql
SELECT 
  'discussion_forum_Users' as TableName, COUNT(*) as RecordCount FROM [discussion_forum_Users]
UNION ALL
SELECT 'discussion_forum_Questions', COUNT(*) FROM [discussion_forum_Questions]
UNION ALL
SELECT 'discussion_forum_Answers', COUNT(*) FROM [discussion_forum_Answers]
UNION ALL
SELECT 'discussion_forum_Comments', COUNT(*) FROM [discussion_forum_Comments]
-- ... etc for other tables
```

### View foreign key relationships:
```sql
SELECT 
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
WHERE TABLE_NAME LIKE 'discussion_forum_%'
ORDER BY TABLE_NAME;
```

---

For complete migration instructions: [SQLSERVER_QUICKSTART.md](SQLSERVER_QUICKSTART.md)  
For table mapping reference: [TABLE_NAMING_REFERENCE.md](TABLE_NAMING_REFERENCE.md)
