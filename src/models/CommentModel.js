/**
 * Comment Model - handles comment-related database operations
 */

import { getDb } from "../../db.js";

export class CommentModel {
  static getById(id) {
    const db = getDb();
    const comment = db.prepare(`SELECT c.*, u.Username, u.DisplayName, u.Avatar, u.Reputation FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.Id=?`).get(id);

    if (!comment) return null;

    return {
      id: comment.Id,
      userId: comment.UserId,
      questionId: comment.QuestionId,
      answerId: comment.AnswerId,
      body: comment.Body,
      votes: comment.Votes,
      createdAt: comment.CreatedAt,
      updatedAt: comment.UpdatedAt,
      user: { username: comment.Username, displayName: comment.DisplayName, avatar: comment.Avatar, reputation: comment.Reputation },
    };
  }

  static getByQuestionId(questionId) {
    const db = getDb();
    const comments = db.prepare(`SELECT c.*, u.Username, u.DisplayName, u.Avatar, u.Reputation FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.QuestionId=? ORDER BY c.CreatedAt DESC`).all(questionId);

    return {
      count: comments.length,
      comments: comments.map((c) => ({
        id: c.Id,
        userId: c.UserId,
        questionId: c.QuestionId,
        body: c.Body,
        votes: c.Votes,
        createdAt: c.CreatedAt,
        updatedAt: c.UpdatedAt,
        user: { username: c.Username, displayName: c.DisplayName, avatar: c.Avatar, reputation: c.Reputation },
      })),
    };
  }

  static getByAnswerId(answerId) {
    const db = getDb();
    const comments = db.prepare(`SELECT c.*, u.Username, u.DisplayName, u.Avatar, u.Reputation FROM Comments c JOIN Users u ON c.UserId=u.Id WHERE c.AnswerId=? ORDER BY c.CreatedAt DESC`).all(answerId);

    return {
      count: comments.length,
      comments: comments.map((c) => ({
        id: c.Id,
        userId: c.UserId,
        answerId: c.AnswerId,
        body: c.Body,
        votes: c.Votes,
        createdAt: c.CreatedAt,
        updatedAt: c.UpdatedAt,
        user: { username: c.Username, displayName: c.DisplayName, avatar: c.Avatar, reputation: c.Reputation },
      })),
    };
  }

  static create(userId, questionId, answerId, body) {
    const db = getDb();
    const info = db.prepare(`INSERT INTO Comments (UserId,QuestionId,AnswerId,Body) VALUES (?,?,?,?)`).run(userId, questionId ?? null, answerId ?? null, body);
    return db.prepare(`SELECT * FROM Comments WHERE Id=?`).get(info.lastInsertRowid);
  }
}
