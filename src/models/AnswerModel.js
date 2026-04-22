/**
 * Answer Model - handles answer-related database operations
 */

import { getDb } from "../../db.js";

export class AnswerModel {
  static getByQuestionId(questionId, sort = "votes", order = "DESC") {
    const db = getDb();
    const sortCol = sort === "created" ? "a.CreatedAt" : "a.Votes";
    const rows = db
      .prepare(
        `SELECT a.*, u.Username, u.DisplayName, u.Avatar, u.Reputation FROM Answers a JOIN Users u ON a.UserId=u.Id WHERE a.QuestionId=? ORDER BY a.IsAccepted DESC, ${sortCol} ${order?.toUpperCase() === "ASC" ? "ASC" : "DESC"}`
      )
      .all(questionId);

    const aids = rows.map((a) => a.Id);
    let cMap = {},
      mMap = {};
    if (aids.length > 0) {
      const ph = aids.map(() => "?").join(",");
      for (const c of db
        .prepare(
          `SELECT c.*, u.Username, u.DisplayName, u.Avatar FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.AnswerId IN (${ph}) ORDER BY c.CreatedAt`
        )
        .all(...aids)) {
        if (!cMap[c.AnswerId]) cMap[c.AnswerId] = [];
        cMap[c.AnswerId].push(c);
      }
      for (const m of db.prepare(`SELECT * FROM Media WHERE AnswerId IN (${ph})`).all(...aids)) {
        if (!mMap[m.AnswerId]) mMap[m.AnswerId] = [];
        mMap[m.AnswerId].push(m);
      }
    }

    return rows.map((a) => ({
      id: a.Id,
      questionId: a.QuestionId,
      userId: a.UserId,
      body: a.Body,
      votes: a.Votes,
      isAccepted: !!a.IsAccepted,
      createdAt: a.CreatedAt,
      updatedAt: a.UpdatedAt,
      comments: cMap[a.Id] ?? [],
      media: mMap[a.Id] ?? [],
      user: { username: a.Username, displayName: a.DisplayName, avatar: a.Avatar, reputation: a.Reputation },
    }));
  }

  static getById(id) {
    const db = getDb();
    return db.prepare(`SELECT * FROM Answers WHERE Id=?`).get(id);
  }

  static create(questionId, userId, body) {
    const db = getDb();
    const info = db.prepare(`INSERT INTO Answers (QuestionId,UserId,Body) VALUES (?,?,?)`).run(questionId, userId, body);
    db.prepare(`UPDATE Questions SET AnswersCount=AnswersCount+1, LastActivityAt=datetime('now') WHERE Id=?`).run(questionId);
    return db.prepare(`SELECT * FROM Answers WHERE Id=?`).get(info.lastInsertRowid);
  }

  static accept(answerId) {
    const db = getDb();
    const ans = db.prepare(`SELECT * FROM Answers WHERE Id=?`).get(answerId);
    if (!ans) return null;

    db.prepare(`UPDATE Answers SET IsAccepted=0 WHERE QuestionId=?`).run(ans.QuestionId);
    db.prepare(`UPDATE Answers SET IsAccepted=1 WHERE Id=?`).run(answerId);
    db.prepare(`UPDATE Questions SET AcceptedAnswerId=?, Status='answered' WHERE Id=?`).run(answerId, ans.QuestionId);
    return { message: "Accepted", answerId };
  }
}
