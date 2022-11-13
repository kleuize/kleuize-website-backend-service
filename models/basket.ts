import { Schema, Types, model } from "mongoose";

interface IBasketDocument {
  completed: boolean;
  buyer: any;
  products: any;
  currency: "TRY" | "USD" | "EUR";
}
const BasketSchema: Schema = new Schema<IBasketDocument>(
  {
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    buyer: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [Types.ObjectId],
      ref: "Course",
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "TRY",
      enum: ["TRY", "USD", "EUR"],
    },
  },
  { timestamps: true }
);

export default model<IBasketDocument>("Basket", BasketSchema);
