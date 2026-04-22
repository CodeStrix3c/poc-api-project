/**
 * Other Routes - votes, bookmarks, users, tags, search, notifications, stats, health
 */

import express from "express";
import {
  VoteController,
  BookmarkController,
  MediaController,
  SearchController,
  UserController,
  TagController,
  NotificationController,
  StatsController,
} from "../controllers/index.js";

const router = express.Router();

// Votes
router.post("/votes", VoteController.cast);

// Bookmarks
router.get("/bookmarks/:userId", BookmarkController.get);
router.post("/bookmarks", BookmarkController.add);
router.delete("/bookmarks/:userId/:questionId", BookmarkController.remove);

// Media
router.post("/media", MediaController.upload);

// Search
router.get("/search", SearchController.search);

// Users
router.get("/users", UserController.getAll);
router.get("/users/:id", UserController.getById);

// Tags
router.get("/tags", TagController.getAll);

// Notifications
router.get("/notifications/:userId", NotificationController.get);
router.patch("/notifications/:id/read", NotificationController.markAsRead);

// Stats and Health
router.get("/stats", StatsController.getStats);
router.get("/health", StatsController.healthCheck);

export default router;
