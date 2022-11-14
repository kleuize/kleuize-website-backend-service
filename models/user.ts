import { IUserDocument } from "../types";
import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    surName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    city: {
      type: String,
      trim: true,
      required: false,
    },
    country: {
      type: String,
      trim: true,
      required: false,
    },
    registrationAddress: {
      type: String,
      trim: true,
      required: false,
    },
    identifyNumber: {
      type: String,
      required: false,
      default: "11111111111",
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    passwordResetCode: {
      data: String,
      default: "",
    },
    ip: {
      type: String,
      default: "85.83.78.112",
    },
    cardUserKey: {
      type: String,
      unique: true,
    },
    courses: [{ type: Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;
        return {
          ...ret,
        };
      },
    },
  }
);

export default model<IUserDocument>("User", UserSchema);
