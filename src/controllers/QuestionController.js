/**
 * Questions Controller - handles question-related requests
 */

import { QuestionModel } from "../models/QuestionModel.js";
import { ok, created, notFound, serverError, badRequest } from "../utils/responseHandler.js";
import { paginate } from "../utils/pagination.js";

export class QuestionController {
  static getAll(req, res) {
    try {
      const rows = QuestionModel.getAll(req.query);
      const qIds = rows.map((r) => r.Id);

      // Get media for questions
      let mediaMap = {};
      if (qIds.length > 0) {
        const { getDb } = await import("../../db.js");
        const db = getDb();
        for (const m of db.prepare(`SELECT * FROM Media WHERE QuestionId IN (${qIds.join(",")})`).all()) {
          if (!mediaMap[m.QuestionId]) mediaMap[m.QuestionId] = [];
          mediaMap[m.QuestionId].push(m);
        }
      }

      const mapped = rows.map((r) => ({
        id: r.Id,
        title: r.Title,
        body: r.Body,
        userId: r.UserId,
        votes: r.Votes,
        views: r.Views,
        answersCount: r.AnswersCount,
        acceptedAnswerId: r.AcceptedAnswerId,
        status: r.Status,
        isBounty: !!r.IsBounty,
        bountyAmount: r.BountyAmount,
        favorites: r.Favorites,
        isProtected: !!r.IsProtected,
        createdAt: r.CreatedAt,
        updatedAt: r.UpdatedAt,
        lastActivityAt: r.LastActivityAt,
        tags: r.TagNames ? r.TagNames.split(",") : [],
        media: mediaMap[r.Id] ?? [],
        user: { username: r.Username, displayName: r.DisplayName, avatar: r.Avatar, reputation: r.Reputation },
      }));

      const paged = paginate(mapped, parseInt(req.query.page) || 1, parseInt(req.query.limit) || 15);
      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.query.userId ? parseInt(req.query.userId) : null;

      const result = QuestionModel.getById(id, userId);
      if (!result) return notFound(res, "Question not found");

      const q = result.question;
      const { getDb } = await import("../../db.js");
      const db = getDb();

      const media = db.prepare(`SELECT * FROM Media WHERE QuestionId=?`).all(id);
      const comments = db.prepare(`SELECT c.*, u.Username, u.DisplayName, u.Avatar FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.QuestionId=? ORDER BY c.CreatedAt`).all(id);
      const linked = db
        .prepare(`SELECT lq.LinkedQuestionId, q2.Title, q2.Votes, q2.AnswersCount FROM LinkedQuestions lq JOIN Questions q2 ON lq.LinkedQuestionId=q2.Id WHERE lq.QuestionId=?`)
        .all(id);

      return ok(res, {
        id: q.Id,
        title: q.Title,
        body: q.Body,
        userId: q.UserId,
        votes: q.Votes,
        views: q.Views,
        answersCount: q.AnswersCount,
        acceptedAnswerId: q.AcceptedAnswerId,
        status: q.Status,
        isBounty: !!q.IsBounty,
        bountyAmount: q.BountyAmount,
        favorites: q.Favorites,
        isProtected: !!q.IsProtected,
        createdAt: q.CreatedAt,
        updatedAt: q.UpdatedAt,
        lastActivityAt: q.LastActivityAt,
        tags: q.TagNames ? q.TagNames.split(",") : [],
        media,
        comments,
        linkedQuestions: linked,
        user: { username: q.Username, displayName: q.DisplayName, avatar: q.Avatar, reputation: q.Reputation, bio: q.UserBio },
        viewTrackingInfo: { isNewView: result.isNewView, userId: result.userId },
      });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static create(req, res) {
    try {
      const { title, body, userId, tags = [], isBounty = false, bountyAmount = 0 } = req.body;
      if (!title || !body || !userId) return badRequest(res, "title, body, userId required");

      const result = QuestionModel.create(title, body, userId, tags, isBounty, bountyAmount);
      return created(res, result);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static update(req, res) {
    try {
      const { title, body, status } = req.body;
      const updated = QuestionModel.update(parseInt(req.params.id), title, body, status);

      if (!updated) return notFound(res);
      return ok(res, updated);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static delete(req, res) {
    try {
      QuestionModel.delete(parseInt(req.params.id));
      res.status(204).send();
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getViews(req, res) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.query.userId ? parseInt(req.query.userId) : null;

      const result = QuestionModel.getViews(id, userId);
      if (!result) return notFound(res, "Question not found");

      return ok(res, result);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getViewers(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { getDb } = await import("../../db.js");
      const db = getDb();

      const q = db.prepare(`SELECT Id FROM Questions WHERE Id=?`).get(id);
      if (!q) return notFound(res, "Question not found");

      const result = QuestionModel.getViewers(id);
      return ok(res, { questionId: id, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getReplies(req, res) {
    try {
      const qId = parseInt(req.params.id);
      const { sort = "votes", order = "DESC" } = req.query;

      const { getDb } = await import("../../db.js");
      const db = getDb();

      const q = db.prepare(`SELECT Id FROM Questions WHERE Id=?`).get(qId);
      if (!q) return notFound(res, "Question not found");

      const result = QuestionModel.getReplies(qId, sort, order);
      return ok(res, { questionId: qId, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }
}
