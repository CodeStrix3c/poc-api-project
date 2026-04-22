import { CommentModel } from "../models/CommentModel.js";
import {
  ok,
  created,
  notFound,
  serverError,
  badRequest,
} from "../utils/responseHandler.js";

export class CommentController {
  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const comment = await CommentModel.getById(id);

      if (!comment) {
        return notFound(res, "Comment not found");
      }

      return ok(res, comment);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async getByQuestionId(req, res) {
    try {
      const questionId = parseInt(req.params.id, 10);
      const result = await CommentModel.getByQuestionId(questionId);
      return ok(res, { questionId, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async getByAnswerId(req, res) {
    try {
      const answerId = parseInt(req.params.id, 10);
      const result = await CommentModel.getByAnswerId(answerId);
      return ok(res, { answerId, ...result });
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const { userId, questionId, answerId, body } = req.body;

      if (!userId || !body || (!questionId && !answerId)) {
        return badRequest(res, "userId, body, and questionId or answerId required");
      }

      const comment = await CommentModel.create(userId, questionId, answerId, body);
      return created(res, comment);
    } catch (err) {
      return serverError(res, err);
    }
  }
}
