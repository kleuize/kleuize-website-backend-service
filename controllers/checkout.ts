import { Request, Response } from "express";
import { Document } from "mongoose";
//@ts-ignore
import * as Checkout from "../services/iyzipay/methods/currentPaymentMethod/checkout.ts";
import User from "../models/user";
import Course from "../models/Course";
//@ts-ignore
import Iyzipay from "iyzipay";
import { nanoid } from "nanoid";
import { CompletePayment } from "../utils/completePayments";
import { ICourseModel, IUserDocument } from "../types";

export const chechoutController = async (req: Request, res: Response) => {
  let result = await Checkout.getFormPayment({
    locale: "tr",
    converSationId: nanoid(),
    token: req.body.token,
  });
  await CompletePayment(result);
  res.json(result);
};

export const chechoutInitialize = async (req: any, res: Response) => {
  const { city, country, address, zipCode, courseId } = req.body;

  let user = await User.findById(req.auth._id).exec();
  //@ts-ignore
  const course: ICourseModel = await Course.find({ courseId });

  const paidPrice = course.price * 1.2;

  const data = {
    locale: "tr",
    conversationId: nanoid(),
    price: course.price,
    paidPrice: paidPrice,
    currency: "TRY",
    installment: "1",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    enabledInstallments: [1, 2, 3, 6, 9],
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `http://localhost:5000/checkout/complete/payment`,
    buyer: {
      id: user._id,
      name: user.name,
      surname: user.surName,
      email: user.email,
      identityNumber: " 74300864791",
      registrationAddress: address,
      ip: "85.127.1.1",
      city: city,
      country: country,
      zipCode: zipCode,
    },
    shippingAddress: {
      contactName: user.name + " " + user.surName,
      city: city,
      country: country,
      address: address,
      zipCode: zipCode,
    },
    billingAddress: {
      contactName: user.name + " " + user.surName,
      city: city,
      country: country,
      address: address,
      zipCode: zipCode,
    },
    basketItems: {
      id: course._id,
      name: course.name,
      category1: course.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
      price: course.price,
    },
  };

  let result = await Checkout.initializeCheckoutPayment(data);
  console.log(result);
  //@ts-ignore
  res.json(result.chechoutFormContent);

  const html = `<!DOCTYPE html>
<html>
<head>
<title>Ödeme Yap</title>
<meta charset="UTF-8" />

</head>
</html>
`;
};

// ${result?.checkoutFormContent}
