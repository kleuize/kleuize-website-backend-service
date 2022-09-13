import { IUserModel } from "../types";
import { Schema, model } from "mongoose";

const UserSchema = new Schema<IUserModel>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
  },
  { timestamps: true }
);

export default model<IUserModel>("User", UserSchema);
