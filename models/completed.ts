import { Schema, model, Types } from "mongoose";

const completedSchema = new Schema(
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

export default model("Completed", completedSchema);
