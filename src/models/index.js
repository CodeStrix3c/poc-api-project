/**
 * User Model - handles user-related database operations
 */

import { getDb } from "../../db.js";

export class UserModel {
  static getAll(filters = {}) {
    const db = getDb();
    const { page = 1, limit = 15, sort = "reputation" } = filters;
    const sortMap = { reputation: "Reputation DESC", joined: "JoinedAt DESC", name: "DisplayName ASC" };
    const sortCol = sortMap[sort] ?? "Reputation DESC";

    return db.prepare(`SELECT * FROM Users ORDER BY ${sortCol}`).all();
  }

  static getById(id) {
    const db = getDb();
    return db.prepare(`SELECT * FROM Users WHERE Id=?`).get(id);
  }
}

/**
 * Tag Model - handles tag-related database operations
 */

export class TagModel {
  static getAll(search = "") {
    const db = getDb();
    if (!search) {
      return db.prepare(`SELECT * FROM Tags ORDER BY QuestionsCount DESC`).all();
    }
    return db.prepare(`SELECT * FROM Tags WHERE Name LIKE ? ORDER BY QuestionsCount DESC`).all(`%${search}%`);
  }

  static getById(id) {
    const db = getDb();
    return db.prepare(`SELECT * FROM Tags WHERE Id=?`).get(id);
  }
}

/**
 * Search Model - handles search operations
 */

export class SearchModel {
  static search(query, page = 1, limit = 15) {
    const db = getDb();
    if (!query) {
      return db.prepare(`SELECT Term FROM SearchSuggestions ORDER BY Weight DESC`).all();
    }
    return db
      .prepare(
        `SELECT q.Id, q.Title, q.Votes, q.AnswersCount, q.Views, q.Status, q.CreatedAt, u.DisplayName, u.Avatar, GROUP_CONCAT(DISTINCT t.Name) AS TN FROM Questions q JOIN Users u ON q.UserId=u.Id LEFT JOIN QuestionTags qt ON qt.QuestionId=q.Id LEFT JOIN Tags t ON qt.TagId=t.Id WHERE q.Title LIKE @s OR q.Body LIKE @s GROUP BY q.Id ORDER BY q.Votes DESC`
      )
      .all({ s: `%${query}%` });
  }
}

/**
 * Stats Model - handles statistics
 */

export class StatsModel {
  static getStats() {
    const db = getDb();
    return db
      .prepare(
        `SELECT (SELECT COUNT(*) FROM Questions) AS totalQuestions, (SELECT COUNT(*) FROM Answers) AS totalAnswers, (SELECT COUNT(*) FROM Users) AS totalUsers, (SELECT COUNT(*) FROM Tags) AS totalTags, (SELECT COUNT(*) FROM Comments) AS totalComments, (SELECT COUNT(*) FROM Users WHERE IsOnline=1) AS activeUsers`
      )
      .get();
  }

  static healthCheck() {
    const db = getDb();
    try {
      db.prepare("SELECT 1").get();
      return { status: "healthy", db: "SQLite (forum.db)" };
    } catch (err) {
      throw err;
    }
  }
}
