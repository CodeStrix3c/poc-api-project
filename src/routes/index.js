/**
 * Main Routes - combines all sub-routes
 */

import express from "express";
import questionsRouter from "./questions.js";
import { AnswerController } from "../controllers/AnswerController.js";
import { CommentController } from "../controllers/CommentController.js";
import otherRouter from "./other.js";

const router = express.Router();

router.use("/questions", questionsRouter);
router.get("/questions/:id/answers", AnswerController.getByQuestionId);
router.post("/questions/:id/answers", AnswerController.create);
router.patch("/answers/:id/accept", AnswerController.accept);
router.get("/questions/:id/comments", CommentController.getByQuestionId);
router.get("/answers/:id/comments", CommentController.getByAnswerId);
router.get("/comments/:id", CommentController.getById);
router.post("/comments", CommentController.create);

// Other routes (votes, bookmarks, users, tags, search, notifications, health)
router.use("/", otherRouter);

export default router;
