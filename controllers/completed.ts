import { Request, Response } from "express";
import Completed from "../models/completed";

export const markCompleted = async (req: any, res: Response) => {
  const { courseId, quizId, score } = req.body;
  // find if user with that course is already created
  const existing = await Completed.findOne({
    user: req.auth._id,
    course: courseId,
  }).exec();

  if (existing) {
    // update
    const updated = await Completed.findOneAndUpdate(
      {
        user: req.auth._id,
        course: courseId,
      },
      {
        $addToSet: { quiz: { score, quizId } },
      }
    ).exec();
    res.json({ ok: true });
  } else {
    // create
    const created = await new Completed({
      user: req.auth._id,
      course: courseId,
      quiz: { score, quizId },
    }).save();
    res.json({ ok: true });
  }
};

export const listCompleted = async (req: any, res: Response) => {
  try {
    const list = await Completed.findOne({
      user: req.auth._id,
      course: req.body.courseId,
    }).exec();
    list && res.json(list.quiz);
  } catch (err) {
    console.log(err);
  }
};
