import { Schema, model } from "mongoose";
import { ILectureModel } from "../types";

const LectureSchema = new Schema<ILectureModel>({
  lectureTitle: String,
  lectureContent: String,
  lecturePrice: Number,
  lectureOldPrice: Number,
  image: String,
  rating: Number,
  tag: String,
  instructor: String,
});

export default model<ILectureModel>("lecture", LectureSchema);
