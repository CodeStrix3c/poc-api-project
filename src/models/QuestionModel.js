import {
  executeNonQuery,
  executeQuery,
  executeQueryRows,
  executeQuerySingle,
} from "../../db.js";

const QUESTION_TABLE = "[discussion_forum_Questions]";
const USER_TABLE = "[discussion_forum_Users]";
const TAG_TABLE = "[discussion_forum_Tags]";
const QUESTION_TAG_TABLE = "[discussion_forum_QuestionTags]";
const QUESTION_VIEW_TABLE = "[discussion_forum_QuestionViews]";
const ANSWER_TABLE = "[discussion_forum_Answers]";
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

export class QuestionModel {
  static async getAll(filters = {}) {
    const { sort = "created", order = "DESC", status, tag, userId, isBounty, q } = filters;

    const sortMap = {
      votes: "q.Votes",
      views: "q.Views",
      created: "q.CreatedAt",
      activity: "q.LastActivityAt",
      answers: "q.AnswersCount",
    };

    const sortCol = sortMap[sort] ?? "q.CreatedAt";
    const sortDir = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const where = ["1 = 1"];
    const params = {};

    if (status) {
      where.push("q.[Status] = @status");
      params.status = status;
    }

    if (userId) {
      where.push("q.UserId = @userId");
      params.userId = parseInt(userId, 10);
    }

    if (isBounty) {
      where.push("q.IsBounty = @isBounty");
      params.isBounty = isBounty === "true" ? 1 : 0;
    }

    if (q) {
      where.push("(q.Title LIKE @search OR q.Body LIKE @search)");
      params.search = `%${q}%`;
    }

    if (tag) {
      where.push(`q.Id IN (
        SELECT qt.QuestionId
        FROM ${QUESTION_TAG_TABLE} qt
        JOIN ${TAG_TABLE} t ON qt.TagId = t.Id
        WHERE t.Name = @tag
      )`);
      params.tag = tag;
    }

    const query = `
      SELECT
        q.*,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation,
        taglist.TagNames
      FROM ${QUESTION_TABLE} q
      JOIN ${USER_TABLE} u ON q.UserId = u.Id
      OUTER APPLY (
        SELECT STRING_AGG(t.Name, ',') AS TagNames
        FROM ${QUESTION_TAG_TABLE} qt
        JOIN ${TAG_TABLE} t ON qt.TagId = t.Id
        WHERE qt.QuestionId = q.Id
      ) taglist
      WHERE ${where.join(" AND ")}
      ORDER BY ${sortCol} ${sortDir}
    `;

    return executeQueryRows(query, params);
  }

  static async getById(id, userId = null) {
    const question = await executeQuerySingle(
      `
      SELECT
        q.*,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation,
        u.Bio AS UserBio,
        taglist.TagNames
      FROM ${QUESTION_TABLE} q
      JOIN ${USER_TABLE} u ON q.UserId = u.Id
      OUTER APPLY (
        SELECT STRING_AGG(t.Name, ',') AS TagNames
        FROM ${QUESTION_TAG_TABLE} qt
        JOIN ${TAG_TABLE} t ON qt.TagId = t.Id
        WHERE qt.QuestionId = q.Id
      ) taglist
      WHERE q.Id = @id
      `,
      { id }
    );

    if (!question) {
      return null;
    }

    let isNewView = false;

    if (userId) {
      const existingView = await executeQuerySingle(
        `SELECT Id FROM ${QUESTION_VIEW_TABLE} WHERE QuestionId = @questionId AND UserId = @userId`,
        { questionId: id, userId }
      );

      if (!existingView) {
        await executeNonQuery(
          `INSERT INTO ${QUESTION_VIEW_TABLE} (QuestionId, UserId) VALUES (@questionId, @userId)`,
          { questionId: id, userId }
        );
        await executeNonQuery(
          `UPDATE ${QUESTION_TABLE} SET Views = Views + 1 WHERE Id = @id`,
          { id }
        );
        const updated = await executeQuerySingle(
          `SELECT Views FROM ${QUESTION_TABLE} WHERE Id = @id`,
          { id }
        );
        question.Views = updated?.Views ?? question.Views;
        isNewView = true;
      }
    } else {
      await executeNonQuery(
        `UPDATE ${QUESTION_TABLE} SET Views = Views + 1 WHERE Id = @id`,
        { id }
      );
      question.Views = (question.Views || 0) + 1;
    }

    return {
      question,
      isNewView,
      userId: userId ?? "anonymous",
    };
  }

