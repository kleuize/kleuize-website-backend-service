import { Schema, model } from "mongoose";
import {
  ILessonModel,
  ICourseModel,
  AnswerDocument,
  QuestionDocument,
  QuizDocument,
} from "../types";

const answerSchema: Schema = new Schema<AnswerDocument>(
  {
    text: {
      type: String,
      required: [true, "Please add a text!"],
      trim: true,
      maxlength: [50, "Text can not be more than 50 characters"],
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const questionSchema = new Schema<QuestionDocument>(
  {
    content: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    answers: {
      type: [answerSchema],
      validate: {
        validator: (value: Array<AnswerDocument>) => {
          return value && value.length === 4;
        },
        message: "Answers length should be 4!",
      },
    },
  },
  { timestamps: true }
);

const quizSchema: Schema = new Schema<QuizDocument>(
  {
    quizTitle: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (value: Array<QuestionDocument>) => {
          return value && value.length >= 1 && value.length <= 10;
        },
        message: "Questions length should be between 1 and 10!",
      },
    },
  },
  { timestamps: true }
);

const lessonSchema: Schema = new Schema<ILessonModel>(
  {
    lessonTitle: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    quiz: [quizSchema],
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseSchema: Schema = new Schema<ICourseModel>(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      minlength: 200,
      required: true,
    },
    price: {
      type: Number,
      default: 9.99,
    },
    image: {},
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

export default model<ICourseModel>("Course", courseSchema);
