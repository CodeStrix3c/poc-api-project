# Discussion Forum Mock API — SQLite (Zero Config)

Stack Overflow-like REST API with a local SQLite database. No Docker, no SQL Server, no config needed.

## Quick Start

```bash
npm install
npm run seed      # creates forum.db + seeds all data
npm start         # → http://localhost:3001
```

That's it. The database is a single `forum.db` file.

## Why SQLite?

- **Zero installation** — no database server needed
- **Single file** — delete `forum.db` to reset everything
- **~10MB RAM** — runs on any machine
- **Same API contract** — your React frontend won't know the difference
- **Real SQL** — schema maps directly to SQL Server/PostgreSQL

## Seeded Data

8 users, 20 tags, 12 questions (with code blocks + multimedia), 7 answers, 12 comments, 17 media items (images/videos), 18 votes, 6 bookmarks, 6 notifications, 12 linked questions, 15 search suggestions.

## API Endpoints

```
GET    /api/v1/questions              ?page&limit&sort&status&tag&q&userId&isBounty
GET    /api/v1/questions/:id
POST   /api/v1/questions              { title, body, userId, tags[] }
PUT    /api/v1/questions/:id          { title, body, status }
DELETE /api/v1/questions/:id

GET    /api/v1/questions/:id/answers  ?sort=votes|created
POST   /api/v1/questions/:id/answers  { body, userId }
PATCH  /api/v1/answers/:id/accept

POST   /api/v1/comments               { userId, questionId|answerId, body }
POST   /api/v1/votes                   { userId, targetType, targetId, value(1|-1) }

GET    /api/v1/users                   ?sort=reputation|joined|name
GET    /api/v1/users/:id
GET    /api/v1/tags                    ?q=react

GET    /api/v1/bookmarks/:userId
POST   /api/v1/bookmarks              { userId, questionId }
DELETE /api/v1/bookmarks/:userId/:questionId

GET    /api/v1/notifications/:userId
PATCH  /api/v1/notifications/:id/read

GET    /api/v1/search                  (suggestions or ?q=term)
POST   /api/v1/media                  { questionId, type, url, ... }
GET    /api/v1/stats
GET    /api/v1/health
```

## npm Scripts

| Script         | What it does                       |
|----------------|------------------------------------|
| `npm start`    | Start API on port 3001             |
| `npm run dev`  | Start with auto-reload             |
| `npm run seed` | Create DB + seed data              |
| `npm run reset`| Delete DB + re-seed fresh          |

## Migrating to SQL Server Later

Same table names, same columns, same API contract. Just swap `better-sqlite3` → `mssql` in `db.js`.
