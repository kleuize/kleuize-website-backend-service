import { Schema, model, Types } from "mongoose";

type CompletedDocument = {
  user: any;
  course: any;
  quiz: any;
};

type LessonDocument = {
  quiz: any;
  id: any;
  quizTitle: string,
};

const lessonSchema: Schema = new Schema<LessonDocument>(
  {
    quizTitle: { type: String },
    quiz: [],
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
    quiz: []
  },
  { timestamps: true }
);

export default model<CompletedDocument>("Completed", completedSchema);
