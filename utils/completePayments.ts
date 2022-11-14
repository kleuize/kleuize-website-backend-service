import { Types } from "mongoose";
import Basket from "../models/basket";
import PaymentFailed from "../models/paymentFailed";
import PaymentsSuccess from "../models/paymentSuccess";

const { ObjectId } = Types;

export const CompletePayment = async (result: any) => {
  if (result?.status === "success") {
    await Basket.updateOne(
      {
        //@ts-ignore
        _id: ObjectId(result?.basketId),
      },
      {
        $set: {
          completed: true,
        },
      }
    );
    await PaymentsSuccess.create({
      status: result.status,
      cartId: result?.basketId,
      conversationId: result?.conversationId,
      currency: result?.currency,
      paymentId: result?.paymentId,
      price: result?.price,
      paidPrice: result?.paidPrice,
      itemTransactions: result?.itemTransactions.map((item: any) => {
        return {
          itemId: item?.itemId,
          paymentTransactionId: item?.paymentTransactionId,
          price: item?.price,
          paidPrice: item?.paidPrice,
        };
      }),
      log: result,
    });
  } else {
    await PaymentFailed.create({
      status: result?.status,
      conversationId: result?.conversationId,
      errorCode: result?.errorCode,
      errorMessage: result?.errorMessage,
      log: result,
    });
  }
};

