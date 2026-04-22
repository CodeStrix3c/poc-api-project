/**
 * Answers Routes
 */

import express from "express";
import { AnswerController } from "../controllers/AnswerController.js";

const router = express.Router({ mergeParams: true });

router.get("/", AnswerController.getByQuestionId);
router.post("/", AnswerController.create);
router.patch("/:id/accept", AnswerController.accept);

export default router;
