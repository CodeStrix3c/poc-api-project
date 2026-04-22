-- ================================================================
-- SQL Server Forum Database Migration Script
-- Converted from SQLite
-- ================================================================
-- Run this script on your SQL Server instance to create the schema

USE [YourForumDatabase]; -- Change to your actual database name
GO

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Users] (
  [Id]            INT PRIMARY KEY IDENTITY(1,1),
  [Username]      NVARCHAR(255) NOT NULL UNIQUE,
  [DisplayName]   NVARCHAR(255) NOT NULL,
  [Email]         NVARCHAR(255) NOT NULL UNIQUE,
  [Avatar]        NVARCHAR(MAX) DEFAULT '',
  [Bio]           NVARCHAR(MAX) DEFAULT '',
  [Reputation]    INT DEFAULT 0,
  [GoldBadges]    INT DEFAULT 0,
  [SilverBadges]  INT DEFAULT 0,
  [BronzeBadges]  INT DEFAULT 0,
  [Location]      NVARCHAR(255) DEFAULT '',
  [Website]       NVARCHAR(MAX) DEFAULT '',
  [IsOnline]      BIT DEFAULT 0,
  [JoinedAt]      DATETIME2 DEFAULT GETUTCDATE(),
  [LastSeen]      DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX [IX_discussion_forum_Users_Username] ON [discussion_forum_Users]([Username]);
GO

-- ============================================================
-- TAGS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Tags] (
  [Id]              INT PRIMARY KEY IDENTITY(1,1),
  [Name]            NVARCHAR(255) NOT NULL UNIQUE,
  [Description]     NVARCHAR(MAX) DEFAULT '',
  [Color]           NVARCHAR(50) DEFAULT '#666666',
  [QuestionsCount]  INT DEFAULT 0
);

CREATE INDEX [IX_discussion_forum_Tags_Name] ON [discussion_forum_Tags]([Name]);
GO

-- ============================================================
-- QUESTIONS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Questions] (
  [Id]               INT PRIMARY KEY IDENTITY(1,1),
  [Title]            NVARCHAR(MAX) NOT NULL,
  [Body]             NVARCHAR(MAX) NOT NULL,
  [UserId]           INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [Votes]            INT DEFAULT 0,
  [Views]            INT DEFAULT 0,
  [AnswersCount]     INT DEFAULT 0,
  [AcceptedAnswerId] INT DEFAULT NULL,
  [Status]           NVARCHAR(50) DEFAULT 'open' CHECK([Status] IN ('open','answered','closed','discussion')),
  [IsBounty]         BIT DEFAULT 0,
  [BountyAmount]     INT DEFAULT 0,
  [IsClosed]         BIT DEFAULT 0,
  [IsProtected]      BIT DEFAULT 0,
  [Favorites]        INT DEFAULT 0,
  [CreatedAt]        DATETIME2 DEFAULT GETUTCDATE(),
  [UpdatedAt]        DATETIME2 DEFAULT GETUTCDATE(),
  [LastActivityAt]   DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX [IX_discussion_forum_Questions_UserId]       ON [discussion_forum_Questions]([UserId]);
CREATE INDEX [IX_discussion_forum_Questions_Status]        ON [discussion_forum_Questions]([Status]);
CREATE INDEX [IX_discussion_forum_Questions_Votes]         ON [discussion_forum_Questions]([Votes] DESC);
CREATE INDEX [IX_discussion_forum_Questions_CreatedAt]     ON [discussion_forum_Questions]([CreatedAt] DESC);
CREATE INDEX [IX_discussion_forum_Questions_LastActivity]  ON [discussion_forum_Questions]([LastActivityAt] DESC);
GO

-- ============================================================
-- QUESTION_TAGS TABLE (many-to-many)
-- ============================================================
CREATE TABLE [discussion_forum_QuestionTags] (
  [QuestionId] INT NOT NULL REFERENCES [discussion_forum_Questions]([Id]) ON DELETE CASCADE,
  [TagId]      INT NOT NULL REFERENCES [discussion_forum_Tags]([Id])      ON DELETE CASCADE,
  PRIMARY KEY ([QuestionId], [TagId])
);

CREATE INDEX [IX_discussion_forum_QuestionTags_TagId] ON [discussion_forum_QuestionTags]([TagId]);
GO

-- ============================================================
-- ANSWERS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Answers] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [QuestionId]  INT NOT NULL REFERENCES [discussion_forum_Questions]([Id]) ON DELETE CASCADE,
  [UserId]      INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [Body]        NVARCHAR(MAX) NOT NULL,
  [Votes]       INT DEFAULT 0,
  [IsAccepted]  BIT DEFAULT 0,
  [CreatedAt]   DATETIME2 DEFAULT GETUTCDATE(),
  [UpdatedAt]   DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX [IX_discussion_forum_Answers_QuestionId] ON [discussion_forum_Answers]([QuestionId]);
CREATE INDEX [IX_discussion_forum_Answers_UserId]     ON [discussion_forum_Answers]([UserId]);
CREATE INDEX [IX_discussion_forum_Answers_Votes]      ON [discussion_forum_Answers]([Votes] DESC);
GO

-- ============================================================
-- COMMENTS TABLE (on questions OR answers)
-- ============================================================
CREATE TABLE [discussion_forum_Comments] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [UserId]      INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [QuestionId]  INT DEFAULT NULL REFERENCES [discussion_forum_Questions]([Id]),
  [AnswerId]    INT DEFAULT NULL REFERENCES [discussion_forum_Answers]([Id]),
  [Body]        NVARCHAR(MAX) NOT NULL,
  [Votes]       INT DEFAULT 0,
  [CreatedAt]   DATETIME2 DEFAULT GETUTCDATE(),
  CHECK (
    (QuestionId IS NOT NULL AND AnswerId IS NULL) OR
    (QuestionId IS NULL AND AnswerId IS NOT NULL)
  )
);

