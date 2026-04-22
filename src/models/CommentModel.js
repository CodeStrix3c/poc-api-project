import {
  executeQuery,
  executeQueryRows,
  executeQuerySingle,
} from "../../db.js";

const COMMENT_TABLE = "[discussion_forum_Comments]";
const USER_TABLE = "[discussion_forum_Users]";

const mapComment = (comment) => ({
  id: comment.Id,
  userId: comment.UserId,
  questionId: comment.QuestionId,
  answerId: comment.AnswerId,
  body: comment.Body,
  votes: comment.Votes,
  createdAt: comment.CreatedAt,
  updatedAt: comment.UpdatedAt,
  user: {
    username: comment.Username,
    displayName: comment.DisplayName,
    avatar: comment.Avatar,
    reputation: comment.Reputation,
  },
});

export class CommentModel {
  static async getById(id) {
    const comment = await executeQuerySingle(
      `
      SELECT
        c.*,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation
      FROM ${COMMENT_TABLE} c
      JOIN ${USER_TABLE} u ON c.UserId = u.Id
      WHERE c.Id = @id
      `,
      { id }
    );

    return comment ? mapComment(comment) : null;
  }

  static async getByQuestionId(questionId) {
    const comments = await executeQueryRows(
      `
      SELECT
        c.*,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation
      FROM ${COMMENT_TABLE} c
      JOIN ${USER_TABLE} u ON c.UserId = u.Id
      WHERE c.QuestionId = @questionId
      ORDER BY c.CreatedAt DESC
      `,
      { questionId }
    );

    return {
      count: comments.length,
      comments: comments.map(mapComment),
    };
  }

  static async getByAnswerId(answerId) {
    const comments = await executeQueryRows(
      `
      SELECT
        c.*,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation
      FROM ${COMMENT_TABLE} c
      JOIN ${USER_TABLE} u ON c.UserId = u.Id
      WHERE c.AnswerId = @answerId
      ORDER BY c.CreatedAt DESC
      `,
      { answerId }
    );

    return {
      count: comments.length,
      comments: comments.map(mapComment),
    };
  }

  static async create(userId, questionId, answerId, body) {
    const result = await executeQuery(
      `
      INSERT INTO ${COMMENT_TABLE} (UserId, QuestionId, AnswerId, Body)
      OUTPUT INSERTED.*
      VALUES (@userId, @questionId, @answerId, @body)
      `,
      {
        userId,
        questionId: questionId ?? null,
        answerId: answerId ?? null,
        body,
      }
    );

    return result.recordset[0];
  }
}
