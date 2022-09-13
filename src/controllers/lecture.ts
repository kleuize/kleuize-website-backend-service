import { Request, Response } from "express";
import Lecture from "../models/lecture";

export const getAllLectures = async (req: Request, res: Response) => {
  const lectures = await Lecture.find();
  try {
    return res.status(200).json(lectures);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

export const getLectureDetails = async (req: Request, res: Response) => {
    const lecturesDetails = await Lecture.find()
}

export const createLecture = async (req: Request, res: Response) => {
  const lectureToCreate = await Lecture.create(req.body);
  try {
    return res.status(201).json(lectureToCreate);
  } catch (error) {
    return res.status(500).json({ msg: "Couldn't create the lecture" });
  }
};
