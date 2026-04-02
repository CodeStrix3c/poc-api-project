import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {Database.Database | null} */
let db = null;

/**
 * Returns the SQLite database instance (singleton).
 * Creates the file + schema on first call.
 * @returns {Database.Database}
 */
export function getDb() {
  if (db) return db;

  const dbPath = join(__dirname, "forum.db");
  db = new Database(dbPath);

  // Performance tuning
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.pragma("synchronous = NORMAL");

  createSchema(db);
  return db;
}

/**
 * Creates all tables if they don't exist.
 * @param {Database.Database} db
 */
function createSchema(db) {
  db.exec(`
    -- ============================================================
    -- USERS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Users (
      Id            INTEGER PRIMARY KEY AUTOINCREMENT,
      Username      TEXT    NOT NULL UNIQUE,
      DisplayName   TEXT    NOT NULL,
      Email         TEXT    NOT NULL UNIQUE,
      Avatar        TEXT    DEFAULT '',
      Bio           TEXT    DEFAULT '',
      Reputation    INTEGER DEFAULT 0,
      GoldBadges    INTEGER DEFAULT 0,
      SilverBadges  INTEGER DEFAULT 0,
      BronzeBadges  INTEGER DEFAULT 0,
      Location      TEXT    DEFAULT '',
      Website       TEXT    DEFAULT '',
      IsOnline      INTEGER DEFAULT 0,
      JoinedAt      TEXT    DEFAULT (datetime('now')),
      LastSeen      TEXT    DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- TAGS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Tags (
      Id              INTEGER PRIMARY KEY AUTOINCREMENT,
      Name            TEXT    NOT NULL UNIQUE,
      Description     TEXT    DEFAULT '',
      Color           TEXT    DEFAULT '#666666',
      QuestionsCount  INTEGER DEFAULT 0
    );

    -- ============================================================
    -- QUESTIONS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Questions (
      Id               INTEGER PRIMARY KEY AUTOINCREMENT,
      Title            TEXT    NOT NULL,
      Body             TEXT    NOT NULL,
      UserId           INTEGER NOT NULL REFERENCES Users(Id),
      Votes            INTEGER DEFAULT 0,
      Views            INTEGER DEFAULT 0,
      AnswersCount     INTEGER DEFAULT 0,
      AcceptedAnswerId INTEGER DEFAULT NULL,
      Status           TEXT    DEFAULT 'open' CHECK(Status IN ('open','answered','closed','discussion')),
      IsBounty         INTEGER DEFAULT 0,
      BountyAmount     INTEGER DEFAULT 0,
      IsClosed         INTEGER DEFAULT 0,
      IsProtected      INTEGER DEFAULT 0,
      Favorites        INTEGER DEFAULT 0,
      CreatedAt        TEXT    DEFAULT (datetime('now')),
      UpdatedAt        TEXT    DEFAULT (datetime('now')),
      LastActivityAt   TEXT    DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS IX_Questions_UserId       ON Questions(UserId);
    CREATE INDEX IF NOT EXISTS IX_Questions_Status        ON Questions(Status);
    CREATE INDEX IF NOT EXISTS IX_Questions_Votes         ON Questions(Votes DESC);
    CREATE INDEX IF NOT EXISTS IX_Questions_CreatedAt     ON Questions(CreatedAt DESC);
    CREATE INDEX IF NOT EXISTS IX_Questions_LastActivity  ON Questions(LastActivityAt DESC);

    -- ============================================================
    -- QUESTION_TAGS (many-to-many)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS QuestionTags (
      QuestionId INTEGER NOT NULL REFERENCES Questions(Id) ON DELETE CASCADE,
      TagId      INTEGER NOT NULL REFERENCES Tags(Id)      ON DELETE CASCADE,
      PRIMARY KEY (QuestionId, TagId)
    );

    -- ============================================================
    -- ANSWERS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Answers (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      QuestionId  INTEGER NOT NULL REFERENCES Questions(Id) ON DELETE CASCADE,
      UserId      INTEGER NOT NULL REFERENCES Users(Id),
      Body        TEXT    NOT NULL,
      Votes       INTEGER DEFAULT 0,
      IsAccepted  INTEGER DEFAULT 0,
      CreatedAt   TEXT    DEFAULT (datetime('now')),
      UpdatedAt   TEXT    DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS IX_Answers_QuestionId ON Answers(QuestionId);
    CREATE INDEX IF NOT EXISTS IX_Answers_UserId     ON Answers(UserId);
    CREATE INDEX IF NOT EXISTS IX_Answers_Votes      ON Answers(Votes DESC);

    -- ============================================================
    -- COMMENTS (on questions OR answers)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Comments (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId      INTEGER NOT NULL REFERENCES Users(Id),
      QuestionId  INTEGER DEFAULT NULL REFERENCES Questions(Id),
      AnswerId    INTEGER DEFAULT NULL REFERENCES Answers(Id),
      Body        TEXT    NOT NULL,
      Votes       INTEGER DEFAULT 0,
      CreatedAt   TEXT    DEFAULT (datetime('now')),
      CHECK (
        (QuestionId IS NOT NULL AND AnswerId IS NULL) OR
        (QuestionId IS NULL AND AnswerId IS NOT NULL)
      )
    );

    CREATE INDEX IF NOT EXISTS IX_Comments_QuestionId ON Comments(QuestionId);
    CREATE INDEX IF NOT EXISTS IX_Comments_AnswerId   ON Comments(AnswerId);

    -- ============================================================
    -- VOTES
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Votes (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId      INTEGER NOT NULL REFERENCES Users(Id),
      TargetType  TEXT    NOT NULL CHECK(TargetType IN ('question','answer','comment')),
      TargetId    INTEGER NOT NULL,
      Value       INTEGER NOT NULL CHECK(Value IN (-1, 1)),
      CreatedAt   TEXT    DEFAULT (datetime('now')),
      UNIQUE(UserId, TargetType, TargetId)
    );

    -- ============================================================
    -- MEDIA (images, videos, attachments)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Media (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      QuestionId  INTEGER DEFAULT NULL REFERENCES Questions(Id) ON DELETE CASCADE,
      AnswerId    INTEGER DEFAULT NULL REFERENCES Answers(Id),
      Type        TEXT    NOT NULL CHECK(Type IN ('image','video','attachment')),
      Url         TEXT    NOT NULL,
      Thumbnail   TEXT    DEFAULT '',
      AltText     TEXT    DEFAULT '',
      Width       INTEGER DEFAULT NULL,
      Height      INTEGER DEFAULT NULL,
      Duration    TEXT    DEFAULT NULL,
      Platform    TEXT    DEFAULT NULL,
      FileSize    INTEGER DEFAULT NULL,
      MimeType    TEXT    DEFAULT NULL,
      CreatedAt   TEXT    DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS IX_Media_QuestionId ON Media(QuestionId);
    CREATE INDEX IF NOT EXISTS IX_Media_AnswerId   ON Media(AnswerId);

    -- ============================================================
    -- BOOKMARKS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Bookmarks (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId      INTEGER NOT NULL REFERENCES Users(Id),
      QuestionId  INTEGER NOT NULL REFERENCES Questions(Id) ON DELETE CASCADE,
      CreatedAt   TEXT    DEFAULT (datetime('now')),
      UNIQUE(UserId, QuestionId)
    );

    -- ============================================================
    -- NOTIFICATIONS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS Notifications (
      Id          INTEGER PRIMARY KEY AUTOINCREMENT,
      UserId      INTEGER NOT NULL REFERENCES Users(Id),
      Type        TEXT    NOT NULL CHECK(Type IN ('answer','comment','vote','badge','bounty','mention','accepted')),
      Message     TEXT    NOT NULL,
      QuestionId  INTEGER DEFAULT NULL,
      AnswerId    INTEGER DEFAULT NULL,
      IsRead      INTEGER DEFAULT 0,
      CreatedAt   TEXT    DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS IX_Notifications_UserId ON Notifications(UserId, IsRead);

    -- ============================================================
    -- LINKED QUESTIONS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS LinkedQuestions (
      QuestionId       INTEGER NOT NULL REFERENCES Questions(Id),
      LinkedQuestionId INTEGER NOT NULL REFERENCES Questions(Id),
      PRIMARY KEY (QuestionId, LinkedQuestionId),
      CHECK (QuestionId <> LinkedQuestionId)
    );

    -- ============================================================
    -- USER TAGS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS UserTags (
      UserId INTEGER NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
      TagId  INTEGER NOT NULL REFERENCES Tags(Id)  ON DELETE CASCADE,
      PRIMARY KEY (UserId, TagId)
    );

    -- ============================================================
    -- SEARCH SUGGESTIONS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS SearchSuggestions (
      Id     INTEGER PRIMARY KEY AUTOINCREMENT,
      Term   TEXT    NOT NULL UNIQUE,
      Weight INTEGER DEFAULT 1
    );
  `);
}

/**
 * Closes the database connection.
 */
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
