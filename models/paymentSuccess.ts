import { Schema, model, Types } from "mongoose";

interface IItemTransactionDocument {
  courseId: any;
  paymentTransactionId: string;
  price: number;
  paidPrice: number;
}
interface IPaymentSuccessDocument {
  status: string;
  paymentTransactionId: string;
  conversationId: string;
  currency: "TRY" | "USD" | "EUR";
  paymentId: number;
  price: number;
  paidPrice: number;
  ItemTransactions: Array<IItemTransactionDocument>;
  log: Schema.Types.Mixed;
}

const ItemTransactionSchema: Schema = new Schema<IItemTransactionDocument>({
  courseId: {
    type: Types.ObjectId,
    ref: "Course",
    required: true,
  },
  paymentTransactionId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paidPrice: {
    type: Number,
    required: true,
  },
});

const PaymentSuccessSchema: Schema = new Schema<IPaymentSuccessDocument>(
  {
    status: {
      type: String,
      required: true,
      enum: ["success"],
    },
    conversationId: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: true,
      enum: ["TRY", "USD", "EUR"],
    },
    paymentId: {
      type: Number,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paidPrice: {
      type: Number,
      required: true,
    },
    ItemTransactions: [ItemTransactionSchema],
    log: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IPaymentSuccessDocument>(
  "PaymentsSuccess",
  PaymentSuccessSchema
);
