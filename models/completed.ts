import { Schema, model, Types } from "mongoose";

type CompletedDocument = {
  user: any,
  course: any;
  lessons: any[],
}

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
    lessons: [],
  },
  { timestamps: true }
);

export default model<CompletedDocument>("Completed", completedSchema);
