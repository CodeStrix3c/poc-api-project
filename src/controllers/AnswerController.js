import { AnswerModel } from "../models/AnswerModel.js";
import {
  ok,
  created,
  notFound,
  serverError,
  badRequest,
} from "../utils/responseHandler.js";

export class AnswerController {
  static async getByQuestionId(req, res) {
    try {
      const questionId = parseInt(req.params.id, 10);
      const { sort = "votes", order = "DESC" } = req.query;
      const answers = await AnswerModel.getByQuestionId(questionId, sort, order);

      return ok(res, answers);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async create(req, res) {
    try {
      const questionId = parseInt(req.params.id, 10);
      const { body, userId } = req.body;

      if (!body || !userId) {
        return badRequest(res, "body and userId required");
      }

      const answer = await AnswerModel.create(questionId, userId, body);
      return created(res, answer);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static async accept(req, res) {
    try {
      const answerId = parseInt(req.params.id, 10);
      const result = await AnswerModel.accept(answerId);

      if (!result) {
        return notFound(res, "Answer not found");
      }

      return ok(res, result);
    } catch (err) {
      return serverError(res, err);
    }
  }
}
