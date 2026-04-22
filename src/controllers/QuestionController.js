import { QuestionModel } from "../models/QuestionModel.js";
import {
  executeQueryRows,
  executeQuerySingle,
} from "../../db.js";
import {
  ok,
  created,
  notFound,
  serverError,
  badRequest,
} from "../utils/responseHandler.js";
import { paginate } from "../utils/pagination.js";

const QUESTION_TABLE = "[discussion_forum_Questions]";
const MEDIA_TABLE = "[discussion_forum_Media]";
const COMMENT_TABLE = "[discussion_forum_Comments]";
const USER_TABLE = "[discussion_forum_Users]";
const LINKED_QUESTION_TABLE = "[discussion_forum_LinkedQuestions]";

const buildInClause = (values, prefix) => {
  const params = {};
  const placeholders = values.map((value, index) => {
    const key = `${prefix}${index}`;
    params[key] = value;
    return `@${key}`;
  });

  return { clause: placeholders.join(", "), params };
};

export class QuestionController {
  static async getAll(req, res) {
    try {
      const rows = await QuestionModel.getAll(req.query);
      const qIds = rows.map((row) => row.Id);
      let mediaMap = {};

      if (qIds.length > 0) {
        const inClause = buildInClause(qIds, "questionId");
        const mediaRows = await executeQueryRows(
          `SELECT * FROM ${MEDIA_TABLE} WHERE QuestionId IN (${inClause.clause})`,
          inClause.params
        );

        mediaMap = mediaRows.reduce((accumulator, media) => {
          if (!accumulator[media.QuestionId]) {
            accumulator[media.QuestionId] = [];
          }

          accumulator[media.QuestionId].push(media);
          return accumulator;
        }, {});
      }

      const mapped = rows.map((row) => ({
        id: row.Id,
        title: row.Title,
        body: row.Body,
        userId: row.UserId,
        votes: row.Votes,
        views: row.Views,
        answersCount: row.AnswersCount,
        acceptedAnswerId: row.AcceptedAnswerId,
        status: row.Status,
        isBounty: !!row.IsBounty,
        bountyAmount: row.BountyAmount,
        favorites: row.Favorites,
        isProtected: !!row.IsProtected,
        createdAt: row.CreatedAt,
        updatedAt: row.UpdatedAt,
        lastActivityAt: row.LastActivityAt,
        tags: row.TagNames ? row.TagNames.split(",") : [],
        media: mediaMap[row.Id] ?? [],
        user: {
          username: row.Username,
          displayName: row.DisplayName,
          avatar: row.Avatar,
          reputation: row.Reputation,
        },
      }));

      const paged = paginate(
        mapped,
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
      const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;
      const result = await QuestionModel.getById(id, userId);

      if (!result) {
        return notFound(res, "Question not found");
      }

      const media = await executeQueryRows(
        `SELECT * FROM ${MEDIA_TABLE} WHERE QuestionId = @id`,
        { id }
      );
      const comments = await executeQueryRows(
        `
        SELECT
          c.*,
          u.Username,
          u.DisplayName,
          u.Avatar
        FROM ${COMMENT_TABLE} c
        JOIN ${USER_TABLE} u ON c.UserId = u.Id
        WHERE c.QuestionId = @id
        ORDER BY c.CreatedAt
        `,
        { id }
      );
      const linked = await executeQueryRows(
        `
        SELECT
          lq.LinkedQuestionId,
          q2.Title,
          q2.Votes,
          q2.AnswersCount
        FROM ${LINKED_QUESTION_TABLE} lq
        JOIN ${QUESTION_TABLE} q2 ON lq.LinkedQuestionId = q2.Id
        WHERE lq.QuestionId = @id
        `,
        { id }
      );

      const question = result.question;

      return ok(res, {
        id: question.Id,
        title: question.Title,
        body: question.Body,
        userId: question.UserId,
        votes: question.Votes,
        views: question.Views,
        answersCount: question.AnswersCount,
        acceptedAnswerId: question.AcceptedAnswerId,
        status: question.Status,
        isBounty: !!question.IsBounty,
        bountyAmount: question.BountyAmount,
        favorites: question.Favorites,
        isProtected: !!question.IsProtected,
        createdAt: question.CreatedAt,
        updatedAt: question.UpdatedAt,
        lastActivityAt: question.LastActivityAt,
        tags: question.TagNames ? question.TagNames.split(",") : [],
        media,
        comments,
        linkedQuestions: linked,
        user: {
          username: question.Username,
          displayName: question.DisplayName,
          avatar: question.Avatar,
          reputation: question.Reputation,
          bio: question.UserBio,
        },
        viewTrackingInfo: {
          isNewView: result.isNewView,
          userId: result.userId,
        },
      });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const {
        title,
        body,
        userId,
        tags = [],
        isBounty = false,
        bountyAmount = 0,
      } = req.body;

      if (!title || !body || !userId) {
        return badRequest(res, "title, body, userId required");
      }

      const result = await QuestionModel.create(
        title,
        body,
        userId,
        tags,
        isBounty,
        bountyAmount
      );

      return created(res, result);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async update(req, res) {
    try {
      const { title, body, status } = req.body;
      const updated = await QuestionModel.update(
        parseInt(req.params.id, 10),
        title,
        body,
        status
      );

      if (!updated) {
        return notFound(res);
      }

      return ok(res, updated);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await QuestionModel.delete(parseInt(req.params.id, 10));

      if (!deleted) {
        return notFound(res);
      }

      res.status(204).send();
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async getViews(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;
      const result = await QuestionModel.getViews(id, userId);

      if (!result) {
        return notFound(res, "Question not found");
      }

      return ok(res, result);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async getViewers(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const question = await executeQuerySingle(
        `SELECT Id FROM ${QUESTION_TABLE} WHERE Id = @id`,
        { id }
      );

      if (!question) {
        return notFound(res, "Question not found");
      }

      const result = await QuestionModel.getViewers(id);
      return ok(res, { questionId: id, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async getReplies(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { sort = "votes", order = "DESC" } = req.query;
      const question = await executeQuerySingle(
        `SELECT Id FROM ${QUESTION_TABLE} WHERE Id = @id`,
        { id }
      );

      if (!question) {
        return notFound(res, "Question not found");
      }

      const result = await QuestionModel.getReplies(id, sort, order);
      return ok(res, { questionId: id, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }
}
