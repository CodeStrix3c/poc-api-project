/**
 * Comments Controller - handles comment-related requests
 */

import { CommentModel } from "../models/CommentModel.js";
import { ok, created, notFound, serverError, badRequest } from "../utils/responseHandler.js";

export class CommentController {
  static getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const comment = CommentModel.getById(id);

      if (!comment) return notFound(res, "Comment not found");
      return ok(res, comment);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getByQuestionId(req, res) {
    try {
      const qId = parseInt(req.params.id);
      const result = CommentModel.getByQuestionId(qId);
      return ok(res, { questionId: qId, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static getByAnswerId(req, res) {
    try {
      const aId = parseInt(req.params.id);
      const result = CommentModel.getByAnswerId(aId);
      return ok(res, { answerId: aId, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static create(req, res) {
    try {
      const { userId, questionId, answerId, body } = req.body;

      if (!userId || !body || (!questionId && !answerId)) {
        return badRequest(res, "userId, body, and questionId or answerId required");
      }

      const comment = CommentModel.create(userId, questionId, answerId, body);
      return created(res, comment);
    } catch (err) {
      return serverError(res, err);
    }
  }
}
