import { Schema, model } from "mongoose";
import { IOrderModel } from "../types";

const OrderSchema = new Schema<IOrderModel>(
  {
    userId: { type: String, required: true },
    lectures: [
      {
        lectureId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default model<IOrderModel>("Order", OrderSchema);
