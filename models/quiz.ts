import { Schema, model, Types, Document } from "mongoose";

export type QuizDocument = Document & {
  title: string;
  description: string;
  questions: QuestionDocument["_id"];
};

export const QuizSchema: Schema = new Schema<QuizDocument>(
  {
    title: {
      type: String,
      required: [true, "Please add a title!"],
      trim: true,
      maxlength: [50, "Title can not be more than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [50, "Description can not be more than 50 characters"],
    },
    questions: {
      type: [{ type: Schema.Types.ObjectId, ref: "Question" }],
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

QuizSchema.set("toJSON", {
  virtuals: true,
});

export type AnswerDocument = Document & {
  text: string;
  isCorrect: boolean;
};

const AnswerSchema: Schema = new Schema<AnswerDocument>({
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
});

AnswerSchema.set("toJSON", {
  virtuals: true,
});

export type QuestionDocument = Document & {
  content: string;
  answers: AnswerDocument["_id"];
};

const QuestionSchema: Schema = new Schema<QuestionDocument>({
  content: {
    type: String,
    required: [true, "Please add a content!"],
    trim: true,
    maxlength: [50, "Content can not be more than 50 characters"],
  },
  answers: {
    type: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    validate: {
      validator: (value: Array<AnswerDocument>) => {
        return value && value.length === 4;
      },
      message: "Answers length should be 4!",
    },
  },
});

QuestionSchema.set("toJSON", {
  virtuals: true,
});

export const Quiz = model<QuizDocument>("Quiz", QuizSchema);
export const Question = model<QuestionDocument>("Question", QuestionSchema);
export const Answer = model<AnswerDocument>("Answer", AnswerSchema);
