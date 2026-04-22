/**
 * Answers Controller - handles answer-related requests
 */

import { AnswerModel } from "../models/AnswerModel.js";
import { ok, created, notFound, serverError, badRequest } from "../utils/responseHandler.js";

export class AnswerController {
  static getByQuestionId(req, res) {
    try {
      const qId = parseInt(req.params.id);
      const { sort = "votes", order = "DESC" } = req.query;

      const replies = AnswerModel.getByQuestionId(qId, sort, order);
      return ok(res, replies);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static create(req, res) {
    try {
      const qId = parseInt(req.params.id);
      const { body, userId } = req.body;

      if (!body || !userId) return badRequest(res, "body and userId required");

      const answer = AnswerModel.create(qId, userId, body);
      return created(res, answer);
    } catch (err) {
      return serverError(res, err);
    }
  }

  static accept(req, res) {
    try {
      const aId = parseInt(req.params.id);
      const result = AnswerModel.accept(aId);

      if (!result) return notFound(res, "Answer not found");
      return ok(res, result);
    } catch (err) {
      return serverError(res, err);
    }
  }
}
