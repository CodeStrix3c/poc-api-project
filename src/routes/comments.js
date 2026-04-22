/**
 * Comments Routes
 */

import express from "express";
import { CommentController } from "../controllers/CommentController.js";

const router = express.Router();

router.get("/:id", CommentController.getById);
router.post("/", CommentController.create);

export default router;
