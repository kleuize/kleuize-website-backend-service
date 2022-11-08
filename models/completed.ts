import { Schema, model, Types } from "mongoose";

type CompletedDocument = {
  user: any;
  course: any;
  quiz: any;
};

type quizDocument = {
  score: number;
  quizId: string;
};

const quizSchema: Schema = new Schema<quizDocument>(
  {
    score: { type: Number },
    quizId: { type: String },
  },
  { timestamps: true }
);
const completedSchema: Schema = new Schema<CompletedDocument>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },

    course: {
      type: Types.ObjectId,
      ref: "Course",
    },
    quiz: [quizSchema],
  },
  { timestamps: true }
);

export default model<CompletedDocument>("Completed", completedSchema);