CREATE INDEX [IX_discussion_forum_Comments_QuestionId] ON [discussion_forum_Comments]([QuestionId]);
CREATE INDEX [IX_discussion_forum_Comments_AnswerId]   ON [discussion_forum_Comments]([AnswerId]);
GO

-- ============================================================
-- VOTES TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Votes] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [UserId]      INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [TargetType]  NVARCHAR(50) NOT NULL CHECK([TargetType] IN ('question','answer','comment')),
  [TargetId]    INT NOT NULL,
  [Value]       INT NOT NULL CHECK([Value] IN (-1, 1)),
  [CreatedAt]   DATETIME2 DEFAULT GETUTCDATE(),
  UNIQUE([UserId], [TargetType], [TargetId])
);

CREATE INDEX [IX_discussion_forum_Votes_UserId] ON [discussion_forum_Votes]([UserId]);
GO

-- ============================================================
-- MEDIA TABLE (images, videos, attachments)
-- ============================================================
CREATE TABLE [discussion_forum_Media] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [QuestionId]  INT DEFAULT NULL REFERENCES [discussion_forum_Questions]([Id]) ON DELETE CASCADE,
  [AnswerId]    INT DEFAULT NULL REFERENCES [discussion_forum_Answers]([Id]),
  [Type]        NVARCHAR(50) NOT NULL CHECK([Type] IN ('image','video','attachment')),
  [Url]         NVARCHAR(MAX) NOT NULL,
  [Thumbnail]   NVARCHAR(MAX) DEFAULT '',
  [AltText]     NVARCHAR(MAX) DEFAULT '',
  [Width]       INT DEFAULT NULL,
  [Height]      INT DEFAULT NULL,
  [Duration]    NVARCHAR(MAX) DEFAULT NULL,
  [Platform]    NVARCHAR(255) DEFAULT NULL,
  [FileSize]    INT DEFAULT NULL,
  [MimeType]    NVARCHAR(255) DEFAULT NULL,
  [CreatedAt]   DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX [IX_discussion_forum_Media_QuestionId] ON [discussion_forum_Media]([QuestionId]);
CREATE INDEX [IX_discussion_forum_Media_AnswerId]   ON [discussion_forum_Media]([AnswerId]);
GO

-- ============================================================
-- BOOKMARKS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Bookmarks] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [UserId]      INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [QuestionId]  INT NOT NULL REFERENCES [discussion_forum_Questions]([Id]) ON DELETE CASCADE,
  [CreatedAt]   DATETIME2 DEFAULT GETUTCDATE(),
  UNIQUE([UserId], [QuestionId])
);

CREATE INDEX [IX_discussion_forum_Bookmarks_UserId] ON [discussion_forum_Bookmarks]([UserId]);
GO

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_Notifications] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [UserId]      INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [Type]        NVARCHAR(50) NOT NULL CHECK([Type] IN ('answer','comment','vote','badge','bounty','mention','accepted')),
  [Message]     NVARCHAR(MAX) NOT NULL,
  [QuestionId]  INT DEFAULT NULL,
  [AnswerId]    INT DEFAULT NULL,
  [IsRead]      BIT DEFAULT 0,
  [CreatedAt]   DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX [IX_discussion_forum_Notifications_UserId] ON [discussion_forum_Notifications]([UserId], [IsRead]);
GO

-- ============================================================
-- LINKED_QUESTIONS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_LinkedQuestions] (
  [QuestionId]       INT NOT NULL REFERENCES [discussion_forum_Questions]([Id]),
  [LinkedQuestionId] INT NOT NULL REFERENCES [discussion_forum_Questions]([Id]),
  PRIMARY KEY ([QuestionId], [LinkedQuestionId]),
  CHECK (QuestionId <> LinkedQuestionId)
);
GO

-- ============================================================
-- USER_TAGS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_UserTags] (
  [UserId] INT NOT NULL REFERENCES [discussion_forum_Users]([Id]) ON DELETE CASCADE,
  [TagId]  INT NOT NULL REFERENCES [discussion_forum_Tags]([Id])  ON DELETE CASCADE,
  PRIMARY KEY ([UserId], [TagId])
);
GO

-- ============================================================
-- SEARCH_SUGGESTIONS TABLE
-- ============================================================
CREATE TABLE [discussion_forum_SearchSuggestions] (
  [Id]     INT PRIMARY KEY IDENTITY(1,1),
  [Term]   NVARCHAR(MAX) NOT NULL UNIQUE,
  [Weight] INT DEFAULT 1
);
GO

-- ============================================================
-- QUESTION_VIEWS TABLE (track user views)
-- ============================================================
CREATE TABLE [discussion_forum_QuestionViews] (
  [Id]          INT PRIMARY KEY IDENTITY(1,1),
  [QuestionId]  INT NOT NULL REFERENCES [discussion_forum_Questions]([Id]) ON DELETE CASCADE,
  [UserId]      INT NOT NULL REFERENCES [discussion_forum_Users]([Id]),
  [ViewedAt]    DATETIME2 DEFAULT GETUTCDATE(),
  UNIQUE([QuestionId], [UserId])
);

CREATE INDEX [IX_discussion_forum_QuestionViews_QuestionId] ON [discussion_forum_QuestionViews]([QuestionId]);
CREATE INDEX [IX_discussion_forum_QuestionViews_UserId]     ON [discussion_forum_QuestionViews]([UserId]);
GO

PRINT 'SQL Server schema created successfully!';
