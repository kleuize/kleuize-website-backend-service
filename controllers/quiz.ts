import { Request, Response } from "express";
import AWS from "aws-sdk";
import Course from "../models/course";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { readFileSync } from "fs";
import User from "../models/user";
import Completed from "../models/completed";
import stripe from "stripe";
import { validationResult } from "express-validator";
import { QuestionDocument, AnswerDocument } from "../types"


export const getQuizResult = async (req: Request, res: Response) => {
    const { selectedAnswers} = req.body;
    const { slug, quizId } = req.params;
    
    try {
      const course = await Course.findOne({ slug }).exec();
      const Alllesson = course.lessons;
      //@ts-ignore
      const singleQuiz = Alllesson.forEach((element: any) =>
        element.quiz
          .filter((id: any) => id._id === quizId)
          .map((singleQuizItem: any) => singleQuizItem)
      );

      console.log("singleQuiz", singleQuiz)
  
      const { questions } = singleQuiz;
  
      console.log("question", questions)
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
      res.json(score);
    } catch (err) {
      console.log(err);
    }
  };
  