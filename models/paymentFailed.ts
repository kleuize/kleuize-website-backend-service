import { Schema, model } from "mongoose";

interface IPaymentFailedDocument {
  status: string;
  paymentTransactionId: string;
  conversationId: string;
  errorCode: string;
  errorMessage: string;
  log: Schema.Types.Mixed;
}

const PaymentFailedSchema: Schema = new Schema<IPaymentFailedDocument>(
  {
    status: {
      type: String,
      required: true,
      enum: ["failure"],
    },
    conversationId: {
      type: String,
      required: false,
    },
    errorCode: {
      type: String,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    log: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IPaymentFailedDocument>(
  "PaymentFailed",
  PaymentFailedSchema
);
