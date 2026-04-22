import {
  executeQueryRows,
  executeQuerySingle,
} from "../../db.js";

const USER_TABLE = "[discussion_forum_Users]";
const TAG_TABLE = "[discussion_forum_Tags]";
const QUESTION_TABLE = "[discussion_forum_Questions]";
const QUESTION_TAG_TABLE = "[discussion_forum_QuestionTags]";
const ANSWER_TABLE = "[discussion_forum_Answers]";
const COMMENT_TABLE = "[discussion_forum_Comments]";
const SEARCH_SUGGESTION_TABLE = "[discussion_forum_SearchSuggestions]";

export class UserModel {
  static async getAll(filters = {}) {
    const { sort = "reputation" } = filters;
    const sortMap = {
      reputation: "Reputation DESC",
      joined: "JoinedAt DESC",
      name: "DisplayName ASC",
    };
    const sortCol = sortMap[sort] ?? "Reputation DESC";

    return executeQueryRows(`SELECT * FROM ${USER_TABLE} ORDER BY ${sortCol}`);
  }

  static async getById(id) {
    return executeQuerySingle(`SELECT * FROM ${USER_TABLE} WHERE Id = @id`, { id });
  }
}

export class TagModel {
  static async getAll(search = "") {
    if (!search) {
      return executeQueryRows(
        `SELECT * FROM ${TAG_TABLE} ORDER BY QuestionsCount DESC`
      );
    }

    return executeQueryRows(
      `SELECT * FROM ${TAG_TABLE} WHERE Name LIKE @search ORDER BY QuestionsCount DESC`,
      { search: `%${search}%` }
    );
  }

  static async getById(id) {
    return executeQuerySingle(`SELECT * FROM ${TAG_TABLE} WHERE Id = @id`, { id });
  }
}

export class SearchModel {
  static async search(query) {
    if (!query) {
      return executeQueryRows(
        `SELECT Term FROM ${SEARCH_SUGGESTION_TABLE} ORDER BY Weight DESC`
      );
    }

    return executeQueryRows(
      `
      SELECT
        q.Id,
        q.Title,
        q.Votes,
        q.AnswersCount,
        q.Views,
        q.[Status],
        q.CreatedAt,
        u.DisplayName,
        u.Avatar,
        taglist.TagNames AS TN
      FROM ${QUESTION_TABLE} q
      JOIN ${USER_TABLE} u ON q.UserId = u.Id
      OUTER APPLY (
        SELECT STRING_AGG(t.Name, ',') AS TagNames
        FROM ${QUESTION_TAG_TABLE} qt
        JOIN ${TAG_TABLE} t ON qt.TagId = t.Id
        WHERE qt.QuestionId = q.Id
      ) taglist
      WHERE q.Title LIKE @search OR q.Body LIKE @search
      ORDER BY q.Votes DESC
      `,
      { search: `%${query}%` }
    );
  }
}

export class StatsModel {
  static async getStats() {
    return executeQuerySingle(
      `
      SELECT
        (SELECT COUNT(*) FROM ${QUESTION_TABLE}) AS totalQuestions,
        (SELECT COUNT(*) FROM ${ANSWER_TABLE}) AS totalAnswers,
        (SELECT COUNT(*) FROM ${USER_TABLE}) AS totalUsers,
        (SELECT COUNT(*) FROM ${TAG_TABLE}) AS totalTags,
        (SELECT COUNT(*) FROM ${COMMENT_TABLE}) AS totalComments,
        (SELECT COUNT(*) FROM ${USER_TABLE} WHERE IsOnline = 1) AS activeUsers
      `
    );
  }

  static async healthCheck() {
    await executeQuerySingle("SELECT 1 AS ok");
    return { status: "healthy", db: "SQL Server" };
  }
}
