/**
 * EXAMPLE: Converting QuestionModel from SQLite to SQL Server
 * 
 * Before: SQLite (synchronous) with better-sqlite3
 * After: SQL Server (async) with mssql
 * 
 * Key changes:
 * 1. async/await for all database calls
 * 2. executeQueryRows, executeQuerySingle, executeNonQuery helpers
 * 3. SQL syntax changes (LIMIT → TOP, GROUP_CONCAT → STRING_AGG, dates)
 * 4. Parameter passing with @paramName instead of ? placeholders
 */

import { executeQuery, executeQueryRows, executeQuerySingle, executeNonQuery } from "../../db.js";

export class QuestionModel {
  /**
   * Get all questions with filtering and pagination
   * SQL Server changes:
   * - GROUP_CONCAT → STRING_AGG
   * - LIMIT x OFFSET y → OFFSET y ROWS FETCH NEXT x ROWS ONLY
   * - Boolean: true/false → 1/0 (BIT type)
   * - @paramName instead of ?
   */
  static async getAll(filters = {}) {
    const { 
      page = 1, 
      limit = 15, 
      sort = "created", 
      order = "DESC", 
      status, 
      tag, 
      userId, 
      isBounty, 
      q 
    } = filters;

    const sortMap = {
      votes: "q.Votes",
      views: "q.Views",
      created: "q.CreatedAt",
      activity: "q.LastActivityAt",
      answers: "q.AnswersCount",
    };

    const sortCol = sortMap[sort] ?? "q.CreatedAt";
    const sortDir = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    let whereClause = "1=1";
    const params = {};
    const offset = (page - 1) * limit;

    if (status) {
      whereClause += " AND q.[Status] = @status";
      params.status = status;
    }

    if (userId) {
      whereClause += " AND q.UserId = @userId";
      params.userId = parseInt(userId);
    }

    if (isBounty) {
      whereClause += " AND q.IsBounty = @bounty";
      params.bounty = isBounty === "true" ? 1 : 0;
    }

    if (q) {
      whereClause += " AND (q.Title LIKE @search OR q.Body LIKE @search)";
      params.search = `%${q}%`;
    }

    if (tag) {
      whereClause += ` AND q.Id IN (
        SELECT qt.QuestionId FROM [discussion_forum_QuestionTags] qt 
        JOIN [discussion_forum_Tags] t ON qt.TagId = t.Id 
        WHERE t.Name = @tag
      )`;
      params.tag = tag;
    }

    params.limit = limit;
    params.offset = offset;

    const query = `
      SELECT 
        q.*, 
        u.Username, 
        u.DisplayName, 
        u.Avatar, 
        u.Reputation,
        STRING_AGG(t.Name, ',') AS TagNames
      FROM [discussion_forum_Questions] q
      JOIN [discussion_forum_Users] u ON q.UserId = u.Id
      LEFT JOIN [discussion_forum_QuestionTags] qt ON qt.QuestionId = q.Id
      LEFT JOIN [discussion_forum_Tags] t ON qt.TagId = t.Id
      WHERE ${whereClause}
      GROUP BY q.Id, q.Title, q.Body, q.UserId, q.Votes, q.Views, q.AnswersCount,
               q.AcceptedAnswerId, q.[Status], q.IsBounty, q.BountyAmount, q.IsClosed,
               q.IsProtected, q.Favorites, q.CreatedAt, q.UpdatedAt, q.LastActivityAt,
               u.Username, u.DisplayName, u.Avatar, u.Reputation
      ORDER BY ${sortCol} ${sortDir}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    const rows = await executeQueryRows(query, params);
    
    // Parse TagNames if present (SQL Server returns as string)
    return rows.map(row => ({
      ...row,
      TagNames: row.TagNames ? row.TagNames.split(',') : []
    }));
  }

  /**
   * Get single question by ID
   * Changes:
   * - Now async
   * - Separate queries instead of complex JOIN
   * - DATETIME2 for date comparisons
   */
  static async getById(id, userId = null) {
    const query = `
      SELECT 
        q.*, 
        u.Username, 
        u.DisplayName, 
        u.Avatar, 
        u.Reputation,
        u.Bio AS UserBio,
        STRING_AGG(t.Name, ',') AS TagNames
      FROM [discussion_forum_Questions] q
      JOIN [discussion_forum_Users] u ON q.UserId = u.Id
      LEFT JOIN [discussion_forum_QuestionTags] qt ON qt.QuestionId = q.Id
      LEFT JOIN [discussion_forum_Tags] t ON qt.TagId = t.Id
      WHERE q.Id = @id
      GROUP BY q.Id, q.Title, q.Body, q.UserId, q.Votes, q.Views, q.AnswersCount,
               q.AcceptedAnswerId, q.[Status], q.IsBounty, q.BountyAmount, q.IsClosed,
               q.IsProtected, q.Favorites, q.CreatedAt, q.UpdatedAt, q.LastActivityAt,
               u.Username, u.DisplayName, u.Avatar, u.Reputation, u.Bio
    `;

    const question = await executeQuerySingle(query, { id });

    if (!question) return null;

    // Track unique user view
    let isNewView = false;
    if (userId) {
      const existingView = await executeQuerySingle(
        `SELECT Id FROM [discussion_forum_QuestionViews] WHERE QuestionId = @questionId AND UserId = @userId`,
        { questionId: id, userId }
      );

      if (!existingView) {
        await executeNonQuery(
          `INSERT INTO [discussion_forum_QuestionViews] (QuestionId, UserId) VALUES (@questionId, @userId)`,
          { questionId: id, userId }
        );
        
        await executeNonQuery(
          `UPDATE [discussion_forum_Questions] SET Views = Views + 1 WHERE Id = @id`,
          { id }
        );

        isNewView = true;
        
        const updated = await executeQuerySingle(
          `SELECT Views FROM [discussion_forum_Questions] WHERE Id = @id`,
          { id }
        );
        question.Views = updated.Views;
      }
    } else {
      await executeNonQuery(
        `UPDATE [discussion_forum_Questions] SET Views = Views + 1 WHERE Id = @id`,
        { id }
      );
      question.Views = (question.Views || 0) + 1;
    }

    return { 
      question: {
        ...question,
        TagNames: question.TagNames ? question.TagNames.split(',') : []
      }, 
      isNewView, 
      userId: userId ?? "anonymous" 
    };
  }

  /**
   * Create a new question
   * Changes:
   * - Async function
   * - Use GETUTCDATE() instead of datetime('now')
   * - Use @@IDENTITY or OUTPUT clause for last insert ID
   */
  static async create(title, body, userId, tags = [], isBounty = false, bountyAmount = 0) {
    const result = await executeQuery(
      `
      INSERT INTO [discussion_forum_Questions] (Title, Body, UserId, IsBounty, BountyAmount)
      OUTPUT INSERTED.Id
      VALUES (@title, @body, @userId, @isBounty, @bountyAmount)
      `,
      {
        title,
        body,
        userId,
        isBounty: isBounty ? 1 : 0,
        bountyAmount
      }
    );

    const insertedQuestion = result.recordset[0];
    const questionId = insertedQuestion.Id;

    // Insert tags
    for (const tagName of tags) {
      try {
        await executeNonQuery(
          `
          INSERT INTO [discussion_forum_QuestionTags] (QuestionId, TagId)
          SELECT @questionId, Id FROM [discussion_forum_Tags] WHERE Name = @tagName
          `,
          { questionId, tagName }
        );
      } catch (err) {
        console.error(`Failed to add tag ${tagName}:`, err.message);
      }
    }

    return { id: questionId, title, tags };
  }

  /**
   * Update a question
   * Changes:
   * - Async
   * - GETUTCDATE() for timestamps
   * - COALESCE or conditional updates
   */
  static async update(id, title, body, status) {
    const query = `
      UPDATE [discussion_forum_Questions] 
      SET 
        Title = COALESCE(@title, Title),
        Body = COALESCE(@body, Body),
        [Status] = COALESCE(@status, [Status]),
        UpdatedAt = GETUTCDATE()
      WHERE Id = @id
    `;

    await executeNonQuery(query, { id, title, body, status });
    return { success: true };
  }

  /**
   * Delete a question (cascading deletes handled by FK)
   */
  static async delete(id) {
    await executeNonQuery(
      `DELETE FROM [discussion_forum_Questions] WHERE Id = @id`,
      { id }
    );
    return { success: true };
  }

  /**
   * Accept an answer for a question
   */
  static async acceptAnswer(questionId, answerId) {
    // Clear previous accepted answer
    await executeNonQuery(
      `UPDATE [discussion_forum_Answers] SET IsAccepted = 0 WHERE QuestionId = @questionId AND IsAccepted = 1`,
      { questionId }
    );

    // Set new accepted answer
    await executeNonQuery(
      `UPDATE [discussion_forum_Answers] SET IsAccepted = 1 WHERE Id = @answerId`,
      { answerId }
    );

    // Update question status
    await executeNonQuery(
      `UPDATE [discussion_forum_Questions] SET AcceptedAnswerId = @answerId, [Status] = 'answered' WHERE Id = @questionId`,
      { questionId, answerId }
    );

    return { success: true };
  }
}

/**
 * KEY DIFFERENCES SUMMARY
 * 
 * SQLite (before):
 * - Synchronous: db.prepare().all(params)
 * - Placeholder: ? for params
 * - Dates: TEXT with ISO format, datetime('now')
 * - Boolean: INTEGER (0/1)
 * - Last ID: info.lastInsertRowid
 * - String concat: GROUP_CONCAT(col, ',')
 * - Pagination: LIMIT limit OFFSET offset
 * 
 * SQL Server (after):
 * - Asynchronous: await executeQueryRows(query, params)
 * - Parameter names: @paramName
 * - Dates: DATETIME2, GETUTCDATE()
 * - Boolean: BIT (1/0)
 * - Last ID: OUTPUT INSERTED.Id or @@IDENTITY
 * - String concat: STRING_AGG(col, ',')
 * - Pagination: OFFSET offset ROWS FETCH NEXT limit ROWS ONLY
 * - Column names in brackets: [Status] (reserved keyword)
 */
