/**
 * Question Model - handles question-related database operations
 */

import { getDb } from "../../db.js";

export class QuestionModel {
  static getAll(filters = {}) {
    const db = getDb();
    const { page = 1, limit = 15, sort = "created", order = "DESC", status, tag, userId, isBounty, q } = filters;

    const sortMap = {
      votes: "q.Votes",
      views: "q.Views",
      created: "q.CreatedAt",
      activity: "q.LastActivityAt",
      answers: "q.AnswersCount",
    };
    const sortCol = sortMap[sort] ?? "q.CreatedAt";
    const sortDir = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    let where = "WHERE 1=1";
    const params = {};

    if (status) {
      where += " AND q.Status = @status";
      params.status = status;
    }
    if (userId) {
      where += " AND q.UserId = @userId";
      params.userId = parseInt(userId);
    }
    if (isBounty) {
      where += " AND q.IsBounty = @bounty";
      params.bounty = isBounty === "true" ? 1 : 0;
    }
    if (q) {
      where += " AND (q.Title LIKE @search OR q.Body LIKE @search)";
      params.search = `%${q}%`;
    }
    if (tag) {
      where += ` AND q.Id IN (SELECT qt.QuestionId FROM QuestionTags qt JOIN Tags t ON qt.TagId=t.Id WHERE t.Name=@tag)`;
      params.tag = tag;
    }

    const rows = db
      .prepare(
        `SELECT q.*, u.Username, u.DisplayName, u.Avatar, u.Reputation, GROUP_CONCAT(DISTINCT t.Name) AS TagNames FROM Questions q JOIN Users u ON q.UserId=u.Id LEFT JOIN QuestionTags qt ON qt.QuestionId=q.Id LEFT JOIN Tags t ON qt.TagId=t.Id ${where} GROUP BY q.Id ORDER BY ${sortCol} ${sortDir}`
      )
      .all(params);

    return rows;
  }

  static getById(id, userId = null) {
    const db = getDb();

    const q = db
      .prepare(
        `SELECT q.*, u.Username, u.DisplayName, u.Avatar, u.Reputation, u.Bio AS UserBio, GROUP_CONCAT(DISTINCT t.Name) AS TagNames FROM Questions q JOIN Users u ON q.UserId=u.Id LEFT JOIN QuestionTags qt ON qt.QuestionId=q.Id LEFT JOIN Tags t ON qt.TagId=t.Id WHERE q.Id=? GROUP BY q.Id`
      )
      .get(id);

    if (!q) return null;

    // Track unique user view if userId provided
    let isNewView = false;
    if (userId) {
      const existingView = db.prepare(`SELECT Id FROM QuestionViews WHERE QuestionId=? AND UserId=?`).get(id, userId);
      if (!existingView) {
        db.prepare(`INSERT INTO QuestionViews (QuestionId, UserId) VALUES (?, ?)`).run(id, userId);
        db.prepare(`UPDATE Questions SET Views=Views+1 WHERE Id=?`).run(id);
        isNewView = true;
        q.Views = db.prepare(`SELECT Views FROM Questions WHERE Id=?`).get(id).Views;
      }
    } else {
      db.prepare(`UPDATE Questions SET Views=Views+1 WHERE Id=?`).run(id);
      q.Views = q.Views + 1;
    }

    return { question: q, isNewView, userId: userId ?? "anonymous" };
  }

  static create(title, body, userId, tags = [], isBounty = false, bountyAmount = 0) {
    const db = getDb();
    const info = db.prepare(`INSERT INTO Questions (Title,Body,UserId,IsBounty,BountyAmount) VALUES (?,?,?,?,?)`).run(title, body, userId, isBounty ? 1 : 0, bountyAmount);

    const insQT = db.prepare(`INSERT INTO QuestionTags (QuestionId,TagId) VALUES (?,(SELECT Id FROM Tags WHERE Name=?))`);
    for (const t of tags) {
      try {
        insQT.run(info.lastInsertRowid, t);
      } catch {}
    }

    return { id: info.lastInsertRowid, title, tags };
  }

  static update(id, title, body, status) {
    const db = getDb();
    db.prepare(`UPDATE Questions SET Title=COALESCE(?,Title), Body=COALESCE(?,Body), Status=COALESCE(?,Status), UpdatedAt=datetime('now') WHERE Id=?`).run(title, body, status, id);
    return db.prepare(`SELECT * FROM Questions WHERE Id=?`).get(id);
  }

  static delete(id) {
    const db = getDb();
    db.prepare(`DELETE FROM Questions WHERE Id=?`).run(id);
    return true;
  }

  static getViews(id, userId = null) {
    const db = getDb();
    const q = db.prepare(`SELECT Views FROM Questions WHERE Id=?`).get(id);
    if (!q) return null;

    if (userId) {
      const existingView = db.prepare(`SELECT Id FROM QuestionViews WHERE QuestionId=? AND UserId=?`).get(id, userId);
      if (!existingView) {
        db.prepare(`INSERT INTO QuestionViews (QuestionId, UserId) VALUES (?, ?)`).run(id, userId);
        db.prepare(`UPDATE Questions SET Views=Views+1 WHERE Id=?`).run(id);
        const updated = db.prepare(`SELECT Views FROM Questions WHERE Id=?`).get(id);
        return { views: updated.Views, isNewView: true, userId };
      } else {
        return { views: q.Views, isNewView: false, userId };
      }
    }

    return { views: q.Views, isNewView: null, message: "Provide userId query param to track unique views" };
  }

  static getViewers(id) {
    const db = getDb();
    const viewers = db
      .prepare(`SELECT u.Id, u.Username, u.DisplayName, u.Avatar, u.Reputation, qv.ViewedAt FROM QuestionViews qv JOIN Users u ON qv.UserId=u.Id WHERE qv.QuestionId=? ORDER BY qv.ViewedAt DESC`)
      .all(id);

    const viewCount = db.prepare(`SELECT Views FROM Questions WHERE Id=?`).get(id);
    return {
      totalViews: viewCount.Views,
      uniqueViewers: viewers.length,
      viewers: viewers.map((v) => ({
        userId: v.Id,
        username: v.Username,
        displayName: v.DisplayName,
        avatar: v.Avatar,
        reputation: v.Reputation,
        viewedAt: v.ViewedAt,
      })),
    };
  }

  static getReplies(id, sort = "votes", order = "DESC") {
    const db = getDb();
    const sortCol = sort === "created" ? "a.CreatedAt" : "a.Votes";
    const rows = db
      .prepare(`SELECT a.*, u.Username, u.DisplayName, u.Avatar, u.Reputation FROM Answers a JOIN Users u ON a.UserId=u.Id WHERE a.QuestionId=? ORDER BY a.IsAccepted DESC, ${sortCol} ${order?.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
      .all(id);

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

    return {
      count: rows.length,
      replies: rows.map((a) => ({
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
      })),
    };
  }
}
