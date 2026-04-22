/**
 * Questions Routes
 */

import express from "express";
import { QuestionController } from "../controllers/QuestionController.js";

const router = express.Router();

router.get("/", QuestionController.getAll);
router.get("/:id", QuestionController.getById);
router.post("/", QuestionController.create);
router.put("/:id", QuestionController.update);
router.delete("/:id", QuestionController.delete);
router.get("/:id/views", QuestionController.getViews);
router.get("/:id/viewers", QuestionController.getViewers);
router.get("/:id/replies", QuestionController.getReplies);

export default router;
