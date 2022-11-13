import { Types } from "mongoose";

import PaymentFailed from "../models/paymentFailed";
import PaymentsSuccess from "../models/paymentSuccess";


const CompletePayment = async result => {
    if (result?.status === "success") {
      await _carts.default.updateOne({
        _id: Types.ObjectId(result?.basketId)
      }, {
        $set: {
          completed: true
        }
      });
      await PaymentsSuccess.create({
        status: result.status,
        cartId: result?.basketId,
        conversationId: result?.conversationId,
        currency: result?.currency,
        paymentId: result?.paymentId,
        price: result?.price,
        paidPrice: result?.paidPrice,
        itemTransactions: result?.itemTransactions.map(item => {
          return {
            itemId: item?.itemId,
            paymentTransactionId: item?.paymentTransactionId,
            price: item?.price,
            paidPrice: item?.paidPrice
          };
        }),
        log: result
      });
    } else {
      await PaymentFailed.create({
        status: result?.status,
        conversationId: result?.conversationId,
        errorCode: result?.errorCode,
        errorMessage: result?.errorMessage,
        log: result
      });
    }
  };
  
  exports.CompletePayment = CompletePayment;