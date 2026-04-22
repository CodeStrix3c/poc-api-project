/**
 * Main Routes - combines all sub-routes
 */

import express from "express";
import questionsRouter from "./questions.js";
import answersRouter from "./answers.js";
import commentsRouter from "./comments.js";
import otherRouter from "./other.js";

const router = express.Router();

router.use("/questions", questionsRouter);
router.use("/questions/:id/answers", answersRouter);
router.use("/answers/:id/comments", (req, res, next) => {
  req.params.questionId = null; // Reset questionId for answer comments
  commentsRouter(req, res, next);
});
router.use("/questions/:id/comments", commentsRouter);
router.use("/comments", commentsRouter);

// Other routes (votes, bookmarks, users, tags, search, notifications, health)
router.use("/", otherRouter);

export default router;