  static async create(title, body, userId, tags = [], isBounty = false, bountyAmount = 0) {
    const result = await executeQuery(
      `
      INSERT INTO ${QUESTION_TABLE} (Title, Body, UserId, IsBounty, BountyAmount)
      OUTPUT INSERTED.Id
      VALUES (@title, @body, @userId, @isBounty, @bountyAmount)
      `,
      {
        title,
        body,
        userId,
        isBounty: isBounty ? 1 : 0,
        bountyAmount,
      }
    );

    const questionId = result.recordset[0].Id;

    for (const tagName of tags) {
      await executeNonQuery(
        `
        INSERT INTO ${QUESTION_TAG_TABLE} (QuestionId, TagId)
        SELECT @questionId, Id
        FROM ${TAG_TABLE}
        WHERE Name = @tagName
        `,
        { questionId, tagName }
      );
    }

    return { id: questionId, title, tags };
  }

  static async update(id, title, body, status) {
    const affected = await executeNonQuery(
      `
      UPDATE ${QUESTION_TABLE}
      SET
        Title = COALESCE(@title, Title),
        Body = COALESCE(@body, Body),
        [Status] = COALESCE(@status, [Status]),
        UpdatedAt = GETUTCDATE()
      WHERE Id = @id
      `,
      { id, title, body, status }
    );

    if (!affected) {
      return null;
    }

    return executeQuerySingle(`SELECT * FROM ${QUESTION_TABLE} WHERE Id = @id`, { id });
  }

  static async delete(id) {
    const affected = await executeNonQuery(
      `DELETE FROM ${QUESTION_TABLE} WHERE Id = @id`,
      { id }
    );

    return affected > 0;
  }

  static async getViews(id, userId = null) {
    const question = await executeQuerySingle(
      `SELECT Views FROM ${QUESTION_TABLE} WHERE Id = @id`,
      { id }
    );

    if (!question) {
      return null;
    }

    if (userId) {
      const existingView = await executeQuerySingle(
        `SELECT Id FROM ${QUESTION_VIEW_TABLE} WHERE QuestionId = @questionId AND UserId = @userId`,
        { questionId: id, userId }
      );

      if (!existingView) {
        await executeNonQuery(
          `INSERT INTO ${QUESTION_VIEW_TABLE} (QuestionId, UserId) VALUES (@questionId, @userId)`,
          { questionId: id, userId }
        );
        await executeNonQuery(
          `UPDATE ${QUESTION_TABLE} SET Views = Views + 1 WHERE Id = @id`,
          { id }
        );
        const updated = await executeQuerySingle(
          `SELECT Views FROM ${QUESTION_TABLE} WHERE Id = @id`,
          { id }
        );

        return { views: updated?.Views ?? question.Views, isNewView: true, userId };
      }

      return { views: question.Views, isNewView: false, userId };
    }

    return {
      views: question.Views,
      isNewView: null,
      message: "Provide userId query param to track unique views",
    };
  }

  static async getViewers(id) {
    const viewers = await executeQueryRows(
      `
      SELECT
        u.Id,
        u.Username,
        u.DisplayName,
        u.Avatar,
        u.Reputation,
        qv.ViewedAt
      FROM ${QUESTION_VIEW_TABLE} qv
      JOIN ${USER_TABLE} u ON qv.UserId = u.Id
      WHERE qv.QuestionId = @id
      ORDER BY qv.ViewedAt DESC
      `,
      { id }
    );

    const viewCount = await executeQuerySingle(
      `SELECT Views FROM ${QUESTION_TABLE} WHERE Id = @id`,
      { id }
    );

    return {
      totalViews: viewCount?.Views ?? 0,
      uniqueViewers: viewers.length,
      viewers: viewers.map((viewer) => ({
        userId: viewer.Id,
        username: viewer.Username,
        displayName: viewer.DisplayName,
        avatar: viewer.Avatar,
        reputation: viewer.Reputation,
        viewedAt: viewer.ViewedAt,
      })),
    };
  }

  static async getReplies(id, sort = "votes", order = "DESC") {
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
      { questionId: id }
    );

    if (rows.length === 0) {
      return { count: 0, replies: [] };
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

    return {
      count: rows.length,
      replies: rows.map((answer) => ({
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
      })),
    };
  }
}
