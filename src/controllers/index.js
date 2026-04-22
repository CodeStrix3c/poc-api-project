/**
 * Other Controllers - for votes, bookmarks, media, search, stats
 */

import { ok, created, notFound, serverError, badRequest, conflict } from "../utils/responseHandler.js";
import { paginate } from "../utils/pagination.js";
import { getDb } from "../../db.js";
import { UserModel, TagModel, SearchModel, StatsModel } from "../models/index.js";

export class VoteController {
  static cast(req, res) {
    try {
      const db = getDb();
      const { userId, targetType, targetId, value } = req.body;

      if (!userId || !targetType || !targetId || ![1, -1].includes(value)) {
        return badRequest(res, "userId, targetType, targetId, and value (1 or -1) required");
      }

      try {
        const table = targetType === "question" ? "Questions" : targetType === "answer" ? "Answers" : "Comments";
        const info = db.prepare(`INSERT INTO Votes (UserId,TargetType,TargetId,Value) VALUES (?,?,?,?)`).run(userId, targetType, targetId, value);
        db.prepare(`UPDATE ${table} SET Votes=Votes+? WHERE Id=?`).run(value, targetId);
        return created(res, { voteId: info.lastInsertRowid, userId, targetType, targetId, value });
      } catch (err) {
        if (err.message.includes("UNIQUE")) {
          return conflict(res, "Already voted");
        }
        throw err;
      }
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class BookmarkController {
  static get(req, res) {
    try {
      const db = getDb();
      const userId = parseInt(req.params.userId);
      const bookmarks = db
        .prepare(`SELECT b.*, q.Title, q.Votes, q.AnswersCount, q.Status FROM Bookmarks b JOIN Questions q ON b.QuestionId=q.Id WHERE b.UserId=? ORDER BY b.CreatedAt DESC`)
        .all(userId);
      return ok(res, bookmarks);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static add(req, res) {
    try {
      const db = getDb();
      const { userId, questionId } = req.body;

      try {
        db.prepare(`INSERT INTO Bookmarks (UserId,QuestionId) VALUES (?,?)`).run(userId, questionId);
        db.prepare(`UPDATE Questions SET Favorites=Favorites+1 WHERE Id=?`).run(questionId);
        return created(res, { userId, questionId });
      } catch (err) {
        if (err.message.includes("UNIQUE")) {
          return conflict(res, "Already bookmarked");
        }
        throw err;
      }
    } catch (err) {
      return serverError(res, err);
    }
  }

  static remove(req, res) {
    try {
      const db = getDb();
      const uid = parseInt(req.params.userId);
      const qid = parseInt(req.params.questionId);

      db.prepare(`DELETE FROM Bookmarks WHERE UserId=? AND QuestionId=?`).run(uid, qid);
      db.prepare(`UPDATE Questions SET Favorites=MAX(Favorites-1,0) WHERE Id=?`).run(qid);
      res.status(204).send();
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class MediaController {
  static upload(req, res) {
    try {
      const db = getDb();
      const { questionId, answerId, type, url, thumbnail, altText, width, height, duration, platform } = req.body;

      const info = db
        .prepare(
          `INSERT INTO Media (QuestionId,AnswerId,Type,Url,Thumbnail,AltText,Width,Height,Duration,Platform) VALUES (?,?,?,?,?,?,?,?,?,?)`
        )
        .run(questionId ?? null, answerId ?? null, type, url, thumbnail ?? "", altText ?? "", width ?? null, height ?? null, duration ?? null, platform ?? null);

      const media = db.prepare(`SELECT * FROM Media WHERE Id=?`).get(info.lastInsertRowid);
      return created(res, media);
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class SearchController {
  static search(req, res) {
    try {
      const db = getDb();
      const { q, page = 1, limit = 15 } = req.query;

      if (!q) {
        const suggestions = SearchModel.search("");
        return ok(res, suggestions);
      }

      const rows = SearchModel.search(q);
      const paged = paginate(
        rows.map((r) => ({ ...r, tags: r.TN ? r.TN.split(",") : [] })),
        parseInt(page),
        parseInt(limit)
      );
      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class UserController {
  static getAll(req, res) {
    try {
      const users = UserModel.getAll(req.query);
      const paged = paginate(users, parseInt(req.query.page) || 1, parseInt(req.query.limit) || 15);
      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = UserModel.getById(id);

      if (!user) return notFound(res);
      return ok(res, user);
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class TagController {
  static getAll(req, res) {
    try {
      const tags = TagModel.getAll(req.query.q);
      const paged = paginate(tags, 1, 50);
      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class NotificationController {
  static get(req, res) {
    try {
      const db = getDb();
      const userId = parseInt(req.params.userId);
      const notifications = db.prepare(`SELECT * FROM Notifications WHERE UserId=? ORDER BY CreatedAt DESC`).all(userId);
      return ok(res, notifications);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static markAsRead(req, res) {
    try {
      const db = getDb();
      const id = parseInt(req.params.id);
      db.prepare(`UPDATE Notifications SET IsRead=1 WHERE Id=?`).run(id);
      return ok(res, { message: "Read" });
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class StatsController {
  static getStats(req, res) {
    try {
      const stats = StatsModel.getStats();
      return ok(res, stats);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static healthCheck(req, res) {
    try {
      const health = StatsModel.healthCheck();
      return res.json(health);
    } catch (err) {
      return res.status(503).json({ status: "unhealthy", error: err.message });
    }
  }
}
