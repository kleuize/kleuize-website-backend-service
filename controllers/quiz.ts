import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { nanoid } from "nanoid";
import {
  Quiz,
  Question,
  Answer,
  QuestionDocument,
  AnswerDocument,
} from "../models/quiz";
import { asyncHandler } from "../middlewares/index";

export const getQuizzes = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const quizzes = await Quiz.find({}).populate({
    path: "questions",
    populate: {
      path: "answers",
    },
  });

  return res.json(quizzes);
};

export const getQuizByCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const quiz = await Quiz.findOne({ code: req.params.quizCode }).populate({
    path: "questions",
    populate: {
      path: "answers",
      select: "-isCorrect", // We hide the isCorrect field so the user can't know the correct answer from the frontend
    },
  });

  if (!quiz) {
    return res.status(404).json("Quiz not found!");
  }

  return res.json(quiz);
};

export const createQuizzes = async (req: any, res: Response) => {
    // console.log("CREATE COURSE", req.body);
    // return;
    try {
      const alreadyExist = await Quiz.findOne({
        slug: slugify(req.body.name.toLowerCase()),
      });
      if (alreadyExist) return res.status(400).send("Title is taken");
  
      const quiz = await new Quiz({
        slug: slugify(req.body.name),
        instructor: req.auth._id,
        ...req.body,
      }).save();
  
      res.json(quiz);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Quiz create failed. Try again.");
    }
  };

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, questions, selectedAnswers } = req.body;

  // Looping through quesions
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    // Looping through quesion's answers
    let { answers } = question;

    // If none of the answers was selected as the correct answer, we select the first one as the correct one
    let noSelectedAnswer = false;

    for (let j = 0; j < answers.length; j++) {
      const answer = answers[j];

      // If the selected answer id is included in the selectedAnswers array, we make it correct
      if (selectedAnswers.includes(answer._id)) {
        noSelectedAnswer = true;
        answers[j].isCorrect = true;
      }
    }

    if (!noSelectedAnswer) {
      answers[0].isCorrect = true;
    }

    // We create the answers
    answers = await Answer.create(answers);

    // We add the answers to the question
    questions[i].answers = [...answers];
  }

  const createdQuestions = await Question.create(questions);

  const code = nanoid();

  // Creating Quiz
  await Quiz.create({
    title,
    description,
    code,
    questions: createdQuestions,
  });

  return res.json(code);
});

export const getQuizResult = asyncHandler(
  async (req: Request, res: Response) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findOne({ code: req.params.quizCode }).populate({
      path: "questions",
      populate: {
        path: "answers",
      },
    });

    if (!quiz) {
      return res.status(404).json("Quiz not found!");
    }

    const { selectedAnswers } = req.body;
    const { questions } = quiz;

    let correctAnswersCount = 0;

    questions.forEach((question: QuestionDocument, questionIndex: number) => {
      // We check if the selected answer equals one of the answers, if yes, we increment the correctAnswers count
      const { answers } = question;
      for (let index = 0; index < answers.length; index++) {
        const answer: AnswerDocument = answers[index];
        const isSelected = selectedAnswers[questionIndex] === answer.id;

        if (isSelected) {
          // If the selected answer is correct, we increase the count
          if (answer.isCorrect) {
            correctAnswersCount++;
          }

          break;
        }
      }
    });

    const score = Math.round((100 * correctAnswersCount) / questions.length);

    return res.json(score);
  }
);
function slugify(name: any) {
    throw new Error("Function not implemented.");
}

