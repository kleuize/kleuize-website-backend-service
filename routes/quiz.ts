import express from "express";
import { Router } from "express";
import { check, checkSchema } from "express-validator";
import { quizSchema } from "../utils/quizValidators";
import {
  getQuizzes,
  createQuiz,
  getQuizByCode,
  getQuizResult,
} from "../controllers/quiz";

const router: Router = express.Router();

// @route GET quizzes/
// @desc Gets quizzes
// @access Public
router.get("/quiz/", getQuizzes);

// @route POST quizzes/
// @desc creates a quiz
// @access Public
router.post("/quiz/", checkSchema(quizSchema), createQuiz);

// @route GET quizzes/:quizCode
// @desc Gets a quiz by code
// @access Public
router.get("/quiz/:quizCode", getQuizByCode);

// @route GET quizzes/result/:quizCode
// @desc Gets a quiz result by code
// @access Public
router.post(
  "/quiz/result/:quizCode",
  check("selectedAnswers", "Selected answers must be an array").isArray(),
  getQuizResult
);

module.exports = router;
