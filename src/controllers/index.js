import {
  executeNonQuery,
  executeQuery,
  executeQueryRows,
  executeQuerySingle,
} from "../../db.js";
import {
  ok,
  created,
  notFound,
  serverError,
  badRequest,
  conflict,
} from "../utils/responseHandler.js";
import { paginate } from "../utils/pagination.js";
import { UserModel, TagModel, SearchModel, StatsModel } from "../models/index.js";

const QUESTION_TABLE = "[discussion_forum_Questions]";
const ANSWER_TABLE = "[discussion_forum_Answers]";
const COMMENT_TABLE = "[discussion_forum_Comments]";
const VOTE_TABLE = "[discussion_forum_Votes]";
const BOOKMARK_TABLE = "[discussion_forum_Bookmarks]";
const MEDIA_TABLE = "[discussion_forum_Media]";
const NOTIFICATION_TABLE = "[discussion_forum_Notifications]";

export class VoteController {
  static async cast(req, res) {
    try {
      const { userId, targetType, targetId, value } = req.body;

      if (!userId || !targetType || !targetId || ![1, -1].includes(value)) {
        return badRequest(
          res,
          "userId, targetType, targetId, and value (1 or -1) required"
        );
      }

      const tableMap = {
        question: QUESTION_TABLE,
        answer: ANSWER_TABLE,
        comment: COMMENT_TABLE,
      };
      const table = tableMap[targetType];

      if (!table) {
        return badRequest(res, "targetType must be question, answer, or comment");
      }

      try {
        const result = await executeQuery(
          `
          INSERT INTO ${VOTE_TABLE} (UserId, TargetType, TargetId, Value)
          OUTPUT INSERTED.Id
          VALUES (@userId, @targetType, @targetId, @value)
          `,
          { userId, targetType, targetId, value }
        );
        const total = await executeQuerySingle(
          `
          SELECT COALESCE(SUM(Value), 0) AS Total
          FROM ${VOTE_TABLE}
          WHERE TargetType = @targetType AND TargetId = @targetId
          `,
          { targetType, targetId }
        );

        await executeNonQuery(
          `UPDATE ${table} SET Votes = @votes WHERE Id = @targetId`,
          { votes: total?.Total ?? 0, targetId }
        );

        return created(res, {
          voteId: result.recordset[0].Id,
          userId,
          targetType,
          targetId,
          value,
        });
      } catch (err) {
        if (
          err.number === 2627 ||
          err.number === 2601 ||
          err.message.includes("UNIQUE") ||
          err.message.includes("duplicate key")
        ) {
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
  static async get(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const bookmarks = await executeQueryRows(
        `
        SELECT
          b.*,
          q.Title,
          q.Votes,
          q.AnswersCount,
          q.[Status]
        FROM ${BOOKMARK_TABLE} b
        JOIN ${QUESTION_TABLE} q ON b.QuestionId = q.Id
        WHERE b.UserId = @userId
        ORDER BY b.CreatedAt DESC
        `,
        { userId }
      );

      return ok(res, bookmarks);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async add(req, res) {
    try {
      const { userId, questionId } = req.body;

      try {
        await executeNonQuery(
          `INSERT INTO ${BOOKMARK_TABLE} (UserId, QuestionId) VALUES (@userId, @questionId)`,
          { userId, questionId }
        );
        await executeNonQuery(
          `UPDATE ${QUESTION_TABLE} SET Favorites = Favorites + 1 WHERE Id = @questionId`,
          { questionId }
        );

        return created(res, { userId, questionId });
      } catch (err) {
        if (
          err.number === 2627 ||
          err.number === 2601 ||
          err.message.includes("UNIQUE") ||
          err.message.includes("duplicate key")
        ) {
          return conflict(res, "Already bookmarked");
        }

        throw err;
      }
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async remove(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const questionId = parseInt(req.params.questionId, 10);

      await executeNonQuery(
        `DELETE FROM ${BOOKMARK_TABLE} WHERE UserId = @userId AND QuestionId = @questionId`,
        { userId, questionId }
      );
      await executeNonQuery(
        `
        UPDATE ${QUESTION_TABLE}
        SET Favorites = CASE WHEN Favorites > 0 THEN Favorites - 1 ELSE 0 END
        WHERE Id = @questionId
        `,
        { questionId }
      );

      res.status(204).send();
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class MediaController {
  static async upload(req, res) {
    try {
      const {
        questionId,
        answerId,
        type,
        url,
        thumbnail,
        altText,
        width,
        height,
        duration,
        platform,
      } = req.body;

      const result = await executeQuery(
        `
        INSERT INTO ${MEDIA_TABLE}
          (QuestionId, AnswerId, Type, Url, Thumbnail, AltText, Width, Height, Duration, Platform)
        OUTPUT INSERTED.*
        VALUES
          (@questionId, @answerId, @type, @url, @thumbnail, @altText, @width, @height, @duration, @platform)
        `,
        {
          questionId: questionId ?? null,
          answerId: answerId ?? null,
          type,
          url,
          thumbnail: thumbnail ?? "",
          altText: altText ?? "",
          width: width ?? null,
          height: height ?? null,
          duration: duration ?? null,
          platform: platform ?? null,
        }
      );

      return created(res, result.recordset[0]);
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class SearchController {
  static async search(req, res) {
    try {
      const { q, page = 1, limit = 15 } = req.query;

      if (!q) {
        const suggestions = await SearchModel.search("");
        return ok(res, suggestions);
      }

      const rows = await SearchModel.search(q);
      const paged = paginate(
        rows.map((row) => ({ ...row, tags: row.TN ? row.TN.split(",") : [] })),
        parseInt(page, 10),
        parseInt(limit, 10)
      );

      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserModel.getAll(req.query);
      const paged = paginate(
        users,
        parseInt(req.query.page, 10) || 1,
        parseInt(req.query.limit, 10) || 15
      );

      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await UserModel.getById(id);

      if (!user) {
        return notFound(res);
      }

      return ok(res, user);
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class TagController {
  static async getAll(req, res) {
    try {
      const tags = await TagModel.getAll(req.query.q);
      const paged = paginate(tags, 1, 50);
      return res.json({ ...paged, timestamp: new Date().toISOString() });
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class NotificationController {
  static async get(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const notifications = await executeQueryRows(
        `
        SELECT *
        FROM ${NOTIFICATION_TABLE}
        WHERE UserId = @userId
        ORDER BY CreatedAt DESC
        `,
        { userId }
      );

      return ok(res, notifications);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async markAsRead(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      await executeNonQuery(
        `UPDATE ${NOTIFICATION_TABLE} SET IsRead = 1 WHERE Id = @id`,
        { id }
      );

      return ok(res, { message: "Read" });
    } catch (err) {
      return serverError(res, err);
    }
  }
}

export class StatsController {
  static async getStats(req, res) {
    try {
      const stats = await StatsModel.getStats();
      return ok(res, stats);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async healthCheck(req, res) {
    try {
      const health = await StatsModel.healthCheck();
      return res.json(health);
    } catch (err) {
      return res.status(503).json({ status: "unhealthy", error: err.message });
    }
  }
}
