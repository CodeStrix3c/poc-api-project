# MVC Architecture - API Structure

## Overview
The API has been refactored to follow an MVC (Model-View-Controller) architecture similar to .NET Core, separating concerns and improving maintainability.

## Directory Structure

```
src/
├── models/           # Data Models - Database operations
│   ├── QuestionModel.js
│   ├── AnswerModel.js
│   ├── CommentModel.js
│   └── index.js      # Other models (User, Tag, Search, Stats)
│
├── controllers/      # Controllers - Business logic & request handling
│   ├── QuestionController.js
│   ├── AnswerController.js
│   ├── CommentController.js
│   └── index.js      # Other controllers (Vote, Bookmark, Media, etc.)
│
├── routes/          # Routes - API endpoint definitions
│   ├── index.js     # Main router
│   ├── questions.js
│   ├── answers.js
│   ├── comments.js
│   └── other.js     # Votes, Bookmarks, Users, Tags, etc.
│
└── utils/           # Utilities - Shared functions
    ├── responseHandler.js  # Standard response helpers
    └── pagination.js       # Pagination utility

server.js            # Old server (can still be used)
server-refactored.js # New server using MVC structure
```

## Architecture Layers

### 1. Models (`src/models/`)
**Responsibility**: Database operations and data access

```javascript
// Example: QuestionModel.js
export class QuestionModel {
  static getAll(filters) { /* ... */ }
  static getById(id) { /* ... */ }
  static create(...) { /* ... */ }
  static update(...) { /* ... */ }
}
```

**Models Provided**:
- `QuestionModel` - Questions CRUD and related queries
- `AnswerModel` - Answers CRUD operations
- `CommentModel` - Comments CRUD operations
- `UserModel` - User queries
- `TagModel` - Tag queries
- `SearchModel` - Search functionality
- `StatsModel` - Statistics and health checks

### 2. Controllers (`src/controllers/`)
**Responsibility**: Request handling, validation, response formatting

```javascript
// Example: QuestionController.js
export class QuestionController {
  static getAll(req, res) { 
    // Handle request
    // Call model
    // Return response
  }
  static getById(req, res) { /* ... */ }
  static create(req, res) { /* ... */ }
}
```

**Controllers Provided**:
- `QuestionController` - Question endpoints
- `AnswerController` - Answer endpoints
- `CommentController` - Comment endpoints
- `VoteController` - Voting endpoints
- `BookmarkController` - Bookmark endpoints
- `MediaController` - Media upload
- `SearchController` - Search functionality
- `UserController` - User endpoints
- `TagController` - Tag endpoints
- `NotificationController` - Notifications
- `StatsController` - Stats and health

### 3. Routes (`src/routes/`)
**Responsibility**: API endpoint definitions and routing

```javascript
// Example: questions.js
import { QuestionController } from "../controllers/QuestionController.js";

router.get("/", QuestionController.getAll);
router.get("/:id", QuestionController.getById);
router.post("/", QuestionController.create);
```

**Routes Files**:
- `index.js` - Main router combining all routes
- `questions.js` - `/api/v1/questions/*`
- `answers.js` - `/api/v1/questions/:id/answers/*`
- `comments.js` - `/api/v1/comments/*`
- `other.js` - `/api/v1/votes`, `/api/v1/bookmarks`, `/api/v1/users`, etc.

### 4. Utilities (`src/utils/`)
**Responsibility**: Shared helper functions

**Available Utilities**:
- `responseHandler.js` - Standard response helpers
  - `ok()` - 200 response with data
  - `created()` - 201 response
  - `notFound()` - 404 response
  - `badRequest()` - 400 response
  - `serverError()` - 500 response
  
- `pagination.js` - Pagination helper

## API Endpoints Organization

### Questions
```
GET    /api/v1/questions              (list all)
GET    /api/v1/questions/:id          (get detail)
POST   /api/v1/questions              (create)
PUT    /api/v1/questions/:id          (update)
DELETE /api/v1/questions/:id          (delete)
GET    /api/v1/questions/:id/views    (get views)
GET    /api/v1/questions/:id/viewers  (get viewers)
GET    /api/v1/questions/:id/replies  (get replies list)
```

### Answers
```
GET    /api/v1/questions/:id/answers           (list for question)
POST   /api/v1/questions/:id/answers           (create)
PATCH  /api/v1/answers/:id/accept              (accept answer)
```

### Comments
```
GET    /api/v1/comments/:id                    (get comment)
GET    /api/v1/questions/:id/comments          (list for question)
GET    /api/v1/answers/:id/comments            (list for answer)
POST   /api/v1/comments                        (create)
```

### Other Resources
```
POST   /api/v1/votes
GET    /api/v1/bookmarks/:userId
POST   /api/v1/bookmarks
DELETE /api/v1/bookmarks/:userId/:questionId
POST   /api/v1/media
GET    /api/v1/search?q=...
GET    /api/v1/users
GET    /api/v1/users/:id
GET    /api/v1/tags
GET    /api/v1/notifications/:userId
PATCH  /api/v1/notifications/:id/read
GET    /api/v1/stats
GET    /api/v1/health
```

## Running the Application

### Original Server (monolithic)
```bash
npm run dev  # Runs server.js
```

### Refactored Server (MVC structure)
```bash
node --watch server-refactored.js
```

Or update `package.json`:
```json
{
  "scripts": {
    "dev": "node --watch server-refactored.js"
  }
}
```

## Adding New Features

### Example: Add a Rating Endpoint

**Step 1: Create Model** (`src/models/RatingModel.js`)
```javascript
export class RatingModel {
  static create(questionId, userId, rating) {
    const db = getDb();
    return db.prepare(`INSERT INTO Ratings (...) VALUES (...)`).run(...);
  }
}
```

**Step 2: Create Controller** (`src/controllers/RatingController.js`)
```javascript
export class RatingController {
  static create(req, res) {
    const { questionId, userId, rating } = req.body;
    const result = RatingModel.create(questionId, userId, rating);
    return created(res, result);
  }
}
```

**Step 3: Add Routes** (update `src/routes/index.js` or create `src/routes/ratings.js`)
```javascript
router.post("/ratings", RatingController.create);
```

## Benefits of MVC Structure

1. **Separation of Concerns**
   - Models: Data access only
   - Controllers: Business logic only
   - Routes: Endpoint definitions only

2. **Reusability**
   - Models can be used by multiple controllers
   - Controllers can be tested independently

3. **Scalability**
   - Easy to add new endpoints
   - Easy to maintain and modify

4. **Testability**
   - Each layer can be unit tested
   - Mocking becomes easier

5. **Maintainability**
   - Clear code organization
   - Easy to find and fix bugs
   - Consistent structure across the codebase

## Migration Notes

- The old `server.js` remains unchanged for backward compatibility
- The new `server-refactored.js` uses the MVC structure
- Both use the same database and swagger configuration
- To switch to the new structure, update the npm start script or rename files
