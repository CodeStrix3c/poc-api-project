import {
  executeNonQuery,
  executeQuery,
  executeQueryRows,
  executeQuerySingle,
} from "../../db.js";

const ANSWER_TABLE = "[discussion_forum_Answers]";
const QUESTION_TABLE = "[discussion_forum_Questions]";
const USER_TABLE = "[discussion_forum_Users]";
const COMMENT_TABLE = "[discussion_forum_Comments]";
const MEDIA_TABLE = "[discussion_forum_Media]";

const buildInClause = (values, prefix) => {
  const params = {};
  const placeholders = values.map((value, index) => {
    const key = `${prefix}${index}`;
    params[key] = value;
    return `@${key}`;
  });

  return { clause: placeholders.join(", "), params };
};

export class AnswerModel {
  static async getByQuestionId(questionId, sort = "votes", order = "DESC") {
    const sortCol = sort === "created" ? "a.CreatedAt" : "a.Votes";
    const sortDir = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const rows = await executeQueryRows(
      `
      SELECT
        a.*,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation
      FROM ${ANSWER_TABLE} a
      JOIN ${USER_TABLE} u ON a.UserId = u.Id
      WHERE a.QuestionId = @questionId
      ORDER BY a.IsAccepted DESC, ${sortCol} ${sortDir}
      `,
      { questionId }
    );

    if (rows.length === 0) {
      return [];
    }

    const answerIds = rows.map((row) => row.Id);
    const commentParams = buildInClause(answerIds, "answerId");
    const comments = await executeQueryRows(
      `
      SELECT
        c.*,
        u.Username,
        u.DisplayName,
        u.Avatar
      FROM ${COMMENT_TABLE} c
      JOIN ${USER_TABLE} u ON c.UserId = u.Id
      WHERE c.AnswerId IN (${commentParams.clause})
      ORDER BY c.CreatedAt
      `,
      commentParams.params
    );
    const media = await executeQueryRows(
      `SELECT * FROM ${MEDIA_TABLE} WHERE AnswerId IN (${commentParams.clause})`,
      commentParams.params
    );

    const commentMap = {};
    const mediaMap = {};

    for (const comment of comments) {
      if (!commentMap[comment.AnswerId]) {
        commentMap[comment.AnswerId] = [];
      }

      commentMap[comment.AnswerId].push(comment);
    }

    for (const item of media) {
      if (!mediaMap[item.AnswerId]) {
        mediaMap[item.AnswerId] = [];
      }

      mediaMap[item.AnswerId].push(item);
    }

    return rows.map((answer) => ({
      id: answer.Id,
      questionId: answer.QuestionId,
      userId: answer.UserId,
      body: answer.Body,
      votes: answer.Votes,
      isAccepted: !!answer.IsAccepted,
      createdAt: answer.CreatedAt,
      updatedAt: answer.UpdatedAt,
      comments: commentMap[answer.Id] ?? [],
      media: mediaMap[answer.Id] ?? [],
      user: {
        username: answer.Username,
        displayName: answer.DisplayName,
        avatar: answer.Avatar,
        reputation: answer.Reputation,
      },
    }));
  }

  static async getById(id) {
    return executeQuerySingle(`SELECT * FROM ${ANSWER_TABLE} WHERE Id = @id`, { id });
  }

  static async create(questionId, userId, body) {
    const result = await executeQuery(
      `
      INSERT INTO ${ANSWER_TABLE} (QuestionId, UserId, Body)
      OUTPUT INSERTED.*
      VALUES (@questionId, @userId, @body)
      `,
      { questionId, userId, body }
    );

    await executeNonQuery(
      `
      UPDATE ${QUESTION_TABLE}
      SET AnswersCount = AnswersCount + 1, LastActivityAt = GETUTCDATE()
      WHERE Id = @questionId
      `,
      { questionId }
    );

    return result.recordset[0];
  }

  static async accept(answerId) {
    const answer = await executeQuerySingle(
      `SELECT * FROM ${ANSWER_TABLE} WHERE Id = @answerId`,
      { answerId }
    );

    if (!answer) {
      return null;
    }

    await executeNonQuery(
      `UPDATE ${ANSWER_TABLE} SET IsAccepted = 0 WHERE QuestionId = @questionId`,
      { questionId: answer.QuestionId }
    );
    await executeNonQuery(
      `UPDATE ${ANSWER_TABLE} SET IsAccepted = 1 WHERE Id = @answerId`,
      { answerId }
    );
    await executeNonQuery(
      `UPDATE ${QUESTION_TABLE} SET AcceptedAnswerId = @answerId, [Status] = 'answered' WHERE Id = @questionId`,
      { answerId, questionId: answer.QuestionId }
    );

    return { message: "Accepted", answerId };
  }
}
