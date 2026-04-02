import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";
import { getDb, closeDb } from "./db.js";

const app = express();
const PORT = process.env.PORT ?? 3001;
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Force an explicit CSP that allows local app-specific DevTools polling
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3001 ws://localhost:3001; img-src 'self' data:; script-src 'self' 'unsafe-inline' unpkg.com cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' unpkg.com cdn.jsdelivr.net; font-src 'self' data: unpkg.com cdn.jsdelivr.net;");
  next();
});

// Chrome DevTools discovery endpoint (required for certain remote/extension workflows)
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => res.json([]));

// ─── SWAGGER DOCS ────────────────────────────────────────────────
app.get("/api-docs/swagger.json", (req, res) => res.json(specs));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { 
  swaggerOptions: { 
    url: "/api-docs/swagger.json",
    persistAuthorization: true,
  },
  customCss: ".swagger-ui { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; }",
}));

// Simulated latency
app.use((req, res, next) => { setTimeout(next, Math.random() * 100 + 30); });

function paginate(rows, page = 1, limit = 15) {
  const total = rows.length, start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: page * limit < total } };
}
function ok(res, data) { return res.json({ data, timestamp: new Date().toISOString() }); }

// ─── QUESTIONS ───────────────────────────────────────────────────
app.get("/api/v1/questions", (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 15, sort = "created", order = "DESC", status, tag, userId, isBounty, q } = req.query;
    const sortMap = { votes:"q.Votes", views:"q.Views", created:"q.CreatedAt", activity:"q.LastActivityAt", answers:"q.AnswersCount" };
    const sortCol = sortMap[sort] ?? "q.CreatedAt";
    const sortDir = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    let where = "WHERE 1=1"; const params = {};
    if (status) { where += " AND q.Status = @status"; params.status = status; }
    if (userId) { where += " AND q.UserId = @userId"; params.userId = parseInt(userId); }
    if (isBounty) { where += " AND q.IsBounty = @bounty"; params.bounty = isBounty === "true" ? 1 : 0; }
    if (q) { where += " AND (q.Title LIKE @search OR q.Body LIKE @search)"; params.search = `%${q}%`; }
    if (tag) { where += ` AND q.Id IN (SELECT qt.QuestionId FROM QuestionTags qt JOIN Tags t ON qt.TagId=t.Id WHERE t.Name=@tag)`; params.tag = tag; }

    const rows = db.prepare(`SELECT q.*, u.Username, u.DisplayName, u.Avatar, u.Reputation, GROUP_CONCAT(DISTINCT t.Name) AS TagNames FROM Questions q JOIN Users u ON q.UserId=u.Id LEFT JOIN QuestionTags qt ON qt.QuestionId=q.Id LEFT JOIN Tags t ON qt.TagId=t.Id ${where} GROUP BY q.Id ORDER BY ${sortCol} ${sortDir}`).all(params);

    const qIds = rows.map(r => r.Id); let mediaMap = {};
    if (qIds.length > 0) {
      for (const m of db.prepare(`SELECT * FROM Media WHERE QuestionId IN (${qIds.join(",")})`).all()) {
        if (!mediaMap[m.QuestionId]) mediaMap[m.QuestionId] = [];
        mediaMap[m.QuestionId].push(m);
      }
    }
    const mapped = rows.map(r => ({ id:r.Id, title:r.Title, body:r.Body, userId:r.UserId, votes:r.Votes, views:r.Views, answersCount:r.AnswersCount, acceptedAnswerId:r.AcceptedAnswerId, status:r.Status, isBounty:!!r.IsBounty, bountyAmount:r.BountyAmount, favorites:r.Favorites, isProtected:!!r.IsProtected, createdAt:r.CreatedAt, updatedAt:r.UpdatedAt, lastActivityAt:r.LastActivityAt, tags:r.TagNames?r.TagNames.split(","):[], media:mediaMap[r.Id]??[], user:{username:r.Username,displayName:r.DisplayName,avatar:r.Avatar,reputation:r.Reputation} }));
    const paged = paginate(mapped, parseInt(page), parseInt(limit));
    return res.json({ ...paged, timestamp: new Date().toISOString() });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.get("/api/v1/questions/:id", (req, res) => {
  try {
    const db = getDb(); const id = parseInt(req.params.id);
    const q = db.prepare(`SELECT q.*, u.Username, u.DisplayName, u.Avatar, u.Reputation, u.Bio AS UserBio, GROUP_CONCAT(DISTINCT t.Name) AS TagNames FROM Questions q JOIN Users u ON q.UserId=u.Id LEFT JOIN QuestionTags qt ON qt.QuestionId=q.Id LEFT JOIN Tags t ON qt.TagId=t.Id WHERE q.Id=? GROUP BY q.Id`).get(id);
    if (!q) return res.status(404).json({ error: "Not found" });
    const media = db.prepare(`SELECT * FROM Media WHERE QuestionId=?`).all(id);
    const comments = db.prepare(`SELECT c.*, u.Username, u.DisplayName, u.Avatar FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.QuestionId=? ORDER BY c.CreatedAt`).all(id);
    const linked = db.prepare(`SELECT lq.LinkedQuestionId, q2.Title, q2.Votes, q2.AnswersCount FROM LinkedQuestions lq JOIN Questions q2 ON lq.LinkedQuestionId=q2.Id WHERE lq.QuestionId=?`).all(id);
    db.prepare(`UPDATE Questions SET Views=Views+1 WHERE Id=?`).run(id);
    return ok(res, { id:q.Id, title:q.Title, body:q.Body, userId:q.UserId, votes:q.Votes, views:q.Views+1, answersCount:q.AnswersCount, acceptedAnswerId:q.AcceptedAnswerId, status:q.Status, isBounty:!!q.IsBounty, bountyAmount:q.BountyAmount, favorites:q.Favorites, isProtected:!!q.IsProtected, createdAt:q.CreatedAt, updatedAt:q.UpdatedAt, lastActivityAt:q.LastActivityAt, tags:q.TagNames?q.TagNames.split(","):[], media, comments, linkedQuestions:linked, user:{username:q.Username,displayName:q.DisplayName,avatar:q.Avatar,reputation:q.Reputation,bio:q.UserBio} });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.post("/api/v1/questions", (req, res) => {
  try {
    const db = getDb(); const { title, body, userId, tags = [], isBounty = false, bountyAmount = 0 } = req.body;
    if (!title || !body || !userId) return res.status(400).json({ error: "title, body, userId required" });
    const info = db.prepare(`INSERT INTO Questions (Title,Body,UserId,IsBounty,BountyAmount) VALUES (?,?,?,?,?)`).run(title, body, userId, isBounty?1:0, bountyAmount);
    const insQT = db.prepare(`INSERT INTO QuestionTags (QuestionId,TagId) VALUES (?,(SELECT Id FROM Tags WHERE Name=?))`);
    for (const t of tags) { try { insQT.run(info.lastInsertRowid, t); } catch {} }
    return res.status(201).json({ data: { id: info.lastInsertRowid, title, tags } });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.put("/api/v1/questions/:id", (req, res) => {
  try {
    const db = getDb(); const { title, body, status } = req.body;
    db.prepare(`UPDATE Questions SET Title=COALESCE(?,Title), Body=COALESCE(?,Body), Status=COALESCE(?,Status), UpdatedAt=datetime('now') WHERE Id=?`).run(title, body, status, parseInt(req.params.id));
    const updated = db.prepare(`SELECT * FROM Questions WHERE Id=?`).get(parseInt(req.params.id));
    return updated ? ok(res, updated) : res.status(404).json({ error: "Not found" });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.delete("/api/v1/questions/:id", (req, res) => {
  try { getDb().prepare(`DELETE FROM Questions WHERE Id=?`).run(parseInt(req.params.id)); return res.status(204).send(); }
  catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── ANSWERS ─────────────────────────────────────────────────────
app.get("/api/v1/questions/:id/answers", (req, res) => {
  try {
    const db = getDb(); const qId = parseInt(req.params.id);
    const { sort = "votes", order = "DESC" } = req.query;
    const sortCol = sort === "created" ? "a.CreatedAt" : "a.Votes";
    const rows = db.prepare(`SELECT a.*, u.Username, u.DisplayName, u.Avatar, u.Reputation FROM Answers a JOIN Users u ON a.UserId=u.Id WHERE a.QuestionId=? ORDER BY a.IsAccepted DESC, ${sortCol} ${order?.toUpperCase()==="ASC"?"ASC":"DESC"}`).all(qId);
    const aids = rows.map(a => a.Id); let cMap = {}, mMap = {};
    if (aids.length > 0) {
      const ph = aids.map(()=>"?").join(",");
      for (const c of db.prepare(`SELECT c.*, u.Username, u.DisplayName, u.Avatar FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.AnswerId IN (${ph}) ORDER BY c.CreatedAt`).all(...aids)) { if (!cMap[c.AnswerId]) cMap[c.AnswerId]=[]; cMap[c.AnswerId].push(c); }
      for (const m of db.prepare(`SELECT * FROM Media WHERE AnswerId IN (${ph})`).all(...aids)) { if (!mMap[m.AnswerId]) mMap[m.AnswerId]=[]; mMap[m.AnswerId].push(m); }
    }
    return ok(res, rows.map(a => ({ id:a.Id, questionId:a.QuestionId, userId:a.UserId, body:a.Body, votes:a.Votes, isAccepted:!!a.IsAccepted, createdAt:a.CreatedAt, updatedAt:a.UpdatedAt, comments:cMap[a.Id]??[], media:mMap[a.Id]??[], user:{username:a.Username,displayName:a.DisplayName,avatar:a.Avatar,reputation:a.Reputation} })));
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.post("/api/v1/questions/:id/answers", (req, res) => {
  try {
    const db = getDb(); const qId = parseInt(req.params.id); const { body, userId } = req.body;
    if (!body || !userId) return res.status(400).json({ error: "body and userId required" });
    const info = db.prepare(`INSERT INTO Answers (QuestionId,UserId,Body) VALUES (?,?,?)`).run(qId, userId, body);
    db.prepare(`UPDATE Questions SET AnswersCount=AnswersCount+1, LastActivityAt=datetime('now') WHERE Id=?`).run(qId);
    return res.status(201).json({ data: db.prepare(`SELECT * FROM Answers WHERE Id=?`).get(info.lastInsertRowid) });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.patch("/api/v1/answers/:id/accept", (req, res) => {
  try {
    const db = getDb(); const aId = parseInt(req.params.id);
    const ans = db.prepare(`SELECT * FROM Answers WHERE Id=?`).get(aId);
    if (!ans) return res.status(404).json({ error: "Not found" });
    db.prepare(`UPDATE Answers SET IsAccepted=0 WHERE QuestionId=?`).run(ans.QuestionId);
    db.prepare(`UPDATE Answers SET IsAccepted=1 WHERE Id=?`).run(aId);
    db.prepare(`UPDATE Questions SET AcceptedAnswerId=?, Status='answered' WHERE Id=?`).run(aId, ans.QuestionId);
    return ok(res, { message: "Accepted", answerId: aId });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── COMMENTS ────────────────────────────────────────────────────
app.post("/api/v1/comments", (req, res) => {
  try {
    const db = getDb(); const { userId, questionId, answerId, body } = req.body;
    if (!userId || !body || (!questionId && !answerId)) return res.status(400).json({ error: "userId, body, and questionId or answerId required" });
    const info = db.prepare(`INSERT INTO Comments (UserId,QuestionId,AnswerId,Body) VALUES (?,?,?,?)`).run(userId, questionId??null, answerId??null, body);
    return res.status(201).json({ data: db.prepare(`SELECT * FROM Comments WHERE Id=?`).get(info.lastInsertRowid) });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── VOTES ───────────────────────────────────────────────────────
app.post("/api/v1/votes", (req, res) => {
  try {
    const db = getDb(); const { userId, targetType, targetId, value } = req.body;
    if (!userId || !targetType || !targetId || ![1,-1].includes(value)) return res.status(400).json({ error: "Invalid" });
    db.prepare(`INSERT INTO Votes (UserId,TargetType,TargetId,Value) VALUES (?,?,?,?) ON CONFLICT(UserId,TargetType,TargetId) DO UPDATE SET Value=excluded.Value`).run(userId, targetType, targetId, value);
    const sum = db.prepare(`SELECT COALESCE(SUM(Value),0) AS total FROM Votes WHERE TargetType=? AND TargetId=?`).get(targetType, targetId);
    const table = targetType==="question"?"Questions":targetType==="answer"?"Answers":"Comments";
    db.prepare(`UPDATE ${table} SET Votes=? WHERE Id=?`).run(sum.total, targetId);
    return ok(res, { targetType, targetId, votes: sum.total });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── USERS ───────────────────────────────────────────────────────
app.get("/api/v1/users", (req, res) => {
  try {
    const db = getDb(); const { sort="reputation", order="DESC", page=1, limit=15 } = req.query;
    const sc = sort==="joined"?"u.JoinedAt":sort==="name"?"u.DisplayName":"u.Reputation";
    const rows = db.prepare(`SELECT u.*, (SELECT COUNT(*) FROM Questions WHERE UserId=u.Id) AS QC, (SELECT COUNT(*) FROM Answers WHERE UserId=u.Id) AS AC, GROUP_CONCAT(DISTINCT t.Name) AS TN FROM Users u LEFT JOIN UserTags ut ON ut.UserId=u.Id LEFT JOIN Tags t ON ut.TagId=t.Id GROUP BY u.Id ORDER BY ${sc} ${order?.toUpperCase()==="ASC"?"ASC":"DESC"}`).all();
    const mapped = rows.map(u => ({ id:u.Id, username:u.Username, displayName:u.DisplayName, email:u.Email, avatar:u.Avatar, bio:u.Bio, reputation:u.Reputation, badges:{gold:u.GoldBadges,silver:u.SilverBadges,bronze:u.BronzeBadges}, location:u.Location, website:u.Website, isOnline:!!u.IsOnline, joinedAt:u.JoinedAt, lastSeen:u.LastSeen, questionsCount:u.QC, answersCount:u.AC, tags:u.TN?u.TN.split(","):[] }));
    return res.json({ ...paginate(mapped, parseInt(page), parseInt(limit)), timestamp: new Date().toISOString() });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

app.get("/api/v1/users/:id", (req, res) => {
  try {
    const db = getDb();
    const u = db.prepare(`SELECT u.*, (SELECT COUNT(*) FROM Questions WHERE UserId=u.Id) AS QC, (SELECT COUNT(*) FROM Answers WHERE UserId=u.Id) AS AC, GROUP_CONCAT(DISTINCT t.Name) AS TN FROM Users u LEFT JOIN UserTags ut ON ut.UserId=u.Id LEFT JOIN Tags t ON ut.TagId=t.Id WHERE u.Id=? GROUP BY u.Id`).get(parseInt(req.params.id));
    if (!u) return res.status(404).json({ error: "Not found" });
    return ok(res, { id:u.Id, username:u.Username, displayName:u.DisplayName, email:u.Email, avatar:u.Avatar, bio:u.Bio, reputation:u.Reputation, badges:{gold:u.GoldBadges,silver:u.SilverBadges,bronze:u.BronzeBadges}, location:u.Location, website:u.Website, isOnline:!!u.IsOnline, joinedAt:u.JoinedAt, lastSeen:u.LastSeen, questionsCount:u.QC, answersCount:u.AC, tags:u.TN?u.TN.split(","):[] });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── TAGS ────────────────────────────────────────────────────────
app.get("/api/v1/tags", (req, res) => {
  try { const { q } = req.query; return ok(res, q ? getDb().prepare(`SELECT * FROM Tags WHERE Name LIKE ? ORDER BY QuestionsCount DESC`).all(`%${q}%`) : getDb().prepare(`SELECT * FROM Tags ORDER BY QuestionsCount DESC`).all()); }
  catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── NOTIFICATIONS ───────────────────────────────────────────────
app.get("/api/v1/notifications/:userId", (req, res) => { try { return ok(res, getDb().prepare(`SELECT * FROM Notifications WHERE UserId=? ORDER BY CreatedAt DESC`).all(parseInt(req.params.userId))); } catch (err) { return res.status(500).json({ error: err.message }); } });
app.patch("/api/v1/notifications/:id/read", (req, res) => { try { getDb().prepare(`UPDATE Notifications SET IsRead=1 WHERE Id=?`).run(parseInt(req.params.id)); return ok(res, { message: "Read" }); } catch (err) { return res.status(500).json({ error: err.message }); } });

// ─── BOOKMARKS ───────────────────────────────────────────────────
app.get("/api/v1/bookmarks/:userId", (req, res) => { try { return ok(res, getDb().prepare(`SELECT b.*, q.Title, q.Votes, q.AnswersCount, q.Status FROM Bookmarks b JOIN Questions q ON b.QuestionId=q.Id WHERE b.UserId=? ORDER BY b.CreatedAt DESC`).all(parseInt(req.params.userId))); } catch (err) { return res.status(500).json({ error: err.message }); } });
app.post("/api/v1/bookmarks", (req, res) => { try { const { userId, questionId } = req.body; getDb().prepare(`INSERT INTO Bookmarks (UserId,QuestionId) VALUES (?,?)`).run(userId, questionId); getDb().prepare(`UPDATE Questions SET Favorites=Favorites+1 WHERE Id=?`).run(questionId); return res.status(201).json({ data: { userId, questionId } }); } catch (err) { return err.message.includes("UNIQUE") ? res.status(409).json({ error: "Already bookmarked" }) : res.status(500).json({ error: err.message }); } });
app.delete("/api/v1/bookmarks/:userId/:questionId", (req, res) => { try { const [uid,qid] = [parseInt(req.params.userId), parseInt(req.params.questionId)]; getDb().prepare(`DELETE FROM Bookmarks WHERE UserId=? AND QuestionId=?`).run(uid, qid); getDb().prepare(`UPDATE Questions SET Favorites=MAX(Favorites-1,0) WHERE Id=?`).run(qid); return res.status(204).send(); } catch (err) { return res.status(500).json({ error: err.message }); } });

// ─── MEDIA ───────────────────────────────────────────────────────
app.post("/api/v1/media", (req, res) => { try { const { questionId, answerId, type, url, thumbnail, altText, width, height, duration, platform } = req.body; const info = getDb().prepare(`INSERT INTO Media (QuestionId,AnswerId,Type,Url,Thumbnail,AltText,Width,Height,Duration,Platform) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(questionId??null, answerId??null, type, url, thumbnail??"", altText??"", width??null, height??null, duration??null, platform??null); return res.status(201).json({ data: getDb().prepare(`SELECT * FROM Media WHERE Id=?`).get(info.lastInsertRowid) }); } catch (err) { return res.status(500).json({ error: err.message }); } });

// ─── SEARCH ──────────────────────────────────────────────────────
app.get("/api/v1/search", (req, res) => {
  try {
    const db = getDb(); const { q, page=1, limit=15 } = req.query;
    if (!q) return ok(res, db.prepare(`SELECT Term FROM SearchSuggestions ORDER BY Weight DESC`).all().map(s => s.Term));
    const rows = db.prepare(`SELECT q.Id, q.Title, q.Votes, q.AnswersCount, q.Views, q.Status, q.CreatedAt, u.DisplayName, u.Avatar, GROUP_CONCAT(DISTINCT t.Name) AS TN FROM Questions q JOIN Users u ON q.UserId=u.Id LEFT JOIN QuestionTags qt ON qt.QuestionId=q.Id LEFT JOIN Tags t ON qt.TagId=t.Id WHERE q.Title LIKE @s OR q.Body LIKE @s GROUP BY q.Id ORDER BY q.Votes DESC`).all({ s: `%${q}%` });
    return res.json({ ...paginate(rows.map(r => ({ ...r, tags: r.TN?r.TN.split(","):[] })), parseInt(page), parseInt(limit)), timestamp: new Date().toISOString() });
  } catch (err) { return res.status(500).json({ error: err.message }); }
});

// ─── STATS & HEALTH ──────────────────────────────────────────────
app.get("/api/v1/stats", (req, res) => { try { return ok(res, getDb().prepare(`SELECT (SELECT COUNT(*) FROM Questions) AS totalQuestions, (SELECT COUNT(*) FROM Answers) AS totalAnswers, (SELECT COUNT(*) FROM Users) AS totalUsers, (SELECT COUNT(*) FROM Tags) AS totalTags, (SELECT COUNT(*) FROM Comments) AS totalComments, (SELECT COUNT(*) FROM Users WHERE IsOnline=1) AS activeUsers`).get()); } catch (err) { return res.status(500).json({ error: err.message }); } });
app.get("/api/v1/health", (req, res) => { try { getDb().prepare("SELECT 1").get(); return res.json({ status: "healthy", db: "SQLite (forum.db)" }); } catch (err) { return res.status(503).json({ status: "unhealthy", error: err.message }); } });


// ─── START ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  getDb();
  console.log(`\n🚀 Forum API → http://localhost:${PORT}\n   DB: SQLite (forum.db) — zero config\n`);
  console.log(`📚 Swagger UI → http://localhost:${PORT}/api-docs\n`);
  console.log(`   GET  /api/v1/questions    GET  /api/v1/users`);
  console.log(`   GET  /api/v1/tags         GET  /api/v1/search?q=...`);
  console.log(`   GET  /api/v1/stats        GET  /api/v1/health\n`);
});
process.on("SIGINT", () => { closeDb(); process.exit(0); });
